"use client"

import { useEffect, useRef, useState } from "react"
import type { Map as LeafletMap, Marker } from 'leaflet'; // Marker type needed again
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS statically
import { Badge } from "@/components/ui/badge"
// Keep UI components like Button, DropdownMenu etc. if needed for controls
// import { Button } from "@/components/ui/button"
// import { Layers, ZoomIn, ZoomOut } from "lucide-react"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Define types for the disaster data structure
interface SupplyData {
    food: number;
    water: number;
    medicine: number;
    shelter: number;
}

interface DisasterInfo {
    title: string;
    severity: string;
    supplies: SupplyData;
}

interface CountryDisasters {
    total_disasters: number;
    disasters: {
        [key: string]: DisasterInfo; // Key is disaster type (e.g., "hurricane")
    };
}

interface DisasterReport {
    timestamp: string;
    buffer_percentage: number;
    total_disasters: number;
    countries: {
        [key: string]: CountryDisasters; // Key is country name
    };
}

// Rate limit delay for Nominatim API (milliseconds)
const NOMINATIM_DELAY = 1100; // Slightly over 1 second

export function DisasterMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  // Ref to track markers added *during the current update cycle* for cleanup
  const currentAddedMarkersRef = useRef<Marker[]>([]);
  const [disasterData, setDisasterData] = useState<DisasterReport | null>(null);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isMarkersLoading, setIsMarkersLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const LRef = useRef<typeof import('leaflet') | null>(null); // Ref to store Leaflet library

  // Effect 1: Fetch disaster data
  useEffect(() => {
    const fetchData = async () => {
      setIsDataLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/disasters');
        if (!response.ok) {
          let errorMsg = `HTTP error! status: ${response.status}`;
          try {
            const errorBody = await response.json();
            errorMsg = errorBody.message || errorMsg;
          } catch (e) { /* Ignore */ }
          throw new Error(errorMsg);
        }
        const data: DisasterReport = await response.json();
        setDisasterData(data);
      } catch (err: any) {
        console.error("Failed to fetch disaster data:", err);
        setError(err.message || "Failed to load disaster data.");
        setDisasterData(null);
      } finally {
        setIsDataLoading(false);
      }
    };
    fetchData();
  }, []); // Runs once on mount

  // Effect 2: Initialize Map Instance (runs once)
  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current || mapInstanceRef.current) {
      return; // Don't run on server, if container not ready, or map already exists
    }

    let map: LeafletMap;
    const initializeMap = async () => {
        setIsMapLoading(true);
        try {
            const L = await import('leaflet');
            LRef.current = L; // Store Leaflet instance

            // Check again if map exists or container is gone after await
             if (!mapContainerRef.current || mapInstanceRef.current) return;

            map = L.map(mapContainerRef.current).setView([20, 0], 2);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            mapInstanceRef.current = map; // Store map instance
            setError(null);
        } catch (mapError) {
            console.error("Failed to initialize map:", mapError);
            setError("Failed to load map.");
            mapInstanceRef.current = null;
            if (map!) map.remove(); // Clean up if map creation started but failed
        } finally {
             setIsMapLoading(false);
        }
    };

    initializeMap();

    // Cleanup function for this effect: remove map instance
    return () => {
        mapInstanceRef.current?.remove();
        mapInstanceRef.current = null;
        LRef.current = null;
        console.log("Map instance cleaned up");
    };
  }, []); // Runs only once on mount

  // Effect 3: Add/Update Markers when data or map instance changes
  useEffect(() => {
    // Ensure Leaflet and Map are ready first
    if (!mapInstanceRef.current || !LRef.current) {
      setIsMarkersLoading(false);
      return;
    }
    // Handle case where data is not ready or becomes null
    if (!disasterData) {
      if (mapInstanceRef.current && currentAddedMarkersRef.current.length > 0) {
        console.log("Data cleared, removing existing markers.")
        currentAddedMarkersRef.current.forEach(marker => mapInstanceRef.current!.removeLayer(marker));
        currentAddedMarkersRef.current = [];
      }
      setIsMarkersLoading(false);
      return;
    }

    // If we reach here, Map and Data are ready, proceed with marker updates
    const L = LRef.current;
    const map = mapInstanceRef.current;
    let isMounted = true;

    const updateMarkers = async () => {
      console.log("Starting marker update process...");

      // Clear markers added in the *previous* run of this effect
      if (currentAddedMarkersRef.current.length > 0) {
        console.log(`Clearing ${currentAddedMarkersRef.current.length} markers from previous run.`);
        currentAddedMarkersRef.current.forEach(marker => map.removeLayer(marker));
        // Important: DO NOT reset ref here, let the successful completion or cleanup handle it
      }
      const markersForThisRun: Marker[] = []; // Local array for this run's markers

      try {
        if (disasterData.countries) {
          const countries = Object.entries(disasterData.countries);
          console.log(`Processing ${countries.length} countries.`);

          for (const [countryName, countryData] of countries) {
            if (!isMounted) return; // Exit if component unmounted mid-loop

            const customIcon = L.divIcon({
                 html: `
                    <div style="width: 24px; height: 24px; display: flex; justify-content: center; align-items: center;">
                        <span style="background-color: #dc2626; width: 12px; height: 12px; display: block; border-radius: 50%; border: 1px solid #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.4);"></span>
                    </div>
                `,
                className: 'custom-map-marker-container',
                iconSize: [24, 24],
                iconAnchor: [12, 12]
            });

            await new Promise(resolve => setTimeout(resolve, NOMINATIM_DELAY));
            if (!isMounted) return;

            try {
              const geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(countryName)}&limit=1`);
              if (!isMounted) return;

              if (!geoResponse.ok) {
                console.warn(`Geocoding failed for ${countryName}: HTTP ${geoResponse.status}`);
                continue;
              }
              const geoResult = await geoResponse.json();

              if (geoResult && geoResult.length > 0) {
                const { lat, lon } = geoResult[0];
                const disasterTypes = Object.keys((countryData as any)?.disasters || {}).join(', ');
                const marker = L.marker([parseFloat(lat), parseFloat(lon)], { icon: customIcon });
                marker.bindPopup(`<b>${countryName}</b><br/>Disasters: ${disasterTypes}<br/>Total: ${(countryData as any)?.total_disasters || 'N/A'}`);

                // Add directly to map IF component is still mounted
                 if (isMounted && mapInstanceRef.current) {
                    marker.addTo(map);
                    markersForThisRun.push(marker); // Track locally
                    console.log(`Marker added for ${countryName}`);
                 }
              } else {
                console.warn(`No geocoding results found for ${countryName}`);
              }
            } catch (geoError) {
              console.error(`Error geocoding ${countryName}:`, geoError);
            }
          }
          console.log("Finished processing all countries.");
        }
        // If loop completed successfully, update the main ref
         if (isMounted) {
            currentAddedMarkersRef.current = markersForThisRun;
            console.log(`Updated main marker ref with ${markersForThisRun.length} markers.`);
         }
      } catch (error) {
        console.error("Error during marker update process:", error);
        setError("Error updating disaster locations.");
        // Clean up markers added during this failed run
        if (map) {
            markersForThisRun.forEach(m => map.removeLayer(m));
        }
        currentAddedMarkersRef.current = []; // Reset ref on error
      } finally {
        if (isMounted) {
          setIsMarkersLoading(false);
          console.log("Marker loading state set to false.");
        }
      }
    };

    setIsMarkersLoading(true);
    console.log("Marker loading state set to true.");
    updateMarkers();

    // Effect cleanup function
    return () => {
      isMounted = false;
      console.log("Cleanup for marker effect: Component unmounted or dependencies changed.");
      // Clean up markers referenced by the main ref when effect tears down
      if (mapInstanceRef.current && currentAddedMarkersRef.current.length > 0) {
         console.log(`Cleaning up ${currentAddedMarkersRef.current.length} markers.`);
         currentAddedMarkersRef.current.forEach(marker => mapInstanceRef.current!.removeLayer(marker));
         currentAddedMarkersRef.current = [];
      }
    };
  // Dependencies: Map instance readiness and the data itself
  }, [disasterData, mapInstanceRef.current]); 

  // Combined loading state
  const isLoading = isMapLoading || isDataLoading || isMarkersLoading;

  return (
    <div className="relative h-[400px] w-full md:h-[500px] lg:h-[600px]">
      {isLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/80">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <span className="ml-2 text-sm text-muted-foreground">
            {isMapLoading ? 'Loading Map...' : isDataLoading ? 'Loading Data...' : 'Adding Locations...'}
          </span>
        </div>
      )}
      {error && !isLoading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-destructive/20 p-4 text-center text-destructive-foreground">
              <p>{error}</p>
          </div>
      )}
      <div ref={mapContainerRef} className="h-full w-full z-10 bg-gray-200 dark:bg-gray-800" />
    </div>
  );
}

