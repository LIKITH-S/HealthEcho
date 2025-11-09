import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import axios from 'axios'

function ReportUpload({ onUpload }) {
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState(null)

    const onDrop = useCallback(async (acceptedFiles) => {
        if (acceptedFiles.length === 0) return

        setUploading(true)
        setError(null)

        const file = acceptedFiles[0]
        const formData = new FormData()
        formData.append('report', file)

        try {
            const response = await axios.post('/api/reports/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })

            onUpload(response.data)
            setUploading(false)
        } catch (err) {
            setError(err.response?.data?.error || 'Upload failed')
            setUploading(false)
        }
    }, [onUpload])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    return (
        <div
            {...getRootProps()}
            className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition ${isDragActive
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-300 hover:border-indigo-600'
                }`}
        >
            <input {...getInputProps()} />
            <div className="text-4xl mb-2">📄</div>
            <p className="font-semibold text-gray-700">
                {isDragActive ? 'Drop your report here' : 'Drag & drop your medical report'}
            </p>
            <p className="text-sm text-gray-500">or click to select from your computer</p>
            <p className="text-xs text-gray-400 mt-2">Supported: PDF, JPEG, PNG, TXT (Max 10MB)</p>

            {error && <p className="text-red-600 mt-4">{error}</p>}
            {uploading && <p className="text-blue-600 mt-4">Uploading...</p>}
        </div>
    )
}

export default ReportUpload
