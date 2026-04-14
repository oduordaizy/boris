from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta


class Task(models.Model):

    class Priority(models.TextChoices):
        LOW    = 'low',    'Low'
        MEDIUM = 'medium', 'Medium'
        HIGH   = 'high',   'High'
        URGENT = 'urgent', 'Urgent'

    class Status(models.TextChoices):
        PENDING    = 'pending',    'Pending'
        IN_PROGRESS = 'in_progress', 'In Progress'
        COMPLETED  = 'completed',  'Completed'

    # Ownership
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks', db_index=True)

    # Core fields
    title       = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    priority    = models.CharField(max_length=10, choices=Priority.choices, default=Priority.MEDIUM, db_index=True)
    status      = models.CharField(max_length=15, choices=Status.choices, default=Status.PENDING, db_index=True)

    # Dates
    due_date     = models.DateTimeField(null=True, blank=True, db_index=True)
    created_at   = models.DateTimeField(auto_now_add=True)
    updated_at   = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    # Organisation
    category = models.CharField(max_length=100, blank=True)
    tags     = models.CharField(max_length=255, blank=True, help_text='Comma-separated tags')

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'[{self.priority.upper()}] {self.title} — {self.user.username}'

    # ── Computed properties ──────────────────────────────────────────────────

    @property
    def is_overdue(self):
        """True if the task has a due date in the past and is not completed."""
        if self.due_date and self.status != self.Status.COMPLETED:
            return timezone.now() > self.due_date
        return False

    @property
    def is_due_soon(self):
        """True if the task is due within the next 24 hours and not completed."""
        if self.due_date and self.status != self.Status.COMPLETED:
            delta = self.due_date - timezone.now()
            return timedelta(0) <= delta <= timedelta(hours=24)
        return False

    @property
    def computed_status(self):
        """Returns 'overdue' if the task is past its due date, otherwise the stored status."""
        if self.is_overdue:
            return 'overdue'
        return self.status

    # ── Helpers ──────────────────────────────────────────────────────────────

    def mark_complete(self):
        self.status = self.Status.COMPLETED
        self.completed_at = timezone.now()
        self.save(update_fields=['status', 'completed_at', 'updated_at'])



