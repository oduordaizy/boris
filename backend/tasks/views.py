from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.utils import timezone
from datetime import timedelta

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import generics, status, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from django.db.models import Case, When, IntegerField, Count

from .models import Task
from .serializers import (
    RegisterSerializer,
    UserSerializer,
    TaskSerializer,
    TaskCreateUpdateSerializer,
    DashboardSerializer,
)


# ─── Auth views ──────────────────────────────────────────────────────────────

class RegisterView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        request_body=RegisterSerializer,
        responses={201: openapi.Response('Created', RegisterSerializer)}
    )
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'user':    UserSerializer(user).data,
                'refresh': str(refresh),
                'access':  str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['username', 'password'],
            properties={
                'username': openapi.Schema(type=openapi.TYPE_STRING),
                'password': openapi.Schema(type=openapi.TYPE_STRING),
            },
        ),
        responses={200: openapi.Response('OK')}
    )
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response(
                {'error': 'Username and password are required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(username=username, password=password)
        if not user:
            return Response(
                {'error': 'Invalid credentials.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        refresh = RefreshToken.for_user(user)
        return Response({
            'user':    UserSerializer(user).data,
            'refresh': str(refresh),
            'access':  str(refresh.access_token),
        })


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['refresh'],
            properties={
                'refresh': openapi.Schema(type=openapi.TYPE_STRING),
            },
        ),
        responses={200: openapi.Response('OK')}
    )
    def post(self, request):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response(
                {'error': 'Refresh token required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': 'Logged out successfully.'})
        except TokenError:
            return Response({'error': 'Invalid or expired token.'}, status=status.HTTP_400_BAD_REQUEST)


# ─── Task views ───────────────────────────────────────────────────────────────

class TaskListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/tasks/         — list all tasks for the current user
    POST /api/tasks/         — create a new task
    
    Filtering: ?status=pending|completed|in_progress|overdue
               ?priority=low|medium|high|urgent
               ?category=<name>
               ?due_soon=true       (due within 24 hours)
               ?overdue=true
    Sorting:   ?ordering=due_date|-due_date|priority|-created_at  (default: -created_at)
    Search:    ?search=<term>       (searches title and description)
    """
    permission_classes = [IsAuthenticated]
    filter_backends    = [filters.SearchFilter, filters.OrderingFilter]
    search_fields      = ['title', 'description', 'tags', 'category']
    ordering_fields    = ['due_date', 'created_at', 'priority', 'status']
    ordering           = ['-created_at']

    def get_queryset(self):
        # Handle swagger fake view for schema generation
        if getattr(self, 'swagger_fake_view', False):
            return Task.objects.none()

        qs = Task.objects.filter(user=self.request.user)

        status_param   = self.request.query_params.get('status')
        priority_param = self.request.query_params.get('priority')
        category_param = self.request.query_params.get('category')
        due_soon_param = self.request.query_params.get('due_soon')
        overdue_param  = self.request.query_params.get('overdue')

        if status_param == 'overdue':
            now = timezone.now()
            qs = qs.filter(due_date__lt=now).exclude(status=Task.Status.COMPLETED)
        elif status_param:
            qs = qs.filter(status=status_param)

        if priority_param:
            qs = qs.filter(priority=priority_param)

        if category_param:
            qs = qs.filter(category__iexact=category_param)

        if due_soon_param == 'true':
            now = timezone.now()
            qs = qs.filter(
                due_date__gte=now,
                due_date__lte=now + timedelta(hours=24),
            ).exclude(status=Task.Status.COMPLETED)

        if overdue_param == 'true':
            now = timezone.now()
            qs = qs.filter(due_date__lt=now).exclude(status=Task.Status.COMPLETED)

        return qs

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return TaskCreateUpdateSerializer
        return TaskSerializer


class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/tasks/<id>/   — retrieve a single task
    PATCH  /api/tasks/<id>/   — partial update
    PUT    /api/tasks/<id>/   — full update
    DELETE /api/tasks/<id>/   — delete
    """
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Handle swagger fake view for schema generation
        if getattr(self, 'swagger_fake_view', False):
            return Task.objects.none()

        # Users can only access their own tasks
        return Task.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.request.method in ('PUT', 'PATCH'):
            return TaskCreateUpdateSerializer
        return TaskSerializer


class TaskCompleteView(APIView):
    """
    PATCH /api/tasks/<id>/complete/   — mark a task as completed
    """
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description='Mark a task as completed',
        responses={200: openapi.Response('Task completed', TaskSerializer)}
    )
    def patch(self, request, pk):
        try:
            task = Task.objects.get(pk=pk, user=request.user)
        except Task.DoesNotExist:
            return Response({'error': 'Task not found.'}, status=status.HTTP_404_NOT_FOUND)

        task.mark_complete()
        return Response(TaskSerializer(task).data)


# ─── Dashboard view ───────────────────────────────────────────────────────────

class DashboardView(APIView):
    """
    GET /api/dashboard/

    Returns a summary of the user's task workload:
    - Counts by status and priority
    - Completion rate
    - Overdue and due-soon task lists
    - Recent activity
    """
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description='Get dashboard summary of user tasks',
        responses={
            200: openapi.Response(
                'Dashboard summary',
                DashboardSerializer
            )
        }
    )
    def get(self, request):
        now = timezone.now()
        tasks = Task.objects.filter(user=request.user)

        total      = tasks.count()
        completed  = tasks.filter(status=Task.Status.COMPLETED).count()
        in_progress = tasks.filter(status=Task.Status.IN_PROGRESS).count()
        pending    = tasks.filter(status=Task.Status.PENDING).count()

        overdue_qs = tasks.filter(
            due_date__lt=now
        ).exclude(status=Task.Status.COMPLETED).order_by('due_date')

        due_soon_qs = tasks.filter(
            due_date__gte=now,
            due_date__lte=now + timedelta(hours=24),
        ).exclude(status=Task.Status.COMPLETED).order_by('due_date')

        # Priority breakdown (only non-completed)
        active = tasks.exclude(status=Task.Status.COMPLETED)
        by_priority = {
            'urgent': active.filter(priority=Task.Priority.URGENT).count(),
            'high':   active.filter(priority=Task.Priority.HIGH).count(),
            'medium': active.filter(priority=Task.Priority.MEDIUM).count(),
            'low':    active.filter(priority=Task.Priority.LOW).count(),
        }

        # Category breakdown
        from django.db.models import Count
        category_qs = (
            tasks.exclude(category='')
                 .values('category')
                 .annotate(count=Count('id'))
                 .order_by('-count')
        )
        by_category = {item['category']: item['count'] for item in category_qs}

        completion_rate = round((completed / total * 100), 1) if total > 0 else 0.0

        # ─── New Insights ────────────────────────────────────────────────────
        
        # 1. Weekly Completion Trend (Last 7 days)
        weekly_trend = {}
        for i in range(7):
            date = (now - timedelta(days=i)).date()
            count = tasks.filter(
                status=Task.Status.COMPLETED,
                completed_at__date=date
            ).count()
            weekly_trend[date.strftime('%Y-%m-%d')] = count

        # 2. Suggested Next Task (Engine)
        suggestion_qs = tasks.exclude(status=Task.Status.COMPLETED)
        suggested_task = suggestion_qs.annotate(
            priority_weight=Case(
                When(priority=Task.Priority.URGENT, then=4),
                When(priority=Task.Priority.HIGH,   then=3),
                When(priority=Task.Priority.MEDIUM, then=2),
                When(priority=Task.Priority.LOW,    then=1),
                default=0,
                output_field=IntegerField(),
            )
        ).order_by('-priority_weight', 'due_date', 'created_at').first()

        data = {
            'total_tasks':      total,
            'completed_tasks':  completed,
            'pending_tasks':    pending,
            'in_progress':      in_progress,
            'overdue_tasks':    overdue_qs.count(),
            'due_soon_tasks':   due_soon_qs.count(),
            'completion_rate':  completion_rate,
            'by_priority':      by_priority,
            'by_category':      by_category,
            'weekly_trend':     weekly_trend,
            'suggested_task':   suggested_task,
            'overdue_list':     list(overdue_qs[:10]),
            'due_soon_list':    list(due_soon_qs[:10]),
            'recent_tasks':     list(tasks.order_by('-created_at')[:5]),
        }

        serializer = DashboardSerializer(data)
        return Response(serializer.data)

