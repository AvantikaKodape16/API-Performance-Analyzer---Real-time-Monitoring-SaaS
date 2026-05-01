from rest_framework import serializers
from .models import APIEndpoint, PerformanceMetric, Alert


class APIEndpointSerializer(serializers.ModelSerializer):
    total_requests = serializers.SerializerMethodField()
    avg_response_time = serializers.SerializerMethodField()
    error_rate = serializers.SerializerMethodField()

    class Meta:
        model = APIEndpoint
        fields = [
            "id",
            "name",
            "url",
            "method",
            "status",
            "alert_threshold_ms",
            "created_at",
            "updated_at",
            "total_requests",
            "avg_response_time",
            "error_rate",
        ]

    def get_total_requests(self, obj):
        return obj.metrics.count()

    def get_avg_response_time(self, obj):
        metrics = obj.metrics.all()
        if metrics:
            return sum(m.response_time_ms for m in metrics) / len(metrics)
        return 0

    def get_error_rate(self, obj):
        metrics = obj.metrics.all()
        if metrics:
            errors = metrics.filter(status_code__gte=400).count()
            return (errors / len(metrics)) * 100
        return 0


class PerformanceMetricSerializer(serializers.ModelSerializer):
    endpoint_name = serializers.CharField(source="endpoint.name", read_only=True)

    class Meta:
        model = PerformanceMetric
        fields = [
            "id",
            "endpoint",
            "endpoint_name",
            "response_time_ms",
            "status_code",
            "error_message",
            "is_alert",
            "timestamp",
        ]


class AlertSerializer(serializers.ModelSerializer):
    endpoint_name = serializers.CharField(source="endpoint.name", read_only=True)

    class Meta:
        model = Alert
        fields = [
            "id",
            "endpoint",
            "endpoint_name",
            "alert_type",
            "status",
            "message",
            "triggered_at",
            "resolved_at",
        ]