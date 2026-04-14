import { NextResponse } from 'next/server'
import { dashboardData } from '../../data/dashboard'

export function GET() {
  return NextResponse.json(dashboardData)
}
