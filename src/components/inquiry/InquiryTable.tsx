import { useState } from "react";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ClockIcon,
  ChatBubbleOvalLeftEllipsisIcon,
} from "@heroicons/react/24/outline";

import { CustomPagination } from "@/components/ui/Pagination/CustomPagination";
import { useUser } from "@/hooks/useUser";
import type { Inquiry } from "@/types/inquiry";
import { Fragment } from "react";

interface InquiryTableProps {
  data: Inquiry[];
  onAddClick: () => void;
  search: string;
  setSearch: (val: string) => void;
  currentPage: number;
  setCurrentPage: (val: number) => void;
  totalPages: number;
}

const Info = ({ label, value }: { label: string; value?: string | number }) => (
  <div className="mb-2">
    <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
    <p className="text-sm text-gray-900 dark:text-white font-medium">{value || "-"}</p>
  </div>
);

const DetailsCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h4 className="font-semibold text-gray-800 dark:text-white mb-2">{title}</h4>
    {children}
  </div>
);

export default function InquiryTable({
  data,
  onAddClick,
  search,
  setSearch,
  currentPage,
  setCurrentPage,
}: InquiryTableProps) {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const user = useUser();

  const handleExpand = (id: number) => {
    setExpandedRow((prev) => (prev === id ? null : id));
  };

  const paginated = data.slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div className="flex items-center justify-between flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900 px-4">
        {user?.permissions.includes("Permissions.Inquiries.Create") && (
          <button
            onClick={onAddClick}
            className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm rounded-lg"
          >
            + New Inquiry
          </button>
        )}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="block p-2 px-4 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Search by customer or code"
        />
      </div>

      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-6 py-3">#</th>
            <th className="px-6 py-3">Inquiry Code</th>
            <th className="px-6 py-3">Customer</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Start Date</th>
            <th className="px-6 py-3">Workscopes</th>
            <th className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {paginated.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-6 text-gray-400 dark:text-gray-500">
                No inquiries found.
              </td>
            </tr>
          ) : (
            paginated.map((i) => (
              <Fragment key={i.inquiryId}>
                <tr
                  onClick={() => handleExpand(i.inquiryId)}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
                >
                  <td className="px-6 py-4">
                    {expandedRow === i.inquiryId ? (
                      <ChevronDownIcon className="w-4 h-4" />
                    ) : (
                      <ChevronRightIcon className="w-4 h-4" />
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {i.inquiryCode || `#${i.inquiryId}`}
                  </td>
                  <td className="px-6 py-4">{i.customerName}</td>
                  <td className="px-6 py-4">{i.inquiryStatusName || "-"}</td>
                  <td className="px-6 py-4">
                    {i.inquiryStartDate ? new Date(i.inquiryStartDate).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-6 py-4">
                    {i.workscopeNames?.length > 0 ? i.workscopeNames.join(", ") : "-"}
                  </td>
                  <td className="px-6 py-4 space-x-2" onClick={(e) => e.stopPropagation()}>
                     <button
      className="text-blue-500 hover:text-blue-600"
      title="Reschedule"
      onClick={(e) => {
        e.stopPropagation();
       // onRescheduleClick(i); // افترض أنك عامل الدالة
      }}
    >
      <ClockIcon className="w-5 h-5" />
    </button>
                    <button
      className="text-green-500 hover:text-green-600"
      title="Comments"
      onClick={(e) => {
        e.stopPropagation();
        //onCommentClick(i);
      }}
    >
      <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5" />
    </button>
                  </td>
                </tr>

                {expandedRow === i.inquiryId && (
                  <tr className="bg-gray-50 dark:bg-gray-700">
                    <td colSpan={7} className="px-6 py-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <DetailsCard title="Customer">
                          <Info label="Email" value={i.customerEmail} />
                          <Info label="Phone" value={i.customerContact} />
                          <Info label="Next Meeting" value={i.customerNextMeetingDate?.split("T")[0]} />
                          <Info label="Notes" value={i.customerNotes} />
                          <Info label="Way of Contact" value={i.wayOfContact} />
                        </DetailsCard>

                        <DetailsCard title="Building">
                          <Info label="Address" value={i.buildingAddress} />
                          <Info label="Floor" value={i.buildingFloor} />
                          <Info label="Condition" value={i.buildingCondition} />
                          <Info label="Occupied" value={i.isOccupied ? "Yes" : "No"} />
                          <a
                            href={i.buildingMakaniMap}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline text-sm mt-1 inline-block"
                          >
                            View Location
                          </a>
                        </DetailsCard>

                        <DetailsCard title="Inquiry">
                          <Info label="Managed By" value={i.managedByUserName} />
                          <Info label="Contact Status" value={i.contactStatus} />
                          <Info label="Design Provided By Customer" value={i.isDesignProvidedByCustomer ? "Yes" : "No"} />
                          <Info label="Measurement Provided By Customer" value={i.isMeasurementProvidedByCustomer ? "Yes" : "No"} />
                          <Info label="Measurement Schedule Date" value={i.measurementScheduleDate?.split("T")[0]} />
                          <Info label="Measurement Assigned To" value={i.measurementAssignedToName} />
                        </DetailsCard>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))
          )}
        </tbody>
      </table>

      <div className="mt-4">
        <CustomPagination
          currentPage={currentPage}
          itemsPerPage={10}
          totalItems={data.length}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}