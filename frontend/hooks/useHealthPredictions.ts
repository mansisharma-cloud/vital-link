"use client";

import { useState, useEffect, useCallback } from "react";
import { HealthMetric } from "./useHealthMetrics";

export interface HealthRisk {
    condition: string;
    risk_level: string;
    score: number;
}

export interface HealthPrediction {
    overall_status: string;
    predictions: HealthRisk[];
}

export function useHealthPredictions(currentMetric: HealthMetric | null) {
    const [prediction, setPrediction] = useState<HealthPrediction | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchPrediction = useCallback(async () => {
        if (!currentMetric) return;
        setLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
            const response = await fetch(`${apiUrl}/predictions/analyze`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ metrics: currentMetric }),
            });

            if (response.ok) {
                const data = await response.json();
                setPrediction(data);
            }
        } catch (error) {
            console.error("Failed to fetch health prediction:", error);
        } finally {
            setLoading(false);
        }
    }, [currentMetric]);

    useEffect(() => {
        if (!currentMetric) return;

        // Fetch prediction every 10 seconds
        const interval = setInterval(fetchPrediction, 10000);

        // Initial fetch
        fetchPrediction();

        return () => clearInterval(interval);
    }, [fetchPrediction, currentMetric]);

    return { prediction, loading };
}
