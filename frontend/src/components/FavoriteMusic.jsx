import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import { fetchSongDetails } from "../services/spotifyService";

const FavoriteMusic = ({ songName }) => {
    const [songDetails, setSongDetails] = useState(null);

    useEffect(() => {
        const fetchSong = async () => {
            const song = await fetchSongDetails(songName);
            setSongDetails(song);
        };

        if (songName) {
            fetchSong();
        }
    }, [songName]);

    return (
        <section className="mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Favorite Music</h2>
            {songDetails ? (
                <div className="flex items-center space-x-4 p-4 bg-gray-100 rounded-lg shadow">
                    <img
                        src={songDetails.albumArt}
                        alt={songDetails.name}
                        className="w-12 h-12 rounded-lg"
                    />
                    <div className="flex-1">
                        <h3 className="text-gray-800 font-semibold text-md">{songDetails.name}</h3>
                        <p className="text-gray-500 text-sm">{songDetails.artist}</p>
                    </div>
                    <ReactPlayer
                        url={songDetails.url}
                        playing={false}
                        controls={true}
                        width="50px"
                        height="50px"
                        style={{ borderRadius: "50%" }}
                    />
                </div>
            ) : (
                <p className="text-gray-500">No favorite song selected yet.</p>
            )}
        </section>
    );
};

export default FavoriteMusic;
