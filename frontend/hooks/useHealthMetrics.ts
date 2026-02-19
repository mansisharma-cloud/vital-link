"use client";

import { useEffect, useState, useRef } from "react";

export interface HealthMetric {
    heart_rate: number;
    glucose: number;
    temperature: number;
    stress_level: number;
    timestamp: number;
    status: string;
}

export function useHealthMetrics() {
    const [metrics, setMetrics] = useState<HealthMetric[]>([]);
    const [currentMetric, setCurrentMetric] = useState<HealthMetric | null>(null);
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        // Determine WebSocket URL
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
        const wsUrl = apiUrl.replace("http", "ws") + "/metrics/stream";

        const socket = new WebSocket(wsUrl);
        socketRef.current = socket;

        socket.onmessage = (event) => {
            const data: HealthMetric = JSON.parse(event.data);
            setCurrentMetric(data);
            setMetrics((prev) => [...prev.slice(-20), data]);
        };

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, []);

    return { metrics, currentMetric };
}
