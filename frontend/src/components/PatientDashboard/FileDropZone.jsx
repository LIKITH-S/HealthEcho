import React, { useState, useRef } from 'react'

function FileDropZone({ onFilesSelected, maxSize = 5 }) {
  const [dragActive, setDragActive] = useState(false)
  const [files, setFiles] = useState([])
  const [error, setError] = useState(null)
  const inputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    setError(null)

    const droppedFiles = [...e.dataTransfer.files]
    processFiles(droppedFiles)
  }

  const handleChange = (e) => {
    setError(null)
    const selectedFiles = [...e.target.files]
    processFiles(selectedFiles)
  }

  const processFiles = (selectedFiles) => {
    const validFiles = []
    const maxSizeBytes = maxSize * 1024 * 1024

    selectedFiles.forEach((file) => {
      if (file.size > maxSizeBytes) {
        setError(`File ${file.name} exceeds ${maxSize}MB limit`)
      } else {
        validFiles.push(file)
      }
    })

    if (validFiles.length > 0) {
      setFiles(validFiles)
      onFilesSelected(validFiles)
    }
  }

  const removeFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index)
    setFiles(updatedFiles)
    onFilesSelected(updatedFiles)
  }

  return (
    <div className="w-full">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${dragActive
            ? 'border-indigo-600 bg-indigo-50'
            : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
          }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          onChange={handleChange}
          className="hidden"
          accept=".pdf,.doc,.docx,.jpg,.png"
        />
        <div
          onClick={() => inputRef.current?.click()}
          className="cursor-pointer"
        >
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20m-10-10v10m0 0l-3-3m3 3l3-3"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="mt-2 text-sm font-medium text-gray-700">
            Drag files here or click to browse
          </p>
          <p className="text-xs text-gray-500">
            PDF, DOC, DOCX, JPG, PNG up to {maxSize}MB
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-2 p-2 bg-red-100 text-red-700 text-sm rounded">
          {error}
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Files:</h4>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-gray-100 p-2 rounded text-sm"
              >
                <span className="text-gray-700">{file.name}</span>
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-600 hover:text-red-800 font-semibold"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default FileDropZone