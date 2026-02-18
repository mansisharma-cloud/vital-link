"use client";

import { useEffect, useState, useRef } from "react";

export function useHealthMetrics() {
    const [metrics, setMetrics] = useState<any[]>([]);
    const [currentMetric, setCurrentMetric] = useState<any>(null);
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        // Determine WebSocket URL
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
        const wsUrl = apiUrl.replace("http", "ws") + "/metrics/stream";

        const socket = new WebSocket(wsUrl);
        socketRef.current = socket;

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
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
