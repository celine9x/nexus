const API_BASE_URL = 'http://localhost:3001/api';

// Data structure interfaces
export type AgreementStatus = 'draft' | 'expired' | 'terminated' | 'canceled' | 'no';
export type AllianceStatus = 'active' | 'closed' | 'launching' | 'terminating';
export type OpportunityStatus = 'active' | 'decline' | 'on-hold';
export type ObligationStatus = 'complete' | 'pending' | 'terminated';
export type ObligationType = 'deliverable' | 'payment' | 'milestone' | 'compliance' | 'other';

export interface Agreement {
  id: number;
  title: string;
  opportunity_id: number;
  alliance_id: number;
  status: AgreementStatus;
}

export interface Alliance {
  id: number;
  title: string;
  status: AllianceStatus;
}

export interface Opportunity {
  id: number;
  title: string;
  agreement_id: number | null;
  alliance_id: number | null;
  status: OpportunityStatus;
  agreement?: Agreement | null;
  alliance?: Alliance | null;
}

export interface Obligation {
  id: number;
  title: string;
  status: ObligationStatus;
  forecasted_date: string;
  agreement_id: number;
  type: ObligationType;
  agreement?: Agreement | null;
}

export interface AllianceWithRelations extends Alliance {
  opportunities: Opportunity[];
  agreements: Agreement[];
}

// Opportunities API
export const opportunitiesApi = {
  getAll: async (): Promise<Opportunity[]> => {
    const response = await fetch(`${API_BASE_URL}/opportunities`);
    if (!response.ok) throw new Error('Failed to fetch opportunities');
    return response.json();
  },

  create: async (data: Omit<Opportunity, 'id' | 'agreement' | 'alliance'>): Promise<Opportunity> => {
    const response = await fetch(`${API_BASE_URL}/opportunities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create opportunity');
    return response.json();
  },

  update: async (id: number, data: Partial<Opportunity>): Promise<Opportunity> => {
    const response = await fetch(`${API_BASE_URL}/opportunities/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update opportunity');
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/opportunities/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete opportunity');
  },
};

// Alliances API
export const alliancesApi = {
  getAll: async (): Promise<Alliance[]> => {
    const response = await fetch(`${API_BASE_URL}/alliances`);
    if (!response.ok) throw new Error('Failed to fetch alliances');
    return response.json();
  },

  getAllWithRelations: async (): Promise<AllianceWithRelations[]> => {
    const response = await fetch(`${API_BASE_URL}/alliances/with-relations`);
    if (!response.ok) throw new Error('Failed to fetch alliances with relations');
    return response.json();
  },

  create: async (data: Omit<Alliance, 'id'>): Promise<Alliance> => {
    const response = await fetch(`${API_BASE_URL}/alliances`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create alliance');
    return response.json();
  },

  update: async (id: number, data: Partial<Alliance>): Promise<Alliance> => {
    const response = await fetch(`${API_BASE_URL}/alliances/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update alliance');
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/alliances/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete alliance');
  },
};

// Agreements API
export const agreementsApi = {
  getAll: async (): Promise<Agreement[]> => {
    const response = await fetch(`${API_BASE_URL}/agreements`);
    if (!response.ok) throw new Error('Failed to fetch agreements');
    return response.json();
  },

  create: async (data: Omit<Agreement, 'id'>): Promise<Agreement> => {
    const response = await fetch(`${API_BASE_URL}/agreements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create agreement');
    return response.json();
  },

  update: async (id: number, data: Partial<Agreement>): Promise<Agreement> => {
    const response = await fetch(`${API_BASE_URL}/agreements/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update agreement');
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/agreements/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete agreement');
  },
};

// Obligations API
export const obligationsApi = {
  getAll: async (): Promise<Obligation[]> => {
    const response = await fetch(`${API_BASE_URL}/obligations`);
    if (!response.ok) throw new Error('Failed to fetch obligations');
    return response.json();
  },

  create: async (data: Omit<Obligation, 'id' | 'agreement'>): Promise<Obligation> => {
    const response = await fetch(`${API_BASE_URL}/obligations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create obligation');
    return response.json();
  },

  update: async (id: number, data: Partial<Obligation>): Promise<Obligation> => {
    const response = await fetch(`${API_BASE_URL}/obligations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update obligation');
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/obligations/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete obligation');
  },
};