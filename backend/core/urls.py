# Core app routes
from django.urls import path
from .authentication import login_view
from .views import student_list_create, student_detail, stats_view, export_csv_view

urlpatterns = [
    path('login/', login_view, name='login'),
    path('students/', student_list_create, name='student_list_create'),
    path('students/<int:pk>/', student_detail, name='student_detail'),
    path('stats/', stats_view, name='stats'),
    path('export/csv/', export_csv_view, name='export_csv'),
]
