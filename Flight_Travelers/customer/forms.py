from django import forms
from .models import SupportTicket

class SupportTicketForm(forms.ModelForm):
    class Meta:
        model = SupportTicket
        fields = ['title', 'description', 'category', 'airline', 'flight']
        widgets = {
            'title':forms.TextInput(attrs={'class':'form-control', 'placeholder':'Enter a title for your issue'}),
            'desription':forms.Textarea(attrs={'class':'form-control', 'placeholder':'Describe your issue......'}),
            'category':forms.Select(attrs={'class':'form-control'}),
            'airline':forms.Select(attrs={'class':'form-control'}),
            'flight':forms.Select(attrs={'class':'form-control'}),
        }
        