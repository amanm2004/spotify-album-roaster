from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
from dotenv import load_dotenv

from spotify_client import SpotifyClient
from roast_generator import RoastGenerator


# Load environment variables
load_dotenv()


app = FastAPI(
    title="Music Roaster API",
    description="Roast Spotify playlists & albums using AI",
    
)



spotify_client = SpotifyClient(
    client_id=os.getenv("SPOTIFY_CLIENT_ID"),
    client_secret=os.getenv("SPOTIFY_CLIENT_SECRET")
)

roast_generator = RoastGenerator(
    api_key=os.getenv("GEMINI_API_KEY")
)



class RoastRequest(BaseModel):
    spotify_url: str


class RoastResponse(BaseModel):
    name: str
    creator: str
    track_count: int
    roast: str
    url: str



@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "spotify": "connected" if spotify_client.access_token else "error",
        "gemini": "connected" if roast_generator.model else "error"
    }



@app.post("/roast", response_model=RoastResponse)
async def roast_music(request: RoastRequest):

    try:
        # Step 1: Fetch data (auto-detect album/playlist)
        data = spotify_client.get_music_data(request.spotify_url)

        if not data:
            raise HTTPException(
                status_code=404,
                detail="Resource not found or not accessible (private playlist or invalid URL)"
            )

        # Step 2: Generate roast
        roast_text = roast_generator.generate_roast(data)

        # Step 3: Return response
        return RoastResponse(
            name=data["name"],
            creator=data["creator"],
            track_count=len(data["tracks"]),
            roast=roast_text,
            url=request.spotify_url
        )

    except HTTPException:
        raise

    except Exception as e:
        print("Error:", str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )