"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";

export default function InspectionView() {
  const router = useRouter();
  const params = useParams();
  const [inspection, setInspection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInspection() {
      if (!params?.id) return;

      try {
        const response = await fetch(`/api/inspections/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch inspection");
        }
        const data = await response.json();
        console.log("Fetched inspection data:", data);
        setInspection(data);
      } catch (error) {
        console.error("Error fetching inspection:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchInspection();
  }, [params?.id]);

  if (loading) {
    return <div className="text-center mt-8">Loading inspection...</div>;
  }

  if (!inspection) {
    return <div className="text-center mt-8">Inspection not found</div>;
  }

  const getStatus = (item) => {
    if (!item) return null;
    if (item.approved) return "A";
    if (item.disapproved) return "D";
    if (item.notApplicable) return "NA";
    return null;
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="text-right mb-4">
        <Link
          href="/dashboard"
          className="text-[#4A90E2] hover:text-[#357ABD] transition-colors text-base inline-flex items-center gap-2"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/images/logo.jpg"
            alt="SHAHRISH"
            width={300}
            height={100}
            priority
          />
        </div>

        {/* Header */}
        <div className="bg-[#4A90E2] text-white text-center py-3 rounded-t-lg text-xl font-medium">
          Special Inspection Report
        </div>

        <div className="p-6">
          {/* Report Type */}
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <span className="font-medium">REPORT:</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <input
                    type="radio"
                    checked={inspection.reportType === "PROGRESS"}
                    readOnly
                    className="form-radio"
                  />
                  <span>PROGRESS</span>
                </div>
                <div className="flex items-center gap-1">
                  <input
                    type="radio"
                    checked={inspection.reportType === "FINAL"}
                    readOnly
                    className="form-radio"
                  />
                  <span>FINAL</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date:</label>
              <p className="border-b border-gray-300 py-1">
                {inspection.date
                  ? format(new Date(inspection.date), "MM/dd/yyyy")
                  : "No date"}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Client:
                </label>
                <p className="border-b border-gray-300 py-1">
                  {inspection.client}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  SSE Project #:
                </label>
                <p className="border-b border-gray-300 py-1">
                  {inspection.amaaProjectNumber}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                City/County Of:
              </label>
              <p className="border-b border-gray-300 py-1">
                {inspection.cityCounty}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Sent To:</label>
              <p className="border-b border-gray-300 py-1">
                {inspection.sentTo}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Project Name:
              </label>
              <p className="border-b border-gray-300 py-1">
                {inspection.projectName}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Address:</label>
              <p className="border-b border-gray-300 py-1">
                {inspection.address}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Time Arrived:
                </label>
                <p className="border-b border-gray-300 py-1">
                  {inspection.timeArrived}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Time Departed:
                </label>
                <p className="border-b border-gray-300 py-1">
                  {inspection.timeDeparted}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Floor:</label>
              <p className="border-b border-gray-300 py-1">
                {inspection.floor}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Person(s) Met With:
              </label>
              <p className="border-b border-gray-300 py-1">
                {inspection.personsMet}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                DOB Application #:
              </label>
              <p className="border-b border-gray-300 py-1">
                {inspection.dobApplication}
              </p>
            </div>
          </div>

          {/* Notice Text */}
          <div className="col-span-2 mt-8">
            <div className="text-sm text-gray-600 mb-6">
              In accordance with applicable sections of the New York City
              Building Code (BC) of 2014, special inspections have been provided
              for the following items:
            </div>

            <div className="grid grid-cols-[1fr,auto,auto] gap-4 mb-2">
              <div className="font-medium">Inspection Item</div>
              <div className="font-medium text-center w-20">Approved</div>
              <div className="font-medium text-center w-24">See Comments</div>
            </div>

            {[
              {
                name: "Structural Steel – Welding, as per BC 1705.2.1",
                key: "structuralSteelWelding",
              },
              {
                name: "Structural Steel – Details, as per BC 1705.2.2",
                key: "structuralSteelDetails",
              },
              {
                name: "Structural Steel – High Strength Bolting, as per BC 1705.2.3",
                key: "structuralSteelBolting",
              },
              {
                name: "Mechanical Systems, as per BC 1705.21",
                key: "mechanicalSystems",
              },
              {
                name: "Sprinkler Systems, as per BC 1705.29",
                key: "sprinklerSystems",
              },
              {
                name: "Heating Systems, as per BC 1705.31",
                key: "heatingSystems",
              },
              {
                name: "Fire-Resistant Penetrations and Joints, as per BC 1705.17",
                key: "fireResistantPenetrations",
              },
              {
                name: "Post-Installed Anchors (BB# 2014-018, 2014-019), as per BC 1705.37",
                key: "postInstalledAnchors",
              },
              {
                name: "Energy Code Compliance, as per BC 110.3.5",
                key: "energyCodeCompliance",
              },
              {
                name: "Fire-Resistance Rated Construction, as per BC 110.3.4",
                key: "fireResistanceRated",
              },
              {
                name: "Final Inspection, as per BC 28-116.2.4.2 and Directive 14 of 1975",
                key: "finalInspection",
              },
            ].map((item) => {
              const inspectionItem = inspection.inspectionItems?.find(
                (i) => i.name === item.name
              );
              return (
                <div
                  key={item.key}
                  className="grid grid-cols-[1fr,auto,auto] gap-4 items-center py-1 border-b border-gray-200"
                >
                  <div className="text-sm">{item.name}</div>
                  <div className="flex justify-center w-20">
                    <input
                      type="checkbox"
                      checked={inspectionItem?.approved}
                      readOnly
                      className="form-checkbox"
                    />
                  </div>
                  <div className="flex justify-center w-24">
                    <input
                      type="checkbox"
                      checked={inspectionItem?.seeComments}
                      readOnly
                      className="form-checkbox"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Health & Safety Plan */}
          <div className="col-span-2 mt-6">
            <div className="flex items-center gap-6">
              <span className="font-medium">Health & Safety Plan:</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={inspection.healthSafetyPlan?.planRead}
                    readOnly
                    className="form-checkbox"
                  />
                  <span className="text-sm">Plan read and understood</span>
                </div>
                <div className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={inspection.healthSafetyPlan?.inJobFile}
                    readOnly
                    className="form-checkbox"
                  />
                  <span className="text-sm">In Job File</span>
                </div>
                <div className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={inspection.healthSafetyPlan?.seenAtJobSite}
                    readOnly
                    className="form-checkbox"
                  />
                  <span className="text-sm">Seen At Job Site</span>
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="col-span-2 mt-6 text-sm text-gray-600">
            Required Inspection(s): A=Approved, D=Disapproved, NA=Not
            Applicable, Not checked=Not Completed
          </div>

          {/* Detailed Sections */}
          {inspection.structuralSteelWelding && (
            <div className="col-span-2 mt-8 border-t pt-6">
              <h3 className="bg-[#4A90E2] text-white text-center py-2 rounded-md text-lg font-medium mb-6">
                Structural Steel - Welding, as per BC 1704.3.1
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm mb-1">
                      Welding Operator: To Provide
                    </label>
                    <p className="border-b border-gray-300 py-1">
                      {inspection.structuralSteelWelding.weldingOperator}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">
                      License #: To Provide
                    </label>
                    <p className="border-b border-gray-300 py-1">
                      {inspection.structuralSteelWelding.licenseNumber}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Exp Date:</label>
                    <p className="border-b border-gray-300 py-1">
                      {inspection.structuralSteelWelding.expDate?.split("T")[0]}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-1">
                    Shop or Field Welded:
                  </label>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={
                          inspection.structuralSteelWelding.shopOrField ===
                          "shop"
                        }
                        readOnly
                        className="form-radio"
                      />
                      <span>Shop</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={
                          inspection.structuralSteelWelding.shopOrField ===
                          "field"
                        }
                        readOnly
                        className="form-radio"
                      />
                      <span>Field</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm mb-2">
                      Welding Procedure Specification:
                    </label>
                    <div className="flex gap-6">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={
                            inspection.structuralSteelWelding
                              .weldingProcedureSpec?.toBeReceived
                          }
                          readOnly
                          className="form-radio"
                        />
                        <span>To be Received</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={
                            inspection.structuralSteelWelding
                              .weldingProcedureSpec?.received
                          }
                          readOnly
                          className="form-radio"
                        />
                        <span>Received</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm mb-2">
                      Structural Steel Specification:
                    </label>
                    <div className="flex gap-6">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={
                            inspection.structuralSteelWelding
                              .structuralSteelSpec?.toBeReceived
                          }
                          readOnly
                          className="form-radio"
                        />
                        <span>To be Received</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={
                            inspection.structuralSteelWelding
                              .structuralSteelSpec?.received
                          }
                          readOnly
                          className="form-radio"
                        />
                        <span>Received</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm mb-1">
                      Type & Capacity of Machine:
                    </label>
                    <p className="border-b border-gray-300 py-1">
                      {inspection.structuralSteelWelding.machineType}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Electrodes:</label>
                    <p className="border-b border-gray-300 py-1">
                      {inspection.structuralSteelWelding.electrodes}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Polarity:</label>
                    <p className="border-b border-gray-300 py-1">
                      {inspection.structuralSteelWelding.polarity}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Sizes:</label>
                    <p className="border-b border-gray-300 py-1">
                      {inspection.structuralSteelWelding.sizes}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm mb-1">Weld Size:</label>
                    <p className="border-b border-gray-300 py-1">
                      {inspection.structuralSteelWelding.weldSize}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Type of Welds:</label>
                    <p className="border-b border-gray-300 py-1">
                      {inspection.structuralSteelWelding.typeOfWelds}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">
                      Layer of Beads:
                    </label>
                    <p className="border-b border-gray-300 py-1">
                      {inspection.structuralSteelWelding.layerOfBeads}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2">
                    Welding Position Used:
                  </label>
                  <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={
                          inspection.structuralSteelWelding.weldingPosition
                            ?.flat
                        }
                        readOnly
                        className="form-checkbox"
                      />
                      <span>Flat</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={
                          inspection.structuralSteelWelding.weldingPosition
                            ?.horizontal
                        }
                        readOnly
                        className="form-checkbox"
                      />
                      <span>Horizontal</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={
                          inspection.structuralSteelWelding.weldingPosition
                            ?.vertical
                        }
                        readOnly
                        className="form-checkbox"
                      />
                      <span>Vertical</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={
                          inspection.structuralSteelWelding.weldingPosition
                            ?.overhead
                        }
                        readOnly
                        className="form-checkbox"
                      />
                      <span>Overhead</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm mb-1">
                      Total Lineal Inches of Welds Made:
                    </label>
                    <p className="border-b border-gray-300 py-1">
                      {inspection.structuralSteelWelding.totalLinealInches}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Accepted:</label>
                    <p className="border-b border-gray-300 py-1">
                      {inspection.structuralSteelWelding.accepted}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Rejected:</label>
                    <p className="border-b border-gray-300 py-1">
                      {inspection.structuralSteelWelding.rejected}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-1">
                    Complete Joint Penetration Locations:
                  </label>
                  <p className="border-b border-gray-300 py-1">
                    {
                      inspection.structuralSteelWelding
                        .completeJointPenetrationLocations
                    }
                  </p>
                </div>

                <div>
                  <label className="block text-sm mb-1">
                    Partial Joint Penetration Locations:
                  </label>
                  <p className="border-b border-gray-300 py-1">
                    {
                      inspection.structuralSteelWelding
                        .partialJointPenetrationLocations
                    }
                  </p>
                </div>

                <div>
                  <label className="block text-sm mb-1">
                    Non-destructive tests and locations:
                  </label>
                  <p className="border-b border-gray-300 py-1">
                    {inspection.structuralSteelWelding.nonDestructiveTests}
                  </p>
                </div>

                {inspection.structuralSteelWelding.comments && (
                  <div>
                    <label className="block text-sm mb-1">Comments:</label>
                    <p className="border-b border-gray-300 py-1">
                      {inspection.structuralSteelWelding.comments}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {inspection.structuralSteelDetails && (
            <div className="col-span-2 mt-8 border-t pt-6">
              <h3 className="bg-[#4A90E2] text-white text-center py-2 rounded-md text-lg font-medium mb-6">
                Structural Steel - Details, as per BC 1704.3.2
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div></div>
                  <div className="text-center w-16">A</div>
                  <div className="text-center w-16">D</div>
                  <div className="text-center w-16">NA</div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Approved shop drawings for field deviations on site
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.structuralSteelDetails.approvedShopDrawings
                          ?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.structuralSteelDetails.approvedShopDrawings
                          ?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.structuralSteelDetails.approvedShopDrawings
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Bracing and stiffening of structural members
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.structuralSteelDetails.bracingAndStiffening
                          ?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.structuralSteelDetails.bracingAndStiffening
                          ?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.structuralSteelDetails.bracingAndStiffening
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Location of members consistent with plans
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.structuralSteelDetails.locationOfMembers
                          ?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.structuralSteelDetails.locationOfMembers
                          ?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.structuralSteelDetails.locationOfMembers
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">Joint details at each connection</div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.structuralSteelDetails.jointDetails?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.structuralSteelDetails.jointDetails
                          ?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.structuralSteelDetails.jointDetails
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">Seismic design implemented</div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.structuralSteelDetails.seismicDesign
                          ?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.structuralSteelDetails.seismicDesign
                          ?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.structuralSteelDetails.seismicDesign
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                {inspection.structuralSteelDetails.comments && (
                  <div className="mt-6">
                    <label className="block text-sm mb-1">Comments:</label>
                    <p className="border-b border-gray-300 py-1">
                      {inspection.structuralSteelDetails.comments}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {inspection.structuralSteelBolting && (
            <div className="col-span-2 mt-8 border-t pt-6">
              <h3 className="bg-[#4A90E2] text-white text-center py-2 rounded-md text-lg font-medium mb-6">
                Structural Steel - High Strength Bolting, as per BC 1704.3.3
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div></div>
                  <div className="text-center w-16">A</div>
                  <div className="text-center w-16">D</div>
                  <div className="text-center w-16">NA</div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Required approved shop drawings and submittals are available
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.structuralSteelBolting.shopDrawings?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.structuralSteelBolting.shopDrawings
                          ?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.structuralSteelBolting.shopDrawings
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Assembly (bolts, nuts and washers) mill tests reports are
                    available
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.structuralSteelBolting.millTests?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.structuralSteelBolting.millTests?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.structuralSteelBolting.millTests
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Installed bolts are minimum flush with the nuts
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.structuralSteelBolting.installedBolts
                          ?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.structuralSteelBolting.installedBolts
                          ?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.structuralSteelBolting.installedBolts
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Slip-critical connections have all faying surfaces clean and
                    meet mill scale requirements
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.structuralSteelBolting.slipCritical?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.structuralSteelBolting.slipCritical
                          ?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.structuralSteelBolting.slipCritical
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Connections have been tightened in the proper sequence so as
                    not to loosen bolts previously tightened
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.structuralSteelBolting.connectionsTightened
                          ?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.structuralSteelBolting.connectionsTightened
                          ?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.structuralSteelBolting.connectionsTightened
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Bolts are properly stored, containers sealed at end of day,
                    protected from weather and elements
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.structuralSteelBolting.boltsStored?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.structuralSteelBolting.boltsStored
                          ?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.structuralSteelBolting.boltsStored
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Joints brought to the snug-tight condition prior to the
                    pretensioning operation
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.structuralSteelBolting.jointsSnugTight
                          ?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.structuralSteelBolting.jointsSnugTight
                          ?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.structuralSteelBolting.jointsSnugTight
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                {inspection.structuralSteelBolting.comments && (
                  <div className="mt-6">
                    <label className="block text-sm mb-1">Comments:</label>
                    <p className="border-b border-gray-300 py-1">
                      {inspection.structuralSteelBolting.comments}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {inspection.mechanicalSystems && (
            <div className="col-span-2 mt-8 border-t pt-6">
              <h3 className="bg-[#4A90E2] text-white text-center py-2 rounded-md text-lg font-medium mb-6">
                Mechanical Systems, as per BC 1704.16
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div></div>
                  <div className="text-center w-16">A</div>
                  <div className="text-center w-16">D</div>
                  <div className="text-center w-16">NA</div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Systems are complete in accordance with mfrs guidelines and
                    approved documents
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.mechanicalSystems.systemsComplete?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.mechanicalSystems.systemsComplete
                          ?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.mechanicalSystems.systemsComplete
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Supports, hangers, bracing, and vibration isolation are
                    properly spaced and anchored
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.mechanicalSystems.supportsAndBracing
                          ?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.mechanicalSystems.supportsAndBracing
                          ?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.mechanicalSystems.supportsAndBracing
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Required signage and safety instructions are present
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.mechanicalSystems.requiredSignage?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.mechanicalSystems.requiredSignage
                          ?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.mechanicalSystems.requiredSignage
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Verified Electrical and Fire Alarm work related to HVAC
                    installation have been installed and signed off
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.mechanicalSystems.electricalAndFireAlarm
                          ?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.mechanicalSystems.electricalAndFireAlarm
                          ?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.mechanicalSystems.electricalAndFireAlarm
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Ventilation balancing report is complete and in accordance
                    with design
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.mechanicalSystems.ventilationBalancing
                          ?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.mechanicalSystems.ventilationBalancing
                          ?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.mechanicalSystems.ventilationBalancing
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">Required labeling is present</div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.mechanicalSystems.requiredLabeling?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.mechanicalSystems.requiredLabeling
                          ?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.mechanicalSystems.requiredLabeling
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Noise producing equipment within 100 feet of habitable
                    window shall be tested for compliance to code
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.mechanicalSystems.noiseCompliance?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.mechanicalSystems.noiseCompliance
                          ?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.mechanicalSystems.noiseCompliance
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Required fire and fire smoke dampers have been installed and
                    are functioning properly
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.mechanicalSystems.fireDampers?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.mechanicalSystems.fireDampers?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.mechanicalSystems.fireDampers?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Installed unit and DOB approved drawings match for Equipment
                    Use Permits (EUPs)
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.mechanicalSystems.installedUnit?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.mechanicalSystems.installedUnit?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.mechanicalSystems.installedUnit
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Witnessed air balancing test performed using currently
                    calibrated equipment
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.mechanicalSystems.airBalancingTest?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.mechanicalSystems.airBalancingTest
                          ?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.mechanicalSystems.airBalancingTest
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">All materials used are approved</div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.mechanicalSystems.materialsApproved?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.mechanicalSystems.materialsApproved
                          ?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.mechanicalSystems.materialsApproved
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <div className="font-medium mb-4">
                    Test inspection equipment used (verified using currently
                    certified calibration):
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-8">
                      <span className="w-32">
                        Balometer used for air readings
                      </span>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={
                              inspection.mechanicalSystems.testEquipment
                                ?.balometer?.contractor
                            }
                            readOnly
                            className="form-checkbox"
                          />
                          <span>Contractor&apos;s</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={
                              inspection.mechanicalSystems.testEquipment
                                ?.balometer?.amaa
                            }
                            readOnly
                            className="form-checkbox"
                          />
                          <span>AMAA&apos;s</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={
                              inspection.mechanicalSystems.testEquipment
                                ?.balometer?.notApplicable
                            }
                            readOnly
                            className="form-checkbox"
                          />
                          <span>Not Applicable</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <span className="w-32">
                        Octave band noise level meter
                      </span>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={
                              inspection.mechanicalSystems.testEquipment
                                ?.noiseMeter?.contractor
                            }
                            readOnly
                            className="form-checkbox"
                          />
                          <span>Contractor&apos;s</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={
                              inspection.mechanicalSystems.testEquipment
                                ?.noiseMeter?.notApplicable
                            }
                            readOnly
                            className="form-checkbox"
                          />
                          <span>Not Applicable</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <span className="w-32">Smoke test equipment</span>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={
                              inspection.mechanicalSystems.testEquipment
                                ?.smokeTest?.contractor
                            }
                            readOnly
                            className="form-checkbox"
                          />
                          <span>Contractor&apos;s</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={
                              inspection.mechanicalSystems.testEquipment
                                ?.smokeTest?.notApplicable
                            }
                            readOnly
                            className="form-checkbox"
                          />
                          <span>Not Applicable</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-1">
                    Serial or certification number of calibrated equipment:
                  </label>
                  <p className="border-b border-gray-300 py-1">
                    {inspection.mechanicalSystems.serialNumber}
                  </p>
                </div>

                {inspection.mechanicalSystems.comments && (
                  <div className="mt-4">
                    <label className="block text-sm mb-1">Comments:</label>
                    <p className="border-b border-gray-300 py-1">
                      {inspection.mechanicalSystems.comments}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {inspection.sprinklerSystems && (
            <div className="col-span-2 mt-8 border-t pt-6">
              <h3 className="bg-[#4A90E2] text-white text-center py-2 rounded-md text-lg font-medium mb-6">
                Sprinkler Systems, as per BC 1704.23
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div></div>
                  <div className="text-center w-16">A</div>
                  <div className="text-center w-16">D</div>
                  <div className="text-center w-16">NA</div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Installation per NYC BC and NFPA 13
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.sprinklerSystems.installation?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.sprinklerSystems.installation?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.sprinklerSystems.installation?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">Correct number of heads</div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.sprinklerSystems.correctHeads?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.sprinklerSystems.correctHeads?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.sprinklerSystems.correctHeads?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">Head spacing</div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.sprinklerSystems.headSpacing?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.sprinklerSystems.headSpacing?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.sprinklerSystems.headSpacing?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">Spray pattern</div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.sprinklerSystems.sprayPattern?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.sprinklerSystems.sprayPattern?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.sprinklerSystems.sprayPattern?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">Hanging, supports and bracing</div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.sprinklerSystems.hangingAndSupports?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.sprinklerSystems.hangingAndSupports
                          ?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.sprinklerSystems.hangingAndSupports
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Observe and record all testing - Exemption (by DOB)
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.sprinklerSystems.observeAndRecord?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.sprinklerSystems.observeAndRecord
                          ?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.sprinklerSystems.observeAndRecord
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Materials as per approved documents
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.sprinklerSystems.materialsApproved?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.sprinklerSystems.materialsApproved
                          ?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.sprinklerSystems.materialsApproved
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Maintenance and instructions to owner
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.sprinklerSystems.maintenanceInstructions
                          ?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.sprinklerSystems.maintenanceInstructions
                          ?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.sprinklerSystems.maintenanceInstructions
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Material and test certification forms to DOB and FDNY
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.sprinklerSystems.certificationForms?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.sprinklerSystems.certificationForms
                          ?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.sprinklerSystems.certificationForms
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <div className="font-medium mb-4">
                    Test inspection equipment used (verified using currently
                    certified calibration):
                  </div>
                  <div className="flex items-center gap-8">
                    <span className="w-32">Pressure gauge</span>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={
                            inspection.sprinklerSystems.testEquipment
                              ?.pressureGauge?.contractor
                          }
                          readOnly
                          className="form-checkbox"
                        />
                        <span>Contractor&apos;s</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={
                            inspection.sprinklerSystems.testEquipment
                              ?.pressureGauge?.amaa
                          }
                          readOnly
                          className="form-checkbox"
                        />
                        <span>AMAA&apos;s</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={
                            inspection.sprinklerSystems.testEquipment
                              ?.pressureGauge?.notApplicable
                          }
                          readOnly
                          className="form-checkbox"
                        />
                        <span>Not Applicable</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-1">
                    Serial or certification number of calibrated equipment:
                  </label>
                  <p className="border-b border-gray-300 py-1">
                    {inspection.sprinklerSystems.serialNumber}
                  </p>
                </div>

                {inspection.sprinklerSystems.comments && (
                  <div className="mt-4">
                    <label className="block text-sm mb-1">Comments:</label>
                    <p className="border-b border-gray-300 py-1">
                      {inspection.sprinklerSystems.comments}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {inspection.heatingSystems && (
            <div className="col-span-2 mt-8 border-t pt-6">
              <h3 className="bg-[#4A90E2] text-white text-center py-2 rounded-md text-lg font-medium mb-6">
                Heating Systems, as per BC 1704.25
              </h3>
              <div className="space-y-4">
                {inspection.heatingSystems.comments && (
                  <div>
                    <label className="block text-sm mb-1">Comments:</label>
                    <p className="border-b border-gray-300 py-1">
                      {inspection.heatingSystems.comments}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {inspection.fireResistantPenetrations && (
            <div className="col-span-2 mt-8 border-t pt-6">
              <h3 className="bg-[#4A90E2] text-white text-center py-2 rounded-md text-lg font-medium mb-6">
                Fire-Resistant Penetrations and Joints, as per BC 1704.27
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div></div>
                  <div className="text-center w-16">A</div>
                  <div className="text-center w-16">D</div>
                  <div className="text-center w-16">NA</div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Penetrations of fire-rated walls properly sealed with
                    approved materials
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.fireResistantPenetrations.fireRatedWalls
                          ?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.fireResistantPenetrations.fireRatedWalls
                          ?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.fireResistantPenetrations.fireRatedWalls
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Penetrations of floors properly sealed with approved
                    materials
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.fireResistantPenetrations.floors?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.fireResistantPenetrations.floors?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.fireResistantPenetrations.floors
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Construction joints have properly sealed with approved
                    materials
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.fireResistantPenetrations.constructionJoints
                          ?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.fireResistantPenetrations.constructionJoints
                          ?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.fireResistantPenetrations.constructionJoints
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Draftstopping installed in approved manner
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.fireResistantPenetrations.draftstopping
                          ?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.fireResistantPenetrations.draftstopping
                          ?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.fireResistantPenetrations.draftstopping
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Fireblocking installed in approved manner
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.fireResistantPenetrations.fireblocking
                          ?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.fireResistantPenetrations.fireblocking
                          ?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.fireResistantPenetrations.fireblocking
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                {inspection.fireResistantPenetrations.comments && (
                  <div className="mt-4">
                    <label className="block text-sm mb-1">Comments:</label>
                    <p className="border-b border-gray-300 py-1">
                      {inspection.fireResistantPenetrations.comments}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {inspection.postInstalledAnchors && (
            <div className="col-span-2 mt-8 border-t pt-6">
              <h3 className="bg-[#4A90E2] text-white text-center py-2 rounded-md text-lg font-medium mb-6">
                Post-Installed Anchors (BB# 2014-018, 2014-019), as per BC
                1704.32
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div></div>
                  <div className="text-center w-16">A</div>
                  <div className="text-center w-16">D</div>
                  <div className="text-center w-16">NA</div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Storage and preparation of anchors
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.postInstalledAnchors.storage?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.postInstalledAnchors.storage?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.postInstalledAnchors.storage?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Placement, type, size and location
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.postInstalledAnchors.placement?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.postInstalledAnchors.placement?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.postInstalledAnchors.placement?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Labeling of expansion, undercut, adhesive or screw anchors
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.postInstalledAnchors.labeling?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.postInstalledAnchors.labeling?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.postInstalledAnchors.labeling?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Evaluation report per AC193 and/or AC308
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.postInstalledAnchors.evaluationReport
                          ?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.postInstalledAnchors.evaluationReport
                          ?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.postInstalledAnchors.evaluationReport
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Pre-drilled holes conform to specifications
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.postInstalledAnchors.predrilled?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.postInstalledAnchors.predrilled?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.postInstalledAnchors.predrilled
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Installer is certified as Adhesive Anchor Installer
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.postInstalledAnchors.installer?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.postInstalledAnchors.installer?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.postInstalledAnchors.installer?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                {inspection.postInstalledAnchors.comments && (
                  <div className="mt-4">
                    <label className="block text-sm mb-1">Comments:</label>
                    <p className="border-b border-gray-300 py-1">
                      {inspection.postInstalledAnchors.comments}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {inspection.energyCodeCompliance && (
            <div className="col-span-2 mt-8 border-t pt-6">
              <h3 className="bg-[#4A90E2] text-white text-center py-2 rounded-md text-lg font-medium mb-6">
                Energy Code Compliance, as per BC 110.3.5
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div></div>
                  <div className="text-center w-16">A</div>
                  <div className="text-center w-16">D</div>
                  <div className="text-center w-16">NA</div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Protection of exposed foundation insulation
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.foundationInsulation
                          ?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.foundationInsulation
                          ?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.foundationInsulation
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Insulation placement and R-values
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.insulationPlacement
                          ?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.insulationPlacement
                          ?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.insulationPlacement
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Fenestration and door U-factor and product ratings
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.fenestrationRatings
                          ?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.fenestrationRatings
                          ?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.fenestrationRatings
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">Fenestration air leakage</div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.airLeakage?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.airLeakage?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.airLeakage
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">Fenestration areas</div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.fenestrationAreas
                          ?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.fenestrationAreas
                          ?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.fenestrationAreas
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">Air barrier – visual inspection</div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.airBarrierVisual
                          ?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.airBarrierVisual
                          ?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.airBarrierVisual
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">Air barrier – testing</div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.airBarrierTesting
                          ?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.airBarrierTesting
                          ?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.airBarrierTesting
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Air barrier continuity plan testing/inspection
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.airBarrierContinuity
                          ?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.airBarrierContinuity
                          ?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.airBarrierContinuity
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">Vestibules</div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.vestibules?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.vestibules?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.vestibules
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">Fireplaces</div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.fireplaces?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.fireplaces?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.fireplaces
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Ventilation and air distribution system
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.ventilationSystem
                          ?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.ventilationSystem
                          ?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.ventilationSystem
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">Shutoff dampers</div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.shutoffDampers?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.shutoffDampers
                          ?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.shutoffDampers
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    HVAC-R and service water heating equipment
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.hvacEquipment?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.hvacEquipment
                          ?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.hvacEquipment
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    HVAC-R and service water heating system controls
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.hvacControls?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.hvacControls
                          ?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.hvacControls
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    HVAC-R and service water piping design and insulation
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.hvacPiping?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.hvacPiping?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.hvacPiping
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Duct leakage testing, insulation and design
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.ductLeakage?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.ductLeakage?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.ductLeakage
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">Metering</div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.metering?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.metering?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.metering?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">Lighting in dwelling units</div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.dwellingLighting
                          ?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.dwellingLighting
                          ?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.dwellingLighting
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">Interior lighting power</div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.interiorLighting
                          ?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.interiorLighting
                          ?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.interiorLighting
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">Exterior lighting power</div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.exteriorLighting
                          ?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.exteriorLighting
                          ?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.exteriorLighting
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">Lighting controls</div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.lightingControls
                          ?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.lightingControls
                          ?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.lightingControls
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">Electrical motors and elevators</div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.electricalMotors
                          ?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.electricalMotors
                          ?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.electricalMotors
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">Maintenance information</div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.maintenanceInfo
                          ?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.maintenanceInfo
                          ?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.maintenanceInfo
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">Permanent certificate</div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.permanentCertificate
                          ?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.permanentCertificate
                          ?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.energyCodeCompliance.permanentCertificate
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                {inspection.energyCodeCompliance.comments && (
                  <div className="mt-4">
                    <label className="block text-sm mb-1">Comments:</label>
                    <p className="border-b border-gray-300 py-1">
                      {inspection.energyCodeCompliance.comments}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {inspection.fireResistanceRated && (
            <div className="col-span-2 mt-8 border-t pt-6">
              <h3 className="bg-[#4A90E2] text-white text-center py-2 rounded-md text-lg font-medium mb-6">
                Fire-Resistance Rated Construction, as per BC 110.3.4
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div></div>
                  <div className="text-center w-16">A</div>
                  <div className="text-center w-16">D</div>
                  <div className="text-center w-16">NA</div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    All fire-rated partitions comply with design and code
                    requirements
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.fireResistanceRated.fireRatedPartitions
                          ?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.fireResistanceRated.fireRatedPartitions
                          ?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.fireResistanceRated.fireRatedPartitions
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    All fire-rated floors comply with design and code
                    requirements
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.fireResistanceRated.fireRatedFloors?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.fireResistanceRated.fireRatedFloors
                          ?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.fireResistanceRated.fireRatedFloors
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    All fire-rated ceilings comply with design and code
                    requirements
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.fireResistanceRated.fireRatedCeilings
                          ?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.fireResistanceRated.fireRatedCeilings
                          ?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.fireResistanceRated.fireRatedCeilings
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    All fire-rated shafts comply with design and code
                    requirements
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.fireResistanceRated.fireRatedShafts?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.fireResistanceRated.fireRatedShafts
                          ?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.fireResistanceRated.fireRatedShafts
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    All fire shutters comply with design and code requirements
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.fireResistanceRated.fireShutters?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.fireResistanceRated.fireShutters?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.fireResistanceRated.fireShutters
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                {inspection.fireResistanceRated.comments && (
                  <div className="mt-4">
                    <label className="block text-sm mb-1">Comments:</label>
                    <p className="border-b border-gray-300 py-1">
                      {inspection.fireResistanceRated.comments}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {inspection.finalInspection && (
            <div className="col-span-2 mt-8 border-t pt-6">
              <h3 className="bg-[#4A90E2] text-white text-center py-2 rounded-md text-lg font-medium mb-6">
                Final Inspection, as per BC 28-116.2.4.2 and Directive 14 of
                1975
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div></div>
                  <div className="text-center w-16">A</div>
                  <div className="text-center w-16">D</div>
                  <div className="text-center w-16">NA</div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Construction work is complete and in substantial compliance
                    with approved construction documents
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.finalInspection.constructionComplete
                          ?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.finalInspection.constructionComplete
                          ?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.finalInspection.constructionComplete
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    All work has been built to code and complies with all local
                    laws
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.finalInspection.codeCompliance?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.finalInspection.codeCompliance?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.finalInspection.codeCompliance?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    All required special and progress inspection items have been
                    approved
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.finalInspection.inspectionItems?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.finalInspection.inspectionItems?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.finalInspection.inspectionItems
                          ?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Paths of egress are provided in accordance with design and
                    code requirements
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={inspection.finalInspection.egressPaths?.approved}
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.finalInspection.egressPaths?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.finalInspection.egressPaths?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Exit signs are in the proper location and indicate the
                    correct means of egress
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={inspection.finalInspection.exitSigns?.approved}
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.finalInspection.exitSigns?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.finalInspection.exitSigns?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Construction complies with ADA requirements indicated on
                    drawings
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.finalInspection.adaCompliance?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.finalInspection.adaCompliance?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.finalInspection.adaCompliance?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 items-center">
                  <div className="italic">
                    Doors open in the correct direction and have fire-ratings
                    indicated on drawings
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.finalInspection.doorsDirection?.approved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.finalInspection.doorsDirection?.disapproved
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                  <div className="text-center w-16">
                    <input
                      type="radio"
                      checked={
                        inspection.finalInspection.doorsDirection?.notApplicable
                      }
                      readOnly
                      className="form-radio"
                    />
                  </div>
                </div>

                {inspection.finalInspection.comments && (
                  <div className="mt-4">
                    <label className="block text-sm mb-1">Comments:</label>
                    <p className="border-b border-gray-300 py-1">
                      {inspection.finalInspection.comments}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Comments and Images Section */}
          <div className="col-span-2 mt-8 border-t pt-6">
            <h3 className="bg-[#4A90E2] text-white text-center py-2 rounded-md text-lg font-medium mb-6">
              Comments and additional information, including photographs
            </h3>
            {inspection.images && inspection.images.length > 0 ? (
              <div className="space-y-6">
                {inspection.images.map((imageGroup, index) =>
                  imageGroup.urls && imageGroup.urls.length > 0 ? (
                    <div
                      key={index}
                      className="border rounded-lg overflow-hidden shadow-sm"
                    >
                      <div className="flex flex-wrap gap-4 p-4">
                        {imageGroup.urls.map((url, urlIndex) => (
                          <div key={urlIndex} className="flex-shrink-0">
                            <Image
                              src={url}
                              alt={`Inspection image ${index + 1}-${
                                urlIndex + 1
                              }`}
                              width={800}
                              height={600}
                              className="rounded max-w-full h-auto"
                              style={{
                                maxWidth: "min(100%, 500px)",
                                objectFit: "contain",
                              }}
                            />
                          </div>
                        ))}
                      </div>
                      {imageGroup.comment && (
                        <div className="p-4 border-t">
                          <p className="text-sm text-gray-600">
                            {imageGroup.comment}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : null
                )}
              </div>
            ) : (
              <p className="text-center text-gray-500 italic">
                No images available
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
