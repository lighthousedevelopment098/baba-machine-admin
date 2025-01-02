import React, { useState, useTransition, Suspense, useEffect } from "react"; 
import { toast, ToastContainer } from "react-toastify"; 
import { MdOutlineCategory } from "react-icons/md"; 
import { useDispatch, useSelector } from "react-redux"; 
import Addmanufacturers from "../add/addmanufacturers"; 
import ManufacturersList from "./manufacturersList"; 
import { useLanguage } from "../../../context/LanguageContext"; 
import LoadingSpinner from "../../../components/LoodingSpinner/LoadingSpinner";
import { createManufacturer, fetchManufacturers, deleteManufacturer } from "../../../redux/slices/admin/manufacturersSlice";
import ConfirmationModal from "../../../components/FormInput/ConfirmationModal";

const Manufacturers = () => {
  const dispatch = useDispatch();
  const { manufacturers, loading, error } = useSelector(
    (state) => state.manufacturers
  );
  const { language } = useLanguage(); // Get the current language from context

  const [newManufacturer, setNewManufacturer] = useState({
    name: "",
    image: "",  
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const [selectedFile, setSelectedFile] = useState(null);

  // Fetch manufacturers on mount
  useEffect(() => {
    dispatch(fetchManufacturers());
  }, [dispatch]);

  const handleInputChange = (e) => {
    setNewManufacturer({ ...newManufacturer, [e.target.name]: e.target.value });
  };

  const handleFileChange = (imageString) => {
    setNewManufacturer({ ...newManufacturer, image: imageString });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Ensure both name and image are filled
    if (!newManufacturer.name || !selectedFile) {
      toast.error("Please fill in all fields.");
      return;
    }

    dispatch(createManufacturer({ ...newManufacturer, image: selectedFile }));
    toast.success(`Manufacturer "${newManufacturer.name}" added successfully`);
    dispatch(fetchManufacturers());
  };

  const handleDeleteManufacturer = async (manufacturerId) => {
    console.log("manufacturerId", manufacturerId);
    const confirmed = await ConfirmationModal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this manufacturer!",
      icon: "warning",
      dangerMode: true,
    });

    if (confirmed) {
      dispatch(deleteManufacturer(manufacturerId));  // Dispatch action to delete manufacturer
      toast.success("Manufacturer deleted successfully");
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredManufacturers = manufacturers.filter((manufacturer) => {
    const manufacturerName = manufacturer.name && manufacturer.name[language]; // Get the name based on the selected language
    return manufacturerName && manufacturerName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="px-3 md:px-5 md:mx-5 md:py-8 ">
      <ToastContainer />
      <h2 className="h1 mb-4 d-flex gap-3">
        <MdOutlineCategory />
        Manufacturer Setup
      </h2>

      <Suspense fallback={<div><LoadingSpinner /></div>}>
        <Addmanufacturers
          newManufacturer={newManufacturer}
          onInputChange={handleInputChange}
          onFileChange={handleFileChange}
          onSubmit={handleFormSubmit}
          setSelectedFile={setSelectedFile}
        />
      </Suspense>

      {loading ? (
        <LoadingSpinner /> // Show loading spinner while manufacturers are being fetched
      ) : error ? (
        <div>Error fetching manufacturers: {error.message}</div> // Handle error state
      ) : (
        <Suspense fallback={<div>Loading manufacturers...</div>}>
          <ManufacturersList
            manufacturers={filteredManufacturers.length > 0 ? filteredManufacturers : []}
            handleDelete={handleDeleteManufacturer}
            handleSearch={handleSearch}
            searchQuery={searchQuery}
          />
        </Suspense>
      )}
    </div>
  );
};

export default Manufacturers;
