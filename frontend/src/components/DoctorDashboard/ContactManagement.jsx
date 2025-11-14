import React, { useState } from 'react';
import { saveContact } from '../../services/doctorService';

export default function ContactManagement({ patient }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [msg, setMsg] = useState(null);

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      await saveContact({
        patient_id: patient.id,
        name,
        phone
      });

      setMsg({ type: 'success', text: 'Contact saved!' });
      setName('');
      setPhone('');
    } catch (err) {
      setMsg({
        type: 'error',
        text: err.response?.data?.error || 'Save failed'
      });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-3">Patient Contacts</h2>

      <form onSubmit={handleSave} className="space-y-3">
        <input
          type="text"
          className="w-full p-2 border"
          placeholder="Contact Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          className="w-full p-2 border"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button className="bg-indigo-600 text-white px-4 py-2 rounded">Add Contact</button>
      </form>

      {msg && (
        <p className={msg.type === 'success' ? 'text-green-600' : 'text-red-600'}>
          {msg.text}
        </p>
      )}
    </div>
  );
}
