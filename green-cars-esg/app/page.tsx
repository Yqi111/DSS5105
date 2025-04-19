"use client"

import { useState, useEffect, useRef } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  Car,
  BarChart3,
  TrendingUp,
  LineChart,
  MessageCircle,
  X,
  Send,
  Leaf,
  Users,
  Building2,
  Zap,
  Gauge,
  Timer,
  Fuel,
  Upload,
  ArrowLeft,
  ArrowUp,
  ChevronRight,
} from "lucide-react"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  Legend,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import yahooFinance from "yahoo-finance2"

// Stock tickers mapping
const STOCK_TICKERS = {
  BMW: "BMW.DE",
  "Mercedes-Benz Group AG": "MBGYY",
  Volkswagen: "VWAGY",
  Audi: "VWAGY",
  "Ford Motor Company": "F",
  Tesla: "TSLA",
  Toyota: "TM",
  Hyundai: "HYMTF",
  BYD: "BYDDY",
  "Xiao Peng": "XPEV",
}

// Car models by brand
const CAR_MODELS = {
  Tesla: ["Model S", "Model 3", "Model X", "Model Y", "Cybertruck"],
  Toyota: ["Prius", "Corolla", "RAV4", "Camry", "Highlander"],
  Volkswagen: ["ID.4", "Golf", "Passat", "Tiguan", "Atlas"],
  "Ford Motor Company": ["Mustang Mach-E", "F-150 Lightning", "Explorer", "Escape", "Bronco"],
  BMW: ["i4", "iX", "3 Series", "5 Series", "X5"],
  BYD: ["Han", "Tang", "Dolphin", "Seal", "Atto 3"],
  Hyundai: ["IONIQ 5", "IONIQ 6", "Kona", "Tucson", "Santa Fe"],
  "Xiao Peng": ["P7", "G3", "P5", "G9", "P7i"],
  Audi: ["e-tron", "Q4 e-tron", "A4", "Q5", "A6"],
  "Mercedes-Benz Group AG": ["EQS", "EQE", "C-Class", "E-Class", "GLE"],
}

// Update the sentiment data in the carBrands array to match the provided polarity scores
const carBrands = [
  {
    id: 1,
    name: "Tesla",
    logo: "/placeholder.svg?height=40&width=40",
    environmental: 92,
    social: 78,
    governance: 85,
    overall: 85,
    trend: "up",
    sentiment: {
      overall: 0.11816,
      environmental: 0.06952,
      social: 0.15961,
      governance: 0.13797,
    },
    stock: { price: 242.68, change: 3.45, ticker: "TSLA" },
    performance: {
      energyType: "electric",
      horsepower: 480,
      acceleration: 3.1, // 0-60 mph in seconds
      energyConsumption: 28, // kWh/100 miles
    },
  },
  {
    id: 2,
    name: "Toyota",
    logo: "/placeholder.svg?height=40&width=40",
    environmental: 81,
    social: 89,
    governance: 92,
    overall: 87,
    trend: "up",
    sentiment: {
      overall: 0.1027,
      environmental: 0.12495,
      social: 0.02943,
      governance: 0.16969,
    },
    stock: { price: 178.92, change: -0.87, ticker: "TM" },
    performance: {
      energyType: "hybrid",
      horsepower: 208,
      acceleration: 7.2,
      energyConsumption: 4.5, // L/100km
    },
  },
  {
    id: 3,
    name: "Volkswagen",
    logo: "/placeholder.svg?height=40&width=40",
    environmental: 76,
    social: 81,
    governance: 79,
    overall: 79,
    trend: "stable",
    sentiment: {
      overall: 0.17382,
      environmental: 0.27024,
      social: 0.13474,
      governance: 0.07428,
    },
    stock: { price: 112.34, change: 1.23, ticker: "VWAGY" },
    performance: {
      energyType: "hybrid",
      horsepower: 241,
      acceleration: 6.5,
      energyConsumption: 5.2,
    },
  },
  {
    id: 4,
    name: "Ford Motor Company",
    logo: "/placeholder.svg?height=40&width=40",
    environmental: 72,
    social: 75,
    governance: 80,
    overall: 76,
    trend: "up",
    sentiment: {
      overall: 0.3944,
      environmental: 0.36498,
      social: 0.34254,
      governance: 0.51409,
    },
    stock: { price: 12.45, change: 0.32, ticker: "F" },
    performance: {
      energyType: "fuel",
      horsepower: 310,
      acceleration: 5.9,
      energyConsumption: 9.8,
    },
  },
  {
    id: 5,
    name: "BMW",
    logo: "/placeholder.svg?height=40&width=40",
    environmental: 78,
    social: 83,
    governance: 88,
    overall: 83,
    trend: "stable",
    sentiment: {
      overall: 0.03781,
      environmental: 0.05989,
      social: 0.00246,
      governance: 0.05195,
    },
    stock: { price: 98.76, change: -1.45, ticker: "BMW.DE" },
    performance: {
      energyType: "hybrid",
      horsepower: 335,
      acceleration: 4.8,
      energyConsumption: 6.7,
    },
  },
  {
    id: 6,
    name: "BYD",
    logo: "/placeholder.svg?height=40&width=40",
    environmental: 88,
    social: 76,
    governance: 79,
    overall: 81,
    trend: "up",
    sentiment: {
      overall: 0.46219,
      environmental: 0.39923,
      social: 0.45909,
      governance: 0.56725,
    },
    stock: { price: 28.56, change: 2.87, ticker: "BYDDY" },
    performance: {
      energyType: "electric",
      horsepower: 310,
      acceleration: 4.6,
      energyConsumption: 31,
    },
  },
  {
    id: 7,
    name: "Hyundai",
    logo: "/placeholder.svg?height=40&width=40",
    environmental: 79,
    social: 82,
    governance: 81,
    overall: 80,
    trend: "up",
    sentiment: {
      overall: 0.40251,
      environmental: 0.42831,
      social: 0.35073,
      governance: 0.43374,
    },
    stock: { price: 45.23, change: 0.67, ticker: "HYMTF" },
    performance: {
      energyType: "hybrid",
      horsepower: 226,
      acceleration: 6.8,
      energyConsumption: 5.4,
    },
  },
  {
    id: 8,
    name: "Xiao Peng",
    logo: "/placeholder.svg?height=40&width=40",
    environmental: 85,
    social: 72,
    governance: 74,
    overall: 77,
    trend: "up",
    sentiment: {
      overall: 0.38831,
      environmental: 0.43324,
      social: 0.26898,
      governance: 0.48347,
    },
    stock: { price: 18.34, change: 1.56, ticker: "XPEV" },
    performance: {
      energyType: "electric",
      horsepower: 348,
      acceleration: 4.4,
      energyConsumption: 33,
    },
  },
  {
    id: 9,
    name: "Audi",
    logo: "/placeholder.svg?height=40&width=40",
    environmental: 77,
    social: 84,
    governance: 86,
    overall: 82,
    trend: "stable",
    sentiment: {
      overall: 0.01088,
      environmental: 0.03936,
      social: 0.09989,
      governance: -0.15931,
    },
    stock: { price: 87.45, change: -0.34, ticker: "VWAGY" },
    performance: {
      energyType: "hybrid",
      horsepower: 362,
      acceleration: 4.3,
      energyConsumption: 6.9,
    },
  },
  {
    id: 10,
    name: "Mercedes-Benz Group AG",
    logo: "/placeholder.svg?height=40&width=40",
    environmental: 75,
    social: 87,
    governance: 90,
    overall: 84,
    trend: "up",
    sentiment: {
      overall: 0.26869,
      environmental: 0.32311,
      social: 0.22209,
      governance: 0.24687,
    },
    stock: { price: 67.89, change: 1.23, ticker: "MBGYY" },
    performance: {
      energyType: "hybrid",
      horsepower: 429,
      acceleration: 4.1,
      energyConsumption: 7.2,
    },
  },
]

// Simulated sentiment data
const sentimentData = [
  {
    month: "Jan",
    Tesla: 65,
    Toyota: 78,
    Volkswagen: 62,
    Ford: 58,
    BMW: 72,
    BYD: 68,
    Hyundai: 64,
    "Xiao Peng": 60,
    Audi: 70,
    Mercedes: 74,
  },
  {
    month: "Feb",
    Tesla: 68,
    Toyota: 76,
    Volkswagen: 65,
    Ford: 60,
    BMW: 70,
    BYD: 72,
    Hyundai: 66,
    "Xiao Peng": 63,
    Audi: 71,
    Mercedes: 75,
  },
  {
    month: "Mar",
    Tesla: 72,
    Toyota: 80,
    Volkswagen: 63,
    Ford: 62,
    BMW: 74,
    BYD: 76,
    Hyundai: 69,
    "Xiao Peng": 67,
    Audi: 73,
    Mercedes: 77,
  },
  {
    month: "Apr",
    Tesla: 75,
    Toyota: 82,
    Volkswagen: 67,
    Ford: 65,
    BMW: 75,
    BYD: 79,
    Hyundai: 72,
    "Xiao Peng": 70,
    Audi: 75,
    Mercedes: 78,
  },
  {
    month: "May",
    Tesla: 80,
    Toyota: 81,
    Volkswagen: 70,
    Ford: 68,
    BMW: 77,
    BYD: 81,
    Hyundai: 74,
    "Xiao Peng": 72,
    Audi: 76,
    Mercedes: 79,
  },
  {
    month: "Jun",
    Tesla: 85,
    Toyota: 83,
    Volkswagen: 68,
    Ford: 70,
    BMW: 79,
    BYD: 83,
    Hyundai: 75,
    "Xiao Peng": 73,
    Audi: 77,
    Mercedes: 80,
  },
  {
    month: "Jul",
    Tesla: 87,
    Toyota: 82,
    Volkswagen: 65,
    Ford: 71,
    BMW: 79,
    BYD: 83,
    Hyundai: 76,
    "Xiao Peng": 74,
    Audi: 78,
    Mercedes: 81,
  },
]

// Simulated prediction data
const predictionData = [
  {
    year: "2023",
    Tesla: 85,
    Toyota: 87,
    Volkswagen: 79,
    Ford: 76,
    BMW: 83,
    BYD: 81,
    Hyundai: 80,
    "Xiao Peng": 77,
    Audi: 82,
    Mercedes: 84,
  },
  {
    year: "2024",
    Tesla: 87,
    Toyota: 88,
    Volkswagen: 81,
    Ford: 78,
    BMW: 84,
    BYD: 83,
    Hyundai: 81,
    "Xiao Peng": 79,
    Audi: 83,
    Mercedes: 85,
  },
  {
    year: "2025",
    Tesla: 89,
    Toyota: 90,
    Volkswagen: 83,
    Ford: 80,
    BMW: 85,
    BYD: 85,
    Hyundai: 83,
    "Xiao Peng": 81,
    Audi: 84,
    Mercedes: 86,
  },
  {
    year: "2026",
    Tesla: 91,
    Toyota: 91,
    Volkswagen: 85,
    Ford: 82,
    BMW: 86,
    BYD: 87,
    Hyundai: 84,
    "Xiao Peng": 83,
    Audi: 85,
    Mercedes: 87,
  },
  {
    year: "2027",
    Tesla: 93,
    Toyota: 92,
    Volkswagen: 87,
    Ford: 84,
    BMW: 87,
    BYD: 89,
    Hyundai: 85,
    "Xiao Peng": 85,
    Audi: 86,
    Mercedes: 88,
  },
]



// Production volume prediction (thousands of vehicles)
const productionVolumeData = [
  {
    year: "2023",
    Tesla: 1800,
    Toyota: 9500,
    Volkswagen: 8200,
    Ford: 4100,
    BMW: 2500,
    BYD: 1600,
    Hyundai: 6800,
    "Xiao Peng": 800,
    Audi: 1900,
    Mercedes: 2200,
  },
  {
    year: "2024",
    Tesla: 2200,
    Toyota: 9700,
    Volkswagen: 8400,
    Ford: 4300,
    BMW: 2600,
    BYD: 2000,
    Hyundai: 7000,
    "Xiao Peng": 1100,
    Audi: 2000,
    Mercedes: 2300,
  },
  {
    year: "2025",
    Tesla: 2600,
    Toyota: 9900,
    Volkswagen: 8600,
    Ford: 4500,
    BMW: 2700,
    BYD: 2400,
    Hyundai: 7200,
    "Xiao Peng": 1400,
    Audi: 2100,
    Mercedes: 2400,
  },
  {
    year: "2026",
    Tesla: 3000,
    Toyota: 10100,
    Volkswagen: 8800,
    Ford: 4700,
    BMW: 2800,
    BYD: 2800,
    Hyundai: 7400,
    "Xiao Peng": 1700,
    Audi: 2200,
    Mercedes: 2500,
  },
  {
    year: "2027",
    Tesla: 3400,
    Toyota: 10300,
    Volkswagen: 9000,
    Ford: 4900,
    BMW: 2900,
    BYD: 3200,
    Hyundai: 7600,
    "Xiao Peng": 2000,
    Audi: 2300,
    Mercedes: 2600,
  },
]



// Chat bot predefined responses
const botResponses = {
  hello: "Hello! How can I help you with ESG car ratings today?",
  "what is esg":
    "ESG stands for Environmental, Social, and Governance. These are criteria used to evaluate a company's sustainability and ethical impact. For car manufacturers, this includes factors like emissions, labor practices, and corporate transparency.",
  "how are ratings calculated":
    "Our ESG ratings are calculated using a proprietary algorithm that analyzes over 100 data points across environmental impact, social responsibility, and governance practices. We collect data from company reports, third-party audits, news sources, and regulatory filings.",
  "which car brand has the best esg rating":
    "Currently, Toyota has the highest overall ESG rating on our platform with a score of 87, followed closely by Tesla at 85. Toyota excels particularly in social and governance factors, while Tesla leads in environmental performance.",
  "what is sentiment score":
    "The ESG Sentiment Score measures public perception and media coverage of a company's ESG practices. It analyzes thousands of news articles, social media posts, and forum discussions to gauge how a brand's sustainability efforts are being received by the public and investors.",
  "how accurate are the predictions":
    "Our ESG predictions use machine learning models trained on historical data and industry trends. They have an average accuracy of 85% for one-year forecasts, though accuracy decreases for longer time horizons. We update our models quarterly to improve accuracy.",
  default:
    "I don't have specific information about that. Would you like to know about ESG ratings, sentiment analysis, or stock performance of specific car brands?",
}

// Color schemes
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#8dd1e1",
  "#a4de6c",
  "#d0ed57",
]
const ESG_COLORS = {
  environmental: "#4ade80",
  social: "#60a5fa",
  governance: "#c084fc",
}

// 在导入语句之后添加这段代码
// Define an interface for the CoverPage props
interface CoverPageProps {
  onExplore: () => void;
}

function CoverPage({ onExplore }: CoverPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Car className="w-8 h-8 text-emerald-600" />
              <span className="text-xl font-bold text-gray-900">EcoDrive</span>
            </div>
            {/* 删除导航菜单项 */}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-white -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full text-emerald-700 text-sm font-medium mb-6">
                <Zap className="w-4 h-4" />
                Leading the Sustainable Revolution
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                The Future of
                <span className="block text-emerald-600">Sustainable Mobility</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Experience the perfect harmony of luxury, performance, and environmental responsibility with our next-generation electric vehicles.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button 
                  className="bg-emerald-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-emerald-700 transition-colors inline-flex items-center justify-center gap-2"
                  onClick={onExplore}
                >
                  Explore Models
                  <ChevronRight className="w-5 h-5" />
                </button>
                {/* 删除Learn More按钮 */}
              </div>
            </div>

            <div className="flex-1 relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-200 to-emerald-100 rounded-full blur-3xl opacity-30 -z-10" />
              <img
                src="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=2000"
                alt="Luxury Electric Vehicle"
                className="rounded-2xl shadow-2xl w-full object-cover transform hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ESG Performance Metrics Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-3">
              <span className="text-gray-900">ESG</span>
              <span className="text-emerald-600"> PERFORMANCE METRICS</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Advanced algorithms quantifying sustainability across key parameters
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Environmental */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
              <div className="p-8 text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-5">
                  <Leaf className="h-7 w-7 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">ENVIRONMENTAL</h3>
                <p className="text-gray-600">
                  Emissions, energy efficiency, resource utilization
                </p>
              </div>
            </div>

            {/* Social */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
              <div className="p-8 text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-5">
                  <Users className="h-7 w-7 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">SOCIAL</h3>
                <p className="text-gray-600">
                  Safety protocols, labor standards, community impact
                </p>
              </div>
            </div>

            {/* Governance */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
              <div className="p-8 text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-5">
                  <Building2 className="h-7 w-7 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">GOVERNANCE</h3>
                <p className="text-gray-600">
                  Corporate ethics, transparency, compliance frameworks
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ESGDashboard() {
  const [showCover, setShowCover] = useState(true) // 控制封面显示状态

  const [csvPerformanceData, setCsvPerformanceData] = useState([])
  const [isLoadingPerformance, setIsLoadingPerformance] = useState(false)
  const [performanceError, setPerformanceError] = useState(false)

  const [chatOpen, setChatOpen] = useState(false)
  const [chatInput, setChatInput] = useState("")
  const [chatMessages, setChatMessages] = useState([
    { sender: "bot", text: "Hello! I'm your ESG assistant. How can I help you today?" },
  ])
  // 修改股票数据状态，添加加载状态和错误状态
  const [stockData, setStockData] = useState([])
  const [isLoadingStocks, setIsLoadingStocks] = useState(true)
  const [stockError, setStockError] = useState(false)
  
  const [selectedBrand, setSelectedBrand] = useState("All Brands")
  const [selectedModel, setSelectedModel] = useState("All Models")
  const [availableModels, setAvailableModels] = useState(["All Models"])
  const [filteredBrands, setFilteredBrands] = useState(carBrands)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadError, setUploadError] = useState(false)
  const fileInputRef = useRef(null)

  const [uploadedSentimentData, setUploadedSentimentData] = useState(null)
  
  

  // Update available models when brand changes
  useEffect(() => {
    if (selectedBrand === "All Brands") {
      setAvailableModels(["All Models"])
      setSelectedModel("All Models")
    } else {
      const models = CAR_MODELS[selectedBrand] || []
      setAvailableModels(["All Models", ...models])
      setSelectedModel("All Models")
    }
  }, [selectedBrand])

  // Filter brands based on selection
  // 找到现有的型号选择useEffect并替换为
  // 修改获取车型的useEffect，确保车型名称唯一

useEffect(() => {
  if (selectedBrand === "All Brands") {
    setAvailableModels(["All Models"])
    setSelectedModel("All Models")
  } else {
    // 首先尝试从CSV数据中找车型
    if (csvPerformanceData.length > 0) {
      const models = csvPerformanceData
        .filter(item => item.Company === selectedBrand)
        .map(item => item["Car model"])
        
      if (models.length > 0) {
        // 使用Set去除重复的车型名称
        const uniqueModels = [...new Set(models)]
        setAvailableModels(["All Models", ...uniqueModels])
        setSelectedModel("All Models")
        return
      }
    }
    
    // 如果CSV中找不到，使用原有的车型数据
    const models = CAR_MODELS[selectedBrand] || []
    setAvailableModels(["All Models", ...models])
    setSelectedModel("All Models")
  }
}, [selectedBrand, csvPerformanceData])

// 修改获取股票数据的useEffect
useEffect(() => {
  async function fetchStockData() {
    setIsLoadingStocks(true);
    setStockError(false);
    
    try {
      let tickersToFetch = [];
      let companyToTickerMap = {};
      
      // 如果CSV数据已加载，优先使用CSV数据中的公司名称
      if (csvPerformanceData.length > 0) {
        // 从CSV数据中提取唯一的公司名称
        const uniqueCompanies = [...new Set(csvPerformanceData.map(item => item.Company))];
        
        uniqueCompanies.forEach(company => {
          // 获取该公司的股票代码
          const ticker = STOCK_TICKERS[company];
          if (ticker) {
            tickersToFetch.push(ticker);
            companyToTickerMap[company] = ticker;
          }
        });
      } else {
        // 如果CSV数据未加载，使用原始的carBrands数据
        carBrands.forEach(brand => {
          tickersToFetch.push(brand.stock.ticker);
          companyToTickerMap[brand.name] = brand.stock.ticker;
        });
      }
      
      // 应用品牌过滤
      if (selectedBrand !== "All Brands") {
        const ticker = companyToTickerMap[selectedBrand];
        if (ticker) {
          tickersToFetch = [ticker];
        } else {
          tickersToFetch = [];
        }
      }
      
      tickersToFetch = [...new Set(tickersToFetch)]; // 去重
      
      if (tickersToFetch.length === 0) {
        setStockData([]);
        setIsLoadingStocks(false);
        return;
      }
      
      const response = await fetch(`/api/stocks?symbols=${tickersToFetch.join(',')}`);
      if (!response.ok) {
        throw new Error('Failed to fetch stock data');
      }
      
      const data = await response.json();
      const { quotes, historicalData } = data;
      
      // 处理获取到的报价数据
      const processedQuotes = {};
      quotes.forEach(quote => {
        if (!quote.error) {
          processedQuotes[quote.symbol] = {
            price: quote.regularMarketPrice || 0,
            change: quote.regularMarketChange || 0,
            changePercent: quote.regularMarketChangePercent || 0,
            marketCap: quote.marketCap || 0,
            currency: quote.currency || 'USD',
            shortName: quote.shortName || '',
            historicalData: historicalData[quote.symbol]?.map(item => ({
              time: new Date(item.date).getTime(),
              value: item.close
            })) || []
          };
        }
      });
      
      // 创建每个公司的股票数据
      const liveStockData = [];
      
      // 反向映射: 从股票代码到公司名称
      const tickerToCompany = {};
      Object.keys(companyToTickerMap).forEach(company => {
        const ticker = companyToTickerMap[company];
        if (!tickerToCompany[ticker]) {
          tickerToCompany[ticker] = [];
        }
        tickerToCompany[ticker].push(company);
      });
      
      // 使用反向映射创建股票数据
      Object.keys(processedQuotes).forEach(ticker => {
        const quoteData = processedQuotes[ticker];
        const companies = tickerToCompany[ticker] || [];
        
        if (companies.length > 0) {
          // 为每个共享此ticker的公司创建股票数据
          companies.forEach(company => {
            liveStockData.push({
              name: company,
              ticker: ticker,
              price: quoteData.price,
              change: quoteData.change,
              changePercent: quoteData.changePercent,
              marketCap: quoteData.marketCap,
              currency: quoteData.currency,
              historicalData: quoteData.historicalData
            });
          });
        } else {
          // 如果找不到对应的公司，使用ticker作为名称
          liveStockData.push({
            name: ticker,
            ticker: ticker,
            price: quoteData.price,
            change: quoteData.change,
            changePercent: quoteData.changePercent,
            marketCap: quoteData.marketCap,
            currency: quoteData.currency,
            historicalData: quoteData.historicalData
          });
        }
      });
      
      // 添加未找到实时数据的公司
      if (csvPerformanceData.length > 0) {
        const uniqueCompanies = [...new Set(csvPerformanceData.map(item => item.Company))];
        const existingCompanies = liveStockData.map(stock => stock.name);
        
        uniqueCompanies.forEach(company => {
          if (!existingCompanies.includes(company)) {
            // 尝试找到对应的原始品牌数据
            const brandData = carBrands.find(b => b.name === company);
            if (brandData) {
              liveStockData.push({
                name: company,
                ticker: STOCK_TICKERS[company] || "Unknown",
                price: brandData.stock.price,
                change: brandData.stock.change,
                changePercent: 0,
                currency: STOCK_TICKERS[company] === "BMW.DE" ? "EUR" : "USD",
                error: true
              });
            }
          }
        });
      }
      
      // 如果有特定品牌选择但没有找到相应的股票数据
      if (selectedBrand !== "All Brands" && !liveStockData.some(s => s.name === selectedBrand)) {
        const brandData = carBrands.find(b => b.name === selectedBrand);
        if (brandData) {
          liveStockData.push({
            name: selectedBrand,
            ticker: STOCK_TICKERS[selectedBrand] || brandData.stock.ticker,
            price: brandData.stock.price,
            change: brandData.stock.change,
            changePercent: 0,
            currency: (STOCK_TICKERS[selectedBrand] || brandData.stock.ticker) === "BMW.DE" ? "EUR" : "USD",
            error: true
          });
        }
      }
      
      setStockData(liveStockData);
    } catch (err) {
      console.error("Error fetching stock data:", err);
      setStockError(true);
    } finally {
      setIsLoadingStocks(false);
    }
  }
  
  fetchStockData();
  
  const interval = setInterval(fetchStockData, 60000);
  return () => clearInterval(interval);
}, [selectedBrand, csvPerformanceData]);

  // 添加在现有的useEffect之后
  // 获取CSV数据
  useEffect(() => {
    async function fetchCsvData() {
      setIsLoadingPerformance(true)
      try {
        const response = await fetch('/api/performance')
        if (!response.ok) {
          throw new Error('Failed to fetch performance data')
        }
        
        const data = await response.json()
        setCsvPerformanceData(data)
      } catch (error) {
        console.error("Error fetching CSV data:", error)
        setPerformanceError(true)
      } finally {
        setIsLoadingPerformance(false)
      }
    }
    fetchCsvData()
  }, [])

  // 添加一个新的useEffect来过滤品牌数据

// 在现有useEffect下面添加
useEffect(() => {
  // 当brand选择变化时，更新filteredBrands状态
  if (selectedBrand === "All Brands") {
    // 显示所有品牌
    setFilteredBrands(carBrands);
  } else {
    // 仅显示选中的品牌
    setFilteredBrands(carBrands.filter(brand => brand.name === selectedBrand));
  }
}, [selectedBrand]); // 依赖于selectedBrand


  // Handle chat submission
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
  
    // 只添加一次用户消息
    setChatMessages((prev) => [...prev, { sender: "user", text: chatInput }]);
    const userInput = chatInput;
    setChatInput("");
  
    try {
      // 创建更新了股票数据的品牌数据副本
      const updatedBrandData = selectedBrand === "All Brands" 
        ? carBrands.map(brand => {
            // 查找最新股票数据
            const stockInfo = stockData.find(stock => stock.name === brand.name);
            if (stockInfo) {
              return {
                ...brand,
                stock: {
                  price: stockInfo.price,
                  change: stockInfo.change,
                  ticker: stockInfo.ticker
                }
              };
            }
            return brand;
          }) 
        : carBrands.filter(brand => brand.name === selectedBrand).map(brand => {
            // 查找最新股票数据
            const stockInfo = stockData.find(stock => stock.name === brand.name);
            if (stockInfo) {
              return {
                ...brand,
                stock: {
                  price: stockInfo.price,
                  change: stockInfo.change,
                  ticker: stockInfo.ticker
                }
              };
            }
            return brand;
          });
  
      // 收集页面内容（当前状态数据）
      const pageContent = JSON.stringify({
        selectedBrand,
        selectedModel,
        // 使用更新了股票数据的品牌数据
        brandData: updatedBrandData,
        // CSV数据部分保持不变
        csvData: csvPerformanceData.length > 0 
          ? (selectedBrand === "All Brands" 
              ? csvPerformanceData.slice(0, 5) 
              : csvPerformanceData.filter(item => item.Company === selectedBrand).slice(0, 5))
          : [],
        // 明确包含最新的股票信息
        stockInfo: selectedBrand === "All Brands"
          ? stockData.slice(0, 5)
          : stockData.filter(stock => stock.name === selectedBrand),
      });
  
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          question: userInput,
          pageContent: pageContent
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch response");
      }
  
      const data = await response.json();
      const gptResponse = data.answer;
  
      setChatMessages((prev) => [...prev, { sender: "bot", text: gptResponse }]);
    } catch (error) {
      console.error("Error fetching response:", error);
      
      // 错误回退逻辑
      let answer = "Sorry, I couldn't process your request. Please try again later.";
      try {
        const lowerQuestion = userInput.toLowerCase().trim();
        if (lowerQuestion.includes("hello") || lowerQuestion.includes("hi")) {
          answer = botResponses.hello;
        } else if (lowerQuestion.includes("what is esg")) {
          answer = botResponses["what is esg"];
        } else if (lowerQuestion.includes("how are ratings calculated")) {
          answer = botResponses["how are ratings calculated"];
        } else if (lowerQuestion.includes("which car brand has the best esg rating")) {
          answer = botResponses["which car brand has the best esg rating"];
        } else if (lowerQuestion.includes("what is sentiment score")) {
          answer = botResponses["what is sentiment score"];
        } else if (lowerQuestion.includes("how accurate are the predictions")) {
          answer = botResponses["how accurate are the predictions"];
        } else {
          answer = botResponses.default;
        }
      } catch (e) {
        console.error("Error using fallback responses:", e);
      }
      setChatMessages((prev) => [...prev, { sender: "bot", text: answer }]);
    }
  };

  // Handle file upload for sentiment data
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    // Reset status
    setUploadSuccess(false);
    setUploadError(false);
  
    // 创建FormData对象
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      // 显示加载中状态
      setIsLoadingPerformance(true);
      
      // 发送文件到FastAPI后端
      const response = await fetch('/api/upload-sentiment', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload file');
      }
      
      const result = await response.json();
      
      // 处理返回的数据 - 保留原有格式但使用新数据
      const newSentimentData = {
        // 公司名称作为键
        ...result,
        // 将上传状态设置为成功
        uploadSuccess: true
      };
      
      // 更新状态，但不改变原有的数据结构
      setUploadedSentimentData(newSentimentData);
      setUploadSuccess(true);
      
      // 自动切换到sentiment选项卡查看结果
      document.querySelector('[value="sentiment"]')?.click();
      
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadError(true);
    } finally {
      setIsLoadingPerformance(false);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Helper function to get energy type icon
  const getEnergyTypeIcon = (type) => {
    switch (type) {
      case "electric":
        return <Zap className="h-5 w-5 text-blue-500" />
      case "hybrid":
        return (
          <div className="flex">
            <Zap className="h-5 w-5 text-blue-500" />
            <Fuel className="h-5 w-5 text-orange-500" />
          </div>
        )
      case "fuel":
        return <Fuel className="h-5 w-5 text-orange-500" />
      default:
        return <Fuel className="h-5 w-5 text-gray-500" />
    }
  }

  // Helper function to get energy consumption unit
  const getEnergyConsumptionUnit = (type) => {
    switch (type) {
      case "electric":
        return "kWh/100mi"
      case "hybrid":
      case "fuel":
        return "L/100km"
      default:
        return "units"
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

// 替换为：
if (showCover) {
  return <CoverPage onExplore={() => setShowCover(false)} />;
}

  return (
    <div className="container mx-auto py-6 px-4 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          <Car className="mr-2 h-8 w-8 text-green-600" />
          ESG Car Rating Dashboard
        </h1>
        <p className="text-muted-foreground">
          Comprehensive analysis of automotive industry sustainability performance
        </p>
      </header>

      {/* Brand and Model Selection */}
      <div className="mb-8 p-4 bg-slate-50 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="w-full md:w-1/3">
            <Label htmlFor="brand-select">Select Brand</Label>
            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
              <SelectTrigger id="brand-select">
                <SelectValue placeholder="Select Brand" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="All Brands">All Brands</SelectItem>
                {csvPerformanceData.length > 0 
                  ? [...new Set(csvPerformanceData.map(item => item.Company))].map(company => (
                      <SelectItem key={company} value={company}>
                        {company}
                      </SelectItem>
                    ))
                  : carBrands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.name}>
                        {brand.name}
                      </SelectItem>
                    ))
                }
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-1/3">
            <Label htmlFor="model-select">Select Model</Label>
            <Select value={selectedModel} onValueChange={setSelectedModel} disabled={selectedBrand === "All Brands"}>
              <SelectTrigger id="model-select">
                <SelectValue placeholder="Select Model" />
              </SelectTrigger>
              <SelectContent>
                {availableModels.map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-1/3">
            <Label htmlFor="file-upload">Upload Sentiment Data</Label>
            <div className="flex gap-2">
              <Input
                id="file-upload"
                type="file"
                accept=".pdf,.csv,.json,.xlsx"
                onChange={handleFileUpload}
                ref={fileInputRef}
                className="text-sm"
              />
              <Button size="icon" variant="outline">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {uploadSuccess && (
          <Alert className="mt-4 bg-green-50 border-green-200">
            <AlertCircle className="h-4 w-4 text-green-600" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>Sentiment data has been successfully uploaded and processed.</AlertDescription>
          </Alert>
        )}

        {uploadError && (
          <Alert className="mt-4 bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              There was an error processing your file. Please ensure it's in the correct format.
            </AlertDescription>
          </Alert>
        )}
      </div>

      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="performance" className="flex items-center">
            <Gauge className="mr-2 h-4 w-4" />
            <span>Car Performance</span>
          </TabsTrigger>
          <TabsTrigger value="sentiment" className="flex items-center">
            <LineChart className="mr-2 h-4 w-4" />
            <span>Sentiment Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="prediction" className="flex items-center">
            <TrendingUp className="mr-2 h-4 w-4" />
            <span>ESG Performance</span>
          </TabsTrigger>
          <TabsTrigger value="stocks" className="flex items-center">
            <BarChart3 className="mr-2 h-4 w-4" />
            <span>Stock Performance</span>
          </TabsTrigger>
        </TabsList>

        {/* Performance Tab */}
<TabsContent value="performance">
  {isLoadingPerformance ? (
    <div className="flex items-center justify-center h-40">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]" role="status">
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
        </div>
        <p className="mt-2">Loading performance data...</p>
      </div>
    </div>
  ) : csvPerformanceData.length > 0 ? (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {csvPerformanceData
        .filter(item => selectedBrand === "All Brands" || item.Company === selectedBrand)
        .filter(item => selectedModel === "All Models" || item["Car model"].includes(selectedModel))
        .map((item, index) => (
          <Card key={index} className="overflow-hidden">

<CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 py-2">
  <div className="flex items-center justify-between">
    <div className="space-y-0.5">
      <CardTitle className="text-lg">{item.Company}</CardTitle>
      <CardDescription className="capitalize">
        {item["Car model"]}
      </CardDescription>
      <div className="flex items-center">
        {item["Energy_type"] === "electricity" ? (
          <Zap className="h-4 w-4 text-amber-500" />
        ) : item["Energy_type"] === "hybrid" ? (
          <div className="flex">
            <Zap className="h-4 w-4 text-amber-500 mr-1" />
            <Fuel className="h-4 w-4 text-blue-500" />
          </div>
        ) : (
          <Fuel className="h-4 w-4 text-blue-500" />
        )}
        <CardDescription className="ml-1 capitalize">
          {item["Energy_type"]}
        </CardDescription>
      </div>
    </div>
    
  </div>
</CardHeader>


<CardContent className="pt-4">
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center text-left">
        <Gauge className="h-4 w-4 text-red-500 mr-1" />
        <span className="text-sm font-medium">Horsepower</span>
      </div>
      <span className="text-sm font-medium text-right min-w-[80px]">{item["Horsepower(hp)"]} hp</span>
    </div>

    <div className="flex items-center justify-between">
      <div className="flex items-center text-left">
        <Timer className="h-4 w-4 text-amber-500 mr-1" />
        <span className="text-sm font-medium">0-100 km/h</span>
      </div>
      <span className="text-sm font-medium text-right min-w-[80px]">{item["Acceleration 0 to 100 km/h (seconds)"]}s</span>
    </div>

    <div className="flex items-center justify-between">
  <div className="flex items-center text-left">
    <Fuel className="h-4 w-4 text-blue-500 mr-1" />
    <span className="text-sm font-medium">Energy Consumption</span>
  </div>
  <span className="text-sm font-medium text-right min-w-[60px]">
    {
      (() => {
        const val1 = item["Average_energy_consumption_1 (kWh/100km)"];
        const val2 = item["Average_energy_consumption_2_3 (L/100km)"];
        const energyType = item["Energy_type"];

        const kWhPart = val1 ? `${val1} kWh/100km` : "";
        const LPart = val2 ? `${val2} L/100km` : "";

        // 两者都有值时拼接中间加 “ | ”，否则只显示有值的
        if (kWhPart && LPart) return `${kWhPart} | ${LPart}`;
        if (kWhPart) return kWhPart;
        if (LPart) return LPart;
        return "N/A";
      })()
    }
  </span>
</div>

    
    <Separator />


<div className="space-y-2">
  <div className="flex items-center justify-between">
    <span className="text-sm font-medium">Overall Score</span>
    <span className="text-sm font-medium text-right">{parseFloat(item["Score overall balanced"]).toFixed(1)}</span>
  </div>
  <Progress 
    value={parseFloat(item["Score overall balanced"])} 
    max={100}
    className="h-2 bg-green-100" // 改为浅绿色背景
    indicatorClassName="bg-green-500" // 保持深绿色进度条
  />
</div>

<div className="space-y-2">
  <div className="flex items-center justify-between">
    <span className="text-sm font-medium">Performance</span>
    <span className="text-sm font-medium text-right">{parseFloat(item["Score performance oriented"]).toFixed(1)}</span>
  </div>
  <Progress 
    value={parseFloat(item["Score performance oriented"])} 
    max={100}
    className="h-2 bg-red-100" 
    indicatorClassName="bg-red-500"
  />
</div>

<div className="space-y-2">
  <div className="flex items-center justify-between">
    <span className="text-sm font-medium">Environment</span>
    <span className="text-sm font-medium text-right">{parseFloat(item["Score environment oriented"]).toFixed(1)}</span>
  </div>
  <Progress 
    value={parseFloat(item["Score environment oriented"])} 
    max={100}
    className="h-2 bg-blue-100" 
    indicatorClassName="bg-blue-500"
  />
</div>

<div className="space-y-2">
  <div className="flex items-center justify-between">
    <span className="text-sm font-medium">Cost Efficiency</span>
    <span className="text-sm font-medium text-right">{parseFloat(item["Score expenditure oriented"]).toFixed(1)}</span>
  </div>
  <Progress 
    value={parseFloat(item["Score expenditure oriented"])} 
    max={100}
    className="h-2 bg-amber-100" // 改为浅黄色背景 
    indicatorClassName="!bg-amber-500" // 保持深黄色进度条
  />
</div>

  </div>
</CardContent>
          </Card>
        ))}
        
        {csvPerformanceData
          .filter(item => selectedBrand === "All Brands" || item.Company === selectedBrand)
          .filter(item => selectedModel === "All Models" || item["Car model"].includes(selectedModel))
          .length === 0 && (
          <div className="col-span-full text-center py-10">
            <p className="text-xl font-medium">No matching data found</p>
            <p className="text-muted-foreground mt-2">Try selecting a different brand or model.</p>
          </div>
        )}
    </div>
  ) : (
    // 如果CSV数据为空，回退到使用原始品牌数据
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {filteredBrands.map((brand) => (
        <Card key={brand.id} className="overflow-hidden">

<CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 pb-2">
  <div className="flex items-center justify-between">
    <div>
      <CardTitle className="text-lg">{brand.name}</CardTitle>
      <div className="flex items-center">
        {brand.performance.energyType === "electric" ? (
          <Zap className="h-4 w-4 text-amber-500" />
        ) : brand.performance.energyType === "hybrid" ? (
          <div className="flex">
            <Zap className="h-4 w-4 text-amber-500 mr-1" />
            <Fuel className="h-4 w-4 text-blue-500" />
          </div>
        ) : (
          <Fuel className="h-4 w-4 text-blue-500" />
        )}
        <CardDescription className="ml-1 capitalize">
          {brand.performance.energyType}
        </CardDescription>
      </div>
    </div>
    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
      <span className="font-bold text-green-700">{brand.overall}</span>
    </div>
  </div>
</CardHeader>

<CardContent className="pt-4">
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <Gauge className="h-4 w-4 text-red-500 mr-1" />
        <span className="text-sm font-medium">Horsepower</span>
      </div>
      <span className="text-sm font-medium text-right">{brand.performance.horsepower} hp</span>
    </div>

    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <Timer className="h-4 w-4 text-amber-500 mr-1" />
        <span className="text-sm font-medium">0-60 mph</span>
      </div>
      <span className="text-sm font-medium text-right">{brand.performance.acceleration}s</span>
    </div>

    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <Fuel className="h-4 w-4 text-blue-500 mr-1" />
        <span className="text-sm font-medium">Energy Consumption</span>
      </div>
      <span className="text-sm font-medium text-right">
        {brand.performance.energyType === "electric" 
          ? `${brand.performance.energyConsumption} kWh/100mi` 
          : brand.performance.energyType === "hybrid"
            ? `${brand.performance.energyConsumption} kWh/100mi | ${brand.performance.energyConsumption} L/100km`
            : `${brand.performance.energyConsumption} L/100km`}
      </span>
    </div>

    <Separator />

    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Leaf className="h-4 w-4 text-green-600 mr-1" />
          <span className="text-sm font-medium">Environmental</span>
        </div>
        <span className="text-sm font-medium text-right">{brand.environmental}</span>
      </div>
      <Progress
        value={brand.environmental}
        className="h-2 bg-green-100"
        indicatorClassName="bg-green-500"
      />
    </div>

    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Users className="h-4 w-4 text-blue-600 mr-1" />
          <span className="text-sm font-medium">Social</span>
        </div>
        <span className="text-sm font-medium text-right">{brand.social}</span>
      </div>
      <Progress value={brand.social} className="h-2 bg-blue-100" indicatorClassName="bg-blue-500" />
    </div>

    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Building2 className="h-4 w-4 text-purple-600 mr-1" />
          <span className="text-sm font-medium">Governance</span>
        </div>
        <span className="text-sm font-medium text-right">{brand.governance}</span>
      </div>
      <Progress
        value={brand.governance}
        className="h-2 bg-purple-100"
        indicatorClassName="bg-purple-500"
      />
    </div>
  </div>
</CardContent>
        </Card>
      ))}
    </div>
  )}
</TabsContent>

        {/* Sentiment Analysis Tab */}
<TabsContent value="sentiment">
  {/* 如果有新上传的数据，显示提示信息和专门的卡片 */}
  {uploadedSentimentData && uploadSuccess && (
    <>
      <Alert className="mb-4 bg-green-50 border-green-200">
        <div className="flex items-center">
          <div className="h-4 w-4 mr-2 text-green-600">✓</div>
          <AlertTitle>Analysis Completed</AlertTitle>
        </div>
        <AlertDescription>
          ESG sentiment analysis for {uploadedSentimentData.company} has been completed successfully.
          The results are shown below.
        </AlertDescription>
      </Alert>

      <Card className="col-span-1 md:col-span-2 mb-6">
        <CardHeader>
          <CardTitle>Uploaded Document Sentiment Analysis</CardTitle>
          <CardDescription>Results from your uploaded ESG report</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold">{uploadedSentimentData.company}</h3>
                <p className="text-sm text-muted-foreground">ESG Report Analysis</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">{uploadedSentimentData.sentiment.overall.toFixed(5)}</div>
                <p className="text-sm text-muted-foreground">Overall Polarity</p>
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2 bg-green-50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span className="font-medium">Environmental</span>
                  <span>{uploadedSentimentData.sentiment.environmental.toFixed(5)}</span>
                </div>
                <div className="w-full bg-green-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-green-500 h-full rounded-full" 
                    style={{ width: `${Math.min(Math.max(uploadedSentimentData.sentiment.environmental/0.6*100, 0), 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="space-y-2 bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span className="font-medium">Social</span>
                  <span>{uploadedSentimentData.sentiment.social.toFixed(5)}</span>
                </div>
                <div className="w-full bg-blue-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full"
                    style={{ width: `${Math.min(Math.max(uploadedSentimentData.sentiment.social/0.6*100, 0), 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="space-y-2 bg-purple-50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span className="font-medium">Governance</span>
                  <span>{uploadedSentimentData.sentiment.governance.toFixed(5)}</span>
                </div>
                <div className="w-full bg-purple-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-purple-500 h-full rounded-full"
                    style={{ width: `${Math.min(Math.max(uploadedSentimentData.sentiment.governance/0.6*100, 0), 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            {/* 分类指示器 */}
            <div className="mt-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Sentiment Classification</span>
                {uploadedSentimentData.sentiment.overall > 0.1 ? (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800">Positive</span>
                ) : uploadedSentimentData.sentiment.overall > -0.1 ? (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-800">Neutral</span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-800">Negative</span>
                )}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 mt-2 overflow-hidden">
                <div
                  className={`h-full ${
                    uploadedSentimentData.sentiment.overall > 0.1
                      ? "bg-green-500"
                      : uploadedSentimentData.sentiment.overall > -0.1
                      ? "bg-amber-400"
                      : "bg-red-500"
                  } text-white text-xs flex items-center justify-center`}
                  style={{ width: `${Math.min(Math.max(uploadedSentimentData.sentiment.overall/0.6*100, 0), 100)}%` }}
                >
                  {uploadedSentimentData.sentiment.overall.toFixed(5)}
                </div>
              </div>
            </div>
            
            
          </div>
        </CardContent>
      </Card>
    </>
  )}


  {/* 添加空行，增加分隔 */}
  {uploadedSentimentData && uploadSuccess && <div className="h-8"></div>}

  <div className="grid gap-6 md:grid-cols-2">
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>ESG Sentiment Polarity Scores</CardTitle>
          <CardDescription>Weighted Average Polarity Score from sentiment analysis</CardDescription>
        </div>
        
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredBrands.map((brand) => ({
                name: brand.name,
                score: brand.sentiment.overall,
              }))}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={100} // 增加X轴高度
                interval={0} // 确保显示所有标签
                tick={{fontSize: 15}} // 调整字体大小
              />
              <YAxis domain={[0, 0.5]} />
              <Tooltip formatter={(value) => value.toFixed(5)} />
              <Bar dataKey="score" name="Weighted Average Polarity Score">
                {filteredBrands.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>ESG Sentiment Polarity Breakdown</CardTitle>
        <CardDescription>Environmental, Social, and Governance polarity components</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredBrands.map((brand) => ({
                name: brand.name,
                environmental: brand.sentiment.environmental,
                social: brand.sentiment.social,
                governance: brand.sentiment.governance,
              }))}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={100} // 增加X轴高度
                interval={0} // 确保显示所有标签
                tick={{fontSize: 15}} // 调整字体大小
              />
              <YAxis domain={[-0.2, 0.6]} />
              <Tooltip formatter={(value) => value.toFixed(5)} />
              <Legend 
        verticalAlign="bottom" 
        height={50} 
        wrapperStyle={{paddingTop: "40px", bottom: "35px"}} 
        layout="horizontal"
        align="center"
      />
              <Bar dataKey="environmental" name="Environment Polarity Score" fill={ESG_COLORS.environmental} />
              <Bar dataKey="social" name="Social Polarity Score" fill={ESG_COLORS.social} />
              <Bar dataKey="governance" name="Governance Polarity Score" fill={ESG_COLORS.governance} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>ESG Sentiment Data Table</CardTitle>
        <CardDescription>Raw polarity scores from sentiment analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="bg-yellow-100 text-left p-2 border">Company Name</th>
                <th className="bg-green-100 text-left p-2 border">Environment Polarity Score</th>
                <th className="bg-blue-100 text-left p-2 border">Social Polarity Score</th>
                <th className="bg-purple-100 text-left p-2 border">Governance Polarity Score</th>
                <th className="bg-red-100 text-left p-2 border">Weighted Average Polarity Score</th>
              </tr>
            </thead>
            <tbody>
              {filteredBrands.map((brand) => (
                <tr key={brand.id}>
                  <td className="p-2 border text-black-600 font-bold">{brand.name}</td>
                  <td className="p-2 border">{brand.sentiment.environmental.toFixed(5)}</td>
                  <td className="p-2 border">{brand.sentiment.social.toFixed(5)}</td>
                  <td className="p-2 border">{brand.sentiment.governance.toFixed(5)}</td>
                  <td className="p-2 border font-bold">{brand.sentiment.overall.toFixed(5)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader>
        <CardTitle>Sentiment Classification</CardTitle>
        <CardDescription>
          Distribution of positive, neutral, and negative sentiment across brands
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {filteredBrands.map((brand) => {
                    // Determine sentiment classification and color
                    let sentiment = ""
                    let bgColor = ""
                    let textColor = ""
                    let width = ""

                    if (brand.sentiment.overall > 0.1) {
                      sentiment = "Positive"
                      bgColor = "bg-green-500"
                      textColor = "text-black"
                      width = `${(brand.sentiment.overall / 0.6) * 100}%` // Scale to max expected value
                    } else if (brand.sentiment.overall > -0.1) {
                      sentiment = "Neutral"
                      bgColor = "bg-amber-400"
                      textColor = "text-black"
                      width = `${(brand.sentiment.overall / 0.6) * 100}%`
                    } else {
                      sentiment = "Negative"
                      bgColor = "bg-red-500"
                      textColor = "text-black"
                      width = `${(brand.sentiment.overall / 0.6) * 100}%`
                    }

                    return (
                      <div key={brand.id} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{brand.name}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs ${
                              sentiment === "Positive"
                                ? "bg-green-100 text-green-800"
                                : sentiment === "Neutral"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {sentiment} 
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden relative flex items-center">
  <div
    className={`h-full ${bgColor}`}
    style={{ width }}
  />
  <div className="ml-2 text-xs text-gray-700">
    {brand.sentiment.overall.toFixed(5)}
  </div>
</div>

                      </div>
                    )          })}
        </div>
        <div className="flex justify-center mt-6 space-x-4 text-xs">
      <div className="flex items-center">
        <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
        <span>Positive (&gt;0.1, ≤1)</span>
      </div>
      <div className="flex items-center">
        <div className="w-4 h-4 bg-amber-400 rounded mr-2"></div>
        <span>Neutral (&gt;-0.1, ≤0.1)</span>
      </div>
      <div className="flex items-center">
        <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
        <span>Negative (&gt;=-1, ≤-0.1)</span>
          </div>
        </div>
      </CardContent>
    </Card>
    
    <Card className="col-span-1 md:col-span-2 mt-6">
      <CardHeader>
        <CardTitle>ESG Polarity Radar Analysis</CardTitle>
        <CardDescription>Multi-dimensional view of sentiment polarity across ESG dimensions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart
              outerRadius={180}
              width={730}
              height={500}
              data={[
                {
                  subject: "Environmental",
                  ...filteredBrands.reduce((acc, brand) => {
                    acc[brand.name] = brand.sentiment.environmental;
                    return acc;
                  }, {}),
                  fullMark: 0.6,
                },
                {
                  subject: "Social",
                  ...filteredBrands.reduce((acc, brand) => {
                    acc[brand.name] = brand.sentiment.social;
                    return acc;
                  }, {}),
                  fullMark: 0.6,
                },
                {
                  subject: "Governance",
                  ...filteredBrands.reduce((acc, brand) => {
                    acc[brand.name] = brand.sentiment.governance;
                    return acc;
                  }, {}),
                  fullMark: 0.6,
                },
              ]}
            >
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[-1, 1]} />
              {filteredBrands.map((brand, index) => (
                <Radar 
                  key={brand.id}
                  name={brand.name} 
                  dataKey={brand.name} 
                  stroke={COLORS[index % COLORS.length]} 
                  fill={COLORS[index % COLORS.length]} 
                  fillOpacity={0.6} 
                />
              ))}
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  </div>
</TabsContent>

        {/* ESG Performance Tab */}
        <TabsContent value="prediction">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>ESG Performance Score Radar</CardTitle>
                <CardDescription>Multi-dimensional ESG performance analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[500px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart
                      outerRadius={150}
                      width={730}
                      height={500}
                      data={[
                        {
                          subject: "Environmental",
                          Audi: 50,
                          BMW: 40,
                          BYD: 40,
                          "Ford Motor Company": 46,
                          Hyundai: 40,
                          "Mercedes-Benz Group AG": 38,
                          Tesla: 43,
                          Toyota: 50,
                          Volkswagen: 38,
                          "Xiao Peng": 41,
                          fullMark: 100,
                        },
                        {
                          subject: "Social",
                          Audi: 22,
                          BMW: 25,
                          BYD: 25,
                          "Ford Motor Company": 25,
                          Hyundai: 20,
                          "Mercedes-Benz Group AG": 25,
                          Tesla: 25,
                          Toyota: 25,
                          Volkswagen: 24,
                          "Xiao Peng": 25,
                          fullMark: 100,
                        },
                        {
                          subject: "Governance",
                          Audi: 23,
                          BMW: 25,
                          BYD: 23,
                          "Ford Motor Company": 25,
                          Hyundai: 20,
                          "Mercedes-Benz Group AG": 24,
                          Tesla: 25,
                          Toyota: 21,
                          Volkswagen: 24,
                          "Xiao Peng": 21,
                          fullMark: 100,
                        }
                      ]}
                      style={{ position: 'relative' }}
                    >
                      <PolarGrid />
                      <PolarAngleAxis 
                        dataKey="subject" 
                        tick={({ payload, x, y, textAnchor, stroke, radius }) => {
                          let score = "";
                          if (selectedBrand !== "All Brands") {
                            if (payload.value === "Environmental") {
                              score = selectedBrand === "Audi" ? "(50)" :
                                     selectedBrand === "BMW" ? "(40)" :
                                     selectedBrand === "BYD" ? "(40)" :
                                     selectedBrand === "Ford Motor Company" ? "(46)" :
                                     selectedBrand === "Hyundai" ? "(40)" :
                                     selectedBrand === "Mercedes-Benz Group AG" ? "(38)" :
                                     selectedBrand === "Tesla" ? "(43)" :
                                     selectedBrand === "Toyota" ? "(50)" :
                                     selectedBrand === "Volkswagen" ? "(38)" :
                                     selectedBrand === "Xiao Peng" ? "(41)" : "";
                            } else if (payload.value === "Social") {
                              score = selectedBrand === "Audi" ? "(22)" :
                                     selectedBrand === "BMW" ? "(25)" :
                                     selectedBrand === "BYD" ? "(25)" :
                                     selectedBrand === "Ford Motor Company" ? "(25)" :
                                     selectedBrand === "Hyundai" ? "(20)" :
                                     selectedBrand === "Mercedes-Benz Group AG" ? "(25)" :
                                     selectedBrand === "Tesla" ? "(25)" :
                                     selectedBrand === "Toyota" ? "(25)" :
                                     selectedBrand === "Volkswagen" ? "(24)" :
                                     selectedBrand === "Xiao Peng" ? "(25)" : "";
                            } else if (payload.value === "Governance") {
                              score = selectedBrand === "Audi" ? "(23)" :
                                     selectedBrand === "BMW" ? "(25)" :
                                     selectedBrand === "BYD" ? "(23)" :
                                     selectedBrand === "Ford Motor Company" ? "(25)" :
                                     selectedBrand === "Hyundai" ? "(20)" :
                                     selectedBrand === "Mercedes-Benz Group AG" ? "(24)" :
                                     selectedBrand === "Tesla" ? "(25)" :
                                     selectedBrand === "Toyota" ? "(21)" :
                                     selectedBrand === "Volkswagen" ? "(24)" :
                                     selectedBrand === "Xiao Peng" ? "(21)" : "";
                            }
                          }
                          return (
                            <text x={x} y={y} textAnchor={textAnchor} fill="#666">
                              {`${payload.value} ${score}`}
                            </text>
                          );
                        }}
                      />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      {(selectedBrand === "All Brands" ? [
                        "Audi",
                        "BMW",
                        "BYD",
                        "Ford Motor Company",
                        "Hyundai",
                        "Mercedes-Benz Group AG",
                        "Tesla",
                        "Toyota",
                        "Volkswagen",
                        "Xiao Peng"
                      ] : [selectedBrand]).map((brand) => {
                        // 为每个品牌分配固定的颜色索引
                        const brandColorIndex = [
                          "Audi",
                          "BMW",
                          "BYD",
                          "Ford Motor Company",
                          "Hyundai",
                          "Mercedes-Benz Group AG",
                          "Tesla",
                          "Toyota",
                          "Volkswagen",
                          "Xiao Peng"
                        ].indexOf(brand);

                        // 计算总分
                        const totalScore = brand === "Audi" ? 95 :
                                         brand === "BMW" ? 90 :
                                         brand === "BYD" ? 88 :
                                         brand === "Ford Motor Company" ? 96 :
                                         brand === "Hyundai" ? 80 :
                                         brand === "Mercedes-Benz Group AG" ? 87 :
                                         brand === "Tesla" ? 93 :
                                         brand === "Toyota" ? 96 :
                                         brand === "Volkswagen" ? 86 :
                                         brand === "Xiao Peng" ? 87 : 0;
                        
                        return (
                        <Radar
                            key={brand}
                            name={`${brand}${selectedBrand !== "All Brands" ? ` (Total: ${totalScore})` : ''}`}
                            dataKey={brand}
                            stroke={COLORS[brandColorIndex]}
                            fill={COLORS[brandColorIndex]}
                          fillOpacity={0.6}
                        />
                        );
                      })}
                      <Legend formatter={(value) => {
                        const match = value.match(/^(.*?) \(Total: (\d+)\)$/);
                        return match ? `${match[1]} (Total: ${match[2]})` : value;
                      }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-5 gap-4">
                  {[
                    { name: "Audi", score: 95 },
                    { name: "BMW", score: 90 },
                    { name: "BYD", score: 88 },
                    { name: "Ford Motor Company", score: 96 },
                    { name: "Hyundai", score: 80 },
                    { name: "Mercedes-Benz Group AG", score: 87 },
                    { name: "Tesla", score: 93 },
                    { name: "Toyota", score: 96 },
                    { name: "Volkswagen", score: 86 },
                    { name: "Xiao Peng", score: 87 }
                  ].map((brand) => (
                    <div 
                      key={brand.name}
                      className={`p-3 rounded-lg text-center transition-all duration-200 ${
                        selectedBrand === brand.name 
                          ? 'bg-primary/10 shadow-lg scale-105' 
                          : 'bg-muted/50'
                      }`}
                    >
                      <div className="text-sm font-medium truncate">{brand.name}</div>
                      <div className={`text-xl font-bold ${
                        selectedBrand === brand.name 
                          ? 'text-primary' 
                          : 'text-muted-foreground'
                      }`}>
                        {brand.score}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1 md:col-span-2 mt-6">
              <CardHeader>
                <CardTitle>Number of Cars Produced Prediction</CardTitle>
                <CardDescription>Projected cars production</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart
                      data={[
                        {
                          year: "2023",
                          Audi: 1781734,
                          BMW: 2529524,
                          BYD: 2681307,
                          "Ford Motor Company": 3822752,
                          Hyundai: 4050977,
                          "Mercedes-Benz Group AG": 1196369,
                          Tesla: 1768473,
                          Toyota: 10416779,
                          Volkswagen: 1031578,
                          "Xiao Peng": 149894
                        },
                        {
                          year: "2024",
                          Audi: 1785697,
                          BMW: 2561770,
                          BYD: 3169480,
                          "Ford Motor Company": 3572350,
                          Hyundai: 4038658,
                          "Mercedes-Benz Group AG": 1142105,
                          Tesla: 2150611,
                          Toyota: 11017798,
                          Volkswagen: 1218105,
                          "Xiao Peng": 184586
                        },
                        {
                          year: "2025",
                          Audi: 1789660,
                          BMW: 2594016,
                          BYD: 3657653,
                          "Ford Motor Company": 3321947,
                          Hyundai: 4026340,
                          "Mercedes-Benz Group AG": 1087840,
                          Tesla: 2532749,
                          Toyota: 11618817,
                          Volkswagen: 1404632,
                          "Xiao Peng": 219278
                        },
                        {
                          year: "2026",
                          Audi: 1793623,
                          BMW: 2626263,
                          BYD: 4145826,
                          "Ford Motor Company": 3071544,
                          Hyundai: 4014021,
                          "Mercedes-Benz Group AG": 1033575,
                          Tesla: 2914887,
                          Toyota: 12219836,
                          Volkswagen: 1591159,
                          "Xiao Peng": 253970
                        },
                        {
                          year: "2027",
                          Audi: 1797586,
                          BMW: 2658509,
                          BYD: 4633999,
                          "Ford Motor Company": 2821141,
                          Hyundai: 4001703,
                          "Mercedes-Benz Group AG": 979311,
                          Tesla: 3297025,
                          Toyota: 12820855,
                          Volkswagen: 1777685,
                          "Xiao Peng": 288662
                        },
                        {
                          year: "2028",
                          Audi: 1801549,
                          BMW: 2690755,
                          BYD: 5122172,
                          "Ford Motor Company": 2570739,
                          Hyundai: 3989384,
                          "Mercedes-Benz Group AG": 925046,
                          Tesla: 3679163,
                          Toyota: 13421874,
                          Volkswagen: 1964212,
                          "Xiao Peng": 323353
                        },
                        {
                          year: "2029",
                          Audi: 1805512,
                          BMW: 2723001,
                          BYD: 5610345,
                          "Ford Motor Company": 2320336,
                          Hyundai: 3977066,
                          "Mercedes-Benz Group AG": 870781,
                          Tesla: 4061301,
                          Toyota: 14022893,
                          Volkswagen: 2150739,
                          "Xiao Peng": 357353
                        }
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis 
                        tickFormatter={(value) => new Intl.NumberFormat().format(value)}
                        width={100}
                      />
                      <Tooltip formatter={(value) => new Intl.NumberFormat().format(Number(value))} />
                      <Legend />
                      {(selectedBrand === "All Brands" ? [
                        "Audi",
                        "BMW",
                        "BYD",
                        "Ford Motor Company",
                        "Hyundai",
                        "Mercedes-Benz Group AG",
                        "Tesla",
                        "Toyota",
                        "Volkswagen",
                        "Xiao Peng"
                      ] : [selectedBrand]).map((brand, index) => {
                        const brandColorIndex = [
                          "Audi",
                          "BMW",
                          "BYD",
                          "Ford Motor Company",
                          "Hyundai",
                          "Mercedes-Benz Group AG",
                          "Tesla",
                          "Toyota",
                          "Volkswagen",
                          "Xiao Peng"
                        ].indexOf(brand);
                        
                        return (
                          <Line
                            key={brand}
                            type="monotone"
                            dataKey={brand}
                            stroke={COLORS[brandColorIndex]}
                            strokeWidth={2}
                          />
                        );
                      })}
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Stock Performance Tab - 更新这部分 */}
        <TabsContent value="stocks">
          {isLoadingStocks && stockData.length === 0 ? (
            <div className="flex items-center justify-center h-40">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]" role="status">
                  <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                </div>
                <p className="mt-2">Loading real-time stock data...</p>
              </div>
            </div>
          ) : (
            <>
              {stockError && (
                <Alert className="mb-4 bg-amber-50 border-amber-200">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertTitle>Warning</AlertTitle>
                  <AlertDescription>
                    There was an issue fetching the latest stock data. Some information may not be up to date.
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-5">
                {stockData
                  .filter((stock) => selectedBrand === "All Brands" || stock.name === selectedBrand)
                  .map((stock, index) => (
                    <Card key={index} className={stock.change >= 0 ? "border-green-200" : "border-red-200"}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <CardTitle>{stock.name}</CardTitle>
                            <CardDescription className="text-xs">{stock.ticker}</CardDescription>
                          </div>
                          <Badge variant={stock.change >= 0 ? "default" : "destructive"} className="ml-2">
                            {stock.change >= 0 ? "+" : ""}
                            {stock.change.toFixed(2)}
                            {stock.changePercent ? ` (${stock.changePercent.toFixed(2)}%)` : ''}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>

  <div className="text-3xl font-bold mb-2">
    {stock.currency === "EUR" ? "€" : "$"}{stock.price.toFixed(2)}
  </div>
  {stock.marketCap > 0 && (
    <div className="text-sm text-muted-foreground mb-2">
      Market Cap: {new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: stock.currency || 'USD',
        notation: 'compact',
        maximumFractionDigits: 1
      }).format(stock.marketCap)}
    </div>
  )}
  <div className="h-[100px]">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={stock.historicalData || []}>
        <Area
          type="monotone"
          dataKey="value"
          stroke={stock.change >= 0 ? "#10B981" : "#EF4444"}
          fill={stock.change >= 0 ? "#D1FAE5" : "#FEE2E2"}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
  {stock.error && (
    <div className="text-xs text-amber-600 mt-1">
      Data may not be real-time
    </div>
  )}
</CardContent>
                    </Card>
                  ))}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Chat Bot */}
      <div className={`fixed bottom-6 right-6 z-50 ${chatOpen ? "w-80" : "w-auto"}`}>
        {chatOpen ? (
          <Card className="shadow-lg">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div className="flex items-center space-x-2">
               
                <div>
                  <CardTitle className="text-base">ESG Assistant</CardTitle>
                  <CardDescription>Ask me about ESG ratings</CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setChatOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-60 overflow-y-auto mb-4 space-y-4">
              {chatMessages.map((message, index) => (
  <div key={index} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
    {message.sender === "bot" && (
      <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0">
        <AvatarFallback className="bg-green-100 text-green-800 text-xs">ESG</AvatarFallback>
      </Avatar>
    )}
    <div
      className={`max-w-[85%] rounded-lg px-4 py-2 shadow-sm ${
        message.sender === "user" 
          ? "bg-primary text-primary-foreground rounded-tr-none" 
          : "bg-muted rounded-tl-none border border-green-100"
      }`}
      dangerouslySetInnerHTML={{ __html: message.text }}
    />
    {message.sender === "user" && (
      <Avatar className="h-8 w-8 ml-2 mt-1 flex-shrink-0">
        <AvatarFallback className="bg-primary-foreground text-primary text-xs">YOU</AvatarFallback>
      </Avatar>
    )}
  </div>
))}
              
              </div>
              <form onSubmit={handleChatSubmit} className="flex gap-2">
                <Input
                  placeholder="Ask a question..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                />
                <Button type="submit" size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Button onClick={() => setChatOpen(true)} className="h-12 w-12 rounded-full shadow-lg" size="icon">
            <MessageCircle className="h-6 w-6" />
          </Button>
        )}
      </div>

{/* 返回顶部按钮 */}
<div className="fixed bottom-6 left-6 z-50">
  <Button 
    onClick={scrollToTop} 
    className="h-12 w-12 rounded-full shadow-lg" 
    variant="outline"
    style={{ backgroundColor: "black", borderColor: "black" }}
    size="icon"
  >
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="40" 
      height="40" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="white" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      {/* 顶部横线 - 放宽 */}
      <line x1="4" y1="2" x2="20" y2="2"></line>
      {/* 垂直线 - 加长 */}
      <polyline points="12,24 12,2"></polyline>
      {/* 箭头头部 - 更宽更高 */}
      <polyline points="5,11 12,4 19,11"></polyline>
    </svg>
  </Button>
</div>

{/* 添加空行增加分隔 */}
<div className="h-8"></div>
      {/* 添加返回封面按钮 */}
      <div className="flex justify-center mt-16 mb-8">
  <button
    onClick={() => setShowCover(true)}
    className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-muted text-muted-foreground hover:text-accent-foreground hover:bg-muted/80"
  >
    <ArrowLeft className="mr-2 h-4 w-4" />
    <span>Back to Home</span>
  </button>
</div>
    </div>
  )
}


