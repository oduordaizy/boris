from django.contrib.auth.models import User
from django.utils import timezone
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from datetime import timedelta
from .models import Task

class TaskBackendTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='boris', password='Password123!')
        self.client.login(username='boris', password='Password123!')
        
        # Get JWT for API requests as the manual login is for session auth
        url = reverse('login')
        response = self.client.post(url, {'username': 'boris', 'password': 'Password123!'})
        self.access_token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.access_token)

    def test_task_overdue_logic(self):
        """Test that task correctly identifies as overdue."""
        past_date = timezone.now() - timedelta(days=1)
        task = Task.objects.create(
            user=self.user,
            title="Past Task",
            due_date=past_date,
            status=Task.Status.PENDING
        )
        self.assertTrue(task.is_overdue)
        self.assertEqual(task.computed_status, 'overdue')
        
        task.mark_complete()
        self.assertFalse(task.is_overdue)
        self.assertEqual(task.computed_status, Task.Status.COMPLETED)

    def test_task_due_soon_logic(self):
        """Test that task correctly identifies as due soon (within 24h)."""
        soon_date = timezone.now() + timedelta(hours=5)
        task = Task.objects.create(
            user=self.user,
            title="Soon Task",
            due_date=soon_date,
            status=Task.Status.PENDING
        )
        self.assertTrue(task.is_due_soon)
        
        far_date = timezone.now() + timedelta(days=2)
        task.due_date = far_date
        task.save()
        self.assertFalse(task.is_due_soon)

    def test_dashboard_stats(self):
        """Verify dashboard counts and rate calculations."""
        # Create 3 tasks: 1 completed, 1 in_progress, 1 pending (urgent)
        Task.objects.create(user=self.user, title="T1", status=Task.Status.COMPLETED, completed_at=timezone.now())
        Task.objects.create(user=self.user, title="T2", status=Task.Status.IN_PROGRESS)
        Task.objects.create(user=self.user, title="T3", status=Task.Status.PENDING, priority=Task.Priority.URGENT)
        
        url = reverse('dashboard')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total_tasks'], 3)
        self.assertEqual(response.data['completed_tasks'], 1)
        self.assertEqual(response.data['completion_rate'], 33.3)
        self.assertEqual(response.data['by_priority']['urgent'], 1)

    def test_next_task_recommendation(self):
        """Verify the 'Suggested Next Task' engine picks the right task."""
        # High priority task
        Task.objects.create(user=self.user, title="High", priority=Task.Priority.HIGH)
        # Urgent task
        urgent = Task.objects.create(user=self.user, title="Urgent", priority=Task.Priority.URGENT)
        # Completed urgent task (should be ignored)
        Task.objects.create(user=self.user, title="Done", priority=Task.Priority.URGENT, status=Task.Status.COMPLETED)
        
        url = reverse('dashboard')
        response = self.client.get(url)
        
        self.assertEqual(response.data['suggested_task']['id'], urgent.id)

    def test_unauthenticated_access(self):
        """Ensure endpoints are protected."""
        self.client.credentials()  # Clear credentials
        url = reverse('dashboard')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
