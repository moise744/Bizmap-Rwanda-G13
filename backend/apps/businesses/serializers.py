from rest_framework import serializers

from .models import Category, Business


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]


class BusinessSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        source="category", queryset=Category.objects.all(), write_only=True, required=False, allow_null=True
    )

    class Meta:
        model = Business
        fields = [
            "id",
            "name",
            "description",
            "category",
            "category_id",
            "address",
            "city",
            "country",
            "website",
            "phone",
            "image",
            "average_rating",
            "rating_count",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["average_rating", "rating_count", "created_at", "updated_at"]

