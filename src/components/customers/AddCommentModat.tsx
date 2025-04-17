import { useEffect, useState } from "react";
import Select from "../form/Select";
import TextArea from "../form/input/TextArea";
import Button from "../ui/button/Button";
import axios from "@/components/utils/axios";
import type { CustomerData } from "@/types/customer";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  customer: CustomerData | null;
  onSuccess?: () => void;
}

interface CommentDto {
  comment: string;
  createdDate: string;
  addedBy: string;
}

const AddCommentModal = ({ isOpen, onClose, customer, onSuccess }: Props) => {
  const [comments, setComments] = useState<CommentDto[]>([]);
  const [status, setStatus] = useState("");
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    if (isOpen && customer) {
      axios
        .get(`/customer/comments/${customer.customerId}`)
        .then((res) => setComments(res.data))
        .catch(() => setComments([]));
    }
  }, [isOpen, customer]);

  const handleSubmit = async () => {
    if (!customer || !commentText || !status) return;
    await axios.post("/customer/add-comment", {
      customerId: customer.customerId,
      contactStatus: status,
      commentDetail: commentText,
    });
    onClose();
    setStatus("");
    setCommentText("");
    onSuccess && onSuccess();
  };

  if (!isOpen || !customer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50">
      <div className="relative p-4 w-full max-w-2xl max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-800">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Add Comment for {customer.customerName}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Comments */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 max-h-[200px] overflow-y-auto p-3">
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

            {/* Select */}
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Contact Status
            </label>
            <Select
              defaultValue={status}
              onChange={(value) => setStatus(value)}
              options={[
                { value: "1", label: "Contacted" },
                { value: "2", label: "Need to Contact" },
                { value: "3", label: "Need to Follow Up" },
                { value: "4", label: "Not Responding" },
              ]}
            />
            {!status && (
              <p className="text-red-500 text-xs mt-1">Please select a status</p>
            )}

            {/* Textarea */}
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-4 mb-1">
              New Comment
            </label>
            <TextArea
              value={commentText}
              onChange={(value) => setCommentText(value)}
              placeholder="Type your comment here..."
            />
            {!commentText && (
              <p className="text-red-500 text-xs mt-1">Comment is required</p>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={!commentText || !status}>
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCommentModal;
