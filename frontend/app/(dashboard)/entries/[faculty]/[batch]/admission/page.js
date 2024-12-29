"use client";
import AdmissionCardTemplate from "@/components/AdmissionCardTemplate";
import { useSearchParams } from "next/navigation";

const Admission = () => {
  const searchParams = useSearchParams();

  const batch_id = searchParams.get("batch_id");

  return <AdmissionCardTemplate batch_id={batch_id} />;
};

export default Admission;
