import stripe
import os
from django.conf import settings
import requests
import base64
from datetime import datetime

stripe.api_key = os.getenv("STRIPE_SECRET_KEY") or getattr(settings, 'STRIPE_SECRET_KEY')
if not stripe.api_key:
    raise ValueError("STRIPE_SECRET_KEY in env is not correct or settings")

def create_payment_intent(amount_cents, user=None):
    return stripe.PaymentIntent.create(
        amount = amount_cents,
        currency = "usd",
        metadata = {
            "Integration_check":"accept_a_payment",
            "user":user.username if user else "guest"
            },
    )

def get_paypal_access_token():
    auth = (settings.PAYPAL_CLIENT_ID, settings.PAYPAL_SECRET)
    headers = {'Accept':'application/json', 'Accept_Language':'en_us'}
    data = {'grant_type':'client_credentials'}

    response = requests.post(
        f"{settings.PAYPAL_API_BASE}v1/oauth2/token",
        headers = headers,
        data = data,
        auth = auth
    )
    response.raise_for_status()
    return response.json()['access_token']

def create_paypal_order(amount, currency="USD"):
    token = get_paypal_access_token()
    headers = {
        "Content-Type":"application/json",
        "Authorization":f"Bearer {token}",
    }

    data = {
        "intent": "CAPTURE",
        "purchase_units":[{
            "amount":{
                "currency_code":currency,
                "value":f"{amount:.2f}"
            }
        }]
    }
    response = requests.post(
        f"{settings.PAYPAL_API_BASE}v2/checkout/orders",
        headers = headers,
        json = data
    )
    response.raise_for_status()
    return response.json()

def get_access_token():
    consumer_key = os.getenv("MPESA_CONSUMER_KEY")
    consumer_secret = os.getenv("MPESA_CONSUMER_SECRET")
    auth_url = getattr(settings, 'MPESA_BASE_URL', None)
    if not auth_url:
        raise ValueError("MPESA_BASE_URL is not set. Check your .env or settings.py")

    auth_url = f"{auth_url}/oauth/v1/generate?grant_type=client_credentials"


    response = requests.get(auth_url, auth=(consumer_key, consumer_secret))
    response.raise_for_status()
    return response.json()['access_token']

def lipa_na_mpesa(phone_number, amount):
    access_token = get_access_token()

    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    shortcode = os.getenv("MPESA_SHORTCODE")
    passkey = os.getenv("MPESA_PASSKEY")
    password = base64.b64encode(f"{shortcode}{passkey}{timestamp}".encode()).decode()

    headers = {"Authorization":f"Bearer {access_token}"}
    payload = {
        "BusinessShortCode": shortcode,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": amount,
        "PartyA": phone_number,
        "PartyB": shortcode,
        "PhoneNumber": phone_number,
        "CallBackURL": os.getenv("MPESA_CALLBACK_URL"),
        "AccountReference": "Test123",
        "TransactionDesc": "Payment for Fashion Marketplace"
    }

    url = f"{settings.MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest"
    response = requests.post(url, headers=headers, json=payload)
    return response.json()


