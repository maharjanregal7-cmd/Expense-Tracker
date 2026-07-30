from rest_framework import generics,permissions,filters
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .models import Expenses
from .serializers import UserSerializer,RegisterSerializer,ExpenseSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.data)
        return Response(serializer.data)

class ExpenseListCreateView(generics.ListCreateAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated]

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title','category','description']
    ordering_fields = ['date','amount']

    def get_queryset(self):
        queryset = Expenses.objects.filter(user=self.request.user)
        
        category = self.request.query_params.get('category',None)
        
        if category:
            queryset = queryset.filter(category=category)

        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date',None)

        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        
        if end_date:
            queryset = queryset.filter(date__lte=end_date)
            
        return queryset
    
    def perform_create(self,serializer):
        serializer.save(user=self.request.user)
        
class ExpenseDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Expenses.objects.filter(user=self.request.user)