import google.generativeai as genai
from typing import Dict


class RoastGenerator:

    def __init__(self, api_key: str):
        try:
            genai.configure(api_key=api_key)

            # Stable model (works with current SDK)
            self.model = genai.GenerativeModel("gemini-1.5-flash")

            print("Gemini AI client initialized successfully!")

        except Exception as e:
            print(f"Failed to initialize Gemini client: {e}")
            self.model = None

    # -----------------------------------
    # Main Roast Function
    # -----------------------------------
    def generate_roast(self, music_data: Dict) -> str:

        if not self.model:
            return "AI roaster is offline. Your music taste survives... for now."

        try:
            tracks = music_data.get("tracks", [])

            if not tracks:
                return "No tracks found. Even silence has more personality than this."

            # Sample tracks
            track_names = [
                f"{t['name']} by {t['artist']}" for t in tracks[:10]
            ]

            # Safe stats
            avg_popularity = sum(
                t.get("popularity", 50) for t in tracks
            ) / len(tracks)

            explicit_count = sum(
                1 for t in tracks if t.get("explicit", False)
            )

            creator = music_data.get("creator", "Unknown")

            # Prompt
            prompt = f"""
You are a brutally honest but funny music critic.

Roast this Spotify music collection.

Name: "{music_data['name']}"
Creator/Artist: {creator}
Number of tracks: {len(tracks)}
Average popularity: {avg_popularity:.0f}/100
Explicit tracks: {explicit_count}

Sample tracks:
{chr(10).join(f"- {track}" for track in track_names)}

Rules:
- Be sarcastic, witty, and funny
- Roast patterns in taste (basic, edgy, NPC energy, etc.)
- Reference artists where possible
- Keep it PG-13 (funny, not toxic)
- End with a sharp one-liner

Roast it.
"""

            print("Sending request to Gemini...")

            response = self.model.generate_content(prompt)

            roast = response.text

            if not roast:
                raise ValueError("Empty response from Gemini")

            print("Roast generated successfully!")
            return roast

        except Exception as e:
            print(f"Error generating roast: {e}")

            # Fallback roast (never fails)
            return f"""
"{music_data.get('name', 'This collection')}" — wow.

You’ve curated {len(tracks)} tracks that somehow feel both overthought 
and completely random at the same time.

It’s like your music taste was built by scrolling for 10 seconds 
and saying "yeah this seems like me."

Bold strategy. Questionable execution.
""".strip()

    
    def generate_custom_roast(self, custom_prompt: str) -> str:

        if not self.model:
            return "AI is not available."

        try:
            response = self.model.generate_content(custom_prompt)
            return response.text or "No response generated."

        except Exception as e:
            return f"Error: {str(e)}"