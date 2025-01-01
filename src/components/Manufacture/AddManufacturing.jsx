import React, { useState, useRef, useCallback } from "react";
import { MdDeleteOutline } from "react-icons/md";

const ManufacturingForm = () => {
  const [newCategory, setNewCategory] = useState({ name: "" }); // Local state for category name
  const [preview, setPreview] = useState(null); // State for image preview
  const fileInputRef = useRef(null); // Reference to the file input element

  // Handle input change for category name
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory({ ...newCategory, [name]: value }); // Update the category name
  };

  // Handle file selection
  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file); // Generate preview URL
      setPreview(objectUrl); // Set preview URL
    } else {
      setPreview(null); // Reset preview if no file selected
    }
  }, []);

  // Handle image box click to open file picker
  const handleImageBoxClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger file input click
    }
  };

  // Handle image deletion
  const handleDeleteImage = (e) => {
    e.stopPropagation(); // Prevent triggering file input click
    setPreview(null); // Clear the preview
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the file input value
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", newCategory, preview);
    // Here, you would handle the form submission (e.g., send the data to the server)
  };

  return (
    <div className="card p-6 shadow-lg rounded-md bg-white">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Manufacturing</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            {/* Category Name Input */}
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Manufacturing Name
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter Manufacturing name"
                required
                value={newCategory.name || ""} // Ensure name is properly set
                onChange={handleInputChange} // Handle input change
              />
            </div>
          </div>

          {/* Image Preview Box */}
          <div className="relative flex items-center justify-center">
            <div
              className="w-full h-40 md:h-56 border-dashed border-2 border-gray-300 rounded-md flex items-center justify-center bg-gray-50 cursor-pointer relative"
              onClick={handleImageBoxClick} // Open file manager on click
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="h-full object-contain"
                />
              ) : (
                <span className="text-gray-500">+ Upload image </span>
              )}

              {/* Delete Icon */}
              {preview && (
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-md p-1 shadow-md hover:bg-red-600"
                  onClick={handleDeleteImage} // Handle image deletion
                >
                  <MdDeleteOutline />
                </button>
              )}
            </div>

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              name="logo"
              id="category-image"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange} // Handle file selection
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="reset"
            id="reset"
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md"
            onClick={handleDeleteImage} // Clear preview on reset
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary-500 hover:bg-primary-dark-500 text-white rounded-md"
            style={{ color: "white" }}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManufacturingForm;
