/**
 * Health check endpoint for Vercel and API monitors.
 * URL: /api/health
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, AccountKey');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const hasLtaKey = Boolean(process.env.LTA_ACCOUNT_KEY && process.env.LTA_ACCOUNT_KEY.trim() !== '');

  const healthData = {
    status: 'healthy',
    service: 'Lion City Transit System - LTA DataMall Gateway',
    timestamp: new Date().toISOString(),
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'production',
    uptimeSeconds: Math.floor(process.uptime ? process.uptime() : 0),
    ltaAccountKeyConfigured: hasLtaKey,
    endpoints: {
      busArrival: '/api/BusArrival?BusStopCode=83139',
      busArrivalByService: '/api/BusArrival?BusStopCode=83139&ServiceNo=15',
      health: '/api/health'
    },
    upstreamService: {
      name: 'LTA DataMall Dynamic Datasets (v3 BusArrival)',
      url: 'https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival',
      refreshCadence: '20 seconds'
    }
  };

  return res.status(200).json(healthData);
}
