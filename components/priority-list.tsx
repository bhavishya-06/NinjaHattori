"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, MapPin } from "lucide-react"

// --- Reusing types similar to DisasterMap / API Response --- //
interface SupplyData {
    food: number;
    water: number;
    medicine: number;
    shelter: number;
}

interface DisasterDetails {
    title: string;
    severity: string; // Severity is a string (e.g., "high", "low")
    supplies: SupplyData;
}

interface CountryDisasters {
    total_disasters: number;
    disasters: {
        [key: string]: DisasterDetails; // Key is disaster type
    };
}

interface DisasterReport {
    timestamp?: string; // Make timestamp optional as it might not be strictly needed here
    buffer_percentage?: number;
    total_disasters?: number; // Make summary fields optional
    countries: {
        [key: string]: CountryDisasters; // Key is country name
    };
}

// Type for the processed list item
interface ProcessedDisaster {
    id: string; // Unique ID for mapping (e.g., country-disasterType)
    country: string;
    type: string; // e.g., "hurricane", "earthquake"
    title: string;
    severity: string;
}
// --- End of Types --- //


// Helper to map string severity to category, base classes, and dot color (Refined UI v3 - No Border)
const getSeverityInfo = (severity: string): { category: string; classes: string; dotColor: string } => {
  const lowerSeverity = severity.toLowerCase();
  if (lowerSeverity === "critical" || lowerSeverity === "high") return {
      category: "High",
      classes: "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300",
      dotColor: "bg-red-500"
  };
  if (lowerSeverity === "severe" || lowerSeverity === "medium") return {
      category: "Medium",
      classes: "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300",
      dotColor: "bg-yellow-500"
  };
  if (lowerSeverity === "moderate" || lowerSeverity === "low") return {
      category: "Low",
      classes: "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300",
      dotColor: "bg-green-500"
  };
  return {
      category: "Unknown", // Default/fallback
      classes: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
      dotColor: "bg-gray-400"
  };
};

// Mapping of disaster types to icons (optional - keep or adjust)
const disasterIconMap: { [key: string]: React.ReactNode } = {
  flood: <AlertTriangle className="h-4 w-4 text-blue-500" />,
  hurricane: <AlertTriangle className="h-4 w-4 text-indigo-500" />,
  wildfire: <AlertTriangle className="h-4 w-4 text-orange-500" />, // Added wildfire
  earthquake: <AlertTriangle className="h-4 w-4 text-orange-600" />,
  // Add other types from your JSON if needed
  default: <AlertTriangle className="h-4 w-4 text-gray-500" />,
}

export function PriorityList() {
  const [disasters, setDisasters] = useState<ProcessedDisaster[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch from the API route
        const response = await fetch('/api/disasters');
        if (!response.ok) {
          // Read error message from API response if available
          let errorMsg = `HTTP error! status: ${response.status}`;
          try {
            const errorBody = await response.json();
            errorMsg = errorBody.message || errorMsg;
          } catch (e) { /* Ignore if response body isn't JSON */ }
          throw new Error(errorMsg);
        }
        const data: DisasterReport = await response.json();

        // Process the data into a flat list
        const processedList: ProcessedDisaster[] = [];
        if (data.countries) {
          Object.entries(data.countries).forEach(([countryName, countryData]) => {
            // Check if countryData and countryData.disasters exist
            if (countryData && countryData.disasters) {
              Object.entries(countryData.disasters).forEach(([disasterType, disasterDetails]) => {
                // Check if disasterDetails exists
                if (disasterDetails) {
                    processedList.push({
                      id: `${countryName}-${disasterType}`,
                      country: countryName,
                      type: disasterType,
                      title: disasterDetails.title || '', // Ensure title is a string
                      severity: disasterDetails.severity || 'unknown', // Provide default severity
                    });
                }
              });
            }
          });
        }

        // Sort disasters by severity (High > Medium > Low)
        processedList.sort((a, b) => {
            const severityOrder = { high: 3, medium: 2, low: 1 };
            const severityA = severityOrder[a.severity.toLowerCase() as keyof typeof severityOrder] || 0;
            const severityB = severityOrder[b.severity.toLowerCase() as keyof typeof severityOrder] || 0;
            return severityB - severityA; // Descending order
        });

        setDisasters(processedList);
      } catch (err: any) {
        console.error("PriorityList Error fetching/processing disaster data:", err);
        setError(err.message || "Failed to load disaster list.");
        setDisasters([]); // Clear list on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Runs once on mount

  if (isLoading) {
    return (
      <div className="flex h-[300px] items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
      return (
          <div className="flex h-[300px] items-center justify-center text-sm text-destructive bg-destructive/10 rounded-lg border border-destructive/30 p-4">
              {error}
          </div>
      );
  }

  if (disasters.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground bg-gray-50/50 rounded-lg border border-gray-100">
        No active disasters reported.
      </div>
    )
  }

  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-1.5 pr-4">
        {disasters.map((disaster) => {
          const normalizedType = disaster.type.toLowerCase();
          const icon = disasterIconMap[normalizedType] || disasterIconMap.default;
          const severityInfo = getSeverityInfo(disaster.severity);

          return (
            <div
              key={disaster.id}
              className="group relative p-2 rounded-lg border border-gray-100 bg-white hover:bg-gray-50/80 transition-colors duration-200 hover:shadow-sm dark:bg-gray-900 dark:border-gray-800 dark:hover:bg-gray-800/80"
            >
              {/* Top row: Icon, Title (Type), Severity Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="p-1 rounded-md bg-gray-50 group-hover:bg-gray-100 transition-colors duration-200 dark:bg-gray-800 dark:group-hover:bg-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">{icon}</span>
                  </div>
                  <span className="font-medium capitalize text-gray-900 dark:text-gray-100 text-sm truncate" title={disaster.type}>
                    {disaster.type}
                  </span>
                </div>
                <Badge
                  className={`inline-flex items-center px-3 py-0.5 text-xs font-semibold rounded-full flex-shrink-0 ${severityInfo.classes}`}
                >
                  <span className={`inline-block w-2 h-2 mr-1.5 rounded-full ${severityInfo.dotColor}`}></span>
                  {severityInfo.category}
                </Badge>
              </div>
              {/* Bottom row: Location (Country) */}
              <div className="flex items-center gap-1 mt-1 pl-8 text-xs text-gray-500 dark:text-gray-400">
                 <MapPin className="w-3 h-3 flex-shrink-0" />
                 <span className="truncate" title={disaster.country}>{disaster.country}</span>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  )
}

