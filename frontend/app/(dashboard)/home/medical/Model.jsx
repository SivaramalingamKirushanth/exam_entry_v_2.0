"use client";

import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GiCancel } from "react-icons/gi";
import { updateRequestReference } from "@/utils/apiRequests/entry.api";

const Model = ({ paymentId, isOpen, setIsOpen, modelRef, setPaymentId }) => {
  const [formData, setFormData] = useState({});
  const [btnEnable, setBtnEnable] = useState(false);
  const [refMatch, setRefMatch] = useState(true);
  const queryClient = useQueryClient();

  const { status, mutate } = useMutation({
    mutationFn: updateRequestReference,
    onSuccess: (res) => {
      queryClient.invalidateQueries(["batchesOfStudent", "medical"]);
      setPaymentId("");
      toast.success(res.message);
    },
    onError: (err) => {
      setPaymentId("");
      toast.error("Operation failed");
    },
  });

  const onFormDataChanged = (e) => {
    const { name, value } = e.target || {};
    if (e.target) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const onFormSubmitted = () => {
    mutate({ ...formData, type: "medical", batch_id: paymentId });
    setFormData({});
    setIsOpen(false);
  };

  useEffect(() => {
    if (
      formData.reference &&
      formData.creference &&
      formData.reference != formData.creference
    ) {
      setRefMatch(false);
    } else {
      setRefMatch(true);
    }
    const isFormValid = formData.reference && formData.creference;
    setBtnEnable(isFormValid);
  }, [formData]);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            ref={modelRef}
            className="bg-white rounded-lg shadow-lg w-[425px] p-6"
          >
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h3 className="text-lg font-semibold">Receipt no</h3>

              <GiCancel
                className="text-2xl hover:cursor-pointer hover:text-zinc-700"
                onClick={() => {
                  setIsOpen(false);
                  setFormData({});
                  setPaymentId("");
                }}
              />
            </div>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reference" className="text-right">
                  Receipt no
                </Label>
                <Input
                  id="reference"
                  name="reference"
                  className="col-span-3"
                  onChange={(e) => onFormDataChanged(e)}
                  onBlur={(e) => {
                    e.target.value = e.target.value.trim();
                    onFormDataChanged(e);
                  }}
                  onCopy={(e) => e.preventDefault()}
                  onCut={(e) => e.preventDefault()}
                  value={formData?.reference || ""}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="creference" className="text-right">
                  Confirm receipt no
                </Label>
                <Input
                  id="creference"
                  name="creference"
                  className="col-span-3"
                  onChange={(e) => onFormDataChanged(e)}
                  onBlur={(e) => {
                    e.target.value = e.target.value.trim();
                    onFormDataChanged(e);
                  }}
                  onCopy={(e) => e.preventDefault()}
                  onCut={(e) => e.preventDefault()}
                  value={formData?.creference || ""}
                />
              </div>
            </div>
            <p className="text-red-500 italic text-xs text-end h-3">
              {!refMatch ? "receipt no do not match" : ""}
            </p>
            <div className="flex justify-end space-x-2 mt-4">
              <Button
                type="button"
                disabled={!refMatch || !btnEnable}
                onClick={onFormSubmitted}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Model;
