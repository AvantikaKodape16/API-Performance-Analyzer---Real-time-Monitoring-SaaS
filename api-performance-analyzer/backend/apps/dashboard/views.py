from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta

from apps.api_monitor.models import APIEndpoint, PerformanceMetric, Alert


@api_view(["GET"])
def dashboard_summary(request):
    """Get dashboard summary data"""
    hours = int(request.query_params.get("hours", 24))
    start_time = timezone.now() - timedelta(hours=hours)

    total_endpoints = APIEndpoint.objects.count()
    active_endpoints = APIEndpoint.objects.filter(status="active").count()
    total_metrics = PerformanceMetric.objects.filter(timestamp__gte=start_time).count()
    active_alerts = Alert.objects.filter(status__in=["triggered", "acknowledged"]).count()

    metrics = PerformanceMetric.objects.filter(timestamp__gte=start_time)
    avg_response_time = 0
    if metrics.count() > 0:
        avg_response_time = sum(m.response_time_ms for m in metrics) / metrics.count()

    error_count = metrics.filter(status_code__gte=400).count()
    error_rate = (error_count / metrics.count() * 100) if metrics.count() > 0 else 0

    return Response(
        {
            "total_endpoints": total_endpoints,
            "active_endpoints": active_endpoints,
            "total_metrics": total_metrics,
            "active_alerts": active_alerts,
            "avg_response_time_ms": avg_response_time,
            "error_count": error_count,
            "error_rate": error_rate,
        }
    )


@api_view(["GET"])
def get_trending_data(request):
    """Get trending data for charts"""
    hours = int(request.query_params.get("hours", 24))
    start_time = timezone.now() - timedelta(hours=hours)

    metrics = PerformanceMetric.objects.filter(timestamp__gte=start_time).order_by(
        "timestamp"
    )

    response_times_by_hour = {}
    error_count_by_hour = {}

    for metric in metrics:
        hour_key = metric.timestamp.strftime("%Y-%m-%d %H:00")

        if hour_key not in response_times_by_hour:
            response_times_by_hour[hour_key] = []
            error_count_by_hour[hour_key] = 0

        response_times_by_hour[hour_key].append(metric.response_time_ms)
        if metric.status_code >= 400:
            error_count_by_hour[hour_key] += 1

    trending_data = []
    for hour in sorted(response_times_by_hour.keys()):
        avg_response = sum(response_times_by_hour[hour]) / len(
            response_times_by_hour[hour]
        )
        trending_data.append(
            {
                "timestamp": hour,
                "avg_response_time": avg_response,
                "error_count": error_count_by_hour[hour],
            }
        )

    return Response(trending_data)