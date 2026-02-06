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
  /** Main heading on store page (e.g. "Valvoline Synthetic Oil Change Discount Code"). If set, used above coupons; else displayName + " Discount Code". */
  storePageHeading?: string;
  slug?: string;
  logoAltText?: string;
  logoMethod?: "url" | "upload";
  trackingUrl?: string;
  faqs?: { q: string; a: string }[];
  networkId?: string;
  merchantId?: string;
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
  /** Badge on coupon card: "free_shipping" | "free_delivery" | empty = use store region / percentage */
  badgeLabel?: "" | "free_shipping" | "free_delivery";
  priority?: number;
  active?: boolean;
  imageAlt?: string;
};
