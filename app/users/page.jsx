'use client';
import { useEffect, useState } from 'react';
import Navbar from '../../components/NavBar';
import { createClient } from '../../lib/supabaseClient.js';

const supabase = createClient();

function timeAgo(dateString) {
    const now = new Date();
    const dateObj = new Date(dateString);
    const diff = Math.floor((now - dateObj) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 172800) return `${Math.floor(diff / 86400)}d ago`;
    return dateObj.toLocaleDateString();
}

export default function HomePage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        async function fetchUsers() {
            setLoading(true);
            const { data, error } = await supabase
                .from('users')
                .select('username, email, created_at')
                .order('created_at', { ascending: false });
            if (!error) setUsers(data || []);
            setLoading(false);
        }

        const checkScreenSize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        fetchUsers();
        checkScreenSize();

        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const totalPages = Math.ceil(users.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentUsers = users.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <>
            <style jsx>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .mobile-scroll::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
            <div style={{
                minHeight: "100vh",
                background: "#1E221A",
                color: "#AFC699",
                fontFamily: "'Advent Pro', sans-serif",
                display: "flex",
                flexDirection: "column",
            }}>
            <Navbar />
            <div style={{ flex: 1, padding: "24px" }}>
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
                <div style={{
                    textAlign: "center",
                    fontFamily: "'adventPro', sans-serif",
                    fontSize: 15,
                    fontWeight: 700,
                    marginBottom: 10,
                    letterSpacing: 1,
                }}>
                    USER TABLE
                </div>
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                }}>
                    {/* Desktop Table Layout */}
                    <div style={{
                        width: "90%",
                        background: "#23281F",
                        borderRadius: 2,
                        overflow: "hidden",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
                        border: "1px solid #394032",
                        display: isMobile ? "none" : "block",
                    }}>
                        <div style={{
                            background: "#7E8C6B",
                            display: "flex",
                        }}>
                            <div style={{...thStyle, width: "33.33%", flex: "0 0 33.33%"}}>USER NAME</div>
                            <div style={{...thStyle, width: "33.33%", flex: "0 0 33.33%"}}>EMAIL</div>
                            <div style={{...thStyle, width: "33.34%", flex: "0 0 33.34%"}}>JOIN DATE</div>
                        </div>
                        <div 
                            className="table-container hide-scrollbar"
                            style={{
                                maxHeight: users.length >= 8 ? "320px" : "auto",
                                overflowY: users.length >= 8 ? "scroll" : "visible",
                                scrollbarWidth: "none",
                                msOverflowStyle: "none",
                            }}>
                            {loading ? (
                                <div style={{ textAlign: "center", padding: 24, fontFamily: "'adventPro', sans-serif", fontSize: 15, fontWeight: 500, borderBottom: "1px solid #394032" }}>Loading...</div>
                            ) : users.length === 0 ? (
                                <div style={{ textAlign: "center", padding: 24, fontFamily: "'adventPro', sans-serif", fontSize: 18, fontWeight: 500, borderBottom: "1px solid #394032" }}>NO USERS FOUND</div>
                            ) : (
                                users.map((user, idx) => (
                                    <div key={idx} style={{ display: "flex", borderBottom: "1px solid #394032" }}>
                                        <div style={{...tdStyleDiv, width: "33.33%", flex: "0 0 33.33%"}}>{user.username}</div>
                                        <div style={{...tdStyleDiv, width: "33.33%", flex: "0 0 33.33%"}}>{user.email}</div>
                                        <div style={{...tdStyleDiv, width: "33.34%", flex: "0 0 33.34%"}}>{timeAgo(user.created_at)}</div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Mobile Card Layout */}
                    <div style={{
                        width: "95%",
                        display: isMobile ? "block" : "none",
                    }}>
                        {loading ? (
                            <div style={{
                                background: "#23281F",
                                borderRadius: 8,
                                padding: 24,
                                textAlign: "center",
                                fontFamily: "'adventPro', sans-serif",
                                fontSize: 15,
                                fontWeight: 500,
                                border: "1px solid #394032",
                                boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
                            }}>
                                Loading...
                            </div>
                        ) : users.length === 0 ? (
                            <div style={{
                                background: "#23281F",
                                borderRadius: 8,
                                padding: 24,
                                textAlign: "center",
                                fontFamily: "'adventPro', sans-serif",
                                fontSize: 16,
                                fontWeight: 500,
                                border: "1px solid #394032",
                                boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
                            }}>
                                NO USERS FOUND
                            </div>
                        ) : (
                            <>
                                <div className="scrollable-content" style={{
                                    maxHeight: users.length >= 6 ? "400px" : "auto",
                                    overflowY: "visible",
                                    scrollbarWidth: "none",
                                    msOverflowStyle: "none",
                                }}>
                                    {currentUsers.map((user, idx) => (
                                        <div key={idx} style={{
                                            background: "#23281F",
                                            borderRadius: 8,
                                            padding: "16px",
                                            marginBottom: "12px",
                                            border: "1px solid #394032",
                                            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                                        }}>
                                            <div style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                marginBottom: "8px",
                                            }}>
                                                <div style={{
                                                    fontFamily: "'adventPro', sans-serif",
                                                    fontSize: 11,
                                                    fontWeight: 700,
                                                    color: "#7E8C6B",
                                                    letterSpacing: 1,
                                                }}>
                                                    USERNAME
                                                </div>
                                                <div style={{
                                                    fontFamily: "'adventPro', sans-serif",
                                                    fontSize: 16,
                                                    fontWeight: 600,
                                                    color: "#AFC699",
                                                    letterSpacing: 0.5,
                                                }}>
                                                    {user.username}
                                                </div>
                                            </div>
                                            <div style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                marginBottom: "8px",
                                            }}>
                                                <div style={{
                                                    fontFamily: "'adventPro', sans-serif",
                                                    fontSize: 11,
                                                    fontWeight: 700,
                                                    color: "#7E8C6B",
                                                    letterSpacing: 1,
                                                }}>
                                                    EMAIL
                                                </div>
                                                <div style={{
                                                    fontFamily: "'adventPro', sans-serif",
                                                    fontSize: 14,
                                                    fontWeight: 500,
                                                    color: "#AFC699",
                                                    letterSpacing: 0.5,
                                                    textAlign: "right",
                                                    wordBreak: "break-word",
                                                    maxWidth: "70%",
                                                }}>
                                                    {user.email}
                                                </div>
                                            </div>
                                            <div style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                            }}>
                                                <div style={{
                                                    fontFamily: "'adventPro', sans-serif",
                                                    fontSize: 11,
                                                    fontWeight: 700,
                                                    color: "#7E8C6B",
                                                    letterSpacing: 1,
                                                }}>
                                                    JOINED
                                                </div>
                                                <div style={{
                                                    fontFamily: "'adventPro', sans-serif",
                                                    fontSize: 14,
                                                    fontWeight: 500,
                                                    color: "#AFC699",
                                                    letterSpacing: 0.5,
                                                }}>
                                                    {timeAgo(user.created_at)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {/* Mobile Pagination */}
                                {totalPages > 1 && (
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        gap: "8px",
                                        marginTop: "20px",
                                        padding: "16px 0",
                                    }}>
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            style={{
                                                background: currentPage === 1 ? "#394032" : "#667558",
                                                color: currentPage === 1 ? "#7E8C6B" : "#1E221A",
                                                border: "none",
                                                padding: "8px 12px",
                                                borderRadius: 4,
                                                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                                                fontFamily: "'adventPro', sans-serif",
                                                fontSize: 14,
                                                fontWeight: 600,
                                                transition: "all 0.2s ease",
                                            }}
                                        >
                                            ←
                                        </button>
                                        
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                style={{
                                                    background: page === currentPage ? "#7E8C6B" : "#394032",
                                                    color: page === currentPage ? "#1E221A" : "#AFC699",
                                                    border: "none",
                                                    padding: "8px 12px",
                                                    borderRadius: 4,
                                                    cursor: "pointer",
                                                    fontFamily: "'adventPro', sans-serif",
                                                    fontSize: 14,
                                                    fontWeight: 600,
                                                    minWidth: "36px",
                                                    transition: "all 0.2s ease",
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (page !== currentPage) {
                                                        e.target.style.background = "#4A5241";
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (page !== currentPage) {
                                                        e.target.style.background = "#394032";
                                                    }
                                                }}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                        
                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            style={{
                                                background: currentPage === totalPages ? "#394032" : "#667558",
                                                color: currentPage === totalPages ? "#7E8C6B" : "#1E221A",
                                                border: "none",
                                                padding: "8px 12px",
                                                borderRadius: 4,
                                                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                                                fontFamily: "'adventPro', sans-serif",
                                                fontSize: 14,
                                                fontWeight: 600,
                                                transition: "all 0.2s ease",
                                            }}
                                        >
                                            →
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
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
            </>
    );
}

const thStyle = {
    padding: "4px 12px",
    fontFamily: "'adventPro', sans-serif",
    fontWeight: 800,
    textAlign: "center",
    letterSpacing: 1,
    color: "#23281F",
    fontSize: 18,
    borderLeft: "1px solid #394032",
    borderRight: "1px solid #394032",
};

const tdStyleDiv = {
    padding: "4px 12px",
    borderLeft: "1px solid #394032",
    borderRight: "1px solid #394032",
    color: "#AFC699",
    fontFamily: "'adventPro', sans-serif",
    fontWeight: 500,
    textAlign: "center",
    letterSpacing: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "40px",
};