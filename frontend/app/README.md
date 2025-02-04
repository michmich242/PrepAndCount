# App Router Structure   (Please read) by rafaa

This folder contains the routing and layout structure for our app using Expo Router. Here's how it's organized:

```
app/
  ├── (auth)             # Authentication route group
  │   ├── _layout.js     # Shared auth layout (no headers)
  │   ├── index.js       # Login screen
  │   └── register.js    # Register screen
  │
  ├── (tabs)             # Main app tabs route group
  │   ├── _layout.js     # Shared tabs layout (tab bar)
  │   ├── index.js       # Home tab
  │   ├── settings.js    # Settings tab
  │   └── grocery-list.js # Grocery list tab
  │
  └── _layout.js         # Root layout (handles auth state)
```

## Route Groups Explained

### What are Route Groups?
Route groups (folders with parentheses) are a way to organize routes without affecting the URL structure. They help us:
1. Group related screens together
2. Share layouts between screens
3. Handle navigation logic efficiently

### (auth) Route Group
- Contains authentication-related screens
- Has its own layout with no headers
- Only accessible to non-authenticated users
- Includes login and registration screens
- Example URL: `/register` (not `/(auth)/register`)

### (tabs) Route Group
- Contains main app screens with tab navigation
- Shares a common tab bar layout
- Only accessible to authenticated users
- Each screen becomes a tab in the navigation
- Example URL: `/settings` (not `/(tabs)/settings`)

## Layout Files (_layout.js)

### Root Layout (_layout.js)
- Handles authentication state
- Controls which route group to show (auth or tabs)
- Provides context providers (dark mode, auth, etc.)
- Manages app-wide state and configuration

### Auth Layout ((auth)/_layout.js)
- Configures layout for auth screens
- Removes headers for clean login/register UI
- Handles navigation between auth screens

### Tabs Layout ((tabs)/_layout.js)
- Configures the tab bar navigation
- Sets up tab icons and styling
- Manages tab-specific settings

## Working with This Structure

### Adding New Screens
1. **Auth Screens**: Add to the (auth) folder
2. **Tab Screens**: Add to the (tabs) folder
3. **Other Screens**: Add to the root app folder

### Navigation
- Use `router.replace('/')` for auth screens
- Use `router.replace('/(tabs)')` for main app
- Use `router.push()` for stack navigation

### Authentication Flow
1. App starts → Root layout checks auth state
2. If not authenticated → Shows (auth) group
3. If authenticated → Shows (tabs) group
4. Sign out → Removes token and returns to (auth)

## Best Practices
1. Keep related screens in their route groups
2. Use consistent navigation patterns
3. Handle authentication state in root layout
4. Share layouts when possible
5. Keep URL paths clean and logical

## Common Issues
1. **Screen Not Showing**: Check the route group and layout
2. **Navigation Issues**: Verify the path matches the folder structure
3. **Layout Problems**: Ensure proper nesting of Stack/Tabs components

Remember: The parentheses in folder names are special - they create route groups without affecting the URL structure. This helps keep the code organized while maintaining clean, user-friendly URLs.
