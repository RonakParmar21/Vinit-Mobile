import { google } from '@ai-sdk/google';
import { streamText, tool } from 'ai';
import { z } from 'zod';

export const maxDuration = 30;

interface InventoryItem {
  storeId: string;
  storeName: string;
  model: string;
  stock: number;
  price: number;
}

interface ReconciliationItem {
  storeName: string;
  erpSales: number;
  paytmPosSettled: number;
  discrepancy: number;
  issue?: string;
}

const MOCK_INVENTORY: InventoryItem[] = [
  { storeId: "S01", storeName: "Ring Road", model: "iPhone 16 Pro 128GB", stock: 2, price: 119900 },
  { storeId: "S02", storeName: "Adajan", model: "iPhone 16 Pro 128GB", stock: 0, price: 119900 },
  { storeId: "S03", storeName: "Varachha", model: "iPhone 16 Pro 128GB", stock: 5, price: 119900 },
  { storeId: "S01", storeName: "Ring Road", model: "Samsung S24 Ultra", stock: 3, price: 129999 },
  { storeId: "S04", storeName: "Ghod Dod Road", model: "Samsung S24 Ultra", stock: 1, price: 129999 },
];

const MOCK_RECONCILIATION: ReconciliationItem[] = [
  { storeName: "Adajan", erpSales: 185000, paytmPosSettled: 185000, discrepancy: 0 },
  { storeName: "Ring Road", erpSales: 340000, paytmPosSettled: 315000, discrepancy: 25000, issue: "POS batch not closed" },
  { storeName: "Varachha", erpSales: 210000, paytmPosSettled: 210000, discrepancy: 0 },
];

export async function POST(req: Request) {
  const { messages, userRole } = await req.json();

  const result = streamText({
    model: google('gemini-1.5-flash'),
    system: `You are the Vinit Mobile Ltd AI Operations Agent for Surat branches[cite: 1].
Current User Role: ${userRole || 'Store Staff'}

Rules:
1. "Store Staff" can ONLY query inventory stock[cite: 1]. If they ask for sales or financial settlement data, politely decline and state only Cluster Managers or Finance have clearance[cite: 1].
2. "Cluster Manager" has access to both stock tools and finance reconciliation tools[cite: 1].
3. Be concise and format tabular outputs cleanly using Markdown bullet points.`,
    messages,
    tools: {
      checkStoreStock: tool({
        description: 'Query live stock levels of mobile models across Surat branches',
        inputSchema: z.object({
          modelName: z.string().describe('Smartphone model name, e.g. iPhone 16 or Samsung S24'),
        }),
        execute: async ({ modelName }) => {
          const matches = MOCK_INVENTORY.filter((item) =>
            item.model.toLowerCase().includes(modelName.toLowerCase())
          );
          if (matches.length === 0) {
            return `No stock found for model: ${modelName}`;
          }
          return JSON.stringify(matches);
        },
      }),

      checkDailySettlement: tool({
        description: 'Check daily APX ERP vs Paytm POS settlement discrepancies (Cluster Manager only)',
        inputSchema: z.object({
          requestedDate: z.string().optional().describe('Date to check, default today'),
        }),
        execute: async () => {
          if (userRole !== 'Cluster Manager') {
            return 'Access Denied: Cluster Manager clearance required.';
          }
          return JSON.stringify(MOCK_RECONCILIATION);
        },
      }),
    },
  });

  return result.toTextStreamResponse();
}