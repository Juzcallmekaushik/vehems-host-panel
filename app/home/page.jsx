'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/NavBar';
import AddNotes from '../../components/AddNotes';
import AddPartner from '../../components/AddPartner';
import AddNotification from '../../components/AddNotification';

export default function HomePage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [showAddNotes, setShowAddNotes] = useState(false);
    const [showAddPartner, setShowAddPartner] = useState(false);
    const [showAddNotification, setShowAddNotification] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkSession = () => {
            const session = localStorage.getItem('hostSession');
            if (!session) {
                router.push('/login');
                return;
            }
            setIsLoading(false);
        };

        const checkScreenSize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkSession();
        checkScreenSize();

        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, [router]);

    if (isLoading) {
        return (
            <div style={{
            minHeight: "100vh",
            background: "#1E221A",
            color: "#AFC699",
            fontFamily: "'Advent Pro', sans-serif",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            }}>
            <style>{`
                @keyframes pulse {
                0% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.12); opacity: 0.7; }
                100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
            <img
                src="/logos/favicon.png"
                alt="Loading"
                style={{
                width: 64,
                height: 64,
                animation: "pulse 1.2s infinite",
                marginBottom: 18,
                }}
            />
            </div>
        );
    }

    return (
        <div style={{
            minHeight: "100vh",
            background: "#1E221A",
            color: "#AFC699",
            fontFamily: "'Advent Pro', sans-serif",
            position: "relative",
        }}>
            <Navbar />
            <div style={{
                padding: "24px",
            }}>
                <div style={{
                    fontFamily: "'adventPro', sans-serif",
                    textAlign: "center",
                    marginBottom: 30,
                    fontSize: 13,
                    letterSpacing: 1,
                    fontWeight: 650,
                }}>
                    HELLO, USER! WELCOME TO THE HOST DASHBOARD. MANAGE, CUSTOMIZE, <br style={{ display: isMobile ? "none" : "inline" }} />
                    AND EXPLORE EVERYTHING YOU NEED TO KEEP THINGS RUNNING SMOOTHLY.
                </div>
                
                {/* Mobile Layout - ADD buttons on top */}
                <div style={{
                    display: isMobile ? "flex" : "none",
                    justifyContent: "center",
                    gap: 20,
                    marginBottom: 40,
                    flexWrap: "wrap",
                }}>
                    {["ADD NOTES", "ADD PARTNERS", "ADD NOTIFICATIONS"].map((label) => (
                        <div key={label} style={{ fontFamily: "'blatantBold', sans-serif", textAlign: "center" }}>
                            <div style={{
                                background: "#667558",
                                width: 150,
                                height: 70,
                                borderRadius: 8,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 700,
                                fontSize: 18,
                                margin: "0 auto",
                                marginBottom: 8,
                                boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                                color: "#1E221A",
                                fontFamily: "'blatantBold', sans-serif",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = "translateY(-2px)";
                                e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = "translateY(0)";
                                e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.10)";
                            }}
                            onClick={() => {
                                if (label === "ADD NOTES") setShowAddNotes(true);
                                else if (label === "ADD PARTNERS") setShowAddPartner(true);
                                else if (label === "ADD NOTIFICATIONS") setShowAddNotification(true);
                            }}>
                                +
                            </div>
                            <div style={{
                                fontSize: 14,
                                letterSpacing: 1,
                                color: "#AFC699",
                                fontFamily: "'adventPro', sans-serif",
                            }}>
                                {label}
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{
                    display: "flex",
                    justifyContent: isMobile ? "center" : "space-around",
                    alignItems: "center",
                    margin: "0 auto",
                    maxWidth: 1400,
                    marginBottom: 40,
                    flexDirection: isMobile ? "column" : "row",
                    gap: isMobile ? "20px" : "0",
                }}>
                    {[
                        { label: "USERS", path: "/users" },
                        { label: "DOWNLOADS", path: "/downloads" },
                        { label: "NOTES", path: "/notes" },
                        { label: "PARTNERS", path: "/partners" }
                    ].map(({ label, path }) => (
                        <div
                            key={label}
                            style={{
                                background: "#667558",
                                width: isMobile ? "90%" : 270,
                                maxWidth: isMobile ? "350px" : "270px",
                                height: isMobile ? 120 : 210,
                                borderRadius: 8,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 700,
                                fontSize: isMobile ? 20 : 24,
                                margin: isMobile ? "0" : "0 12px",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                                color: "#1E221A",
                                fontFamily: "'blatantBold', sans-serif",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = "translateY(-2px)";
                                e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = "translateY(0)";
                                e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.12)";
                            }}
                            onClick={() => router.push(path)}
                        >
                            {label.split('').map((char, idx) =>
                                isMobile ? char : (
                                    char === ' ' ? '\u00A0' : <span key={idx}>{char}<br /></span>
                                )
                            )}
                        </div>
                    ))}
                </div>
                
                <div style={{
                    display: isMobile ? "none" : "flex",
                    justifyContent: "center",
                    gap: 60,
                    marginBottom: 0,
                }}>
                    {["ADD NOTES", "ADD PARTNERS", "ADD NOTIFICATIONS"].map((label) => (
                        <div key={label} style={{ fontFamily: "'blatantBold', sans-serif", textAlign: "center" }}>
                            <div style={{
                                background: "#667558",
                                width: 210,
                                height: 90,
                                borderRadius: 8,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 700,
                                fontSize: 20,
                                margin: "0 auto",
                                marginBottom: 8,
                                boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                                color: "#1E221A",
                                fontFamily: "'blatantBold', sans-serif",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = "translateY(-2px)";
                                e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = "translateY(0)";
                                e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.10)";
                            }}
                            onClick={() => {
                                if (label === "ADD NOTES") setShowAddNotes(true);
                                else if (label === "ADD PARTNERS") setShowAddPartner(true);
                                else if (label === "ADD NOTIFICATIONS") setShowAddNotification(true);
                            }}>
                                +
                            </div>
                            <div style={{
                                fontSize: 18,
                                letterSpacing: 1,
                                color: "#AFC699",
                                fontFamily: "'adventPro', sans-serif",
                            }}>
                                {label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Modal Backdrop with Animation */}
            {(showAddNotes || showAddPartner || showAddNotification) && (
                <>
                    <style jsx>{`
                        @keyframes fadeIn {
                            from { opacity: 0; }
                            to { opacity: 1; }
                        }
                        @keyframes slideIn {
                            from { 
                                opacity: 0;
                                transform: translateY(-20px) scale(0.95);
                            }
                            to { 
                                opacity: 1;
                                transform: translateY(0) scale(1);
                            }
                        }
                        .modal-backdrop {
                            animation: fadeIn 0.2s ease-out;
                        }
                        .modal-content {
                            animation: slideIn 0.3s ease-out;
                        }
                    `}</style>
                    <div 
                        className="modal-backdrop"
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: "rgba(0, 0, 0, 0.7)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 1000,
                            padding: "20px",
                        }}
                        onClick={(e) => {
                            if (e.target === e.currentTarget) {
                                setShowAddNotes(false);
                                setShowAddPartner(false);
                                setShowAddNotification(false);
                            }
                        }}
                    >
                        <div className="modal-content" style={{ maxHeight: "90vh", overflowY: "auto" }}>
                            {showAddNotes && <AddNotes onClose={() => setShowAddNotes(false)} />}
                            {showAddPartner && <AddPartner onClose={() => setShowAddPartner(false)} />}
                            {showAddNotification && <AddNotification onClose={() => setShowAddNotification(false)} />}
                        </div>
                    </div>
                </>
            )}
            
            <div style={{
                position: "fixed",
                left: "50%",
                bottom: 14,
                transform: "translateX(-50%)",
                fontSize: 12,
                color: "#AFC699",
                letterSpacing: 1,
                fontFamily: "'adventPro', sans-serif",
                fontWeight: 600,
                textAlign: "center",
                zIndex: 100,
                width: "100vw",
                pointerEvents: "none"
            }}>
                © STUDY.VEHEM.ME
            </div>
        </div>
    );
}