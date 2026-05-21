from typing import Generator
import ollama

class Model:
    def __init__(self, model: str, system: str) -> None:
        self.model = model
        self.system = system

    def respond(self, prompt: str) -> Generator[str, None, None]:
        response_stream: ollama.ChatResponse = ollama.chat( # type: ignore
            model=self.model,
            messages=[
                {"role": "system", "content": self.system},
                {"role": "user", "content": prompt}
            ],
            stream=True,
        )
        
        for chunk in response_stream:
            yield chunk["message"]["content"] # type: ignore