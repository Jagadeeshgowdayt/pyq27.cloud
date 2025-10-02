# Admin Panel Configuration

## Security Settings

### 🔒 Change Admin Password

The admin password is stored in `adminj.html`. To change it:

1. Open `adminj.html`
2. Find this line (around line 330):
   ```javascript
   const ADMIN_PASSWORD = "admin@123"; // Change this to your secure password
   ```
3. Replace `"admin@123"` with your desired password
4. Save the file

### 📋 Password Requirements

- Use a strong password (mix of letters, numbers, symbols)
- Don't share the password
- Don't commit the password to public repositories
- Recommended: At least 12 characters

### ⏱️ Session Settings

**Session Timeout:** 30 minutes (default)

To change the timeout duration, modify this line in `adminj.html`:
```javascript
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
```

Examples:
- 15 minutes: `15 * 60 * 1000`
- 1 hour: `60 * 60 * 1000`
- 2 hours: `120 * 60 * 1000`

## 🛡️ Security Features

### Already Implemented:
✅ Password-protected login screen
✅ Session-based authentication (stored in localStorage)
✅ Auto-logout after 30 minutes of inactivity
✅ Manual logout button
✅ Password field is hidden (type="password")
✅ Error messages for incorrect passwords
✅ Session expiry warnings

### Additional Security (Optional):

#### 1. **Hide Admin Panel URL**
- Don't link to `/adminj.html` from the main site
- Access it directly by typing the URL
- Share the URL only with authorized admins

#### 2. **Vercel Password Protection**
Add to your `vercel.json`:
```json
{
  "routes": [
    {
      "src": "/adminj.html",
      "headers": {
        "WWW-Authenticate": "Basic realm=\"Admin Panel\""
      },
      "status": 401
    }
  ]
}
```

#### 3. **IP Whitelist (Advanced)**
Use Vercel's edge config to restrict access by IP address.

#### 4. **Two-Factor Authentication (Advanced)**
Implement using services like:
- Auth0
- Firebase Authentication
- Clerk

## 🚀 Default Login Credentials

**URL:** `/adminj.html`
**Password:** `admin@123`

⚠️ **IMPORTANT:** Change the default password immediately after deployment!

## 📝 Usage Instructions

### For Admin:
1. Navigate to `/adminj.html`
2. Enter the admin password
3. Click "Login"
4. Session lasts 30 minutes
5. Click "Logout" when done

### Security Best Practices:
- Always logout after use
- Don't save password in browser
- Use incognito mode on shared computers
- Clear browser cache after use
- Change password regularly

## 🔧 Troubleshooting

### "Session expired" message appears too quickly
- Increase `SESSION_TIMEOUT` value in `adminj.html`

### Forgot password
- Edit `adminj.html` and change `ADMIN_PASSWORD`
- Or clear localStorage: `localStorage.clear()` in browser console

### Need to reset session
- Clear browser localStorage
- Or delete the `adminAuthenticated` key

## 📞 Support

For security concerns or issues, contact the system administrator.
