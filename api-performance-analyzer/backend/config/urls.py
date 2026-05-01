from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/monitor/", include("apps.api_monitor.urls")),
    path("api/dashboard/", include("apps.dashboard.urls")),
]