import Home from "../../page";

export default async function TemplatePreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <Home initialThemeId={id} previewOnly />;
}
