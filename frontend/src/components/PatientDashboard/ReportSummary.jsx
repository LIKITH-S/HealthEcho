import React, { useEffect, useState } from 'react'
import axios from 'axios'

function ReportSummary({ reports }) {
    const [allReports, setAllReports] = useState(reports || [])
    const [loading, setLoading] = useState(!reports)

    useEffect(() => {
        if (!reports) {
            fetchReports()
        }
    }, [reports])

    const fetchReports = async () => {
        try {
            const response = await axios.get('/api/reports')
            setAllReports(response.data.reports)
            setLoading(false)
        } catch (error) {
            console.error('Failed to fetch reports:', error)
            setLoading(false)
        }
    }

    if (loading) return <div className="text-center py-8">Loading reports...</div>

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Your Medical Reports</h2>

            {allReports.length === 0 ? (
                <p className="text-gray-500">No reports uploaded yet</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left font-semibold">File Name</th>
                                <th className="px-4 py-2 text-left font-semibold">Upload Date</th>
                                <th className="px-4 py-2 text-left font-semibold">Status</th>
                                <th className="px-4 py-2 text-left font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allReports.map((report) => (
                                <tr key={report.id} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-3">{report.file_name}</td>
                                    <td className="px-4 py-3">{new Date(report.upload_date).toLocaleDateString()}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-3 py-1 rounded text-sm font-semibold ${report.status === 'completed' ? 'bg-green-100 text-green-800' :
                                            report.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                            {report.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button className="text-indigo-600 hover:underline">View</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default ReportSummary
