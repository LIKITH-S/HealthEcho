import React, { useState } from 'react'
import ReportUpload from './ReportUpload'
import ReportSummary from './ReportSummary'
import Recommendations from './Recommendations'
import HealthInsightsDashboard from './HealthInsightsDashboard'

function PatientDashboard() {
    const [activeTab, setActiveTab] = useState('overview')
    const [reports, setReports] = useState([])

    return (
        <div className="space-y-6">
            {/* Tabs */}
            <div className="flex space-x-4 border-b">
                {['overview', 'upload', 'reports', 'insights'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-2 px-4 font-semibold border-b-2 transition ${activeTab === tab
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div>
                {activeTab === 'overview' && <ReportSummary />}
                {activeTab === 'upload' && <ReportUpload onUpload={(report) => setReports([...reports, report])} />}
                {activeTab === 'reports' && <ReportSummary reports={reports} />}
                {activeTab === 'insights' && <HealthInsightsDashboard />}
            </div>

            {/* Recommendations */}
            {activeTab === 'overview' && (
                <div className="mt-8">
                    <Recommendations />
                </div>
            )}
        </div>
    )
}

export default PatientDashboard
