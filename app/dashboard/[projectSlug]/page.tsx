import { redirect } from "next/navigation";

// Redirect to overview page by default
export default function ProjectPage({ params }: { params: { projectSlug: string } }) {
  redirect(`/dashboard/${params.projectSlug}/overview`);
}