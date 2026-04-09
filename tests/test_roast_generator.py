import pytest
from unittest.mock import Mock, patch, MagicMock

# Mock the google module before importing
import sys
mock_genai = MagicMock()
sys.modules['google'] = mock_genai
sys.modules['google.generativeai'] = mock_genai.generativeai

from core.roast_generator import RoastGenerator


class TestRoastGenerator:
    """Tests for RoastGenerator class."""

    @patch("core.roast_generator.genai.configure")
    def test_init_with_valid_api_key(self, mock_configure):
        """Test initialization with valid API key."""
        generator = RoastGenerator("test_api_key")
        mock_configure.assert_called_once_with(api_key="test_api_key")
        assert generator.model is not None

    @patch("core.roast_generator.genai.configure")
    def test_init_failure_handling(self, mock_configure):
        """Test initialization handles exceptions gracefully."""
        mock_configure.side_effect = Exception("Invalid API key")
        generator = RoastGenerator("invalid_key")
        assert generator.model is None

    def test_generate_roast_no_model(self):
        """Test roast generation when model is None."""
        generator = RoastGenerator("fake_key")
        generator.model = None

        result = generator.generate_roast({"name": "Test", "tracks": []})

        assert "offline" in result.lower()

    def test_generate_roast_no_tracks(self):
        """Test roast generation with empty tracks list."""
        generator = RoastGenerator("fake_key")
        generator.model = Mock()

        result = generator.generate_roast({"name": "Test", "tracks": []})

        assert "no tracks" in result.lower()

    @patch("core.roast_generator.genai.GenerativeModel")
    @patch("core.roast_generator.genai.configure")
    def test_generate_roast_success(self, mock_configure, mock_model_class):
        """Test successful roast generation."""
        mock_model = Mock()
        mock_response = Mock()
        mock_response.text = "This is a roasting response!"
        mock_model.generate_content.return_value = mock_response
        mock_model_class.return_value = mock_model

        generator = RoastGenerator("test_key")
        generator.model = mock_model

        music_data = {
            "name": "My Playlist",
            "creator": "test_user",
            "tracks": [
                {"name": "Song1", "artist": "Artist1", "popularity": 80, "explicit": False},
                {"name": "Song2", "artist": "Artist2", "popularity": 70, "explicit": True},
            ],
        }

        result = generator.generate_roast(music_data)

        assert result == "This is a roasting response!"
        mock_model.generate_content.assert_called_once()

    @patch("core.roast_generator.genai.GenerativeModel")
    @patch("core.roast_generator.genai.configure")
    def test_generate_roast_empty_response_fallback(self, mock_configure, mock_model_class):
        """Test fallback when API returns empty response."""
        mock_model = Mock()
        mock_response = Mock()
        mock_response.text = ""
        mock_model.generate_content.return_value = mock_response
        mock_model_class.return_value = mock_model

        generator = RoastGenerator("test_key")
        generator.model = mock_model

        music_data = {"name": "Test", "tracks": [{"name": "Song", "artist": "A"}]}

        result = generator.generate_roast(music_data)

        assert "fallback" in result.lower() or "wow" in result.lower()

    @patch("core.roast_generator.genai.GenerativeModel")
    @patch("core.roast_generator.genai.configure")
    def test_generate_roast_exception_handling(self, mock_configure, mock_model_class):
        """Test exception handling during roast generation."""
        mock_model = Mock()
        mock_model.generate_content.side_effect = Exception("API Error")
        mock_model_class.return_value = mock_model

        generator = RoastGenerator("test_key")
        generator.model = mock_model

        music_data = {"name": "Test", "tracks": [{"name": "Song", "artist": "A"}]}

        result = generator.generate_roast(music_data)

        assert len(result) > 0

    @patch("core.roast_generator.genai.GenerativeModel")
    @patch("core.roast_generator.genai.configure")
    def test_generate_custom_roast(self, mock_configure, mock_model_class):
        """Test custom prompt roast generation."""
        mock_model = Mock()
        mock_response = Mock()
        mock_response.text = "Custom roast response"
        mock_model.generate_content.return_value = mock_response
        mock_model_class.return_value = mock_model

        generator = RoastGenerator("test_key")
        generator.model = mock_model

        result = generator.generate_custom_roast("Roast this: test prompt")

        assert result == "Custom roast response"
        mock_model.generate_content.assert_called_once_with("Roast this: test prompt")

    def test_generate_custom_roast_no_model(self):
        """Test custom roast when model is None."""
        generator = RoastGenerator("fake_key")
        generator.model = None

        result = generator.generate_custom_roast("test prompt")

        assert "not available" in result.lower()

    @patch("core.roast_generator.genai.GenerativeModel")
    @patch("core.roast_generator.genai.configure")
    def test_generate_custom_roast_exception(self, mock_configure, mock_model_class):
        """Test custom roast exception handling."""
        mock_model = Mock()
        mock_model.generate_content.side_effect = Exception("Error")
        mock_model_class.return_value = mock_model

        generator = RoastGenerator("test_key")
        generator.model = mock_model

        result = generator.generate_custom_roast("test")

        assert "error" in result.lower()

    @patch("core.roast_generator.genai.GenerativeModel")
    @patch("core.roast_generator.genai.configure")
    def test_popularity_calculation(self, mock_configure, mock_model_class):
        """Test average popularity is calculated correctly."""
        mock_model = Mock()
        mock_response = Mock()
        mock_response.text = "Roast"
        mock_model.generate_content.return_value = mock_response
        mock_model_class.return_value = mock_model

        generator = RoastGenerator("test_key")
        generator.model = mock_model

        music_data = {
            "name": "Test",
            "creator": "User",
            "tracks": [
                {"name": "Song1", "artist": "A1", "popularity": 90, "explicit": False},
                {"name": "Song2", "artist": "A2", "popularity": 50, "explicit": False},
            ],
        }

        generator.generate_roast(music_data)

        call_args = mock_model.generate_content.call_args[0][0]
        assert "70" in call_args or "70.0" in call_args

    @patch("core.roast_generator.genai.GenerativeModel")
    @patch("core.roast_generator.genai.configure")
    def test_explicit_count_calculation(self, mock_configure, mock_model_class):
        """Test explicit track count is calculated correctly."""
        mock_model = Mock()
        mock_response = Mock()
        mock_response.text = "Roast"
        mock_model.generate_content.return_value = mock_response
        mock_model_class.return_value = mock_model

        generator = RoastGenerator("test_key")
        generator.model = mock_model

        music_data = {
            "name": "Test",
            "creator": "User",
            "tracks": [
                {"name": "Song1", "artist": "A1", "popularity": 80, "explicit": True},
                {"name": "Song2", "artist": "A2", "popularity": 70, "explicit": False},
                {"name": "Song3", "artist": "A3", "popularity": 60, "explicit": True},
            ],
        }

        generator.generate_roast(music_data)

        call_args = mock_model.generate_content.call_args[0][0]
        assert "2" in call_args