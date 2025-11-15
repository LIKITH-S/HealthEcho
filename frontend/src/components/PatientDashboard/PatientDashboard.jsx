import React, { useState, useEffect } from "react";
import ReportUpload from "./ReportUpload";
import ReportSummary from "./ReportSummary";

const styles = {
    patientDashboard: {
        maxWidth: 1400,
        margin: "0 auto",
        padding: 24,
        fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    },
    tabs: {
        display: "flex",
        gap: 8,
        borderBottom: "2px solid #ddd",
    },
    tabButton: {
        background: "none",
        border: "none",
        padding: "12px 16px",
        cursor: "pointer",
        fontWeight: 600,
        color: "#555",
        borderBottomWidth: 3,
        borderBottomStyle: "solid",
        borderBottomColor: "transparent",
        transition: "all 0.3s ease",
    },
    tabButtonActive: {
        color: "#1e88e5",
        borderBottomColor: "#1e88e5",
    },
    tabContent: {
        marginTop: 32,
    },
};

function PatientDashboard({ initialTab = "overview", onTabChange }) {
    const [activeTab, setActiveTab] = useState(initialTab);
    const [reports, setReports] = useState([]);
    const [latestReport, setLatestReport] = useState(null);

    useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab]);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        if (onTabChange) onTabChange(tab);
    };

    const handleReportUpload = (uploadedReport) => {
        if (!uploadedReport) return;
        setReports([...reports, uploadedReport]);
        setLatestReport(uploadedReport);
        setActiveTab("summary");
    };

    return (
        <div style={styles.patientDashboard}>
            <div style={styles.tabs}>
                {["overview", "upload", "summary", "insights"].map((tab) => (
                    <button
                        key={tab}
                        style={{
                            ...styles.tabButton,
                            ...(activeTab === tab ? styles.tabButtonActive : {}),
                        }}
                        onClick={() => handleTabClick(tab)}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/_/g, " ")}
                    </button>
                ))}
            </div>
            <div style={styles.tabContent}>
                {activeTab === "upload" && <ReportUpload onUpload={handleReportUpload} />}
                {activeTab === "summary" && (
                    <ReportSummary reports={reports} latestReport={latestReport} />
                )}
                {activeTab === "overview" && <div>Overview content here</div>}
                {activeTab === "insights" && <div>Health insights content here</div>}
            </div>
        </div>
    );
}

export default PatientDashboard;
