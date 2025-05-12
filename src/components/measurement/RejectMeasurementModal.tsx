import { useState } from "react";
import TextArea from "@/components/form/input/TextArea";
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

export default function RejectMeasurementModal({
  isOpen,
  onClose,
  onSuccess,
  inquiry,
}: Props) {
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !inquiry) return null;

  const handleReject = async () => {
    if (!comment.trim()) return;

    setSubmitting(true);
    try {
      await axios.post(`/measurement/assignment/reject`, {
        inquiryId: inquiry.inquiryId,
        rejectionReason: comment, // تأكدنا إن اسم الباراميتر مطابق
      });


      toast.success("Assignment rejected.");
      onSuccess();
    } catch (err) {
      toast.error("Failed to reject assignment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative p-4 w-full max-w-md">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-800">
          <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Reject Assignment
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
              Please provide a reason for rejecting inquiry{" "}
              <strong>{inquiry.inquiryCode}</strong>.
            </p>
            <TextArea
              placeholder="Add your reason..."
              value={comment}
              onChange={setComment}
              disabled={submitting}
            />
            <div className="flex justify-end space-x-3">
              <Button type="button" size="sm" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                onClick={handleReject}
                disabled={!comment.trim() || submitting}
              >
                Reject
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
