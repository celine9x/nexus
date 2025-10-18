import express, { Request, Response } from 'express';
import cors from 'cors';
import db, { initDB, enrichOpportunity, getAlliancesWithRelations, type Agreement, type Alliance, type Opportunity, type AllianceWithRelations } from './db.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// OPPORTUNITIES ROUTES

// GET /opportunities - Get all opportunities
app.get('/api/opportunities', (req: Request, res: Response) => {
  res.json(db.data!.opportunities);
});

// POST /opportunities - Create a new opportunity
app.post('/api/opportunities', async (req: Request, res: Response) => {
  const { title, agreement_id, alliance_id } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const newId = Math.max(...db.data!.opportunities.map((o) => o.id), 0) + 1;
  const newOpportunity = enrichOpportunity({
    title,
    agreement_id: agreement_id || null,
    alliance_id: alliance_id || null
  }, newId);

  db.data!.opportunities.push(newOpportunity);
  await db.write();
  res.status(201).json(newOpportunity);
});

// PUT /opportunities/:id - Update an opportunity
app.put('/api/opportunities/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const opportunityIndex = db.data!.opportunities.findIndex((opp) => opp.id === id);

  if (opportunityIndex === -1) {
    return res.status(404).json({ error: 'Opportunity not found' });
  }

  const updatedData = req.body;

  // If alliance_id or agreement_id changed, we need to refresh the nested objects
  if (updatedData.alliance_id !== undefined) {
    const alliance = updatedData.alliance_id
      ? db.data!.alliances.find((a) => a.id === updatedData.alliance_id)
      : null;
    updatedData.alliance = alliance || null;
  }

  if (updatedData.agreement_id !== undefined) {
    const agreement = updatedData.agreement_id
      ? db.data!.agreements.find((a) => a.id === updatedData.agreement_id)
      : null;
    updatedData.agreement = agreement || null;
  }

  db.data!.opportunities[opportunityIndex] = {
    ...db.data!.opportunities[opportunityIndex],
    ...updatedData,
  };

  await db.write();
  res.json(db.data!.opportunities[opportunityIndex]);
});

// DELETE /opportunities/:id - Delete an opportunity
app.delete('/api/opportunities/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const initialLength = db.data!.opportunities.length;

  db.data!.opportunities = db.data!.opportunities.filter((opp) => opp.id !== id);

  if (db.data!.opportunities.length === initialLength) {
    return res.status(404).json({ error: 'Opportunity not found' });
  }

  await db.write();
  res.status(204).send();
});

// ALLIANCES ROUTES

// GET /alliances - Get all alliances (basic)
app.get('/api/alliances', (req: Request, res: Response) => {
  res.json(db.data!.alliances);
});

// GET /alliances/with-relations - Get alliances with their related opportunities and agreements
app.get('/api/alliances/with-relations', (req: Request, res: Response) => {
  const alliancesWithRelations = getAlliancesWithRelations();
  res.json(alliancesWithRelations);
});

// POST /alliances - Create a new alliance
app.post('/api/alliances', async (req: Request, res: Response) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const newId = Math.max(...db.data!.alliances.map((a) => a.id), 0) + 1;
  const newAlliance: Alliance = {
    id: newId,
    title,
  };

  db.data!.alliances.push(newAlliance);
  await db.write();
  res.status(201).json(newAlliance);
});

// AGREEMENTS ROUTES

// GET /agreements - Get all agreements
app.get('/api/agreements', (req: Request, res: Response) => {
  res.json(db.data!.agreements);
});

// POST /agreements - Create a new agreement
app.post('/api/agreements', async (req: Request, res: Response) => {
  const { title, opportunity_id, alliance_id } = req.body;

  if (!title || opportunity_id === undefined || alliance_id === undefined) {
    return res.status(400).json({
      error: 'Title, opportunity_id, and alliance_id are required'
    });
  }

  const newId = Math.max(...db.data!.agreements.map((a) => a.id), 0) + 1;
  const newAgreement: Agreement = {
    id: newId,
    title,
    opportunity_id,
    alliance_id,
  };

  db.data!.agreements.push(newAgreement);
  await db.write();
  res.status(201).json(newAgreement);
});

// PUT /agreements/:id - Update an agreement
app.put('/api/agreements/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const agreementIndex = db.data!.agreements.findIndex((agr) => agr.id === id);

  if (agreementIndex === -1) {
    return res.status(404).json({ error: 'Agreement not found' });
  }

  db.data!.agreements[agreementIndex] = {
    ...db.data!.agreements[agreementIndex],
    ...req.body,
  };

  await db.write();
  res.json(db.data!.agreements[agreementIndex]);
});

// DELETE /agreements/:id - Delete an agreement
app.delete('/api/agreements/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const initialLength = db.data!.agreements.length;

  db.data!.agreements = db.data!.agreements.filter((agr) => agr.id !== id);

  if (db.data!.agreements.length === initialLength) {
    return res.status(404).json({ error: 'Agreement not found' });
  }

  await db.write();
  res.status(204).send();
});

// PUT /alliances/:id - Update an alliance
app.put('/api/alliances/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const allianceIndex = db.data!.alliances.findIndex((all) => all.id === id);

  if (allianceIndex === -1) {
    return res.status(404).json({ error: 'Alliance not found' });
  }

  db.data!.alliances[allianceIndex] = {
    ...db.data!.alliances[allianceIndex],
    ...req.body,
  };

  await db.write();
  res.json(db.data!.alliances[allianceIndex]);
});

// DELETE /alliances/:id - Delete an alliance
app.delete('/api/alliances/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const initialLength = db.data!.alliances.length;

  db.data!.alliances = db.data!.alliances.filter((all) => all.id !== id);

  if (db.data!.alliances.length === initialLength) {
    return res.status(404).json({ error: 'Alliance not found' });
  }

  await db.write();
  res.status(204).send();
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    data: {
      opportunities: db.data!.opportunities.length,
      alliances: db.data!.alliances.length,
      agreements: db.data!.agreements.length,
    }
  });
});

// Initialize database and start server
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
    console.log(`\nAvailable routes:`);
    console.log(`  GET    /api/health`);
    console.log(`  GET    /api/opportunities`);
    console.log(`  POST   /api/opportunities`);
    console.log(`  PUT    /api/opportunities/:id`);
    console.log(`  DELETE /api/opportunities/:id`);
    console.log(`  GET    /api/alliances`);
    console.log(`  GET    /api/alliances/with-relations`);
    console.log(`  POST   /api/alliances`);
    console.log(`  PUT    /api/alliances/:id`);
    console.log(`  DELETE /api/alliances/:id`);
    console.log(`  GET    /api/agreements`);
    console.log(`  POST   /api/agreements`);
    console.log(`  PUT    /api/agreements/:id`);
    console.log(`  DELETE /api/agreements/:id`);
  });
});

export default app;