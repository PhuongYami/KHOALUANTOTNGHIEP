import React from "react";

const Features = () => {
  const features = [
    { title: "Kết nối toàn cầu", description: "Tìm kiếm bạn đời từ khắp nơi trên thế giới.", icon: "🌍" },
    { title: "Bảo mật thông tin", description: "Dữ liệu của bạn được bảo vệ tuyệt đối.", icon: "🔒" },
    { title: "Tương tác dễ dàng", description: "Trò chuyện, chia sẻ và lên lịch hẹn dễ dàng.", icon: "💬" },
  ];

  return (
    <div className="py-16 bg-white">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800">Tính năng nổi bật</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
          {features.map((feature, index) => (
            <div key={index} className="p-6 rounded-lg shadow hover:shadow-lg transition">
              <div className="text-4xl">{feature.icon}</div>
              <h3 className="mt-4 text-xl font-semibold text-blue-600">{feature.title}</h3>
              <p className="mt-2 text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
