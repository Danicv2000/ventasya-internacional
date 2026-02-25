import { getExchangeRates } from '@/src/lib/exchange-rates';
import LandingPage from '@/src/core/components/landing-page';

async function ServerLandingPage() {
  // Fetch exchange rates on the server
  const exchangeRates = await getExchangeRates();
  
  return <LandingPage initialExchangeRates={exchangeRates} />;
}

export default ServerLandingPage;