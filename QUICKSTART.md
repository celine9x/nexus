# Eureka - Quick Start Guide

Complete setup instructions for running the Eureka application with persistent backend.

## System Requirements

- Node.js v18+ or Bun
- npm or bun package manager

## Setup Instructions

### 1. Install Backend Dependencies

```bash
cd server
npm install
```

### 2. Install Frontend Dependencies

```bash
cd ..  # back to root
npm install
```

### 3. Start the Backend Server

```bash
cd server
npm run dev
```

The backend API will start at `http://localhost:3001`

You should see:
```
✅ Database initialized at: /path/to/server/db.json
🚀 Server is running on http://localhost:3001
```

### 4. Start the Frontend (in a new terminal)

```bash
# From project root
npm run dev
```

The frontend will start at `http://localhost:5173` (or next available port)

## Verify Everything Works

1. Open `http://localhost:5173` in your browser
2. Navigate to the Opportunities page
3. You should see 3 sample opportunities loaded from the backend
4. Try creating a new opportunity - it will be saved to the database!
5. Refresh the page - your data persists!

## Testing Persistence

To verify data persistence:

1. Create a new opportunity through the UI
2. Stop both servers (Ctrl+C)
3. Restart the backend: `cd server && npm run dev`
4. Restart the frontend: `npm run dev`
5. Navigate back to Opportunities - your created opportunity is still there!

## Database Location

All data is stored in: `server/db.json`

You can view/edit this file directly in any text editor to inspect or modify data.

## API Testing (Optional)

Test the API directly with curl:

```bash
# Check server health
curl http://localhost:3001/api/health

# Get all opportunities
curl http://localhost:3001/api/opportunities | jq

# Create a new opportunity
curl -X POST http://localhost:3001/api/opportunities \
  -H "Content-Type: application/json" \
  -d '{
    "title": "API Test Opportunity",
    "agreement_id": null,
    "alliance_id": 1
  }'

# Get all alliances
curl http://localhost:3001/api/alliances | jq
```

## Available API Endpoints

- `GET /api/opportunities` - List all opportunities
- `POST /api/opportunities` - Create opportunity
- `PUT /api/opportunities/:id` - Update opportunity
- `DELETE /api/opportunities/:id` - Delete opportunity
- `GET /api/alliances` - List all alliances
- `POST /api/alliances` - Create alliance
- `PUT /api/alliances/:id` - Update alliance
- `DELETE /api/alliances/:id` - Delete alliance
- `GET /api/agreements` - List all agreements
- `POST /api/agreements` - Create agreement
- `PUT /api/agreements/:id` - Update agreement
- `DELETE /api/agreements/:id` - Delete agreement

## Troubleshooting

**Port already in use:**
- Backend (3001): Change port in `server/src/index.ts` or set `PORT` env variable
- Frontend (5173): Vite will automatically use next available port

**Database not persisting:**
- Check that `server/db.json` exists and has write permissions
- Verify the backend console shows "✅ Database initialized"

**Frontend can't connect to backend:**
- Ensure backend is running on port 3001
- Check browser console for CORS or network errors
- Verify API_BASE_URL in `src/services/api.ts` is correct

**Data reset on restart:**
- Make sure you're not deleting `server/db.json`
- Verify write operations complete successfully (check console logs)

## Reset Database

To start fresh with sample data:

```bash
rm server/db.json
cd server && npm run dev
```

The database will be recreated with default sample data.

## Project Structure

```
Eureka/
├── src/                    # Frontend React application
│   ├── pages/
│   │   └── opportunity/    # Opportunities page with CRUD
│   ├── services/
│   │   └── api.ts          # API client for backend
│   └── components/         # UI components
├── server/                 # Backend API
│   ├── src/
│   │   ├── index.ts        # Express server & routes
│   │   └── db.ts           # Database config & helpers
│   ├── db.json             # Persistent data store
│   └── README.md           # Backend documentation
└── QUICKSTART.md           # This file
```

## Next Steps

- Explore the Opportunities page and try CRUD operations
- Check out the backend README at `server/README.md`
- Inspect `server/db.json` to see how data is stored
- Build more pages for Agreements and Alliances

Enjoy building with Eureka! 🚀
