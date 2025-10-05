import React, { useState } from 'react';
import ModernCalendar from './ModernCalendar';

const CalendarScaler: React.FC = () => {
  const [scale, setScale] = useState(1.35);

  return (
    <div className="max-w-5xl mx-auto py-12 flex flex-col items-center">
      <div className="w-full flex justify-center mb-8">
        <label className="font-semibold text-gray-700 mr-4" htmlFor="calendar-scale">Scale:</label>
        <input
          id="calendar-scale"
          type="range"
          min={0.7}
          max={2}
          step={0.01}
          value={scale}
          onChange={e => setScale(Number(e.target.value))}
          className="w-64 accent-blue-600"
        />
        <span className="ml-4 text-blue-700 font-bold">{Math.round(scale * 100)}%</span>
      </div>
      <div className="flex justify-center items-center w-full">
        <div style={{ transform: `scale(${scale})`, transformOrigin: 'top center', minWidth: 500 }}>
          <ModernCalendar />
        </div>
      </div>
    </div>
  );
};

export default CalendarScaler;
