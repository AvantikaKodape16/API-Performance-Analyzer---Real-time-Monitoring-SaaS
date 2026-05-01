from django.urls import path
from .views import dashboard_summary, get_trending_data

urlpatterns = [
    path("summary/", dashboard_summary, name="dashboard_summary"),
    path("trending/", get_trending_data, name="trending_data"),
]