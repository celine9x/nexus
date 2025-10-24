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

export type ObligationStatus = 'complete' | 'pending' | 'terminated';
export type ObligationType = 'deliverable' | 'payment' | 'milestone' | 'compliance' | 'other';

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

// Database schema
interface DatabaseSchema {
  alliances: Alliance[];
  agreements: Agreement[];
  opportunities: Opportunity[];
  obligations: Obligation[];
}

// Default data
const defaultData: DatabaseSchema = {
  // Step 1: Define Alliances (Base entities with no dependencies)
  alliances: [
    { id: 1, title: "Tech Alliance Partners" },
    { id: 2, title: "Global Markets Alliance" },
    { id: 3, title: "Innovation Hub Collective" },
    { id: 4, title: "Healthcare Innovation Network" },
    { id: 5, title: "FinTech Consortium" },
    { id: 6, title: "Sustainable Energy Coalition" },
    { id: 7, title: "Aerospace & Defense Collaborative" },
    { id: 8, title: "EdTech Innovation Alliance" },
    { id: 9, title: "Smart Manufacturing Network" },
    { id: 10, title: "Retail & E-commerce Partnership" },
  ],

  // Step 2: Define Opportunities (Linked to Alliances, may link to Agreements later)
  opportunities: [
    // Tech Alliance Partners (alliance_id: 1)
    {
      id: 1,
      title: "AI-Powered Analytics Platform",
      agreement_id: 1,
      alliance_id: 1,
      agreement: { id: 1, title: "AI Research & Development Agreement", opportunity_id: 1, alliance_id: 1 },
      alliance: { id: 1, title: "Tech Alliance Partners" },
    },
    {
      id: 2,
      title: "Cloud Infrastructure Modernization",
      agreement_id: 2,
      alliance_id: 1,
      agreement: { id: 2, title: "Cloud Services Partnership Agreement", opportunity_id: 2, alliance_id: 1 },
      alliance: { id: 1, title: "Tech Alliance Partners" },
    },
    {
      id: 3,
      title: "Cybersecurity Enhancement Initiative",
      agreement_id: null,
      alliance_id: 1,
      agreement: null,
      alliance: { id: 1, title: "Tech Alliance Partners" },
    },
    {
      id: 4,
      title: "Open Source Software Collaboration",
      agreement_id: 3,
      alliance_id: 1,
      agreement: { id: 3, title: "Open Source Licensing Agreement", opportunity_id: 4, alliance_id: 1 },
      alliance: { id: 1, title: "Tech Alliance Partners" },
    },

    // Global Markets Alliance (alliance_id: 2)
    {
      id: 5,
      title: "APAC Market Expansion",
      agreement_id: 4,
      alliance_id: 2,
      agreement: { id: 4, title: "Asia-Pacific Distribution Agreement", opportunity_id: 5, alliance_id: 2 },
      alliance: { id: 2, title: "Global Markets Alliance" },
    },
    {
      id: 6,
      title: "European B2B Sales Strategy",
      agreement_id: 5,
      alliance_id: 2,
      agreement: { id: 5, title: "European Partnership Agreement", opportunity_id: 6, alliance_id: 2 },
      alliance: { id: 2, title: "Global Markets Alliance" },
    },
    {
      id: 7,
      title: "Latin America Market Entry",
      agreement_id: null,
      alliance_id: 2,
      agreement: null,
      alliance: { id: 2, title: "Global Markets Alliance" },
    },

    // Innovation Hub Collective (alliance_id: 3)
    {
      id: 8,
      title: "Quantum Computing Research Initiative",
      agreement_id: 6,
      alliance_id: 3,
      agreement: { id: 6, title: "Joint Research & IP Sharing Agreement", opportunity_id: 8, alliance_id: 3 },
      alliance: { id: 3, title: "Innovation Hub Collective" },
    },
    {
      id: 9,
      title: "Startup Incubation Program",
      agreement_id: null,
      alliance_id: 3,
      agreement: null,
      alliance: { id: 3, title: "Innovation Hub Collective" },
    },
    {
      id: 10,
      title: "Innovation Lab Co-Development",
      agreement_id: 7,
      alliance_id: 3,
      agreement: { id: 7, title: "Co-Innovation Framework Agreement", opportunity_id: 10, alliance_id: 3 },
      alliance: { id: 3, title: "Innovation Hub Collective" },
    },

    // Healthcare Innovation Network (alliance_id: 4)
    {
      id: 11,
      title: "Digital Health Platform Development",
      agreement_id: 8,
      alliance_id: 4,
      agreement: { id: 8, title: "Healthcare Technology Agreement", opportunity_id: 11, alliance_id: 4 },
      alliance: { id: 4, title: "Healthcare Innovation Network" },
    },
    {
      id: 12,
      title: "Telemedicine Integration Project",
      agreement_id: 9,
      alliance_id: 4,
      agreement: { id: 9, title: "Telemedicine Services Agreement", opportunity_id: 12, alliance_id: 4 },
      alliance: { id: 4, title: "Healthcare Innovation Network" },
    },

    // FinTech Consortium (alliance_id: 5)
    {
      id: 13,
      title: "Blockchain Payment System",
      agreement_id: 10,
      alliance_id: 5,
      agreement: { id: 10, title: "Blockchain Technology Partnership", opportunity_id: 13, alliance_id: 5 },
      alliance: { id: 5, title: "FinTech Consortium" },
    },
    {
      id: 14,
      title: "Digital Banking Innovation",
      agreement_id: null,
      alliance_id: 5,
      agreement: null,
      alliance: { id: 5, title: "FinTech Consortium" },
    },
    {
      id: 15,
      title: "RegTech Compliance Solution",
      agreement_id: 11,
      alliance_id: 5,
      agreement: { id: 11, title: "Regulatory Technology Agreement", opportunity_id: 15, alliance_id: 5 },
      alliance: { id: 5, title: "FinTech Consortium" },
    },

    // Sustainable Energy Coalition (alliance_id: 6)
    {
      id: 16,
      title: "Solar Energy Grid Integration",
      agreement_id: 12,
      alliance_id: 6,
      agreement: { id: 12, title: "Renewable Energy Partnership", opportunity_id: 16, alliance_id: 6 },
      alliance: { id: 6, title: "Sustainable Energy Coalition" },
    },
    {
      id: 17,
      title: "Carbon Offset Trading Platform",
      agreement_id: null,
      alliance_id: 6,
      agreement: null,
      alliance: { id: 6, title: "Sustainable Energy Coalition" },
    },

    // Aerospace & Defense Collaborative (alliance_id: 7)
    {
      id: 18,
      title: "Satellite Communication System",
      agreement_id: 13,
      alliance_id: 7,
      agreement: { id: 13, title: "Space Technology Development Agreement", opportunity_id: 18, alliance_id: 7 },
      alliance: { id: 7, title: "Aerospace & Defense Collaborative" },
    },
    {
      id: 19,
      title: "Unmanned Aerial Vehicle Program",
      agreement_id: null,
      alliance_id: 7,
      agreement: null,
      alliance: { id: 7, title: "Aerospace & Defense Collaborative" },
    },

    // EdTech Innovation Alliance (alliance_id: 8)
    {
      id: 20,
      title: "AI-Powered Learning Platform",
      agreement_id: 14,
      alliance_id: 8,
      agreement: { id: 14, title: "Educational Technology Partnership", opportunity_id: 20, alliance_id: 8 },
      alliance: { id: 8, title: "EdTech Innovation Alliance" },
    },
    {
      id: 21,
      title: "Virtual Classroom Infrastructure",
      agreement_id: 15,
      alliance_id: 8,
      agreement: { id: 15, title: "Digital Education Services Agreement", opportunity_id: 21, alliance_id: 8 },
      alliance: { id: 8, title: "EdTech Innovation Alliance" },
    },

    // Smart Manufacturing Network (alliance_id: 9)
    {
      id: 22,
      title: "IoT-Enabled Factory Automation",
      agreement_id: 16,
      alliance_id: 9,
      agreement: { id: 16, title: "Industrial IoT Partnership Agreement", opportunity_id: 22, alliance_id: 9 },
      alliance: { id: 9, title: "Smart Manufacturing Network" },
    },
    {
      id: 23,
      title: "Predictive Maintenance System",
      agreement_id: null,
      alliance_id: 9,
      agreement: null,
      alliance: { id: 9, title: "Smart Manufacturing Network" },
    },

    // Retail & E-commerce Partnership (alliance_id: 10)
    {
      id: 24,
      title: "Omnichannel Commerce Platform",
      agreement_id: 17,
      alliance_id: 10,
      agreement: { id: 17, title: "Retail Technology Agreement", opportunity_id: 24, alliance_id: 10 },
      alliance: { id: 10, title: "Retail & E-commerce Partnership" },
    },
    {
      id: 25,
      title: "AI-Driven Inventory Optimization",
      agreement_id: 18,
      alliance_id: 10,
      agreement: { id: 18, title: "Supply Chain Innovation Agreement", opportunity_id: 25, alliance_id: 10 },
      alliance: { id: 10, title: "Retail & E-commerce Partnership" },
    },
  ],

  // Step 3: Define Agreements (Linked to both Opportunities and Alliances)
  agreements: [
    // Tech Alliance Partners agreements
    { id: 1, title: "AI Research & Development Agreement", opportunity_id: 1, alliance_id: 1 },
    { id: 2, title: "Cloud Services Partnership Agreement", opportunity_id: 2, alliance_id: 1 },
    { id: 3, title: "Open Source Licensing Agreement", opportunity_id: 4, alliance_id: 1 },

    // Global Markets Alliance agreements
    { id: 4, title: "Asia-Pacific Distribution Agreement", opportunity_id: 5, alliance_id: 2 },
    { id: 5, title: "European Partnership Agreement", opportunity_id: 6, alliance_id: 2 },

    // Innovation Hub Collective agreements
    { id: 6, title: "Joint Research & IP Sharing Agreement", opportunity_id: 8, alliance_id: 3 },
    { id: 7, title: "Co-Innovation Framework Agreement", opportunity_id: 10, alliance_id: 3 },

    // Healthcare Innovation Network agreements
    { id: 8, title: "Healthcare Technology Agreement", opportunity_id: 11, alliance_id: 4 },
    { id: 9, title: "Telemedicine Services Agreement", opportunity_id: 12, alliance_id: 4 },

    // FinTech Consortium agreements
    { id: 10, title: "Blockchain Technology Partnership", opportunity_id: 13, alliance_id: 5 },
    { id: 11, title: "Regulatory Technology Agreement", opportunity_id: 15, alliance_id: 5 },

    // Sustainable Energy Coalition agreements
    { id: 12, title: "Renewable Energy Partnership", opportunity_id: 16, alliance_id: 6 },

    // Aerospace & Defense Collaborative agreements
    { id: 13, title: "Space Technology Development Agreement", opportunity_id: 18, alliance_id: 7 },

    // EdTech Innovation Alliance agreements
    { id: 14, title: "Educational Technology Partnership", opportunity_id: 20, alliance_id: 8 },
    { id: 15, title: "Digital Education Services Agreement", opportunity_id: 21, alliance_id: 8 },

    // Smart Manufacturing Network agreements
    { id: 16, title: "Industrial IoT Partnership Agreement", opportunity_id: 22, alliance_id: 9 },

    // Retail & E-commerce Partnership agreements
    { id: 17, title: "Retail Technology Agreement", opportunity_id: 24, alliance_id: 10 },
    { id: 18, title: "Supply Chain Innovation Agreement", opportunity_id: 25, alliance_id: 10 },
  ],

  // Step 4: Define Obligations (Linked to Agreements)
  obligations: [
    // Agreement 1: AI Research & Development Agreement
    {
      id: 1,
      title: "Deliver AI Model Architecture Design",
      status: "complete",
      forecasted_date: "2025-02-15",
      agreement_id: 1,
      type: "deliverable",
      agreement: { id: 1, title: "AI Research & Development Agreement", opportunity_id: 1, alliance_id: 1 },
    },
    {
      id: 2,
      title: "Q1 Research Funding Payment",
      status: "complete",
      forecasted_date: "2025-03-31",
      agreement_id: 1,
      type: "payment",
      agreement: { id: 1, title: "AI Research & Development Agreement", opportunity_id: 1, alliance_id: 1 },
    },
    {
      id: 3,
      title: "Complete Beta Testing Phase",
      status: "pending",
      forecasted_date: "2025-06-30",
      agreement_id: 1,
      type: "milestone",
      agreement: { id: 1, title: "AI Research & Development Agreement", opportunity_id: 1, alliance_id: 1 },
    },
    {
      id: 4,
      title: "Submit Final Research Report",
      status: "pending",
      forecasted_date: "2025-12-31",
      agreement_id: 1,
      type: "deliverable",
      agreement: { id: 1, title: "AI Research & Development Agreement", opportunity_id: 1, alliance_id: 1 },
    },

    // Agreement 2: Cloud Services Partnership Agreement
    {
      id: 5,
      title: "Infrastructure Migration Plan",
      status: "complete",
      forecasted_date: "2025-01-31",
      agreement_id: 2,
      type: "deliverable",
      agreement: { id: 2, title: "Cloud Services Partnership Agreement", opportunity_id: 2, alliance_id: 1 },
    },
    {
      id: 6,
      title: "Phase 1 Migration Completion",
      status: "pending",
      forecasted_date: "2025-05-15",
      agreement_id: 2,
      type: "milestone",
      agreement: { id: 2, title: "Cloud Services Partnership Agreement", opportunity_id: 2, alliance_id: 1 },
    },
    {
      id: 7,
      title: "Monthly Service Fee Payment",
      status: "pending",
      forecasted_date: "2025-04-30",
      agreement_id: 2,
      type: "payment",
      agreement: { id: 2, title: "Cloud Services Partnership Agreement", opportunity_id: 2, alliance_id: 1 },
    },

    // Agreement 3: Open Source Licensing Agreement
    {
      id: 8,
      title: "License Compliance Audit",
      status: "pending",
      forecasted_date: "2025-07-01",
      agreement_id: 3,
      type: "compliance",
      agreement: { id: 3, title: "Open Source Licensing Agreement", opportunity_id: 4, alliance_id: 1 },
    },
    {
      id: 9,
      title: "Code Contribution Deliverable",
      status: "pending",
      forecasted_date: "2025-08-15",
      agreement_id: 3,
      type: "deliverable",
      agreement: { id: 3, title: "Open Source Licensing Agreement", opportunity_id: 4, alliance_id: 1 },
    },

    // Agreement 4: Asia-Pacific Distribution Agreement
    {
      id: 10,
      title: "Market Entry Strategy Document",
      status: "complete",
      forecasted_date: "2025-01-15",
      agreement_id: 4,
      type: "deliverable",
      agreement: { id: 4, title: "Asia-Pacific Distribution Agreement", opportunity_id: 5, alliance_id: 2 },
    },
    {
      id: 11,
      title: "Launch 3 Regional Offices",
      status: "pending",
      forecasted_date: "2025-09-30",
      agreement_id: 4,
      type: "milestone",
      agreement: { id: 4, title: "Asia-Pacific Distribution Agreement", opportunity_id: 5, alliance_id: 2 },
    },
    {
      id: 12,
      title: "Quarterly Revenue Sharing Payment",
      status: "pending",
      forecasted_date: "2025-06-30",
      agreement_id: 4,
      type: "payment",
      agreement: { id: 4, title: "Asia-Pacific Distribution Agreement", opportunity_id: 5, alliance_id: 2 },
    },

    // Agreement 5: European Partnership Agreement
    {
      id: 13,
      title: "GDPR Compliance Documentation",
      status: "complete",
      forecasted_date: "2025-02-28",
      agreement_id: 5,
      type: "compliance",
      agreement: { id: 5, title: "European Partnership Agreement", opportunity_id: 6, alliance_id: 2 },
    },
    {
      id: 14,
      title: "Partner Onboarding Package",
      status: "pending",
      forecasted_date: "2025-05-30",
      agreement_id: 5,
      type: "deliverable",
      agreement: { id: 5, title: "European Partnership Agreement", opportunity_id: 6, alliance_id: 2 },
    },
    {
      id: 15,
      title: "Achieve 100 Partner Sign-ups",
      status: "pending",
      forecasted_date: "2025-10-31",
      agreement_id: 5,
      type: "milestone",
      agreement: { id: 5, title: "European Partnership Agreement", opportunity_id: 6, alliance_id: 2 },
    },

    // Agreement 6: Joint Research & IP Sharing Agreement
    {
      id: 16,
      title: "Quantum Algorithm Development",
      status: "pending",
      forecasted_date: "2025-11-30",
      agreement_id: 6,
      type: "deliverable",
      agreement: { id: 6, title: "Joint Research & IP Sharing Agreement", opportunity_id: 8, alliance_id: 3 },
    },
    {
      id: 17,
      title: "IP Rights Registration",
      status: "pending",
      forecasted_date: "2025-12-31",
      agreement_id: 6,
      type: "compliance",
      agreement: { id: 6, title: "Joint Research & IP Sharing Agreement", opportunity_id: 8, alliance_id: 3 },
    },
    {
      id: 18,
      title: "Research Grant Payment",
      status: "complete",
      forecasted_date: "2025-03-01",
      agreement_id: 6,
      type: "payment",
      agreement: { id: 6, title: "Joint Research & IP Sharing Agreement", opportunity_id: 8, alliance_id: 3 },
    },

    // Agreement 7: Co-Innovation Framework Agreement
    {
      id: 19,
      title: "Innovation Lab Setup",
      status: "complete",
      forecasted_date: "2025-02-01",
      agreement_id: 7,
      type: "milestone",
      agreement: { id: 7, title: "Co-Innovation Framework Agreement", opportunity_id: 10, alliance_id: 3 },
    },
    {
      id: 20,
      title: "First Prototype Development",
      status: "pending",
      forecasted_date: "2025-07-15",
      agreement_id: 7,
      type: "deliverable",
      agreement: { id: 7, title: "Co-Innovation Framework Agreement", opportunity_id: 10, alliance_id: 3 },
    },

    // Agreement 8: Healthcare Technology Agreement
    {
      id: 21,
      title: "HIPAA Compliance Certification",
      status: "complete",
      forecasted_date: "2025-03-15",
      agreement_id: 8,
      type: "compliance",
      agreement: { id: 8, title: "Healthcare Technology Agreement", opportunity_id: 11, alliance_id: 4 },
    },
    {
      id: 22,
      title: "Platform Beta Launch",
      status: "pending",
      forecasted_date: "2025-08-01",
      agreement_id: 8,
      type: "milestone",
      agreement: { id: 8, title: "Healthcare Technology Agreement", opportunity_id: 11, alliance_id: 4 },
    },
    {
      id: 23,
      title: "Patient Data Security Audit",
      status: "pending",
      forecasted_date: "2025-09-30",
      agreement_id: 8,
      type: "compliance",
      agreement: { id: 8, title: "Healthcare Technology Agreement", opportunity_id: 11, alliance_id: 4 },
    },

    // Agreement 9: Telemedicine Services Agreement
    {
      id: 24,
      title: "Integration API Documentation",
      status: "complete",
      forecasted_date: "2025-02-20",
      agreement_id: 9,
      type: "deliverable",
      agreement: { id: 9, title: "Telemedicine Services Agreement", opportunity_id: 12, alliance_id: 4 },
    },
    {
      id: 25,
      title: "Go-Live with 5 Pilot Hospitals",
      status: "pending",
      forecasted_date: "2025-06-01",
      agreement_id: 9,
      type: "milestone",
      agreement: { id: 9, title: "Telemedicine Services Agreement", opportunity_id: 12, alliance_id: 4 },
    },
    {
      id: 26,
      title: "Monthly Licensing Fee",
      status: "pending",
      forecasted_date: "2025-05-31",
      agreement_id: 9,
      type: "payment",
      agreement: { id: 9, title: "Telemedicine Services Agreement", opportunity_id: 12, alliance_id: 4 },
    },

    // Agreement 10: Blockchain Technology Partnership
    {
      id: 27,
      title: "Smart Contract Development",
      status: "pending",
      forecasted_date: "2025-07-31",
      agreement_id: 10,
      type: "deliverable",
      agreement: { id: 10, title: "Blockchain Technology Partnership", opportunity_id: 13, alliance_id: 5 },
    },
    {
      id: 28,
      title: "Security Audit Completion",
      status: "pending",
      forecasted_date: "2025-08-31",
      agreement_id: 10,
      type: "compliance",
      agreement: { id: 10, title: "Blockchain Technology Partnership", opportunity_id: 13, alliance_id: 5 },
    },
    {
      id: 29,
      title: "Process 10,000 Transactions",
      status: "pending",
      forecasted_date: "2025-10-15",
      agreement_id: 10,
      type: "milestone",
      agreement: { id: 10, title: "Blockchain Technology Partnership", opportunity_id: 13, alliance_id: 5 },
    },

    // Agreement 11: Regulatory Technology Agreement
    {
      id: 30,
      title: "Regulatory Compliance Framework",
      status: "complete",
      forecasted_date: "2025-01-31",
      agreement_id: 11,
      type: "deliverable",
      agreement: { id: 11, title: "Regulatory Technology Agreement", opportunity_id: 15, alliance_id: 5 },
    },
    {
      id: 31,
      title: "SEC/FINRA Approval",
      status: "pending",
      forecasted_date: "2025-09-15",
      agreement_id: 11,
      type: "compliance",
      agreement: { id: 11, title: "Regulatory Technology Agreement", opportunity_id: 15, alliance_id: 5 },
    },
    {
      id: 32,
      title: "Implementation Payment Milestone",
      status: "pending",
      forecasted_date: "2025-11-01",
      agreement_id: 11,
      type: "payment",
      agreement: { id: 11, title: "Regulatory Technology Agreement", opportunity_id: 15, alliance_id: 5 },
    },

    // Agreement 12: Renewable Energy Partnership
    {
      id: 33,
      title: "Grid Integration Design Document",
      status: "complete",
      forecasted_date: "2025-03-01",
      agreement_id: 12,
      type: "deliverable",
      agreement: { id: 12, title: "Renewable Energy Partnership", opportunity_id: 16, alliance_id: 6 },
    },
    {
      id: 34,
      title: "Install 50MW Solar Capacity",
      status: "pending",
      forecasted_date: "2025-12-15",
      agreement_id: 12,
      type: "milestone",
      agreement: { id: 12, title: "Renewable Energy Partnership", opportunity_id: 16, alliance_id: 6 },
    },
    {
      id: 35,
      title: "Environmental Impact Assessment",
      status: "pending",
      forecasted_date: "2025-06-30",
      agreement_id: 12,
      type: "compliance",
      agreement: { id: 12, title: "Renewable Energy Partnership", opportunity_id: 16, alliance_id: 6 },
    },
    {
      id: 36,
      title: "Quarterly Infrastructure Investment",
      status: "pending",
      forecasted_date: "2025-06-30",
      agreement_id: 12,
      type: "payment",
      agreement: { id: 12, title: "Renewable Energy Partnership", opportunity_id: 16, alliance_id: 6 },
    },

    // Agreement 13: Space Technology Development Agreement
    {
      id: 37,
      title: "Satellite Prototype Design",
      status: "complete",
      forecasted_date: "2025-04-15",
      agreement_id: 13,
      type: "deliverable",
      agreement: { id: 13, title: "Space Technology Development Agreement", opportunity_id: 18, alliance_id: 7 },
    },
    {
      id: 38,
      title: "Launch Readiness Review",
      status: "pending",
      forecasted_date: "2025-11-30",
      agreement_id: 13,
      type: "milestone",
      agreement: { id: 13, title: "Space Technology Development Agreement", opportunity_id: 18, alliance_id: 7 },
    },
    {
      id: 39,
      title: "FAA/FCC Regulatory Approval",
      status: "pending",
      forecasted_date: "2025-09-30",
      agreement_id: 13,
      type: "compliance",
      agreement: { id: 13, title: "Space Technology Development Agreement", opportunity_id: 18, alliance_id: 7 },
    },

    // Agreement 14: Educational Technology Partnership
    {
      id: 40,
      title: "Learning Management System Integration",
      status: "complete",
      forecasted_date: "2025-02-28",
      agreement_id: 14,
      type: "deliverable",
      agreement: { id: 14, title: "Educational Technology Partnership", opportunity_id: 20, alliance_id: 8 },
    },
    {
      id: 41,
      title: "Onboard 100 Educational Institutions",
      status: "pending",
      forecasted_date: "2025-08-31",
      agreement_id: 14,
      type: "milestone",
      agreement: { id: 14, title: "Educational Technology Partnership", opportunity_id: 20, alliance_id: 8 },
    },
    {
      id: 42,
      title: "FERPA Compliance Certification",
      status: "pending",
      forecasted_date: "2025-05-15",
      agreement_id: 14,
      type: "compliance",
      agreement: { id: 14, title: "Educational Technology Partnership", opportunity_id: 20, alliance_id: 8 },
    },
    {
      id: 43,
      title: "Annual Licensing Fee Payment",
      status: "pending",
      forecasted_date: "2025-12-31",
      agreement_id: 14,
      type: "payment",
      agreement: { id: 14, title: "Educational Technology Partnership", opportunity_id: 20, alliance_id: 8 },
    },

    // Agreement 15: Digital Education Services Agreement
    {
      id: 44,
      title: "Virtual Classroom Platform Deployment",
      status: "complete",
      forecasted_date: "2025-03-20",
      agreement_id: 15,
      type: "deliverable",
      agreement: { id: 15, title: "Digital Education Services Agreement", opportunity_id: 21, alliance_id: 8 },
    },
    {
      id: 45,
      title: "Support 10,000 Concurrent Users",
      status: "pending",
      forecasted_date: "2025-07-01",
      agreement_id: 15,
      type: "milestone",
      agreement: { id: 15, title: "Digital Education Services Agreement", opportunity_id: 21, alliance_id: 8 },
    },
    {
      id: 46,
      title: "Monthly Service Fee",
      status: "pending",
      forecasted_date: "2025-05-31",
      agreement_id: 15,
      type: "payment",
      agreement: { id: 15, title: "Digital Education Services Agreement", opportunity_id: 21, alliance_id: 8 },
    },

    // Agreement 16: Industrial IoT Partnership Agreement
    {
      id: 47,
      title: "IoT Sensor Deployment Plan",
      status: "complete",
      forecasted_date: "2025-01-30",
      agreement_id: 16,
      type: "deliverable",
      agreement: { id: 16, title: "Industrial IoT Partnership Agreement", opportunity_id: 22, alliance_id: 9 },
    },
    {
      id: 48,
      title: "Connect 500 Manufacturing Devices",
      status: "pending",
      forecasted_date: "2025-09-15",
      agreement_id: 16,
      type: "milestone",
      agreement: { id: 16, title: "Industrial IoT Partnership Agreement", opportunity_id: 22, alliance_id: 9 },
    },
    {
      id: 49,
      title: "ISO 27001 Security Audit",
      status: "pending",
      forecasted_date: "2025-06-15",
      agreement_id: 16,
      type: "compliance",
      agreement: { id: 16, title: "Industrial IoT Partnership Agreement", opportunity_id: 22, alliance_id: 9 },
    },
    {
      id: 50,
      title: "Platform Licensing Payment",
      status: "pending",
      forecasted_date: "2025-07-31",
      agreement_id: 16,
      type: "payment",
      agreement: { id: 16, title: "Industrial IoT Partnership Agreement", opportunity_id: 22, alliance_id: 9 },
    },

    // Agreement 17: Retail Technology Agreement
    {
      id: 51,
      title: "E-commerce Platform Integration",
      status: "complete",
      forecasted_date: "2025-02-10",
      agreement_id: 17,
      type: "deliverable",
      agreement: { id: 17, title: "Retail Technology Agreement", opportunity_id: 24, alliance_id: 10 },
    },
    {
      id: 52,
      title: "Launch in 50 Retail Locations",
      status: "pending",
      forecasted_date: "2025-08-30",
      agreement_id: 17,
      type: "milestone",
      agreement: { id: 17, title: "Retail Technology Agreement", opportunity_id: 24, alliance_id: 10 },
    },
    {
      id: 53,
      title: "PCI DSS Compliance Review",
      status: "pending",
      forecasted_date: "2025-05-30",
      agreement_id: 17,
      type: "compliance",
      agreement: { id: 17, title: "Retail Technology Agreement", opportunity_id: 24, alliance_id: 10 },
    },

    // Agreement 18: Supply Chain Innovation Agreement
    {
      id: 54,
      title: "AI Inventory Model Development",
      status: "complete",
      forecasted_date: "2025-03-10",
      agreement_id: 18,
      type: "deliverable",
      agreement: { id: 18, title: "Supply Chain Innovation Agreement", opportunity_id: 25, alliance_id: 10 },
    },
    {
      id: 55,
      title: "Reduce Inventory Costs by 20%",
      status: "pending",
      forecasted_date: "2025-10-31",
      agreement_id: 18,
      type: "milestone",
      agreement: { id: 18, title: "Supply Chain Innovation Agreement", opportunity_id: 25, alliance_id: 10 },
    },
    {
      id: 56,
      title: "Implementation Services Payment",
      status: "pending",
      forecasted_date: "2025-06-30",
      agreement_id: 18,
      type: "payment",
      agreement: { id: 18, title: "Supply Chain Innovation Agreement", opportunity_id: 25, alliance_id: 10 },
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

// Helper function to enrich obligation with agreement relation
export function enrichObligation(obligationData: {
  title: string;
  status: ObligationStatus;
  forecasted_date: string;
  agreement_id: number;
  type: ObligationType;
}, id: number): Obligation {
  const agreement = db.data!.agreements.find((a) => a.id === obligationData.agreement_id);

  return {
    ...obligationData,
    id,
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