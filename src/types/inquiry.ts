export interface Inquiry {
    inquiryId: number;
    inquiryCode: string;
    inquiryDescription: string;
    inquiryStartDate?: string;
    inquiryEndDate?: string;
    inquiryStatusName: string;
    managedByUserName: string;
  
    customerName: string;
    customerContact: string;
    customerEmail: string;
    customerNotes: string;
    customerNextMeetingDate?: string;
    contactStatus: string;
    wayOfContact: string;
  
    buildingAddress: string;
    buildingMakaniMap: string;
    buildingTypeOfUnit: number;
    buildingCondition: number;
    buildingFloor: string;
    buildingReconstruction?: boolean;
    isOccupied?: boolean;
  
    isMeasurementProvidedByCustomer?: boolean;
    isDesignProvidedByCustomer?: boolean;
    measurementScheduleDate?: string;
    measurementAssignedToName?: string;
  
    workscopeNames: string[];
  }
  
  export interface CustomerCountByUser {
    userId: string;
    userName: string;
    count: number;
  }
  