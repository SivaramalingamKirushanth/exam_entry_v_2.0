"use client";

import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { managerRegister } from "@/utils/apiRequests/auth.api";
import { getManagerById, updateManager } from "@/utils/apiRequests/user.api";
import { GiCancel } from "react-icons/gi";

const Model = ({ editId, isOpen, setIsOpen, modalRef, setEditId }) => {
  const [formData, setFormData] = useState({});
  const [btnEnable, setBtnEnable] = useState(false);
  const queryClient = useQueryClient();

  const { status, mutate } = useMutation({
    mutationFn: editId ? updateManager : managerRegister,
    onSuccess: (res) => {
      queryClient.invalidateQueries(["managers"]);
      setEditId("");
      toast.success(res.message);
    },
    onError: (err) => {
      setEditId("");
      toast.error("Operation failed");
    },
  });

  const { data, refetch } = useQuery({
    queryFn: () => getManagerById(editId),
    queryKey: ["managers", editId],
    enabled: false,
  });

  useEffect(() => {
    if (data) setFormData(data);
  }, [data]);

  const onFormDataChanged = (e) => {
    const { name, value } = e.target || {};
    if (e.target) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const onFormSubmitted = () => {
    mutate(formData);
    setFormData({});
    setIsOpen(false);
  };

  const onFormReset = () => {
    setFormData(data || {});
  };

  useEffect(() => {
    const isFormValid =
      formData.name &&
      formData.user_name &&
      formData.email &&
      formData.contact_no;
    setBtnEnable(isFormValid);
  }, [formData]);

  useEffect(() => {
    editId && refetch();
  }, [editId]);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            ref={modalRef}
            className="bg-white rounded-lg shadow-lg w-[425px] p-6"
          >
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h3 className="text-lg font-semibold">Manager</h3>

              <GiCancel
                className="text-2xl hover:cursor-pointer hover:text-zinc-700"
                onClick={() => {
                  setIsOpen(false);
                  setFormData({});
                  setEditId("");
                }}
              />
            </div>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  className="col-span-3"
                  onChange={(e) => onFormDataChanged(e)}
                  onBlur={(e) => {
                    e.target.value = e.target.value.trim();
                    onFormDataChanged(e);
                  }}
                  value={formData?.name || ""}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="user_name" className="text-right">
                  User name
                </Label>
                <Input
                  id="user_name"
                  name="user_name"
                  className="col-span-3"
                  onChange={(e) => onFormDataChanged(e)}
                  onBlur={(e) => {
                    e.target.value = e.target.value.trim();
                    onFormDataChanged(e);
                  }}
                  value={formData?.user_name || ""}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  className="col-span-3"
                  onChange={(e) => onFormDataChanged(e)}
                  onBlur={(e) => {
                    e.target.value = e.target.value.trim();
                    onFormDataChanged(e);
                  }}
                  value={formData?.email || ""}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contact_no" className="text-right">
                  Contact No
                </Label>
                <Input
                  id="contact_no"
                  name="contact_no"
                  className="col-span-3"
                  onChange={(e) => onFormDataChanged(e)}
                  onBlur={(e) => {
                    e.target.value = e.target.value.trim();
                    onFormDataChanged(e);
                  }}
                  value={formData?.contact_no || ""}
                />
              </div>
            </div>

            <div className="flex justify-between space-x-2 mt-4">
              <Button
                type="button"
                variant="warning"
                onClick={() => onFormReset()}
              >
                Reset
              </Button>
              <Button
                type="button"
                disabled={!btnEnable}
                onClick={onFormSubmitted}
              >
                {editId ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Model;
