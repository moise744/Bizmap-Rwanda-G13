from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiParameter

from .models import Category, Business
from .serializers import CategorySerializer, BusinessSerializer


@extend_schema(tags=["businesses"])
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by("name")
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]


@extend_schema(tags=["businesses"])
class BusinessViewSet(viewsets.ModelViewSet):
    queryset = Business.objects.all().order_by("-created_at")
    serializer_class = BusinessSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "description", "city", "country"]
    ordering_fields = ["created_at", "average_rating"]

    @extend_schema(parameters=[OpenApiParameter(name="category_id", required=False, type=int)])
    @action(detail=False, methods=["get"], url_path="by-category")
    def by_category(self, request):
        category_id = request.query_params.get("category_id")
        qs = self.get_queryset()
        if category_id:
            qs = qs.filter(category_id=category_id)
        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)
