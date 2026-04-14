from django.urls import path
from .views import (
    RegisterView,
    LoginView,
    LogoutView,
    TaskListCreateView,
    TaskDetailView,
    TaskCompleteView,
    DashboardView,
)

urlpatterns = [
    # Auth
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/',    LoginView.as_view(),    name='login'),
    path('auth/logout/',   LogoutView.as_view(),   name='logout'),

    # Tasks
    path('tasks/',              TaskListCreateView.as_view(), name='task-list'),
    path('tasks/<int:pk>/',     TaskDetailView.as_view(),     name='task-detail'),
    path('tasks/<int:pk>/complete/', TaskCompleteView.as_view(),   name='task-complete'),

    # Dashboard
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
]
