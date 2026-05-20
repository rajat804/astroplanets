import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaTrash,
  FaUpload,
  FaEdit,
  FaImages,
} from "react-icons/fa";

const HeroSlider = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [slides, setSlides] = useState([]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
const [link, setLink] = useState("");
  // GET SLIDES
  const fetchSlides = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/hero-slides`
      );

      setSlides(res.data.slides);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  // IMAGE CHANGE
  const handleImage = (e) => {
    const file = e.target.files[0];

    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // UPLOAD / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      return alert("Select image");
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("image", image);
      formData.append("link", link);

      // UPDATE
      if (editId) {
        await axios.put(
          `${API_URL}/hero-slides/${editId}`,
          formData
        );

        alert("Slide Updated");
      }

      // CREATE
      else {
        if (slides.length >= 10) {
          return alert(
            "Only 10 slides allowed"
          );
        }

        await axios.post(
          `${API_URL}/hero-slides/create`,
          formData
        );

        alert("Slide Uploaded");
      }

      setImage(null);
      setPreview("");
      setEditId(null);
      setLink("");

      fetchSlides();
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Delete this slide?"
      )
    )
      return;

    try {
      await axios.delete(
        `${API_URL}/hero-slides/${id}`
      );

      fetchSlides();

      alert("Deleted");
    } catch (error) {
      console.log(error);
    }
  };

  // EDIT
  const handleEdit = (slide) => {
    setPreview(slide.image);
    setEditId(slide._id);
    setLink(slide.link || "");
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">
        <FaImages className="text-3xl text-red-500" />

        <h1 className="text-3xl font-bold">
          Hero Slider
        </h1>
      </div>

      {/* FORM */}
      <div className="bg-white rounded-2xl p-6 shadow-lg mb-10">
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* IMAGE INPUT */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="w-full border p-3 rounded-xl"
          />

          {/* PREVIEW */}
          {preview && (
            <img
              src={preview}
              alt=""
              className="w-full md:w-72 h-48 object-cover rounded-xl border"
            />
          )}
<input
  type="text"
  placeholder="Enter redirect link"
  value={link}
  onChange={(e) => setLink(e.target.value)}
  className="w-full border p-3 rounded-xl"
/>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl flex items-center gap-2"
          >
            <FaUpload />

            {loading
              ? "Processing..."
              : editId
              ? "Update Slide"
              : "Upload Slide"}
          </button>
        </form>
      </div>

      {/* SLIDES */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {slides.map((slide, index) => (
          <div
            key={slide._id}
            className="bg-white rounded-2xl overflow-hidden shadow-lg border"
          >
            <img
              src={slide.image}
              alt=""
              className="w-full h-64 object-cover"
            />

            <div className="p-4">
              <h2 className="font-bold text-lg mb-4">
                Slide {index + 1}
              </h2>

              <div className="flex gap-3">
                {/* EDIT */}
                <button
                  onClick={() =>
                    handleEdit(slide)
                  }
                  className="flex-1 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center gap-2"
                >
                  <FaEdit />
                  Edit
                </button>

                {/* DELETE */}
                <button
                  onClick={() =>
                    handleDelete(slide._id)
                  }
                  className="flex-1 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white flex items-center justify-center gap-2"
                >
                  <FaTrash />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;