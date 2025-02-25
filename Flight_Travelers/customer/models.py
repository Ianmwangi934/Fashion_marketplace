from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=100)
    middle_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    customer_id = models.IntegerField(blank=True,null=True)
    passport_number= models.CharField(max_length=100,blank=True,null=True)
    photo = models.ImageField(default='default.jpg', upload_to='profile/', null=True, blank=True)

class Airlines(models.Model):
    name = models.CharField(max_length=100)
    country = models.CharField(max_length=100,blank=True, null=True)
    logo = models.ImageField(upload_to='profile/',blank=True, null=True)
    iata_code = models.CharField(max_length=10, blank=True, null=True)

    def __str__(self):
        return self.name 
    
