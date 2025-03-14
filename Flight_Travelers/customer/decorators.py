from django.http import HttpResponseForbidden
from .models import Profile

def role_required(roles=[]):
    def decorator(view_func):
        def wrapper(request, *args, **kwargs):
            profile = Profile.objects.get(user=request.user)
            if profile.role  not in roles:
                return HttpResponseForbidden("You are not authorized to access this page.")
            return view_func(request, *args, **kwargs)
        return wrapper
    return decorator