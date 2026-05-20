import React from "react";
import { FaStar, FaGraduationCap } from "react-icons/fa";
import { HiOutlinePencilAlt, HiOutlineTrash, HiOutlineClock, HiOutlineUsers } from "react-icons/hi";

const CourseTable = ({ courses, searchQuery, onEdit, onDelete }) => {
  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-orange-50 to-red-50">
            <tr className="text-left text-sm text-gray-600">
              <th className="px-6 py-4">Course</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Level</th>
              <th className="px-6 py-4">Duration</th>
              <th className="px-6 py-4">MRP</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">GST</th>
              <th className="px-6 py-4">Discount</th>
              <th className="px-6 py-4">Rating</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-orange-100">
            {filteredCourses.map((course) => (
              <tr key={course._id} className="hover:bg-orange-50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center overflow-hidden">
                      <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-800 line-clamp-1">{course.title}</div>
                      <div className="text-xs text-gray-500">{course.mode} • {course.courseLanguage}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium capitalize">
                    {course.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    course.level === 'Master' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {course.level}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 text-gray-600">
                    <HiOutlineClock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="text-xs text-gray-400">{course.sessions} sessions</div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-gray-400 line-through text-sm">{course.mrpPrice || '-'}</span>
                </td>
                <td className="px-6 py-4 font-semibold text-red-600">{course.price}</td>
                <td className="px-6 py-4 text-gray-600">{course.gstPercentage || 18}%</td>
                <td className="px-6 py-4 text-green-600">{course.extraDiscount || 0}%</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-500" />
                    <span className="text-gray-600">{course.rating}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    course.isActive !== false ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {course.isActive !== false ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => onEdit(course)} className="p-2 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 transition">
                      <HiOutlinePencilAlt className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(course._id)} className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition">
                      <HiOutlineTrash className="w-4 h-4" />
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

export default CourseTable;