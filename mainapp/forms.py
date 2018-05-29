from django import forms
from .models import UserModel


class SignUpForm(forms.ModelForm):
    class Meta:
        model = UserModel
        fields = ['name', 'email', 'dob', 'phone', 'password']
