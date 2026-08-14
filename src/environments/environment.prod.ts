import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true,
  apiUrl: 'https://mock-data-api-nextjs.vercel.app',
  stripePublishableKey: 'pk_live_51REPLACEME',
  vivaWalletMerchantId: 'REPLACE_WITH_VIVA_MERCHANT_ID'
};
