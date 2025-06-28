# FinanceTracker - Personal Finance Management Application

A comprehensive, production-ready personal finance management web application built with modern technologies. Track expenses, manage budgets, and gain insights into your spending patterns through detailed reports and visualizations.

![FinanceTracker Dashboard](https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop)

## 🌟 Features

### **Expense Management**
- ✅ Quick expense entry with comprehensive form
- ✅ Smart categorization (Food, Transportation, Shopping, etc.)
- ✅ Multiple payment methods support (UPI, Credit Card, Cash, etc.)
- ✅ Advanced filtering and search capabilities
- ✅ Full CRUD operations (Create, Read, Update, Delete)

### **Budget Management**
- ✅ Monthly budget setting by category
- ✅ Real-time progress tracking with visual indicators
- ✅ Smart alerts (Within Budget, Approaching Limit, Over Budget)
- ✅ Budget analytics and overview
- ✅ Flexible budget management

### **Comprehensive Reports**
- ✅ Monthly spending analysis
- ✅ Interactive charts and visualizations
- ✅ Top expenses identification
- ✅ CSV export functionality
- ✅ Year-over-year comparison

### **Interactive Dashboard**
- ✅ Financial overview with key metrics
- ✅ Smart insights and spending trends
- ✅ Quick expense addition
- ✅ Visual charts (Pie charts, Line charts)
- ✅ Monthly comparison analytics

## 🚀 Live Demo

**Live Application:** [https://shiny-figolla-b8db09.netlify.app](https://shiny-figolla-b8db09.netlify.app)

### Test Credentials
- **Email:** `Samwilson0504@gmail.com`
- **Password:** `12345678`

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Lightning-fast build tool
- **React Router** - Client-side routing
- **Recharts** - Beautiful data visualizations
- **Lucide React** - Modern icon library
- **React Hook Form** - Efficient form handling
- **React Hot Toast** - Elegant notifications

### Backend & Database
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Robust relational database
- **Row Level Security (RLS)** - Database-level security
- **Real-time subscriptions** - Live data updates

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd personal-finance-tracker
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Create a `.env` file in the root directory and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**To get these credentials:**

1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Go to Settings → API
4. Copy your Project URL and anon/public key

### 4. Database Setup

The application will automatically create the necessary database tables when you first run it. The migration files are located in `supabase/migrations/`.

### 5. Run the Application

#### Frontend Development Server

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

#### Backend (Supabase)

The backend is managed by Supabase and doesn't require local setup. All database operations, authentication, and real-time features are handled by Supabase's cloud infrastructure.

#### Python Components

This application doesn't include Python components. All functionality is handled by the React frontend and Supabase backend.

### 6. Build for Production

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist/` directory.

## 🗄 Database Schema

### Tables

1. **expenses**
   - `id` (UUID, Primary Key)
   - `user_id` (UUID, Foreign Key to auth.users)
   - `amount` (Decimal)
   - `category` (Text)
   - `date` (Date)
   - `payment_method` (Text)
   - `notes` (Text, Optional)
   - `created_at` (Timestamp)
   - `updated_at` (Timestamp)

2. **budgets**
   - `id` (UUID, Primary Key)
   - `user_id` (UUID, Foreign Key to auth.users)
   - `category` (Text)
   - `monthly_limit` (Decimal)
   - `month` (Text, YYYY-MM format)
   - `created_at` (Timestamp)
   - `updated_at` (Timestamp)

## 🔐 Authentication

The application uses Supabase Auth for user management:

- **Email/Password Authentication**
- **Row Level Security (RLS)** ensures users only access their own data
- **Automatic session management**
- **Secure password handling**

## 📱 Responsive Design

The application is fully responsive and works seamlessly across:

- **Desktop** (1024px and above)
- **Tablet** (768px - 1023px)
- **Mobile** (320px - 767px)

## 🎨 Design Features

- **Apple-level design aesthetics** with attention to detail
- **Gradient backgrounds** and modern visual effects
- **Micro-interactions** and smooth transitions
- **Glass-morphism effects** on key components
- **Consistent color system** and typography
- **Dark/Light theme support** (coming soon)

## 🚀 Deployment

### Netlify (Recommended)

1. Connect your repository to Netlify
2. Set environment variables in Netlify dashboard
3. Deploy automatically on every push

### Manual Deployment

1. Build the project: `npm run build`
2. Upload the `dist/` folder to your hosting provider
3. Configure environment variables on your hosting platform

## 🔧 Environment Variables

All required environment variables are listed in `.env.example`:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## 🆕 Extra Features Added

### Enhanced Dashboard
- **Quick expense addition** directly from dashboard
- **Smart insights** with month-over-month comparison
- **Visual spending trends** with interactive charts
- **Category breakdown** with color-coded pie charts

### Advanced Budget Management
- **Real-time budget tracking** with progress bars
- **Smart status indicators** (Within Budget, Approaching Limit, Over Budget)
- **Monthly budget overview** with key metrics
- **Budget violation alerts**

### Comprehensive Reporting
- **Monthly report generation** with detailed analytics
- **Interactive charts** (Pie charts, Bar charts, Line charts)
- **CSV export functionality** for external analysis
- **Top expenses identification**
- **Daily spending trends**

### User Experience Enhancements
- **Beautiful loading states** and animations
- **Toast notifications** for user feedback
- **Advanced filtering** and search capabilities
- **Mobile-optimized navigation**
- **Responsive design** for all devices

### Security Features
- **Row Level Security (RLS)** at database level
- **User data isolation**
- **Secure authentication** with Supabase Auth
- **Environment variable protection**

## 🐛 Troubleshooting

### Common Issues

1. **Supabase connection errors**
   - Verify your environment variables are correct
   - Check if your Supabase project is active

2. **Build errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check for TypeScript errors: `npm run lint`

3. **Database errors**
   - Ensure RLS policies are properly set up
   - Check if migrations have been applied

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📞 Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Review the troubleshooting section

## 🙏 Acknowledgments

- **Supabase** for providing excellent backend services
- **Tailwind CSS** for the utility-first CSS framework
- **Recharts** for beautiful data visualizations
- **Lucide React** for modern icons
- **Pexels** for high-quality stock images

---

**Built with ❤️ using React, TypeScript, and Supabase**
