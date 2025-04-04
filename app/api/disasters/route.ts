import { NextResponse } from 'next/server';
import fs from 'fs/promises'; // Use promises version of fs
import path from 'path';

// This forces the route handler to be dynamic, ensuring it reads the file on each request.
export const dynamic = 'force-dynamic';

export async function GET() {
    // Construct the absolute path to the JSON file
    // process.cwd() gives the root directory of the Next.js project
    const filePath = path.join(process.cwd(), 'mlService', 'disaster_allocations_report.json');

    try {
        // Read the file content
        const fileContent = await fs.readFile(filePath, 'utf-8');
        
        // Parse the JSON data
        const jsonData = JSON.parse(fileContent);

        // Return the data as a JSON response
        return NextResponse.json(jsonData);

    } catch (error: any) {
        // Handle errors, like file not found or invalid JSON
        console.error("API Error fetching disaster data:", error);

        if (error.code === 'ENOENT') {
            return NextResponse.json({ message: 'Disaster data file not found.' }, { status: 404 });
        } else if (error instanceof SyntaxError) {
            return NextResponse.json({ message: 'Error parsing disaster data file.' }, { status: 500 });
        } else {
            return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
        }
    }
} 