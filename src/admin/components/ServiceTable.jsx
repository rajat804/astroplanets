// src/components/admin/ServiceTable.jsx
import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { HiOutlineClock } from "react-icons/hi";

// Helper function to get category display name
const getCategoryDisplayName = (categoryValue) => {
  const categoryMap = {
    // Palmistry
    career_counselling: "Career Counselling",
    relationship_counselling: "Relationship Counselling",
    all_over_guidance: "All Over Guidance",
    // Vastu
    home_vastu_1bhk: "Home Vastu (1BHK)",
    home_vastu_2bhk: "Home Vastu (2BHK)",
    home_vastu_other: "Home Vastu (Other)",
    plot_vastu: "Plot Vastu",
    factory_vastu: "Factory Vastu",
    // Numerology
    name_numerology: "Name Numerology",
    marriage_compatibility: "Marriage Compatibility",
    vehicle_number_selection: "Vehicle Number Selection",
    // Yoga
    counselling: "Counselling",
  };
  return categoryMap[categoryValue] || categoryValue || "None";
};

// Helper function to get gradient badge styles
const getGradientBadge = (gradientKey) => {
  const colors = {
    purple: "bg-purple-100 text-purple-700",
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    orange: "bg-orange-100 text-orange-700",
    red: "bg-red-100 text-red-700",
    indigo: "bg-indigo-100 text-indigo-700",
    teal: "bg-teal-100 text-teal-700",
    yellow: "bg-yellow-100 text-yellow-700",
  };
  return colors[gradientKey] || "bg-gray-100 text-gray-700";
};

const ServiceTable = ({ services, onEdit, onDelete, onToggleStatus }) => {
  if (!services || services.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-8 text-center">
        <p className="text-gray-500">No services found. Click "Add New Service" to create one.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
            <tr className="text-left text-sm text-gray-600">
              <th className="px-6 py-4">Service</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Duration</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Discount</th>
              <th className="px-6 py-4">Gradient</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {services.map((service) => (
              <tr key={service._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {service.image ? (
                        <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100"></div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{service.title}</div>
                      <div className="text-xs text-gray-500">{service.benefits?.length || 0} benefits</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                    {getCategoryDisplayName(service.category)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 text-gray-600">
                    <HiOutlineClock className="w-4 h-4" />
                    <span>{service.duration || "N/A"}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-semibold text-gray-800">{service.price}</div>
                  {service.mrpPrice && (
                    <div className="text-xs text-gray-400 line-through">{service.mrpPrice}</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  {service.discount > 0 ? (
                    <span className="text-green-600 font-medium">{service.discount}% OFF</span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradientBadge(service.gradientKey)}`}>
                    {service.gradientKey || "purple"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onToggleStatus(service)}
                    className={`px-2 py-1 rounded-full text-xs font-medium transition ${
                      service.isActive
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}
                  >
                    {service.isActive ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(service)}
                      className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                    >
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(service._id)}
                      className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServiceTable;