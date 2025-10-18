# Eureka API Server

Backend REST API for the Eureka application, built with Express and TypeScript.

## Features

- **Persistent Storage**: Uses lowdb (JSON file database) for data persistence across server restarts
- **Full CRUD Operations**: Complete Create, Read, Update, Delete endpoints for all entities
- **Relationship Management**: Automatically populates related entity data (nested objects)
- **TypeScript**: Type-safe API with Express and TypeScript
- **CORS Enabled**: Ready for frontend integration
- **RESTful API**: Clean, predictable endpoint design

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or bun

## Installation

```bash
cd server
npm install
```

## Development

Start the development server with hot reload:

```bash
npm run dev
```

The server will start on `http://localhost:3001`

## Production

Build the TypeScript code:

```bash
npm run build
```

Run the production server:

```bash
npm start
```

## API Endpoints

### Health Check
- `GET /api/health` - Check server status and data counts

### Opportunities
- `GET /api/opportunities` - Get all opportunities
- `POST /api/opportunities` - Create a new opportunity
  - Body: `{ title: string, agreement_id: number | null, alliance_id: number }`
- `PUT /api/opportunities/:id` - Update an opportunity
  - Body: Partial opportunity object
- `DELETE /api/opportunities/:id` - Delete an opportunity

### Alliances
- `GET /api/alliances` - Get all alliances (basic)
- `GET /api/alliances/with-relations` - Get alliances with related opportunities and agreements
- `POST /api/alliances` - Create a new alliance
  - Body: `{ title: string }`
- `PUT /api/alliances/:id` - Update an alliance
  - Body: Partial alliance object
- `DELETE /api/alliances/:id` - Delete an alliance

### Agreements
- `GET /api/agreements` - Get all agreements
- `POST /api/agreements` - Create a new agreement
  - Body: `{ title: string, opportunity_id: number, alliance_id: number }`
- `PUT /api/agreements/:id` - Update an agreement
  - Body: Partial agreement object
- `DELETE /api/agreements/:id` - Delete an agreement

## Example Requests

### Create an Opportunity
```bash
curl -X POST http://localhost:3001/api/opportunities \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Partnership Opportunity",
    "agreement_id": null,
    "alliance_id": 1
  }'
```

### Get All Alliances with Relations
```bash
curl http://localhost:3001/api/alliances/with-relations
```

### Update an Opportunity
```bash
curl -X PUT http://localhost:3001/api/opportunities/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title"
  }'
```

### Delete an Opportunity
```bash
curl -X DELETE http://localhost:3001/api/opportunities/1
```

## Data Structure

### Entity Relationships
```
Alliance (1) ←→ (many) Opportunity (1) ←→ (0..1) Agreement
     ↑                                              ↑
     └──────────────────────────────────────────────┘
```

**Opportunity**
- `id`: number (auto-generated)
- `title`: string
- `agreement_id`: number | null (optional reference)
- `alliance_id`: number (required reference)
- `agreement`: Agreement | null (auto-populated)
- `alliance`: Alliance (auto-populated)

**Agreement**
- `id`: number (auto-generated)
- `title`: string
- `opportunity_id`: number
- `alliance_id`: number

**Alliance**
- `id`: number (auto-generated)
- `title`: string

## Data Persistence

All data is persisted in `server/db.json`. This file is automatically created on first run with sample data.

**Key Features:**
- All CRUD operations immediately save to disk
- Data survives server restarts
- Human-readable JSON format for easy debugging
- To reset database: delete `db.json` and restart server

## Environment Variables

Create a `.env` file in the server directory (optional):

```
PORT=3001
```

## Type Checking

Run TypeScript type checking without building:

```bash
npm run type-check
```