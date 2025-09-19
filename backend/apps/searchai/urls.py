from django.urls import path

from .views import KeywordSearchView, SemanticSearchView, ReindexView

urlpatterns = [
    path("keyword/", KeywordSearchView.as_view(), name="keyword-search"),
    path("semantic/", SemanticSearchView.as_view(), name="semantic-search"),
    path("reindex/", ReindexView.as_view(), name="reindex"),
]

