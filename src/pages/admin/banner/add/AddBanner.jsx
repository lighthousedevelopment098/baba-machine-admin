// import React, { useState, useEffect } from "react";
// import { FiSkipBack } from "react-icons/fi";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import PreviewImage from "../../../../components/FormInput/PreviewImage";
// import FileUpload from "../../../../components/FormInput/FileUpload";
// import apiConfig from "../../../../config/apiConfig";
// import { getAuthData } from "../../../../utils/authHelper";
// import { getUploadUrl, uploadImageToS3 } from "../../../../utils/helpers";
// import Uploading from "../../../../components/LoodingSpinner/Uploading";

// const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

// const ApiUrl = `${apiConfig.admin}`;
// const ApiUrls = `${apiConfig.seller}`;

// const AddBannerForm = () => {
//   const [bannerType, setBannerType] = useState("main-banner");
//   const [resourceType, setResourceType] = useState("");
//   const [productId, setProductId] = useState("");
//   const [category, setCategory] = useState("");
//   const [brand, setBrand] = useState("");
//   const [bannerImage, setBannerImage] = useState(null);
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [brands, setBrands] = useState([]);
//   const [token, setToken] = useState("");
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [loading, setLoading] = useState(false); // New loading state

//   const navigate = useNavigate();

//   useEffect(() => {
//     const { token } = getAuthData();
//     setToken(token);

//     const fetchData = async () => {
//       if (!resourceType) return;
//       try {
//         const endpoints = {
//           product: `${ApiUrls}/products/`,
//           category: `${ApiUrl}/categories/`,
//           brand: `${ApiUrl}/brands/`,
//         };

//         const response = await axios.get(endpoints[resourceType], {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (resourceType === "product") setProducts(response.data.doc);
//         else if (resourceType === "category") setCategories(response.data.doc);
//         else if (resourceType === "brand") setBrands(response.data.doc);
//       } catch (error) {
//         toast.error("Error fetching data.");
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, [resourceType, token]);

//   const handleBannerTypeChange = (e) => setBannerType(e.target.value);
//   const handleResourceTypeChange = (e) => {
//     setResourceType(e.target.value);
//     setProductId("");
//     setCategory("");
//     setBrand("");
//   };
//   const handleProductChange = (e) => setProductId(e.target.value);
//   const handleCategoryChange = (e) => setCategory(e.target.value);
//   const handleBrandChange = (e) => setBrand(e.target.value);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file && file.size <= MAX_IMAGE_SIZE) {
//       setSelectedFile(file);
//       setBannerImage(URL.createObjectURL(file));
//     } else {
//       toast.error("Image size exceeds 2MB.");
//     }
//   };

//   async function uploadImage(uploadConfig, file) {
//     try {
//       await uploadImageToS3(uploadConfig.url, file);
//       return uploadConfig.key;
//     } catch (error) {
//       console.error("Failed to upload:", error);
//       return null;
//     }
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true); // Show loading spinner

//     if (!selectedFile) {
//       toast.error("Please upload an image.");
//       setLoading(false); // Hide loading spinner if error occurs
//       return;
//     }

//     const uploadConfig = await getUploadUrl(selectedFile.type, "banners");
//     const imageKey = await uploadImage(uploadConfig, selectedFile);

//     if (!imageKey) {
//       toast.error("Image upload failed.");
//       setLoading(false); // Hide loading spinner if error occurs
//       return;
//     }

//     const data = {
//       bannerType,
//       resourceType,
//       resourceId: { product: productId, category, brand }[resourceType],
//       url: e.target.url.value,
//       publish: false,
//       bannerImage: imageKey,
//     };

//     try {
//       const response = await axios.post(`${ApiUrl}/banners`, data, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (response.status === 201) {
//         toast.success("Banner submitted successfully");
//         setTimeout(() => {
//           setLoading(false); // Hide loading spinner
//           navigate("/bannersetup"); // Navigate to banner list
//         }, 2000);
//       } else {
//         toast.error("Failed to submit banner.");
//         setLoading(false); // Hide loading spinner if error occurs
//       }
//     } catch (error) {
//       toast.error("Submission error.");
//       console.error("Error submitting banner:", error.response?.data || error);
//       setLoading(false); // Hide loading spinner if error occurs
//     }
//   };

//   return (
//     <div className="content container-fluid">
//       <ToastContainer />
//       {loading && <Uploading />} {/* Show loading indicator */}
//       <div className="d-flex justify-content-between mb-3">
//         <div>
//           <h2 className="h1 mb-1 text-capitalize d-flex align-items-center gap-2">
//             <img
//               width="20"
//               src="https://6valley.6amtech.com/public/assets/back-end/img/banner.png"
//               alt="Banner Icon"
//             />{" "}
//             Add Banner
//           </h2>
//         </div>
//         <div>
//           <Link
//             to="/bannersetup"
//             className="btn flex align-items-center gap-2 text-white"
//             style={{ background: "lightgreen" }}
//           >
//             <FiSkipBack /> Back
//           </Link>
//         </div>
//       </div>
//       <div className="row text-start">
//         <div className="col-md-12 ">
//           <div className="card">
//             <div className="card-body">
//               <form onSubmit={handleSubmit} className="banner_form">
//                 <div className="row g-3">
//                   <div className="col-md-6">
//                     <div className="form-group">
//                       <label
//                         htmlFor="banner_type"
//                         className="title-color text-capitalize"
//                       >
//                         Banner Type
//                       </label>
//                       <select
//                         className="form-control outline-none hover:border-primary-500"
//                         name="banner_type"
//                         id="banner_type"
//                         value={bannerType}
//                         onChange={handleBannerTypeChange}
//                       >
//                         <option value="">Select Banner Type</option>
//                         <option value="main-banner">Main Banner</option>
//                         <option value="popup-banner">Popup Banner</option>
//                         <option value="footer-banner">Footer Banner</option>
//                         <option value="main-section-banner">
//                           Main Section Banner
//                         </option>
//                       </select>
//                     </div>

//                     <div className="form-group">
//                       <label
//                         htmlFor="url"
//                         className="title-color text-capitalize"
//                       >
//                         Banner URL
//                       </label>
//                       <input
//                         type="url"
//                         name="url"
//                         className="form-control outline-none hover:border-primary-500"
//                         id="url"
//                         required
//                         placeholder="Enter URL"
//                         defaultValue=""
//                       />
//                     </div>

//                     <div className="form-group">
//                       <label
//                         htmlFor="resource_type"
//                         className="title-color text-capitalize"
//                       >
//                         Resource Type
//                       </label>
//                       <select
//                         className="form-control outline-none hover:border-primary-500"
//                         name="resource_type"
//                         id="resource_type"
//                         value={resourceType}
//                         onChange={handleResourceTypeChange}
//                       >
//                         <option value="">Select Resource Type</option>
//                         <option value="product">Product</option>
//                         <option value="category">Category</option>
//                         <option value="brand">Brand</option>
//                       </select>
//                     </div>

//                     {resourceType === "product" && (
//                       <div className="form-group">
//                         <label
//                           htmlFor="product_id"
//                           className="title-color text-capitalize"
//                         >
//                           Product
//                         </label>
//                         <select
//                           className="form-control outline-none hover:border-primary-500"
//                           name="product_id"
//                           id="product_id"
//                           value={productId}
//                           onChange={handleProductChange}
//                         >
//                           <option value="">Select Product</option>
//                           {products.map((product) => (
//                             <option key={product._id} value={product._id}>
//                               {product.name}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                     )}

//                     {resourceType === "category" && (
//                       <div className="form-group">
//                         <label
//                           htmlFor="category_id"
//                           className="title-color text-capitalize"
//                         >
//                           Category
//                         </label>
//                         <select
//                           className="form-control outline-none hover:border-primary-500"
//                           name="category_id"
//                           id="category_id"
//                           value={category}
//                           onChange={handleCategoryChange}
//                         >
//                           <option value="">Select Category</option>
//                           {categories.map((cat) => (
//                             <option key={cat._id} value={cat._id}>
//                               {cat.name}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                     )}

//                     {resourceType === "brand" && (
//                       <div className="form-group">
//                         <label
//                           htmlFor="brand_id"
//                           className="title-color text-capitalize"
//                         >
//                           Brand
//                         </label>
//                         <select
//                           className="form-control outline-none hover:border-primary-500"
//                           name="brand_id"
//                           id="brand_id"
//                           value={brand}
//                           onChange={handleBrandChange}
//                         >
//                           <option value="">Select Brand</option>
//                           {brands.map((brandItem) => (
//                             <option key={brandItem._id} value={brandItem._id}>
//                               {brandItem.name}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                     )}
//                   </div>

//                   <div className="col-lg-6">
//                     <PreviewImage
//                       image={bannerImage}
//                       altText="Banner image"
//                       style={{ width: "200px" }}
//                     />
//                     <FileUpload
//                       name="image"
//                       label="Banner Image (Ratio 1:1)"
//                       accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
//                       onChange={handleImageChange}
//                       required
//                     />
//                   </div>
//                 </div>
//                 <div className="d-flex justify-content-end mt-3">
//                   <button
//                     type="submit"
//                     className="btn bg-primary-500 hover:bg-primary-dark-500"
//                     style={{ color: "white" }}
//                   >
//                     Submit
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

// export default AddBannerForm;




import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getUploadUrl, uploadImageToS3 } from "../../../../utils/helpers";
import apiConfig from "../../../../config/apiConfig";
import axios from "axios";
import { MdDeleteOutline } from "react-icons/md";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
const ApiUrl = `${apiConfig.admin}`;

const AddBannerForm = () => {
  const [banners, setBanners] = useState([]); // Store uploaded banners
  const [previews, setPreviews] = useState([]); // Store previews
  const [bannerDetails, setBannerDetails] = useState([]); // Store banner names and image texts
  const navigate = useNavigate();

  const handleBannerChange = useCallback((e, index) => {
    const file = e.target.files[0];
    if (file && file.size <= MAX_IMAGE_SIZE) {
      const objectUrl = URL.createObjectURL(file);
      setPreviews((prev) => {
        const updatedPreviews = [...prev];
        updatedPreviews[index] = objectUrl;
        return updatedPreviews;
      });
      setBanners((prev) => {
        const updatedBanners = [...prev];
        updatedBanners[index] = file;
        return updatedBanners;
      });
      // Ensure there's a corresponding entry for the new banner's details
      setBannerDetails((prev) => {
        const updatedDetails = [...prev];
        if (!updatedDetails[index]) {
          updatedDetails[index] = { name: "", text: "" };
        }
        return updatedDetails;
      });
    } else {
      toast.error("Image size exceeds 2MB.");
    }
  }, []);

  const handleDetailChange = (index, field, value) => {
    setBannerDetails((prev) => {
      const updatedDetails = [...prev];
      updatedDetails[index] = {
        ...updatedDetails[index],
        [field]: value,
      };
      return updatedDetails;
    });
  };

  const handleBannerDelete = (index) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setBanners((prev) => prev.filter((_, i) => i !== index));
    setBannerDetails((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (banners.length === 0) {
      toast.error("Please upload at least one banner image.");
      return;
    }

    const uploadedKeys = [];
    for (const banner of banners) {
      const uploadConfig = await getUploadUrl(banner.type, "banners");
      const imageKey = await uploadImageToS3(uploadConfig.url, banner);
      if (imageKey) {
        uploadedKeys.push(imageKey);
      } else {
        toast.error("Image upload failed.");
        return;
      }
    }

    const data = {
      banners: uploadedKeys.map((key, index) => ({
        key,
        name: bannerDetails[index]?.name || "",
        text: bannerDetails[index]?.text || "",
      })),
    };

    try {
      const response = await axios.post(`${ApiUrl}/banners`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        toast.success("Banners added successfully.");
        navigate("/bannerlist");
      } else {
        toast.error("Failed to add banners.");
      }
    } catch (error) {
      toast.error("Submission error.");
    }
  };

  return (
    <div className="card p-6 shadow-lg rounded-md bg-white">
      <ToastContainer />
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Banners</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {previews.map((preview, index) => (
            <div key={index} className="relative p-4 border border-gray-300 rounded-md">
              <div
                className="relative border border-dashed border-gray-300 rounded-md flex items-center justify-center bg-gray-50 h-40 cursor-pointer"
                onClick={() => document.getElementById(`banner-input-${index}`).click()}
              >
                <img
                  src={preview}
                  alt={`Banner ${index + 1}`}
                  className="w-full h-full object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBannerDelete(index);
                  }}
                  className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-md"
                >
                  <MdDeleteOutline />
                </button>
                <input
                  type="file"
                  id={`banner-input-${index}`}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleBannerChange(e, index)}
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Banner Name
                </label>
                <input
                  type="text"
                  value={bannerDetails[index]?.name || ""}
                  onChange={(e) =>
                    handleDetailChange(index, "name", e.target.value)
                  }
                  className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter banner name"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Image Text
                </label>
                <input
                  type="text"
                  value={bannerDetails[index]?.text || ""}
                  onChange={(e) =>
                    handleDetailChange(index, "text", e.target.value)
                  }
                  className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter image text"
                />
              </div>
            </div>
          ))}
          {/* Add New Banner Box */}
          <div
            className="relative border border-dashed border-gray-300 rounded-md flex items-center justify-center bg-gray-50 h-40 cursor-pointer"
            onClick={() =>
              document.getElementById(`banner-input-${previews.length}`).click()
            }
          >
            <span className="text-gray-500">+ Add Banner</span>
            <input
              type="file"
              id={`banner-input-${previews.length}`}
              accept="image/*"
              className="hidden"
              onChange={(e) => handleBannerChange(e, previews.length)}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <button
            type="button"
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary-500 hover:bg-primary-dark-500 text-white rounded-md"
            style={{color:"white"}}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBannerForm;



