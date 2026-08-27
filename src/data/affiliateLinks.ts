export interface AffiliatePartner {
  id: string;
  name: string;
  category: string;
  discountBadge: string;
  description: string;
  descriptionTe: string;
  url: string;
  logo: string;
  region: 'global' | 'germany' | 'france' | 'india' | 'usa';
  offerId?: string;
  affId?: string;
  urlId?: string;
  features: string[];
  featuresTe: string[];
}

export const AFFILIATE_LINKS = {
  // 1. Hostinger Germany Links
  hostingerGermanyMain: 'https://www.hostg.xyz/aff_c?offer_id=58&aff_id=10257&url_id=686', // Text 13695204
  hostingerGermanyExtensions: 'https://www.hostg.xyz/aff_c?offer_id=319&aff_id=10257&url_id=1930', // Text 14344621
  
  // 2. Hostinger France Links
  hostingerFranceMain: 'https://www.hostg.xyz/aff_c?offer_id=58&aff_id=10257&url_id=548', // Text 13690177
  hostingerFranceBanner728x90: 'https://www.hostg.xyz/aff_c?offer_id=58&aff_id=10257&url_id=548', // Banner 13631420

  // 3. GoDaddy Official Affiliate Link (Website Builder)
  godaddyOfficial: 'https://click.godaddy.com/affiliate?isc=cjcfos1&url=https://www.godaddy.com/websites/website-builder',
  godaddyWebsiteBuilder: 'https://click.godaddy.com/affiliate?isc=cjcfos1&url=https://www.godaddy.com/websites/website-builder',
};

export const HOSTING_AFFILIATE_OPTIONS = [
  {
    id: 'godaddy-website-builder',
    name: 'GoDaddy Website Builder (AI & Domains)',
    nameTe: 'GoDaddy వెబ్‌సైట్ బిల్డర్ (AI & డొమైన్స్)',
    tag: 'Official Partner (isc=cjcfos1)',
    tagTe: 'అఫీషియల్ పార్ట్‌నర్',
    url: AFFILIATE_LINKS.godaddyWebsiteBuilder,
    price: 'Free Trial / ₹0',
    discount: 'Free Website Builder + SSL & Templates',
    discountTe: 'ఉచిత వెబ్‌సైట్ బిల్డర్ + SSL & టెంప్లేట్స్',
  },
  {
    id: 'hostinger-de-main',
    name: 'Hostinger (Germany / Global 75% OFF)',
    nameTe: 'Hostinger జర్మనీ / గ్లోబల్ (75% డిస్కౌంట్)',
    tag: 'Best Performance (Text 13695204)',
    tagTe: 'బెస్ట్ పెర్ఫార్మెన్స్',
    url: AFFILIATE_LINKS.hostingerGermanyMain,
    price: '€2.99 / $2.99 / ₹149/mo',
    discount: '75% OFF + Free SSL & Domain',
    discountTe: '75% తగ్గింపు + ఉచిత డొమైన్ & SSL',
  },
  {
    id: 'hostinger-de-ext',
    name: 'Hostinger Germany Extensions',
    nameTe: 'Hostinger జర్మనీ ఎక్స్‌టెన్షన్స్',
    tag: 'Web & Domains (Text 14344621)',
    tagTe: 'డొమైన్స్ & హోస్టింగ్',
    url: AFFILIATE_LINKS.hostingerGermanyExtensions,
    price: '€1.99 / mo',
    discount: 'Save Up to 80% on .DE / .COM',
    discountTe: '80% వరకు భారీ తగ్గింపు',
  },
  {
    id: 'hostinger-fr-main',
    name: 'Hostinger France (Hébergement Web)',
    nameTe: 'Hostinger ఫ్రాన్స్ (ఫాస్ట్ యూరోప్ హోస్టింగ్)',
    tag: 'Europe LiteSpeed (Text 13690177)',
    tagTe: 'యూరోప్ లైట్‌స్పీడ్ సర్వర్లు',
    url: AFFILIATE_LINKS.hostingerFranceMain,
    price: '€2.89 / mo',
    discount: '75% Réduction + Domaine Gratuit',
    discountTe: '75% డిస్కౌంట్ + ఫ్రీ డొమైన్',
  },
];
