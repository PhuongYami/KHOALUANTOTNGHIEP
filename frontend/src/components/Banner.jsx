import React from "react";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const navigate = useNavigate();
  return (
    <div className="relative h-screen bg-cover bg-center" style={{ backgroundImage: "url('https://i.pinimg.com/736x/5f/df/53/5fdf5377e8cee4b7e769d24312d40d47.jpg')" }}>
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative z-10 text-center flex flex-col justify-center items-center h-full text-white">
        <h1 className="text-5xl font-bold">Tìm kiếm tình yêu đích thực</h1>
        <p className="mt-4 text-lg">Kết nối với những người thành đạt, thông minh, và đầy hấp dẫn.</p>
        <button className="mt-6 bg-pink-600   text-white px-6 py-3 rounded-lg text-lg hover:bg-pink-700"
          onClick={() => navigate("/register")}>
          Tham gia ngay
        </button>
      </div>
    </div>
  );
};

export default Banner;
