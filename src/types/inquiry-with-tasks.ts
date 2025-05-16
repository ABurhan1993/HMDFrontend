import type { Inquiry } from "./inquiry";

export type FullInquiry = Inquiry & InquiryWithTasks;


export interface TaskFile {
  fileName: string;
  fileUrl: string;
}

export interface InquiryTask {
  inquiryTaskId: number;
  taskType: string; // مثال: "Measurement"
  files?: TaskFile[];
}

export interface InquiryWithTasks {
  inquiryId: number;
  inquiryCode: string;
  inquiryTasks: InquiryTask[];
  files: {
    fileName: string;
    fileUrl: string;
    fileType: string;
    taskType: string;
  }[];
}
