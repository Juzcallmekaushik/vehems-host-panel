import React, { useState } from "react";
import { createClient } from "../lib/supabaseClient";
import { X } from "lucide-react";

const AddNotes = ({ onClose }) => {
    const supabase = createClient();
    const [isVisible, setIsVisible] = useState(false);

    const [title, setTitle] = useState("");
    const [level, setLevel] = useState("");
    const [fileUrl, setFileUrl] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [readTime, setReadTime] = useState("");
    const [saving, setSaving] = useState(false);

    React.useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 10);
        return () => clearTimeout(timer);
    }, []);

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
            const { error } = await supabase
                .from('notes')
                .insert([{
                    title: title,
                    level: level,
                    file_url: fileUrl,
                    image_url: imageUrl,
                    read_time: readTime,
                }])
                .select();

            const { error: notifError } = await supabase
                .from('notifications')
                .insert([{
                    type: 'note_added',
                    message: `NEW! "${title}" has been uploaded !! check it out in ${level.toUpperCase()}`,
                    created_at: new Date().toISOString(),
                }]);

            if (error) {
                console.error('Error adding note:', error);
                alert('Error adding note: ' + error.message);
            } else if (notifError) {
                console.error('Error adding notification:', notifError);
                alert('Note added, but failed to add notification: ' + notifError.message);
                handleClose();
            } else {
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
            <h1 style={{ fontFamily: "'adventPro', sans-serif", fontWeight: 800, fontSize: "1.5rem", textAlign: "center", marginBottom: "0.7rem", color: "#1E221A" }}>ADD NOTES</h1>
            <form onSubmit={handleSubmit}>
                <label style={{ fontFamily: "'adventPro', sans-serif", fontWeight: 600, color: "#1E221A" }}>
                    Title
                    <input
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                        style={{ width: "100%", marginBottom: 12, padding: "0.3rem", border: "1.5px solid #1E221A", borderRadius: "4px", color: "#1E221A", fontWeight: 400, fontFamily: "'adventPro', sans-serif" }}
                    />
                </label>
                <label style={{ fontFamily: "'adventPro', sans-serif", fontWeight: 600, color: "#1E221A" }}>
                    Level
                    <select
                        value={level}
                        onChange={e => setLevel(e.target.value)}
                        required
                        style={{ width: "100%", marginBottom: 12, padding: "0.3rem", border: "1.5px solid #1E221A", borderRadius: "4px", color: "#1E221A", fontWeight: 400, fontFamily: "'adventPro', sans-serif" }}
                    >
                        <option value="" disabled>Select level</option>
                        <option value="cie igcse">CIE IGCSE</option>
                        <option value="cie aslevel">CIE ASLEVEL</option>
                        <option value="cie alevel">CIE ALEVEL</option>
                    </select>
                </label>
                <label style={{ fontFamily: "'adventPro', sans-serif", fontWeight: 600, color: "#1E221A" }}>
                    File URL
                    <input
                        type="url"
                        value={fileUrl}
                        onChange={e => setFileUrl(e.target.value)}
                        style={{ width: "100%", marginBottom: 12, padding: "0.3rem", border: "1.5px solid #1E221A", borderRadius: "4px", color: "#1E221A", fontWeight: 400, fontFamily: "'adventPro', sans-serif" }}
                    />
                </label>
                <label style={{ fontFamily: "'adventPro', sans-serif", fontWeight: 600, color: "#1E221A" }}>
                    Cover URL
                    <input
                        type="url"
                        value={imageUrl}
                        onChange={e => setImageUrl(e.target.value)}
                        style={{ width: "100%", marginBottom: 12, padding: "0.3rem", border: "1.5px solid #1E221A", borderRadius: "4px", color: "#1E221A", fontWeight: 400, fontFamily: "'adventPro', sans-serif" }}
                    />
                </label>
                <label style={{ fontFamily: "'adventPro', sans-serif", fontWeight: 600, color: "#1E221A" }}>
                    Read Time (minutes)
                    <input
                        type="text"
                        min="1"
                        value={readTime}
                        onChange={e => setReadTime(e.target.value)}
                        style={{ width: "100%", marginBottom: 18, padding: "0.3rem", border: "1.5px solid #1E221A", borderRadius: "4px", color: "#1E221A", fontWeight: 400, fontFamily: "'adventPro', sans-serif" }}
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

export default AddNotes;
