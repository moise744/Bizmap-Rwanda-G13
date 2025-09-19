from rest_framework import serializers

from .models import Favorite, ViewHistory


class FavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite
        fields = ["id", "user", "business", "created_at"]
        read_only_fields = ["user", "created_at"]


class ViewHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ViewHistory
        fields = ["id", "user", "business", "viewed_at"]
        read_only_fields = ["user", "viewed_at"]

