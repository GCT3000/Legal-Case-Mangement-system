import React from 'react';
import kumaraSwamiImg from '../assets/kumara-swami.jpg';

const AdvocatePhoto: React.FC = () => (
  <div className="flex flex-col items-center">
    <img
      src={kumaraSwamiImg}
      alt="Advocate S.Kumara Swami"
      className="w-40 h-40 rounded-full object-cover border-4 border-gray-200 shadow mb-4"
    />
    <div className="text-xl font-semibold text-gray-900">Advocate S.Kumara Swami</div>
  </div>
);

export default AdvocatePhoto;
