from django.contrib import admin
from .models import Category,Products,Cart,CartItem,Order,OrderItem,ShippingAddress

# Register your models here.
admin.site.register(Category)
admin.site.register(Products)
admin.site.register(Cart)
admin.site.register(CartItem)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(ShippingAddress)

