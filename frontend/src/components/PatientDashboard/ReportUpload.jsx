import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

const styles = {
    container: {
        maxWidth: 600,
        margin: "0 auto",
        backgroundColor: "#fff",
        padding: 24,
        borderRadius: 10,
        boxShadow: "0 0 10px #eee",
        display: "flex",
        flexDirection: "column",
        minHeight: 400,
    },
    header: {
        color: "#1e88e5",
        fontWeight: 600,
        fontSize: 24,
        marginBottom: 24,
    },
    dropzone: {
        flex: 1,
        border: "2px dashed #ccc",
        borderRadius: 10,
        padding: 40,
        textAlign: "center",
        cursor: "pointer",
        color: "#666",
        marginBottom: 16,
    },
    dropzoneActive: {
        borderColor: "#1e88e5",
        color: "#1e88e5",
    },
    uploadButton: {
        backgroundColor: "#1e88e5",
        color: "white",
        border: "none",
        padding: "10px 24px",
        borderRadius: 6,
        cursor: "pointer",
        fontWeight: 600,
        fontSize: 16,
    },
    uploadButtonDisabled: {
        opacity: 0.6,
        cursor: "not-allowed",
    },
    message: {
        marginTop: 12,
        fontSize: 14,
    },
    error: {
        color: "#c62828",
    },
    success: {
        color: "#2e7d32",
    },
};

function ReportUpload({ onUpload }) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const onDrop = useCallback(
        async (acceptedFiles) => {
            if (acceptedFiles.length === 0) return;

            const file = acceptedFiles[0];
            const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

            if (!allowedTypes.includes(file.type)) {
                setError("Only image files (jpeg, png, gif, webp) are allowed.");
                return;
            }

            setUploading(true);
            setError(null);
            setSuccess(false);

            const formData = new FormData();
            formData.append("report", file);

            try {
                const response = await axios.post("/api/reports/upload", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                const uploadedReport = response.data;
                setSuccess(true);
                setUploading(false);
                if (onUpload) onUpload(uploadedReport);
            } catch (err) {
                setError(err.response?.data?.error || "Upload failed");
                setUploading(false);
            }
        },
        [onUpload]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/jpeg": [".jpg", ".jpeg"],
            "image/png": [".png"],
            "image/gif": [".gif"],
            "image/webp": [".webp"],
        },
        maxSize: 10485760, // 10 MB
        multiple: false,
        disabled: uploading,
    });

    return (
        <div style={styles.container}>
            <h2 style={styles.header}>Upload Medical Report</h2>
            <div
                {...getRootProps()}
                style={{
                    ...styles.dropzone,
                    ...(isDragActive ? styles.dropzoneActive : {}),
                    ...(uploading && { cursor: "progress" }),
                }}
            >
                <input {...getInputProps()} />
                <p>{isDragActive ? "Drop your report here" : "Drag & drop your medical report here"}</p>
            </div>

            {uploading && <p style={{ ...styles.message }}>Uploading and processing...</p>}
            {error && <p style={{ ...styles.message, ...styles.error }}>⚠️ {error}</p>}
            {success && <p style={{ ...styles.message, ...styles.success }}>✓ Report uploaded successfully!</p>}

            <button
                disabled={uploading}
                style={{
                    ...styles.uploadButton,
                    ...(uploading ? styles.uploadButtonDisabled : {}),
                }}
                onClick={() => document.querySelector("input[type=file]").click()}
            >
                {uploading ? "Uploading..." : "Click to Upload"}
            </button>
        </div>
    );
}

export default ReportUpload;
