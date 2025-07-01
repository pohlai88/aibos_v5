@echo off
echo Starting AIBOS v5 Debug Environment...
echo.
echo This will start:
echo - Main app server on http://localhost:3001
echo - Next.js frontend on http://localhost:3000
echo - Debug test page at http://localhost:3001/debug-test.html
echo.
echo Press Ctrl+C to stop all servers
echo.
pause
start http://localhost:3001/debug-test.html
start http://localhost:3000
npm run debug:full
