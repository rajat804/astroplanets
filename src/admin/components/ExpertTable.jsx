import React from "react";
import { FaEdit, FaTrash, FaEye, FaEyeSlash, FaStar } from "react-icons/fa";

const ExpertTable = ({ experts, onEdit, onDelete, onToggleStatus }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-orange-50 to-red-50">
            <tr className="text-left text-sm text-gray-600">
              <th className="px-6 py-4">Expert</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Expertise</th>
              <th className="px-6 py-4">Specialties</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Featured</th>
              {/* <th className="px-6 py-4">Order</th> */}
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {experts.map((expert) => (
              <tr key={expert._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                      <img src={expert.image} alt={expert.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{expert.name}</div>
                      <div className="text-xs text-gray-500">{expert.icon}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">{expert.role}</td>
                <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{expert.expertise}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {expert.specialties?.slice(0, 2).map((spec, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs">
                        {spec}
                      </span>
                    ))}
                    {expert.specialties?.length > 2 && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                        +{expert.specialties.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onToggleStatus(expert)}
                    className={`px-2 py-1 rounded-full text-xs font-medium transition ${
                      expert.isActive
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}
                  >
                    {expert.isActive ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-6 py-4">
                  {expert.featured ? (
                    <FaStar className="text-yellow-500" />
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                {/* <td className="px-6 py-4 text-gray-600">{expert.order || 0}</td> */}
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(expert)}
                      className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                    >
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(expert._id)}
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

export default ExpertTable;