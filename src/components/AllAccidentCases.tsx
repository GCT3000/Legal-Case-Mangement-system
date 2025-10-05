
import React, { useState, useEffect } from 'react';
import { useNotification } from '../context/NotificationContext';

const AllAccidentCases: React.FC = () => {
  const { addNotification } = useNotification();
  const [cases, setCases] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCase, setSelectedCase] = useState<any | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<any>({});
  // Add Advocate and Referred By to editData if not present
  useEffect(() => {
    if (editMode && selectedCase) {
      setEditData((prev: any) => ({
        ...prev,
        advocate: selectedCase.advocate || "",
        referredBy: selectedCase.referredBy || ""
      }));
    }
  }, [editMode, selectedCase]);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const storedCases = JSON.parse(localStorage.getItem('cases') || '[]');
    setCases(storedCases);
  }, []);

  const handleEdit = (caseData: any) => {
    setEditMode(true);
    setEditData({ ...caseData });
  };


  const handleSave = async () => {
    // Update case in localStorage
    const updatedCases = cases.map(c => c.id === selectedCase.id ? { ...c, ...editData } : c);
    localStorage.setItem('cases', JSON.stringify(updatedCases));
    setCases(updatedCases);
    setSelectedCase((prev: any) => ({ ...prev, ...editData }));
    setEditMode(false);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2500);
    // Add notification for update
    addNotification({
      message: `Case for ${editData.clientName} updated successfully.`,
      type: 'success',
    });
    // If next hearing date is updated, notify
    if (editData.nextHearingDate) {
      addNotification({
        message: `Next court hearing for ${editData.clientName} is on ${editData.nextHearingDate}.`,
        type: 'info',
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">All Accident Cases</h2>
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by any feature (name, status, location, date, claim, etc)"
          className="border border-black rounded-lg px-4 py-2 w-full text-black"
        />
      </div>

  {selectedCase ? (
  <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6 border-2 border-black text-black relative">
          <button className="mb-6 text-blue-400 underline font-semibold" onClick={() => { setSelectedCase(null); setEditMode(false); }}>&larr; Back to all cases</button>
          {showNotification && (
            <div className="absolute top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50 flex items-center gap-2">
              <span>✔️</span>
              <span>The Case is saved</span>
            </div>
          )}
          {editMode ? (
            <div className="bg-white rounded-2xl border border-black p-6 text-black">
              {/* Replica of AddCase form for editing */}
              <form onSubmit={e => { e.preventDefault(); handleSave(); }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 mb-1">Advocate</label>
                    <input value={editData.advocate || ""} onChange={e => setEditData({ ...editData, advocate: e.target.value })} className="border px-2 py-1 rounded w-full text-black" required />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Referred By</label>
                    <input value={editData.referredBy || ""} onChange={e => setEditData({ ...editData, referredBy: e.target.value })} className="border px-2 py-1 rounded w-full text-black" required />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Client Name</label>
                    <input value={editData.clientName} onChange={e => setEditData({ ...editData, clientName: e.target.value })} className="border px-2 py-1 rounded w-full text-black" required />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Status</label>
                    <input value={editData.status} onChange={e => setEditData({ ...editData, status: e.target.value })} className="border px-2 py-1 rounded w-full text-black" required />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Location</label>
                    <input value={editData.accidentLocation} onChange={e => setEditData({ ...editData, accidentLocation: e.target.value })} className="border px-2 py-1 rounded w-full text-black" required />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Date Created</label>
                    <input value={editData.dateCreated} onChange={e => setEditData({ ...editData, dateCreated: e.target.value })} className="border px-2 py-1 rounded w-full text-black" required />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Next Hearing</label>
                    <input value={editData.nextHearingDate || ''} onChange={e => setEditData({ ...editData, nextHearingDate: e.target.value })} className="border px-2 py-1 rounded w-full text-black" />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Claim Amount</label>
                    <input value={editData.claimAmount} onChange={e => setEditData({ ...editData, claimAmount: e.target.value })} className="border px-2 py-1 rounded w-full text-black" required />
                  </div>
                </div>
                <div className="flex gap-4 mt-6">
                  <button type="submit" className="px-6 py-2 bg-green-500 text-white rounded-xl font-semibold shadow">Save</button>
                  <button type="button" className="px-6 py-2 bg-gray-500 text-white rounded-xl font-semibold shadow" onClick={() => setEditMode(false)}>Cancel</button>
                </div>
              </form>
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-black mb-4">Case Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl border border-black shadow p-6 flex flex-col items-center">
                      <span className="text-gray-700 text-sm mb-2">Client Name</span>
                      <span className="text-xl font-semibold text-black">{selectedCase.clientName}</span>
                    </div>
                    <div className="bg-white rounded-xl border border-black shadow p-6 flex flex-col items-center">
                      <span className="text-gray-700 text-sm mb-2">Status</span>
                      <span className="text-xl font-semibold text-black">{selectedCase.status}</span>
                    </div>
                    <div className="bg-white rounded-xl border border-black shadow p-6 flex flex-col items-center">
                      <span className="text-gray-700 text-sm mb-2">Location</span>
                      <span className="text-xl font-semibold text-black">{selectedCase.accidentLocation}</span>
                    </div>
                    <div className="bg-white rounded-xl border border-black shadow p-6 flex flex-col items-center">
                      <span className="text-gray-700 text-sm mb-2">Date Created</span>
                      <span className="text-xl font-semibold text-black">{selectedCase.dateCreated}</span>
                    </div>
                    <div className="bg-white rounded-xl border border-black shadow p-6 flex flex-col items-center">
                      <span className="text-gray-700 text-sm mb-2">Next Hearing</span>
                      <span className="text-xl font-semibold text-black">{selectedCase.nextHearingDate}</span>
                    </div>
                    <div className="bg-white rounded-xl border border-black shadow p-6 flex flex-col items-center">
                      <span className="text-gray-700 text-sm mb-2">Claim Amount</span>
                      <span className="text-xl font-semibold text-black">₹{selectedCase.claimAmount}</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-semibold mb-4 text-blue-200">Documents</h4>
                  <ul className="space-y-3">
                    {selectedCase.documentStatus && Object.entries(selectedCase.documentStatus).map(([key, url]: any) => {
                      const capitalizedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str: string) => str.toUpperCase()).replace(/\s+/, ' ');
                      return (
                        <li key={key} className="flex items-center gap-2 bg-white border border-black rounded-lg shadow px-4 py-2">
                          <span className="font-medium text-black">{capitalizedKey}</span>
                          <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">View</a>
                          <a href={url} download className="ml-2 text-green-700 underline">Download</a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
              <div className="mt-8 flex gap-4">
                <button className="px-6 py-2 bg-blue-500 text-white rounded-xl font-semibold shadow" onClick={() => handleEdit(selectedCase)}>Edit</button>
              </div>
            </>
          )}
        </div>
      ) : (
        cases.length === 0 ? (
          <p className="text-gray-600">No accident cases registered yet.</p>
        ) : (
          (() => {
            // Filter cases by search
            const searchLower = search.trim().toLowerCase();
            let filtered = cases;
            if (searchLower) {
              filtered = cases.filter(c => {
                return [
                  c.clientName,
                  c.status,
                  c.accidentLocation,
                  c.dateCreated,
                  c.nextHearingDate,
                  c.claimAmount,
                  c.courtName,
                  c.advocate,
                  c.referredBy,
                  ...(c.documentStatus ? Object.keys(c.documentStatus) : [])
                ].some(val => val && String(val).toLowerCase().includes(searchLower));
              });
            }
            return (
              <table className="min-w-full bg-white rounded-xl shadow">
                <thead>
                  <tr>
                    <th className="py-2 px-4 text-left">Client Name</th>
                    <th className="py-2 px-4 text-left">Status</th>
                    <th className="py-2 px-4 text-left">Location</th>
                    <th className="py-2 px-4 text-left">Date Created</th>
                    <th className="py-2 px-4 text-left">Advocate</th>
                    <th className="py-2 px-4 text-left">Referred By</th>
                    <th className="py-2 px-4 text-left">Claim Amount</th>
                    <th className="py-2 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.id} className="border-b">
                      <td className="py-2 px-4">{c.clientName}</td>
                      <td className="py-2 px-4">{c.status}</td>
                      <td className="py-2 px-4">{c.accidentLocation}</td>
                      <td className="py-2 px-4">{c.dateCreated}</td>
                      <td className="py-2 px-4">{c.advocate}</td>
                      <td className="py-2 px-4">{c.referredBy}</td>
                      <td className="py-2 px-4">₹{c.claimAmount}</td>
                      <td className="py-2 px-4 flex gap-2">
                        <button className="px-3 py-1 bg-blue-500 text-white rounded" onClick={() => setSelectedCase(c)}>View</button>
                        <button className="px-3 py-1 bg-green-500 text-white rounded" onClick={() => {
                          const updated = cases.map(caseItem => caseItem.id === c.id ? { ...caseItem, status: 'Done' } : caseItem);
                          localStorage.setItem('cases', JSON.stringify(updated));
                          setCases(updated);
                        }}>Mark as Done</button>
                        <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={() => {
                          const updated = cases.filter(caseItem => caseItem.id !== c.id);
                          localStorage.setItem('cases', JSON.stringify(updated));
                          setCases(updated);
                        }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            );
          })()
        )
      )}
    </div>
  );
};

export default AllAccidentCases;
