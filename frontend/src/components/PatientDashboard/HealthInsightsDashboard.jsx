import React, { useEffect, useState } from 'react'
import { Line, Bar } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'
import axios from 'axios'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

function HealthInsightsDashboard() {
    const [metrics, setMetrics] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchMetrics()
    }, [])

    const fetchMetrics = async () => {
        try {
            // Mock data - replace with actual API call
            const mockData = [
                { date: '2025-11-01', bp: 120, pulse: 72, glucose: 95 },
                { date: '2025-11-02', bp: 118, pulse: 70, glucose: 98 },
                { date: '2025-11-03', bp: 122, pulse: 75, glucose: 105 },
                { date: '2025-11-04', bp: 119, pulse: 71, glucose: 102 },
                { date: '2025-11-05', bp: 121, pulse: 73, glucose: 100 }
            ]
            setMetrics(mockData)
            setLoading(false)
        } catch (error) {
            console.error('Failed to fetch metrics:', error)
            setLoading(false)
        }
    }

    if (loading) return <div>Loading...</div>

    const bpData = {
        labels: metrics.map(m => m.date),
        datasets: [{
            label: 'Blood Pressure (Systolic)',
            data: metrics.map(m => m.bp),
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)'
        }]
    }

    const pulseData = {
        labels: metrics.map(m => m.date),
        datasets: [{
            label: 'Heart Rate (bpm)',
            data: metrics.map(m => m.pulse),
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)'
        }]
    }

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-6">Health Metrics Dashboard</h2>

                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-red-50 p-4 rounded-lg">
                        <p className="text-gray-600 text-sm">Blood Pressure</p>
                        <p className="text-2xl font-bold text-red-600">120/80</p>
                        <p className="text-xs text-gray-500 mt-1">Normal</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-gray-600 text-sm">Heart Rate</p>
                        <p className="text-2xl font-bold text-blue-600">72 bpm</p>
                        <p className="text-xs text-gray-500 mt-1">Healthy</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-gray-600 text-sm">Blood Sugar</p>
                        <p className="text-2xl font-bold text-green-600">95 mg/dL</p>
                        <p className="text-xs text-gray-500 mt-1">Normal</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="border rounded-lg p-4">
                        <Line data={bpData} options={{ responsive: true }} />
                    </div>
                    <div className="border rounded-lg p-4">
                        <Line data={pulseData} options={{ responsive: true }} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HealthInsightsDashboard
