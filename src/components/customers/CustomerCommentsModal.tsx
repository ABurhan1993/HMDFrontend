import { useEffect, useState } from "react";
import Button from "../ui/button/Button";
import axios from "@/components/utils/axios";
import type { CustomerData } from "@/types/customer";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  customer: CustomerData | null;
}

interface CommentDto {
  comment: string;
  createdDate: string;
  addedBy: string;
}

const CustomerCommentModal = ({ isOpen, onClose, customer }: Props) => {
  const [comments, setComments] = useState<CommentDto[]>([]);

  useEffect(() => {
    if (isOpen && customer) {
      axios
        .get(`/customer/comments/${customer.customerId}`)
        .then((res) => setComments(res.data))
        .catch(() => setComments([]));
    }
  }, [isOpen, customer]);

  if (!isOpen || !customer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50"
    onClick={(e) => e.stopPropagation()}>
      <div className="relative p-4 w-full max-w-2xl max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-800">
          <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Previous Comments - {customer.customerName}
            </h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            <div className="border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 max-h-[400px] overflow-y-auto p-3">
              {comments.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No previous comments.
                </p>
              ) : (
                comments.map((c, i) => (
                  <div
                    key={i}
                    className="mb-3 p-3 bg-white dark:bg-gray-700 rounded-md shadow text-sm"
                  >
                    <p className="text-gray-900 dark:text-white">{c.comment}</p>
                    <div className="text-xs text-gray-500 dark:text-gray-300 mt-2 flex justify-between">
                      <span>{c.addedBy}</span>
                      <span>{new Date(c.createdDate).toLocaleString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end">
            <Button
  variant="outline"
  onClick={(e) => {
    e.stopPropagation(); // 🛑 يمنع الحدث يوصل للـ EditCustomerForm
    onClose();
  }}
>
  Close
</Button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerCommentModal;
