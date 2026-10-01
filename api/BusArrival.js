/**
 * LTA DataMall v3 BusArrival Gateway Endpoint
 * URL: /api/BusArrival?BusStopCode=83139&ServiceNo=15
 * 
 * Proxies requests to:
 * https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival
 * with AccountKey header from process.env.LTA_ACCOUNT_KEY.
 */

export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, AccountKey');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Parse query parameters (supporting case variants)
  const query = req.query || {};
  const busStopCode = query.BusStopCode || query.busStopCode || query.stopCode || query.bus_stop_code;
  const serviceNo = query.ServiceNo || query.serviceNo || query.service || query.bus;

  if (!busStopCode) {
    return res.status(400).json({
      error: 'Missing required parameter: BusStopCode',
      example: '/api/BusArrival?BusStopCode=08031&ServiceNo=65'
    });
  }

  const apiKey = process.env.LTA_ACCOUNT_KEY ? process.env.LTA_ACCOUNT_KEY.trim() : '';

  if (!apiKey) {
    return res.status(503).json({
      error: 'LTA_ACCOUNT_KEY is not configured in environment variables.',
      message: 'Please configure LTA_ACCOUNT_KEY in Vercel Project Settings > Environment Variables.',
      busStopCode: String(busStopCode),
      serviceNo: serviceNo ? String(serviceNo) : null,
      docs: 'https://datamall.lta.gov.sg/content/datamall/en/request-api.html'
    });
  }

  try {
    let ltaUrl = `https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=${encodeURIComponent(busStopCode)}`;
    if (serviceNo) {
      ltaUrl += `&ServiceNo=${encodeURIComponent(serviceNo)}`;
    }

    const ltaResponse = await fetch(ltaUrl, {
      method: 'GET',
      headers: {
        'AccountKey': apiKey,
        'accept': 'application/json'
      }
    });

    if (!ltaResponse.ok) {
      const errorText = await ltaResponse.text();
      return res.status(ltaResponse.status).json({
        error: `LTA DataMall responded with HTTP ${ltaResponse.status}`,
        details: errorText,
        upstreamUrl: ltaUrl
      });
    }

    const data = await ltaResponse.json();

    // Cache-Control: LTA updates data every 20 seconds
    res.setHeader('Cache-Control', 'public, s-maxage=15, stale-while-revalidate=25');

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to contact LTA DataMall service',
      message: error.message || 'Unknown network error'
    });
  }
}
