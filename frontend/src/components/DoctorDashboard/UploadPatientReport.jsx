import React, { useState } from "react";
import axios from "axios";

function UploadPatientReport({ patient }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage({ type: "error", text: "Please select a file first." });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("patient_id", patient.id);

    try {
      setUploading(true);
      setMessage(null);

      const response = await axios.post(
        "/api/reports/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage({
        type: "success",
        text: "Report uploaded successfully!",
      });

      setFile(null);
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text:
          error.response?.data?.error ||
          "Failed to upload report. Try again.",
      });
    }

    setUploading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">📄 Upload Patient Report</h2>

      <p className="mb-2 text-gray-700">
        Patient:{" "}
        <strong>
          {patient.first_name} {patient.last_name}
        </strong>
      </p>

      {message && (
        <div
          className={`mb-4 p-3 rounded ${message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
            }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleFileUpload} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Report File (PDF / Image)
          </label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload Report"}
        </button>
      </form>
    </div>
  );
}

export default UploadPatientReport;
