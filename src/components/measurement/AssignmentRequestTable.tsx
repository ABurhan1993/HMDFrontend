import { useState } from "react";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { CustomPagination } from "@/components/ui/Pagination/CustomPagination";
import type { Inquiry } from "@/types/inquiry";
import AcceptMeasurementModal from "./AcceptMeasurementModal";
import RejectMeasurementModal from "./RejectMeasurementModal";
import { Fragment } from "react";

interface Props {
    data: Inquiry[];
    search: string;
    setSearch: (val: string) => void;
    currentPage: number;
    setCurrentPage: (val: number) => void;
    totalPages: number;
    onActionCompleted: () => void;
}

export default function AssignmentRequestTable({
    data,
    search,
    setSearch,
    currentPage,
    setCurrentPage,
    onActionCompleted,
}: Props) {
    const [expandedRow, setExpandedRow] = useState<number | null>(null);
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
    const [showAccept, setShowAccept] = useState(false);
    const [showReject, setShowReject] = useState(false);

    const handleExpand = (id: number) => {
        setExpandedRow((prev) => (prev === id ? null : id));
    };

    const paginated = data.slice((currentPage - 1) * 10, currentPage * 10);

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <div className="flex items-center justify-between flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900 px-4">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="block p-2 px-4 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Search by customer or code"
                />
            </div>

            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th className="px-6 py-3">#</th>
                        <th className="px-6 py-3">Code</th>
                        <th className="px-6 py-3">Customer</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Schedule Date</th>
                        <th className="px-6 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginated.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="text-center py-6 text-gray-400 dark:text-gray-500">
                                No assignment requests found.
                            </td>
                        </tr>
                    ) : (
                        paginated.map((i) => (
                            <Fragment key={i.inquiryId}>
                                <tr
                                    onClick={() => handleExpand(i.inquiryId)}
                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
                                >
                                    <td className="px-6 py-4">
                                        {expandedRow === i.inquiryId ? (
                                            <ChevronDownIcon className="w-4 h-4" />
                                        ) : (
                                            <ChevronRightIcon className="w-4 h-4" />
                                        )}
                                    </td>
                                    <td className="px-6 py-4">{i.inquiryCode}</td>
                                    <td className="px-6 py-4">{i.customerName}</td>
                                    <td className="px-6 py-4">{i.inquiryStatusName}</td>
                                    <td className="px-6 py-4">
                                        {i.measurementScheduleDate?.split("T")[0] || "-"}
                                    </td>
                                    <td className="px-6 py-4 space-x-2">
                                        <button
                                            className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 text-xs rounded"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedInquiry(i);
                                                setShowAccept(true);
                                            }}
                                        >
                                            Accept
                                        </button>
                                        <button
                                            className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 text-xs rounded"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedInquiry(i);
                                                setShowReject(true);
                                            }}
                                        >
                                            Reject
                                        </button>
                                    </td>
                                </tr>

                                {expandedRow === i.inquiryId && (
                                    <tr className="bg-gray-50 dark:bg-gray-700">
                                        <td colSpan={6} className="px-6 py-6 text-sm text-gray-800 dark:text-white">
                                            {i.inquiryDescription || "-"}
                                        </td>
                                    </tr>
                                )}
                            </Fragment>
                        ))
                    )}
                </tbody>
            </table>

            <div className="mt-4">
                <CustomPagination
                    currentPage={currentPage}
                    itemsPerPage={10}
                    totalItems={data.length}
                    onPageChange={setCurrentPage}
                />
            </div>

            {/* ✅ Accept Modal */}
            {showAccept && selectedInquiry && (
                <AcceptMeasurementModal
                    isOpen={showAccept}
                    inquiry={selectedInquiry}
                    onClose={() => setShowAccept(false)}
                    onSuccess={() => {
                        setShowAccept(false);
                        onActionCompleted();
                    }}
                />

            )}

            {/* ❌ Reject Modal */}
            {showReject && selectedInquiry && (
                <RejectMeasurementModal
                    isOpen={showReject}
                    inquiry={selectedInquiry}
                    onClose={() => setShowReject(false)}
                    onSuccess={() => {
                        setShowReject(false);
                        onActionCompleted();
                    }}
                />

            )}
        </div>
    );
}
