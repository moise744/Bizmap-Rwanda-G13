from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema

from .models import Favorite, ViewHistory
from .serializers import FavoriteSerializer, ViewHistorySerializer


@extend_schema(tags=["favorites"])
class FavoriteViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=["post"], url_path="toggle")
    def toggle(self, request):
        from .models import Favorite
        business_id = request.data.get("business")
        if not business_id:
            return Response({"error": "business is required"}, status=400)
        obj, created = Favorite.objects.get_or_create(user=request.user, business_id=business_id)
        if not created:
            obj.delete()
            return Response({"favorited": False})
        return Response({"favorited": True})


@extend_schema(tags=["favorites"])
class ViewHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ViewHistorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ViewHistory.objects.filter(user=self.request.user)

    @action(detail=False, methods=["post"], url_path="add")
    def add(self, request):
        business_id = request.data.get("business")
        if not business_id:
            return Response({"error": "business is required"}, status=400)
        item = ViewHistory.objects.create(user=request.user, business_id=business_id)
        return Response({"id": item.id})
