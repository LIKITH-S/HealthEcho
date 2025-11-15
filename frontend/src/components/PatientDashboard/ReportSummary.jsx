import React, { useEffect, useState } from "react";
import axios from "axios";

const styles = {
    container: {
        maxWidth: 900,
        margin: "0 auto",
        fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    },
    reportCard: {
        backgroundColor: "white",
        boxShadow: "0 0 6px #ddd",
        padding: 24,
        borderRadius: 10,
    },
    reportHeader: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    statusBadge: {
        backgroundColor: "#1e88e5",
        color: "white",
        padding: "4px 12px",
        borderRadius: 20,
        fontWeight: 600,
        fontSize: 12,
    },
    section: {
        marginBottom: 16,
    },
    list: {
        paddingLeft: 16,
    },
    reportList: {
        listStyle: "none",
        paddingLeft: 0,
    },
    reportListItem: {
        cursor: "pointer",
        padding: "8px 0",
    },
    activeReportListItem: {
        fontWeight: "bold",
        color: "#1e88e5",
    },
};

function ReportSummary({ reports, latestReport }) {
    const [allReports, setAllReports] = useState(reports || []);
    const [loading, setLoading] = useState(!reports || reports.length === 0);
    const [selectedReport, setSelectedReport] = useState(latestReport || null);

    useEffect(() => {
        if (!reports || reports.length === 0) {
            fetchReports();
        } else {
            setAllReports(reports);
        }
    }, [reports]);

    useEffect(() => {
        if (latestReport) setSelectedReport(latestReport);
    }, [latestReport]);

    const fetchReports = async () => {
        try {
            const response = await axios.get("/api/reports");
            setAllReports(response.data.reports);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error("Failed to fetch reports:", error);
        }
    };

    const viewReportDetails = (report) => setSelectedReport(report);

    if (loading && allReports.length === 0) {
        return <p>Loading reports...</p>;
    }

    return (
        <div style={styles.container}>
            {selectedReport && (
                <div>
                    <h2>Report Summary</h2>
                    <div style={styles.reportCard}>
                        <div style={styles.reportHeader}>
                            <div>
                                <h4>{selectedReport.file_name || selectedReport.fileName}</h4>
                                <span>
                                    {new Date(
                                        selectedReport.upload_date || selectedReport.uploadDate
                                    ).toLocaleDateString()}
                                </span>
                            </div>
                            <span style={styles.statusBadge}>{selectedReport.status}</span>
                        </div>

                        {selectedReport.summary && (
                            <section style={styles.section}>
                                <h5>Summary</h5>
                                <p>{selectedReport.summary}</p>
                            </section>
                        )}

                        {selectedReport.findings?.length > 0 && (
                            <section style={styles.section}>
                                <h5>Key Findings</h5>
                                <ul style={styles.list}>
                                    {selectedReport.findings.map((f, i) => (
                                        <li key={i}>{f}</li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {selectedReport.recommendations?.length > 0 && (
                            <section style={styles.section}>
                                <h5>Recommendations</h5>
                                <ul style={styles.list}>
                                    {selectedReport.recommendations.map((r, i) => (
                                        <li key={i}>{r}</li>
                                    ))}
                                </ul>
                            </section>
                        )}
                    </div>
                </div>
            )}
            <h3>All Reports</h3>
            {allReports.length === 0 ? (
                <p>No reports uploaded yet</p>
            ) : (
                <ul style={styles.reportList}>
                    {allReports.map((report, i) => (
                        <li
                            key={i}
                            style={{
                                ...styles.reportListItem,
                                ...(report === selectedReport ? styles.activeReportListItem : {}),
                            }}
                            onClick={() => viewReportDetails(report)}
                        >
                            {report.file_name || report.fileName} -{" "}
                            {new Date(report.upload_date || report.uploadDate).toLocaleDateString()}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ReportSummary;
