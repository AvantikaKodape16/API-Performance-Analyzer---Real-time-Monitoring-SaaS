from django.contrib import admin
from .models import APIEndpoint, PerformanceMetric, Alert


@admin.register(APIEndpoint)
class APIEndpointAdmin(admin.ModelAdmin):
    list_display = ("name", "url", "method", "status", "created_at")
    list_filter = ("status", "method", "created_at")
    search_fields = ("name", "url")
    readonly_fields = ("created_at", "updated_at")


@admin.register(PerformanceMetric)
class PerformanceMetricAdmin(admin.ModelAdmin):
    list_display = ("endpoint", "response_time_ms", "status_code", "is_alert", "timestamp")
    list_filter = ("is_alert", "status_code", "timestamp")
    search_fields = ("endpoint__name",)
    readonly_fields = ("timestamp",)


@admin.register(Alert)
class AlertAdmin(admin.ModelAdmin):
    list_display = ("endpoint", "alert_type", "status", "triggered_at")
    list_filter = ("status", "alert_type", "triggered_at")
    search_fields = ("endpoint__name", "message")
    readonly_fields = ("triggered_at",)