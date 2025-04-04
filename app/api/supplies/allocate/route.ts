import { NextResponse } from "next/server"
import fs from 'fs/promises'
import path from 'path'
import connect from "@/dbConfig/dbConfig"
import Supplies from "@/models/suppliesModel"

connect()

interface AllocationRequest {
  disasterId: string
  supplies: {
    food: number
    water: number
    medicine: number
    shelter: number
  }
}

export async function POST(request: Request) {
  try {
    const { disasterId, supplies } = await request.json() as AllocationRequest
    console.log('Received allocation request:', { disasterId, supplies })

    // Read the current disaster report
    const filePath = path.join(process.cwd(), 'mlService', 'disaster_allocations_report.json')
    console.log('Reading disaster report from:', filePath)
    
    const fileContent = await fs.readFile(filePath, 'utf-8')
    const report = JSON.parse(fileContent)
    console.log('Current report:', report)

    // Find the disaster in the report
    let disasterFound = false
    let disasterFullyAllocated = true

    for (const country in report.countries) {
      const countryData = report.countries[country]
      for (const disasterType in countryData.disasters) {
        const disaster = countryData.disasters[disasterType]
        const currentId = `${country}-${disasterType}`
        
        if (currentId === disasterId) {
          console.log('Found matching disaster:', disaster)
          disasterFound = true
          
          // Update the supplies
          const remainingSupplies = {
            food: Math.max(0, disaster.supplies.food - supplies.food),
            water: Math.max(0, disaster.supplies.water - supplies.water),
            medicine: Math.max(0, disaster.supplies.medicine - supplies.medicine),
            shelter: Math.max(0, disaster.supplies.shelter - supplies.shelter)
          }
          console.log('Remaining supplies after allocation:', remainingSupplies)

          // Check if all supplies are fully allocated
          disasterFullyAllocated = Object.values(remainingSupplies).every(value => value === 0)
          console.log('Is disaster fully allocated?', disasterFullyAllocated)

          // Update the disaster's supplies
          disaster.supplies = remainingSupplies

          // Update supplies in the database
          const categoryMapping = {
            food: 'food',
            water: 'water',
            medicine: 'medical',
            shelter: 'shelter'
          }

          // For each supply category, update the database
          for (const [category, amount] of Object.entries(supplies)) {
            if (amount > 0) {
              const dbCategory = categoryMapping[category as keyof typeof categoryMapping]
              const availableSupplies = await Supplies.find({ category: dbCategory })
                .sort({ expirationDate: 1 }) // Sort by expiration date to use oldest first

              let remainingAmount = amount
              for (const supply of availableSupplies) {
                if (remainingAmount <= 0) break

                const deduction = Math.min(remainingAmount, supply.quantity)
                const updatedQuantity = supply.quantity - deduction

                // Update the supply in the database
                await Supplies.findByIdAndUpdate(
                  supply._id,
                  { 
                    quantity: updatedQuantity,
                    lastUpdated: new Date()
                  }
                )

                remainingAmount -= deduction
              }
            }
          }

          // If fully allocated, remove the disaster
          if (disasterFullyAllocated) {
            console.log('Removing fully allocated disaster')
            delete countryData.disasters[disasterType]
            countryData.total_disasters--
            if (countryData.total_disasters === 0) {
              delete report.countries[country]
            }
            report.total_disasters--
          }
        }
      }
    }

    if (!disasterFound) {
      console.error('Disaster not found:', disasterId)
      return NextResponse.json(
        { error: `Disaster with ID ${disasterId} not found` },
        { status: 404 }
      )
    }

    // Write the updated report back to the file
    console.log('Writing updated report to file')
    await fs.writeFile(filePath, JSON.stringify(report, null, 2))

    return NextResponse.json({
      success: true,
      fullyAllocated: disasterFullyAllocated,
      message: disasterFullyAllocated 
        ? "Supplies fully allocated and disaster removed from report"
        : "Supplies partially allocated"
    })

  } catch (error) {
    console.error("Error allocating supplies:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to allocate supplies" },
      { status: 500 }
    )
  }
} 