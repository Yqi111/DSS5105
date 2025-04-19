import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  console.log("DeepSeek API Key exists:", !!process.env.DEEPSEEK_API_KEY);
  
  const { question, pageContent } = await request.json();
  console.log("Received question:", question);

  if (!question) {
    return NextResponse.json({ error: "Question is required" }, { status: 400 });
  }

  // 检查问题是否与允许的主题相关
  const isRelevantQuestion = checkQuestionRelevance(question);
  if (!isRelevantQuestion) {
    return NextResponse.json({ 
      answer: "I'm sorry, but I can only answer questions related to the automotive industry, ESG topics, or specific car companies. Please ask a question in these areas." 
    });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  
  if (!apiKey) {
    console.error("DeepSeek API key is not defined in environment variables");
    return NextResponse.json({ error: "API configuration error" }, { status: 500 });
  }

  try {
    console.log("Sending request to DeepSeek API...");
    
    // 解析页面内容，获取有关品牌的信息
    let parsedContent = typeof pageContent === 'string' ? JSON.parse(pageContent) : pageContent;
    
    // 获取当前选择的品牌和股票数据
    const selectedBrand = parsedContent?.selectedBrand || "All Brands";
    const stockInfo = parsedContent?.stockInfo || [];
    const brandData = parsedContent?.brandData || [];
    
    // 格式化股票信息以便清晰显示
    const formattedStockInfo = stockInfo.map(stock => 
      `${stock.name}: $${stock.price} (${stock.change >= 0 ? '+' : ''}${stock.change}) [${stock.ticker}]`
    ).join('\n');
    
    // 构建系统消息和用户消息
    const messages = [
      { 
        role: "system", 
        content: `You are an advanced ESG (Environmental, Social, and Governance) specialist for the automotive industry with deep expertise in sustainability metrics, company performance, and market trends.

IMPORTANT RESTRICTION:
You can ONLY answer questions related to the electric vehicle industry, ESG topics, or specific automotive companies.
If the question is about any other topic, politely decline to answer and remind the user of your focus areas.

SPECIAL INSTRUCTIONS:
1. If the user inputs ONLY a company name (like "Tesla", "BMW", "Audi", etc.), provide a COMPLETE COMPANY PROFILE including:
   - ESG scores breakdown (Environmental, Social, Governance)
   - Current stock price and recent performance
   - Key performance metrics (horsepower, acceleration, energy consumption)
   - Sentiment analysis results
   - Brief strengths and weaknesses from an ESG perspective

CONVERSATION STYLE:
1. Be conversational, helpful, and engaging - respond as if you're an expert colleague.
2. Keep answers concise but informative - prioritize clarity over verbosity.
3. When appropriate, add insights beyond the raw data to demonstrate analytical thinking.
4. If you don't have specific information, acknowledge this and offer relevant general information instead.
5. Use a friendly, professional tone that balances expertise with accessibility.

FORMATTING GUIDELINES:
1. Use clear headers (<strong>text</strong>) to organize longer responses.
2. Present quantitative data with appropriate precision (e.g., "84.5" not "84.5000").
3. For comparisons, use tables when comparing multiple metrics across brands.
4. Use bullet points for listing features, advantages, or components.
5. Highlight particularly important information using <strong>text</strong> formatting.

DATA HANDLING:
1. Always use the most up-to-date stock information provided in the context.
2. When discussing ESG scores, include all three dimensions: environmental, social, and governance.
3. For car performance, mention the most relevant metrics (horsepower, acceleration, energy consumption).
4. When analyzing sentiment, explain what the values indicate in practical terms.
5. For predictions, note the general trend rather than focusing on precise numbers.

Current dashboard context:
- Selected brand: ${selectedBrand}
- Available data: ESG scores, stock prices, performance metrics, sentiment analysis

LATEST STOCK INFORMATION:
${formattedStockInfo}

${pageContent ? "Use the following page content to answer questions and provide company profiles:" : ""}
${typeof pageContent === 'string' ? pageContent : JSON.stringify(pageContent)}`
      },
      { role: "user", content: question }
    ];
    
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: messages,
        max_tokens: 400, // 增加token限制以允许更详细的回答
        temperature: 0.7,
      }),
    });

    console.log("DeepSeek API status:", response.status);
    
    if (!response.ok) {
      const errorDetails = await response.text();
      console.error("Error details:", errorDetails);
      return NextResponse.json(
        { error: `DeepSeek API error: ${response.status} - ${errorDetails}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("DeepSeek API response:", data);
    
    // 根据 DeepSeek API 的响应格式进行调整
    const answer = data.choices[0].message.content;
    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { error: `Failed to fetch DeepSeek response: ${error.message}` },
      { status: 500 }
    );
  }
}

// 检查问题是否与允许的主题相关
function checkQuestionRelevance(question) {
  const lowerQuestion = question.toLowerCase();
  
  // ESG关键词
  const esgKeywords = ['esg', 'environmental', 'social', 'governance', 'sustainability', 'sustainable', 'green', 
                     'carbon', 'emission', 'climate', 'renewable', 'clean energy', 'ethical'];
  
  // 电动汽车行业关键词
  const evKeywords = ['ev', 'electric vehicle', 'electric car', 'hybrid', 'battery', 'charging', 'range', 
                    'autonomous', 'self-driving', 'horsepower', 'acceleration', 'energy consumption'];
                    
  // 一般汽车行业关键词 - 扩展范围，包括汽车相关术语
  const carIndustryKeywords = [
    'car', 'cars', 'auto', 'automobile', 'automotive', 'vehicle', 'vehicles', 'motors', 
    'manufacturer', 'manufacturing', 'production', 'industry', 'automaker', 'dealership',
    'engine', 'transmission', 'driving', 'drive', 'wheels', 'tires', 'brakes', 'safety',
    'mpg', 'mileage', 'fuel economy', 'fuel efficiency', 'performance', 'sedan', 'suv',
    'truck', 'luxury', 'compact', 'midsize', 'recall', 'model', 'brand', 'combustion',
    'exhaust', 'ride', 'handling', 'features', 'specification', 'specs', 'electric',
    'gas', 'petrol', 'diesel', 'motor', 'powertrain', 'drivetrain', 'suspension',
    'emissions', 'airbag', 'safety rating', 'crash test', 'driver assist', 'self driving',
    'tesla', 'toyota', 'volkswagen', 'ford', 'bmw', 'byd', 'hyundai', 'xiao peng', 'audi', 'mercedes',
    'porsche', 'honda', 'nissan', 'kia', 'subaru', 'mazda', 'jaguar', 'land rover', 'volvo', 'lexus'
  ];
  
  // 检查问题是否包含任何相关关键词
  return esgKeywords.some(keyword => lowerQuestion.includes(keyword)) ||
         evKeywords.some(keyword => lowerQuestion.includes(keyword)) ||
         carIndustryKeywords.some(keyword => lowerQuestion.includes(keyword)) ||
         // 检查是否可能是汽车品牌名称（更宽松的检查）
         /\b(car|vehicle|automobile|automotive)\s+(brand|company|manufacturer|make|model)\b/i.test(lowerQuestion) ||
         /\b(brand|company|manufacturer)\s+(car|vehicle|automobile|automotive)\b/i.test(lowerQuestion);
}