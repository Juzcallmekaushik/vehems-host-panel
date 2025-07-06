import React, { useState } from "react";
import { useEffect } from "react";
import { createClient } from "../lib/supabaseClient";
import { X } from "lucide-react";

    const EditPartners = ({ partner, onClose, onUpdate }) => {
    const supabase = createClient();
    const [initialData, setInitialData] = useState({});
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 10);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        async function fetchPartner() {
            if (!partner?.id) return;
            const { data, error } = await supabase
                .from("partners")
                .select("*")
                .eq("id", partner.id)
                .single();
            if (data) setInitialData(data);
        }
        fetchPartner();
    }, [partner?.id]);
    
    const [title, setTitle] = useState(partner.title || "");
    const [description, setDescription] = useState(partner.description || "");
    const [websiteUrl, setWebsiteUrl] = useState(partner.website_url || "");
    const [imageUrl, setImageUrl] = useState(partner.image_url || "");

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            if (onClose) onClose();
        }, 200);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        
        try {
            const { data, error } = await supabase
                .from('partners')
                .update({
                    title: title,
                    description: description,
                    website_url: websiteUrl,
                    image_url: imageUrl,
                })
                .eq('id', initialData.id)
                .select();

            if (error) {
                console.error('Error updating partner:', error);
                alert('Error updating partner: ' + error.message);
            } else {

                if (onUpdate && data && data[0]) {
                    onUpdate(data[0]);
                }
                handleClose();
            }
        } catch (error) {
            console.error('Unexpected error:', error);
            alert('An unexpected error occurred');
        } finally {
            setSaving(false);
        }
    };

    const [saving, setSaving] = useState(false);

    return (
        <div className="modal-content" style={{
            background: "#667558",
            maxWidth: 400,
            margin: "1rem auto",
            padding: "1rem",
            border: "1px solid #ddd",
            borderRadius: 5,
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            fontFamily: "'adventPro', sans-serif",
            position: "relative",
            transform: isVisible ? "scale(1) translateY(0)" : "scale(0.9) translateY(-20px)",
            opacity: isVisible ? 1 : 0,
            transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
            maxHeight: "90vh",
            overflowY: "auto",
        }}>
            <button
                type="button"
                onClick={handleClose}
                disabled={saving}
                style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    background: "transparent",
                    border: "none",
                    cursor: saving ? "not-allowed" : "pointer",
                    padding: 4,
                    lineHeight: 0,
                    color: "#394032",
                    borderRadius: "50%",
                    transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                    e.target.style.background = "rgba(57, 64, 50, 0.2)";
                }}
                onMouseLeave={(e) => {
                    e.target.style.background = "transparent";
                }}
                aria-label="Close"
            >
                <X size={20} />
            </button>
            <h1 style={{ fontFamily: "'adventPro', sans-serif", fontWeight: 800, fontSize: "1.5rem", textAlign: "center", marginBottom: "0.7rem", color: "#1E221A" }}>EDIT PARTNER</h1>
            <form onSubmit={handleSubmit}>
                <label style={{ fontFamily: "'adventPro', sans-serif", fontWeight: 600, color: "#1E221A" }}>
                    Title
                    <input
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                        style={{ width: "100%", marginBottom: 12, color: "#1E221A",fontWeight: 400, fontFamily: "'adventPro', sans-serif" }}
                    />
                </label>
                <label style={{ fontFamily: "'adventPro', sans-serif", fontWeight: 600, color: "#1E221A" }}>
                    Description
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        required
                        rows={4}
                        style={{ 
                            width: "100%", 
                            marginBottom: 12, 
                            color: "#1E221A",
                            fontWeight: 400, 
                            fontFamily: "'adventPro', sans-serif",
                            resize: "vertical",
                            minHeight: "80px"
                        }}
                    />
                </label>
                <label style={{ fontFamily: "'adventPro', sans-serif", fontWeight: 600, color: "#1E221A" }}>
                    Website URL
                    <input
                        type="url"
                        value={websiteUrl}
                        onChange={e => setWebsiteUrl(e.target.value)}
                        style={{ width: "100%", marginBottom: 12, color: "#1E221A",fontWeight: 400, fontFamily: "'adventPro', sans-serif" }}
                    />
                </label>
                <label style={{ fontFamily: "'adventPro', sans-serif", fontWeight: 600, color: "#1E221A" }}>
                    Image URL
                    <input
                        type="url"
                        value={imageUrl}
                        onChange={e => setImageUrl(e.target.value)}
                        style={{ width: "100%", marginBottom: 12, color: "#1E221A",fontWeight: 400, fontFamily: "'adventPro', sans-serif" }}
                    />
                </label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                        type="submit"
                        disabled={saving}
                        style={{
                            flex: 1,
                            padding: "0.75rem",
                            background: "#1E221A",
                            color: "#fff",
                            border: "none",
                            borderRadius: 4,
                            cursor: saving ? "not-allowed" : "pointer",
                            fontFamily: "'adventPro', sans-serif",
                            fontWeight: 600,
                        }}
                    >
                        {saving ? "Saving..." : "Save"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditPartners;