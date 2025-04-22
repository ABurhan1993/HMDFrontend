import { useEffect, useState } from "react";
import InquiryTable from "@/components/inquiry/InquiryTable";
import AddInquiryForm from "@/components/inquiry/AddInquiryForm";
import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import axios from "@/components/utils/axios";
import type { Inquiry } from "@/types/inquiry";
import type { UserDto } from "@/types/UserDto";
import type { WorkscopeOption } from "@/types/workscope";

export default function InquiryList() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<UserDto[]>([]);
  const [workscopes, setWorkscopes] = useState<WorkscopeOption[]>([]);

  const fetchInquiries = () => {
    axios.get("/inquiry/all").then((res) => setInquiries(res.data));
  };

  useEffect(() => {
    fetchInquiries();
    axios.get("/user/by-branch").then((res) => setUsers(res.data));
    axios.get("/workscope/all").then((res) => setWorkscopes(res.data));
  }, []);

  const handleSuccess = () => {
    setShowAddModal(false);
    fetchInquiries();
  };

  const filtered = inquiries.filter(
    (i) =>
      i.customerName.toLowerCase().includes(search.toLowerCase()) ||
      i.inquiryCode.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / 10);

  return (
    <div className="p-4 space-y-6">
      <PageMeta title="Inquiries" description="List of all inquiries" />
      <PageBreadcrumb pageTitle="Inquiries" />

      <InquiryTable
        data={filtered}
        onAddClick={() => setShowAddModal(true)}
        search={search}
        setSearch={setSearch}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />

      <AddInquiryForm
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleSuccess}
        users={users}
        workscopeOptions={workscopes}
      />
    </div>
  );
}
