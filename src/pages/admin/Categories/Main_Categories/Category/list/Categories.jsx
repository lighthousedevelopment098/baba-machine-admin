import React, { useState, useTransition, Suspense, useEffect } from "react"; 
import { toast, ToastContainer } from "react-toastify";
import { MdOutlineCategory } from "react-icons/md";
import LoadingSpinner from "../../../../../../components/LoodingSpinner/LoadingSpinner";
import CategoryForm from "../add/CategoryForm";
import CategoryList from "./CategoryList";
import ConfirmationModal from "../../../../../../components/FormInput/ConfirmationModal";
import { useDispatch, useSelector } from "react-redux";
import { createCategory, fetchCategories, deleteCategory } from "../../../../../../redux/slices/admin/categorySlice";
import { getLanguage } from "../../../../../../utils/language";
import { useLanguage } from "../../../../../../context/LanguageContext";

const Categories = () => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector(
    (state) => state.productCategory
  );
  const { language } = useLanguage(); // Get the current language from context
  console.log("categories", categories);

  const [newCategory, setNewCategory] = useState({
    name: "",
    image: "",  
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const [selectedFile, setSelectedFile] = useState(null);

  // Fetch categories on mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleInputChange = (e) => {
    setNewCategory({ ...newCategory, [e.target.name]: e.target.value });
  };

  const handleFileChange = (imageString) => {
    setNewCategory({ ...newCategory, image: imageString });
  };

  const handleFormSubmit = (e) => {
	e.preventDefault();
  
	// Ensure both name and image are filled
	if (!newCategory.name || !selectedFile) {
	  toast.error("Please fill in all fields.");
	  return;
	}
      console.log("newCategory", newCategory)
      console.log("seleced file", selectedFile)
	// Only dispatch if fields are properly filled
	dispatch(createCategory({ ...newCategory, image: selectedFile }));
	toast.success(`Category "${newCategory.name}" added successfully`);
	dispatch(fetchCategories());

  };
  
  
  const handleDeleteCategory = async (categoryId) => {
    const confirmed = await ConfirmationModal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this category!",
      icon: "warning",
      dangerMode: true,
    });

    if (confirmed) {
      dispatch(deleteCategory(categoryId));  // Dispatch action to delete category
      toast.success("Category deleted successfully");
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredCategories = categories.filter((category) => {
    const categoryName = category.name && category.name[language]; // Get the name based on the selected language
    return categoryName && categoryName.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  return (
    <div className="px-3 md:px-5 md:mx-5 md:py-8 ">
      <ToastContainer />
      <h2 className="h1 mb-4 d-flex gap-3">
        <MdOutlineCategory />
        Category Setup
      </h2>

      <Suspense fallback={<div><LoadingSpinner /></div>}>
        <CategoryForm
          newCategory={newCategory}
          onInputChange={handleInputChange}
          onFileChange={handleFileChange}
          onSubmit={handleFormSubmit}
          setSelectedFile={setSelectedFile}
        />
      </Suspense>

      {loading ? (
        <LoadingSpinner /> // Show loading spinner while categories are being fetched
      ) : error ? (
        <div>Error fetching categories: {error.message}</div> // Handle error state
      ) : (
        <Suspense fallback={<div>Loading categories...</div>}>
          <CategoryList
            categories={filteredCategories.length > 0 ? filteredCategories : []}
            handleDelete={handleDeleteCategory}
            handleSearch={handleSearch}
            searchQuery={searchQuery}
          />
        </Suspense>
      )}
    </div>
  );
};

export default Categories;
