from rest_framework import serializers 
from .models import Products, Category, Cart, CartItem, Order, OrderItem,User
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken

class CategorySerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']


class ProductsSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    

    
    class Meta:
        model = Products
        fields = ['id','category', 'name', 'description', 'price', 'stock','size','color', 'image']

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductsSerializer(read_only=True)

    class Meta:
        model = CartItem
        fields = ['cart', 'product', 'quantity']

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(source='cartitem_set', many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ['id','user','items', 'created_at']


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductsSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'order', 'product', 'quantity', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(source='orderitem_set', many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'order_date', 'shipping_address', 'status', 'items']

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

