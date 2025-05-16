import { useState, useEffect } from "react";
import axios from "@/components/utils/axios";
import Button from "@/components/ui/button/Button";
import Select from "../form/Select";
import type { FullInquiry } from "@/types/inquiry-with-tasks";
import { toast } from "react-hot-toast";

interface Props {
  inquiry: FullInquiry;
  onClose: () => void;
  onSuccess: () => void;
}

export default function MeasurementApprovalModal({ inquiry, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [designerId, setDesignerId] = useState<string>("");
  const [designers, setDesigners] = useState<{ label: string; value: string }[]>([]);
  const [showAssign, setShowAssign] = useState(false);

  const fetchDesigners = async () => {
    try {
      const res = await axios.get("/user/by-role/Designer");
      setDesigners(
        res.data.map((user: { id: string; fullName: string }) => ({
          label: user.fullName,
          value: user.id,
        }))
      );
    } catch {
      toast.error("Failed to load designers");
    }
  };

  useEffect(() => {
    if (showAssign) fetchDesigners();
  }, [showAssign]);

  const handleApprove = async () => {
    if (!designerId) return toast.error("Please select a designer");
    setLoading(true);
    try {
      await axios.post("/measurement/approve", {
        inquiryId: inquiry.inquiryId,
        designerUserId: designerId,
      });
      toast.success("Approved successfully");
      onSuccess();
      onClose();
    } catch {
      toast.error("Approval failed");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      await axios.post("/measurement/reject", {
        inquiryId: inquiry.inquiryId,
      });
      toast.success("Rejected successfully");
      onSuccess();
      onClose();
    } catch {
      toast.error("Rejection failed");
    } finally {
      setLoading(false);
    }
  };

  const measurementFiles = inquiry.files?.filter(f => f.taskType === "Measurement") ?? [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-xl shadow space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Files for {inquiry.inquiryCode}
        </h3>

        <div>
          <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300">
            {measurementFiles.length > 0 ? (
              measurementFiles.map((file, index) => (
                <li key={index}>
                  <a
                    href={file.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    {file.fileName}
                  </a>
                </li>
              ))
            ) : (
              <li>No files uploaded.</li>
            )}
          </ul>
        </div>

        {showAssign && (
          <Select
            options={designers}
            placeholder="Select Designer"
            value={designerId}
            onChange={(val) => setDesignerId(val as string)}
          />
        )}

        <div className="flex justify-end space-x-3">
          {!showAssign ? (
            <>
              <Button onClick={handleReject} variant="outline" disabled={loading}>
                Reject
              </Button>
              <Button onClick={() => setShowAssign(true)} disabled={loading}>
                Approve
              </Button>
            </>
          ) : (
            <Button onClick={handleApprove} disabled={loading || !designerId}>
              Confirm Approval
            </Button>
          )}
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
