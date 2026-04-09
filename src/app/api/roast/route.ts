import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || !url.includes('spotify.com')) {
      return NextResponse.json(
        { error: 'Invalid Spotify URL' },
        { status: 400 }
      );
    }

    // In a real implementation, this would:
    // 1. Extract playlist/album ID from URL
    // 2. Use Spotify API to fetch playlist data
    // 3. Use the Python roast_generator.py

    // For demo purposes, return mock data
    const mockResult = {
      name: 'My Ultimate Chill Playlist',
      creator: 'demo_user',
      tracks: [
        {
          name: 'Blinding Lights',
          artist: 'The Weeknd',
          popularity: 95,
          explicit: false,
        },
        {
          name: 'Save Your Tears',
          artist: 'The Weeknd',
          popularity: 93,
          explicit: false,
        },
        {
          name: 'Levitating',
          artist: 'Dua Lipa',
          popularity: 92,
          explicit: false,
        },
        {
          name: 'Stay',
          artist: 'The Kid LAROI',
          popularity: 91,
          explicit: true,
        },
        {
          name: 'Peaches',
          artist: 'Justin Bieber',
          popularity: 89,
          explicit: false,
        },
        {
          name: 'Montero',
          artist: 'Lil Nas X',
          popularity: 88,
          explicit: true,
        },
        {
          name: 'Kiss Me More',
          artist: 'Doja Cat',
          popularity: 86,
          explicit: false,
        },
        {
          name: 'Good 4 U',
          artist: 'Olivia Rodrigo',
          popularity: 85,
          explicit: true,
        },
      ],
      roast: `"My Ultimate Chill Playlist" — oh, we've got a real music connoisseur here.

You know you've got "Levitating" next to "Blinding Lights" and you're calling this "chill"? That's like calling a stadium concert "intimate."

The fact that you have BOTH The Weeknd songs back-to-back tells me everything: you discovered this man during 2020 quarantine and never left. Respect the commitment, question the variety.

And "Stay" by The Kid LAROI? Cute. The explicit version, even cuter. You're not edgy, you're just 15.

This playlist is basically a TikTok algorithm's fever dream. It's giving "I only listen to what comes up on my For You page" energy.

But hey — at least your taste is consistent. Predictable, but consistent.`,
      avgPopularity: 89.9,
      explicitCount: 3,
    };

    return NextResponse.json(mockResult);
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
