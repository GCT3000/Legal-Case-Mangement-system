import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Case, CaseStats } from '../types/Case';

interface CaseContextType {
  cases: Case[];
  addCase: (caseData: Omit<Case, 'id' | 'dateCreated' | 'lastUpdated'>) => void;
  updateCase: (id: string, caseData: Partial<Case>) => void;
  deleteCase: (id: string) => void;
  getCaseById: (id: string) => Case | undefined;
  getStats: () => CaseStats;
}

const CaseContext = createContext<CaseContextType | undefined>(undefined);

export const useCases = () => {
  const context = useContext(CaseContext);
  if (!context) {
    throw new Error('useCases must be used within a CaseProvider');
  }
  return context;
};

const sampleCases: Case[] = [
  {
    id: '1',
    clientName: 'Rajesh Kumar',
    status: 'Court Proceedings',
    dateCreated: '2024-01-15',
    lastUpdated: '2024-01-20',
    priority: 'High',
    accidentDate: '2023-12-10',
    accidentLocation: 'NH-1, Sector 45, Gurgaon, Haryana',
    policeStationFIR: 'Sector 40 Police Station, Gurgaon',
    firNumber: 'FIR No. 245/2023',
    courtName: 'Punjab & Haryana High Court, Chandigarh',
    caseNumber: 'CWP No. 12345/2024',
    nextHearingDate: '2024-02-15',
    claimAmount: 2500000,
    insuranceCompany: 'New India Assurance Co. Ltd.',
    vehicleNumber: 'HR-26-AB-1234',
    oppositeParty: 'Suresh Transport Company',
    injuryType: 'Fatal',
    medicalExpenses: 150000,
    notes: 'Fatal accident case. Deceased was the sole breadwinner. Family seeking compensation under Motor Vehicle Act.',
    assignedAdvocate: 'Adv. Priya Sharma',
    documentStatus: {
      firCopy: true,
      medicalRecords: true,
      postMortemReport: true,
      vehicleDocuments: false,
      insurancePolicy: true,
      witnessStatements: false
    }
  },
  {
    id: '2',
    clientName: 'Meera Devi',
    status: 'Evidence Collection',
    dateCreated: '2024-01-18',
    lastUpdated: '2024-01-18',
    priority: 'Medium',
    accidentDate: '2024-01-05',
    accidentLocation: 'Ring Road, Lajpat Nagar, New Delhi',
    policeStationFIR: 'Lajpat Nagar Police Station',
    firNumber: 'FIR No. 18/2024',
    courtName: 'Delhi High Court',
    claimAmount: 800000,
    insuranceCompany: 'Oriental Insurance Co. Ltd.',
    vehicleNumber: 'DL-8C-5678',
    oppositeParty: 'Amit Singh',
    injuryType: 'Grievous',
    medicalExpenses: 75000,
    notes: 'Pedestrian hit by speeding car. Multiple fractures, ongoing treatment at AIIMS.',
    assignedAdvocate: 'Adv. Vikram Singh',
    documentStatus: {
      firCopy: true,
      medicalRecords: true,
      postMortemReport: false,
      vehicleDocuments: true,
      insurancePolicy: false,
      witnessStatements: true
    }
  },
  {
    id: '3',
    clientName: 'Ramesh Industries Pvt. Ltd.',
    status: 'Settlement',
    dateCreated: '2023-11-01',
    lastUpdated: '2024-01-10',
    priority: 'Low',
    accidentDate: '2023-10-15',
    accidentLocation: 'Mumbai-Pune Expressway, Km 45',
    policeStationFIR: 'Lonavala Police Station',
    firNumber: 'FIR No. 156/2023',
    courtName: 'Bombay High Court',
    claimAmount: 500000,
    insuranceCompany: 'ICICI Lombard General Insurance',
    vehicleNumber: 'MH-12-CD-9876',
    oppositeParty: 'Maharashtra State Transport Corporation',
    injuryType: 'Property Damage Only',
    notes: 'Commercial vehicle collision. Settlement negotiations in progress.',
    assignedAdvocate: 'Adv. Anjali Mehta',
    documentStatus: {
      firCopy: true,
      medicalRecords: false,
      postMortemReport: false,
      vehicleDocuments: true,
      insurancePolicy: true,
      witnessStatements: true
    }
  },
  {
    id: '4',
    clientName: 'Sunita Sharma',
    status: 'Under Investigation',
    dateCreated: '2024-01-12',
    lastUpdated: '2024-01-12',
    priority: 'Urgent',
    accidentDate: '2024-01-08',
    accidentLocation: 'Jaipur-Delhi Highway, Near Behror',
    policeStationFIR: 'Behror Police Station, Rajasthan',
    firNumber: 'FIR No. 08/2024',
    courtName: 'Rajasthan High Court, Jaipur',
    claimAmount: 1200000,
    vehicleNumber: 'RJ-14-EF-2468',
    oppositeParty: 'Unknown (Hit and Run)',
    injuryType: 'Grievous',
    medicalExpenses: 95000,
    notes: 'Hit and run case. Police investigation ongoing. Victim in ICU.',
    assignedAdvocate: 'Adv. Rohit Gupta',
    documentStatus: {
      firCopy: true,
      medicalRecords: true,
      postMortemReport: false,
      vehicleDocuments: false,
      insurancePolicy: false,
      witnessStatements: false
    }
  }
];

export const CaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cases, setCases] = useState<Case[]>(sampleCases);

  const addCase = (caseData: Omit<Case, 'id' | 'dateCreated' | 'lastUpdated'>) => {
    const newCase: Case = {
      ...caseData,
      id: Date.now().toString(),
      dateCreated: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setCases(prev => [...prev, newCase]);
  };

  const updateCase = (id: string, caseData: Partial<Case>) => {
    setCases(prev => prev.map(case_ => 
      case_.id === id 
        ? { ...case_, ...caseData, lastUpdated: new Date().toISOString().split('T')[0] }
        : case_
    ));
  };

  const deleteCase = (id: string) => {
    setCases(prev => prev.filter(case_ => case_.id !== id));
  };

  const getCaseById = (id: string) => {
    return cases.find(case_ => case_.id === id);
  };

  const getStats = (): CaseStats => {
    const totalClaimAmount = cases.reduce((sum, case_) => sum + case_.claimAmount, 0);
    
    return {
      total: cases.length,
      filed: cases.filter(c => c.status === 'Filed').length,
      underInvestigation: cases.filter(c => c.status === 'Under Investigation').length,
      courtProceedings: cases.filter(c => c.status === 'Court Proceedings').length,
      settled: cases.filter(c => c.status === 'Settlement').length,
      urgent: cases.filter(c => c.priority === 'Urgent').length,
      totalClaimAmount
    };
  };

  return (
    <CaseContext.Provider value={{
      cases,
      addCase,
      updateCase,
      deleteCase,
      getCaseById,
      getStats
    }}>
      {children}
    </CaseContext.Provider>
  );
};