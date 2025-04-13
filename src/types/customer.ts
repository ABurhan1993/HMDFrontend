// src/types/customer.ts
export interface CustomerData {
    customerId: number;
    customerName: string;
    customerEmail?: string;
    customerContact: string;
    customerWhatsapp?: string;
    customerAddress?: string;
    customerCity?: string;
    customerCountry?: string;
    customerNationality?: string;
    customerNotes?: string;
    customerNextMeetingDate?: string;
    isVisitedShowroom: boolean;
    customerTimeSpent: number;
    wayOfContact: string;
    contactStatus: string;
    customerAssignedTo: string;
    branchName:string;
  }
  