import React from "react";
import { useNavigate } from "react-router-dom";

const ProfileCard = ({ name, age, match, imgUrl, profileId }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-start space-x-6">
      <img
        src={imgUrl}
        alt="Profile"
        className="w-32 h-32 rounded-lg"
      />
      <div>
        <h2 className="text-xl font-bold text-gray-800">{name}, {age}</h2>
        <p className="text-sm text-gray-500 mt-2">{match}% Match</p>
        <button
          className="mt-4 bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700"
          onClick={() => navigate(`/profile/${profileId}`)}
        >
          View Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
