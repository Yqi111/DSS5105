import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbols = searchParams.get('symbols');

  if (!symbols) {
    return NextResponse.json(
      { error: 'No symbols provided' },
      { status: 400 }
    );
  }

  try {
    const symbolsArray = symbols.split(',');
    
    // 获取实时报价
    const quotes = await Promise.all(
      symbolsArray.map(async symbol => {
        try {
          return await yahooFinance.quote(symbol);
        } catch (err) {
          console.error(`Error fetching quote for ${symbol}:`, err);
          return { symbol, error: true };
        }
      })
    );

    // 获取历史数据
    const historicalData = {};
    for (const symbol of symbolsArray) {
      try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        
        const data = await yahooFinance.historical(symbol, {
          period1: startDate,
          period2: endDate,
          interval: '1d'
        });
        
        historicalData[symbol] = data;
      } catch (err) {
        console.error(`Error fetching historical data for ${symbol}:`, err);
        historicalData[symbol] = [];
      }
    }

    return NextResponse.json({
      quotes,
      historicalData
    });
  } catch (err) {
    console.error("Error fetching stock data:", err);
    return NextResponse.json(
      { error: 'Failed to fetch stock data' },
      { status: 500 }
    );
  }
}