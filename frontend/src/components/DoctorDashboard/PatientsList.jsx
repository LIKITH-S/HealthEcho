// import React from 'react'

// function PatientsList({ patients, loading, onSelectPatient }) {
//     if (loading) return <div className="text-center py-8">Loading patients...</div>

//     return (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {patients.map((patient) => (
//                 <div
//                     key={patient.id}
//                     onClick={() => onSelectPatient(patient)}
//                     className="bg-white rounded-lg shadow p-4 hover:shadow-lg cursor-pointer transition"
//                 >
//                     <div className="flex justify-between items-start">
//                         <div>
//                             <h3 className="font-semibold text-lg">
//                                 {patient.first_name} {patient.last_name}
//                             </h3>
//                             <p className="text-sm text-gray-500">{patient.email}</p>
//                             <p className="text-sm text-gray-600 mt-2">📞 {patient.phone_number}</p>
//                             {patient.blood_type && (
//                                 <p className="text-sm font-medium mt-2 text-red-600">
//                                     Blood Type: {patient.blood_type}
//                                 </p>
//                             )}
//                         </div>
//                         <span className="text-2xl">👤</span>
//                     </div>
//                 </div>
//             ))}
//         </div>
//     )
// }

// export default PatientsList
import React from 'react'

function PatientsList({ patients, loading, onSelectPatient }) {
    if (loading) {
        return (
            <div className="text-center py-8">
                Loading patients...
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {patients.map((patient) => (
                <div
                    key={patient.id}
                    onClick={() => onSelectPatient(patient)}
                    className="bg-white rounded-lg shadow p-6 cursor-pointer transition hover:shadow-xl"
                >
                    <h3 className="font-semibold text-lg mb-2">{patient.first_name} {patient.last_name}</h3>
                    <p className="text-sm text-gray-500 mb-1">{patient.email}</p>
                    <p className="text-sm text-gray-600 mb-1">📞 {patient.phone_number}</p>
                    <p className="text-sm font-medium mt-1 text-red-600">Blood Type: {patient.blood_type}</p>
                </div>
            ))}
        </div>
    );
}

export default PatientsList;
