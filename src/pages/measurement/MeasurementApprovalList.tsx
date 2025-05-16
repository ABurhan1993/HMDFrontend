import { useEffect, useState } from "react";
import axios from "@/components/utils/axios";
import MeasurementApprovalModal from "@/components/measurement/MeasurementApprovalModal";
import MeasurementApprovalTable from "@/components/measurement/MeasurementApprovalTable";
import type { FullInquiry } from "@/types/inquiry-with-tasks";

export default function MeasurementApprovalList() {
  const [inquiries, setInquiries] = useState<FullInquiry[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInquiry, setSelectedInquiry] = useState<FullInquiry | null>(null);

  const fetchApprovals = async () => {
    try {
      const res = await axios.get("/measurement/approvals");
      setInquiries(res.data);
    } catch (error) {
      console.error("Failed to fetch approvals", error);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  return (
    <>
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Measurement Approval</h1>
        <MeasurementApprovalTable
          data={inquiries}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onViewClick={(inquiry) => setSelectedInquiry(inquiry)}
        />
      </div>

      {selectedInquiry && (
        <MeasurementApprovalModal
          inquiry={selectedInquiry}
          onClose={() => setSelectedInquiry(null)}
          onSuccess={fetchApprovals}
        />
      )}
    </>
  );
}
