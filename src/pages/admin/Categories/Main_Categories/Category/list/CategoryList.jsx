import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import ActionButton from "../../../../../../components/ActionButton/Action";
import { useLanguage } from "../../../../../../context/LanguageContext";

const CategoryList = React.memo(({ categories, handleDelete, handleSearch, searchQuery }) => {
  const { language } = useLanguage(); // Get the current language from context

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      {/* Header and Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-xl font-bold text-gray-800">Category List</h1>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          className="w-full md:w-1/3 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          placeholder="Search Category"
        />
      </div>

      {/* Table Structure */}
      <div className="mt-6">
        {categories.length === 0 ? (
          <p className="text-center text-gray-500">No categories found.</p>
        ) : (
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">Image</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {categories
                .filter((category) =>
                  category.name &&
                  category.name[language]?.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((category) => (
                  <tr key={category._id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">
                      <img
                        src={category.image || "/default-image.png"}
                        alt={category.name[language]}
                        className="w-12 h-12 object-cover rounded-full shadow-sm"
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2 font-medium text-gray-800">
                      {category.name[language]}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <div className="flex gap-3">
                        <ActionButton
                          to={`/categoryedit/${category._id}`}
                          icon={FaEdit}
                          className="text-green-500 hover:text-green-600"
                        />
                        <ActionButton
                          onClick={() => handleDelete(category._id)}
                          icon={FaTrash}
                          className="text-red-500 hover:text-red-600"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
});

export default CategoryList;
