from django.contrib import admin
from django.urls import path, include, re_path
from django.http import JsonResponse
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

def api_root(request):
    return JsonResponse({
        "message": "Welcome to Boris' Productivity Tool API",
        "endpoints": {
            "admin": "/admin/",
            "api": "/api/",
            "dashboard": "/api/dashboard/",
            "tasks": "/api/tasks/",
            "auth": "/api/auth/"
        }
    })

schema_view = get_schema_view(
    openapi.Info(
        title="Task Manager API",
        default_version='v1',
        description="API documentation for your task management system",
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    path('',       api_root, name='api-root'),
    path('admin/', admin.site.urls),
    path('api/',   include('tasks.urls')),

     # Swagger UI
    re_path(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0)),

    # Redoc (alternative UI)
    re_path(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0)),
]
