import React from "react"; 
import { useLanguage } from "../../../context/LanguageContext"; 
import ActionButton from "../../../components/ActionButton/Action";
import { FaEdit, FaTrash } from "react-icons/fa";

const ManufacturersList = React.memo(({ manufacturers, handleDelete, handleSearch, searchQuery }) => {
  const { language } = useLanguage(); // Get the current language from context

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      {/* Header and Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-xl font-bold text-gray-800">Manufacturer List</h1>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          className="w-full md:w-1/3 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          placeholder="Search Manufacturer"
        />
      </div>

      {/* Table Structure */}
      <div className="mt-6">
        {manufacturers.length === 0 ? (
          <p className="text-center text-gray-500">No manufacturers found.</p>
        ) : (
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Image</th>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {manufacturers.map((manufacturer) => (
                <tr key={manufacturer._id}>
                  <td className="border border-gray-300 px-4 py-2">
                      <img
                        src={manufacturer?.image || "/default-image.png"}
                        alt={manufacturer?.name[language]}
                        className="w-12 h-12 object-cover rounded-full shadow-sm"
                      />
                    </td>
                  <td className="p-4">{manufacturer.name[language]}</td>
                  <td className="p-4">
                    <ActionButton 
                      icon={FaEdit} 
                      className="text-green-500 hover:text-green-600"
                      to={`/manafucture/${manufacturer._id}`}
                      />
                    <ActionButton 
                      icon={FaTrash} 
                      className="text-red-500 hover:text-red-600"
                      onClick={() => handleDelete(manufacturer._id)} 
                    />
                   
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

export default ManufacturersList;
