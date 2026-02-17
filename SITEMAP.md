# FoodSave Application Sitemap

## Public Pages

- **/** — Home Page
- **/about** — About Us
- **/contact** — Contact Page
- **/how-it-works** — How It Works
- **/impact** — Impact Dashboard
- **/privacy** — Privacy Policy
- **/terms** — Terms of Service

---

## Authentication

- **/auth/login** — Login Page
- **/auth/register** — Registration Page
- **/auth/signout** — Sign Out Page

---

## Protected Pages

### Admin Dashboard
- **/admin** — Admin Dashboard

### Donor Dashboard (`/dashboard/donor`)
- **/dashboard/donor** — Donor Dashboard Home
- **/dashboard/donor/analytics** — Donor Analytics
- **/dashboard/donor/create-request** — Create Food Request
- **/dashboard/donor/profile** — Donor Profile
- **/dashboard/donor/requests** — Food Requests List
- **/dashboard/donor/requests/[id]** — Request Detail View

### NGO Dashboard (`/dashboard/ngo`)
- **/dashboard/ngo** — NGO Dashboard Home
- **/dashboard/ngo/active-pickups** — Active Pickups
- **/dashboard/ngo/analytics** — NGO Analytics
- **/dashboard/ngo/available-requests** — Available Food Requests
- **/dashboard/ngo/history** — Pickup History
- **/dashboard/ngo/profile** — NGO Profile

### Other Protected Pages
- **/verification-pending** — Verification Pending Page

---

## API Routes

- **/api/auth/[...nextauth]** — NextAuth Authentication API

---

## Components

### UI Components (`/components/ui`)
- Badge
- Button
- Card
- Input
- Label
- Select
- Tabs

### Layout Components (`/components`)
- Loading
- Mobile Menu
- Navigation
- Session Provider

---

## Utilities

### Actions (`/lib/actions`)
- Admin Actions
- Authentication Actions
- Food Request Actions
- NGO Actions

### Utils (`/lib/utils`)
- Class Name Utility (cn)
- Geolocation Utility (geo)
- OTP Utility (otp)
- Validation Utility (validation)

---

## Database

- Prisma Schema (`/prisma/schema.prisma`)
- Database Migrations (`/prisma/migrations/`)
- Seed Data (`/prisma/seed.ts`)

---

## Site Map Diagram

```
/
├── about
├── contact
├── how-it-works
├── impact
├── privacy
├── terms
├── auth/
│   ├── login
│   ├── register
│   └── signout
├── admin
├── dashboard/
│   ├── donor/
│   │   ├── analytics
│   │   ├── create-request
│   │   ├── profile
│   │   ├── requests/
│   │   │   └── [id]
│   │   └── requests
│   └── ngo/
│       ├── active-pickups
│       ├── analytics
│       ├── available-requests
│       ├── history
│       └── profile
├── verification-pending
└── api/
    └── auth/
        └── [...nextauth]
```
