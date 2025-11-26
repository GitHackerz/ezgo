# EZGO – Smart Mobility Infrastructure for Tunisia

EZGO is a dual-platform mobile and web solution designed to modernize Tunisia's public transportation system. It delivers real-time navigation, smart reservations, and data-driven operational tools that improve reliability for riders and profitability for transport operators.

## 🚀 Features

### For Passengers & Tourists
- 📱 Seamless mobile app with live bus tracking
- ⏱️ Accurate ETAs and route visualization
- 💺 Seat availability and reservations
- 🎫 Digital tickets and booking history
- 👤 Driver information and ratings

### For Bus Companies
- 🚌 Complete fleet management system
- 👨‍✈️ Driver assignment and scheduling
- 📊 Real-time operations monitoring
- 💰 Profitability dashboard and analytics
- 📈 Performance insights and optimization

### For Administrators
- 🔐 Centralized user and company management
- 📋 System-wide analytics and reporting
- ⚙️ Permissions and roles management
- 🎯 Quality assurance and compliance tools

## 🏗️ Architecture

This project is a **Turborepo monorepo** containing three applications:

```
ezgo/
├── apps/
│   ├── web/          # Next.js Admin & Company Dashboard
│   ├── api/          # NestJS Backend API
│   └── mobile/       # Expo React Native Mobile App
├── packages/         # Shared packages (future)
└── docker-compose.yml
```

### Tech Stack

#### Web Dashboard (`apps/web`)
- **Framework**: Next.js 16 (App Router)
- **Styling**: TailwindCSS v4
- **UI Components**: Shadcn UI
- **State Management**: Tanstack React Query
- **Language**: TypeScript

#### Backend API (`apps/api`)
- **Framework**: NestJS
- **Database**: PostgreSQL (via Docker)
- **ORM**: Prisma 7
- **Validation**: Zod
- **Language**: TypeScript

#### Mobile App (`apps/mobile`)
- **Framework**: Expo (React Native)
- **Styling**: NativeWind (TailwindCSS for React Native)
- **Navigation**: React Navigation
- **Language**: TypeScript

#### Tooling
- **Monorepo**: Turborepo
- **Linting/Formatting**: Biome.js
- **Package Manager**: npm

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Docker and Docker Compose
- Git

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd EzGo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start PostgreSQL database**
   ```bash
   docker-compose up -d
   ```

4. **Setup environment variables**
   
   Create `apps/api/.env`:
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/ezgo?schema=public"
   ```

5. **Generate Prisma Client**
   ```bash
   cd apps/api
   npx prisma generate
   npx prisma migrate dev --name init
   cd ../..
   ```

## 🚀 Running the Applications

### Development Mode

Run all applications concurrently:
```bash
npm run dev
```

Or run individually:

**Web Dashboard:**
```bash
cd apps/web
npm run dev
# Access at http://localhost:3000
```

**API Server:**
```bash
cd apps/api
npm run start:dev
# Access at http://localhost:3001
```

**Mobile App:**
```bash
cd apps/mobile
npm start
# Scan QR code with Expo Go app
```

### Production Build

```bash
npm run build
```

## 📸 Screenshots

### Web Dashboard

#### Landing Page
![Landing Page](./screenshots/landing_page.png)

The landing page provides a clean introduction to EZGO with quick access to the dashboard.

#### Admin Dashboard
![Admin Dashboard](./screenshots/dashboard_page.png)

The admin dashboard displays key metrics including:
- Total Revenue with growth indicators
- Active Buses count
- Active Users statistics
- Real-time activity monitoring
- Overview charts and recent sales

### Mobile App

The mobile app features:
- **Passenger Mode**: Real-time bus tracking, seat booking, and trip history
- **Driver Mode**: Assigned routes, passenger counts, and navigation assistance

## 🗄️ Database Schema

The application uses the following main entities:

- **User**: Passengers, Drivers, Company Admins, and System Admins
- **Company**: Bus companies managing fleets
- **Bus**: Fleet vehicles with capacity and status
- **Route**: Bus routes with stops and coordinates
- **Trip**: Scheduled trips with real-time status
- **Booking**: Passenger reservations and tickets

## 🔧 Development

### Code Quality

The project uses **Biome.js** for linting and formatting:

```bash
# Format code
npm run format

# Check code quality
npm run check
```

### VSCode Setup

Recommended extensions are configured in `.vscode/extensions.json`:
- Biome
- Prisma
- Tailwind CSS IntelliSense
- Expo Tools

## 📝 API Endpoints

### Companies
- `GET /company` - List all companies
- `GET /company/:id` - Get company by ID
- `POST /company` - Create new company
- `PATCH /company/:id` - Update company
- `DELETE /company/:id` - Delete company

*Additional endpoints for Users, Buses, Routes, Trips, and Bookings will be added.*

## 🚧 Roadmap

- [ ] Complete API endpoints for all entities
- [ ] Implement authentication and authorization
- [ ] Add real-time tracking with WebSockets
- [ ] Integrate payment gateway
- [ ] Add push notifications
- [ ] Implement analytics dashboard
- [ ] Add map integration (Google Maps/Mapbox)
- [ ] Create mobile app screens for all features
- [ ] Add unit and integration tests
- [ ] Deploy to production

## 📄 License

[Your License Here]

## 👥 Contributors

[Your Team/Contributors]

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

---

**Built with ❤️ for Tunisia's Smart Mobility Future**
