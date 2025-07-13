from rest_framework import serializers 
from .models import Products, Category, Cart, CartItem, Order, OrderItem,ShippingAddress
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.mail import send_mail
from django.conf import settings
from .utils import send_sms

class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = '__all__'
        read_only_fields = ['user']

    def validate_phone(self,value):
        if len(value) < 10:
            raise serializers.ValidationError("Please input a valid phone number")
        return value


class CategorySerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']


class ProductsSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    image = serializers.SerializerMethodField()

    def get_image(self, obj):
        return obj.image.url if obj.image else ""
    

    
    class Meta:
        model = Products
        fields = ['id','category', 'name', 'description', 'price', 'stock','size','color', 'image']

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductsSerializer(read_only=True)

    class Meta:
        model = CartItem
        fields = ['cart', 'product', 'quantity']

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(source='cart_items', many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ['id','items', 'created_at']


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductsSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'order', 'product', 'quantity', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer( many=True, read_only=True)
    shipping_address = ShippingAddressSerializer(write_only=False)

    class Meta:
        model = Order
        fields = ['id', 'user', 'order_date', 'shipping_address', 'status','items' ]
        read_only_fields = ['id', 'user','order_date', 'status','items' ]

    def create(self, validated_data):
        user = self.context['request'].user
        shipping_data = validated_data.pop('shipping_address')
        shipping_address = ShippingAddress.objects.create(user=user, **shipping_data)
        cart_items = CartItem.objects.select_related('product').filter(cart__user=user)

        if not cart_items.exists():
            raise serializers.ValidationError("Cart is empty")

        order = Order.objects.create(user=user, shipping_address=shipping_address, status="pending")

        for item in cart_items:
            product = item.product
            if product.stock < item.quantity:
                raise serializers.ValidationError(f"Insufficient stock for {product.name}")

            OrderItem.objects.create(
                order = order,
                product = product,
                quantity = item.quantity,
                price = product.price
            )

            product.stock -= item.quantity
            product.save()

        cart_items.delete()
        send_mail(
            subject='Order Confirmation',
            message=f"Thank you {user.username} for your order, \n\nWe will deliver to: {shipping_address.address}, {shipping_address.city}.\n\nStatus: {order.status}'",
            from_email=settings.DEFAULT_FROM_EMAIL, 
            recipient_list=False
          )
          #Send SMS
        #phone = shipping_address.phone
        #message = f"Thank you {user.username} for your order, \n\nWe will deliver to: {shipping_address.address}, {shipping_address.city}.\n\nStatus: {order.status}'"
        #send_sms(phone,message)
        return order 

        


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username = validated_data['username'],
            password = validated_data['password'],
            email = validated_data['email']
        )
        return user

    def to_representation(self, instance):
        refresh = RefreshToken.for_user(instance)
        return {
            "message": "User registered successfully",
            "access": str(refresh.access_token),
            "refresh":str(refresh),
        }

class OrderCheckoutSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True )
    total = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ['id', 'user', 'order_date', 'shipping_address', 'status','items','total']

    def get_total(self, obj):
        
        return sum(item.quantity * item.price for item in obj.items.all())


