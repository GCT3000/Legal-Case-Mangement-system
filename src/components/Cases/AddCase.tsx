
import React, { useState } from 'react';
import { useNotification } from '../../context/NotificationContext';
import { Save, X, AlertCircle } from 'lucide-react';


interface AddCaseProps {
  onPageChange: (page: string) => void;
}

interface DocumentFiles {
  firCopy: File | null;
  medicalRecords: File | null;
  postMortemReport: File | null;
  vehicleDocuments: File | null;
  insurancePolicy: File | null;
  witnessStatements: File | null;
  inquestReport: File | null;
  mviReport: File | null;
  chargeSheet: File | null;
}

interface AddCaseForm {
  clientName: string;
  status: 'Filed';
  accidentDate: string;
  accidentLocation: string;
  policeStationFIR: string;
  firNumber: string;
  caseNumber: string;
  nextHearingDate: string;
  claimAmount: string;
  insuranceCompany: string;
  injuryType: 'Simple' | 'Grievous' | 'Fatal' | 'Property Damage Only';
  medicalExpenses: string;
  notes: string;
  vehicles: string[];
  advocate: string;
  referredBy: string;
  documentStatus: {
    firCopy: boolean;
    medicalRecords: boolean;
    postMortemReport: boolean;
    vehicleDocuments: boolean;
    insurancePolicy: boolean;
    witnessStatements: boolean;
  };
  inquestReport: boolean;
  mviReport: boolean;
  chargeSheet: boolean;
  documentFiles: DocumentFiles;
  priority: 'Low' | 'Medium' | 'High';
}

const AddCase: React.FC<AddCaseProps> = ({ onPageChange }) => {
  const { addNotification } = useNotification();
  // Removed unused addCase
  // Simple notification state
  const [notification, setNotification] = useState<string | null>(null);
  // const { addCase } = useCases(); // Not used with direct Firestore add
  const [formData, setFormData] = useState<AddCaseForm>({
    clientName: '',
    status: 'Filed' as const,
    accidentDate: '',
    accidentLocation: '',
    policeStationFIR: '',
    firNumber: '',
    caseNumber: '',
    nextHearingDate: '',
    claimAmount: '',
    insuranceCompany: '',
    injuryType: 'Simple',
    medicalExpenses: '',
    notes: '',
    vehicles: [''],
    advocate: '',
    referredBy: '',
    priority: 'Medium',
    documentStatus: {
      firCopy: false,
      medicalRecords: false,
      postMortemReport: false,
      vehicleDocuments: false,
      insurancePolicy: false,
      witnessStatements: false
    },
    inquestReport: false,
    mviReport: false,
    chargeSheet: false,
    documentFiles: {
      firCopy: null,
      medicalRecords: null,
      postMortemReport: null,
      vehicleDocuments: null,
      insurancePolicy: null,
      witnessStatements: null,
      inquestReport: null,
      mviReport: null,
      chargeSheet: null
    }
  });


  // Handle file upload for document types
  const handleFileChange = (docType: string, file: File | null) => {
    setFormData(prev => ({
      ...prev,
      documentFiles: {
        ...prev.documentFiles,
        [docType]: file
      }
    }));
  };


  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Client name is required';
    }

    if (!formData.accidentDate) {
      newErrors.accidentDate = 'Accident date is required';
    }

    if (!formData.accidentLocation.trim()) {
      newErrors.accidentLocation = 'Accident location is required';
    }

    if (!formData.policeStationFIR.trim()) {
      newErrors.policeStationFIR = 'Police station is required';
    }

    if (!formData.firNumber.trim()) {
      newErrors.firNumber = 'FIR number is required';
    }

    if (!formData.vehicles.some((v) => v.trim())) {
      newErrors.vehicles = 'At least one vehicle number is required';
    }

    if (!formData.claimAmount || isNaN(Number(formData.claimAmount))) {
      newErrors.claimAmount = 'Valid claim amount is required';
    }

    if (formData.medicalExpenses && isNaN(Number(formData.medicalExpenses))) {
      newErrors.medicalExpenses = 'Medical expenses must be a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      setNotification('Please fill all required fields.');
      setTimeout(() => setNotification(null), 2500);
      return;
    }
    try {
      // Convert documentFiles to plain object with only non-null files
      const files: { [key: string]: File } = {};
      Object.entries(formData.documentFiles).forEach(([key, file]) => {
        if (file) files[key] = file;
      });
      // Save case to localStorage
      const caseToAdd = {
        ...formData,
        id: Date.now().toString(),
        priority: formData.priority as 'Low' | 'Medium' | 'High',
        documentFiles: Object.fromEntries(Object.entries(formData.documentFiles).map(([k, v]) => [k, v ? v.name : null]))
      };
      const cases = JSON.parse(localStorage.getItem('cases') || '[]');
      cases.push(caseToAdd);
      localStorage.setItem('cases', JSON.stringify(cases));
      // Add notification for new case
      addNotification({
        message: `New case registered for ${formData.clientName}.`,
        type: 'success',
      });
      // If next hearing date is set, notify
      if (formData.nextHearingDate) {
        addNotification({
          message: `Next court hearing for ${formData.clientName} is on ${formData.nextHearingDate}.`,
          type: 'info',
        });
      }
      setFormData({
        clientName: '',
        status: 'Filed',
        accidentDate: '',
        accidentLocation: '',
        policeStationFIR: '',
        firNumber: '',
        caseNumber: '',
        nextHearingDate: '',
        claimAmount: '',
        insuranceCompany: '',
        injuryType: 'Simple',
        medicalExpenses: '',
        notes: '',
        vehicles: [''],
        advocate: '',
        referredBy: '',
        priority: 'Medium',
        documentStatus: {
          firCopy: false,
          medicalRecords: false,
          postMortemReport: false,
          vehicleDocuments: false,
          insurancePolicy: false,
          witnessStatements: false
        },
        inquestReport: false,
        mviReport: false,
        chargeSheet: false,
        documentFiles: {
          firCopy: null,
          medicalRecords: null,
          postMortemReport: null,
          vehicleDocuments: null,
          insurancePolicy: null,
          witnessStatements: null,
          inquestReport: null,
          mviReport: null,
          chargeSheet: null
        }
      });
      setErrors({});
      setNotification('Case Registered Successfully!');
      setTimeout(() => setNotification(null), 2500);
    } catch (err) {
      setNotification('Error: Case could not be registered.');
      setTimeout(() => setNotification(null), 2500);
    }


    setErrors({});
  };


  const handleInputChange = (field: string, value: any) => {
    if (field.startsWith('documentStatus.')) {
      const docField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        documentStatus: {
          ...prev.documentStatus,
          [docField]: value
        }
      }));
    } else if (field.startsWith('vehicles.')) {
      const idx = Number(field.split('.')[1]);
      setFormData(prev => {
        const vehicles = [...prev.vehicles];
        vehicles[idx] = value;
        return { ...prev, vehicles };
      });
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddVehicle = () => {
    setFormData(prev => ({
      ...prev,
      vehicles: [...prev.vehicles, '']
    }));
  };

  const handleRemoveVehicle = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      vehicles: prev.vehicles.filter((_, i) => i !== idx)
    }));
  };


  const handleCancel = () => {
    setFormData({
      clientName: '',
      status: 'Filed',
      accidentDate: '',
      accidentLocation: '',
      policeStationFIR: '',
      firNumber: '',
      caseNumber: '',
      nextHearingDate: '',
      claimAmount: '',
      insuranceCompany: '',
      injuryType: 'Simple',
      medicalExpenses: '',
      notes: '',
      vehicles: [''],
      advocate: '',
      referredBy: '',
      priority: 'Medium',
      documentStatus: {
        firCopy: false,
        medicalRecords: false,
        postMortemReport: false,
        vehicleDocuments: false,
        insurancePolicy: false,
        witnessStatements: false
      },
      inquestReport: false,
      mviReport: false,
      chargeSheet: false,
      documentFiles: {
        firCopy: null,
        medicalRecords: null,
        postMortemReport: null,
        vehicleDocuments: null,
        insurancePolicy: null,
        witnessStatements: null,
        inquestReport: null,
        mviReport: null,
        chargeSheet: null
      }
    });
    setErrors({});
    onPageChange('dashboard');
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Simple Notification Bar */}
      {notification && (
        <div className="fixed top-0 left-0 w-full z-50 bg-blue-600 text-white px-0 py-4 shadow-lg flex items-center justify-center" style={{borderRadius:0}}>
          <span className="font-semibold text-xl tracking-wide">{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Register New Road Accident Case</h1>
        <p className="text-gray-600 mt-2">Enter the details for the new road accident case as per Indian legal procedures.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Case Information */}
        <div className="bg-white rounded-xl border shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Basic Case Information</h2>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Client Name & Accident Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="advocate" className="block text-sm font-medium text-gray-700 mb-2">
                Advocate
              </label>
              <input
                type="text"
                id="advocate"
                value={formData.advocate}
                onChange={e => handleInputChange('advocate', e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300"
                placeholder="Advocate name"
              />
            </div>
            <div>
              <label htmlFor="referredBy" className="block text-sm font-medium text-gray-700 mb-2">
                Referred By
              </label>
              <input
                type="text"
                id="referredBy"
                value={formData.referredBy}
                onChange={e => handleInputChange('referredBy', e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300"
                placeholder="Name of person who referred"
              />
            </div>
              <div>
                <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-2">
                  Client Name *
                </label>
                <input
                  type="text"
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) => handleInputChange('clientName', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.clientName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter client's full name"
                />
                {errors.clientName && (
                  <div className="mt-2 flex items-center space-x-2 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{errors.clientName}</span>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="accidentDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Accident Date *
                </label>
                <input
                  type="date"
                  id="accidentDate"
                  value={formData.accidentDate}
                  onChange={(e) => handleInputChange('accidentDate', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.accidentDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  max={new Date().toISOString().split('T')[0]}
                />
                {errors.accidentDate && (
                  <div className="mt-2 flex items-center space-x-2 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{errors.accidentDate}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Accident Location */}
            <div>
              <label htmlFor="accidentLocation" className="block text-sm font-medium text-gray-700 mb-2">
                Accident Location *
              </label>
              <input
                type="text"
                id="accidentLocation"
                value={formData.accidentLocation}
                onChange={(e) => handleInputChange('accidentLocation', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.accidentLocation ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter complete accident location with landmarks"
              />
              {errors.accidentLocation && (
                <div className="mt-2 flex items-center space-x-2 text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{errors.accidentLocation}</span>
                </div>
              )}
            </div>

            {/* Vehicles */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle(s) *
              </label>
              {formData.vehicles.map((vehicle, idx) => (
                <div key={idx} className="flex items-center mb-2 gap-2">
                  <input
                    type="text"
                    value={vehicle}
                    onChange={e => handleInputChange(`vehicles.${idx}`, e.target.value.toUpperCase())}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.vehicles && idx === 0 ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="e.g., DL-8C-1234"
                  />
                  {formData.vehicles.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveVehicle(idx)}
                      className="px-2 py-1 text-xs text-red-600 border border-red-200 rounded hover:bg-red-50"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddVehicle}
                className="mt-2 px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm"
              >
                + Add Vehicle
              </button>
              {errors.vehicles && (
                <div className="mt-2 flex items-center space-x-2 text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{errors.vehicles}</span>
                </div>
              )}
            </div>

            {/* Injury Type */}
            <div>
              <label htmlFor="injuryType" className="block text-sm font-medium text-gray-700 mb-2">
                Injury Type
              </label>
              <select
                id="injuryType"
                value={formData.injuryType}
                onChange={(e) => handleInputChange('injuryType', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="Simple">Simple Injury</option>
                <option value="Grievous">Grievous Injury</option>
                <option value="Fatal">Fatal Accident</option>
                <option value="Property Damage Only">Property Damage Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Police & Legal Information */}
        <div className="bg-white rounded-xl border shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Police & Legal Information</h2>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Police Station & FIR Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="policeStationFIR" className="block text-sm font-medium text-gray-700 mb-2">
                  Police Station *
                </label>
                <input
                  type="text"
                  id="policeStationFIR"
                  value={formData.policeStationFIR}
                  onChange={(e) => handleInputChange('policeStationFIR', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.policeStationFIR ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Name of police station where FIR was filed"
                />
                {errors.policeStationFIR && (
                  <div className="mt-2 flex items-center space-x-2 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{errors.policeStationFIR}</span>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="firNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  FIR Number *
                </label>
                <input
                  type="text"
                  id="firNumber"
                  value={formData.firNumber}
                  onChange={(e) => handleInputChange('firNumber', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.firNumber ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="e.g., FIR No. 123/2024"
                />
                {errors.firNumber && (
                  <div className="mt-2 flex items-center space-x-2 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{errors.firNumber}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Case Number (if filed) */}
            <div>
              <label htmlFor="caseNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Case Number (if filed)
              </label>
              <input
                type="text"
                id="caseNumber"
                value={formData.caseNumber}
                onChange={(e) => handleInputChange('caseNumber', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="e.g., CWP No. 12345/2024"
              />
            </div>

            {/* Status & Next Hearing Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Case Status
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="Filed">Filed</option>
                  <option value="Under Investigation">Under Investigation</option>
                  <option value="Evidence Collection">Evidence Collection</option>
                  <option value="Court Proceedings">Court Proceedings</option>
                  <option value="Settlement">Settlement</option>
                  <option value="Judgment Passed">Judgment Passed</option>
                  <option value="Appeal Filed">Appeal Filed</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div>
                <label htmlFor="nextHearingDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Next Hearing Date
                </label>
                <input
                  type="date"
                  id="nextHearingDate"
                  value={formData.nextHearingDate}
                  onChange={(e) => handleInputChange('nextHearingDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            {/* Removed Assigned Advocate field */}
          </div>
        </div>

        {/* Financial Information */}
        <div className="bg-white rounded-xl border shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Financial Information</h2>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Claim Amount & Medical Expenses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="claimAmount" className="block text-sm font-medium text-gray-700 mb-2">
                  Claim Amount (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">₹</span>
                  <input
                    type="number"
                    id="claimAmount"
                    value={formData.claimAmount}
                    onChange={(e) => handleInputChange('claimAmount', e.target.value)}
                    className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.claimAmount ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="0"
                    min="0"
                    step="1000"
                  />
                  {errors.claimAmount && (
                    <div className="mt-2 flex items-center space-x-2 text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">{errors.claimAmount}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="medicalExpenses" className="block text-sm font-medium text-gray-700 mb-2">
                  Medical Expenses (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">₹</span>
                  <input
                    type="number"
                    id="medicalExpenses"
                    value={formData.medicalExpenses}
                    onChange={(e) => handleInputChange('medicalExpenses', e.target.value)}
                    className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.medicalExpenses ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="0"
                    min="0"
                    step="1000"
                  />
                  {errors.medicalExpenses && (
                    <div className="mt-2 flex items-center space-x-2 text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">{errors.medicalExpenses}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Insurance Company */}
            <div>
              <label htmlFor="insuranceCompany" className="block text-sm font-medium text-gray-700 mb-2">
                Insurance Company
              </label>
              <select
                id="insuranceCompany"
                value={formData.insuranceCompany}
                onChange={(e) => handleInputChange('insuranceCompany', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Select Insurance Company</option>
                <option value="New India Assurance Co. Ltd.">New India Assurance Co. Ltd.</option>
                <option value="Oriental Insurance Co. Ltd.">Oriental Insurance Co. Ltd.</option>
                <option value="National Insurance Co. Ltd.">National Insurance Co. Ltd.</option>
                <option value="United India Insurance Co. Ltd.">United India Insurance Co. Ltd.</option>
                <option value="ICICI Lombard General Insurance">ICICI Lombard General Insurance</option>
                <option value="HDFC ERGO General Insurance">HDFC ERGO General Insurance</option>
                <option value="Bajaj Allianz General Insurance">Bajaj Allianz General Insurance</option>
                <option value="TATA AIG General Insurance">TATA AIG General Insurance</option>
                <option value="Reliance General Insurance">Reliance General Insurance</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Document Status */}
        <div className="bg-white rounded-xl border shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Document Status</h2>
            <p className="text-sm text-gray-600 mt-1">Check the documents that have been collected</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[ // All document types
                { key: 'firCopy', label: 'FIR Copy', isStatus: true },
                { key: 'medicalRecords', label: 'Medical Records', isStatus: true },
                { key: 'postMortemReport', label: 'Post Mortem Report', isStatus: true },
                { key: 'vehicleDocuments', label: 'Vehicle Documents', isStatus: true },
                { key: 'insurancePolicy', label: 'Insurance Policy', isStatus: true },
                { key: 'witnessStatements', label: 'Witness Statements', isStatus: true },
                { key: 'inquestReport', label: 'Inquest Report', isStatus: false },
                { key: 'mviReport', label: 'MVI Report', isStatus: false },
                { key: 'chargeSheet', label: 'Charge Sheet', isStatus: false }
              ].map(({ key, label, isStatus }) => (
                <div key={key} className="flex flex-col">
                  <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isStatus ? formData.documentStatus[key as keyof typeof formData.documentStatus] : (formData as any)[key]}
                      onChange={e => {
                        if (isStatus) {
                          handleInputChange(`documentStatus.${key}`, e.target.checked);
                        } else {
                          handleInputChange(key, e.target.checked);
                        }
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                  </label>
                  {(isStatus ? formData.documentStatus[key as keyof typeof formData.documentStatus] : (formData as any)[key]) && (
                    <>
                      <input
                        type="file"
                        className="mt-2"
                        onChange={e => handleFileChange(key, e.target.files?.[0] || null)}
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Case Notes */}
        <div className="bg-white rounded-xl border shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Case Notes</h2>
          </div>
          
          <div className="p-6">
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              placeholder="Enter detailed case notes, circumstances of accident, injuries sustained, and any other relevant information..."
            />
            <p className="text-sm text-gray-500 mt-2">
              {formData.notes.length}/1000 characters
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:justify-end">
          <button
            type="button"
            onClick={handleCancel}
            className="flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </button>
          
          <button
            type="submit"
            className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Save className="w-4 h-4" />
            <span>Register Case</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCase;