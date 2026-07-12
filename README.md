# AI Data Center Analytics Platform

<div align="center">
  <img src="https://img.shields.io/badge/status-production%20ready-brightgreen" alt="Status" />
  <img src="https://img.shields.io/github/license/Prem-W/ai-data-center-dashboard" alt="License" />
  <br />
  <i>Enterprise-grade observability, financial tracking, sustainability metrics, and predictive forecasting for modern AI infrastructure.</i>
</div>

<br />

![Dashboard Preview](https://via.placeholder.com/1200x600/0f172a/38bdf8?text=Add+Your+Live+Dashboard+Screenshot+Here)

## 📊 Overview

The AI Data Center Analytics Platform is an all-in-one, real-time command center designed for AI infrastructure operators, DevOps teams, and financial stakeholders. It bridges the gap between hardware utilization, financial ROI, environmental sustainability, and future capacity planning.

Built for heterogeneous clusters, it supports NVIDIA, AMD, Intel Gaudi, and Google TPU hardware, offering deep-dive analytics into model training costs, energy efficiency (PUE), and ML-powered forecasting.

## ✨ Key Features

### 1. Executive Overview
*   **Live KPIs**: Total Data Centers, Servers, Operational Cost, Carbon Emissions, and GPU Utilization.
*   **Trend Analysis**: Overall Utilization Trends (GPU vs. CPU).
*   **Global Footprint**: Infrastructure by Region and Server Status distribution (Active, Idle, Failed).

### 2. Infrastructure Monitoring
*   **Cluster Analytics**: Real-time utilization, health scores, availability, and failure rates segmented by specific GPUs (NVIDIA H100, B200, A100; AMD Instinct MI300X/MI250X; Intel Gaudi3; Google TPU v5p).
*   **Resource Tracking**: 7-day trends for CPU, GPU, Memory, and Storage.
*   **Location Status**: Table view detailing Active, Idle, Failed, and utilization rates across data centers in Virginia, Oregon, Texas, Ohio, Arizona, Montreal, California, Illinois, Frankfurt, and London.

### 3. AI Workloads
*   **Job Tracking**: Real-time counts and success rates for AI jobs, Training, and Inference tasks.
*   **Model Consumption**: Resource consumption (GPU hours) and detailed performance metrics for leading models including GPT-4, Llama 3, Gemini, Claude 3, PaLM 2, Mistral, Falcon, and Bloom.
*   **Project Costing**: Top resource-consuming projects with associated GPU hours and operational costs (USD).

### 4. Energy & Sustainability
*   **Carbon Footprint**: Track total carbon emissions (tCO₂e) and renewable energy percentages (Wind/Solar).
*   **Power Efficiency**: Global Average PUE (Power Usage Effectiveness) vs. target goals.
*   **Trend Analytics**: Energy consumption trends, PUE fluctuations, and emissions tracking by region alongside cooling efficiency metrics.

### 5. Financial Dashboard
*   **Live Revenue & Costs**: Operating Cost, Revenue Generated, Cost per GPU Hour, Maintenance, and ROI (TTM).
*   **Cost Breakdown**: Detailed cost structure (Infrastructure, Power/Cooling, Personnel, Maintenance).
*   **Trend Analytics**: Revenue vs. Cost trends, ROI trending, and a comprehensive Monthly Financial Summary (including Net Profit and Margin).

### 6. Predictive Analytics (AI-Powered Forecasting)
*   **ML Models**: Powered by Meta's **Prophet** and **ARIMA** algorithms (Model Accuracy: 94.2% MAPE, daily auto-retraining).
*   **Future Planning**: Forecasts for Future GPU Demand, Energy Consumption, Failure Probability, and Future Capacity Utilization.
*   **Cost Prediction**: 6-month financial cost forecasts to assist in budget planning.

## 🛠️ Tech Stack

*   **Frontend**: [Next.js](https://nextjs.org/) / [React](https://reactjs.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) / Dark Mode
*   **Data Visualization**: [Recharts](https://recharts.org/) / [Chart.js](https://www.chartjs.org/)
*   **Backend API**: [Node.js](https://nodejs.org/) / [Python FastAPI](https://fastapi.tiangolo.com/)
*   **Time-Series Forecasting**: [Prophet](https://facebook.github.io/prophet/) & [ARIMA](https://www.statsmodels.org/stable/tsa.html)
*   **Database**: PostgreSQL / MongoDB
*   **Hosting**: Vercel (Frontend) & Railway/Render (Backend)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or later)
- npm or yarn
- Python (v3.9+) if running the Prophet/ARIMA backend separately
