import React, { useState, useMemo } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './ModernCalendar.css';
import { Case } from '../types/Case';

// Custom event dot
const EventDot = () => (
  <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-1"></span>
);

const ModernCalendar: React.FC = () => {
  const [cases, setCases] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedCases, setSelectedCases] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalCase, setModalCase] = useState<any | null>(null);

  React.useEffect(() => {
    const storedCases = JSON.parse(localStorage.getItem('cases') || '[]');
    setCases(storedCases);
  }, []);

  // Map cases to calendar events
  const events: { date: Date; case: Case }[] = useMemo(() => {
    const arr: { date: Date; case: Case }[] = [];
    cases.forEach((c) => {
      if (c.accidentDate) arr.push({ date: new Date(c.accidentDate), case: c });
      if (c.nextHearingDate) arr.push({ date: new Date(c.nextHearingDate), case: c });
      if (c.dateCreated) arr.push({ date: new Date(c.dateCreated), case: c });
    });
    return arr;
  }, [cases]);

  // Get cases for a specific date
  const getCasesForDate = (date: Date) => {
    return events.filter(ev => ev.date.toDateString() === date.toDateString()).map(ev => ev.case);
  };

  // Custom tile content with event dots
  const tileContent = ({ date }: { date: Date }) => {
    const dayCases = getCasesForDate(date);
    if (dayCases.length === 0) return null;
    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {dayCases.map((c) => (
          <EventDot key={c.id} />
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
    <div className={`flex items-start justify-center transition-all duration-500 ${showModal ? 'ml-64' : ''}`}> {/* Slide right when modal open */}
      <div className="bg-white rounded-3xl shadow-2xl border-2 border-black flex flex-col justify-center items-center p-12" style={{ minHeight: '600px', minWidth: '600px' }}>
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Case Calendar</h2>
        <Calendar
          onClickDay={handleDayClick}
          tileContent={tileContent}
          value={selectedDate || undefined}
          className="modern-calendar border-none shadow-none rounded-2xl"
          calendarType={undefined}
        />
        {selectedDate && (
          <div className="mt-8 w-full">
            <h2 className="text-xl font-semibold mb-2 text-blue-700">
              Events on {selectedDate.toLocaleDateString()}
            </h2>
            {selectedCases.length === 0 ? (
              <p className="text-gray-500">No cases scheduled for this date.</p>
            ) : (
              <ul className="space-y-2">
                {selectedCases.map(c => (
                  <li key={c.id} className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <span className="font-bold text-blue-800">{c.clientName}</span>
                      <span className="ml-2 text-gray-700">Vehicle: {c.vehicleNumber}</span>
                    </div>
                    <div className="mt-2 md:mt-0 text-sm text-gray-600">
                      Accident: {c.accidentDate} | Next Hearing: {c.nextHearingDate || 'N/A'}
                    </div>
                    <button
                      className="ml-4 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                      onClick={() => { setModalCase(c); setShowModal(true); }}
                    >
                      Details
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
      {showModal && modalCase && (
        <div className="fixed top-0 left-0 h-full w-2/5 bg-white rounded-r-3xl shadow-2xl border-2 border-black z-50 p-10 flex flex-col transition-all duration-500" style={{ minWidth: '400px' }}>
          <button
            className="absolute top-6 right-8 text-3xl text-gray-500 hover:text-gray-700 font-bold"
            onClick={() => setShowModal(false)}
          >
            &times;
          </button>
          <h3 className="text-2xl font-bold mb-6 text-blue-700">Case Details</h3>
          <div className="mb-4"><strong>Case ID:</strong> {modalCase.id}</div>
          <div className="mb-4"><strong>Client Name:</strong> {modalCase.clientName}</div>
          <div className="mb-4"><strong>Vehicle:</strong> {modalCase.vehicleNumber}</div>
          <div className="mb-4"><strong>Accident Date:</strong> {modalCase.accidentDate}</div>
          <div className="mb-4"><strong>FIR Number:</strong> {modalCase.firNumber}</div>
          <div className="mb-4"><strong>Next Hearing:</strong> {modalCase.nextHearingDate || 'N/A'}</div>
        </div>
      )}
    </div>
  );
};

export default ModernCalendar;
