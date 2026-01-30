export type Store = {
  id: string;
  name: string;
  logoUrl: string;
  description: string;
  expiry: string;
  link?: string;
  createdAt?: string;
  // Extended store fields (Manage Stores form)
  subStoreName?: string;
  slug?: string;
  logoAltText?: string;
  logoMethod?: "url" | "upload";
  networkId?: string;
  merchantId?: string;
  trackingUrl?: string;
  countryCodes?: string;
  websiteUrl?: string;
  category?: string;
  whyTrustUs?: string;
  moreInfo?: string;
  seoTitle?: string;
  seoMetaDesc?: string;
  trending?: boolean;
  status?: "enable" | "disable";
  // Coupon-specific (Manage Coupons form)
  couponType?: "code" | "deal";
  couponCode?: string;
  couponTitle?: string;
  priority?: number;
  active?: boolean;
  imageAlt?: string;
};
