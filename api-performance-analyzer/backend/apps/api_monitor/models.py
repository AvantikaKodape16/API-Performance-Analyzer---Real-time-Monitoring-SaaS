from django.db import models
from django.utils import timezone

class APIEndpoint(models.Model):
    STATUS_CHOICES = [
        ("active", "Active"),
        ("inactive", "Inactive"),
        ("paused", "Paused"),
    ]

    name = models.CharField(max_length=255)
    url = models.URLField(unique=True)
    method = models.CharField(
        max_length=10,
        choices=[
            ("GET", "GET"),
            ("POST", "POST"),
            ("PUT", "PUT"),
            ("DELETE", "DELETE"),
            ("PATCH", "PATCH"),
        ],
        default="GET",
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active")
    headers = models.JSONField(default=dict, blank=True)
    body = models.JSONField(default=dict, blank=True)
    alert_threshold_ms = models.IntegerField(default=1000)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["status", "-created_at"]),
        ]

    def __str__(self):
        return f"{self.name} ({self.url})"


class PerformanceMetric(models.Model):
    endpoint = models.ForeignKey(
        APIEndpoint, on_delete=models.CASCADE, related_name="metrics"
    )
    response_time_ms = models.FloatField()
    status_code = models.IntegerField()
    error_message = models.TextField(blank=True, null=True)
    is_alert = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ["-timestamp"]
        indexes = [
            models.Index(fields=["endpoint", "-timestamp"]),
            models.Index(fields=["is_alert", "-timestamp"]),
        ]

    def __str__(self):
        return f"{self.endpoint.name} - {self.response_time_ms}ms"


class Alert(models.Model):
    STATUS_CHOICES = [
        ("triggered", "Triggered"),
        ("resolved", "Resolved"),
        ("acknowledged", "Acknowledged"),
    ]

    endpoint = models.ForeignKey(
        APIEndpoint, on_delete=models.CASCADE, related_name="alerts"
    )
    metric = models.OneToOneField(
        PerformanceMetric, on_delete=models.SET_NULL, null=True
    )
    alert_type = models.CharField(
        max_length=50,
        choices=[
            ("slow_response", "Slow Response"),
            ("error", "Error"),
            ("timeout", "Timeout"),
        ],
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="triggered")
    message = models.TextField()
    triggered_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-triggered_at"]
        indexes = [
            models.Index(fields=["endpoint", "-triggered_at"]),
            models.Index(fields=["status", "-triggered_at"]),
        ]

    def __str__(self):
        return f"{self.endpoint.name} - {self.alert_type}"