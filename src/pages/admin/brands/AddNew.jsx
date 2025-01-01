// import React, { useState } from "react";
// import { FaUpload, FaTrash } from "react-icons/fa";
// import { AiOutlineFileImage } from "react-icons/ai";
// import { useDispatch, useSelector } from "react-redux";
// import { toast, ToastContainer } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import FileUpload from "../../../components/FormInput/FileUpload";
// import PreviewImage from "../../../components/FormInput/PreviewImage";
// import { createBrand } from "../../../redux/slices/admin/brandSlice";
// import "react-toastify/dist/ReactToastify.css";
// import { fetchBrands } from "../../../redux/slices/admin/brandSlice";
// import { getUploadUrl, uploadImageToS3 } from "../../../utils/helpers";

// const AddNewBrand = () => {
//   const [selectedLanguage, setSelectedLanguage] = useState("en");

//   const [imagePreview, setImagePreview] = useState(null);
//   const [brandName, setBrandName] = useState("");
//   const [status, setStatus] = useState("inactive");
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [imageAltText, setImageAltText] = useState("");
//   // const [imageBase64, setImageBase64] = useState(null);

//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   // Retrieve loading and error states from the brand slice
//   const { loading, error } = useSelector((state) => state.brand);

//   const handleLanguageChange = (lang) => {
//     setSelectedLanguage(lang);
//   };

//   async function uploadImage(uploadConfig, file) {
//     try {
//       await uploadImageToS3(uploadConfig.url, file);
//       return uploadConfig.key; // Return the key if successful
//     } catch (error) {
//       console.error(`Failed to upload ${file.name}:`, error);
//       return null; // Return null on failure
//     }
//   }


//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
//     const maxSizeInBytes = 2 * 1024 * 1024; // 5MB

//     if (!file) return;

//     // File Type Validation
//     if (!allowedTypes.includes(file.type)) {
//       toast.error("Invalid file type. Only JPG, PNG, and GIF are allowed.");
//       return;
//     }

//     // File Size Validation
//     if (file.size > maxSizeInBytes) {
//       toast.error("File size exceeds 5MB limit.");
//       return;
//     }

//     // Set the selected file
//     setSelectedFile(file);

//     // Generate object URL for preview and set it
//     const objectUrl = URL.createObjectURL(file);
//     setImagePreview(objectUrl);


//     // Revoke object URL when the component unmounts or file changes to avoid memory leaks
//     return () => URL.revokeObjectURL(objectUrl);
//   };
//   // ------------------------------------

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const uploadConfig = await getUploadUrl(selectedFile.type, "brands");

//     const imageKey = await uploadImage(uploadConfig, selectedFile);

//     const data = {
//       name: brandName,
//       logo: imageKey,
//       imageAltText,
//     };

//     console.log("dataaa", data);
//     // Dispatch the createBrand action
//     dispatch(createBrand(data))
//       .unwrap() // unwrap to handle async response
//       .then(() => {
//         toast.success("Brand added successfully!");

//         dispatch(fetchBrands());
//         setTimeout(() => {
//           navigate("/brandlist");
//         }, 3000);
//       })
//       .catch((err) => {
//         toast.error(`Error adding brand: ${err.message}`);
//       });
//   };

//   const handleReset = () => {
//     setSelectedLanguage("en");
//     setImagePreview(null);
//     setBrandName("");
//     setImageAltText("");
//   };

//   const handleBrandNameChange = (e) => {
//     const value = e.target.value;
//     const alphabetRegex = /^[a-zA-Z\s]*$/; // Regex for alphabetic characters and spaces

//     if (!alphabetRegex.test(value)) {
//       toast.error("Brand Name must contain only alphabetic characters.");
//       return;
//     }

//     if (value.length > 50) {
//       toast.error("Brand Name must not exceed 50 characters.");
//       return;
//     }

//     setBrandName(value);
//   };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();

//   //   if (!brandName.trim()) {
//   //     toast.error("Brand Name is required.");
//   //     return;
//   //   }

//   //   const data = {
//   //     name: brandName,
//   //   };

//   //   dispatch(createBrand(data))
//   //     .unwrap()
//   //     .then(() => {
//   //       toast.success("Brand added successfully!");
//   //       dispatch(fetchBrands());
//   //       setTimeout(() => {
//   //         navigate("/brandlist");
//   //       }, 3000);
//   //     })
//   //     .catch((err) => {
//   //       toast.error(`Error adding brand: ${err.message}`);
//   //     });
//   // };
//   return (
//     <div className="content container-fluid snipcss-AwJk2">
//       <ToastContainer /> {/* Toast notifications container */}
//       <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
//         <h2 className="h1 mb-0 d-flex align-items-center gap-2">
//           <img
//             width="20"
//             src="https://6valley.6amtech.com/public/assets/back-end/img/brand.png"
//             alt="Brand"
//           />{" "}
//           Brand Setup
//         </h2>
//       </div>
//       <div className="row g-3">
//         <div className="col-md-12">
//           <div className="card mb-3">
//             <div className="card-body text-start">
//               <form className="brand-setup-form" onSubmit={handleSubmit}>
//                 <ul className="nav nav-tabs w-fit-content mb-4">
//                   <li className="nav-item">
//                     <span
//                       className={`nav-link form-system-language-tab cursor-pointer ${
//                         selectedLanguage === "en" ? "active" : ""
//                       }`}
//                       onClick={() => handleLanguageChange("en")}
//                     >
//                       {" "}
//                       English(EN){" "}
//                     </span>
//                   </li>
//                   <li className="nav-item">
//                     <span
//                       className={`nav-link form-system-language-tab cursor-pointer ${
//                         selectedLanguage === "sa" ? "" : ""
//                       }`}
//                       onClick={() => handleLanguageChange("sa")}
//                     >
//                       {" "}
//                       Arabic(SA){" "}
//                     </span>
//                   </li>
//                   <li className="nav-item">
//                     <span
//                       className={`nav-link form-system-language-tab cursor-pointer ${
//                         selectedLanguage === "bd" ? "" : ""
//                       }`}
//                       onClick={() => handleLanguageChange("bd")}
//                     >
//                       {" "}
//                       Bangla(BD){" "}
//                     </span>
//                   </li>
//                   <li className="nav-item">
//                     <span
//                       className={`nav-link form-system-language-tab cursor-pointer ${
//                         selectedLanguage === "in" ? "" : ""
//                       }`}
//                       onClick={() => handleLanguageChange("in")}
//                     >
//                       {" "}
//                       Hindi(IN){" "}
//                     </span>
//                   </li>
//                 </ul>
//                 <div className="row flex">
//                   <div className="col-md-6">
//                     <div className="col-md-12">
//                       <div
//                         className={`form-group form-system-language-form ${
//                           selectedLanguage === "en" ? "" : "d-none"
//                         }`}
//                         id="en-form"
//                       >
//                         <label htmlFor="name-en" className="title-color">
//                           {" "}
//                           Brand Name <span className="text-danger">
//                             *
//                           </span> (EN){" "}
//                         </label>
//                         {/* <input
//                           type="text"
//                           name="name-en"
//                           className="form-control outline-none hover:border-primary"
//                           id="name-en"
//                           placeholder="Ex : LUX"
//                           required
//                           value={brandName}
//                           onChange={(e) => setBrandName(e.target.value)}
//                         /> */}

//                         <input
//                           type="text"
//                           name="brandName"
//                           className="form-control outline-none hover:border-primary-500"
//                           id="name-en"
//                           placeholder="Ex: LUX"
//                           required
//                           value={brandName}
//                           onChange={handleBrandNameChange}
//                         />
//                       </div>
//                     </div>
//                     <div className="col-md-12">
//                       <div
//                         className={`form-group form-system-language-form ${
//                           selectedLanguage === "en" ? "" : "d-none"
//                         }`}
//                         id="en-alt-form"
//                       >
//                         <label htmlFor="alt-text-en" className="title-color">
//                           {" "}
//                           Image Alt Text <span className="text-danger">
//                             *
//                           </span>{" "}
//                           (EN){" "}
//                         </label>
//                         <input
//                           type="text"
//                           name="alt-text-en"
//                           className="form-control outline-none hover:border-primary-500"
//                           id="alt-text-en"
//                           placeholder="Ex : Brand Logo"
//                           required
//                           value={imageAltText}
//                           onChange={(e) => setImageAltText(e.target.value)}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                   <div className="col-md-6">
//                     {imagePreview ? (
//                       <PreviewImage
//                         image={imagePreview}
//                         altText={imageAltText}
//                       />
//                     ) : (
//                       <PreviewImage image={null} altText={imageAltText} />
//                     )}
//                     <FileUpload
//                       name="image"
//                       label="Logo"
//                       accept="image/*"
//                       onChange={handleImageChange}
//                     />
//                   </div>
//                 </div>

//                 <div className="d-flex justify-content-end">
//                   <button
//                     type="reset"
//                     className="btn border border-secondary-500 bg-secondary-500 mx-2"
//                     onClick={handleReset}
//                   >
//                     Reset
//                   </button>
//                   <button
//                     type="submit"
//                     className="btn bg-primary-500 hover:bg-primary-dark-500 text-white"
//                     style={{ color: "white" }}
//                     disabled={loading}
//                   >
//                     {loading ? "Submitting..." : "Submit"}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddNewBrand;


import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

import { createBrand, fetchBrands } from "../../../redux/slices/admin/brandSlice";
import { getUploadUrl, uploadImageToS3 } from "../../../utils/helpers";
import "react-toastify/dist/ReactToastify.css";
import { MdDeleteOutline } from "react-icons/md";

const AddNewBrand = () => {
  const [brandName, setBrandName] = useState("");
  const [imageAltText, setImageAltText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const fileInputRef = useRef(null); // Reference to file input
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.brand);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
    const maxSizeInBytes = 2 * 1024 * 1024; // 2MB

    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Only JPG, PNG, and GIF are allowed.");
      return;
    }

    if (file.size > maxSizeInBytes) {
      toast.error("File size exceeds 2MB limit.");
      return;
    }

    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleImageBoxClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger file input click
    }
  };

  const handleDeleteImage = () => {
    setImagePreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear file input value
    }
  };

  const handleBrandNameChange = (e) => {
    const value = e.target.value;
    const alphabetRegex = /^[a-zA-Z\s]*$/;

    if (!alphabetRegex.test(value)) {
      toast.error("Brand Name must contain only alphabetic characters.");
      return;
    }

    if (value.length > 50) {
      toast.error("Brand Name must not exceed 50 characters.");
      return;
    }

    setBrandName(value);
  };

  const handleReset = () => {
    setBrandName("");
    setImageAltText("");
    setImagePreview(null);
    setSelectedFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!brandName.trim()) {
      toast.error("Brand Name is required.");
      return;
    }

    if (!selectedFile) {
      toast.error("Brand logo is required.");
      return;
    }

    try {
      const uploadConfig = await getUploadUrl(selectedFile.type, "brands");
      const imageKey = await uploadImageToS3(uploadConfig.url, selectedFile);

      const data = {
        name: brandName,
        logo: imageKey,
        imageAltText,
      };

      await dispatch(createBrand(data)).unwrap();
      toast.success("Brand added successfully!");

      dispatch(fetchBrands());
      setTimeout(() => {
        navigate("/brandlist");
      }, 3000);
    } catch (err) {
      toast.error(`Error adding brand: ${err.message}`);
    }
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <ToastContainer />
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Add News</h1>

      <form onSubmit={handleSubmit} className="flex flex-wrap gap-6">
        {/* Left Section: Fields */}
        <div className="flex-1 min-w-[300px]">
          <div>
            <label htmlFor="brandName" className="block text-sm font-medium text-gray-700">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="brandName"
              name="brandName"
              className="mt-1 block w-full px-3 py-2 border  rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="Enter News Title"
              value={brandName}
              onChange={handleBrandNameChange}
              required
            />
          </div>

          <div className="mt-4">
            <label htmlFor="imageAltText" className="block text-sm font-medium text-gray-700">
              Image Alt Text <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="imageAltText"
              name="imageAltText"
              className="mt-1 block px-3 py-2 w-full border rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="Enter Image Alt Text"
              value={imageAltText}
              onChange={(e) => setImageAltText(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Right Section: Image Box */}
        <div className="flex-1 flex flex-col items-start">
          <div
            className="w-full h-40 md:h-56 border-dashed border-2 border-gray-300 rounded-md flex items-center justify-center bg-gray-50 relative cursor-pointer"
            onClick={handleImageBoxClick}
          >
            {/* Image Preview */}
            {imagePreview ? (
              <img
                src={imagePreview}
                alt={imageAltText || "Preview"}
                className="h-full object-contain"
              />
            ) : (
              <span className="text-gray-500">No image selected</span>
            )}

            {/* Delete Button */}
            {imagePreview && (
              <button
                type="button"
                className="absolute top-2 right-2 bg-red-500 text-white rounded-md p-1 shadow-md hover:bg-red-600"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering file input
                  handleDeleteImage();
                }}
              >
                <MdDeleteOutline />
              </button>
            )}
          </div>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            name="logo"
            id="brandLogo"
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <div className="w-full flex justify-end gap-4 mt-6">
          <button
            type="button"
            className="bg-gray-200 hover:bg-gray-300 text-white px-4 py-2 rounded"
            onClick={handleReset}
          >
            Reset
          </button>
          <button
            type="submit"
            className="bg-primary-500 hover:bg-primary-dark-500 text-white px-4 py-2 rounded"
            style={{color:"white"}}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewBrand;

