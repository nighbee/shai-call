# Sales Call Analyzer 📞

> AI-powered analysis of sales calls with real-time insights, compliance tracking, and actionable recommendations.

![Sales Call Analyzer Dashboard](https://github.com/user-attachments/assets/24ab23c9-8455-455c-a17e-642a39eafc14)

## 🚀 Overview

The Sales Call Analyzer is a comprehensive web application that provides AI-powered analysis of sales calls through an intuitive dashboard interface. Built with modern React and TypeScript, it features real-time data integration from Google Sheets, embedded AI workflow for call analysis, and detailed performance metrics visualization.

### ✨ Key Features

- **🔍 Real-time Analysis** - Live data fetching and processing from Google Sheets
- **📊 Interactive Dashboard** - Comprehensive metrics with filtering and visualization
- **🤖 AI-Powered Insights** - Embedded Shai.pro workflow for call analysis
- **📈 Performance Tracking** - KPI monitoring and trend analysis
- **🎯 Compliance Tracking** - Script adherence and error-free call monitoring
- **💡 Action Recommendations** - AI-generated next best actions
- **📱 Responsive Design** - Mobile-friendly interface with modern UI components
- **⚡ Fast Performance** - Optimized build with Vite and modern tooling

## 🏗️ Architecture

### Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5.4.19
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **State Management**: React hooks with TanStack Query
- **Charts & Visualization**: Recharts
- **Data Processing**: Papa Parse for CSV handling
- **Date Handling**: date-fns
- **Icons**: Lucide React
- **Routing**: React Router DOM

### Project Structure

```
src/
├── components/           # React components
│   ├── ui/              # Reusable UI components (shadcn/ui)
│   ├── Dashboard.tsx    # Main dashboard component
│   ├── Header.tsx       # Application header
│   ├── WorkflowEmbed.tsx # AI workflow integration
│   ├── MetricsCards.tsx # KPI metrics display
│   ├── CallHistoryTable.tsx # Data table component
│   ├── DetailedInsights.tsx # Insights panel
│   └── ChartsSection.tsx # Charts and visualizations
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries and configurations
├── pages/               # Page components
├── utils/               # Utility functions
│   ├── parse.ts         # Data parsing utilities
│   └── metrics.ts       # Metrics computation
└── main.tsx            # Application entry point
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn** or **bun**
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nighbee/shai-call.git
   cd shai-call
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup** (Optional - for Supabase integration)
   ```bash
   cp .env.example .env
   ```
   Add your Supabase credentials if using database integration:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:8080`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 📊 Data Integration

### Google Sheets Integration

The application fetches real-time data from Google Sheets using the Google Visualization API:

- **Data Source**: Public Google Sheets document
- **Format**: JSON response from Google Sheets API
- **Refresh**: Manual refresh button and automatic updates
- **Processing**: Client-side data parsing and validation

#### Data Schema

The application expects the following columns in your Google Sheets:

| Column | Type | Description |
|--------|------|-------------|
| Date | String | Call date (DD.MM.YYYY format) |
| Time | String | Call time (HH:mm format) |
| ID man | String | Manager ID |
| Man name | String | Manager name |
| LINK | String | Call recording link |
| Client Phone | String | Client phone number |
| ClientId | String | Client identifier |
| Duration | String | Call duration |
| Quality of Call | Number | Call quality score (0-100) |
| Script Match | Number | Script adherence percentage |
| Errors Free | Number | Error-free score |
| Overall Rating | Number | Overall call rating (1-10) |
| KPI | Number | Key performance indicator |
| Recommendations | String | AI-generated recommendations |
| Brief | String | Call summary |
| Next Best Action | String | Recommended next steps |

### Supabase Integration (Optional)

For enhanced data management, the application supports Supabase integration. See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed setup instructions.

## 🎛️ Features & Usage

### Dashboard Overview

The main dashboard provides a comprehensive view of call analytics:

1. **Header Section**
   - Application title and description
   - Key feature highlights
   - Branding elements

2. **AI Workflow Embed**
   - Integrated Shai.pro workflow for call analysis
   - Direct call upload and processing
   - Real-time analysis results

3. **Call Quality Dashboard**
   - Real-time analytics from Google Sheets
   - Refresh functionality for data updates
   - Comprehensive metrics display

### Key Metrics

- **Quality of Call**: Average call quality score
- **Script Match**: Percentage of script adherence
- **Errors Free**: Error-free call percentage
- **Overall Rating**: Average call rating
- **KPI Score**: Key performance indicator

### Filtering & Analysis

- **Manager Filter**: View data for specific managers
- **Client Filter**: Filter by client phone numbers
- **Real-time Updates**: Automatic recalculation of metrics
- **Historical Data**: Access to past call records

### Data Visualization

- Interactive charts and graphs
- Trend analysis over time
- Performance comparisons
- Export capabilities

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Code Style

The project uses:
- **ESLint** for code linting
- **TypeScript** for type safety
- **Prettier** (recommended) for code formatting
- **Tailwind CSS** for styling

### Component Development

New components should follow the established patterns:

```typescript
// Component structure example
import { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

interface MyComponentProps extends ComponentProps<'div'> {
  // Component-specific props
}

export const MyComponent = ({ className, ...props }: MyComponentProps) => {
  return (
    <div className={cn("base-styles", className)} {...props}>
      {/* Component content */}
    </div>
  );
};
```

## 🚀 Deployment

### Render.com (Recommended)

The application is configured for deployment on Render.com:

1. Connect your GitHub repository to Render
2. Use the following settings:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
   - **Node Version**: 18+

### Other Platforms

The application can be deployed on any static hosting service:

- **Vercel**: `vercel --prod`
- **Netlify**: Drag and drop `dist` folder
- **GitHub Pages**: Configure GitHub Actions workflow
- **AWS S3**: Upload `dist` contents to S3 bucket

### Environment Variables

For production deployment, ensure you set:

```bash
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_supabase_key
```

## 🔧 Configuration

### Vite Configuration

The project uses a custom Vite configuration ([vite.config.ts](./vite.config.ts)):

- **Host Configuration**: Supports custom hosts including `shai-call.onrender.com`
- **Port**: Development server runs on port 8080
- **Path Aliases**: `@` mapped to `./src`
- **Plugins**: React SWC, Lovable Tagger (development)

### Tailwind CSS

Custom theme configuration with business-focused color scheme:

- Custom gradients and shadows
- Responsive breakpoints
- Component-specific styling
- Dark/light theme support

## 🐛 Troubleshooting

### Common Issues

1. **Build Errors**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Data Not Loading**
   - Check Google Sheets permissions
   - Verify spreadsheet URL in Dashboard.tsx
   - Check browser console for CORS errors

3. **Environment Variables**
   - Ensure `.env` file is in root directory
   - Variables must start with `VITE_`
   - Restart development server after changes

4. **Port Conflicts**
   ```bash
   # Use different port
   npm run dev -- --port 3000
   ```

### Performance Issues

- **Large Bundle Size**: Consider code splitting with dynamic imports
- **Slow Data Loading**: Implement data caching strategies
- **Chart Rendering**: Optimize chart data processing

## 📚 API Reference

### Data Fetching

The application uses a custom data fetching function:

```typescript
const fetchData = async () => {
  const response = await fetch(
    'https://docs.google.com/spreadsheets/d/SHEET_ID/gviz/tq?tqx=out:json'
  );
  const data = await response.text();
  // Process Google Sheets JSON response
};
```

### Data Types

Key TypeScript interfaces:

```typescript
interface CallData {
  Date: string;
  Time: string;
  'Man name': string;
  'Client Phone': string;
  'Quality of Call': number;
  'Script Match': number;
  'Overall Rating': number;
  // ... other fields
}
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and ensure they follow the coding standards
4. **Run tests**: `npm run lint`
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Coding Standards

- Use TypeScript for all new code
- Follow existing component patterns
- Add proper error handling
- Include JSDoc comments for complex functions
- Update documentation for new features

## 📄 License

This project is built for the hackathon and is powered by Shai.pro AI technology.

## 🙏 Acknowledgments

- **Shai.pro AI** - AI workflow integration
- **shadcn/ui** - Beautiful UI components
- **Recharts** - Data visualization
- **Tailwind CSS** - Styling framework
- **Hackathon Team** - Development and design

## 📞 Support

For issues and questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Review [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for integration help
3. Open an issue on GitHub
4. Contact the development team

---

**Built with ❤️ for enhanced sales performance**