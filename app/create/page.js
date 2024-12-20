"use client";

import React, { useState } from "react";

const InspectionForm = () => {
  const [formData, setFormData] = useState({
    inspections: [
      { name: "Structural Steel – Welding, as per BC 1704.3.1", approved: false, comments: false },
      { name: "Structural Steel – Details, as per BC 1704.3.2", approved: false, comments: false },
      { name: "Structural Steel – High Strength Bolting, as per BC 1704.3.3", approved: false, comments: false },
      // Add other inspection items as needed
    ],
    healthSafetyPlan: {
      read: false,
      inFile: false,
      seenAtSite: false,
    },
  });

  const handleCheckboxChange = (field, index = null, subfield = null) => {
    setFormData((prevState) => {
      const newState = { ...prevState };
      console.log(newState);
      if (field === "inspections" && index !== null) {
        newState.inspections[index][subfield] = !newState.inspections[index][subfield];
      } else {
        newState.healthSafetyPlan[subfield] = !newState.healthSafetyPlan[subfield];
      }
      return newState;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/inspections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Data submitted successfully!");
      } else {
        alert("Failed to submit data.");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Error submitting data.");
    }
  };

  return (
    <form className="p-6" onSubmit={handleSubmit}>
      <table className="table-auto w-full border border-gray-300">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b border-gray-300 text-left">Inspection Item</th>
            <th className="px-4 py-2 border-b border-gray-300 text-center">Approved</th>
            <th className="px-4 py-2 border-b border-gray-300 text-center">See Comments</th>
          </tr>
        </thead>
        <tbody>
          {formData.inspections.map((item, index) => (
            <tr key={index} className="border-b border-gray-300">
              <td className="px-4 py-2">{item.name}</td>
              <td className="px-4 py-2 text-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-blue-600"
                  checked={item.approved}
                  onChange={() => handleCheckboxChange("inspections", index, "approved")}
                />
              </td>
              <td className="px-4 py-2 text-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-blue-600"
                  checked={item.comments}
                  onChange={() => handleCheckboxChange("inspections", index, "comments")}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6">
        <h3 className="font-bold">Health & Safety Plan:</h3>
        <div className="flex items-center mt-2">
          <label className="mr-4">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600"
              checked={formData.healthSafetyPlan.read}
              onChange={() => handleCheckboxChange("healthSafetyPlan", null, "read")}
            />
            <span className="ml-2">Plan read and understood</span>
          </label>
          <label className="mr-4">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600"
              checked={formData.healthSafetyPlan.inFile}
              onChange={() => handleCheckboxChange("healthSafetyPlan", null, "inFile")}
            />
            <span className="ml-2">In Job File</span>
          </label>
          <label>
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600"
              checked={formData.healthSafetyPlan.seenAtSite}
              onChange={() => handleCheckboxChange("healthSafetyPlan", null, "seenAtSite")}
            />
            <span className="ml-2">Seen At Job Site</span>
          </label>
        </div>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default InspectionForm;
