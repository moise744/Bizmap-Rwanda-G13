from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import FavoriteViewSet, ViewHistoryViewSet

router = DefaultRouter()
router.register(r"items", FavoriteViewSet, basename="favorite")
router.register(r"history", ViewHistoryViewSet, basename="history")

urlpatterns = [
    path("", include(router.urls)),
]

