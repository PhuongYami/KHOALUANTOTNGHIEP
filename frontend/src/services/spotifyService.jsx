import axios from "axios";

const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_SEARCH_URL = "https://api.spotify.com/v1/search";

const getAccessToken = async () => {
    const credentials = btoa(
        `${process.env.REACT_APP_SPOTIFY_CLIENT_ID}:${process.env.REACT_APP_SPOTIFY_CLIENT_SECRET}`
    );

    const response = await axios.post(SPOTIFY_TOKEN_URL, "grant_type=client_credentials", {
        headers: {
            Authorization: `Basic ${credentials}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });

    return response.data.access_token;
};

export const fetchSongDetails = async (songName) => {
    try {
        const accessToken = await getAccessToken();

        const response = await axios.get(SPOTIFY_SEARCH_URL, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params: {
                q: songName,
                type: "track",
                limit: 1,
            },
        });

        const song = response.data.tracks.items[0];

        return {
            name: song.name,
            artist: song.artists[0].name,
            url: song.external_urls.spotify,
            albumArt: song.album.images[0].url,
        };
    } catch (error) {
        console.error("Error fetching song details:", error);
        return null;
    }
};
