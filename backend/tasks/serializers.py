from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from .models import Task


# ─── Auth serializers ────────────────────────────────────────────────────────

class RegisterSerializer(serializers.ModelSerializer):
    password  = serializers.CharField(
        write_only=True, 
        validators=[validate_password],
        help_text="Choose a strong password."
    )
    password2 = serializers.CharField(
        write_only=True, 
        label='Confirm password',
        help_text="Re-enter your password to confirm."
    )

    class Meta:
        model  = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'password', 'password2')
        extra_kwargs = {
            'username': {'help_text': 'Unique username used for login.'},
            'email': {'help_text': 'Valid email address.'},
            'first_name': {'help_text': 'Your given name.'},
            'last_name': {'help_text': 'Your family name.'},
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({'password': 'Passwords do not match.'})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model  = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')


# ─── Task serializers ────────────────────────────────────────────────────────

class TaskSerializer(serializers.ModelSerializer):
    # Read-only computed fields sent to the frontend
    is_overdue      = serializers.BooleanField(read_only=True)
    is_due_soon     = serializers.BooleanField(read_only=True)
    computed_status = serializers.CharField(read_only=True)

    class Meta:
        model  = Task
        fields = (
            'id', 'title', 'description', 'priority', 'status', 'computed_status',
            'due_date', 'created_at', 'updated_at', 'completed_at',
            'category', 'tags', 'is_overdue', 'is_due_soon',
        )
        read_only_fields = ('created_at', 'updated_at', 'completed_at')

    def validate_status(self, value):
        """Auto-set completed_at when status changes to completed."""
        return value


class TaskCreateUpdateSerializer(serializers.ModelSerializer):
    """Used for creation and updates — excludes computed/read-only fields."""

    class Meta:
        model  = Task
        fields = (
            'id', 'title', 'description', 'priority', 'status',
            'due_date', 'category', 'tags',
        )

    def create(self, validated_data):
        # Attach the task to the requesting user
        user = self.context['request'].user
        return Task.objects.create(user=user, **validated_data)


# ─── Dashboard serializer ────────────────────────────────────────────────────

class DashboardSerializer(serializers.Serializer):
    # Counts
    total_tasks     = serializers.IntegerField()
    completed_tasks = serializers.IntegerField()
    pending_tasks   = serializers.IntegerField()
    in_progress     = serializers.IntegerField()
    overdue_tasks   = serializers.IntegerField()
    due_soon_tasks  = serializers.IntegerField()

    # Rate
    completion_rate = serializers.FloatField()

    # Breakdowns
    by_priority     = serializers.DictField(child=serializers.IntegerField())
    by_category     = serializers.DictField(child=serializers.IntegerField())

    # New Insights
    weekly_trend    = serializers.DictField(child=serializers.IntegerField())
    suggested_task  = TaskSerializer(allow_null=True)

    # Task lists for the "attention" panel
    overdue_list  = TaskSerializer(many=True)
    due_soon_list = TaskSerializer(many=True)
    recent_tasks  = TaskSerializer(many=True)
