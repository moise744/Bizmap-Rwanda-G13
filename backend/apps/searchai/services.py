from typing import List, Tuple

from django.conf import settings

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel


class TfidfSearchService:
    def __init__(self) -> None:
        self.vectorizer = TfidfVectorizer(stop_words="english")
        self.matrix = None
        self.id_to_pk: List[int] = []

    def build(self, pairs: List[Tuple[int, str]]) -> None:
        if not pairs:
            self.matrix = None
            self.id_to_pk = []
            return
        texts = [t for _, t in pairs]
        self.matrix = self.vectorizer.fit_transform(texts)
        self.id_to_pk = [pk for pk, _ in pairs]

    def search(self, query: str, top_k: int = 10) -> List[int]:
        if not self.matrix or not self.id_to_pk:
            return []
        qv = self.vectorizer.transform([query])
        cosine = linear_kernel(qv, self.matrix).ravel()
        top_indices = cosine.argsort()[::-1][:top_k]
        return [self.id_to_pk[i] for i in top_indices]


# For now use TF-IDF backend to keep builds fast and reliable on Railway
embedding_service = TfidfSearchService()
