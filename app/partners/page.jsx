'use client';
import { useEffect, useState } from 'react';
import Navbar from '../../components/NavBar';
import { createClient } from '../../lib/supabaseClient.js';
import { ExternalLink, Image, Pencil, Trash } from 'lucide-react';
import EditPartners from '../../components/EditPartners';

const supabase = createClient();

export default function HomePage() {
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkScreenSize();

        async function fetchPartners() {
            setLoading(true);
            const { data, error } = await supabase
                .from('partners')
                .select('id, title, description, website_url, image_url');
            if (!error) setPartners(data || []);
            setLoading(false);
        }

        fetchPartners();

        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // Ensure mobile detection works on component mount
    useEffect(() => {
        const setMobileState = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        
        setMobileState();
        window.addEventListener('resize', setMobileState);
        return () => window.removeEventListener('resize', setMobileState);
    }, []);

    const totalPages = Math.ceil(partners.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPartners = partners.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const [editingPartner, setEditingPartner] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleEditPartner = (partner) => {
        setEditingPartner(partner);
        setShowModal(true);
    };

    const handleEditClose = () => {
        setShowModal(false);
        setTimeout(() => setEditingPartner(null), 200);
    };

    const handlePartnerUpdate = (updatedPartner) => {
        // Update the partner in the local state
        setPartners(prevPartners => 
            prevPartners.map(partner => 
                partner.id === updatedPartner.id ? updatedPartner : partner
            )
        );
    };

    const handleEditSave = (updatedPartner) => {
        setPartners(prev =>
            prev.map(p => (p.id === updatedPartner.id ? updatedPartner : p))
        );
        setEditingPartner(null);
    };

    const handleDeletePartner = async (partner) => {
        if (window.confirm(`Are you sure you want to delete "${partner.title}"?`)) {
            try {
                const { error } = await supabase
                    .from('partners')
                    .delete()
                    .eq('id', partner.id);

                if (error) {
                    console.error('Error deleting partner:', error);
                    alert('Failed to delete partner. Please try again.');
                } else {
                    // Remove the partner from local state
                    setPartners(prevPartners => prevPartners.filter(p => p.id !== partner.id));
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
                    PARTNERS TABLE
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
                            <div style={{...thStyle, width: "20%", flex: "0 0 20%"}}>PARTNER</div>
                            <div style={{...thStyle, width: "35%", flex: "0 0 35%"}}>DESCRIPTION</div>
                            <div style={{...thStyle, width: "15%", flex: "0 0 15%"}}>WEBSITE</div>
                            <div style={{...thStyle, width: "15%", flex: "0 0 15%"}}>IMAGE</div>
                            <div style={{...thStyle, width: "15%", flex: "0 0 15%"}}>EDIT</div>
                        </div>
                        <div 
                            className="hide-scrollbar"
                            style={{
                                maxHeight: partners.length >= 8 ? "320px" : "auto",
                                overflowY: partners.length >= 8 ? "scroll" : "visible",
                                scrollbarWidth: "none",
                                msOverflowStyle: "none",
                            }}>
                            {loading ? (
                                <div style={{ textAlign: "center", padding: 24, fontFamily: "'adventPro', sans-serif", fontSize: 15, fontWeight: 500, borderBottom: "1px solid #394032" }}>Loading...</div>
                            ) : partners.length === 0 ? (
                                <div style={{ textAlign: "center", padding: 24, fontFamily: "'adventPro', sans-serif", fontSize: 18, fontWeight: 500, borderBottom: "1px solid #394032" }}>NO PARTNERS FOUND</div>
                            ) : (
                                partners.map((partner, idx) => (
                                    <div key={idx} style={{ display: "flex", borderBottom: "1px solid #394032" }}>
                                        <div style={{...tdStyleDiv, width: "20%", flex: "0 0 20%"}}>{partner.title}</div>
                                        <div style={{...tdStyleDiv, width: "35%", flex: "0 0 35%", textAlign: "left", justifyContent: "flex-start"}}>
                                            <div style={{ 
                                                overflow: "hidden", 
                                                textOverflow: "ellipsis", 
                                                display: "-webkit-box", 
                                                WebkitLineClamp: 2, 
                                                WebkitBoxOrient: "vertical",
                                                lineHeight: "1.2em",
                                                maxHeight: "2.4em"
                                            }}>
                                                {partner.description}
                                            </div>
                                        </div>
                                        <div style={{...tdStyleDiv, width: "15%", flex: "0 0 15%"}}>
                                            <a href={partner.website_url} target="_blank" rel="noopener noreferrer" style={{ color: "#AFC699", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                                                <ExternalLink size={20} />
                                            </a>
                                        </div>
                                        <div style={{...tdStyleDiv, width: "15%", flex: "0 0 15%"}}>
                                            <a href={partner.image_url} target="_blank" rel="noopener noreferrer" style={{ color: "#AFC699", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                                                <Image size={20} />
                                            </a>
                                        </div>
                                        <div style={{...tdStyleDiv, width: "15%", flex: "0 0 15%"}}>
                                            <Pencil size={14} style={{ cursor: "pointer", marginRight: 8 }} onClick={() => handleEditPartner(partner)} />
                                            <Trash size={14} style={{ cursor: "pointer" }} onClick={() => handleDeletePartner(partner)} />
                                        </div>
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
                        ) : partners.length === 0 ? (
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
                                NO PARTNERS FOUND
                            </div>
                        ) : (
                            <>
                                <div style={{
                                    maxHeight: partners.length >= 6 ? "400px" : "auto",
                                    overflowY: "visible",
                                    scrollbarWidth: "none",
                                    msOverflowStyle: "none",
                                }}>
                                    {currentPartners.map((partner, idx) => (
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
                                                        PARTNER
                                                    </div>
                                                    <div style={{
                                                        fontFamily: "'adventPro', sans-serif",
                                                        fontSize: 16,
                                                        fontWeight: 600,
                                                        color: "#AFC699",
                                                        letterSpacing: 0.5,
                                                        wordBreak: "break-word",
                                                        maxWidth: "70vw",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        whiteSpace: "nowrap",
                                                    }}>
                                                        {partner.title.length > 70
                                                            ? partner.title.slice(0, 67) + "..."
                                                            : partner.title}
                                                    </div>
                                                </div>
                                                <div style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "8px",
                                                    marginLeft: "12px",
                                                }}>
                                                    <Pencil size={20} style={{ cursor: "pointer" }} onClick={() => handleEditPartner(partner)} />
                                                    <Trash size={20} style={{ cursor: "pointer" }} onClick={() => handleDeletePartner(partner)} />
                                                </div>
                                            </div>
                                            <div style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "flex-start",
                                                marginBottom: "8px",
                                            }}>
                                                <div style={{
                                                    fontFamily: "'adventPro', sans-serif",
                                                    fontSize: 11,
                                                    fontWeight: 700,
                                                    color: "#7E8C6B",
                                                    letterSpacing: 1,
                                                }}>
                                                    DESCRIPTION
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
                                                    lineHeight: "1.3em",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    display: "-webkit-box",
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: "vertical",
                                                }}>
                                                    {partner.description.length > 70
                                                        ? partner.description.slice(0, 67) + "..."
                                                        : partner.description}
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
                                                    WEBSITE
                                                </div>
                                                <div style={{
                                                    fontFamily: "'adventPro', sans-serif",
                                                    fontSize: 14,
                                                    fontWeight: 500,
                                                    color: "#AFC699",
                                                    letterSpacing: 0.5,
                                                    maxWidth: "70vw",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
                                                }}>
                                                    <a href={partner.website_url} target="_blank" rel="noopener noreferrer" style={{ color: "#AFC699", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
                                                        <ExternalLink size={16} />
                                                        {partner.website_url.length > 70
                                                            ? partner.website_url.slice(0, 67) + "..."
                                                            : partner.website_url}
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
                                                    IMAGE
                                                </div>
                                                <div style={{
                                                    fontFamily: "'adventPro', sans-serif",
                                                    fontSize: 14,
                                                    fontWeight: 500,
                                                    color: "#AFC699",
                                                    letterSpacing: 0.5,
                                                    maxWidth: "70vw",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
                                                }}>
                                                    <a href={partner.image_url} target="_blank" rel="noopener noreferrer" style={{ color: "#AFC699", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
                                                        <Image size={16} />
                                                        {partner.image_url.length > 70
                                                            ? partner.image_url.slice(0, 67) + "..."
                                                            : partner.image_url}
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

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
            
            {editingPartner && showModal && (
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
                    <EditPartners
                        partner={editingPartner}
                        onClose={handleEditClose}
                        onUpdate={handlePartnerUpdate}
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