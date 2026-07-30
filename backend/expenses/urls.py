from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    RegisterView,
    CurrentUserView,
    ExpenseListCreateView,
    ExpenseDetailView
)

urlpatterns = [
    path('register/',RegisterView.as_view(), name='register'),
    path('login/',TokenObtainPairView.as_view(), name='login'),
    path('token/refresh/',TokenRefreshView.as_view(), name='token_refresh'),
    path('user/', CurrentUserView.as_view(),name='current_user'),
    path('expenses/', ExpenseListCreateView.as_view(),name='expense_list'),
    path('expenses/<int:pk>/', ExpenseDetailView.as_view(),name='expense_detail'),
]