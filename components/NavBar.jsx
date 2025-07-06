"use client";
import React from "react";
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

const navBarStyle = {
    backgroundColor: "#667558",
    padding: "10px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "35px",
};

const titleStyle = {
    fontFamily: "blatantBold, sans-serif",
    color: "#1E221A",
    fontSize: "1.4rem",
    letterSpacing: "1px",
    margin: 0,
};

const iconStyle = {
    color: "#1E221A",
    fontSize: "1.5rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
    padding: "4px",
    borderRadius: "4px",
};

export default function NavBar() {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('hostSession');
        router.push('/');
    };

    return (
        <nav style={navBarStyle}>
            <h1 style={titleStyle}>HOST DASHBOARD</h1>
            <span 
                style={iconStyle} 
                onClick={handleLogout}
                title="Logout"
            >
                <LogOut size={18} color="#1E221A" />
            </span>
        </nav>
    );
}