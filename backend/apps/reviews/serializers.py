from rest_framework import serializers
from django.db import transaction
from django.db.models import Avg, Count
from django.db import models

from .models import Review
from apps.businesses.models import Business


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Review
        fields = ["id", "user", "user_name", "business", "rating", "comment", "is_visible", "created_at"]
        read_only_fields = ["user", "is_visible", "created_at"]

    def validate_rating(self, value: int) -> int:
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5")
        return value

    @transaction.atomic
    def create(self, validated_data):
        user = self.context["request"].user
        validated_data["user"] = user
        review = super().create(validated_data)
        business: Business = review.business
        agg = (
            Review.objects.filter(business=business, is_visible=True)
            .aggregate(avg=Avg("rating"), cnt=Count("id"))
        )
        business.average_rating = float(agg.get("avg") or 0)
        business.rating_count = int(agg.get("cnt") or 0)
        business.save(update_fields=["average_rating", "rating_count"])
        return review
