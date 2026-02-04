/**
 * Store/coupon helpers with no Node.js deps — safe to import from Client Components.
 */

/** True if this row has coupon/deal data (code or title). Store-only rows return false. */
export function hasCouponData(s: {
  couponCode?: string;
  couponTitle?: string;
}): boolean {
  const code = (s.couponCode ?? "").trim();
  const title = (s.couponTitle ?? "").trim();
  return code !== "" || title !== "";
}
