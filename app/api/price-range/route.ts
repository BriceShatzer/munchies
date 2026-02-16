import { NextResponse } from 'next/server';

// placeholder data matching the API specification
const priceRanges = [
  { id: 'd09ff4c9-e90e-42c7-b78b-bdc65e3331ce', range: '$' },
  { id: 'ff6b5391-2f0d-4b39-8ba8-d415c52a425d', range: '$$' },
  { id: 'f24fc0fb-a339-4240-a223-1365ec1aee07', range: '$$$' },
  { id: '93a626e5-5017-416b-9505-7411d22f7b38', range: '$$$$' },
];

export async function GET() {
  return NextResponse.json(priceRanges);
}
