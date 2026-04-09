import pytest
from unittest.mock import Mock, patch, MagicMock
from core.spotify_client import SpotifyClient


class TestSpotifyClient:
    """Tests for SpotifyClient class."""

    @patch("core.spotify_client.requests.post")
    def test_init_with_valid_credentials(self, mock_post):
        """Test initialization with valid credentials."""
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {"access_token": "test_token_123"}
        mock_post.return_value = mock_response

        client = SpotifyClient("client_id", "client_secret")

        assert client.access_token == "test_token_123"

    @patch("core.spotify_client.requests.post")
    def test_init_with_invalid_credentials(self, mock_post):
        """Test initialization with invalid credentials."""
        mock_response = Mock()
        mock_response.status_code = 401
        mock_response.json.return_value = {"error": "invalid_client"}
        mock_post.return_value = mock_response

        client = SpotifyClient("invalid_id", "invalid_secret")

        assert client.access_token is None

    def test_extract_spotify_id_playlist(self):
        """Test extracting ID from playlist URL."""
        client = SpotifyClient("id", "secret")
        client.access_token = "token"

        result = client.extract_spotify_id("https://open.spotify.com/playlist/abc123")

        assert result == ("playlist", "abc123")

    def test_extract_spotify_id_album(self):
        """Test extracting ID from album URL."""
        client = SpotifyClient("id", "secret")
        client.access_token = "token"

        result = client.extract_spotify_id("https://open.spotify.com/album/xyz789")

        assert result == ("album", "xyz789")

    def test_extract_spotify_id_with_query_params(self):
        """Test extracting ID from URL with query params."""
        client = SpotifyClient("id", "secret")
        client.access_token = "token"

        result = client.extract_spotify_id("https://open.spotify.com/playlist/abc123?si=abc")

        assert result == ("playlist", "abc123")

    def test_extract_spotify_id_invalid_url(self):
        """Test extracting ID from invalid URL."""
        client = SpotifyClient("id", "secret")
        client.access_token = "token"

        result = client.extract_spotify_id("https://example.com/something")

        assert result is None

    def test_extract_spotify_id_unsupported_type(self):
        """Test extracting ID from unsupported URL type."""
        client = SpotifyClient("id", "secret")
        client.access_token = "token"

        result = client.extract_spotify_id("https://open.spotify.com/artist/abc123")

        assert result is None

    @patch("core.spotify_client.requests.get")
    def test_get_playlist_info_success(self, mock_get):
        """Test successful playlist info retrieval."""
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "name": "Test Playlist",
            "owner": {"display_name": "test_user"},
            "tracks": {
                "items": [
                    {
                        "track": {
                            "name": "Song 1",
                            "artists": [{"name": "Artist 1"}],
                            "popularity": 85,
                            "explicit": False,
                        }
                    },
                    {
                        "track": {
                            "name": "Song 2",
                            "artists": [{"name": "Artist 2"}],
                            "popularity": 70,
                            "explicit": True,
                        }
                    },
                ]
            }
        }
        mock_get.return_value = mock_response

        client = SpotifyClient("id", "secret")
        client.access_token = "token"

        result = client.get_playlist_info("playlist123")

        assert result["name"] == "Test Playlist"
        assert result["creator"] == "test_user"
        assert len(result["tracks"]) == 2
        assert result["tracks"][0]["name"] == "Song 1"
        assert result["tracks"][1]["explicit"] is True

    @patch("core.spotify_client.requests.get")
    def test_get_playlist_info_api_error(self, mock_get):
        """Test playlist info retrieval with API error."""
        mock_response = Mock()
        mock_response.status_code = 404
        mock_response.text = "Not found"
        mock_get.return_value = mock_response

        client = SpotifyClient("id", "secret")
        client.access_token = "token"

        result = client.get_playlist_info("invalid_id")

        assert result is None

    @patch("core.spotify_client.requests.get")
    def test_get_playlist_info_handles_missing_track(self, mock_get):
        """Test playlist info handles null tracks."""
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "name": "Test",
            "owner": {"display_name": "user"},
            "tracks": {"items": [{}, {"track": None}]}
        }
        mock_get.return_value = mock_response

        client = SpotifyClient("id", "secret")
        client.access_token = "token"

        result = client.get_playlist_info("id")

        assert len(result["tracks"]) == 0

    @patch("core.spotify_client.requests.get")
    def test_get_album_info_success(self, mock_get):
        """Test successful album info retrieval."""
        mock_album_response = Mock()
        mock_album_response.status_code = 200
        mock_album_response.json.return_value = {
            "name": "Test Album",
            "artists": [{"name": "Test Artist"}],
        }

        mock_tracks_response = Mock()
        mock_tracks_response.status_code = 200
        mock_tracks_response.json.return_value = {
            "items": [
                {"name": "Track 1", "artists": [{"name": "Artist 1"}], "explicit": False},
                {"name": "Track 2", "artists": [{"name": "Artist 2"}], "explicit": True},
            ]
        }

        mock_get.side_effect = [mock_album_response, mock_tracks_response]

        client = SpotifyClient("id", "secret")
        client.access_token = "token"

        result = client.get_album_info("album123")

        assert result["name"] == "Test Album"
        assert result["creator"] == "Test Artist"
        assert len(result["tracks"]) == 2
        assert result["tracks"][0]["name"] == "Track 1"
        assert result["tracks"][1]["explicit"] is True

    @patch("core.spotify_client.requests.get")
    def test_get_music_data_playlist(self, mock_get):
        """Test get_music_data for playlist."""
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "name": "Playlist",
            "owner": {"display_name": "user"},
            "tracks": {"items": []}
        }
        mock_get.return_value = mock_response

        client = SpotifyClient("id", "secret")
        client.access_token = "token"

        result = client.get_music_data("https://open.spotify.com/playlist/abc")

        assert result is not None
        assert result["name"] == "Playlist"

    @patch("core.spotify_client.requests.get")
    def test_get_music_data_album(self, mock_get):
        """Test get_music_data for album."""
        mock_album = Mock()
        mock_album.status_code = 200
        mock_album.json.return_value = {"name": "Album", "artists": [{"name": "Artist"}]}

        mock_tracks = Mock()
        mock_tracks.status_code = 200
        mock_tracks.json.return_value = {"items": []}

        mock_get.side_effect = [mock_album, mock_tracks]

        client = SpotifyClient("id", "secret")
        client.access_token = "token"

        result = client.get_music_data("https://open.spotify.com/album/xyz")

        assert result is not None
        assert result["name"] == "Album"

    def test_get_music_data_invalid_url(self):
        """Test get_music_data with invalid URL."""
        client = SpotifyClient("id", "secret")
        client.access_token = "token"

        result = client.get_music_data("https://example.com")

        assert result is None