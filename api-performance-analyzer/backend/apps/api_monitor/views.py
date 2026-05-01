from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
import json

from .models import APIEndpoint, PerformanceMetric, Alert
from .serializers import APIEndpointSerializer, PerformanceMetricSerializer, AlertSerializer
from .tasks import monitor_endpoint


class APIEndpointViewSet(viewsets.ModelViewSet):
    queryset = APIEndpoint.objects.all()
    serializer_class = APIEndpointSerializer

    @action(detail=True, methods=["post"])
    def activate_monitoring(self, request, pk=None):
        endpoint = self.get_object()
        endpoint.status = "active"
        endpoint.save()
        monitor_endpoint.delay(endpoint.id)
        return Response(
            {"status": "Monitoring activated"},
            status=status.HTTP_200_OK,
        )

    @action(detail=True, methods=["post"])
    def pause_monitoring(self, request, pk=None):
        endpoint = self.get_object()
        endpoint.status = "paused"
        endpoint.save()
        return Response(
            {"status": "Monitoring paused"},
            status=status.HTTP_200_OK,
        )

    @action(detail=True, methods=["get"])
    def performance_history(self, request, pk=None):
        endpoint = self.get_object()
        hours = int(request.query_params.get("hours", 24))
        start_time = timezone.now() - timedelta(hours=hours)

        metrics = endpoint.metrics.filter(timestamp__gte=start_time).order_by(
            "timestamp"
        )
        serializer = PerformanceMetricSerializer(metrics, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["get"])
    def stats(self, request, pk=None):
        endpoint = self.get_object()
        hours = int(request.query_params.get("hours", 24))
        start_time = timezone.now() - timedelta(hours=hours)

        metrics = endpoint.metrics.filter(timestamp__gte=start_time)

        if metrics.count() == 0:
            return Response(
                {
                    "total_requests": 0,
                    "avg_response_time": 0,
                    "min_response_time": 0,
                    "max_response_time": 0,
                    "error_count": 0,
                    "error_rate": 0,
                    "uptime": 0,
                }
            )

        response_times = [m.response_time_ms for m in metrics]
        errors = metrics.filter(status_code__gte=400).count()

        return Response(
            {
                "total_requests": metrics.count(),
                "avg_response_time": sum(response_times) / len(response_times),
                "min_response_time": min(response_times),
                "max_response_time": max(response_times),
                "error_count": errors,
                "error_rate": (errors / metrics.count()) * 100,
                "uptime": ((metrics.count() - errors) / metrics.count()) * 100,
            }
        )


class PerformanceMetricViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PerformanceMetric.objects.all()
    serializer_class = PerformanceMetricSerializer

    @action(detail=False, methods=["get"])
    def recent(self, request):
        minutes = int(request.query_params.get("minutes", 60))
        start_time = timezone.now() - timedelta(minutes=minutes)
        metrics = self.get_queryset().filter(timestamp__gte=start_time)
        serializer = self.get_serializer(metrics, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def alerts(self, request):
        metrics = self.get_queryset().filter(is_alert=True)
        serializer = self.get_serializer(metrics, many=True)
        return Response(serializer.data)


class AlertViewSet(viewsets.ModelViewSet):
    queryset = Alert.objects.all()
    serializer_class = AlertSerializer

    @action(detail=True, methods=["post"])
    def acknowledge(self, request, pk=None):
        alert = self.get_object()
        alert.status = "acknowledged"
        alert.save()
        return Response(
            {"status": "Alert acknowledged"},
            status=status.HTTP_200_OK,
        )

    @action(detail=True, methods=["post"])
    def resolve(self, request, pk=None):
        alert = self.get_object()
        alert.status = "resolved"
        alert.resolved_at = timezone.now()
        alert.save()
        return Response(
            {"status": "Alert resolved"},
            status=status.HTTP_200_OK,
        )

    @action(detail=False, methods=["get"])
    def active(self, request):
        alerts = self.get_queryset().filter(status__in=["triggered", "acknowledged"])
        serializer = self.get_serializer(alerts, many=True)
        return Response(serializer.data)