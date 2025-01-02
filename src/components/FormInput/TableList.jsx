import React, { useEffect, useState, lazy, memo } from "react";
import { FiSearch } from "react-icons/fi";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TableHeader from "./TableHeader";
import Pagination from "../Pagination";

const ExportButton = lazy(() => import("../ActionButton/Export"));

const TableList = memo(
  ({
    title,
    tableTitle,
    listData = [],
    columns = [],
    exportFileName = "listData",
    searchPlaceholder = "Search...",
    itemKey = "_id",
    itemsPerPage = 7,
    imageSrc = "",
    headerActions,
  }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  console.log("filteredData", listData);
  console.log("filteredData", listData);
    useEffect(() => {
      const filtered = searchQuery
        ? listData.filter((item) =>
            columns.some((col) => {
              if (col.key && item[col.key]) {
                return String(item[col.key])
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase());
              }
              return false;
            })
          )
        : listData;
    
      setFilteredData(filtered);
      setCurrentPage(1); // Reset to the first page whenever the data changes
    }, [listData, searchQuery, columns]);
    
    const handleSearchChange = (e) => setSearchQuery(e.target.value);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
    };

    return (
      <div className="mt-3 mb-2 px-4 w-full">
        <ToastContainer />
        <TableHeader imageSrc={imageSrc} title={title} />
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
            <div className="flex items-center gap-3">
              <h4 className="text-lg font-semibold">{tableTitle}</h4>
              <span className="bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full">
                {filteredData.length}
              </span>
            </div>
            <div className="flex flex-wrap gap-4">
              <form onSubmit={(e) => e.preventDefault()} className="relative">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder={searchPlaceholder}
                    className="pl-10 pr-4 py-2 border rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </form>
              {headerActions}
              <ExportButton
                data={filteredData}
                filename={exportFileName}
                title="Export"
                className="bg-primary-500 hover:bg-primary-dark-500 text-white px-4 py-2 rounded-md"
                label="Export"
              />
            </div>
          </div>
          <div className="overflow-auto">
            <table className="w-full text-sm text-left bg-white border rounded-lg">
              <thead className="bg-gray-100 text-gray-600 uppercase">
                <tr>
                  {columns.map((col) => (
                    <th key={col.key} className="px-4 py-2 text-center">
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr key={item[itemKey] || index} className="hover:bg-gray-50">
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-3 text-center text-[#57596C]">
                        {col.render ? col.render(item, index) : item[col.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            paginate={handlePageChange}
            pageRange={5}
          />
        </div>
      </div>
    );
  }
);

export default TableList;
