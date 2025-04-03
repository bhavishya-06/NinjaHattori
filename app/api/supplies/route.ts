import { NextResponse } from "next/server"

// This would connect to a database in a real application
// For now, we'll create a simple API route that returns mock data

export async function GET() {
  // Simulate database query delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Mock supply data
  const supplies = [
    {
      id: "water-001",
      name: "Bottled Water",
      category: "Water",
      quantity: 5000,
      unit: "bottles",
      distributed: 2500,
      locations: [
        { id: "loc-1", name: "Central Warehouse", quantity: 2000 },
        { id: "loc-2", name: "North Distribution Center", quantity: 500 },
      ],
      lastUpdated: "2023-04-03T11:30:00Z",
    },
    {
      id: "food-001",
      name: "MRE Packages",
      category: "Food",
      quantity: 3000,
      unit: "packages",
      distributed: 1800,
      locations: [
        { id: "loc-1", name: "Central Warehouse", quantity: 800 },
        { id: "loc-3", name: "South Distribution Center", quantity: 400 },
      ],
      lastUpdated: "2023-04-03T10:45:00Z",
    },
    {
      id: "med-001",
      name: "First Aid Kits",
      category: "Medical",
      quantity: 1200,
      unit: "kits",
      distributed: 500,
      locations: [
        { id: "loc-1", name: "Central Warehouse", quantity: 500 },
        { id: "loc-4", name: "Medical Center", quantity: 200 },
      ],
      lastUpdated: "2023-04-03T09:15:00Z",
    },
    {
      id: "shelter-001",
      name: "Emergency Tents",
      category: "Shelter",
      quantity: 800,
      unit: "tents",
      distributed: 350,
      locations: [
        { id: "loc-1", name: "Central Warehouse", quantity: 300 },
        { id: "loc-2", name: "North Distribution Center", quantity: 150 },
      ],
      lastUpdated: "2023-04-03T12:00:00Z",
    },
  ]

  return NextResponse.json({ supplies })
}

export async function POST(request: Request) {
  const data = await request.json()

  // In a real app, this would validate and save the data to a database

  // Simulate processing time
  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json({
    success: true,
    message: "Supply information updated successfully",
    data,
  })
}

