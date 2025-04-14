// ✅ هذا هو CustomerTable بعد دمج زر الحذف مع المودال

import { useEffect, useState } from "react";
import axios from "@/components/utils/axios";
import { CustomPagination } from "@/components/ui/Pagination/CustomPagination";
import Button from "@/components/ui/button/Button";
import {
  TrashIcon,
  PencilIcon,
  ChatBubbleLeftEllipsisIcon,
} from "@heroicons/react/24/outline";
import { useUser } from "@/hooks/useUser";
import type { CustomerData } from "@/types/customer";

interface CustomerTableProps {
  onAddClick: () => void;
  onEditClick: (customer: CustomerData) => void;
  refreshFlag: boolean;
}

export default function CustomerTable({ onAddClick, onEditClick, refreshFlag }: CustomerTableProps) {
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<CustomerData | null>(null);
  const itemsPerPage = 5;
  const user = useUser();

  useEffect(() => {
    axios.get("/customer/all").then((res) => setCustomers(res.data));
  }, [refreshFlag]);

  const filtered = customers.filter((c) => {
    const matchSearch =
      c.customerName.toLowerCase().includes(search.toLowerCase()) ||
      c.customerContact.includes(search);
    return matchSearch;
  });

  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = async () => {
    if (!customerToDelete) return;
    try {
      await axios.delete(`/customer/delete?id=${customerToDelete.customerId}`);
      setCustomers((prev) => prev.filter(c => c.customerId !== customerToDelete.customerId));
      setShowDeleteModal(false);
    } catch (err) {
      alert("Failed to delete customer");
    }
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div className="flex items-center justify-between flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900">
        <Button onClick={onAddClick} size="sm">New Customer</Button>

        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Search customers"
          />
        </div>
      </div>

      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Contact</th>
            <th className="px-6 py-3">Way of Contact</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Branch</th>
            <th className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((c) => (
            <tr key={c.customerId} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{c.customerName}</td>
              <td className="px-6 py-4">{c.customerContact}</td>
              <td className="px-6 py-4">{c.wayOfContact}</td>
              <td className="px-6 py-4">{c.contactStatus}</td>
              <td className="px-6 py-4">{c.branchName ?? "-"}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  {user?.permissions.includes("Permissions.Customers.Edit") && (
                    <button className="text-yellow-500 hover:text-yellow-600" title="Edit" onClick={() => onEditClick(c)}>
                      <PencilIcon className="w-5 h-5" />
                    </button>
                  )}

                  {user?.permissions.includes("Permissions.CustomerComments.Create") && (
                    <button className="text-blue-500 hover:text-blue-600" title="Add Comment">
                      <ChatBubbleLeftEllipsisIcon className="w-5 h-5" />
                    </button>
                  )}

                  {user?.role?.toLowerCase() === "admin" && (
                    <button
                      className="text-red-500 hover:text-red-600"
                      title="Delete"
                      onClick={() => {
                        setCustomerToDelete(c);
                        setShowDeleteModal(true);
                      }}
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4">
        <CustomPagination
          currentPage={currentPage}
          totalPages={Math.ceil(filtered.length / itemsPerPage)}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && customerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg text-gray-700 dark:text-gray-200 mb-4 text-center">
              Are you sure you want to delete this customer?
            </h3>
            <div className="flex justify-center gap-4">
              <button
                className="text-white bg-red-600 hover:bg-red-800 px-5 py-2 rounded-lg text-sm"
                onClick={handleDelete}
              >
                Yes, I'm sure
              </button>
              <button
                className="px-5 py-2 text-sm border rounded-lg bg-white hover:bg-gray-100 dark:bg-gray-800 dark:text-white"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
