"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function CreateStructuralReport() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    location: "",
    description: "",
    issues: [""],
    photographs: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleIssueChange = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      issues: prev.issues.map((issue, i) => (i === index ? value : issue)),
    }));
  };

  const handleAddIssue = () => {
    setFormData((prev) => ({
      ...prev,
      issues: [...prev.issues, ""],
    }));
  };

  const handleRemoveIssue = (index) => {
    if (formData.issues.length > 1) {
      setFormData((prev) => ({
        ...prev,
        issues: prev.issues.filter((_, i) => i !== index),
      }));
    }
  };

  const handlePhotographUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const promises = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            image: reader.result,
            description: "",
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then((newPhotographs) => {
      setFormData((prev) => ({
        ...prev,
        photographs: [...prev.photographs, ...newPhotographs],
      }));
    });
  };

  const handleDescriptionChange = (index, description) => {
    setFormData((prev) => ({
      ...prev,
      photographs: prev.photographs.map((photo, i) =>
        i === index ? { ...photo, description } : photo
      ),
    }));
  };

  const handleDeletePhoto = (index) => {
    setFormData((prev) => ({
      ...prev,
      photographs: prev.photographs.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.location.trim()) {
        throw new Error("Location is required");
      }
      if (!formData.description.trim()) {
        throw new Error("Description is required");
      }

      // Filter out empty issues
      const filteredIssues = formData.issues.filter(
        (issue) => issue.trim() !== ""
      );
      if (filteredIssues.length === 0) {
        throw new Error("At least one issue is required");
      }

      // Validate photograph descriptions
      const hasEmptyDescriptions = formData.photographs.some(
        (photo) => !photo.description.trim()
      );
      if (hasEmptyDescriptions) {
        throw new Error("All photographs must have descriptions");
      }

      const response = await fetch("/api/structural", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          issues: filteredIssues,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit report");
      }

      toast.success("Report submitted successfully");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error(error.message || "Failed to submit report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="text-right mb-4">
        <Link
          href="/dashboard"
          className="text-[#0066A1] hover:text-[#004d7a] transition-colors text-base inline-flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          Back to Dashboard
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white">
        {/* Company Header */}
        <div className="mb-8">
          <h1 className="text-[#0066A1] text-2xl font-bold">SHAHRISH</h1>
          <p className="text-sm">
            ENGINEERING | PLANNING | CONSTRUCTION INSPECTION
          </p>
          <p className="text-sm">CERTIFIED DB/MBE</p>
          <div className="text-sm text-right mt-[-40px]">
            <p>555 Broadhollow Road, Suite 216</p>
            <p>Melville, NY 11747</p>
            <p>631.578.2493</p>
          </div>
        </div>

        {/* Report Title */}
        <h2 className="text-xl font-bold text-center border-t border-b border-gray-300 py-4 mb-8">
          STRUCTURAL INSPECTION REPORT
        </h2>

        {/* Basic Info */}
        <div className="space-y-6 mb-8">
          <div>
            <label className="font-semibold block mb-2">Location:</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full border-b border-gray-300 focus:outline-none focus:border-[#0066A1] p-2"
              required
            />
          </div>

          <div>
            <label className="font-semibold block mb-2">Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full border-b border-gray-300 focus:outline-none focus:border-[#0066A1] p-2"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="font-semibold block mb-2">Issues:</label>
            <div className="space-y-4">
              {formData.issues.map((issue, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={issue}
                    onChange={(e) => handleIssueChange(index, e.target.value)}
                    className="flex-1 border-b border-gray-300 focus:outline-none focus:border-[#0066A1] p-2"
                    placeholder={`Issue ${index + 1}`}
                    required
                  />
                  {formData.issues.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveIssue(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddIssue}
                className="text-[#0066A1] hover:text-[#004d7a] transition-colors"
              >
                + Add Issue
              </button>
            </div>
          </div>
        </div>

        {/* Photographs */}
        <div className="mb-8">
          <h3 className="font-semibold mb-4">PHOTOGRAPHS:</h3>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotographUpload}
            className="mb-4"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.photographs.map((photo, index) => (
              <div key={index} className="relative border p-4 rounded">
                <Image
                  src={photo.image}
                  alt={`Photograph ${index + 1}`}
                  width={400}
                  height={300}
                  className="w-full h-auto object-contain rounded"
                />
                <button
                  type="button"
                  onClick={() => handleDeletePhoto(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-700 transition-colors"
                >
                  ×
                </button>
                <textarea
                  value={photo.description}
                  onChange={(e) =>
                    handleDescriptionChange(index, e.target.value)
                  }
                  className="w-full mt-2 p-2 border rounded focus:outline-none focus:border-[#0066A1]"
                  placeholder="Enter photo description"
                  rows={2}
                  required
                />
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-right">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#0066A1] text-white px-6 py-2 rounded hover:bg-[#004d7a] transition-colors disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Report"}
          </button>
        </div>
      </form>
    </div>
  );
}
