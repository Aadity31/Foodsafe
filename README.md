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
foodsafe/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Landing page
│   ├── layout.tsx           # Root layout
│   ├── loading.tsx          # Global loading
│   ├── globals.css          # Global styles
│   ├── about/               # About page
│   ├── admin/               # Admin dashboard
│   ├── auth/                # Authentication pages
│   │   ├── login/
│   │   ├── register/
│   │   └── signout/
│   ├── contact/             # Contact page
│   ├── dashboard/
│   │   ├── donor/           # Donor dashboard
│   │   │   ├── analytics/
│   │   │   ├── create-request/
│   │   │   ├── profile/
│   │   │   └── requests/
│   │   │       └── [id]/
│   │   └── ngo/             # NGO dashboard
│   │       ├── active-pickups/
│   │       ├── analytics/
│   │       ├── available-requests/
│   │       ├── history/
│   │       └── profile/
│   ├── how-it-works/        # How it works page
│   ├── impact/              # Impact page
│   ├── privacy/             # Privacy policy
│   ├── terms/               # Terms of service
│   ├── verification-pending/# Verification pending page
│   └── api/                 # API routes
│       └── auth/
│           └── [...nextauth]/
├── components/
│   ├── ui/                  # ShadCN UI components
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   └── tabs.tsx
│   ├── providers/           # React providers
│   ├── navigation.tsx       # Main navigation
│   └── mobile-menu.tsx      # Mobile navigation
├── lib/
│   ├── actions/             # Server actions
│   │   ├── admin.ts
│   │   ├── auth.ts
│   │   ├── food-request.ts
│   │   └── ngo.ts
│   ├── utils/               # Utility functions
│   │   ├── cn.ts            # Class name utility
│   │   ├── geo.ts           # Haversine formula
│   │   ├── otp.ts           # OTP generation/verification
│   │   └── validation.ts    # Zod schemas
│   ├── db/                  # Database
│   │   └── prisma.ts
│   ├── auth.ts              # NextAuth config
│   └── middleware.ts        # Auth middleware
├── prisma/
│   ├── schema.prisma        # Database schema
│   ├── seed.ts              # Database seeding
│   └── migrations/          # Database migrations
├── public/                  # Static assets
│   ├── sitemap.xml          # SEO sitemap
│   ├── robots.txt           # Robots.txt
│   └── favicon.svg          # Favicon
├── Dockerfile
├── docker-compose.yml
├── tailwind.config.ts
├── postcss.config.mjs
├── next.config.mjs
├── tsconfig.json
├── package.json
├── eslint.config.mjs
└── next-sitemap.config.js   # Sitemap configuration
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

## 🗺️ SEO Sitemap

### Regenerate Sitemap
To regenerate the sitemap for Google Search Engine:

```bash
pnpm next-sitemap
```

This will generate:
- `public/sitemap.xml` - XML sitemap for search engines
- `public/robots.txt` - Robots.txt file

The sitemap includes all public pages and automatically excludes private routes (admin, dashboard, api).

### Access on Vercel

Once deployed to Vercel, your sitemap will be automatically available at:

- **Sitemap:** `https://your-vercel-domain.vercel.app/sitemap.xml`
- **Robots.txt:** `https://your-vercel-domain.vercel.app/robots.txt`

Example:
```
https://foodsafe.vercel.app/sitemap.xml
https://foodsave.vercel.app/robots.txt
```

### Submit to Google

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add your property (domain or URL prefix)
3. Navigate to Sitemaps in the left sidebar
4. Enter `sitemap.xml` in the "Add a new sitemap" field
5. Click Submit

Google will then crawl and index your pages.

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
