"use client";

import { useEffect, useState } from "react";

export function useAuth() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
                    const res = await fetch(`${baseUrl}/users/me`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setUser(data);
                    }
                } catch (e) {
                    console.error("Auth check failed", e);
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    return { user, loading };
}
