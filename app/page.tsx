// Keep necessary imports for data fetching and the client component
import { AlertTriangle } from "lucide-react";
import fs from 'fs/promises';
import path from 'path';
import { HomeClient } from "@/components/home-client";

// Define the structure expected by the HomeClient component
export interface DisasterInfo {
  type: string;
  location: string;
  severity: number; // Numeric severity (e.g., 90, 60, 30)
  title: string; // Add title for news headlines
}

// Define interfaces matching the NEW JSON structure
interface Supplies {
  food: number;
  water: number;
  medicine: number;
  shelter: number;
}

interface DisasterDetail {
  title: string;
  severity: string; // String severity like 'high'
  supplies: Supplies;
}

interface CountryData {
  total_disasters: number;
  disasters: {
    [disasterType: string]: DisasterDetail;
  };
}

interface NewDisasterReport {
  timestamp: string;
  buffer_percentage: number;
  total_disasters: number; // Overall total
  countries: {
    [countryName: string]: CountryData;
  };
}

// Updated data fetching function to parse the NEW JSON format
async function getDisasterData(): Promise<{ count: number; disasters: DisasterInfo[] }> {
  const defaultData = { count: 0, disasters: [] };
  try {
    const filePath = path.join(process.cwd(), 'mlService', 'disaster_allocations_report.json');
    console.log(`Attempting to read disaster report from: ${filePath}`);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const report: NewDisasterReport = JSON.parse(fileContent);

    const overallDisasterCount = report.total_disasters || 0;
    const countriesData = report.countries || {};
    const processedDisasters: DisasterInfo[] = [];

    // Map string severity to numeric value
    const severityMap: { [key: string]: number } = {
      'high': 90,
      'medium': 60,
      'low': 30,
      'unknown': 0
    };

    // Iterate through countries and their disasters
    for (const countryName in countriesData) {
      const countryInfo = countriesData[countryName];
      const disastersInCountry = countryInfo.disasters || {};
      
      for (const disasterType in disastersInCountry) {
        const disasterDetails = disastersInCountry[disasterType];
        const severityString = disasterDetails.severity?.toLowerCase() || 'unknown';
        const severityValue = severityMap[severityString] || 0;
        const disasterTitle = disasterDetails.title || `${disasterType} event in ${countryName}`; // Use title or generate default

        processedDisasters.push({
          type: disasterType, // e.g., 'hurricane'
          location: countryName, // e.g., 'BI'
          severity: severityValue, // Numeric value (90, 60, 30, 0)
          title: disasterTitle, // Add the title
        });
      }
    }

    const actualProcessedCount = processedDisasters.length; // Calculate count from processed items
    console.log(`Successfully processed report. Overall Count from JSON: ${overallDisasterCount}, Actual Processed Count: ${actualProcessedCount}, Processed Disasters:`, processedDisasters);
    
    // Return the count of *actually processed* disasters and the list
    return { count: actualProcessedCount, disasters: processedDisasters };

  } catch (error: any) { 
    console.error("Error reading or processing disaster report:", error);
    if (error?.code === 'ENOENT') {
      console.warn("Disaster report file not found. Returning default data.");
    } else {
      console.error("An unexpected error occurred while processing the disaster report.");
    }
    return defaultData;
  }
}

// Define the structure of the props for the page component
interface HomePageProps {}

// The main Page component remains a Server Component
export default async function Page(props: HomePageProps) {
  const { count, disasters } = await getDisasterData();

  return (
    <HomeClient 
      numberOfDisasters={count} 
      disasters={disasters} 
    />
  );
}

