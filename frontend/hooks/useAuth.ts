"use client";

import { useEffect, useState, useCallback } from "react";

export interface User {
    id: number;
    email: string;
    full_name: string;
    role: string;
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

    const checkAuth = useCallback(async () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const res = await fetch(`${baseUrl}/users/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data: User = await res.json();
                    setUser(data);
                } else {
                    localStorage.removeItem("token");
                    setUser(null);
                }
            } catch (e) {
                console.error("Auth check failed", e);
            }
        }
        setLoading(false);
    }, [baseUrl]);

    useEffect(() => {
        const init = async () => {
            await checkAuth();
        };
        init();
    }, [checkAuth]);

    const login = async (email: string, password: string) => {
        const formData = new URLSearchParams();
        formData.append("username", email);
        formData.append("password", password);

        try {
            const res = await fetch(`${baseUrl}/auth/login`, {
                method: "POST",
                body: formData,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.detail || "Login failed");
            }

            const data = await res.json();
            localStorage.setItem("token", data.access_token);
            await checkAuth();
        } catch (error: unknown) {
            console.error("Login hook error:", error);
            throw error instanceof Error ? error : new Error(String(error));
        }
    };

    const signup = async (email: string, password: string, fullName: string) => {
        try {
            const res = await fetch(`${baseUrl}/auth/signup`, {
                method: "POST",
                body: JSON.stringify({ email, password, full_name: fullName, role: "user" }),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.detail || "Signup failed");
            }

            // Automatically login after signup
            await login(email, password);
        } catch (error: unknown) {
            console.error("Signup hook error:", error);
            throw error instanceof Error ? error : new Error(String(error));
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return { user, loading, login, signup, logout };
}
