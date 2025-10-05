import React, { useState } from 'react';
import { useCases } from '../context/CaseContext';

const filterFields = [
  { key: 'clientName', label: 'Client Name' },
  { key: 'insuranceCompany', label: 'Insurance Company', type: 'dropdown' },
  { key: 'firNumber', label: 'FIR Number' },
  { key: 'caseNumber', label: 'Case Number' },
  { key: 'status', label: 'Status' },
];

const SearchAccidentCases: React.FC = () => {
  const { cases } = useCases();
  const [filters, setFilters] = useState<any>({});
  const [viewCase, setViewCase] = useState<any | null>(null);
  const [editCase, setEditCase] = useState<any | null>(null);
  const [editData, setEditData] = useState<any>({});

  const handleChange = (key: string, value: string) => {
    setFilters((prev: any) => ({ ...prev, [key]: value }));
  };

  const filteredCases = cases.filter((c: any) => {
    return filterFields.every(({ key }) => {
      if (!filters[key]) return true;
      if (key === 'claimAmount') return c[key] == filters[key];
      return String(c[key] || '').toLowerCase().includes(filters[key].toLowerCase());
    });
  });

  // Get unique values for dropdowns
  const getOptions = (key: string) => Array.from(new Set(cases.map((c: any) => c[key]).filter(Boolean)));

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Search Accident Cases</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {filterFields.map(({ key, label, type }) => (
          <div key={key}>
            <label className="block text-gray-700 mb-1">{label}</label>
            {type === 'dropdown' && key === 'insuranceCompany' ? (
              <select
                value={filters[key] || ''}
                onChange={e => handleChange(key, e.target.value)}
                className="border px-2 py-1 rounded w-full"
              >
                <option value="">All</option>
                {getOptions(key).map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={filters[key] || ''}
                onChange={e => handleChange(key, e.target.value)}
                className="border px-2 py-1 rounded w-full"
              />
            )}
          </div>
        ))}
      </div>

      {/* View Case Details Modal */}
      {viewCase && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
              onClick={() => setViewCase(null)}
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-2 text-blue-700">Case Details</h3>
            <div className="mb-2"><strong>Client Name:</strong> {viewCase.clientName}</div>
            <div className="mb-2"><strong>Insurance Company:</strong> {viewCase.insuranceCompany}</div>
            <div className="mb-2"><strong>Accident Date:</strong> {viewCase.accidentDate}</div>
            <div className="mb-2"><strong>FIR Number:</strong> {viewCase.firNumber}</div>
            <div className="mb-2"><strong>Case Number:</strong> {viewCase.caseNumber}</div>
            <div className="mb-2"><strong>Status:</strong> {viewCase.status}</div>
          </div>
        </div>
      )}

      {/* Edit Case Modal */}
      {editCase && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
              onClick={() => { setEditCase(null); }}
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-2 text-blue-700">Edit Case</h3>
            <form onSubmit={e => { e.preventDefault(); setEditCase(null); }} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Client Name</label>
                <input value={editData.clientName || editCase.clientName} onChange={e => setEditData({ ...editData, clientName: e.target.value })} className="border px-2 py-1 rounded w-full" />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Insurance Company</label>
                <input value={editData.insuranceCompany || editCase.insuranceCompany} onChange={e => setEditData({ ...editData, insuranceCompany: e.target.value })} className="border px-2 py-1 rounded w-full" />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Accident Date</label>
                <input type="date" value={editData.accidentDate || editCase.accidentDate} onChange={e => setEditData({ ...editData, accidentDate: e.target.value })} className="border px-2 py-1 rounded w-full" />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">FIR Number</label>
                <input value={editData.firNumber || editCase.firNumber} onChange={e => setEditData({ ...editData, firNumber: e.target.value })} className="border px-2 py-1 rounded w-full" />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Case Number</label>
                <input value={editData.caseNumber || editCase.caseNumber} onChange={e => setEditData({ ...editData, caseNumber: e.target.value })} className="border px-2 py-1 rounded w-full" />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Status</label>
                <input value={editData.status || editCase.status} onChange={e => setEditData({ ...editData, status: e.target.value })} className="border px-2 py-1 rounded w-full" />
              </div>
              <div className="flex gap-4 mt-4">
                <button type="submit" className="px-6 py-2 bg-green-500 text-white rounded-xl font-semibold shadow">Save</button>
                <button type="button" className="px-6 py-2 bg-gray-500 text-white rounded-xl font-semibold shadow" onClick={() => { setEditCase(null); }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <table className="min-w-full bg-white rounded-xl shadow">
        <thead>
          <tr>
            <th className="py-2 px-4 text-left">Client Name</th>
            <th className="py-2 px-4 text-left">Insurance</th>
            <th className="py-2 px-4 text-left">FIR Number</th>
            <th className="py-2 px-4 text-left">Case Number</th>
            <th className="py-2 px-4 text-left">Status</th>
            <th className="py-2 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCases.length === 0 ? (
            <tr><td colSpan={7} className="py-4 text-gray-500 text-center">No cases found</td></tr>
          ) : (
            filteredCases.map((c: any) => (
              <tr key={c.id} className="border-b">
                <td className="py-2 px-4">{c.clientName}</td>
                <td className="py-2 px-4">{c.insuranceCompany}</td>
                <td className="py-2 px-4">{c.firNumber}</td>
                <td className="py-2 px-4">{c.caseNumber}</td>
                <td className="py-2 px-4">{c.status}</td>
                <td className="py-2 px-4 flex gap-2">
                  <button className="px-3 py-1 bg-blue-500 text-white rounded" onClick={() => setViewCase(c)}>View</button>
                  <button className="px-3 py-1 bg-green-500 text-white rounded" onClick={() => { setEditCase(c); setEditData({}); }}>Edit</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SearchAccidentCases;
