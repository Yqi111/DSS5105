# ESG Car Rating System

## Overview

The **ESG Car Rating System** is a comprehensive web application that evaluates both vehicle performance and the sustainability practices of automotive manufacturers through Environmental, Social, and Governance (ESG) metrics. This system combines technical specifications like safety, efficiency, and emissions with ESG data, offering consumers a balanced and standardized method to assess vehicles' sustainability.

By integrating ESG performance with car technical data, the system helps align consumer choices with environmental and social responsibility values.

## Features

- **Car Performance Tab**: Provides key metrics for each car model, including horsepower, acceleration, energy consumption, and overall performance score.
- **Sentiment Analysis Tab**: Analyzes and visualizes the sentiment of ESG reports, helping users understand the sustainability aspects of different car brands.
- **ESG Performance Tab**: Displays the ESG scores of various car brands, with a radar plot visualizing their performance across the E, S, and G metrics.
- **Stock Performance Tab**: Shows real-time stock performance data for the brands, including stock price, market cap, and price fluctuations.
- **DeepSeek Assistant**: An AI-powered assistant that allows users to compare brands and make data-driven investment recommendations.

## Prerequisites

Before you begin, make sure you have the following installed:

- [Node.js (LTS version)](https://nodejs.org/)
- [Python 3.8+](https://www.python.org/)
- [npm](https://www.npmjs.com/)
- A code editor of your choice (e.g., [VS Code](https://code.visualstudio.com/))
- [uvicorn](https://www.uvicorn.org/) (for FastAPI)

Install `uvicorn` with:

```bash
pip install uvicorn
```

## Project Structure

```
green-cars-esg/
├── app/                           # App Router structure 
│   ├── page.tsx                   # Entry page for frontend
│   └── ...                        # Other route files/components
├── components/                    # Frontend components
├── data/                          # CSVs, datasets
├── public/                        # Static files (images, fonts, etc.)
├── styles/                        # Tailwind & global styles
├── main.py                        # FastAPI backend
├── ...
```


## Run the Project Locally

### 1. Clone the Repository
```bash
git clone https://github.com/Yqi111/DSS5105.git
cd DSS5105/green-cars-esg
```

### 2. Create Python Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # For Windows, use venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Start Backend
```bash
uvicorn main:app --reload
```
The backend will run at http://127.0.0.1:8000.


### 5. Start Frontend
```bash
brew install node
pip install node
pip install next
npm run dev
```
The frontend will run at http://localhost:3000.


