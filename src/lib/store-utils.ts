/**
 * Store/coupon helpers with no Node.js deps — safe to import from Client Components.
 */

const EMPTY_PLACEHOLDERS = ["", "n/a", "na", "—", "-", "none"];

function isMeaningfulCouponValue(v: string): boolean {
  const t = v.trim().toLowerCase();
  return t !== "" && !EMPTY_PLACEHOLDERS.includes(t);
}

/** True if this row has coupon/deal data (code or title). Store-only rows return false. */
export function hasCouponData(s: {
  couponCode?: string;
  couponTitle?: string;
}): boolean {
  const code = (s.couponCode ?? "").trim();
  const title = (s.couponTitle ?? "").trim();
  return isMeaningfulCouponValue(code) || isMeaningfulCouponValue(title);
}
