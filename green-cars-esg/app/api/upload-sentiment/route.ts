import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // 从请求中获取FormData
    const formData = await request.formData();
    
    // 将请求转发到FastAPI后端
    const response = await fetch('http://localhost:8000/upload-esg', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Failed to process file: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // 将FastAPI的响应格式化为适合前端的格式
    return NextResponse.json({
      company: data.company,
      sentiment: {
        overall: data.weighted_avg_polarity,
        environmental: data.environment_score,
        social: data.social_score,
        governance: data.governance_score,
      }
    });
  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process uploaded file' },
      { status: 500 }
    );
  }
}