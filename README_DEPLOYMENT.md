# Deployment Guide - Ravi Sharma Photo & Films

## 🚀 Netlify Deployment

This project is ready to deploy on Netlify with Lovable Cloud backend.

### Quick Deploy Steps

1. **Push to GitHub**
   - Make sure your project is pushed to a GitHub repository

2. **Connect to Netlify**
   - Go to [Netlify](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub account and select this repository
   - Netlify will automatically detect the build settings from `netlify.toml`

3. **Environment Variables**
   - Netlify will need these environment variables (already in .env):
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_PUBLISHABLE_KEY`
     - `VITE_SUPABASE_PROJECT_ID`
   - These are automatically provided by Lovable Cloud

4. **Deploy**
   - Click "Deploy site"
   - Your site will be live in 2-3 minutes!

### Post-Deployment Setup

1. **Configure Google OAuth**
   - Add your Netlify domain to Lovable Cloud → Users → Auth Settings
   - Add authorized redirect URLs in Google Cloud Console

2. **Create Admin User**
   - Sign up with email: ravi.rv73838@gmail.com
   - Use Lovable Cloud dashboard to add admin role to this user
   - Navigate to /admin-login to access admin panel

3. **Configure Advanced Settings**
   - Go to Admin Panel → Advanced
   - Add Google Drive API credentials
   - Add EmailJS credentials for notifications
   - Add Firebase config (for future migration)
   - Add Google Review widget details

## 📱 Mobile Optimization

The app is fully responsive and optimized for:
- Touch gestures (swipe navigation in gallery)
- Mobile-friendly UI components
- Fast loading times
- Progressive Web App capabilities

## 🔒 Security Features

- Row Level Security (RLS) enabled on all database tables
- Admin-only access via user_roles table
- Secure authentication with Google OAuth
- Password-based admin login as backup
- API keys stored securely in Lovable Cloud

## 🛠️ Architecture

### Database Abstraction Layer
The project uses `src/services/database.ts` as an abstraction layer, making it easy to migrate to Firebase in the future. All database operations go through this service.

### Firebase Migration Ready
Firebase configuration is pre-built in Advanced Settings with:
- Pre-defined collections schema
- Field mappings for all data types
- Service account integration ready
- Easy switch when needed

### Google Drive Storage
Configure Google Drive API in Advanced Settings to:
- Store photos on Google Drive (free storage)
- Sync folders automatically
- Read folder structure and images
- Auto-create gallery sections

## 📊 Admin Panel Features

1. **Users Management**
   - Add, edit, remove users
   - Set selection limits per user
   - Link Google Drive folders
   - Download selection CSVs

2. **Design Customization**
   - Primary, secondary, text, background colors
   - Heading and body fonts
   - Logo uploads (navbar, hero, finalize, login)
   - Upload custom fonts

3. **Settings**
   - Global selection limit
   - Auto-finalize options
   - Require feedback settings

4. **Advanced**
   - Google Review Widget
   - EmailJS notifications
   - Google Drive API
   - Firebase configuration

5. **Feedback & Logs**
   - View all client feedback
   - Activity logs for users and admin
   - Google review requests (after 5-star feedback)

6. **Contacts**
   - Manage contact information
   - EmailJS integration
   - Google review widget info

## 🎨 Design System

The project uses a comprehensive design system with:
- Semantic color tokens (HSL format)
- Consistent spacing and typography
- Gold accent theme
- Dark/light mode support
- Tailwind CSS + custom design tokens

## ⚡ Performance

- Optimized bundle size
- Lazy loading for images
- React Query for efficient data fetching
- Minimal dependencies
- Fast page transitions

## 🔄 Future Migration Path

When ready to migrate to Firebase:
1. All Firebase configs are pre-configured in Advanced Settings
2. Database abstraction layer makes switching seamless
3. Collections and fields are already defined
4. Just update the database service imports

## 📞 Support

For issues or questions:
- Check console logs
- Review Lovable Cloud dashboard
- Contact: ravi.rv73838@gmail.com

---

## Admin Credentials

**Admin Email:** ravi.rv73838@gmail.com  
**Default Password:** 78901234

Make sure to:
1. Sign up with this email first
2. Add admin role in Lovable Cloud dashboard
3. Then login via /admin-login
