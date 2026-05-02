import { NextResponse } from 'next/server';
import { searchFurnitureProducts } from '@/lib/brightData';
import type { Asset, Room } from '@/lib/types';

type SearchProductsBody = {
  asset?: Asset;
  room?: Room | null;
  priorities?: string[];
};

export async function POST(request: Request) {
  let body: SearchProductsBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  if (!body.asset?.id) {
    return NextResponse.json({ error: 'Missing asset.' }, { status: 400 });
  }

  try {
    const result = await searchFurnitureProducts({
      asset: body.asset,
      room: body.room,
      priorities: body.priorities,
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        source: 'mock',
        query: '',
        products: [],
        error: error instanceof Error ? error.message : 'Unexpected search failure.',
      },
      { status: 500 }
    );
  }
}
