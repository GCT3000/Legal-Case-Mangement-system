export interface Case {
  id: string;
  clientName: string;
  status: 'Filed' | 'Under Investigation' | 'Evidence Collection' | 'Court Proceedings' | 'Settlement' | 'Judgment Passed' | 'Appeal Filed' | 'Closed';
  dateCreated: string;
  lastUpdated: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  accidentDate: string;
  accidentLocation: string;
  policeStationFIR: string;
  firNumber: string;
  courtName: string;
  caseNumber?: string;
  nextHearingDate?: string;
  claimAmount: number;
  insuranceCompany?: string;
  vehicleNumber: string;
  oppositeParty: string;
  injuryType: 'Fatal' | 'Grievous' | 'Simple' | 'Property Damage Only';
  medicalExpenses?: number;
  notes: string;
  assignedAdvocate: string;
  documentStatus: {
    firCopy: boolean;
    medicalRecords: boolean;
    postMortemReport: boolean;
    vehicleDocuments: boolean;
    insurancePolicy: boolean;
    witnessStatements: boolean;
  };
}

export interface CaseStats {
  total: number;
  filed: number;
  underInvestigation: number;
  courtProceedings: number;
  settled: number;
  urgent: number;
  totalClaimAmount: number;
}