from django.contrib import admin
from .models import Airlines,Booking,Profile

# Register your models here.
admin.site.register(Airlines)
admin.site.register(Booking)
admin.site.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'role')
    list_filter = ('role',)

