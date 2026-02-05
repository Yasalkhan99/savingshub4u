import { redirect } from "next/navigation";

/** Brands page now lives at /promotions/brands. Redirect old /brands URL. */
export default function BrandsRedirect() {
  redirect("/promotions/brands");
}
