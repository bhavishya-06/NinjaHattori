import { NextResponse } from "next/server"
import connect from "@/dbConfig/dbConfig"
import Supplies from "@/models/suppliesModel"
import { connectToDatabase } from "@/lib/db"

connect()

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const updatedSupply = await request.json();
    
    const supply = await Supplies.findByIdAndUpdate(
      id,
      { ...updatedSupply, lastUpdated: new Date() },
      { new: true }
    );

    if (!supply) {
      return NextResponse.json(
        { error: 'Supply not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: supply });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const deletedSupply = await Supplies.findByIdAndDelete(id)
    if (!deletedSupply) {
      return NextResponse.json(
        { error: "Supply not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: "Supply deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error deleting supply:", error)
    return NextResponse.json(
      { error: "Failed to delete supply" },
      { status: 500 }
    )
  }
} 