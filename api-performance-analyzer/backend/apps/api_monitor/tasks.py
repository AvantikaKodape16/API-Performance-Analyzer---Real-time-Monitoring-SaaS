from celery import shared_task
from django.utils import timezone
from django.conf import settings
import requests
import time
import logging

from .models import APIEndpoint, PerformanceMetric, Alert

logger = logging.getLogger(__name__)


@shared_task
def monitor_endpoint(endpoint_id):
    try:
        endpoint = APIEndpoint.objects.get(id=endpoint_id)

        if endpoint.status != "active":
            return

        start_time = time.time()

        try:
            if endpoint.method == "GET":
                response = requests.get(
                    endpoint.url,
                    headers=endpoint.headers,
                    timeout=10,
                )
            elif endpoint.method == "POST":
                response = requests.post(
                    endpoint.url,
                    headers=endpoint.headers,
                    json=endpoint.body,
                    timeout=10,
                )
            elif endpoint.method == "PUT":
                response = requests.put(
                    endpoint.url,
                    headers=endpoint.headers,
                    json=endpoint.body,
                    timeout=10,
                )
            elif endpoint.method == "PATCH":
                response = requests.patch(
                    endpoint.url,
                    headers=endpoint.headers,
                    json=endpoint.body,
                    timeout=10,
                )
            elif endpoint.method == "DELETE":
                response = requests.delete(
                    endpoint.url,
                    headers=endpoint.headers,
                    timeout=10,
                )

            response_time_ms = (time.time() - start_time) * 1000
            status_code = response.status_code
            error_message = ""

        except requests.exceptions.Timeout:
            response_time_ms = (time.time() - start_time) * 1000
            status_code = 408
            error_message = "Request timeout"
        except Exception as e:
            response_time_ms = (time.time() - start_time) * 1000
            status_code = 0
            error_message = str(e)

        # Create metric
        is_alert = (
            response_time_ms > endpoint.alert_threshold_ms
            or status_code >= 400
        )
        metric = PerformanceMetric.objects.create(
            endpoint=endpoint,
            response_time_ms=response_time_ms,
            status_code=status_code,
            error_message=error_message,
            is_alert=is_alert,
        )

        # Create alert if needed
        if is_alert:
            if response_time_ms > endpoint.alert_threshold_ms:
                alert_type = "slow_response"
                message = f"Slow response detected: {response_time_ms:.2f}ms (threshold: {endpoint.alert_threshold_ms}ms)"
            else:
                alert_type = "error"
                message = f"Error detected: {status_code} - {error_message}"

            Alert.objects.create(
                endpoint=endpoint,
                metric=metric,
                alert_type=alert_type,
                message=message,
            )

        logger.info(
            f"Monitored {endpoint.name}: {response_time_ms:.2f}ms, Status: {status_code}"
        )

    except APIEndpoint.DoesNotExist:
        logger.error(f"Endpoint {endpoint_id} not found")
    except Exception as e:
        logger.error(f"Error monitoring endpoint: {str(e)}")


@shared_task
def schedule_monitoring():
    """Schedule monitoring for all active endpoints"""
    endpoints = APIEndpoint.objects.filter(status="active")
    for endpoint in endpoints:
        monitor_endpoint.delay(endpoint.id)
    return f"Scheduled monitoring for {endpoints.count()} endpoints"