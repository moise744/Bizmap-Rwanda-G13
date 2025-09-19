from rest_framework import views, response, permissions
from django.conf import settings

from apps.searchai.views import _business_corpus
from apps.searchai.services import embedding_service

try:
    from transformers import AutoModelForCausalLM, AutoTokenizer  # type: ignore
    import torch  # type: ignore
except Exception:  # pragma: no cover
    AutoModelForCausalLM = None  # type: ignore
    AutoTokenizer = None  # type: ignore
    torch = None  # type: ignore


class ChatView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        message = request.data.get("message", "").strip()
        if not message:
            return response.Response({"reply": "Please provide a message."})
        # Ensure index
        if not embedding_service.id_to_pk:
            embedding_service.build(_business_corpus())
        related_ids = embedding_service.search(message, top_k=5)
        context_snippets = []
        if related_ids:
            from apps.businesses.models import Business  # local import
            for b in Business.objects.filter(id__in=related_ids):
                context_snippets.append(f"- {b.name}: {b.description[:160]}")
        context_text = "\n".join(context_snippets)
        prompt = (
            "You are a helpful assistant for a business finder app."
            " Use the following businesses to answer concisely.\n" + context_text + "\nUser: " + message + "\nAssistant:"
        )
        if settings.AI_ENABLE and AutoModelForCausalLM is not None and AutoTokenizer is not None and torch is not None:
            try:
                model_name = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
                tokenizer = AutoTokenizer.from_pretrained(model_name)
                model = AutoModelForCausalLM.from_pretrained(model_name)
                inputs = tokenizer(prompt, return_tensors="pt")
                output_ids = model.generate(**inputs, max_new_tokens=128)
                text = tokenizer.decode(output_ids[0], skip_special_tokens=True)
                reply = text.split("Assistant:")[-1].strip()
                return response.Response({"reply": reply})
            except Exception:
                pass
        # Fallback heuristic
        reply = "Here are some options I found:\n" + (context_text or "Try refining your query with a city or category.")
        return response.Response({"reply": reply})

