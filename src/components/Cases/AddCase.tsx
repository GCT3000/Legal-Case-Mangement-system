import React, { useState } from 'react';
import { Save, X, AlertCircle, CheckCircle } from 'lucide-react';
import { useCases } from '../../context/CaseContext';

interface AddCaseProps {
  onPageChange: (page: string) => void;
}

const AddCase: React.FC<AddCaseProps> = ({ onPageChange }) => {
  const { addCase } = useCases();
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    clientName: '',
    status: 'Filed' as const,
    priority: 'Medium' as const,
    accidentDate: '',
    accidentLocation: '',
    policeStationFIR: '',
    firNumber: '',
    courtName: '',
    caseNumber: '',
    nextHearingDate: '',
    claimAmount: '',
    insuranceCompany: '',
    vehicleNumber: '',
    oppositeParty: '',
    injuryType: 'Simple' as const,
    medicalExpenses: '',
    notes: '',
    assignedAdvocate: '',
    documentStatus: {
      firCopy: false,
      medicalRecords: false,
      postMortemReport: false,
      vehicleDocuments: false,
      insurancePolicy: false,
      witnessStatements: false
    }
  });

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

    if (!formData.vehicleNumber.trim()) {
      newErrors.vehicleNumber = 'Vehicle number is required';
    }

    if (!formData.oppositeParty.trim()) {
      newErrors.oppositeParty = 'Opposite party details are required';
    }

    if (!formData.assignedAdvocate.trim()) {
      newErrors.assignedAdvocate = 'Assigned advocate is required';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const caseData = {
      clientName: formData.clientName.trim(),
      status: formData.status,
      priority: formData.priority,
      accidentDate: formData.accidentDate,
      accidentLocation: formData.accidentLocation.trim(),
      policeStationFIR: formData.policeStationFIR.trim(),
      firNumber: formData.firNumber.trim(),
      courtName: formData.courtName.trim(),
      caseNumber: formData.caseNumber.trim() || undefined,
      nextHearingDate: formData.nextHearingDate || undefined,
      claimAmount: Number(formData.claimAmount),
      insuranceCompany: formData.insuranceCompany.trim() || undefined,
      vehicleNumber: formData.vehicleNumber.trim(),
      oppositeParty: formData.oppositeParty.trim(),
      injuryType: formData.injuryType,
      medicalExpenses: formData.medicalExpenses ? Number(formData.medicalExpenses) : undefined,
      notes: formData.notes.trim(),
      assignedAdvocate: formData.assignedAdvocate.trim(),
      documentStatus: formData.documentStatus
    };

    addCase(caseData);
    setShowSuccess(true);
    
    // Reset form
    setFormData({
      clientName: '',
      status: 'Filed',
      priority: 'Medium',
      accidentDate: '',
      accidentLocation: '',
      policeStationFIR: '',
      firNumber: '',
      courtName: '',
      caseNumber: '',
      nextHearingDate: '',
      claimAmount: '',
      insuranceCompany: '',
      vehicleNumber: '',
      oppositeParty: '',
      injuryType: 'Simple',
      medicalExpenses: '',
      notes: '',
      assignedAdvocate: '',
      documentStatus: {
        firCopy: false,
        medicalRecords: false,
        postMortemReport: false,
        vehicleDocuments: false,
        insurancePolicy: false,
        witnessStatements: false
      }
    });
    setErrors({});

    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field.startsWith('documentStatus.')) {
      const docField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        documentStatus: {
          ...prev.documentStatus,
          [docField]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCancel = () => {
    setFormData({
      clientName: '',
      status: 'Filed',
      priority: 'Medium',
      accidentDate: '',
      accidentLocation: '',
      policeStationFIR: '',
      firNumber: '',
      courtName: '',
      caseNumber: '',
      nextHearingDate: '',
      claimAmount: '',
      insuranceCompany: '',
      vehicleNumber: '',
      oppositeParty: '',
      injuryType: 'Simple',
      medicalExpenses: '',
      notes: '',
      assignedAdvocate: '',
      documentStatus: {
        firCopy: false,
        medicalRecords: false,
        postMortemReport: false,
        vehicleDocuments: false,
        insurancePolicy: false,
        witnessStatements: false
      }
    });
    setErrors({});
    onPageChange('dashboard');
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Success Message */}
      {showSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <div>
            <p className="text-green-800 font-medium">Road Accident Case Registered Successfully!</p>
            <p className="text-green-700 text-sm">The new accident case has been added to your case management system.</p>
          </div>
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

            {/* Vehicle Number & Opposite Party */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="vehicleNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Number *
                </label>
                <input
                  type="text"
                  id="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={(e) => handleInputChange('vehicleNumber', e.target.value.toUpperCase())}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.vehicleNumber ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="e.g., DL-8C-1234"
                />
                {errors.vehicleNumber && (
                  <div className="mt-2 flex items-center space-x-2 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{errors.vehicleNumber}</span>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="oppositeParty" className="block text-sm font-medium text-gray-700 mb-2">
                  Opposite Party *
                </label>
                <input
                  type="text"
                  id="oppositeParty"
                  value={formData.oppositeParty}
                  onChange={(e) => handleInputChange('oppositeParty', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.oppositeParty ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Name of opposite party or 'Unknown' for hit & run"
                />
                {errors.oppositeParty && (
                  <div className="mt-2 flex items-center space-x-2 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{errors.oppositeParty}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Injury Type & Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                  Case Priority
                </label>
                <select
                  id="priority"
                  value={formData.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
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

            {/* Court Name & Case Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="courtName" className="block text-sm font-medium text-gray-700 mb-2">
                  Court Name
                </label>
                <select
                  id="courtName"
                  value={formData.courtName}
                  onChange={(e) => handleInputChange('courtName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select Court</option>
                  <option value="Delhi High Court">Delhi High Court</option>
                  <option value="Bombay High Court">Bombay High Court</option>
                  <option value="Madras High Court">Madras High Court</option>
                  <option value="Calcutta High Court">Calcutta High Court</option>
                  <option value="Punjab & Haryana High Court, Chandigarh">Punjab & Haryana High Court, Chandigarh</option>
                  <option value="Rajasthan High Court, Jaipur">Rajasthan High Court, Jaipur</option>
                  <option value="Gujarat High Court">Gujarat High Court</option>
                  <option value="Karnataka High Court">Karnataka High Court</option>
                  <option value="Kerala High Court">Kerala High Court</option>
                  <option value="Andhra Pradesh High Court">Andhra Pradesh High Court</option>
                  <option value="Telangana High Court">Telangana High Court</option>
                  <option value="Madhya Pradesh High Court">Madhya Pradesh High Court</option>
                  <option value="Other">Other</option>
                </select>
              </div>

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

            {/* Assigned Advocate */}
            <div>
              <label htmlFor="assignedAdvocate" className="block text-sm font-medium text-gray-700 mb-2">
                Assigned Advocate *
              </label>
              <select
                id="assignedAdvocate"
                value={formData.assignedAdvocate}
                onChange={(e) => handleInputChange('assignedAdvocate', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.assignedAdvocate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              >
                <option value="">Select Advocate</option>
                <option value="Adv. Priya Sharma">Adv. Priya Sharma</option>
                <option value="Adv. Vikram Singh">Adv. Vikram Singh</option>
                <option value="Adv. Anjali Mehta">Adv. Anjali Mehta</option>
                <option value="Adv. Rohit Gupta">Adv. Rohit Gupta</option>
                <option value="Adv. Kavita Desai">Adv. Kavita Desai</option>
                <option value="Adv. Arjun Reddy">Adv. Arjun Reddy</option>
              </select>
              {errors.assignedAdvocate && (
                <div className="mt-2 flex items-center space-x-2 text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{errors.assignedAdvocate}</span>
                </div>
              )}
            </div>
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
              {Object.entries({
                firCopy: 'FIR Copy',
                medicalRecords: 'Medical Records',
                postMortemReport: 'Post Mortem Report',
                vehicleDocuments: 'Vehicle Documents',
                insurancePolicy: 'Insurance Policy',
                witnessStatements: 'Witness Statements'
              }).map(([key, label]) => (
                <label key={key} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.documentStatus[key as keyof typeof formData.documentStatus]}
                    onChange={(e) => handleInputChange(`documentStatus.${key}`, e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                </label>
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