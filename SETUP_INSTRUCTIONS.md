# Setup Instructions - Ravi Sharma Photo & Films

## 🎯 Quick Start Guide

### Step 1: Initial Admin Setup

1. **Sign Up Admin Account**
   - Go to the app at `/admin-login`
   - Click "Sign in with Google" 
   - Use email: `ravi.rv73838@gmail.com`
   - Or use email/password signup

2. **Grant Admin Role**
   - Open Lovable Cloud dashboard
   - Navigate to Database → user_roles table
   - Click "Insert row"
   - Add:
     - `user_id`: Copy from auth.users table for ravi.rv73838@gmail.com
     - `role`: Select "admin"
   - Save

3. **Login to Admin Panel**
   - Go to `/admin-login`
   - Sign in with Google or email: ravi.rv73838@gmail.com
   - Password: 78901234 (if using email/password)
   - You'll be redirected to admin dashboard

### Step 2: Configure Google OAuth (Important!)

To enable Google Sign-In for admin:

1. **Google Cloud Console Setup**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing
   - Enable Google+ API

2. **Create OAuth Credentials**
   - Go to "Credentials" → "Create Credentials" → "OAuth Client ID"
   - Application type: Web application
   - Authorized JavaScript origins: Add your domain(s)
     - `http://localhost:5173` (for local dev)
     - `https://your-netlify-domain.netlify.app`
   - Authorized redirect URIs:
     - `http://localhost:5173/admin`
     - `https://your-netlify-domain.netlify.app/admin`

3. **Configure in Lovable Cloud**
   - Open Lovable Cloud dashboard
   - Go to Users → Auth Settings → Google Settings
   - Add your Client ID and Client Secret
   - Save

4. **Whitelist Admin Email**
   - In Google Cloud Console → OAuth consent screen
   - Add `ravi.rv73838@gmail.com` as test user
   - Or publish the app for production

### Step 3: Configure Advanced Integrations

Navigate to Admin Panel → Advanced Settings:

#### 1. Google Review Widget
```
Google Place ID: [Get from Google Places API]
Enable Widget: ✓ (checked)
```

#### 2. EmailJS Configuration
```
Service ID: service_xxxxx
Template ID: template_xxxxx
Public Key: your-public-key
Notification Email: ravi.rv73838@gmail.com
```

Setup at [EmailJS.com](https://www.emailjs.com):
- Create account
- Create email service
- Create template for finalization notifications
- Copy credentials to Advanced Settings

#### 3. Google Drive API
```
API Key: [From Google Cloud Console]
OAuth Client ID: xxxxx.apps.googleusercontent.com
OAuth Client Secret: [From credentials]
Root Folder ID: [Your Google Drive folder ID]
```

Steps:
- Enable Google Drive API in Google Cloud Console
- Create API credentials
- Get folder ID from Google Drive URL: `https://drive.google.com/drive/folders/FOLDER_ID`

#### 4. Firebase Configuration (Optional - For Future)
```
API Key: [Will add later]
Auth Domain: rsfilms-732e0.firebaseapp.com
Project ID: rsfilms-732e0
Storage Bucket: rsfilms-732e0.firebasestorage.app
Messaging Sender ID: 360154116623
App ID: [Will add later]
Service Account: [Paste JSON]
```

Collections are pre-configured and ready for migration.

### Step 4: Design Customization

Go to Admin Panel → Design:

1. **Colors**
   - Primary Color: #D4AF37 (Gold)
   - Secondary Color: Customize
   - Text Color: Based on theme
   - Background Color: Based on theme

2. **Fonts**
   - Heading Font: Select from dropdown or upload
   - Body Font: Select from dropdown or upload
   - Upload custom fonts as needed

3. **Logos**
   - Navbar Logo
   - Hero Logo
   - Finalize Page Logo
   - Login Page Logo
   (Can use same logo for all)

### Step 5: User Management

Go to Admin Panel → Users:

1. **Add New User**
   - Username: client-name
   - Name: Full Name
   - Contact: phone/email
   - Selection Limit: 150 (default)
   - Google Folder Link: Drive folder URL

2. **Sync Google Folder**
   - Click "Sync Folder" button
   - System reads folder structure
   - Creates gallery sections automatically
   - Imports all images

3. **Manage Users**
   - Edit user details
   - Change selection limits
   - Download selection CSVs
   - Remove users

### Step 6: Settings Configuration

Go to Admin Panel → Settings:

1. **General Settings**
   - Global Selection Limit: 150
   - Auto-Finalize: Off (recommended)
   - Require Feedback: On (recommended)

2. **Email Notifications**
   - Configure EmailJS credentials
   - Test notification emails
   - Set admin notification email

### Step 7: Monitor & Manage

1. **Feedback Page**
   - View all client feedback
   - Filter by rating
   - Export feedback data

2. **Activity Logs**
   - Monitor user actions
   - Track admin activities
   - Debug issues

3. **Contacts Page**
   - Manage contact information
   - Update email settings
   - Configure review widget

## 🔐 Security Checklist

- ✓ RLS enabled on all tables
- ✓ Admin role verification on all admin routes
- ✓ Secure password hashing
- ✓ API keys stored in Lovable Cloud secrets
- ✓ Environment variables not exposed
- ✓ Google OAuth configured
- ✓ Email confirmation enabled

## 📱 Mobile Testing

Test on mobile devices:
- Gallery swipe navigation
- Photo selection
- Form submissions
- Admin panel responsiveness
- Touch interactions

## 🚀 Deployment Checklist

Before deploying to Netlify:

- [ ] Admin account created and role assigned
- [ ] Google OAuth configured
- [ ] EmailJS credentials added
- [ ] Google Drive API configured
- [ ] All logos uploaded
- [ ] Colors and fonts customized
- [ ] Test user created
- [ ] Mobile responsiveness tested
- [ ] All features tested end-to-end

## 🆘 Troubleshooting

### Google Sign-In Not Working
- Check OAuth credentials in Google Cloud Console
- Verify redirect URIs match exactly
- Check if admin email is whitelisted
- Verify Google Auth is configured in Lovable Cloud

### Photos Not Loading
- Check Google Drive API credentials
- Verify folder permissions are correct
- Ensure folder ID is correct
- Check network tab for API errors

### Email Notifications Failing
- Verify EmailJS credentials
- Check template ID exists
- Test with EmailJS dashboard
- Check console for errors

### Admin Access Denied
- Verify user_roles table has admin entry
- Check user_id matches auth.users
- Clear browser cache and retry
- Check console for authentication errors

## 📞 Support Resources

- **Lovable Cloud Dashboard**: Use <lov-open-backend>View Backend</lov-open-backend>
- **Email**: ravi.rv73838@gmail.com
- **Console Logs**: Check browser developer tools
- **Network Tab**: Monitor API calls

## 🎉 You're Ready!

Once all steps are complete, your photo selection platform is ready for clients. Share the login link with clients and let them select their favorite moments!
