from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class Profile(models.Model):
    ROLE_CHOICES=[
        ('customer', 'Customer'),
        ('support_agent', 'Support Agent'),
        ('admin', 'Admin')
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=100)
    middle_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    customer_id = models.IntegerField(blank=True,null=True)
    passport_number= models.CharField(max_length=100,blank=True,null=True)
    photo = models.ImageField(default='default.jpg', upload_to='profile/', null=True, blank=True)
    role = models.CharField(max_length=20,choices=ROLE_CHOICES, default='customer')

    def __str__(self):
        return f"{self.user.username} = {self.get_role_display()}"

class Airlines(models.Model):
    name = models.CharField(max_length=100)
    country = models.CharField(max_length=100,blank=True, null=True)
    logo = models.ImageField(upload_to='profile/',blank=True, null=True)
    iata_code = models.CharField(max_length=10, blank=True, null=True)

    def __str__(self):
        return self.name 
class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    airline = models.ForeignKey('Airlines', on_delete=models.CASCADE)
    flight_number = models.CharField(max_length=20)
    departure_airport = models.CharField(max_length=100)
    arrival_airport = models.CharField(max_length=100)
    departure_time = models.DateTimeField(null=True,blank=True)
    booking_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}  - {self.flight_number}" 
class SupportTicket(models.Model):
    STATUS_CHOICES = [
        ('open', 'open'),
        ('In progress', 'In progress'),
        ('Resolved', 'Resolved'),
        ('Closed', 'Closed'),
    ]

    CATEGORY_CHOICES = [
        ('Booking Issue', 'Booking Issue'),
        ('Refund Request', 'Refund Reqiest'),
        ('Baggage Inquiry', 'Baggage Inquiry'),
        ('Flight Change', 'Flight Change'),
        ('Other', 'Other'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    airline = models.ForeignKey(Airlines, on_delete=models.CASCADE)
    flight = models.ForeignKey(Booking, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=50,choices=CATEGORY_CHOICES, default='Other')
    status = models.CharField(max_length=20,choices=STATUS_CHOICES, default='open')
    response = models.TimeField(null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Ticket #{self.id} - {self.title}  ({self.status})"

    
