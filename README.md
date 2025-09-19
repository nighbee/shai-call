# 📞 Call Quality Analytics Dashboard

A modern, real-time call quality analytics dashboard that connects directly to Google Sheets for data visualization and performance tracking. Built with React, TypeScript, and Tailwind CSS.

![Dashboard Preview](https://img.shields.io/badge/Status-Live-brightgreen) ![React](https://img.shields.io/badge/React-18.3.1-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue) ![Vite](https://img.shields.io/badge/Vite-5.4.19-purple)

## ✨ Features

### 📊 **Real-time Analytics**
- Live data fetching from Google Sheets
- Automatic data refresh with manual refresh option
- Real-time metrics calculation and visualization

### 🎯 **Advanced Filtering**
- Filter by Manager (Darina, Anzhelika, etc.)
- Filter by Client Phone Number
- Combined filtering for detailed insights
- Dynamic filter options based on available data

### 📈 **Comprehensive Metrics**
- **Quality of Call**: Average call quality scores
- **Script Match**: Adherence to call scripts
- **Errors Free**: Error-free call performance
- **Overall Rating**: Customer satisfaction ratings
- **KPI Score**: Key performance indicators

### 📋 **Data Visualization**
- Interactive charts and graphs
- Call history table with detailed records
- Performance trends over time
- Manager-specific insights
- Client-specific analysis

### 🎨 **Modern UI/UX**
- Responsive design for all devices
- Dark/light theme support
- Intuitive navigation
- Loading states and error handling
- Clean, professional interface

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Google Sheets with call data

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/call-quality-dashboard.git
   cd call-quality-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure Google Sheets**
   - Create a Google Sheet with the following columns:
     - Date, Time, ID man, Man name, LINK
     - Client Phone, ClientId, Duration
     - Quality of Call, Script Match, Errors Free
     - Overall Rating, KPI, Recommendations
     - Brief, Next Best Action
   - Publish the sheet to the web (File → Share → Publish to web)
   - Copy the published URL

4. **Update the data source**
   ```typescript
   // In src/components/Dashboard.tsx, line 47-48
   const response = await fetch(
     'YOUR_GOOGLE_SHEETS_PUBLISHED_URL_HERE'
   );
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/
│   ├── Dashboard.tsx          # Main dashboard component
│   ├── MetricsCards.tsx       # KPI metrics display
│   ├── CallHistoryTable.tsx   # Call records table
│   ├── ChartsSection.tsx      # Data visualization
│   ├── DetailedInsights.tsx   # Manager/client insights
│   ├── Header.tsx            # Navigation header
│   ├── Footer.tsx            # Footer component
│   ├── WorkflowEmbed.tsx     # Embedded workflow
│   └── ui/                   # Reusable UI components
├── utils/
│   ├── parse.ts              # Google Sheets data parsing
│   └── metrics.ts            # Metrics calculations
├── hooks/
│   └── use-mobile.tsx        # Mobile detection hook
├── lib/
│   └── utils.ts              # Utility functions
└── pages/
    ├── Index.tsx             # Main page
    └── NotFound.tsx          # 404 page
```

## 🔧 Configuration

### Google Sheets Setup

Your Google Sheet should have the following structure:

| Date | Time | ID man | Man name | LINK | Client Phone | ClientId | Duration | Quality of Call | Script Match | Errors Free | Overall Rating | KPI | Recommendations | Brief | Next Best Action |
|------|------|--------|----------|------|--------------|----------|----------|-----------------|--------------|-------------|----------------|-----|-----------------|-------|------------------|
| 23.02.2025 | 12:23 | 111 | Darina | https://... | 77759893813 | #VALUE! | #VALUE! | 8.5 | 92.3 | 1 | 9 | 85 | Great call | Brief summary | Follow up |

### Data Format Requirements

- **Date**: DD.MM.YYYY format
- **Time**: HH:mm format  
- **Numeric fields**: Quality of Call, Script Match, Errors Free, Overall Rating, KPI
- **Text fields**: Manager names, client phones, recommendations, etc.

## 🎨 Customization

### Themes
The dashboard supports both light and dark themes. Modify the theme in `src/index.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  /* ... other theme variables */
}
```

### Metrics Calculation
Modify `src/utils/metrics.ts` to change how metrics are calculated:

```typescript
export function computeMetrics(data: CallData[], ...) {
  // Customize your metrics calculation logic
}
```

### Data Parsing
Update `src/utils/parse.ts` to handle different data formats:

```typescript
export function parseRows(rows: any[]): CallData[] {
  // Customize data parsing logic
}
```

## 📊 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
```

## 🛠️ Tech Stack

- **Frontend**: React 18.3.1, TypeScript 5.8.3
- **Build Tool**: Vite 5.4.19
- **Styling**: Tailwind CSS 3.4.17
- **UI Components**: Radix UI, Lucide React
- **Charts**: Recharts 2.15.4
- **Data Parsing**: PapaParse 5.5.3
- **Routing**: React Router DOM 6.30.1

## 🔒 Data Security

- No data is stored locally
- Direct connection to Google Sheets
- No authentication required (public sheet)
- All data processing happens client-side

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/call-quality-dashboard/issues) page
2. Create a new issue with detailed information
3. Contact the maintainers

## 🎯 Roadmap

- [ ] Real-time data updates via WebSocket
- [ ] Export functionality (PDF, Excel)
- [ ] Advanced filtering options
- [ ] User authentication
- [ ] Mobile app version
- [ ] API integration for multiple data sources

## 📸 Screenshots

![Dashboard Overview](https://via.placeholder.com/800x400/1a1a1a/ffffff?text=Dashboard+Overview)
![Metrics View](https://via.placeholder.com/800x400/2a2a2a/ffffff?text=Metrics+View)
![Call History](https://via.placeholder.com/800x400/3a3a3a/ffffff?text=Call+History)

---

**Made with ❤️ for better call quality management**