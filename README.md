# ONG A.A.S - Insurance Awareness Organization

A comprehensive RTL-friendly website for ONG A.A.S (جمعية التأمين للتوعية) built with React, TypeScript, and Supabase.

## Features

### Authentication System
- Custom phone number + PIN authentication (no Supabase Auth)
- 8-digit phone number validation
- 4-digit PIN system
- Role-based access control (admin/user)
- Persistent login state with localStorage

### User Registration
- Complete registration form with document uploads
- Profile image, driver license, and insurance document uploads
- Insurance date validation
- File upload to Supabase storage buckets
- Account verification workflow

### Claims Management
- Claim submission for verified users
- File uploads (accident images, police report, insurance receipt)
- Progress tracking with visual indicators
- Status management (Pending, In Progress, Resolved)
- Claim updates and notes system

### Admin Panel
- User management with verification controls
- Claim management with status/progress updates
- Post management with media uploads
- Comprehensive dashboard with statistics
- Document review and verification tools

### Public Features
- Homepage with posts and claims display
- Comment system for verified users
- Responsive design with RTL support
- Mobile-friendly navigation

## Technical Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (Database + Storage)
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Styling**: RTL support with Arabic fonts

## Database Schema

### Tables
- `users` - User accounts and profiles
- `claims` - Insurance claims with file attachments
- `claim_updates` - Progress tracking and updates
- `posts` - Admin posts with media content
- `comments` - User comments on posts

### Storage Buckets
- `profiles` - User registration documents
- `claims` - Claim-related files
- `posts` - Post media files

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up Supabase project and configure environment variables
4. Run migrations to create database schema
5. Start development server: `npm run dev`

## Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Default Admin Account

- Phone: 34141497
- PIN: 3690
- Role: admin

## License

© 2025 جمعية التأمين للتوعية - All rights reserved

## Contact

- WhatsApp: +222 34 14 14 97
- Location: نواكشوط – موريتانيا
- License: FA010000360307202511232