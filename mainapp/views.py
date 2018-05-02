from django.shortcuts import render
from django.contrib.auth.hashers import make_password
from .models import UserModel
from .forms import SignUpForm
from django.http import HttpResponse


# Create your views here.
def index(request):
    if request.method == "POST":
        form = SignUpForm(request.POST)
        if form.is_valid():
            name = form.cleaned_data['name']
            email = form.cleaned_data['email']
            dob = form.cleaned_data['dob']
            phone = form.cleaned_data['phone']
            password = form.cleaned_data['password']
            user = UserModel(name=name, email=email, dob=dob, phone=phone, password=make_password(password))
            user.save()
            return HttpResponse('User added to db.')

    else:
        form = UserModel()

    return render(request, 'index.html', {'form': form})
