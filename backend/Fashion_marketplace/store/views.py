from django.shortcuts import render,get_object_or_404
from rest_framework import generics, permissions
from .models import Products,Category,Cart,CartItem,ShippingAddress,Order,OrderItem
from .serializers import ProductsSerializer,CategorySerializer,CartSerializer,RegisterSerializer,ShippingAddressSerializer,OrderSerializer,OrderCheckoutSerializer
from django.contrib.auth.models import User
from rest_framework.generics import ListAPIView
from rest_framework.generics import RetrieveAPIView,CreateAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views import View
from .payments import create_payment_intent,create_paypal_order, lipa_na_mpesa
import traceback
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.utils.decorators import method_decorator
import json
import os


# Create your views here.
class ProductsCreateAPIView(generics.CreateAPIView):
    queryset = Products.objects.all()
    serializer_class = ProductsSerializer
    permission_classes = [permissions.AllowAny]
    

class CategoryListAPIView(ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]
    

class ProductsListAPIView(generics.ListAPIView):
    queryset = Products.objects.all().order_by('date_uploaded')
    serializer_class = ProductsSerializer
    permission_classes = [permissions.AllowAny]

class ProductsDetailAPIView(RetrieveAPIView):
    queryset = Products.objects.all()
    serializer_class = ProductsSerializer
    lookup_field = 'id'
    permission_classes = [permissions.AllowAny]

class CartView(APIView):
    permission_classes = [permissions.IsAuthenticated] #only JWT authenticated user

    def get(self,request):
        cart, created = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

        


class AddToCartView(APIView):
    permission_classes = [permissions.IsAuthenticated] #only JWT authenticated user

    def post(self, request):
        products_id = request.data.get("products_id")
        quantity = int(request.data.get("quantity",1))

        cart, created = Cart.objects.get_or_create(user=request.user)
        product = Products.objects.get(id=products_id)
        item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        if created:
            item.quantity = quantity
        else:
            item.quantity +=quantity
        item.save()

        return Response({"message":"Added to cart"})

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny] #Allow any user to access the Registration view and create an account
    serializer_class = RegisterSerializer

class ShippingAddressView(generics.CreateAPIView):
    serializer_class = ShippingAddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    

class CreateOrderView(CreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def orders(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        order_id = response.data.get("id")
        return Response({"message": "Order created","id": order_id})

        
class UserOrderView(generics.RetrieveAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'
    

    def get_queryset(self):
        qs = Order.objects.filter(user=self.request.user)
        return qs

class OrderCheckoutView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, order_id):
        order = get_object_or_404(Order, id=order_id, user= request.user)
        serializer = OrderCheckoutSerializer(order)
        return Response(serializer.data)

class CreateStripePaymentIntent(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, order_id):
        try:
            order = get_object_or_404(Order, id=order_id, user= request.user)
            order_items = OrderItem.objects.filter(order=order)
            amount = sum(item.product.price * item.quantity for item in order_items)
            amount_cents = int(amount * 100) #convert into dorlars to cents
            if amount_cents < 50:
                return Response({"error":"Minimum amount to intiate payment is $50"}, status=400)
            intent = create_payment_intent(amount_cents, request.user)
            return Response({"clientSecret": intent["client_secret"]})
        except Exception as e:
            traceback.print_exc() 
            return Response({"error":str(e)}, status=500)
class CreatePayPalOrder(APIView):
    permission_classes = [IsAuthenticated]

    def post(self,request, order_id):
        try:
            order = get_object_or_404(Order, id=order_id, user=request.user)
            order_items = OrderItem.objects.filter(order=order)
            amount = sum(item.product.price * item.quantity for item in order_items)

            if amount < 1:
                return Response({"error":"Minimum amount to intiate payment is $1"}, status=400)

            paypal_order = create_paypal_order(amount)

            return Response({
                "id":paypal_order["id"],
                "status":paypal_order["status"],
                "links":paypal_order.get("links", []),
            })

        except Exception as e:
            traceback.print_exc()
            return Response({"error":str(e)}, status=500)

class STKPushView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self,request):
        try:
            phone = request.data.get("phone")
            amount = request.data.get("amount")
            response = lipa_na_mpesa(phone,int(amount))
            return Response(response)

        except Exception as e:
            traceback.print_exc()
            return Response({"error":str(e)}, status=500)

@method_decorator(csrf_exempt,name='dispatch')
class MpesaCallbackView(APIView):
    permission_classes = []

    def post(self, request):
        try:
            data = json.loads(request.body)
            print("✅ M-PESA CALLBACK RECEIVED:", data)
            # TODO: Update order/payment status based on data['Body']['stkCallback']
            return JsonResponse({"message": "Callback received"}, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
        
class ZohoAbandoneCartView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            user = request.user
            order_id = request.data.get("order_id")
            order = get_object_or_404(Order, id=order_id, user=request.user)
            order_items = OrderItem.objects.filter(order=order)

            products = ", ".join([f"{item.product.name} (x{item.product.quantity})" for item in order_items])
            total = sum([item.product.price * item.product.quantity for item in order_items])

            #Getting access token sing refresh token
            refresh_token = os.getenv("ZOHO_REFRESH_TOKEN")
            client_id = os.getenv("ZOHO_CLIENT_ID")
            client_secret = os.getenv("ZOHO_CLIENT_SECRET")

            token_res = requests.post("https://accounts.zoho.com/oauth/v2/token", data={
                "refresh_token":refresh_token,
                "client_id":client_id,
                "client_secret":client_secret,
                "grant_type":refresh_token
            })
            token = token_res.json().get("access_token")

            #send to zoho as a lead
            headers = {
                "Authorization":f"zoho-oauthtoken {token}",
                "content-type":"application/json"
            }
            payload = {
                "data":[{
                    "Company": "Abandoned Checkout",
                    "Last_Name": user.username,
                    "Email": user.email,
                    "Description": f"Cart: {products}\nTotal: ${total:.2f}",
                    "Lead_Source": "Website Cart"
                }]
            }

            res = requests.post("https://www.zohoapis.com/crm/v2/Leads", headers=headers, json=payload)
            return Response(res.json())

        except Exception as e:
            return Response({"error": str(e)}, status=500)

class mark_order_shipped(APIView):
    permission_classes = [IsAuthenticated]

    def post(self,request, order_id):
        try:
            order = Order.objects.get(id=order_id,user=request.user)
            order.status = "shipped"
            order.save()
            return Response({"message":"Order status updated to shipped"})
        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=500)
    
