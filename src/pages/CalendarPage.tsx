
import React, { useState, useMemo } from 'react';
import Calendar from 'react-calendar';

import 'react-calendar/dist/Calendar.css';
import { useCases } from '../context/CaseContext';
import { Case } from '../types/Case';

interface CalendarEvent {
  caseId: string;
  date: Date;
  vehicleNumbers: string[];
  documentStatus: {
    inquestReport: boolean;
    mviReport: boolean;
    chargeSheet: boolean;
  };
  case: Case;
}

const getEventDates = (caseItem: Case): { label: string; date: Date }[] => {
  const dates: { label: string; date: Date }[] = [];
  if (caseItem.accidentDate) dates.push({ label: 'Accident', date: new Date(caseItem.accidentDate) });
  if (caseItem.firNumber && caseItem.accidentDate) dates.push({ label: 'FIR', date: new Date(caseItem.accidentDate) }); // Adjust if FIR date is separate
  if (caseItem.nextHearingDate) dates.push({ label: 'Court', date: new Date(caseItem.nextHearingDate) });
  if (caseItem.dateCreated) dates.push({ label: 'Filed', date: new Date(caseItem.dateCreated) });
  return dates;
};

const CalendarPage: React.FC = () => {
  const { cases } = useCases();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedCases, setSelectedCases] = useState<Case[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalCase, setModalCase] = useState<Case | null>(null);

  // Map cases to calendar events
  const events: CalendarEvent[] = useMemo(() => {
    const arr: CalendarEvent[] = [];
    cases.forEach((c) => {
      getEventDates(c).forEach(({ date }) => {
        arr.push({
          caseId: c.id,
          date,
          vehicleNumbers: c.vehicleNumber ? [c.vehicleNumber] : [],
          documentStatus: {
            inquestReport: c.documentStatus.firCopy || false,
            mviReport: c.documentStatus.vehicleDocuments || false,
            chargeSheet: c.documentStatus.witnessStatements || false,
          },
          case: c,
        });
      });
    });
    return arr;
  }, [cases]);

  // Get cases for a specific date
  const getCasesForDate = (date: Date) => {
    return events.filter(ev => ev.date.toDateString() === date.toDateString()).map(ev => ev.case);
  };

  // Custom tile content
  const tileContent = ({ date }: { date: Date }) => {
    const dayCases = getCasesForDate(date);
    if (dayCases.length === 0) return null;
    return (
      <div>
        {dayCases.map((c) => (
          <div
            key={c.id}
            className="bg-blue-100 text-blue-800 rounded px-1 py-0.5 mb-1 cursor-pointer text-xs"
            title={`Case ID: ${c.id}\nVehicle: ${c.vehicleNumber}\nInquest: ${c.documentStatus.firCopy ? 'Yes' : 'No'}\nMVI: ${c.documentStatus.vehicleDocuments ? 'Yes' : 'No'}\nCharge Sheet: ${c.documentStatus.witnessStatements ? 'Yes' : 'No'}`}
            onClick={e => {
              e.stopPropagation();
              setModalCase(c);
              setShowModal(true);
            }}
          >
            {c.id}
          </div>
        ))}
      </div>
    );
  };

  // Handle day click
  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedCases(getCasesForDate(date));
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Case Calendar</h1>
      <Calendar
        onClickDay={handleDayClick}
        tileContent={tileContent}
        value={selectedDate}
      />
      {selectedDate && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">
            Cases on {selectedDate.toLocaleDateString()}
          </h2>
          {selectedCases.length === 0 ? (
            <p className="text-gray-500">No cases scheduled for this date.</p>
          ) : (
            <ul>
              {selectedCases.map(c => (
                <li key={c.id} className="mb-2">
                  <button
                    className="text-blue-700 underline"
                    onClick={() => { setModalCase(c); setShowModal(true); }}
                  >
                    Case ID: {c.id}
                  </button>
                  <span className="ml-2 text-gray-700">Vehicle: {c.vehicleNumber}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {showModal && modalCase && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-2">Case Details</h3>
            <div className="mb-2"><strong>Case ID:</strong> {modalCase.id}</div>
            <div className="mb-2"><strong>Vehicle:</strong> {modalCase.vehicleNumber}</div>
            <div className="mb-2"><strong>Accident Date:</strong> {modalCase.accidentDate}</div>
            <div className="mb-2"><strong>FIR Number:</strong> {modalCase.firNumber}</div>
            <div className="mb-2"><strong>Next Hearing:</strong> {modalCase.nextHearingDate || 'N/A'}</div>
            <div className="mb-2"><strong>Document Status:</strong>
              <ul className="ml-4 list-disc">
                <li>Inquest Report: {modalCase.documentStatus.firCopy ? 'Yes' : 'No'}</li>
                <li>MVI Report: {modalCase.documentStatus.vehicleDocuments ? 'Yes' : 'No'}</li>
                <li>Charge Sheet: {modalCase.documentStatus.witnessStatements ? 'Yes' : 'No'}</li>
              </ul>
            </div>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
