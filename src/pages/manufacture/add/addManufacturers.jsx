import React, { useState, useCallback, useRef } from "react";
import { MdDeleteOutline } from "react-icons/md";

const AddManufacturers = ({
  newManufacturer,
  onInputChange,
  onSubmit,
  setSelectedFile,
}) => {
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFileChange = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (file) {
        setSelectedFile(file); // Store the file itself
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl); // Set preview for image display
      } else {
        setPreview(null);
        setSelectedFile(null);
      }
    },
    [setSelectedFile]
  );

  // Handle image box click
  const handleImageBoxClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle image deletion
  const handleDeleteImage = (e) => {
    e.stopPropagation();
    setPreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="card p-6 shadow-lg rounded-md bg-white">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Manufacture</h2>
      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Manufacture Name
            </label>
            <input
              type="text"
              name="name"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter category name"
              required
              value={newManufacturer.name}
              onChange={onInputChange}
            />
          </div>

          {/* Image Preview Box */}
          <div className="relative flex items-center justify-center">
            <div
              className="w-full h-40 md:h-56 border-dashed border-2 border-gray-300 rounded-md flex items-center justify-center bg-gray-50 cursor-pointer relative"
              onClick={handleImageBoxClick}
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
                  onClick={handleDeleteImage}
                >
                  <MdDeleteOutline />
                </button>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              name="image"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="submit"
            className="px-4 py-2 bg-primary-500 hover:bg-primary-dark-500 text-white rounded-md"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default React.memo(AddManufacturers);
