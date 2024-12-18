import React from "react";

const Introduction = () => {
  return (
    <div className="py-16 bg-gray-100">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800">Tại sao chọn EliteLusso?</h2>
        <p className="mt-4 text-gray-600">Nền tảng mạng xã hội cao cấp dành cho triệu phú độc thân.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-blue-600">Xác thực đáng tin cậy</h3>
            <p className="mt-2 text-gray-600">Mọi tài khoản đều được kiểm chứng bởi bên thứ ba.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-blue-600">Cá nhân hóa ghép đôi</h3>
            <p className="mt-2 text-gray-600">Thuật toán thông minh giúp bạn tìm kiếm người phù hợp.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-blue-600">Sự kiện độc quyền</h3>
            <p className="mt-2 text-gray-600">Tham gia những sự kiện dành riêng cho giới thượng lưu.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Introduction;
