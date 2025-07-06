import React, { useState, useEffect } from "react";
import { createClient } from "../lib/supabaseClient";
import { X } from "lucide-react";

const AddPartner = ({ onClose, onAdd }) => {
    const supabase = createClient();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 10);
        return () => clearTimeout(timer);
    }, []);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [websiteUrl, setWebsiteUrl] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [saving, setSaving] = useState(false);

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
                .insert([{
                    title: title,
                    description: description,
                    website_url: websiteUrl,
                    image_url: imageUrl,
                }])
                .select();

            if (!error && data && data[0]) {
                const level = "partners";
                const { error: notifError } = await supabase
                    .from('notifications')
                    .insert([{
                        notification: `NEW PARTNER - ${title} !! Check out Partners for more info.`,
                    }]);
                if (notifError) {
                    console.error('Error adding notification:', notifError);
                }
            }

            if (error) {
                console.error('Error adding partner:', error);
                alert('Error adding partner: ' + error.message);
            } else {
                if (onAdd && data && data[0]) {
                    onAdd(data[0]);
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

    return (
        <div className="modal-content" style={{
            background: "#667558",
            maxWidth: 400,
            margin: "0.6rem auto",
            padding: "1rem",
            border: "1px solid #ddd",
            borderRadius: 5,
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            fontFamily: "'adventPro', sans-serif",
            position: "relative",
            transform: isVisible ? "scale(1) translateY(0)" : "scale(0.9) translateY(-20px)",
            opacity: isVisible ? 1 : 0,
            transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
            maxHeight: "92vh",
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
            <h1 style={{ fontFamily: "'adventPro', sans-serif", fontWeight: 800, fontSize: "1.5rem", textAlign: "center", marginBottom: "0.7rem", color: "#1E221A" }}>ADD PARTNER</h1>
            <form onSubmit={handleSubmit}>
                <label style={{ fontFamily: "'adventPro', sans-serif", fontWeight: 600, color: "#1E221A" }}>
                    Partner
                    <input
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                        style={{ width: "100%", marginBottom: 12, padding: "0.3rem", border: "1.5px solid #1E221A", borderRadius: "4px", color: "#1E221A", fontWeight: 400, fontFamily: "'adventPro', sans-serif" }}
                    />
                </label>
                <label style={{ fontFamily: "'adventPro', sans-serif", fontWeight: 600, color: "#1E221A" }}>
                    Description
                    <textarea
                        value={description}
                        onChange={e => {
                            if (e.target.value.length <= 590) {
                                setDescription(e.target.value);
                            }
                        }}
                        required
                        rows={4}
                        maxLength={590}
                        style={{
                            width: "100%",
                            marginBottom: 3,
                            color: "#1E221A",
                            fontWeight: 400,
                            fontFamily: "'adventPro', sans-serif",
                            resize: "vertical",
                            minHeight: "80px",
                            padding: "0.3rem", 
                            border: "1.5px solid #1E221A", 
                            borderRadius: "4px"
                        }}
                    />
                    <div style={{ marginTop: "-0.4rem", fontSize: "0.75rem", color: "#394032", textAlign: "right" }}>
                        {description.length}/590
                    </div>
                </label>
                <label style={{ fontFamily: "'adventPro', sans-serif", fontWeight: 600, color: "#1E221A" }}>
                    Website URL
                    <input
                        type="url"
                        value={websiteUrl}
                        onChange={e => setWebsiteUrl(e.target.value)}
                        style={{ width: "100%", marginBottom: 12, padding: "0.3rem", border: "1.5px solid #1E221A", borderRadius: "4px", color: "#1E221A", fontWeight: 400, fontFamily: "'adventPro', sans-serif" }}
                    />
                </label>
                <label style={{ fontFamily: "'adventPro', sans-serif", marginTop: "-0.5rem", fontWeight: 600, color: "#1E221A" }}>
                    Cover URL
                    <input
                        type="url"
                        value={imageUrl}
                        onChange={e => setImageUrl(e.target.value)}
                        style={{ width: "100%",marginBottom: 12, padding: "0.3rem", border: "1.5px solid #1E221A", borderRadius: "4px", color: "#1E221A", fontWeight: 400, fontFamily: "'adventPro', sans-serif" }}
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
                        {saving ? "Submitting..." : "Submit"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddPartner;
