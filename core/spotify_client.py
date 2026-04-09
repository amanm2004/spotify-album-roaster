import requests
import base64
from typing import Optional, Dict


class SpotifyClient:

    def __init__(self, client_id: str, client_secret: str):
        self.client_id = client_id
        self.client_secret = client_secret
        self.access_token = self.get_access_token()

   
    def get_access_token(self) -> Optional[str]:
        try:
            auth_str = f"{self.client_id}:{self.client_secret}"
            b64_auth = base64.b64encode(auth_str.encode()).decode()

            url = "https://accounts.spotify.com/api/token"

            headers = {
                "Authorization": f"Basic {b64_auth}",
                "Content-Type": "application/x-www-form-urlencoded"
            }

            data = {
                "grant_type": "client_credentials"
            }

            response = requests.post(url, headers=headers, data=data)

            if response.status_code != 200:
                print("Token error:", response.json())
                return None

            token = response.json()["access_token"]
            print("Spotify token fetched")
            return token

        except Exception as e:
            print("Token error:", e)
            return None

    
    def extract_spotify_id(self, url: str):
        try:
            parts = url.split("spotify.com/")[1]
            resource_type = parts.split("/")[0]
            resource_id = parts.split("/")[1].split("?")[0]

            if resource_type not in ["playlist", "album"]:
                return None

            return resource_type, resource_id

        except:
            return None

    
    def _get(self, endpoint: str):
        url = f"https://api.spotify.com/v1/{endpoint}"

        headers = {
            "Authorization": f"Bearer {self.access_token}"
        }

        response = requests.get(url, headers=headers)

        if response.status_code != 200:
            print("Spotify API error:", response.status_code, response.text)
            return None

        return response.json()

    
    def get_playlist_info(self, playlist_id: str) -> Optional[Dict]:

        data = self._get(f"playlists/{playlist_id}")

        if not data or "tracks" not in data:
            return None

        result = {
            "name": data["name"],
            "creator": data["owner"]["display_name"],
            "tracks": []
        }

        for item in data["tracks"]["items"][:50]:
            if not item.get("track"):
                continue

            track = item["track"]

            result["tracks"].append({
                "name": track["name"],
                "artist": track["artists"][0]["name"],
                "popularity": track.get("popularity", 50),
                "explicit": track.get("explicit", False)
            })

        return result

    
    def get_album_info(self, album_id: str) -> Optional[Dict]:

        album = self._get(f"albums/{album_id}")
        tracks = self._get(f"albums/{album_id}/tracks")

        if not album or not tracks:
            return None

        result = {
            "name": album["name"],
            "creator": album["artists"][0]["name"],
            "tracks": []
        }

        for track in tracks["items"][:50]:
            result["tracks"].append({
                "name": track["name"],
                "artist": track["artists"][0]["name"],
                "popularity": 50,  # API doesn't give it here
                "explicit": track.get("explicit", False)
            })

        return result

    
    def get_music_data(self, url: str):

        parsed = self.extract_spotify_id(url)

        if not parsed:
            return None

        type_, id_ = parsed

        if type_ == "playlist":
            return self.get_playlist_info(id_)

        elif type_ == "album":
            return self.get_album_info(id_)

        return None