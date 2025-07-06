'use client';
import { useEffect, useState } from 'react';
import Navbar from '../../components/NavBar';
import { createClient } from '../../lib/supabaseClient.js';
import { AlignCenter, ArrowDownWideNarrow } from 'lucide-react';

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
    const [downloads, setDownloads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [sortBy, setSortBy] = useState('users');
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        async function fetchUsers() {
            setLoading(true);
            const { data, userError } = await supabase
                .from('downloads')
                .select('username, email, downloads')
                .is('filename', null);
            if (!userError) setUsers(data || []);
            const { data: downloadData, error: fileError } = await supabase
                .from('downloads')
                .select('filename, file_url, downloads')
                .is('username', null);   
            if (!fileError) setDownloads(downloadData || []);
            setLoading(false);
        }

        const checkScreenSize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        const handleClickOutside = (event) => {
            if (showDropdown && !event.target.closest('.dropdown-container')) {
                setShowDropdown(false);
            }
        };

        fetchUsers();
        checkScreenSize();

        window.addEventListener('resize', checkScreenSize);
        document.addEventListener('click', handleClickOutside);
        return () => {
            window.removeEventListener('resize', checkScreenSize);
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

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
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 10,
                    position: "relative",
                }}>
                    <div style={{
                        textAlign: "center",
                        fontFamily: "'adventPro', sans-serif",
                        fontSize: 15,
                        fontWeight: 700,
                        letterSpacing: 1,
                        flex: "none",
                    }}>
                        DOWNLOADS TABLE
                    </div>
                    <div style={{
                        position: "absolute",
                        right: isMobile ? 0 : 60,
                        top: "50%",
                        transform: "translateY(-50%)",
                    }} className="dropdown-container">
                        <div
                            style={{
                                background: "#667558",
                                color: "#1E221A",
                                padding: "8px 16px",
                                borderRadius: 4,
                                fontFamily: "'adventPro', sans-serif",
                                fontSize: 12,
                                fontWeight: 700,
                                letterSpacing: 1,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                transition: "all 0.2s ease",
                            }}
                            onClick={() => setShowDropdown(!showDropdown)}
                            onMouseEnter={(e) => {
                                e.target.style.background = "#7A8B64";
                            }}
                            onMouseLeave={(e) => {
                                if (isMobile) return null;
                                                                e.target.style.background = "#667558";
                                                            }}
                                                        >
                                                            {!isMobile ? (
                                                                <>SORT BY: {sortBy === 'users' ? 'USERS' : 'FILES'}</>
                                                            ) : (
                                                                <ArrowDownWideNarrow
                                                                    size={16}
                                                                    style={{
                                                                        transform: showDropdown ? "rotate(180deg)" : "rotate(0deg)",
                                                                        transition: "transform 0.2s ease",
                                                                    }}
                                                                />
                                                            )}
                                                        </div>
                                                        {showDropdown && (
                                                            <div style={{
                                                                position: "absolute",
                                                                top: "100%",
                                                                right: 0,
                                                                background: "#23281F",
                                                                border: "1px solid #394032",
                                                                borderRadius: 4,
                                                                marginTop: 4,
                                                                zIndex: 10,
                                                                minWidth: 120,
                                                                boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                                                            }}>
                                                                <div
                                                                    style={{
                                                                        padding: "10px 16px",
                                                                        fontFamily: "'adventPro', sans-serif",
                                                                        fontSize: 12,
                                                                        fontWeight: 600,
                                                                        letterSpacing: 1,
                                                                        cursor: "pointer",
                                                                        color: sortBy === 'users' ? "#7E8C6B" : "#AFC699",
                                                                        background: sortBy === 'users' ? "#2A3025" : "transparent",
                                                                        borderBottom: "1px solid #394032",
                                                                        transition: "all 0.2s ease",
                                                                    }}
                                                                    onClick={() => {
                                        setSortBy('users');
                                        setShowDropdown(false);
                                    }}
                                    onMouseEnter={(e) => {
                                        if (sortBy !== 'users') {
                                            e.target.style.background = "#2A3025";
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (sortBy !== 'users') {
                                            e.target.style.background = "transparent";
                                        }
                                    }}
                                >
                                    USERS
                                </div>
                                <div
                                    style={{
                                        padding: "10px 16px",
                                        fontFamily: "'adventPro', sans-serif",
                                        fontSize: 12,
                                        fontWeight: 600,
                                        letterSpacing: 1,
                                        cursor: "pointer",
                                        color: sortBy === 'files' ? "#7E8C6B" : "#AFC699",
                                        background: sortBy === 'files' ? "#2A3025" : "transparent",
                                        transition: "all 0.2s ease",
                                    }}
                                    onClick={() => {
                                        setSortBy('files');
                                        setShowDropdown(false);
                                    }}
                                    onMouseEnter={(e) => {
                                        if (sortBy !== 'files') {
                                            e.target.style.background = "#2A3025";
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (sortBy !== 'files') {
                                            e.target.style.background = "transparent";
                                        }
                                    }}
                                >
                                    FILES
                                </div>
                            </div>
                        )}
                    </div>
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
                            {sortBy === 'users' ? (
                                <>
                                    <div style={{...thStyle, width: "33.33%", flex: "0 0 33.33%"}}>USER NAME</div>
                                    <div style={{...thStyle, width: "33.33%", flex: "0 0 33.33%"}}>EMAIL</div>
                                    <div style={{...thStyle, width: "33.34%", flex: "0 0 33.34%"}}>DOWNLOADS</div>
                                </>
                            ) : (
                                <>
                                    <div style={{...thStyle, width: "40%", flex: "0 0 40%"}}>FILE NAME</div>
                                    <div style={{...thStyle, width: "30%", flex: "0 0 30%"}}>FILE URL</div>
                                    <div style={{...thStyle, width: "30%", flex: "0 0 30%"}}>DOWNLOADS</div>
                                </>
                            )}
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
                            ) : (sortBy === 'users' ? users : downloads).length === 0 ? (
                                <div style={{ textAlign: "center", padding: 24, fontFamily: "'adventPro', sans-serif", fontSize: 18, fontWeight: 500, borderBottom: "1px solid #394032" }}>
                                    {sortBy === 'users' ? 'NO USERS FOUND' : 'NO FILES FOUND'}
                                </div>
                            ) : sortBy === 'users' ? (
                                users.map((user, idx) => (
                                    <div key={idx} style={{ display: "flex", borderBottom: "1px solid #394032" }}>
                                        <div style={{...tdStyleDiv, width: "33.33%", flex: "0 0 33.33%"}}>{user.username}</div>
                                        <div style={{...tdStyleDiv, width: "33.33%", flex: "0 0 33.33%"}}>{user.email}</div>
                                        <div style={{...tdStyleDiv, width: "33.34%", flex: "0 0 33.34%"}}>{user.downloads}</div>
                                    </div>
                                ))
                            ) : (
                                downloads.map((file, idx) => (
                                    <div key={idx} style={{ display: "flex", borderBottom: "1px solid #394032" }}>
                                        <div style={{...tdStyleDiv, width: "40%", flex: "0 0 40%"}}>{file.filename}</div>
                                        <div style={{...tdStyleDiv, width: "30%", flex: "0 0 30%", fontSize: 12}}>
                                            <a href={file.file_url} target="_blank" rel="noopener noreferrer" style={{ color: "#AFC699"}}>
                                                {file.file_url?.substring(0, 30)}...
                                            </a>
                                        </div>
                                        <div style={{...tdStyleDiv, width: "30%", flex: "0 0 30%"}}>{file.downloads}</div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

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
                        ) : (sortBy === 'users' ? users : downloads).length === 0 ? (
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
                                {sortBy === 'users' ? 'NO USERS FOUND' : 'NO FILES FOUND'}
                            </div>
                        ) : (
                            <div className="scrollable-content" style={{
                                maxHeight: (sortBy === 'users' ? users : downloads).length >= 6 ? "400px" : "auto",
                                overflowY: (sortBy === 'users' ? users : downloads).length >= 6 ? "scroll" : "visible",
                                scrollbarWidth: "none",
                                msOverflowStyle: "none",
                            }}>
                                {sortBy === 'users' ? users.map((user, idx) => (
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
                                                DOWNLOADS
                                            </div>
                                            <div style={{
                                                fontFamily: "'adventPro', sans-serif",
                                                fontSize: 14,
                                                fontWeight: 500,
                                                color: "#AFC699",
                                                letterSpacing: 0.5,
                                            }}>
                                                {user.downloads}
                                            </div>
                                        </div>
                                    </div>
                                )) : downloads.map((file, idx) => (
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
                                                FILENAME
                                            </div>
                                            <div style={{
                                                fontFamily: "'adventPro', sans-serif",
                                                fontSize: 16,
                                                fontWeight: 600,
                                                color: "#AFC699",
                                                letterSpacing: 0.5,
                                            }}>
                                                {file.filename}
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
                                                FILE URL
                                            </div>
                                            <div style={{
                                                fontFamily: "'adventPro', sans-serif",
                                                fontSize: 12,
                                                fontWeight: 500,
                                                color: "#AFC699",
                                                letterSpacing: 0.5,
                                                textAlign: "right",
                                                maxWidth: "70%",
                                            }}>
                                                <a href={file.file_url} target="_blank" rel="noopener noreferrer" style={{ color: "#AFC699", textDecoration: "underline" }}>
                                                    {file.file_url?.substring(0, 25)}...
                                                </a>
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
                                                DOWNLOADS
                                            </div>
                                            <div style={{
                                                fontFamily: "'adventPro', sans-serif",
                                                fontSize: 14,
                                                fontWeight: 500,
                                                color: "#AFC699",
                                                letterSpacing: 0.5,
                                            }}>
                                                {file.downloads}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
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

const tdStyle = {
    padding: "4px 12px",
    borderBottom: "1px solid #394032",
    borderLeft: "1px solid #394032",
    borderRight: "1px solid #394032",
    borderTop: "1px solid #394032",
    color: "#AFC699",
    fontFamily: "'adventPro', sans-serif",
    fontWeight: 500,
    textAlign: "center",
    letterSpacing: 1,
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