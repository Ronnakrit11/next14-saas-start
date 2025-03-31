import { redirect } from "next/navigation";

// Redirect to overview page by default
export default function ProjectPage({ params }: { params: { slug: string } }) {
  redirect(`/project/${params.slug}/overview`);
}