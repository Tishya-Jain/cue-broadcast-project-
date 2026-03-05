import express from 'express';
import { createServer as createViteServer } from 'vite';
import cors from 'cors';
import dotenv from 'dotenv';
import { Campaign, CampaignFormData, Member, SalesforceReport } from './types';
import { MOCK_CAMPAIGNS, MOCK_SF_REPORTS } from './modules/broadcast/data/broadcastConstants';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// In-memory store for demo purposes
let campaigns: Campaign[] = [...MOCK_CAMPAIGNS];

// API Routes
app.get('/api/campaigns', (req, res) => {
  res.json(campaigns);
});

app.post('/api/campaigns', async (req, res) => {
  const formData: CampaignFormData = req.body;
  
  // Simulate Messaging Gateway Trigger
  console.log(`[Messaging Gateway] Triggering broadcast for ${formData.name} via ${formData.channels.join(', ')}`);
  
  const newCampaign: Campaign = {
    id: Math.random().toString(36).substring(7),
    name: formData.name,
    description: formData.description,
    listType: formData.sourceType === 'excel' ? 'static' : 'dynamic',
    membersCount: formData.sourceType === 'report' ? 450 : (formData.sourceType === 'excel' ? 120 : 0),
    wabaCount: formData.channels.length,
    status: formData.scheduleType === 'once' ? 'sent' : 'scheduled',
    lastModified: 'Just now',
    previewTitle: formData.name,
    previewBody: formData.description,
    stats: formData.scheduleType === 'once' ? {
      sent: 0,
      delivered: 0,
      read: 0,
      replied: 0,
      failed: 0
    } : undefined
  };

  if (formData.sourceType === 'excel') {
    console.log(`[Excel Parser] Ingesting file: ${formData.uploadedFileName}`);
    console.log(`[Excel Parser] Mapping columns to Member interface...`);
  }

  campaigns.unshift(newCampaign);

  // Simulate real-time stats update if sent
  if (newCampaign.status === 'sent') {
    setTimeout(() => {
      const campaign = campaigns.find(c => c.id === newCampaign.id);
      if (campaign && campaign.stats) {
        campaign.stats.sent = campaign.membersCount;
        campaign.stats.delivered = Math.floor(campaign.membersCount * 0.95);
        campaign.stats.read = Math.floor(campaign.membersCount * 0.8);
      }
    }, 5000);
  }

  res.status(201).json(newCampaign);
});

app.get('/api/salesforce/reports', (req, res) => {
  res.json(MOCK_SF_REPORTS);
});

app.get('/api/salesforce/report/:id', (req, res) => {
  const report = MOCK_SF_REPORTS.find(r => r.id === req.params.id);
  if (report) {
    res.json({
      recordCount: report.recordCount,
      members: Array.from({ length: 5 }).map((_, i) => ({
        id: `m${i}`,
        name: `Member ${i + 1}`,
        phone: `+91 90000 0000${i}`,
        status: 'sent',
        avatarColor: 'bg-blue-200 text-blue-700'
      }))
    });
  } else {
    res.status(404).json({ error: 'Report not found' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
