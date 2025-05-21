from django.shortcuts import render
from rest_framework import generics, permissions
from .models import Products,Category,Cart,CartItem
from .serializers import ProductsSerializer,CategorySerializer,CartSerializer,RegisterSerializer,User
from rest_framework.generics import ListAPIView
from rest_framework.generics import RetrieveAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny



# Create your views here.
class ProductsCreateAPIView(generics.CreateAPIView):
    queryset = Products.objects.all()
    serializer_class = ProductsSerializer
    permission_classes = [permissions.AllowAny]

class CategoryListAPIView(ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class ProductsListAPIView(generics.ListAPIView):
    queryset = Products.objects.all().order_by('date_uploaded')
    serializer_class = ProductsSerializer

class ProductsDetailAPIView(RetrieveAPIView):
    queryset = Products.objects.all()
    serializer_class = ProductsSerializer
    lookup_field = 'id'

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

        item.quantity +=quantity
        item.save()

        return Response({"message":"Added to cart"})

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny] #Allow any user to access the Registration view and create an account
    serializer_class = RegisterSerializer








    
