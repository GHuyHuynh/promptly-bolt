# Development Mode - Authentication Bypass

This application includes a development mode that allows you to bypass Firebase authentication for easier development and testing.

## How to Enable Development Mode

1. Create a `.env.local` file in the root directory of your project
2. Add the following environment variable:

```bash
VITE_DEV_BYPASS_AUTH=true
```

## What Happens in Development Mode

When development mode is enabled:

- ✅ **Authentication is bypassed** - No need to sign in with Google
- ✅ **Mock user is automatically created** - You'll be signed in as "Dev User"
- ✅ **All protected routes are accessible** - Dashboard, Learn, Leaderboard, etc.
- ✅ **Visual indicators** - "DEV MODE" badges appear in the navbar
- ✅ **Console logging** - Clear indicators in browser console
- ✅ **Mock user data** - Realistic user stats for testing

## Mock User Details

The development mode creates a mock user with the following data:

```javascript
{
  id: 'dev-user-123',
  name: 'Dev User',
  email: 'dev@example.com',
  photoURL: 'https://via.placeholder.com/150',
  totalScore: 1500,
  level: 8,
  currentStreak: 5,
  longestStreak: 12
}
```

## How to Disable Development Mode

To return to normal Firebase authentication:

1. Remove the `VITE_DEV_BYPASS_AUTH` variable from your `.env.local` file, or
2. Set it to `false`:

```bash
VITE_DEV_BYPASS_AUTH=false
```

## Visual Indicators

When development mode is active, you'll see:

- 🟠 **"DEV MODE" badge** next to the Promptly logo
- 🟠 **"DEV" badge** in the user dropdown menu
- 🟠 **Console messages** with 🚀 emoji indicating dev mode actions

## Important Notes

⚠️ **Never enable development mode in production**
⚠️ **The `.env.local` file should not be committed to version control**
⚠️ **Development mode bypasses all authentication security**

## Troubleshooting

If development mode isn't working:

1. Check that your `.env.local` file is in the root directory
2. Ensure the variable is exactly: `VITE_DEV_BYPASS_AUTH=true`
3. Restart your development server after adding the environment variable
4. Check the browser console for dev mode messages

## Example .env.local File

```bash
# Firebase Configuration (your actual values)
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Development Mode
VITE_DEV_BYPASS_AUTH=true
``` 