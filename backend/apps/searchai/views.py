from typing import List

from django.db.models import Q
from rest_framework import views, response, permissions, status
from drf_spectacular.utils import extend_schema, OpenApiParameter

from apps.businesses.models import Business
from .services import embedding_service


def _business_corpus() -> List[tuple[int, str]]:
    pairs: List[tuple[int, str]] = []
    for b in Business.objects.all():
        text = f"{b.name}. {b.description} {b.city} {b.country} {b.category.name if b.category else ''}"
        pairs.append((b.id, text))
    return pairs


@extend_schema(tags=["search"], parameters=[OpenApiParameter(name="query", required=False, type=str)])
class KeywordSearchView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        query = request.query_params.get("query", "")
        qs = Business.objects.all()
        if query:
            qs = qs.filter(
                Q(name__icontains=query)
                | Q(description__icontains=query)
                | Q(city__icontains=query)
                | Q(country__icontains=query)
                | Q(category__name__icontains=query)
            )
        qs = qs.order_by("-average_rating", "-rating_count")[:50]
        data = [
            {
                "id": b.id,
                "name": b.name,
                "description": b.description,
                "city": b.city,
                "country": b.country,
                "average_rating": b.average_rating,
                "rating_count": b.rating_count,
            }
            for b in qs
        ]
        return response.Response({"results": data})


@extend_schema(tags=["search"], parameters=[OpenApiParameter(name="query", required=True, type=str), OpenApiParameter(name="top_k", required=False, type=int)])
class SemanticSearchView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        query = request.query_params.get("query", "")
        top_k = int(request.query_params.get("top_k", "10"))
        if not query:
            return response.Response({"results": []})
        # Build index lazily
        if not embedding_service.id_to_pk:
            embedding_service.build(_business_corpus())
        ids = embedding_service.search(query, top_k=top_k)
        businesses = {b.id: b for b in Business.objects.filter(id__in=ids)}
        results = [
            {
                "id": bid,
                "name": businesses[bid].name,
                "description": businesses[bid].description,
                "city": businesses[bid].city,
                "country": businesses[bid].country,
                "average_rating": businesses[bid].average_rating,
                "rating_count": businesses[bid].rating_count,
            }
            for bid in ids
            if bid in businesses
        ]
        return response.Response({"results": results})


@extend_schema(tags=["search"])
class ReindexView(views.APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request):
        embedding_service.build(_business_corpus())
        return response.Response({"indexed": len(embedding_service.id_to_pk)}, status=status.HTTP_201_CREATED)
