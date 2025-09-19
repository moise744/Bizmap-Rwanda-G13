import json
from channels.generic.websocket import AsyncWebsocketConsumer


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        await self.send(json.dumps({"type": "system", "message": "Connected to chat."}))

    async def receive(self, text_data=None, bytes_data=None):
        if not text_data:
            return
        data = json.loads(text_data)
        message = data.get("message", "")
        # Simple echo and suggestion
        suggestion = "Try adding a city name for better results." if len(message.split()) < 3 else "Searching..."
        await self.send(json.dumps({"type": "reply", "message": message}))
        await self.send(json.dumps({"type": "hint", "message": suggestion}))

