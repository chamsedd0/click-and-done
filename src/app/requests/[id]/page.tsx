import { Metadata } from "next";
import RequestDetails from "./RequestDetails";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Request Details - ${params.id}`,
    description: "View website request details"
  };
}

export default function RequestPage({ params }: Props) {
  return <RequestDetails id={params.id} />;
} 