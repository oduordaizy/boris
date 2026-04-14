from django.contrib import admin
from .models import Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'user', 'priority', 'status', 'due_date', 'is_overdue')
    list_filter  = ('status', 'priority', 'category')
    search_fields = ('title', 'description', 'user__username', 'category')
    ordering     = ('-created_at',)
