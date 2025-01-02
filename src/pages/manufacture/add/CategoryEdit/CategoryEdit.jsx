

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAuthData } from "../../../../../../../utils/authHelper"; // Import function to get token
import apiConfig from "../../../../../../../config/apiConfig"; // Import apiConfig for API URLs
import {
  getUploadUrl,
  uploadImageToS3,
} from "../../../../../../../utils/helpers";
import { MdDeleteOutline } from "react-icons/md";

const ApiUrl = `${apiConfig.admin}`; // Use admin role

const CategoryUpdate = () => {
  const { id } = useParams(); // Extract category ID from URL params
  const navigate = useNavigate(); // To navigate after successful update
  const [categoryData, setCategoryData] = useState({
    name: "",
    priority: 0,
    logo: "",
  });
  const [selectedFile, setSelectedFile] = useState(null); // To store selected file for upload
  const [previewUrl, setPreviewUrl] = useState(""); // To store the image preview URL
  const [selectedLang, setSelectedLang] = useState("en"); // Set default language to English

  // Fetch category data by ID
  useEffect(() => {
    if (id) {
      fetchCategoryById(id);
    }
  }, [id]);

  const fetchCategoryById = async (categoryId) => {
    try {
      const { token } = getAuthData(); // Get token
      const response = await axios.get(`${ApiUrl}/categories/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { name, priority, logo } = response.data.doc;
      setCategoryData({ name, priority, logo });
      setPreviewUrl(`${apiConfig.bucket}/${logo}`); // Set initial preview URL
    } catch (error) {
      console.error("Failed to fetch category:", error);
      toast.error("Failed to fetch category data");
    }
  };

  // Handle input change for category form fields
  const handleInputChange = (e) => {
    setCategoryData({ ...categoryData, [e.target.name]: e.target.value });
  };

  // Handle file selection for logo upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    // Create a preview URL for the selected file
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  };

  // Handle image deletion
  const handleDeleteImage = (e) => {
    e.stopPropagation(); // Prevent triggering file picker
    setSelectedFile(null); // Remove the selected file
    setPreviewUrl(""); // Remove the preview image
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let logoKey = categoryData.logo; // Keep existing logo if no new file is uploaded

    if (selectedFile) {
      try {
        // Ensure to get the correct upload URL
        const uploadConfig = await getUploadUrl(selectedFile.type, "category");
        const { url } = uploadConfig; // Ensure you extract the url correctly
        await uploadImageToS3(url, selectedFile); // Pass only the URL and the file
        logoKey = uploadConfig.key; // Use the key from the uploadConfig
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Failed to upload image"); // Show error toast
        return; // Exit if image upload fails
      }
    }

    const formData = {
      name: categoryData.name,
      priority: categoryData.priority,
      logo: logoKey, // Use the new logo key from upload or existing
    };

    try {
      const { token } = getAuthData(); // Get token
      console.log("Updating category with ID:", id);
      const response = await fetch(`${ApiUrl}/categories/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update category");
      }

      const responseData = await response.json();
      console.log("Category updated:", responseData);
      toast.success("Category updated successfully"); // Show success toast
      navigate("/categories"); // Navigate after successful update
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Error updating category"); // Show error toast
    }
  };

  return (
    <div className="content container-fluid px-4">
      <ToastContainer />
      <div className="mb-3">
        <h2 className="h1 mb-0 d-flex gap-3">
          {id ? "Edit Category" : "Add Category"}
        </h2>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <ul className="nav nav-tabs mb-4">
                  {[{
                    code: "en", label: "English (EN)"
                  }, {
                    code: "sa", label: "Arabic (SA)"
                  }, {
                    code: "bd", label: "Bangla (BD)"
                  }, {
                    code: "in", label: "Hindi (IN)"
                  }].map((lang) => (
                    <li key={lang.code} className="nav-item">
                      <span
                        className={`nav-link cursor-pointer text-capitalize ${
                          selectedLang === lang.code ? "active" : ""
                        }`}
                        onClick={() => setSelectedLang(lang.code)}
                      >
                        {lang.label}
                      </span>
                    </li>
                  ))}
                </ul>
                <CategoryForm
                  selectedLang={selectedLang}
                  categoryData={categoryData}
                  onInputChange={handleInputChange}
                  onFileChange={handleFileChange}
                  previewUrl={previewUrl} // Pass previewUrl to CategoryForm
                  onDeleteImage={handleDeleteImage} // Pass the delete handler
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CategoryForm = ({
  selectedLang,
  categoryData,
  onInputChange,
  onFileChange,
  previewUrl, // Accept previewUrl as a prop
  onDeleteImage, // Accept onDeleteImage handler as a prop
}) => {
  return (
    <div className="row">
      <div className="col-lg-6">
        {[{
          code: "en", label: "English (EN)"
        }, {
          code: "sa", label: "Arabic (SA)"
        }, {
          code: "bd", label: "Bangla (BD)"
        }, {
          code: "in", label: "Hindi (IN)"
        }].map((lang) => (
          <div
            key={lang.code}
            className={`form-group ${selectedLang === lang.code ? "" : "d-none"}`}
          >
            <label className="title-color">
              Category Name<span className="text-danger">*</span> ({lang.label})
            </label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Category Name"
              required={lang.code === "en"}
              value={categoryData.name || ""}
              onChange={onInputChange}
            />
          </div>
        ))}
        <div className="form-group">
          <label className="title-color">Category Logo</label>
          <span className="text-info d-block">
            <span className="text-danger">*</span> Ratio 1:1 (500 x 500 px)
          </span>
          <div
            className="position-relative d-flex justify-content-center align-items-center"
            style={{
              width: "300px",
              height: "300px",
              border: "1px dashed #ccc",
              borderRadius: "8px",
              cursor: "pointer",
            }}
            onClick={() => document.getElementById("file-input").click()} // Trigger file input
          >
            {/* Delete Button */}
            {previewUrl && (
              <button
                type="button"
                className="position-absolute"
                style={{
                  top: "10px",
                  right: "10px",
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={onDeleteImage} // Call the delete handler
              >
                <MdDeleteOutline />
              </button>
            )}

            {/* Image Preview */}
            <img
              className="img-thumbnail"
              src={previewUrl || `${apiConfig.bucket}/image-place-holder.png`} // Fallback image
              alt="Category Logo"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />

            {/* Hidden File Input */}
            <input
              type="file"
              id="file-input"
              className="d-none"
              accept="image/*"
              onChange={onFileChange} // Handles image selection
            />
          </div>
        </div>
      </div>
      <div className="col-12 mt-4 d-flex justify-content-end">
        <button type="submit" className="btn btn-primary px-4 py-2 bg-primary-500 hover:bg-primary-dark-500 shadow-lg " style={{color:"white"}}>
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default CategoryUpdate;



