// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchCategories,
//   fetchBrands,
//   fetchColors,
//   fetchAttributes,
//   fetchSubCategories,
//   fetchSubSubCategories,
// } from "../../../../../redux/slices/admin/categorybrandSlice";

// import "react-quill/dist/quill.snow.css";
// import "./form.css";
// // import ProductAttributes from "./addProductFormComponent/productAttributes";
// import ProductImageWrapper from "./addProductFormComponent/productImageUpload";
// import ProductForm from "./addProductFormComponent/productForm";
// import ProductGeneral from "./addProductFormComponent/productGeneral";
// import ProductAdditional from "./addProductFormComponent/productAdditional";
// import ProductVideo from "./addProductFormComponent/productVideo";
// import SeoSection from "./addProductFormComponent/SeoSection";
// import Swal from "sweetalert2";
// import apiConfig from "../../../../../config/apiConfig";
// import { getAuthData } from "../../../../../utils/authHelper";

// import { toast } from "react-toastify";
// import uploadProductImagesToS3 from "./uploadImages";
// import { useNavigate } from "react-router-dom";
// import LoadingSpinner from "../../../../../components/LoodingSpinner/LoadingSpinner";
// import Uploading from "../../../../../components/LoodingSpinner/Uploading";

// const API_URL = `${apiConfig.seller}/products`;

// const AddNewProduct = () => {
//   const dispatch = useDispatch();

//   const {
//     categories,
//     subCategories,
//     subSubCategories,
//     brands,
//     colors,
//     attributes,
//   } = useSelector((state) => state.category);
//   const navigate = useNavigate();

//   const initialFormState = {
//     name: "",
//     description: "",
//     brand: "",
//     productType: "",
//     digitalProductType: "",
//     sku: "",
//     unit: "",
//     tags: [""],
//     price: "",
//     discount: "",
//     discountType: "percent",
//     discountAmount: "",
//     taxAmount: "",
//     taxIncluded: false,
//     minimumOrderQty: "3",
//     shippingCost: "",
//     stock: "",
//     isFeatured: false,
//     videoLink: "",
//     metaTitle: "title",
//     metaDescription: "metadescription",
//     userType: "in-house",
//     status: "approved",
//   };

//   const [formData, setFormData] = useState(initialFormState);
//   const [thumbnail, setThumbnail] = useState(null);
//   const [images, setImages] = useState([]);
//   const [selectedColors, setSelectedColors] = useState([]);
//   const [selectedAttribute, setSelectedAttribute] = useState("");
//   const [productAttributes, setProductAttributes] = useState([]);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [loading, setLoading] = useState(false); // Add loading state

//   useEffect(() => {
//     dispatch(fetchCategories());
//     dispatch(fetchBrands());
//     dispatch(fetchColors());
//     dispatch(fetchAttributes());
//   }, [dispatch]);

//   useEffect(() => {
//     if (formData.category) {
//       dispatch(fetchSubCategories(formData.category));
//     }
//   }, [dispatch, formData.category]);

//   useEffect(() => {
//     if (formData.subCategory) {
//       dispatch(fetchSubSubCategories(formData.subCategory));
//     }
//   }, [dispatch, formData.subCategory]);

//   // const handleChange = (e) => {
//   //   const { name, value, type, checked } = e.target;
//   //   setFormData((prev) => ({
//   //     ...prev,
//   //     [name]: type === "checkbox" ? checked : value,
//   //   }));
//   // };

//   // const handleChange = (e) => {
//   // 	const { name, value, type, checked } = e.target;

//   // 	setFormData((prev) => ({
//   // 	  ...prev,
//   // 	  [name]: type === "checkbox"
//   // 		? checked
//   // 		: (["price", "discountAmount", "taxAmount", "discount"].includes(name)
//   // 			? parseInt(value, 10) || 0
//   // 			: value),
//   // 	  // Reset dependent fields if parent category changes
//   // 	  ...(name === "category" && { subCategory: null, subSubCategory: null }),
//   // 	  ...(name === "subCategory" && { subSubCategory: null }),
//   // 	}));
//   //   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]:
//         type === "checkbox"
//           ? checked
//           : name === "discountType" && !value
//           ? "percent" // Default to 'percent'
//           : ["price", "discountAmount", "taxAmount", "discount"].includes(name)
//           ? parseInt(value, 10) || 0
//           : value,
//     }));
//   };

//   const handleDescriptionChange = (value) => {
//     setFormData((prev) => ({
//       ...prev,
//       description: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true); // Set loading to true at the start of submission

//     const uploadResult = await uploadProductImagesToS3(thumbnail, images);

//     // Check if the uploadResult is null before destructuring
//     if (!uploadResult) {
//       setLoading(false);

//       return; // Exit the function if upload failed
//     }

//     const { thumbnailKey, imageKeys } = uploadResult;

//     try {
//       const { token, user } = getAuthData();
//       const userId = user?._id;

//       if (!userId) {
//         throw new Error("admin does not exist or is not authenticated.");
//       }

//       const productData = {
//         ...formData,
//         userId,
//         thumbnail: thumbnailKey,
//         images: imageKeys,
//         // colors: selectedColors.map((color) => color._id),
//         // attributes: productAttributes.map((attr) => attr._id),
//         category: formData.category,
//         subCategory: formData.subCategory,
//         subSubCategory: formData.subSubCategory,
//         ...(formData.productType !== "physical" && {
//           digitalProductType: formData.digitalProductType,
//         }),
//       };

//       const response = await fetch(API_URL, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(productData),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Something went wrong!");
//       }

//       Swal.fire({
//         icon: "success",
//         title: "Product created successfully!",
//         showConfirmButton: false,

//         timer: 1000,
//       }).then(() => {
//         // This will execute after Swal notification is completed
//         navigate("/inhouseproductlist");
//       });
//       // Reset form
//       setThumbnail(null);
//       // setImages([]);
//       setSelectedColors([]);
//       setProductAttributes([]);
//       setFormData({ ...initialFormState });
//       navigate("/inhouseproductlist");
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "Failed to create product",
//         text: error.message || "Please try again.",
//         showConfirmButton: true,
//       });
//       setErrorMessage("Failed to create product. Please try again.");
//     } finally {
//       setLoading(false); // Set loading to false after submission
//     }
//   };
//   return (
//     <form onSubmit={handleSubmit} className="add-product-form p-6">
//       {loading && <Uploading />}

//       <ProductForm
//         formData={formData}
//         handleChange={handleChange}
//         handleDescriptionChange={handleDescriptionChange}
//         errorMessage={errorMessage}
//       />
//       <ProductGeneral
//         formData={formData}
//         handleChange={handleChange}
//         setFormData={setFormData}
//         categories={categories}
//         subCategories={subCategories}
//         subSubCategories={subSubCategories}
//         brands={brands}
//       />
//       <ProductAdditional formData={formData} handleChange={handleChange} />
//       <ProductVideo formData={formData} handleChange={handleChange} />

//       <ProductImageWrapper
//         thumbnail={thumbnail}
//         setThumbnail={setThumbnail}
//         images={images}
//         setImages={setImages} // Pass the setter function to update images
//       />
//       <SeoSection formData={formData} handleChange={handleChange} />

//       <div className="flex justify-end m-5">
//         <button
//           type="submit"
//           className="btn mt-3 flex justify-end text-white btn-submit bg-primary--500 hover:bg-primary-dark-500 outline-none"
//           disabled={loading} // Disable button while loading
//           style={{ color: "white" }}
//         >
//           {loading ? "Submitting..." : "Submit Product"}
//         </button>
//       </div>
//     </form>
//   );
// };

// export default AddNewProduct;



import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  fetchBrands,
} from "../../../../../redux/slices/admin/categorybrandSlice";

import Swal from "sweetalert2";
import apiConfig from "../../../../../config/apiConfig";
import { getAuthData } from "../../../../../utils/authHelper";

import uploadProductImagesToS3 from "./uploadImages";
import { useNavigate } from "react-router-dom";
import Uploading from "../../../../../components/LoodingSpinner/Uploading";
import { MdDeleteOutline } from "react-icons/md";

const API_URL = `${apiConfig.seller}/products`;

const AddNewProduct = () => {
  const dispatch = useDispatch();
  const { categories, brands } = useSelector((state) => state.category);
  const navigate = useNavigate();

  const initialFormState = {
    name: "",
    serialNo: "",
    year: "",
    hour: "",
    price: "",
    category: "",
    brand: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [images, setImages] = useState([]); // Store multiple images
  const [previews, setPreviews] = useState([]); // Image previews
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchBrands());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    // Generate previews for all selected images
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviews(previewUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const uploadedImageKeys = [];
    if (images.length > 0) {
      for (const image of images) {
        const uploadResult = await uploadProductImagesToS3(image, []);
        if (uploadResult) {
          uploadedImageKeys.push(uploadResult.thumbnailKey);
        }
      }
    }

    try {
      const { token, user } = getAuthData();
      const userId = user?._id;

      if (!userId) {
        throw new Error("Admin does not exist or is not authenticated.");
      }

      const productData = {
        ...formData,
        userId,
        images: uploadedImageKeys,
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong!");
      }

      Swal.fire({
        icon: "success",
        title: "Product created successfully!",
        showConfirmButton: false,
        timer: 1000,
      }).then(() => {
        navigate("/inhouseproductlist");
      });

      setFormData(initialFormState);
      setImages([]);
      setPreviews([]); // Reset previews
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to create product",
        text: error.message || "Please try again.",
        showConfirmButton: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-white shadow-lg rounded-lg">
      {loading && <Uploading />}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Services</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1  gap-8">
        {/* Form Fields */}
        <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Name", name: "name", type: "text" },
            { label: "Serial No", name: "serialNo", type: "text" },
            { label: "Year", name: "year", type: "text" },
            { label: "Hour", name: "hour", type: "text" },
            { label: "Price", name: "price", type: "number" },
          ].map((field) => (
            <div key={field.name}>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700"
              >
                {field.label}
              </label>
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className="mt-2 block w-full px-3 py-2 border rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
          ))}
        </div>

        {/* Image Upload Section */}
       {/* Image Upload Section */}
<div className="space-y-4">
  <label className="block text-sm font-medium text-gray-700">
    Upload Images
  </label>
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
    {previews.map((preview, index) => (
      <div
        key={index}
        className="relative border border-dashed border-gray-300 rounded-md flex items-center justify-center bg-gray-50 h-40 cursor-pointer"
        onClick={() => document.getElementById(`file-input-${index}`).click()}
      >
        <img
          src={preview}
          alt={`Preview ${index + 1}`}
          className="w-full h-full object-cover rounded-md"
        />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the file manager
            setImages((prevImages) => prevImages.filter((_, i) => i !== index));
            setPreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
          }}
          className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-md"
        >
          <MdDeleteOutline />
        </button>
        <input
          type="file"
          id={`file-input-${index}`}
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              setImages((prevImages) => {
                const updatedImages = [...prevImages];
                updatedImages[index] = file;
                return updatedImages;
              });
              setPreviews((prevPreviews) => {
                const updatedPreviews = [...prevPreviews];
                updatedPreviews[index] = URL.createObjectURL(file);
                return updatedPreviews;
              });
            }
          }}
        />
      </div>
    ))}
    {/* Add New Image Box */}
    <div
      className="relative border border-dashed border-gray-300 rounded-md flex items-center justify-center bg-gray-50 h-40 cursor-pointer"
      onClick={() => document.getElementById(`file-input-new`).click()}
    >
      <span className="text-gray-500">+ Add Image</span>
      <input
        type="file"
        id="file-input-new"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            setImages((prevImages) => [...prevImages, file]);
            setPreviews((prevPreviews) => [
              ...prevPreviews,
              URL.createObjectURL(file),
            ]);
          }
        }}
      />
    </div>
  </div>
</div>


        {/* Submit Button */}
        <div className="col-span-full flex justify-end mt-6">
          <button
            type="submit"
            className="bg-primary-500 hover:bg-primary-dark-500 text-white px-6 py-2 rounded shadow"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Service"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewProduct;



