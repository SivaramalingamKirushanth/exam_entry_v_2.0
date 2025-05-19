"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAllPayments, upsertPayments } from "@/utils/apiRequests/entry.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const grades = ["C-", "D+", "D", "F", "N/A"];

const PaymentSettings = () => {
  const [formData, setFormData] = useState({});
  const [btnEnabled, setBtnEnabled] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryFn: getAllPayments,
    queryKey: ["payments"],
  });

  const { status, mutate } = useMutation({
    mutationFn: upsertPayments,
    onSuccess: (res) => {
      queryClient.invalidateQueries(["payments"]);
      toast.success(res.message);
    },
    onError: (err) => {
      toast.error("Operation failed");
    },
  });

  const onFormDataChanged = (e) => {
    if (e.target) {
      setFormData((curData) => ({
        ...curData,
        [e.target?.name]: e.target?.value,
      }));
    }
  };

  const onFormSubmit = () => {
    mutate(formData);
  };

  useEffect(() => {
    if (data) {
      setFormData({ ...data });
    }
  }, [data]);

  useEffect(() => {
    const enabled =
      formData.medical &&
      formData["C-"] &&
      formData["D+"] &&
      formData["D"] &&
      formData["F"] &&
      formData["N/A"];

    setBtnEnabled(enabled);
  }, [formData]);

  return (
    <div className="flex justify-end md:justify-center">
      <div className="w-[90%] sm:w-[70%] md:w-[60%]">
        <div className="grid gap-4 py-4">
          <div className="flex gap-x-3 items-center">
            <Label
              htmlFor="medical"
              className="text-right w-28 inline-block shrink-0 font-bold"
            >
              Medical
            </Label>
            <input
              type="number"
              min="0"
              placeholder="Enter amount"
              className="flex h-9 w-44 col-span-3 rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-white file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 shrink-0"
              name="medical"
              id="medical"
              onChange={(e) => onFormDataChanged(e)}
              value={formData.medical || ""}
            />
          </div>
          <div>
            <Label
              htmlFor="medical"
              className="text-right w-28 inline-block shrink-0 font-bold"
            >
              Resit
            </Label>

            {grades.map((grade) => (
              <div className="flex gap-x-3 items-center my-1" key={grade}>
                <Label
                  htmlFor={grade}
                  className="text-right w-28 inline-block shrink-0 "
                >
                  {grade}
                </Label>
                <input
                  type="number"
                  min="0"
                  placeholder="Enter amount"
                  className="flex h-9 w-44 col-span-3 rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-white file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 shrink-0"
                  name={grade}
                  id={grade}
                  onChange={(e) => onFormDataChanged(e)}
                  value={formData[grade] || ""}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Button type="button" onClick={onFormSubmit} disabled={!btnEnabled}>
            Update
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSettings;
