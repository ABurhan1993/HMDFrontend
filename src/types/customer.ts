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
    customerNextMeetingDate?: string;
    isVisitedShowroom: boolean;
    customerTimeSpent: number;
    wayOfContact: string;
    wayOfContactName: string;
    contactStatus: string;
    contactStatusName: string;
    customerAssignedTo: string;
    customerAssignedToName: string;
    branchName: string;
    branchId?: number;
    userId?: string;
    managedByName?: string;
    customerAssignedBy?: string;
    customerAssignedByName?: string;
    customerAssignedDate?: string;
    isEscalationRequested?: boolean;
    escalationRequestedBy?: string;
    escalationRequestedByName?: string;
    escalationRequestedOn?: string;
    escalatedBy?: string;
    escalatedByUserName?: string;
    escalatedOn?: string;
    createdDate: string;
    commentDetail?: string;
  }
  
  export interface CustomerCountByUser {
    userId: string;
    userName: string;
    count: number;
  }