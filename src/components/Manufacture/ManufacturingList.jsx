import React, { useState } from "react";
import ManufacturingForm from "./AddManufacturing";
import TableList from "../FormInput/TableList";


const ManufacturingList = () => {
  const [newManufacturing, setNewManufacturing] = useState({ name: "" });
  const [selectedFile, setSelectedFile] = useState(null);

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setNewManufacturing((prevState) => ({
      ...prevState,
      [name]: value, // Update the name field
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", newManufacturing, selectedFile);
    // handle form submission logic
  };

  return (
    <div>
      <TableList
        newManufacturing={newManufacturing}
        onInputChange={onInputChange}
        onSubmit={onSubmit}
        setSelectedFile={setSelectedFile}
      />
    </div>
  );
};

export default ManufacturingList;
