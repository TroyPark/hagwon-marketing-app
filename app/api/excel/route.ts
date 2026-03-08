import { NextResponse } from 'next/server';

// Excel parsing would require xlsx package on server
// This is a simplified version that returns static data
export async function GET() {
  return NextResponse.json({
    message: 'Excel data endpoint. Install xlsx package and configure file path to enable.',
    status: 'static_mode',
  });
}
