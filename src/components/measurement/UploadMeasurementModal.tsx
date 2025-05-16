import { useRef, useState } from "react";
import axios from "@/components/utils/axios";
import { toast } from "react-hot-toast";
import Button from "@/components/ui/button/Button";
import TextArea from "@/components/form/input/TextArea";
import { CloudArrowUpIcon, DocumentIcon, PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import type { Inquiry } from "@/types/inquiry";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    inquiry: Inquiry;
}

export default function UploadMeasurementModal({
    isOpen,
    onClose,
    onSuccess,
    inquiry,
}: Props) {
    const [files, setFiles] = useState<File[]>([]);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen || !inquiry) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const selectedFiles = Array.from(e.target.files);
        setFiles((prev) => [...prev, ...selectedFiles]);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragActive(false);
        if (e.dataTransfer.files.length > 0) {
            const droppedFiles = Array.from(e.dataTransfer.files);
            setFiles((prev) => [...prev, ...droppedFiles]);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = () => {
        setDragActive(false);
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (files.length === 0) return toast.error("Please select files.");

        const formData = new FormData();
        formData.append("InquiryId", inquiry.inquiryId.toString());
        if (comment) formData.append("Comment", comment);
        files.forEach((file) => formData.append("Files", file));

        setLoading(true);
        try {
            await axios.post("/measurement/submit-task", formData);
            toast.success("Measurement submitted successfully");
            onSuccess();
            onClose();
        } catch (err) {
            toast.error("Upload failed");
        } finally {
            setLoading(false);
        }
    };

    const triggerFileSelect = () => fileInputRef.current?.click();

    const renderFileIcon = (file: File) => {
        if (file.type.startsWith("image/")) return <PhotoIcon className="w-8 h-8 text-blue-500" />;
        if (file.type === "application/pdf") return <DocumentIcon className="w-8 h-8 text-red-500" />;
        return <DocumentIcon className="w-8 h-8 text-gray-500" />;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg shadow space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Upload Measurement Files for {inquiry.inquiryCode}
                </h3>

                {/* Dropzone */}
                <div
                    onClick={triggerFileSelect}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onDragLeave={handleDragLeave}
                    className={`cursor-pointer border-2 border-dashed rounded-lg p-6 transition 
    ${dragActive ? "bg-blue-100 dark:bg-blue-900" : "bg-white dark:bg-gray-700"} 
    border-gray-300 dark:border-gray-600`}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept=".pdf,.png,.jpg,.jpeg"
                        className="hidden"
                        onChange={handleFileChange}
                    />

                    {files.length === 0 ? (
                        <div className="text-center">
                            <CloudArrowUpIcon className="w-10 h-10 mx-auto mb-2 text-gray-400 dark:text-gray-300" />
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Drag & drop files here or click to select
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-4">
                            {files.map((file, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col items-center bg-gray-100 dark:bg-gray-800 p-3 rounded relative"
                                >
                                    {renderFileIcon(file)}
                                    <p className="text-xs text-center mt-2 break-words">{file.name}</p>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation(); // يمنع فتح نافذة الإضافة
                                            removeFile(index);
                                        }}
                                        className="absolute top-1 right-1 text-red-500 hover:text-red-700"
                                    >
                                        <XMarkIcon className="w-4 h-4" />
                                    </button>

                                </div>
                            ))}
                        </div>
                    )}
                </div>


                <TextArea
                    placeholder="Comment (optional)"
                    value={comment}
                    onChange={setComment}
                    disabled={loading}
                />

                <div className="flex justify-end space-x-3">
                    <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button type="submit" onClick={handleSubmit} disabled={loading}>
                        Submit
                    </Button>
                </div>
            </div>
        </div>
    );
}
