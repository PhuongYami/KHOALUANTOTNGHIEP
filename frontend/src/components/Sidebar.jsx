import React from "react";

const Sidebar = () => (
  <aside className="hidden lg:block w-1/4 bg-white shadow-md p-4">
    <div className="bg-green-100 p-4 rounded-lg">
      <h2 className="text-lg font-bold text-green-600">Get Premium</h2>
      <p className="text-sm text-gray-600 mt-2">
        Unlock all features, view private photos, and connect without limits!
      </p>
      <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
        Upgrade to Premium
      </button>
    </div>
  </aside>
);

export default Sidebar;
