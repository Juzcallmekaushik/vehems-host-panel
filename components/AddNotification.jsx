import React, { useState, useEffect } from "react";
import { createClient } from "../lib/supabaseClient";
import { X } from "lucide-react";

const AddNotification = ({ onClose, onAdd }) => {
    const supabase = createClient();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 10);
        return () => clearTimeout(timer);
    }, []);

    const [content, setContent] = useState("");
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

        // Validate max 5 words
        const wordCount = (str) => str.trim().split(/\s+/).filter(Boolean).length;
        if (wordCount(content) > 5) {
            alert("Notification Content must be 5 words or less.");
            setSaving(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('notifications')
                .insert([{ notification: content }])
                .select();

            if (error) {
                console.error('Error adding notification:', error);
                alert('Error adding notification: ' + error.message);
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
            <h1 style={{ fontFamily: "'adventPro', sans-serif", fontWeight: 800, fontSize: "1.5rem", textAlign: "center", marginBottom: "0.7rem", color: "#1E221A" }}>ADD NOTIFICATION</h1>
            <form onSubmit={handleSubmit}>
                <label style={{ fontFamily: "'adventPro', sans-serif", marginBottom: 10, fontWeight: 600, color: "#1E221A" }}>
                    Notification Content (max 5 words)
                    <input
                        type="text"
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        required
                        style={{ width: "100%", marginBottom: 18, padding: "0.3rem", border: "1.5px solid #1E221A", borderRadius: "4px", color: "#1E221A", fontWeight: 400, fontFamily: "'adventPro', sans-serif" }}
                        placeholder="Enter up to 5 words"
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

export default AddNotification;
