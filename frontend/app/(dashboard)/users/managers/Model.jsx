"use client";

import { toast } from "sonner";
import { FaPen, FaPlus } from "react-icons/fa6";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { managerRegister } from "@/utils/apiRequests/auth.api";
import { getManagerById } from "@/utils/apiRequests/user.api";

const DialogBox = ({ userId, isOpen, setIsOpen, modalRef }) => {
  const [formData, setFormData] = useState({ status: "true" });
  const [btnEnable, setBtnEnable] = useState(false);
  const queryClient = useQueryClient();

  const { status, mutate } = useMutation({
    mutationFn: managerRegister,
    onSuccess: (res) => {
      queryClient.invalidateQueries(["managers"]);
      toast(res.message);
    },
    onError: (err) => toast("Manager registration failed"),
  });

  const { data, refetch } = useQuery({
    queryFn: () => getManagerById(userId),
    queryKey: ["managers", userId],
    enabled: false,
  });

  useEffect(() => {
    if (data) setFormData(data);
  }, [data]);

  const onFormDataChanged = (e) => {
    const { name, value } = e.target || {};
    if (e.target) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else if (typeof e === "boolean") {
      setFormData((prev) => ({ ...prev, status: e.toString() }));
    }
  };

  const onFormSubmitted = () => {
    mutate(formData);
    setFormData({ status: "true" });
    setIsOpen(false);
  };

  const onFormReset = () => {
    setFormData({ status: "true" });
  };

  useEffect(() => {
    const isFormValid =
      formData.name &&
      formData.user_name &&
      formData.email &&
      formData.contact_no &&
      formData.address;
    setBtnEnable(isFormValid);
  }, [formData]);

  const toggleModal = () => {
    if (userId) refetch();
    setIsOpen((prev) => !prev);
  };

  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setIsOpen(false);
      onFormReset();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  return (
    <>
      <Button
        onClick={toggleModal}
        className="flex items-center bg-primary text-primary-foreground shadow hover:bg-primary/90 rounded-md px-3 py-2 mb-3 text-sm"
      >
        {userId ? (
          <>
            <FaPen />
            Edit
          </>
        ) : (
          <>
            <FaPlus />
            &nbsp;Create a manager
          </>
        )}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            ref={modalRef}
            className="bg-white rounded-lg shadow-lg w-[425px] p-6"
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h3 className="text-lg font-semibold">Manager</h3>
              <Button
                variant="ghost"
                onClick={() => {
                  setIsOpen(false);
                  onFormReset();
                }}
              >
                ✕
              </Button>
            </div>

            {/* Form */}
            <div className="grid gap-4">
              {[
                { id: "name", label: "Name" },
                { id: "user_name", label: "User Name" },
                { id: "email", label: "Email" },
                { id: "contact_no", label: "Contact No" },
                { id: "address", label: "Address" },
              ].map((field) => (
                <div
                  key={field.id}
                  className="grid grid-cols-4 items-center gap-4"
                >
                  <Label htmlFor={field.id} className="text-right">
                    {field.label}
                  </Label>
                  <Input
                    id={field.id}
                    name={field.id}
                    className="col-span-3"
                    onChange={onFormDataChanged}
                    value={formData[field.id] || ""}
                  />
                </div>
              ))}

              <div className="grid grid-cols-4 gap-4 items-center">
                <Label className="text-right">Status</Label>
                <div className="flex items-center col-span-3">
                  <Checkbox
                    id="status"
                    checked={formData.status === "true"}
                    onCheckedChange={(e) => onFormDataChanged(e)}
                  />
                  <Label htmlFor="status" className="ml-2">
                    Active
                  </Label>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end space-x-2 mt-4">
              <Button type="button" variant="outline" onClick={onFormReset}>
                Reset
              </Button>
              <Button
                type="button"
                disabled={!btnEnable}
                onClick={onFormSubmitted}
              >
                {userId ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DialogBox;
