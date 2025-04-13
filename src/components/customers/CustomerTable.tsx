import { useEffect, useState } from "react";
import axios from "@/components/utils/axios";
import { CustomPagination } from "@/components/ui/Pagination/CustomPagination";
import Button from "@/components/ui/button/Button";
import { TrashIcon, PencilIcon, ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline";
import { useUser } from "@/hooks/useUser";
import type { CustomerData } from "@/types/customer";

interface CustomerTableProps {
  onAddClick: () => void;
  onEditClick: (customer: CustomerData) => void;
  refreshFlag: boolean;
}

export default function CustomerTable({ onAddClick, onEditClick, refreshFlag }: CustomerTableProps) {
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const user = useUser();

  useEffect(() => {
    axios.get("/customer/all").then((res) => setCustomers(res.data));
  }, [refreshFlag]);

  const filtered = customers.filter((c) => {
    const matchFilter =
      filter === "All" ||
      c.contactStatus === filter ||
      c.wayOfContact === filter;
    const matchSearch =
      c.customerName.toLowerCase().includes(search.toLowerCase()) ||
      c.customerContact.includes(search);
    return matchFilter && matchSearch;
  });

  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      {/* Search + New Button */}
      <div className="flex items-center justify-between flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900">
        <Button onClick={onAddClick} size="sm">
          New Customer
        </Button>

        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search customers"
          />
        </div>
      </div>

      {/* Table */}
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">Name</th>
            <th scope="col" className="px-6 py-3">Contact</th>
            <th scope="col" className="px-6 py-3">Way of Contact</th>
            <th scope="col" className="px-6 py-3">Status</th>
            <th scope="col" className="px-6 py-3">Branch</th>
            <th scope="col" className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((c) => (
            <tr
              key={c.customerId}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {c.customerName}
              </td>
              <td className="px-6 py-4">{c.customerContact}</td>
              <td className="px-6 py-4">{c.wayOfContact}</td>
              <td className="px-6 py-4">{c.contactStatus}</td>
              <td className="px-6 py-4">{c.branchName ?? "-"}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                {user?.permissions.includes("Permissions.Customers.Edit") && (
  <button
    className="text-yellow-500 hover:text-yellow-600"
    title="Edit"
    onClick={() => onEditClick(c)} // لازم تمرر كل بيانات العميل
  >
    <PencilIcon className="w-5 h-5" />
  </button>
)}

                  {user?.permissions.includes("Permissions.CustomerComments.Create") && (
                    <button className="text-blue-500 hover:text-blue-600" title="Add Comment">
                      <ChatBubbleLeftEllipsisIcon className="w-5 h-5" />
                    </button>
                  )}
                  {user?.role?.toLowerCase() === "admin" && (
                    <button className="text-red-500 hover:text-red-600" title="Delete">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4">
        <CustomPagination
          currentPage={currentPage}
          totalPages={Math.ceil(filtered.length / itemsPerPage)}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
