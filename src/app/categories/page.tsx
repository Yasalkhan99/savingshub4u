import { redirect } from "next/navigation";

/** Categories page now lives at /promotions/categories. Redirect old /categories URL. */
export default function CategoriesRedirect() {
  redirect("/promotions/categories");
}
