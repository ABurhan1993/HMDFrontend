import Button from "@/components/ui/button/Button";
import type { Inquiry } from "@/types/inquiry";
import axios from "@/components/utils/axios";
import { toast } from "react-hot-toast";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  inquiry: Inquiry;
}

export default function AcceptMeasurementModal({
  isOpen,
  onClose,
  onSuccess,
  inquiry,
}: Props) {
  if (!isOpen || !inquiry) return null;

  const handleConfirm = async () => {
    try {
      await axios.post(`/measurement/assignment/approve`, {
        inquiryId: inquiry.inquiryId,
      });
      toast.success("Assignment approved.");
      onSuccess();
    } catch (err) {
      toast.error("Failed to approve assignment.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative p-4 w-full max-w-md">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-800">
          <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Confirm Assignment
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              ✕
            </button>
          </div>
          <div className="p-6 space-y-6">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Are you sure you want to <strong>accept</strong> the assignment for inquiry{" "}
              <strong>{inquiry.inquiryCode}</strong>?
            </p>
            <div className="flex justify-end space-x-3">
              <Button type="button" size="sm" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" size="sm" onClick={handleConfirm}>
                Confirm
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
