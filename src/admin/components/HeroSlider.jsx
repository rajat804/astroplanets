import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaUpload, FaEdit, FaImages } from "react-icons/fa";

const HeroSlider = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [slides, setSlides] = useState([]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [link, setLink] = useState("");
  const [isImageChanged, setIsImageChanged] = useState(false);

  // GET SLIDES
  const fetchSlides = async () => {
    try {
      const res = await axios.get(`${API_URL}/hero-slides`);
      setSlides(res.data.slides || []);
    } catch (error) {
      console.log("Fetch slides error:", error);
      setSlides([]);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  // IMAGE CHANGE
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setIsImageChanged(true);
    }
  };

  // ✅ UPLOAD / UPDATE - Fixed
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    if (editId) {
      if (!isImageChanged && !link.trim()) {
        return alert("Please update the link or select a new image");
      }
    } else {
      if (!image) {
        return alert("Please select an image");
      }
      if (slides.length >= 10) {
        return alert("Only 10 slides allowed");
      }
    }

    try {
      setLoading(true);

      const formData = new FormData();
      if (image && isImageChanged) {
        formData.append("image", image);
      }
      if (link.trim()) {
        formData.append("link", link);
      }

      // ✅ Debug log
      console.log("📤 Sending data:", {
        hasImage: !!image,
        hasLink: !!link,
        editMode: !!editId
      });

      if (editId) {
        await axios.put(
          `${API_URL}/hero-slides/${editId}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        alert("Slide Updated Successfully");
      } else {
        await axios.post(
          `${API_URL}/hero-slides/create`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        alert("Slide Uploaded Successfully");
      }

      // Reset form
      setImage(null);
      setPreview("");
      setEditId(null);
      setLink("");
      setIsImageChanged(false);
      fetchSlides();
    } catch (error) {
      console.error("❌ Submit error:", error);
      console.error("Response:", error.response?.data);
      const errorMessage = error.response?.data?.message || "Something went wrong";
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this slide?")) return;
    try {
      await axios.delete(`${API_URL}/hero-slides/${id}`);
      fetchSlides();
      alert("Deleted Successfully");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete slide");
    }
  };

  // EDIT
  const handleEdit = (slide) => {
    setPreview(slide.image);
    setEditId(slide._id);
    setLink(slide.link || "");
    setImage(null);
    setIsImageChanged(false);
  };

  const handleCancelEdit = () => {
    setImage(null);
    setPreview("");
    setEditId(null);
    setLink("");
    setIsImageChanged(false);
  };

  const slidesList = Array.isArray(slides) ? slides : [];

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">
        <FaImages className="text-3xl text-red-500" />
        <h1 className="text-3xl font-bold">Hero Slider</h1>
        <span className="ml-4 text-sm bg-gray-200 px-3 py-1 rounded-full">
          {slidesList.length}/10 Slides
        </span>
      </div>

      {/* FORM */}
      <div className="bg-white rounded-2xl p-6 shadow-lg mb-10">
        <form onSubmit={handleSubmit} className="space-y-5">
          {editId && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center justify-between">
              <span className="text-blue-700 font-medium">
                Editing Slide {slidesList.findIndex(s => s._id === editId) + 1}
              </span>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Cancel Edit
              </button>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {editId ? "Change Image (Optional)" : "Select Image *"}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="w-full border p-3 rounded-xl"
            />
            {editId && (
              <p className="text-xs text-gray-500 mt-1">
                {image ? "New image selected" : "Leave empty to keep current image"}
              </p>
            )}
          </div>

          {preview && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
              <img
                src={preview}
                alt="Slide preview"
                className="w-full md:w-72 h-48 object-cover rounded-xl border"
              />
              {editId && isImageChanged && (
                <p className="text-xs text-green-600 mt-1">✓ New image will be uploaded</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Redirect Link (Optional)
            </label>
            <input
              type="text"
              placeholder="Enter redirect link (e.g., https://example.com)"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full border p-3 rounded-xl"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl flex items-center gap-2 disabled:opacity-50"
          >
            <FaUpload />
            {loading ? "Processing..." : editId ? "Update Slide" : "Upload Slide"}
          </button>
        </form>
      </div>

      {/* SLIDES LIST */}
      {slidesList.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl">
          <FaImages className="text-5xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No slides uploaded yet</p>
          <p className="text-sm text-gray-400">Upload your first slide above</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {slidesList.map((slide, index) => (
            <div
              key={slide._id || index}
              className="bg-white rounded-2xl overflow-hidden shadow-lg border"
            >
              <img
                src={slide.image}
                alt={`Slide ${index + 1}`}
                className="w-full h-64 object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                }}
              />
              <div className="p-4">
                <h2 className="font-bold text-lg mb-2">Slide {index + 1}</h2>
                {slide.link && (
                  <p className="text-sm text-gray-500 mb-4 truncate">🔗 {slide.link}</p>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(slide)}
                    className="flex-1 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center gap-2"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(slide._id)}
                    className="flex-1 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white flex items-center justify-center gap-2"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroSlider;