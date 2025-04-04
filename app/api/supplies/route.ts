import { NextResponse } from "next/server"
import connect from "@/dbConfig/dbConfig"
import Supplies from "@/models/suppliesModel"

connect()

// This would connect to a database in a real application
// For now, we'll create a simple API route that returns mock data

// Define the supply item interface
interface Supply {
  _id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  location: string;
  expirationDate: string | null;
  lastUpdated?: string;
}

// GET /api/supplies
export async function GET() {
  try {
    const supplies = await Supplies.find({}).sort({ lastUpdated: -1 })
    return NextResponse.json({ supplies })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/supplies
export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Create new supply document
    const newSupply = new Supplies({
      name: data.name,
      category: data.category,
      quantity: data.quantity,
      unit: data.unit,
      location: data.location,
      expirationDate: data.expirationDate ? new Date(data.expirationDate) : undefined,
      lastUpdated: new Date()
    })

    // Save to database
    const savedSupply = await newSupply.save()

    return NextResponse.json({
      success: true,
      message: "Supply added successfully",
      data: savedSupply
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

