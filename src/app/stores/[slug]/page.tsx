import { redirect } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

/** Store pages now live at /promotions/[slug]. Redirect old /stores/[slug] URLs. */
export default async function StoresSlugRedirect({ params }: Props) {
  const { slug } = await params;
  redirect(`/promotions/${slug}`);
}
