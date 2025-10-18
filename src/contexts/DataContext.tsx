import { createContext, useContext, useState, ReactNode } from "react";

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
  alliance_id: number;
  agreement?: Agreement | null;
  alliance: Alliance;
}

export interface AllianceWithRelations extends Alliance {
  opportunities: Opportunity[];
  agreements: Agreement[];
}

interface DataContextType {
  opportunities: Opportunity[];
  alliances: Alliance[];
  alliancesWithRelations: AllianceWithRelations[];
  agreements: Agreement[];
  addOpportunity: (opportunity: Omit<Opportunity, "id" | "agreement" | "alliance">) => void;
  updateOpportunity: (id: number, opportunity: Partial<Opportunity>) => void;
  deleteOpportunity: (id: number) => void;
  addAlliance: (alliance: Omit<Alliance, "id">) => void;
  addAgreement: (agreement: Omit<Agreement, "id">) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Initial mock data
const initialAlliances: Alliance[] = [
  { id: 1, title: "Tech Alliance Partners" },
  { id: 2, title: "Global Markets Alliance" },
  { id: 3, title: "Innovation Hub Collective" },
];

const initialAgreements: Agreement[] = [
  { id: 1, title: "Research Agreement 2024", opportunity_id: 1, alliance_id: 1 },
  { id: 2, title: "Distribution Agreement", opportunity_id: 3, alliance_id: 2 },
  { id: 3, title: "Technology Licensing Agreement", opportunity_id: 4, alliance_id: 1 },
];

const initialOpportunities: Opportunity[] = [
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
];

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(initialOpportunities);
  const [alliances, setAlliances] = useState<Alliance[]>(initialAlliances);
  const [agreements, setAgreements] = useState<Agreement[]>(initialAgreements);

  // Compute alliances with their related opportunities and agreements
  const alliancesWithRelations: AllianceWithRelations[] = alliances.map((alliance) => {
    const allianceOpportunities = opportunities.filter((opp) => opp.alliance_id === alliance.id);
    const allianceAgreements = agreements.filter((agr) => agr.alliance_id === alliance.id);

    return {
      ...alliance,
      opportunities: allianceOpportunities,
      agreements: allianceAgreements,
    };
  });

  const addOpportunity = (opportunityData: Omit<Opportunity, "id" | "agreement" | "alliance">) => {
    const newId = Math.max(...opportunities.map((o) => o.id), 0) + 1;
    const alliance = alliances.find((a) => a.id === opportunityData.alliance_id);
    const agreement = opportunityData.agreement_id
      ? agreements.find((a) => a.id === opportunityData.agreement_id)
      : null;

    const newOpportunity: Opportunity = {
      ...opportunityData,
      id: newId,
      alliance: alliance!,
      agreement: agreement || null,
    };

    setOpportunities([...opportunities, newOpportunity]);
  };

  const updateOpportunity = (id: number, opportunityData: Partial<Opportunity>) => {
    setOpportunities(
      opportunities.map((opp) =>
        opp.id === id ? { ...opp, ...opportunityData } : opp
      )
    );
  };

  const deleteOpportunity = (id: number) => {
    setOpportunities(opportunities.filter((opp) => opp.id !== id));
  };

  const addAlliance = (allianceData: Omit<Alliance, "id">) => {
    const newId = Math.max(...alliances.map((a) => a.id), 0) + 1;
    setAlliances([...alliances, { ...allianceData, id: newId }]);
  };

  const addAgreement = (agreementData: Omit<Agreement, "id">) => {
    const newId = Math.max(...agreements.map((a) => a.id), 0) + 1;
    setAgreements([...agreements, { ...agreementData, id: newId }]);
  };

  return (
    <DataContext.Provider
      value={{
        opportunities,
        alliances,
        alliancesWithRelations,
        agreements,
        addOpportunity,
        updateOpportunity,
        deleteOpportunity,
        addAlliance,
        addAgreement,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};