'use client';
import { useEffect, useState } from 'react';
import Navbar from '../../components/NavBar';
import EditNotes from '../../components/EditNotes';
import { createClient } from '../../lib/supabaseClient.js';
import { NotepadText, FileImage, Pencil, Trash } from 'lucide-react';


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
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkScreenSize();

        async function fetchNotes() {
            setLoading(true);
            const { data, error } = await supabase
                .from('notes')
                .select('title, level, image_url, read_time, file_url, created_at');
            if (!error) setNotes(data || []);
            setLoading(false);
        }

        fetchNotes();

        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const [editNote, setEditNote] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleEditNote = (note) => {
        setEditNote(note);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setTimeout(() => setEditNote(null), 200);
    };

    const handleDeleteNote = async (note) => {
        if (window.confirm(`Are you sure you want to delete "${note.title}"?`)) {
            try {
                const { error } = await supabase
                    .from('notes')
                    .delete()
                    .eq('file_url', note.file_url);

                if (error) {
                    alert('Failed to delete note. Please try again.', error.message);
                } else {
                    setNotes(prevNotes => prevNotes.filter(n => n.file_url !== note.file_url));
                }
            } catch (err) {
                console.error('Unexpected error:', err);
                alert('An unexpected error occurred. Please try again.');
            }
        }
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
                    NOTES TABLE
                </div>
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                }}>
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
                            <div style={{...thStyle, width: "25%", flex: "0 0 25%"}}>TITLE</div>
                            <div style={{...thStyle, width: "8%", flex: "0 0 8%"}}>LEVEL</div>
                            <div style={{...thStyle, width: "12%", flex: "0 0 12%"}}>FILE URL</div>
                            <div style={{...thStyle, width: "12%", flex: "0 0 12%"}}>IMAGE URL</div>
                            <div style={{...thStyle, width: "10%", flex: "0 0 10%"}}>READ TIME</div>
                            <div style={{...thStyle, width: "25%", flex: "0 0 25%"}}>CREATED AT</div>
                            <div style={{...thStyle, width: "8%", flex: "0 0 8%"}}>EDIT</div>
                        </div>
                        <div className="hide-scrollbar"
                            style={{
                                maxHeight: notes.length >= 8 ? "320px" : "auto",
                                overflowY: notes.length >= 8 ? "scroll" : "visible",
                                scrollbarWidth: "none",
                                msOverflowStyle: "none",
                            }}>
                            {loading ? (
                                <div style={{ textAlign: "center", padding: 24, fontFamily: "'adventPro', sans-serif", fontSize: 15, fontWeight: 500, borderBottom: "1px solid #394032" }}>Loading...</div>
                            ) : notes.length === 0 ? (
                                <div style={{ textAlign: "center", padding: 24, fontFamily: "'adventPro', sans-serif", fontSize: 18, fontWeight: 500, borderBottom: "1px solid #394032" }}>NO NOTES FOUND</div>
                            ) : (
                                notes.map((note, idx) => (
                                    <div key={idx} style={{ display: "flex", borderBottom: "1px solid #394032" }}>
                                        <div style={{...tdStyleDiv, width: "25%", flex: "0 0 25%"}}>{note.title}</div>
                                        <div style={{...tdStyleDiv, width: "8%", flex: "0 0 8%"}}>{note.level}</div>
                                        <div style={{...tdStyleDiv, width: "12%", flex: "0 0 12%"}}>
                                            <a href={note.file_url} target="_blank" rel="noopener noreferrer" style={{ color: "#AFC699", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                                                <NotepadText size={20} />
                                            </a>
                                        </div>
                                        <div style={{...tdStyleDiv, width: "12%", flex: "0 0 12%"}}>
                                            <a href={note.image_url} target="_blank" rel="noopener noreferrer" style={{ color: "#AFC699", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                                                <FileImage size={20} />
                                            </a>
                                            </div>
                                        <div style={{...tdStyleDiv, width: "10%", flex: "0 0 10%"}}>{note.read_time}</div>
                                        <div style={{...tdStyleDiv, width: "25%", flex: "0 0 25%"}}>{timeAgo(note.created_at)}</div>
                                        <div style={{...tdStyleDiv, width: "9%", flex: "0 0 9%"}}>
                                            <Pencil size={14} style={{ cursor: "pointer" }} onClick={() => handleEditNote(note)} />
                                            <Trash size={14} style={{ cursor: "pointer", marginLeft: 8 }} onClick={() => handleDeleteNote(note)} />
                                        </div>
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
                        ) : notes.length === 0 ? (
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
                                NO NOTES FOUND
                            </div>
                        ) : (
                            <div style={{
                                maxHeight: notes.length >= 6 ? "400px" : "auto",
                                overflowY: notes.length >= 6 ? "scroll" : "visible",
                                scrollbarWidth: "none",
                                msOverflowStyle: "none",
                            }}>
                                {notes.map((note, idx) => (
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
                                            alignItems: "flex-start",
                                            marginBottom: "12px",
                                        }}>
                                            <div style={{
                                                flex: 1,
                                            }}>
                                                <div style={{
                                                    fontFamily: "'adventPro', sans-serif",
                                                    fontSize: 11,
                                                    fontWeight: 700,
                                                    color: "#7E8C6B",
                                                    letterSpacing: 1,
                                                    marginBottom: "4px",
                                                }}>
                                                    TITLE
                                                </div>
                                                <div style={{
                                                    fontFamily: "'adventPro', sans-serif",
                                                    fontSize: 16,
                                                    fontWeight: 600,
                                                    color: "#AFC699",
                                                    letterSpacing: 0.5,
                                                    wordBreak: "break-word",
                                                }}>
                                                    {note.title}
                                                </div>
                                            </div>
                                            <div style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "8px",
                                                marginLeft: "12px",
                                            }}>
                                                <Pencil size={20} style={{ cursor: "pointer" }} onClick={() => handleEditNote(note)} />
                                                <Trash size={20} style={{ cursor: "pointer" }} onClick={() => handleDeleteNote(note)} />
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
                                                LEVEL
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
                                                {note.level}
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
                                                fontSize: 14,
                                                fontWeight: 500,
                                                color: "#AFC699",
                                                letterSpacing: 0.5,
                                                textAlign: "right",
                                                maxWidth: "70%",
                                            }}>
                                                <a href={note.file_url} target="_blank" rel="noopener noreferrer" style={{ color: "#AFC699", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
                                                    <NotepadText size={16} />
                                                    View
                                                </a>
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
                                                IMAGE URL
                                            </div>
                                            <div style={{
                                                fontFamily: "'adventPro', sans-serif",
                                                fontSize: 14,
                                                fontWeight: 500,
                                                color: "#AFC699",
                                                letterSpacing: 0.5,
                                                textAlign: "right",
                                                maxWidth: "70%",
                                            }}>
                                                <a href={note.image_url} target="_blank" rel="noopener noreferrer" style={{ color: "#AFC699", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
                                                    <FileImage size={16} />
                                                    View
                                                </a>
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
                                                READ TIME
                                            </div>
                                            <div style={{
                                                fontFamily: "'adventPro', sans-serif",
                                                fontSize: 14,
                                                fontWeight: 500,
                                                color: "#AFC699",
                                                letterSpacing: 0.5,
                                            }}>
                                                {note.read_time}
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
                                                CREATED AT
                                            </div>
                                            <div style={{
                                                fontFamily: "'adventPro', sans-serif",
                                                fontSize: 14,
                                                fontWeight: 500,
                                                color: "#AFC699",
                                                letterSpacing: 0.5,
                                            }}>
                                                {timeAgo(note.created_at)}
                                            </div>
                                        </div>
                                        <div style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            gap: "12px",
                                            marginTop: "12px",
                                            paddingTop: "12px",
                                            borderTop: "1px solid #394032",
                                        }}>
                                            <div style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "12px",
                                            }}>
                                                <a href={note.file_url} target="_blank" rel="noopener noreferrer" style={{ 
                                                    color: "#AFC699", 
                                                    textDecoration: "none", 
                                                    display: "flex", 
                                                    alignItems: "center", 
                                                    gap: 4,
                                                    padding: "6px 8px",
                                                    background: "#394032",
                                                    borderRadius: 4,
                                                    fontSize: 12,
                                                    fontFamily: "'adventPro', sans-serif",
                                                    fontWeight: 600,
                                                    transition: "background 0.2s ease",
                                                }}>
                                                    <NotepadText size={14} />
                                                    FILE
                                                </a>
                                                <a href={note.image_url} target="_blank" rel="noopener noreferrer" style={{ 
                                                    color: "#AFC699", 
                                                    textDecoration: "none", 
                                                    display: "flex", 
                                                    alignItems: "center", 
                                                    gap: 4,
                                                    padding: "6px 8px",
                                                    background: "#394032",
                                                    borderRadius: 4,
                                                    fontSize: 12,
                                                    fontFamily: "'adventPro', sans-serif",
                                                    fontWeight: 600,
                                                    transition: "background 0.2s ease",
                                                }}>
                                                    <FileImage size={14} />
                                                    IMAGE
                                                </a>
                                            </div>
                                            <div style={{
                                                fontFamily: "'adventPro', sans-serif",
                                                fontSize: 12,
                                                fontWeight: 500,
                                                color: "#7E8C6B",
                                                letterSpacing: 0.5,
                                            }}>
                                                {timeAgo(note.created_at)}
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
            {editNote && showModal && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: showModal ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1000,
                    backdropFilter: showModal ? "blur(2px)" : "blur(0px)",
                    transition: "all 0.2s ease",
                    opacity: showModal ? 1 : 0,
                }}>
                    <EditNotes
                        note={editNote}
                        onClose={handleCloseModal}
                    />
                </div>
            )}
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