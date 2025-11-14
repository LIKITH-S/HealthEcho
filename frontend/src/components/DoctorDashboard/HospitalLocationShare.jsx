import React, { useState } from 'react';
import { shareHospitalLocation } from '../../services/doctorService';

export default function HospitalLocationShare({ patient }) {
  const [location, setLocation] = useState('');
  const [msg, setMsg] = useState(null);

  const handleShare = async (e) => {
    e.preventDefault();

    try {
      await shareHospitalLocation({
        patient_id: patient.id,
        location
      });

      setMsg({ type: 'success', text: 'Location shared!' });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Share failed' });
    }
  };

  return (
    <div>
      <h2 className="text-xl mb-3 font-bold">Share Hospital Location</h2>

      <form onSubmit={handleShare} className="space-y-3">
        <textarea
          className="border p-2 w-full"
          placeholder="Enter hospital address or Google Maps link"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <button className="px-4 py-2 bg-indigo-600 text-white rounded">
          Share
        </button>
      </form>

      {msg && (
        <p className={msg.type === 'success' ? 'text-green-600' : 'text-red-600'}>
          {msg.text}
        </p>
      )}
    </div>
  );
}
