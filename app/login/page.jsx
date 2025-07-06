"use client";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('hostSession', data.sessionToken);
                router.push('/home');
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#272D22",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <form
                onSubmit={handleSubmit}
                style={{
                    background: "#394232",
                    padding: "2rem",
                    borderRadius: "7px",
                    minWidth: "300px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.2rem",
                    boxShadow: "0 2px 16px rgba(0,0,0,0.15)",
                    alignItems: "center",
                }}
            >
                <h1
                    style={{
                        fontFamily: "adventPro, sans-serif",
                        color: "#AFC699",
                        fontSize: "1.5rem",
                        fontWeight: "800",
                        textAlign: "center",
                    }}
                >
                    LOGIN
                </h1>
                {error && (
                    <div
                        style={{
                            color: "#ff6b6b",
                            fontSize: "0.875rem",
                            textAlign: "center",
                            fontFamily: "adventPro, sans-serif",
                            fontWeight: "600",
                        }}
                    >
                        {error}
                    </div>
                )}
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                    style={{
                        background: "none",
                        fontFamily: "adventPro, sans-serif",
                        fontWeight: "600",
                        letterSpacing: "0.05em",
                        border: "1px solid #AFC699",
                        borderRadius: "5px",
                        padding: "0.75rem",
                        color: "#AFC699",
                        fontSize: "1rem",
                        outline: "none",
                        width: "100%",
                        maxWidth: "250px",
                        opacity: isLoading ? 0.7 : 1,
                    }}
                />
                <div style={{ position: "relative", width: "100%", maxWidth: "250px" }}>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        style={{
                            background: "none",
                            border: "1px solid #AFC699",
                            fontFamily: "adventPro, sans-serif",
                            fontWeight: "600",
                            letterSpacing: "0.05em",
                            borderRadius: "5px",
                            padding: "0.75rem",
                            color: "#AFC699",
                            fontSize: "1rem",
                            outline: "none",
                            width: "100%",
                            maxWidth: "250px",
                            paddingRight: "2.5rem",
                            opacity: isLoading ? 0.7 : 1,
                        }}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        disabled={isLoading}
                        style={{
                            position: "absolute",
                            right: "0.75rem",
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "none",
                            border: "none",
                            padding: 0,
                            cursor: "pointer",
                            color: "#AFC699",
                        }}
                        tabIndex={-1}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                <button
                    type="submit"
                    disabled={isLoading || !username || !password}
                    style={{
                        background: isLoading || !username || !password ? "#6b7660" : "#AFC699",
                        color: "#394232",
                        border: "none",
                        borderRadius: "5px",
                        padding: "0.75rem",
                        fontWeight: "bold",
                        fontSize: "1rem",
                        cursor: isLoading || !username || !password ? "not-allowed" : "pointer",
                        transition: "background 0.2s",
                        width: "100%",
                        maxWidth: "250px",
                        fontFamily: "adventPro, sans-serif",
                    }}
                >
                    {isLoading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
}