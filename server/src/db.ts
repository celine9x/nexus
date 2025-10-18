import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Data structure interfaces
export interface Agreement {
  id: number;
  title: string;
  opportunity_id: number;
  alliance_id: number;
}

export interface Alliance {
  id: number;
  title: string;
}

export interface Opportunity {
  id: number;
  title: string;
  agreement_id: number | null;
  alliance_id: number | null;
  agreement?: Agreement | null;
  alliance?: Alliance | null;
}

export interface AllianceWithRelations extends Alliance {
  opportunities: Opportunity[];
  agreements: Agreement[];
}

// Database schema
interface DatabaseSchema {
  alliances: Alliance[];
  agreements: Agreement[];
  opportunities: Opportunity[];
}

// Default data
const defaultData: DatabaseSchema = {
  alliances: [
    { id: 1, title: "Tech Alliance Partners" },
    { id: 2, title: "Global Markets Alliance" },
    { id: 3, title: "Innovation Hub Collective" },
  ],
  agreements: [
    { id: 1, title: "Research Agreement 2024", opportunity_id: 1, alliance_id: 1 },
    { id: 2, title: "Distribution Agreement", opportunity_id: 3, alliance_id: 2 },
    { id: 3, title: "Technology Licensing Agreement", opportunity_id: 4, alliance_id: 1 },
  ],
  opportunities: [
    {
      id: 1,
      title: "Research Collaboration Project",
      agreement_id: 1,
      alliance_id: 1,
      agreement: { id: 1, title: "Research Agreement 2024", opportunity_id: 1, alliance_id: 1 },
      alliance: { id: 1, title: "Tech Alliance Partners" },
    },
    {
      id: 2,
      title: "Product Development Initiative",
      agreement_id: null,
      alliance_id: 1,
      agreement: null,
      alliance: { id: 1, title: "Tech Alliance Partners" },
    },
    {
      id: 3,
      title: "Market Expansion Strategy",
      agreement_id: 2,
      alliance_id: 2,
      agreement: { id: 2, title: "Distribution Agreement", opportunity_id: 3, alliance_id: 2 },
      alliance: { id: 2, title: "Global Markets Alliance" },
    },
  ],
};

// Create database file path
const file = join(__dirname, '../db.json');
const adapter = new JSONFile<DatabaseSchema>(file);
const db = new Low<DatabaseSchema>(adapter, defaultData);

// Initialize database
export async function initDB() {
  await db.read();
  db.data ||= defaultData;
  await db.write();
  console.log('✅ Database initialized at:', file);
}

// Helper function to enrich opportunity with relations
export function enrichOpportunity(opportunityData: {
  title: string;
  agreement_id: number | null;
  alliance_id: number | null;
}, id: number): Opportunity {
  const alliance = opportunityData.alliance_id
    ? db.data!.alliances.find((a) => a.id === opportunityData.alliance_id)
    : null;
  const agreement = opportunityData.agreement_id
    ? db.data!.agreements.find((a) => a.id === opportunityData.agreement_id)
    : null;

  return {
    ...opportunityData,
    id,
    alliance: alliance || null,
    agreement: agreement || null,
  };
}

// Helper function to compute alliances with relations
export function getAlliancesWithRelations(): AllianceWithRelations[] {
  return db.data!.alliances.map((alliance) => {
    const allianceOpportunities = db.data!.opportunities.filter((opp) => opp.alliance_id === alliance.id);
    const allianceAgreements = db.data!.agreements.filter((agr) => agr.alliance_id === alliance.id);

    return {
      ...alliance,
      opportunities: allianceOpportunities,
      agreements: allianceAgreements,
    };
  });
}

export default db;