# FoodSafe - Real-Time Event Food Rescue Network

FoodSafe is a production-ready MVP platform that connects event hosts with verified NGOs to rescue surplus food in real-time. Built with Next.js 14, Prisma, and PostgreSQL.

## 🚀 Features

### Core Features
- **Role-Based Access Control**: DONOR, NGO, and ADMIN roles
- **Food Upload Flow**: Auto-calculated expiry windows based on food type and storage
- **Geo-Matching**: Haversine formula for distance calculation and NGO notification
- **OTP-Based Pickup**: Secure 6-digit OTP for pickup verification
- **Real-Time Status Tracking**: OPEN, RESERVED, COMPLETED, EXPIRED, CANCELLED

### Dashboards
- **Donor Dashboard**: Create/manage food requests, view statistics
- **NGO Dashboard**: View nearby requests, accept donations, track pickups
- **Admin Panel**: Approve NGOs, manage users, view platform metrics

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS, ShadCN UI
- **Backend**: Next.js API Routes, Server Actions
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js (JWT strategy)
- **Maps**: Leaflet (OpenStreetMap)
- **Validation**: Zod
- **Containerization**: Docker + docker-compose

## 📁 Project Structure

```
surpluslink/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Landing page
│   ├── layout.tsx           # Root layout
│   ├── auth/                # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/
│   │   ├── donor/           # Donor dashboard
│   │   └── ngo/             # NGO dashboard
│   └── admin/               # Admin panel
├── components/
│   ├── ui/                  # ShadCN UI components
│   └── navigation.tsx        # Main navigation
├── lib/
│   ├── actions/             # Server actions
│   │   ├── auth.ts
│   │   ├── food-request.ts
│   │   └── admin.ts
│   ├── utils/               # Utility functions
│   │   ├── geo.ts           # Haversine formula
│   │   ├── otp.ts           # OTP generation/verification
│   │   └── validation.ts    # Zod schemas
│   ├── db/                  # Database
│   │   └── prisma.ts
│   └── auth.ts              # NextAuth config
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Database seeding
├── public/                  # Static assets
├── Dockerfile
├── docker-compose.yml
└── tailwind.config.ts
```

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- Docker (optional)

### Local Development

1. **Clone and install dependencies**
   ```bash
   cd foodsafe
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database URL and secrets
   ```

3. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate

   # Run migrations
   npm run db:migrate

   # Seed sample data (optional)
   npm run db:seed
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open the app**
   - Visit http://localhost:3000
   - Login with seed data (check prisma/seed.ts)

### Docker Deployment

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

2. **Access the application**
   - App: http://localhost:3000
   - Database: localhost:5432

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/surpluslink?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key"
JWT_SECRET="your-jwt-secret-key"
```

## 📋 API Routes

### Authentication
- `POST /api/auth/callback/credentials` - Login

### Food Requests
- `POST /api/food-requests` - Create request (Donor)
- `GET /api/food-requests` - List requests (NGO)
- `POST /api/food-requests/:id/accept` - Accept request (NGO)
- `POST /api/food-requests/:id/complete` - Complete pickup (OTP)

## 🔐 Security Features

- Password hashing with bcrypt
- OTP hashing with SHA-256
- Role-based access control
- Input validation with Zod
- Server-side distance calculations
- SQL injection prevention via Prisma

## 🎯 Business Logic

### Expiry Windows
| Storage Type | Veg | Non-Veg | Dry Items |
|--------------|-----|---------|-----------|
| Room Temp | 6 hours | 4 hours | 8 hours |
| Refrigerated | 12 hours | 10 hours | 24 hours |
| Frozen | 24 hours | 24 hours | 24 hours |

### Geo Matching
- Haversine formula for distance calculation
- NGOs notified within their service radius
- Top 5 nearest NGOs prioritized
- Auto-expansion by 5km after 10 minutes

## 📊 Admin Dashboard Metrics

- Total users (Donors, NGOs)
- Pending NGO applications
- Food request statistics
- Rescue rate
- Expired ratio
- Total meals rescued

## 🚀 Future Extensions

The codebase is structured for easy extension:
- Push notifications (Firebase, OneSignal)
- CSR dashboard
- Carbon impact calculation
- Mobile app (React Native)
- Real-time WebSocket updates
- Multi-language support

## 📄 License

MIT License - See LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Open a Pull Request

---

Built with ❤️ for food rescue and hunger relief.
