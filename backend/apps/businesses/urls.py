from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import CategoryViewSet, BusinessViewSet

router = DefaultRouter()
router.register(r"categories", CategoryViewSet, basename="category")
router.register(r"", BusinessViewSet, basename="business")

urlpatterns = [
    path("", include(router.urls)),
]

