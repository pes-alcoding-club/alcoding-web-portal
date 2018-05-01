from django.db import models

# Create your models here.
from django.db import models


# Create your models here.
class UserModel(models.Model):
    name = models.CharField(max_length=120)
    email = models.EmailField()
    phone = models.CharField(max_length=12)
    dob = models.DateField(verbose_name="date of birth")
    password = models.CharField(max_length=50)
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
