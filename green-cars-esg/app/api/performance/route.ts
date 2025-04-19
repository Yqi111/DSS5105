import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'tab1_performance_info.csv');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // 使用逗号分隔符解析CSV文件（而不是制表符）
    const lines = fileContent.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    const result = [];
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      const values = lines[i].split(',');
      const item = {};
      
      headers.forEach((header, index) => {
        let value = values[index] ? values[index].trim() : '';
        
        // 如果值是数字，尝试将其转换为数值类型
        if (!isNaN(value) && value !== '') {
          item[header] = parseFloat(value);
        } else {
          item[header] = value;
        }
      });
      
      result.push(item);
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error reading performance data:", error);
    return NextResponse.json(
      { error: 'Failed to read performance data', details: error.message },
      { status: 500 }
    );
  }
}