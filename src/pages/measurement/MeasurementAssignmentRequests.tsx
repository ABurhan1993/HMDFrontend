import { useEffect, useState } from "react";
import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import axios from "@/components/utils/axios";
import type { Inquiry } from "@/types/inquiry";
import AssignmentRequestTable from "@/components/measurement/AssignmentRequestTable";

export default function MeasurementAssignmentRequests() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchAssignmentRequests = () => {
    axios.get("/measurement/assignment-requests").then((res) => {
      setInquiries(res.data);
    });
  };

  useEffect(() => {
    fetchAssignmentRequests();
  }, []);

  const filtered = inquiries.filter(
    (i) =>
      i.customerName.toLowerCase().includes(search.toLowerCase()) ||
      i.inquiryCode.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / 10);

  return (
    <div className="p-4 space-y-6">
      <PageMeta title="Measurement Assignment Requests" description="List of inquiries assigned for measurement" />
      <PageBreadcrumb pageTitle="Assignment Requests" />

      <AssignmentRequestTable
        data={filtered}
        search={search}
        setSearch={setSearch}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        onActionCompleted={fetchAssignmentRequests}
      />
    </div>
  );
}
