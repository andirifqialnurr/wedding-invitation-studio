import OrderClient from "./OrderClient";

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OrderClient templateId={id} />;
}
