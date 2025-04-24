"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-hot-toast";

export default function EditConcreteReport() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    client: "",
    inspectionDate: "",
    projectSiteAddress: "",
    projectId: "",
    inspectorName: "",
    timeInOut: "",
    reportNumber: "",
    siteWeather: "",
    siteContact: "",
    plansReferenced: "",
    areaInspected: "",
    materialUsed: "",
    inspectionOutcome: "INCOMPLETE",
    nonConformanceNotes: "",
    hasPhotographs: true,
    hasObservations: true,
    photographs: [{ image: null, caption: "" }],
    checklist: {
      shopDrawings: "",
      shopDrawingsDetails: "",
      gradeOfSteel: "",
      gradeOfSteelDetails: "",
      spacingCoordinated: "",
      spacingCoordinatedDetails: "",
      requiredClearance: "",
      requiredClearanceDetails: "",
      lengthOfSplices: "",
      lengthOfSplicesDetails: "",
      bendsWithinRadii: "",
      bendsWithinRadiiDetails: "",
      additionalBars: "",
      additionalBarsDetails: "",
      barsCleaned: "",
      barsCleanedDetails: "",
      dowelsForMarginal: "",
      dowelsForMarginalDetails: "",
      barsTiedAndSupported: "",
      barsTiedAndSupportedDetails: "",
      spacersTieWires: "",
      spacersTieWiresDetails: "",
      conduitSeparated: "",
      conduitSeparatedDetails: "",
      noConduitBelow: "",
      noConduitBelowDetails: "",
      noContactWithMetals: "",
      noContactWithMetalsDetails: "",
      barNotNearSurface: "",
      barNotNearSurfaceDetails: "",
      adequateClearance: "",
      adequateClearanceDetails: "",
      specialCoating: "",
      specialCoatingDetails: "",
      noBentBars: "",
      noBentBarsDetails: "",
      noBoxingOut: "",
      noBoxingOutDetails: "",
    },
    remarks: "",
  });

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`/api/concrete/${params.id}`);
        if (!response.ok) {
          if (response.status === 401) {
            router.push("/login");
            return;
          }
          throw new Error("Failed to fetch report");
        }
        const data = await response.json();
        setFormData(data);
      } catch (error) {
        console.error("Error fetching report:", error);
        toast.error("Failed to fetch report");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchReport();
    }
  }, [params.id, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/concrete/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update report");
      }

      toast.success("Report updated successfully");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error updating report:", error);
      toast.error("Failed to update report");
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPhotographs = [...formData.photographs];
        newPhotographs[index] = {
          ...newPhotographs[index],
          image: reader.result,
        };
        setFormData({ ...formData, photographs: newPhotographs });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCaptionChange = (index, caption) => {
    const newPhotographs = [...formData.photographs];
    newPhotographs[index] = {
      ...newPhotographs[index],
      caption,
    };
    setFormData({ ...formData, photographs: newPhotographs });
  };

  const handleAddPhoto = () => {
    setFormData({
      ...formData,
      photographs: [...formData.photographs, { image: null, caption: "" }],
    });
  };

  const handleDeletePhoto = (index) => {
    const newPhotographs = formData.photographs.filter((_, i) => i !== index);
    setFormData({ ...formData, photographs: newPhotographs });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back to Dashboard */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="text-[#0066A1] hover:text-[#004d7a] transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Header Section */}
        <div className="mb-8 border-b border-[#0066A1] pb-6">
          <div className="flex justify-between items-start">
            {/* Logo on the left */}
            <div>
              <Image
                src="/images/logo.jpg"
                alt="SHAHRISH"
                width={300}
                height={100}
                priority
              />
            </div>
            {/* Company Address on the right */}
            <div className="text-right text-sm">
              <p>
                <strong>NYC DOB SIA# 008524</strong>
              </p>
              <p>15 WEST 38TH STREET, 8TH FLOOR (SUITE 808)</p>
              <p>NEW YORK, NEW YORK 10018</p>
              <p>T: (212) 632-8430</p>
            </div>
          </div>
        </div>

        <div className="border-t border-[#0066A1] mb-8" />

        <form onSubmit={handleSubmit}>
          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-8">
            <div className="flex items-center">
              <label className="text-sm min-w-24">Client:</label>
              <input
                type="text"
                value={formData.client}
                onChange={(e) =>
                  setFormData({ ...formData, client: e.target.value })
                }
                className="flex-1 border-b border-gray-300 ml-2 px-1 focus:outline-none focus:border-[#0066A1]"
                required
              />
            </div>
            <div className="flex items-center">
              <label className="text-sm min-w-32">Inspection Date:</label>
              <input
                type="date"
                value={
                  formData.inspectionDate
                    ? formData.inspectionDate.split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setFormData({ ...formData, inspectionDate: e.target.value })
                }
                className="flex-1 border-b border-gray-300 ml-2 px-1 focus:outline-none focus:border-[#0066A1]"
                required
              />
              <div className="ml-2">📅</div>
            </div>
            <div className="flex items-center">
              <label className="text-sm min-w-24">
                Project Site
                <br />
                Address:
              </label>
              <input
                type="text"
                value={formData.projectSiteAddress}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    projectSiteAddress: e.target.value,
                  })
                }
                className="flex-1 border-b border-gray-300 ml-2 px-1 focus:outline-none focus:border-[#0066A1]"
                required
              />
            </div>
            <div className="flex items-center">
              <label className="text-sm min-w-32">Time In/Out:</label>
              <input
                type="text"
                value={formData.timeInOut}
                onChange={(e) =>
                  setFormData({ ...formData, timeInOut: e.target.value })
                }
                placeholder="e.g., 8:30 am"
                className="flex-1 border-b border-gray-300 ml-2 px-1 focus:outline-none focus:border-[#0066A1] placeholder-gray-400"
                required
              />
            </div>
            <div className="flex items-center">
              <label className="text-sm min-w-24">Project ID:</label>
              <input
                type="text"
                value={formData.projectId}
                onChange={(e) =>
                  setFormData({ ...formData, projectId: e.target.value })
                }
                className="flex-1 border-b border-gray-300 ml-2 px-1 focus:outline-none focus:border-[#0066A1]"
                required
              />
            </div>
            <div className="flex items-center">
              <label className="text-sm min-w-32">
                Report
                <br />
                Number:
              </label>
              <input
                type="text"
                value={formData.reportNumber}
                onChange={(e) =>
                  setFormData({ ...formData, reportNumber: e.target.value })
                }
                className="flex-1 border-b border-gray-300 ml-2 px-1 focus:outline-none focus:border-[#0066A1]"
                required
              />
            </div>
            <div className="flex items-center">
              <label className="text-sm min-w-24">
                Inspector
                <br />
                Name:
              </label>
              <input
                type="text"
                value={formData.inspectorName}
                onChange={(e) =>
                  setFormData({ ...formData, inspectorName: e.target.value })
                }
                className="flex-1 border-b border-gray-300 ml-2 px-1 focus:outline-none focus:border-[#0066A1]"
                required
              />
            </div>
            <div className="flex items-center">
              <label className="text-sm min-w-32">
                Site Weather
                <br />
                (°F):
              </label>
              <input
                type="text"
                value={formData.siteWeather}
                onChange={(e) =>
                  setFormData({ ...formData, siteWeather: e.target.value })
                }
                placeholder="e.g., 34"
                className="flex-1 border-b border-gray-300 ml-2 px-1 focus:outline-none focus:border-[#0066A1] placeholder-gray-400"
                required
              />
            </div>
          </div>

          <div className="border-t border-[#0066A1] mb-8" />

          {/* Report Title and Description */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-center mb-4">
              REBAR INSPECTION REPORT
            </h1>
            <p className="text-sm mb-8">
              The above referenced project was visited to observe the concrete
              installation for compliance with project drawings, specifications,
              and NYC Building Code requirements BC 1704.4
            </p>

            {/* Site Contact */}
            <div className="mb-6">
              <div className="font-bold mb-2">SITE CONTACT:</div>
              <input
                type="text"
                value={formData.siteContact}
                onChange={(e) =>
                  setFormData({ ...formData, siteContact: e.target.value })
                }
                className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#0066A1]"
                required
              />
            </div>

            {/* Plans Referenced */}
            <div className="mb-6">
              <div className="font-bold mb-2">
                PLANS REFERENCED:{" "}
                <span className="font-normal text-gray-600">
                  (Plans date, Sealed by, Approved date)
                </span>
              </div>
              <input
                type="text"
                value={formData.plansReferenced}
                onChange={(e) =>
                  setFormData({ ...formData, plansReferenced: e.target.value })
                }
                className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#0066A1]"
                required
              />
            </div>

            {/* Area/Location Inspected */}
            <div className="mb-6">
              <div className="font-bold mb-2">
                AREA/LOCATION INSPECTED:{" "}
                <span className="font-normal text-gray-600">
                  (Floors, Grid Lines, Col btw Fl., Stairs No btw Fl., etc)
                </span>
              </div>
              <input
                type="text"
                value={formData.areaInspected}
                onChange={(e) =>
                  setFormData({ ...formData, areaInspected: e.target.value })
                }
                className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#0066A1]"
                required
              />
            </div>

            {/* Material Used */}
            <div className="mb-6">
              <div className="font-bold mb-2">
                MATERIAL USED/ SUBMITTAL APPROVED:
              </div>
              <input
                type="text"
                value={formData.materialUsed}
                onChange={(e) =>
                  setFormData({ ...formData, materialUsed: e.target.value })
                }
                className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#0066A1]"
                required
              />
            </div>

            {/* Inspection Outcome */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">
                INSPECTION OUTCOME:
              </h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="incomplete"
                    name="inspectionOutcome"
                    value="INCOMPLETE"
                    checked={formData.inspectionOutcome === "INCOMPLETE"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        inspectionOutcome: e.target.value,
                      })
                    }
                    className="mr-2"
                  />
                  <label htmlFor="incomplete">
                    Incomplete Work: Re-inspection required.
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="conformance"
                    name="inspectionOutcome"
                    value="CONFORMANCE"
                    checked={formData.inspectionOutcome === "CONFORMANCE"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        inspectionOutcome: e.target.value,
                      })
                    }
                    className="mr-2"
                  />
                  <label htmlFor="conformance">
                    Conformance: Work is in conformance with contract drawings,
                    specifications and NYC BC.
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="nonConformance"
                    name="inspectionOutcome"
                    value="NON_CONFORMANCE"
                    checked={formData.inspectionOutcome === "NON_CONFORMANCE"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        inspectionOutcome: e.target.value,
                      })
                    }
                    className="mr-2"
                  />
                  <label htmlFor="nonConformance">
                    Non-Conformance Work: Deficiencies noted and upon
                    correction, re-inspection required.
                  </label>
                </div>
              </div>
            </div>

            {/* Non-Conformance Notes */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">
                Non-Conformance Notes:
              </h3>
              <textarea
                value={formData.nonConformanceNotes || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    nonConformanceNotes: e.target.value,
                  })
                }
                placeholder="Enter non-conformance notes here..."
                className="w-full h-32 p-2 border border-gray-300 rounded focus:outline-none focus:border-[#0066A1]"
              />
            </div>

            {/* Attachments */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <span className="mr-2">📎</span>
                <span className="mr-2">Photographs attached:</span>
                <input
                  type="checkbox"
                  checked={formData.hasPhotographs}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hasPhotographs: e.target.checked,
                    })
                  }
                  className="mr-1"
                />
                <span className="mr-2">Yes</span>
                <input
                  type="checkbox"
                  checked={!formData.hasPhotographs}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hasPhotographs: !e.target.checked,
                    })
                  }
                  className="mr-1"
                />
                <span>No</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">📋</span>
                <span className="mr-2">Observations/Checklist attached:</span>
                <input
                  type="checkbox"
                  checked={formData.hasObservations}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hasObservations: e.target.checked,
                    })
                  }
                  className="mr-1"
                />
                <span className="mr-2">Yes</span>
                <input
                  type="checkbox"
                  checked={!formData.hasObservations}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hasObservations: !e.target.checked,
                    })
                  }
                  className="mr-1"
                />
                <span>No</span>
              </div>
            </div>
          </div>

          <div className="border-t border-[#0066A1] mb-8" />

          {/* Checklist Table */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">
              CHECKLIST (Describe all applicable):
            </h3>
            <div className="border border-gray-300">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="border-r border-gray-300 p-2 text-left w-1/3">
                      Requirements
                    </th>
                    <th className="border-r border-gray-300 p-2 text-center w-16">
                      YES
                    </th>
                    <th className="border-r border-gray-300 p-2 text-center w-16">
                      NO
                    </th>
                    <th className="border-r border-gray-300 p-2 text-center w-16">
                      N/A
                    </th>
                    <th className="p-2 text-left">Inspection Details</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      key: "shopDrawings",
                      label: "Shop Drawings are approved and are on-site.",
                    },
                    {
                      key: "gradeOfSteel",
                      label: "Grade of steel delivered as required.",
                    },
                    {
                      key: "spacingCoordinated",
                      label:
                        "Spacing coordinated to suit masonry/concrete units.",
                    },
                    {
                      key: "requiredClearance",
                      label: "Required clearance of steel from forms provided.",
                    },
                    {
                      key: "lengthOfSplices",
                      label:
                        "Length of splices and staggered splices are required.",
                    },
                    {
                      key: "bendsWithinRadii",
                      label:
                        "Bends within radii and tolerance are uniformly made.",
                    },
                    {
                      key: "additionalBars",
                      label:
                        "Additional bars at intersections, openings, and corners provided.",
                    },
                    {
                      key: "barsCleaned",
                      label: "Bars cleaned of material that effect bond.",
                    },
                    {
                      key: "dowelsForMarginal",
                      label: "Dowels for marginal bars at opening.",
                    },
                    {
                      key: "barsTiedAndSupported",
                      label: "Bars tied and supported to avoid displacement.",
                    },
                    {
                      key: "spacersTieWires",
                      label: "Spacers, tie wires, chairs as required.",
                    },
                    {
                      key: "conduitSeparated",
                      label:
                        "Conduit is separated by 3 conduit diameter minimum.",
                    },
                    {
                      key: "noConduitBelow",
                      label:
                        "No conduit or pipe placed below rebar material except where approved.",
                    },
                    {
                      key: "noContactWithMetals",
                      label:
                        "No contact of bars is made with dissimilar metals.",
                    },
                    {
                      key: "barNotNearSurface",
                      label: "Bar not near surface which may cause rusting.",
                    },
                    {
                      key: "adequateClearance",
                      label:
                        "Adequate Clearance provided for deposit of concrete.",
                    },
                    {
                      key: "specialCoating",
                      label: "Special coating as required.",
                    },
                    {
                      key: "noBentBars",
                      label:
                        "No bent bars and tension members installed except where approved.",
                    },
                    {
                      key: "noBoxingOut",
                      label:
                        "Unless approved, boxing out is not approved for subsequent grouting out.",
                    },
                  ].map((item) => (
                    <tr key={item.key} className="border-b border-gray-300">
                      <td className="border-r border-gray-300 p-2">
                        {item.label}
                      </td>
                      <td className="border-r border-gray-300 p-2 text-center">
                        <input
                          type="radio"
                          name={item.key}
                          value="YES"
                          checked={formData.checklist[item.key] === "YES"}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              checklist: {
                                ...formData.checklist,
                                [item.key]: e.target.value,
                              },
                            })
                          }
                        />
                      </td>
                      <td className="border-r border-gray-300 p-2 text-center">
                        <input
                          type="radio"
                          name={item.key}
                          value="NO"
                          checked={formData.checklist[item.key] === "NO"}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              checklist: {
                                ...formData.checklist,
                                [item.key]: e.target.value,
                              },
                            })
                          }
                        />
                      </td>
                      <td className="border-r border-gray-300 p-2 text-center">
                        <input
                          type="radio"
                          name={item.key}
                          value="N/A"
                          checked={formData.checklist[item.key] === "N/A"}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              checklist: {
                                ...formData.checklist,
                                [item.key]: e.target.value,
                              },
                            })
                          }
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={formData.checklist[`${item.key}Details`] || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              checklist: {
                                ...formData.checklist,
                                [`${item.key}Details`]: e.target.value,
                              },
                            })
                          }
                          className="w-full border-b border-gray-300 focus:outline-none focus:border-[#0066A1]"
                          placeholder="Enter inspection details..."
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Inspection Observations/Remarks */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">
              INSPECTION OBSERVATIONS / REMARKS:
            </h3>
            <textarea
              value={formData.remarks || ""}
              onChange={(e) =>
                setFormData({ ...formData, remarks: e.target.value })
              }
              className="w-full border border-gray-300 rounded-md p-4 min-h-[100px] focus:outline-none focus:border-[#0066A1]"
              placeholder="Enter inspection observations and remarks..."
            />
          </div>

          {/* Photographs */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">PHOTOGRAPHS</h3>
            <div className="grid grid-cols-2 gap-8">
              {formData.photographs.map((photo, index) => (
                <div
                  key={index}
                  className="border border-gray-300 rounded-md p-4"
                >
                  <div className="relative">
                    {photo.image ? (
                      <>
                        <div
                          className="relative w-full"
                          style={{ paddingTop: "75%" }}
                        >
                          <img
                            src={photo.image}
                            alt={`Photo ${index + 1}`}
                            className="absolute inset-0 w-full h-full object-contain bg-gray-100"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeletePhoto(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 focus:outline-none"
                        >
                          ×
                        </button>
                      </>
                    ) : (
                      <div
                        className="w-full"
                        style={{ position: "relative", paddingTop: "75%" }}
                      >
                        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                          <div className="text-center">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handlePhotoChange(index, e)}
                              className="hidden"
                              id={`photo-${index}`}
                            />
                            <label
                              htmlFor={`photo-${index}`}
                              className="bg-[#0066A1] text-white px-4 py-2 rounded cursor-pointer hover:bg-[#004d7a]"
                            >
                              Add Photo
                            </label>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <div className="text-sm text-gray-600">
                      Photo {index + 1}:
                    </div>
                    <input
                      type="text"
                      value={photo.caption || ""}
                      onChange={(e) =>
                        handleCaptionChange(index, e.target.value)
                      }
                      className="w-full mt-1 border-b border-gray-300 focus:outline-none focus:border-[#0066A1]"
                      placeholder="Enter photo description"
                    />
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddPhoto}
              className="w-full mt-4 border-2 border-dashed border-gray-300 rounded-md p-4 text-center text-gray-500 hover:border-[#0066A1] hover:text-[#0066A1] transition-colors"
            >
              + Add Another Photo
            </button>
          </div>

          <div className="border-t border-[#0066A1]" />

          {/* Submit Button */}
          <div className="flex justify-end mt-8">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-[#0066A1] text-white rounded hover:bg-[#004d7a] transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
