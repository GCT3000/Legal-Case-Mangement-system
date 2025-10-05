
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db, storage } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Case, CaseStats } from '../types/Case';

interface CaseContextType {
  cases: Case[];
  addCase: (caseData: Case, files: { [key: string]: File }) => Promise<void>;
  updateCase: (id: string, updates: Partial<Case>) => Promise<void>;
  deleteCase: (id: string) => Promise<void>;
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



export const CaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cases, setCases] = useState<Case[]>([]);

  // Fetch cases from Firestore on mount
  useEffect(() => {

    const fetchCases = async () => {
      const querySnapshot = await getDocs(collection(db, 'cases'));
      const casesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCases(casesData as Case[]);
    };
    fetchCases();
  }, []);
  // Add case to Firestore
  const addCase = async (caseData: Case, files: { [key: string]: File }) => {
    const documentStatus: any = {};
    for (const key in files) {
      const file = files[key];
      if (file) {
        const storageRef = ref(storage, `cases/${caseData.clientName}/${key}-${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        documentStatus[key] = url;
      }
    }
    const newCase = { ...caseData, documentStatus };
    const docRef = await addDoc(collection(db, 'cases'), newCase);
    setCases(prev => [...prev, { ...newCase, id: docRef.id }]);
  };

  // Update case in Firestore
  const updateCase = async (id: string, updates: Partial<Case>) => {
    await updateDoc(doc(db, 'cases', id), updates);
    setCases(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  // Delete case from Firestore
  const deleteCase = async (id: string) => {
    await deleteDoc(doc(db, 'cases', id));
    setCases(prev => prev.filter(c => c.id !== id));
  };

  // Get case by ID
  const getCaseById = (id: string) => cases.find((c: Case) => c.id === id);

  // Stats
  const getStats = (): CaseStats => {
    const totalClaimAmount = cases.reduce((sum, case_) => sum + case_.claimAmount, 0);
    return {
      total: cases.length,
      filed: cases.filter((c: Case) => c.status === 'Filed').length,
      underInvestigation: cases.filter((c: Case) => c.status === 'Under Investigation').length,
      courtProceedings: cases.filter((c: Case) => c.status === 'Court Proceedings').length,
      settled: cases.filter((c: Case) => c.status === 'Settlement').length,
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
}