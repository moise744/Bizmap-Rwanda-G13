from django.conf import settings
from django.db import models

from apps.businesses.models import Business


class Review(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="reviews")
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name="reviews")
    rating = models.PositiveSmallIntegerField()
    comment = models.TextField(blank=True)
    is_visible = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "business")
        ordering = ("-created_at",)

    def __str__(self) -> str:
        return f"{self.user} → {self.business} ({self.rating})"

