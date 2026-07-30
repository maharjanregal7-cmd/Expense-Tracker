from django.db import models
from django.contrib.auth.models import User

class Expenses(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    CATEGORY_CHOICES = [
        ('food','Food'),
        ('transport','Transport'),
        ('entertainment','Entertainment'),
        ('bills','Bills'),
        ('shopping','Shopping'),
        ('other','Other'),
    ]
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    date = models.DateField()
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.title} - ${self.amount}"
    
    class Meta:
        ordering = ['-date']