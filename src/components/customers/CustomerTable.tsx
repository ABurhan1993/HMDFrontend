import { useState,useEffect } from "react";
import { CustomPagination } from "@/components/ui/Pagination/CustomPagination";
import Button from "@/components/ui/button/Button";
import {
  TrashIcon,
  PencilIcon,
  ChatBubbleLeftEllipsisIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { useUser } from "@/hooks/useUser";
import type { CustomerData } from "@/types/customer";
import axios from "@/components/utils/axios";
import AddCommentModal from "./AddCommentModat";

interface CustomerTableProps {
  customers: CustomerData[];
  onAddClick: () => void;
  onEditClick: (customer: CustomerData) => void;
  filterStatus?: string | null;
  filterCreatedBy?: string | null;
  filterAssignedTo?: string | null;
  filterCreatedDate?: "today" | "week" | "month" | null;
  setFilterCreatedDate?: (val: "today" | "week" | "month" | null) => void;
  onRefresh: () => void;
}


export default function CustomerTable({
  customers,
  onAddClick,
  onEditClick,
  filterStatus,
  filterCreatedBy, // ✅ هون كمان
  filterAssignedTo, // ✅ وهون
  filterCreatedDate,
  setFilterCreatedDate,
  onRefresh,
}: CustomerTableProps) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<CustomerData | null>(null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerData | null>(null);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const itemsPerPage = 20;
  const user = useUser();
  
  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent;
      setCurrentPage(1); // reset pagination
      if (custom.detail === null) {
        filterCreatedDate = null;
      } else {
        filterCreatedDate = custom.detail;
      }
    };
  
    window.addEventListener("filter-date-change", handler);
    return () => window.removeEventListener("filter-date-change", handler);
  }, []);
  
  

  const filtered = customers.filter((c) => {
    const matchSearch =
      c.customerName.toLowerCase().includes(search.toLowerCase()) ||
      c.customerContact.includes(search);
  
    const today = new Date();
    let isToday = false;
    let isDelayed = false;
  
    if (c.customerNextMeetingDate) {
      const parsedDate = new Date(c.customerNextMeetingDate);
      if (!isNaN(parsedDate.getTime())) {
        isDelayed = parsedDate < today;
        isToday = parsedDate.toDateString() === today.toDateString();
      }
    }
  
    const matchStatus =
      filterStatus === "all" ||
      (!filterStatus && true) ||
      (filterStatus === "NeedToContact" && c.contactStatusName === "NeedToContact" && !isDelayed && !isToday) ||
      (filterStatus === "NeedToFollowUp" && c.contactStatusName === "NeedToFollowUp" && !isDelayed && !isToday) ||
      (filterStatus === "NotResponding" && c.contactStatusName === "NotResponding") ||
      (filterStatus === "Contacted" && c.contactStatusName === "Contacted") ||
      (filterStatus === "NeedToContactDelayed" && c.contactStatusName === "NeedToContact" && isDelayed) ||
      (filterStatus === "NeedToFollowUpDelayed" && c.contactStatusName === "NeedToFollowUp" && isDelayed) ||
      (filterStatus === "NeedToContactToday" && c.contactStatusName === "NeedToContact" && isToday) ||
      (filterStatus === "NeedToFollowUpToday" && c.contactStatusName === "NeedToFollowUp" && isToday);
  
    const matchCreatedBy = !filterCreatedBy || c.userId === filterCreatedBy;
    const matchAssignedTo = !filterAssignedTo || c.customerAssignedTo === filterAssignedTo;
    const matchDate = (() => {
      if (!filterCreatedDate) return true;
    
      const created = new Date(c.createdDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
    
      if (filterCreatedDate === "today") {
        return created.toDateString() === today.toDateString();
      }
    
      if (filterCreatedDate === "week") {
        const oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(today.getDate() - 7);
        return created >= oneWeekAgo;
      }
    
      if (filterCreatedDate === "month") {
        return created.getMonth() === today.getMonth() && created.getFullYear() === today.getFullYear();
      }
    
      return true;
    })();
    
  
    return matchSearch && matchStatus && matchCreatedBy && matchAssignedTo && matchDate;
  });
  

  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = async () => {
    if (!customerToDelete) return;
    try {
      await axios.delete(`/customer/delete?id=${customerToDelete.customerId}`);
      setShowDeleteModal(false);
      setCustomerToDelete(null);
      onRefresh(); // ✅ هون بنعمل الريفريش
    } catch {
      alert("Failed to delete customer");
    }
  };
  
  

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div className="flex items-center justify-between flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900">
        <Button onClick={onAddClick} size="sm">New Customer</Button>
  
        {/* ✅ فلتر التاريخ الجديد */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              id="dropdownRadioButton"
              className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              type="button"
              onClick={() => {
                const menu = document.getElementById("dropdownRadio");
                menu?.classList.toggle("hidden");
              }}
            >
              📅 {filterCreatedDate === "today"
                ? "Today"
                : filterCreatedDate === "week"
                ? "Last 7 Days"
                : filterCreatedDate === "month"
                ? "This Month"
                : "All Dates"}
              <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" fill="none" viewBox="0 0 10 6">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
              </svg>
            </button>
  
            <div
              id="dropdownRadio"
              className="z-10 hidden absolute mt-2 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 dark:divide-gray-600"
            >
              <ul className="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200">
                {[
                  { label: "All", value: null },
                  { label: "Today", value: "today" },
                  { label: "Last 7 Days", value: "week" },
                  { label: "This Month", value: "month" },
                ].map((option, i) => (
                  <li key={i}>
                    <label
                      className="flex items-center p-2 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                      onClick={() => {
                        setFilterCreatedDate?.(option.value as "today" | "week" | "month" | null);
                        const menu = document.getElementById("dropdownRadio");
                        menu?.classList.add("hidden");
                      }}
                    >
                      <input
                        type="radio"
                        name="filter-radio"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                        checked={filterCreatedDate === option.value}
                        onChange={() => {}}
                      />
                      <span className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        {option.label}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
  
          {/* ✅ حقل البحث */}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block p-2 px-4 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Search customers"
          />
        </div>
      </div>
  

      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-6 py-3">#</th>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Contact</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Added On</th>
            <th className="px-6 py-3">Meeting</th>
            <th className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((c) => (
            <>
              <tr
                key={c.customerId}
                onClick={() => setExpandedRow(expandedRow === c.customerId ? null : c.customerId)}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
              >
                <td className="px-6 py-4 text-lg">
                  {expandedRow === c.customerId ? <ChevronDownIcon className="w-4 h-4" /> : <ChevronRightIcon className="w-4 h-4" />}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{c.customerName}</td>
                <td className="px-6 py-4">{c.customerContact}</td>
                <td className="px-6 py-4">{c.contactStatusName}</td>
                <td className="px-6 py-4">{c.createdDate?.split("T")[0] || "-"}</td>

                <td className="px-6 py-4">{c.customerNextMeetingDate?.split("T")[0] || "-"}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {user?.permissions.includes("Permissions.Customers.Edit") && (
                      <button className="text-yellow-500 hover:text-yellow-600" title="Edit" onClick={(e) => { e.stopPropagation(); onEditClick(c); }}>
                        <PencilIcon className="w-5 h-5" />
                      </button>
                    )}
                    {user?.permissions.includes("Permissions.CustomerComments.Create") && (
                      <button className="text-blue-500 hover:text-blue-600" title="Add Comment" onClick={(e) => { e.stopPropagation(); setSelectedCustomer(c); setShowCommentModal(true); }}>
                        <ChatBubbleLeftEllipsisIcon className="w-5 h-5" />
                      </button>
                    )}
                    {user?.role?.toLowerCase() === "admin" && (
                      <button className="text-red-500 hover:text-red-600" title="Delete" onClick={(e) => { e.stopPropagation(); setCustomerToDelete(c); setShowDeleteModal(true); }}>
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
              {expandedRow === c.customerId && (
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <td colSpan={6} className="px-6 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* معلومات أساسية */}
                      <div>
                        <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Basic Info</h4>
                        <Info label="Email" value={c.customerEmail} />
                        <Info label="Whatsapp" value={c.customerWhatsapp} />
                        <Info label="Address" value={c.customerAddress} />
                        <Info label="City" value={c.customerCity} />
                        <Info label="Country" value={c.customerCountry} />
                        <Info label="Nationality" value={c.customerNationality} />
                        <Info label="Branch" value={c.branchName} />
                      </div>
                      {/* معلومات التعيين والتصعيد */}
                      <div>
                        <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Assignment & Escalation</h4>
                        <Info label="Assigned To" value={c.customerAssignedToName} />
                        <Info label="Assigned By" value={c.customerAssignedByName} />
                        <Info label="Assigned Date" value={c.customerAssignedDate?.split("T")[0]} />
                        <Info label="Managed By" value={c.managedByName} />
                        <Info label="Escalation Requested" value={c.isEscalationRequested ? "Yes" : "No"} />
                        <Info label="Requested By" value={c.escalationRequestedByName} />
                        <Info label="Requested On" value={c.escalationRequestedOn} />
                        <Info label="Escalated By" value={c.escalatedByUserName} />
                        <Info label="Escalated On" value={c.escalatedOn} />
                      </div>
                      {/* تفاصيل إضافية */}
                      <div>
                        <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Extra</h4>
                        <Info label="Visited Showroom" value={c.isVisitedShowroom ? "Yes" : "No"} />
                        <Info label="Time Spent" value={c.customerTimeSpent ? `${c.customerTimeSpent} min` : "-"} />
                        <Info label="Way of Contact" value={c.wayOfContactName} />
                        <Info label="Notes" value={c.customerNotes} />
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>

      <div className="mt-4">
      <CustomPagination
  currentPage={currentPage}
  itemsPerPage={itemsPerPage}
  totalItems={filtered.length}
  onPageChange={setCurrentPage}
/>



      </div>

      {showDeleteModal && customerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg text-gray-700 dark:text-gray-200 mb-4 text-center">
              Are you sure you want to delete this customer?
            </h3>
            <div className="flex justify-center gap-4">
              <button className="text-white bg-red-600 hover:bg-red-800 px-5 py-2 rounded-lg text-sm" onClick={handleDelete}>
                Yes, I'm sure
              </button>
              <button className="px-5 py-2 text-sm border rounded-lg bg-white hover:bg-gray-100 dark:bg-gray-800 dark:text-white" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showCommentModal && selectedCustomer && (
        <AddCommentModal
          isOpen={showCommentModal}
          onClose={() => {
            setShowCommentModal(false);
            setSelectedCustomer(null);
          }}
          customer={selectedCustomer}
          onSuccess={() => {}}
        />
      )}
    </div>
  );
}

const Info = ({ label, value }: { label: string; value?: string | number }) => (
  <div className="mb-2">
    <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
    <p className="text-sm text-gray-900 dark:text-white font-medium">{value || "-"}</p>
  </div>
);
