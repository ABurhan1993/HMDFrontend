import { useEffect, useState } from "react";
import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import axios from "@/components/utils/axios";
import type { FullInquiry } from "@/types/inquiry-with-tasks";
import MyMeasurementTable from "@/components/measurement/MyMeasurementTable";
import UploadMeasurementModal from "@/components/measurement/UploadMeasurementModal"; // ✅ جديد

export default function MyMeasurements() {
    const [inquiries, setInquiries] = useState<FullInquiry[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedInquiry, setSelectedInquiry] = useState<FullInquiry | null>(null);
    const [showUploadModal, setShowUploadModal] = useState(false);

    const fetchMeasurements = () => {
        axios.get("/measurement/my-measurements").then((res) => {
            setInquiries(res.data);
        });
    };

    useEffect(() => {
        fetchMeasurements();
    }, []);

    return (
        <div className="p-4 space-y-6">
            <PageMeta title="My Measurements" description="List of assigned measurements" />
            <PageBreadcrumb pageTitle="My Measurements" />

            <MyMeasurementTable
                data={inquiries}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                onUploadClick={(inquiry) => {
                    setSelectedInquiry(inquiry);
                    setShowUploadModal(true);
                }}
            />

            {selectedInquiry && (
                <UploadMeasurementModal
                    isOpen={showUploadModal}
                    inquiry={selectedInquiry}
                    onClose={() => {
                        setShowUploadModal(false);
                        setSelectedInquiry(null);
                    }}
                    onSuccess={() => {
                        setShowUploadModal(false);
                        setSelectedInquiry(null);
                        fetchMeasurements();
                    }}
                />
            )}

        </div>
    );
}
