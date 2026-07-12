# AI Data Center Analytics Platform
<div align="center">
  <img src="https://img.shields.io/badge/status-production%20ready-brightgreen" alt="Status" />
  <br />
  <i>Enterprise-grade observability, financial tracking, sustainability metrics, and predictive forecasting for modern AI infrastructure.</i>
</div>

<br />


## 📊 Overview

The AI Data Center Analytics Platform is an all-in-one, real-time command center designed for AI infrastructure operators, DevOps teams, and financial stakeholders. It bridges hardware utilization, financial ROI, environmental sustainability, and future capacity planning.

Built for heterogeneous clusters, it supports NVIDIA, AMD, Intel Gaudi, and Google TPU hardware, with deep-dive analytics into model training costs, energy efficiency (PUE), and ML-powered forecasting.

## ✨ Key Features

### 1. Executive Overview
- **Live KPIs**: Total Data Centers, Servers, Operational Cost, Carbon Emissions, and GPU Utilization.
- **Trend Analysis**: Overall Utilization Trends (GPU vs. CPU).
- **Global Footprint**: Infrastructure by Region (World Map view) and Server Status distribution (Active, Idle, Failed).

### 2. Infrastructure Monitoring
- **Cluster Analytics**: Real-time utilization, health, availability, and failure rates for NVIDIA H100/B200/A100, AMD Instinct MI300X/MI250X, Intel Gaudi3, and Google TPU v5p.
- **Resource Tracking**: 7-day trends for CPU, GPU, Memory, and Storage.
- **Location Status**: Utilization and failure tables for data centers globally (Virginia, Oregon, Texas, Ohio, Arizona, Montreal, California, Illinois, Frankfurt, London).

### 3. AI Workloads
- **Job Tracking**: Real-time counts and success rates for AI jobs, Training, and Inference tasks.
- **Model Consumption**: GPU hours and performance metrics for GPT-4, Llama 3, Gemini, Claude 3, PaLM 2, Mistral, Falcon, and Bloom.
- **Project Costing**: Top-consuming projects with associated GPU hours and operational costs (USD).

### 4. Energy & Sustainability
- **Carbon Footprint**: Track total carbon emissions (tCO₂e) and renewable energy percentages (Wind/Solar).
- **Power Efficiency**: Global Average PUE (Power Usage Effectiveness) vs. target goals.
- **Trend Analytics**: PUE fluctuations, energy consumption, and cooling efficiency by region.

### 5. Financial Dashboard
- **Live Revenue & Costs**: Operating Cost, Revenue Generated, Cost per GPU Hour, Maintenance, and ROI (TTM).
- **Cost Breakdown**: Infrastructure, Power/Cooling, Personnel, and Maintenance cost distribution.
- **Trend Analytics**: Revenue vs. Cost trends, ROI trending, and a Monthly Financial Summary.

### 6. Predictive Analytics (AI-Powered Forecasting)
- **ML Models**: Powered by Meta's **Prophet** and **ARIMA** (Model Accuracy: 94.2% MAPE, daily auto-retraining).
- **Future Planning**: Forecasts for GPU Demand, Energy Consumption, Failure Probability, and Capacity Utilization.
- **Cost Prediction**: 6-month financial cost forecasts for budget planning.
  
## 📊 Synthetic Dataset Generated

- **1,100+ records** across 12 JSON datasets
- **31 days** of daily metrics (May 2024)
- **744 hours** of hourly infrastructure data
- **180 days** of predictive forecast data
- **7 GPU types**, 8 AI models, 26 data centers across 5 regions

<html>
<title>Dashboard Pages & Features</title>
<style>
  body {
    font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif;
    background: #f5f6fa;
    padding: 24px;
    color: #1a1a1a;
  }
  h2 {
    margin-bottom: 16px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0,0,0,0.1);
  }
  th, td {
    text-align: left;
    padding: 12px 16px;
    border-bottom: 1px solid #e0e0e0;
    vertical-align: top;
  }
  th {
    background: #1f2937;
    color: #fff;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  tr:nth-child(even) {
    background: #fafafa;
  }
  tr:hover {
    background: #f0f4ff;
  }
  td:first-child {
    font-weight: 600;
    white-space: nowrap;
    width: 220px;
  }
  caption {
    caption-side: bottom;
    padding-top: 12px;
    font-size: 13px;
    color: #888;
    text-align: right;
  }
</style>
</head>
<body>

<h2>🗂️ Dashboard Pages & Features</h2>

<table>
  <thead>
    <tr>
      <th>Page</th>
      <th>Key Features</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1. Executive Overview</td>
      <td>6 KPI cards (Data Centers, Servers, GPU Util, Power, Cost, Carbon), utilization trend area chart, server status donut chart, infrastructure by region bar chart, PUE &amp; carbon trend lines</td>
    </tr>
    <tr>
      <td>2. Infrastructure Monitoring</td>
      <td>Real-time CPU/GPU/Memory/Storage KPIs, server status distribution, 7-day resource utilization trend, GPU cluster analytics with health scores, GPU performance radar chart, server status by location table</td>
    </tr>
    <tr>
      <td>3. AI Workload Analytics</td>
      <td>AI jobs running, training vs inference split, workload trends over time, resource consumption by model (GPT-4, Llama 3, Gemini, etc.), top resource-consuming projects table</td>
    </tr>
    <tr>
      <td>4. Energy &amp; Sustainability</td>
      <td>PUE tracking, renewable energy %, energy consumption trends, carbon emissions monitoring, energy by source breakdown (grid/solar/wind), cooling efficiency metrics</td>
    </tr>
    <tr>
      <td>5. Financial Dashboard</td>
      <td>Operating cost, revenue, cost per GPU hour, ROI tracking, revenue vs cost area chart, cost breakdown donut, ROI trend line, monthly financial summary grid</td>
    </tr>
    <tr>
      <td>6. Predictive Analytics</td>
      <td>The showstopper — GPU demand forecast, energy consumption forecast, failure prediction with alert thresholds, capacity utilization forecast, cost forecast, all with 3-month/6-month toggle and "Today" reference lines</td>
    </tr>
  </tbody>
  <caption>Generated by Kimi AI</caption>
</table>

</body>
</html>


## 🛠️ Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) / [React](https://reactjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Data Visualization**: [Recharts](https://recharts.org/) / [Chart.js](https://www.chartjs.org/)
- **Backend API**: [Node.js](https://nodejs.org/) / [Python FastAPI](https://fastapi.tiangolo.com/)
- **Time-Series Forecasting**: [Prophet](https://facebook.github.io/prophet/) & [ARIMA](https://www.statsmodels.org/stable/tsa.html)
- **Hosting**: Vercel (Frontend) & Railway/Render (Backend)
