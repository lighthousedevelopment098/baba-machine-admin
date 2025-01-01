// import React, { useCallback, useState } from "react";

// const CategoryForm = ({
//   selectedLang,
//   newCategory,
//   onInputChange,
//   onFileChange,
//   onSubmit,
//   setSelectedFile,
// }) => {
//   const [preview, setPreview] = useState(null);

//   const handleFileChange = useCallback(
//     (e) => {
//       const file = e.target.files[0];
//       if (file) {
//         setSelectedFile(file);
//         const objectUrl = URL.createObjectURL(file);
//         setPreview(objectUrl);
//       } else {
//         setPreview(null);
//         onFileChange(""); // Reset if no file is selected
//       }
//     },
//     [onFileChange]
//   );

//   return (
//     <div className="card p-6">
//       <form onSubmit={onSubmit}>
//         <div className="row">
//           <div className="col-lg-6">
//             {["en", "sa", "bd", "in"].map((lang) => (
//               <div
//                 className={`form-group ${
//                   selectedLang === lang ? "" : "d-none"
//                 } form-system-language-form`}
//                 key={lang}
//                 id={`${lang}-form`}
//               >
//                 <label className="title-color">
//                   Category Name<span className="text-danger">*</span> (
//                   {lang.toUpperCase()})
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   className="form-control outline-none hover:border-primary-500"
//                   placeholder="New Category"
//                   required={lang === "en"} // Required only for English
//                   value={newCategory.name}
//                   onChange={onInputChange}
//                 />
//               </div>
//             ))}
//             <div className="form-group">
//               <label className="title-color" htmlFor="priority">
//                 Priority
//               </label>
//               <select
//                 className="form-control outline-none hover:border-primary-500"
//                 name="priority"
//                 required
//                 value={newCategory.priority}
//                 onChange={onInputChange}
//               >
//                 <option disabled>Set Priority</option>
//                 {[...Array(11).keys()].map((num) => (
//                   <option value={num} key={num}>
//                     {num}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="form-group">
//               <label className="title-color">Category Logo</label>
//               <span className="text-info">
//                 <span className="text-danger">*</span> Ratio 1:1 (500 x 500 px)
//               </span>
//               <div className="custom-file text-left">
//                 <input
//                   type="file"
//                   name="logo"
//                   id="category-image"
//                   className="custom-file-input"
//                   accept="image/*"
//                   required
//                   onChange={handleFileChange}
//                 />
//                 <label className="custom-file-label" htmlFor="category-image">
//                   Choose File
//                 </label>
//               </div>
//             </div>
//           </div>
//           <div className="col-lg-6 mt-4 mt-lg-0 from_part_2">
//             <div className="form-group flex justify-center items-center">
//               <div className="text-center flex justify-center items-center ">
//                 <img
//                   className="upload-img-view"
//                   id="viewer"
//                   alt=""
//                   src={
//                     preview ||
//                     "https://6valley.6amtech.com/public/assets/back-end/img/image-place-holder.png"
//                   }
//                 />
//               </div>
//             </div>
//           </div>
//           <div className="d-flex flex-wrap gap-2 justify-content-end w-full p-3">
//             <button
//               type="reset"
//               id="reset"
//               className="btn bg-secondary-500 text-white border border-secondary-500 rounded-md"
//               onClick={() => setPreview(null)} // Clear preview on reset
//             >
//               Reset
//             </button>
//             <button
//               type="submit"
//               className="btn bg-primary-500 hover:bg-primary-dark-500 text-white"
//               style={{ color: "white" }}
//             >
//               Submit
//             </button>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default React.memo(CategoryForm);




import React, { useCallback, useState } from "react";

const CategoryForm = ({
  selectedLang,
  newCategory,
  onInputChange,
  onFileChange,
  onSubmit,
  setSelectedFile,
}) => {
  const [preview, setPreview] = useState(null);

  const handleFileChange = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (file) {
        setSelectedFile(file);
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
      } else {
        setPreview(null);
        onFileChange(""); // Reset if no file is selected
      }
    },
    [onFileChange, setSelectedFile]
  );

  return (
    <div className="card p-6 shadow-lg rounded-md bg-white">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Add New Category
      </h2>
      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            {["en", "sa", "bd", "in"].map((lang) => (
              <div
                className={`form-group ${
                  selectedLang === lang ? "" : "hidden"
                }`}
                key={lang}
                id={`${lang}-form`}
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name{" "}
                  <span className="text-red-500">*</span> ({lang.toUpperCase()})
                </label>
                <input
                  type="text"
                  name="name"
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter category name"
                  required={lang === "en"} // Required only for English
                  value={newCategory.name}
                  onChange={onInputChange}
                />
              </div>
            ))}

            <div className="form-group mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category Logo <span className="text-red-500">*</span>
              </label>
              <span className="block text-xs text-gray-500 mb-2">
                Recommended: 1:1 ratio, 500x500 px
              </span>
              <div className="relative">
                <input
                  type="file"
                  name="logo"
                  id="category-image"
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-500 file:text-white hover:file:bg-primary-dark-500"
                  accept="image/*"
                  required
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-full h-40 md:h-56 border-dashed border-2 border-gray-300 rounded-md flex items-center justify-center bg-gray-50">
              <img
                className="h-full object-contain"
                id="viewer"
                alt="Category Preview"
                src={
                  preview ||
                  "https://via.placeholder.com/500x500?text=Image+Placeholder"
                }
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="reset"
            id="reset"
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md"
            onClick={() => setPreview(null)} // Clear preview on reset
          >
            Reset
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

export default React.memo(CategoryForm);


