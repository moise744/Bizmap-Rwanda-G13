from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse, HttpResponseRedirect
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView


def health_view(_request):
    return JsonResponse({"status": "ok"})


def root_redirect(_request):
    return HttpResponseRedirect("/api/docs/")


urlpatterns = [
    path("", root_redirect, name="root"),
    path("health/", health_view, name="health"),
    path("admin/", admin.site.urls),

    # API schema and docs
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),

    # API apps
    path("api/auth/", include("apps.accounts.urls")),
    path("api/businesses/", include("apps.businesses.urls")),
    path("api/reviews/", include("apps.reviews.urls")),
    path("api/favorites/", include("apps.favorites.urls")),
    path("api/notifications/", include("apps.notifications.urls")),
    path("api/search/", include("apps.searchai.urls")),
    path("api/chat/", include("apps.chat.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
