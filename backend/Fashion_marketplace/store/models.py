from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class ShippingAddress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    address = models.TextField()
    city = models.CharField(max_length=50)
    county = models.CharField(max_length=50)
    landmark = models.CharField(max_length=100, blank=True,help_text="Nearby building,shop or bus stop")
    country = models.CharField(max_length=50, default='Kenya')

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} - {self.address}"


class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name

class Products(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="products")
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField()
    size = models.CharField(max_length=20, blank=True, null=True)
    color = models.CharField(max_length=20, blank=True, null=True)
    image = models.ImageField(default= 'default.jpg', upload_to='product_images/', null=True, blank=True)
    date_uploaded= models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    #items = models.CharField(max_length=100, blank=True,null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    

    def __str__(self):
        return f"Cart  ({self.user.username})"

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="cart_items")
    product = models.ForeignKey(Products, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} X {self.product.name}"

class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    order_date = models.DateTimeField(auto_now_add=True)
    shipping_address = models.ForeignKey(ShippingAddress, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    

    def __str__(self):
        return f"Order #{self.id} by {self.user.username}"
    

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Products, on_delete= models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} X {self.product.name}"

