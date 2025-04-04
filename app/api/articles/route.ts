import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { parse } from 'csv-parse/sync'; // Use sync version for simplicity in API route

// This forces the route handler to be dynamic, ensuring it reads the file on each request.
export const dynamic = 'force-dynamic';

interface Article {
    title: string;
    description?: string;
    full_text?: string;
    url?: string;
    published_at?: string;
    // Add other fields if needed
}

export async function GET() {
    const filePath = path.join(process.cwd(), 'mlService', 'raw_disaster_articles.csv');
    console.log(`Attempting to read articles from: ${filePath}`);

    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        
        // Parse the CSV data
        // columns: true - uses the first line as headers
        // skip_empty_lines: true - ignores empty lines
        const records: Article[] = parse(fileContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
        });

        // Optionally limit the number of articles returned
        const limitedRecords = records.slice(0, 20); // Return latest 20 articles, for example

        console.log(`Successfully parsed ${records.length} articles, returning ${limitedRecords.length}.`);
        return NextResponse.json(limitedRecords);

    } catch (error: any) {
        console.error("API Error reading or parsing articles CSV:", error);

        if (error.code === 'ENOENT') {
            return NextResponse.json({ message: 'Articles file not found.' }, { status: 404 });
        } else {
            // Catch parsing errors or other file system errors
            return NextResponse.json({ message: 'Error processing articles file.' }, { status: 500 });
        }
    }
} 