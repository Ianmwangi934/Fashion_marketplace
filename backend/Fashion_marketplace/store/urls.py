from django.urls import path
from .views import (
    ProductsCreateAPIView,
    CategoryListAPIView,
    ProductsListAPIView,
    ProductsDetailAPIView,
    CartView,
    AddToCartView,
    RegisterView,
    ShippingAddressView,
    CreateOrderView,
    UserOrderView,
    OrderCheckoutView,
    CreateStripePaymentIntent,
    CreatePayPalOrder,
    STKPushView,
    MpesaCallbackView,
    ZohoAbandoneCartView,
    mark_order_shipped
)
from rest_framework_simplejwt.views import (TokenObtainPairView, TokenRefreshView,)

urlpatterns = [
    path('api/products/create/', ProductsCreateAPIView.as_view(), name = 'product_create'),
    path('api/categories/', CategoryListAPIView.as_view(), name='category_list'),
    path('api/products/',ProductsListAPIView.as_view(), name='product-list'),
    path('products/<int:id>/', ProductsDetailAPIView.as_view(), name='product-detail'),
    path('cart/',CartView.as_view(), name='cart'),
    path('cart/add/',AddToCartView.as_view(), name='add-to-cart'),
    path('register/',RegisterView.as_view(), name='register'),
    path('api/token/', TokenObtainPairView.as_view(), name = 'token-obtain-pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name = 'token-refresh'),
    path('shipping-address/',ShippingAddressView.as_view(), name='shipping-address'),
    path('orders/create/', CreateOrderView.as_view(), name='create-order'),
    path('order/<int:id>/',UserOrderView.as_view(), name='user-orders'),
    path('checkout/<int:order_id>/', OrderCheckoutView.as_view(), name='order-checkout'),
    path('create-payment-intent/<int:order_id>/', CreateStripePaymentIntent.as_view(), name='payment'),
    path('create-paypal-order/<int:order_id>/', CreatePayPalOrder.as_view(), name='create-paypal-order'),
    path('stk-push/', STKPushView.as_view(), name='stk-push'),
    path('mpesa/callback/', MpesaCallbackView.as_view(), name='mpesa-callback'),
    path('abandoned-cart/', ZohoAbandoneCartView.as_view(), name='abandoned-cart'),
    path('order/shipped/<int:order_id>/', mark_order_shipped.as_view(), name='order-shipped')
]