from services.chatbot.handbook_search import has_handbook_matches, search_handbook_text


HANDBOOK_INSTRUCTIONS = """You are answering a user question with handbook context.

Use the handbook context below as your primary source.
If the context is missing, incomplete, or says no matches were found, say that clearly.
Keep the answer concise and practical.
Do not invent handbook-specific facts that are not supported by the provided context.

User question:
{prompt}

Handbook context:
{context}
"""


def get_chat_mode(data: dict) -> str:
    mode = str(data.get("Mode", "gemini")).strip().lower()
    return "handbook" if mode == "handbook" else "gemini"


def build_chat_prompt(prompt: str, mode: str) -> str:
    if mode != "handbook":
        return prompt

    context = search_handbook_text(prompt)
    if not has_handbook_matches(context):
        return prompt
    return HANDBOOK_INSTRUCTIONS.format(prompt=prompt, context=context)
