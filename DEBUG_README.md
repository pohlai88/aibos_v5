# Debug Scripts for AIBOS v5

This directory contains debugging utilities and configurations for the AIBOS v5 project.

## Files Created

### VS Code Configuration (`.vscode/`)

- **`launch.json`** - Debug configurations for VS Code
- **`tasks.json`** - Build and development tasks
- **`settings.json`** - Project-specific VS Code settings
- **`extensions.json`** - Recommended extensions for debugging

### Debug Utilities

- **`public/utils/debug.js`** - Client-side debug utilities for the main app
- **`frontend/lib/debug.ts`** - Debug utilities for the Next.js frontend

## Debug Configurations Available

### 1. Debug Next.js Frontend

- Launches the Next.js development server with debugging enabled
- Automatically opens browser when ready
- Source maps enabled for breakpoint debugging

### 2. Debug in Chrome

- Launches Chrome with debugging enabled
- Connects to your local development servers
- Supports breakpoints in client-side code

### 3. Debug Main App

- For debugging the main HTML/CSS/JS application
- Serves files from the `public` directory

### 4. Full Stack Debugging

- Compound configuration that starts both frontend and main app debugging

## How to Use

### 1. Start Debug Mode

1. Open VS Code
2. Go to Run and Debug (Ctrl+Shift+D)
3. Select your desired debug configuration
4. Click the green play button or press F5

### 2. Enable Client-Side Debug Mode

Add `?debug=true` to your URL or run in console:

```javascript
// Enable debug mode
localStorage.setItem("debug", "true");
location.reload();

// Or use the global function
debugToggle();
```

### 3. Available Debug Utilities

#### Main App (`public/utils/debug.js`)

```javascript
// Basic logging
DebugUtil.log("Debug message");
DebugUtil.warn("Warning message");
DebugUtil.error("Error message");

// Inspect objects
DebugUtil.inspect(myObject, "My Object");
DebugUtil.table(myArray, "My Array");

// Performance timing
DebugUtil.time("Operation");
// ... your code ...
DebugUtil.timeEnd("Operation");

// Grouped logging
DebugUtil.group("My Group", () => {
  DebugUtil.log("Grouped message");
});
```

#### Next.js Frontend (`frontend/lib/debug.ts`)

```typescript
import { ClientDebug, ServerDebug, withDebug, withApiDebug } from "@/lib/debug";

// Client-side debugging
ClientDebug.log("Client debug message");

// Server-side debugging
ServerDebug.log("Server debug message");

// Wrap components for debugging
const MyComponent = withDebug(MyOriginalComponent, "MyComponent");

// Wrap API routes for debugging
export default withApiDebug(handler, "my-api-route");
```

## Debugging Features

### Automatic Features (when debug mode is enabled)

- **Network Monitoring** - Logs all fetch requests and responses
- **Supabase Query Logging** - Logs all database operations
- **DOM Mutation Tracking** - Logs DOM changes
- **Visual Debug Indicator** - Shows "DEBUG MODE" badge
- **Error Boundary Logging** - Enhanced error reporting

### Manual Debugging

- Set breakpoints in VS Code
- Use browser developer tools
- Console logging with timestamps
- Object inspection utilities
- Performance timing tools

## Recommended Extensions

The `.vscode/extensions.json` file includes recommendations for:

- TypeScript debugging
- Tailwind CSS IntelliSense
- Prettier code formatting
- ESLint error detection
- Chrome debugging tools
- Cypress testing support

## Environment Variables

Create a `.env.local` file in the frontend directory:

```
# Enable debug mode
DEBUG=true

# Supabase configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

## Tasks Available

Use Ctrl+Shift+P and type "Tasks: Run Task" to access:

- Start Next.js Dev Server
- Start Main App Server
- Build Tailwind CSS
- Watch Tailwind CSS
- Install Dependencies
- Run Tests
- Lint Code
- Format Code

## Troubleshooting

### Common Issues

1. **Port conflicts** - Change ports in `launch.json` if needed
2. **Source maps not working** - Ensure webpack devtool is enabled
3. **Breakpoints not hitting** - Check file paths in launch configuration

### Debug Mode Not Working

1. Clear browser cache
2. Check console for error messages
3. Verify debug utilities are loaded
4. Try `debugToggle()` in console

## Performance Debugging

Use the built-in performance tools:

```javascript
// Time operations
DebugUtil.time("Database Query");
await supabase.from("users").select("*");
DebugUtil.timeEnd("Database Query");

// Memory usage (in browser console)
console.log(performance.memory);
```

## Security Note

Debug mode should only be enabled in development. The utilities automatically disable in production unless explicitly enabled.
