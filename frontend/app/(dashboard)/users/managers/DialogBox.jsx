"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";

import { FaPen, FaPlus } from "react-icons/fa6";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { managerRegister } from "@/utils/apiRequests/auth.api";
import { getAllManagers, getManagerById } from "@/utils/apiRequests/user.api";

const DialogBox = ({ user_id }) => {
  const [formData, setFormData] = useState({
    status: "true",
  });
  const [btnEnable, setBtnEnable] = useState(false);
  const queryClient = useQueryClient();

  const { status, mutate } = useMutation({
    mutationFn: managerRegister,
    onSuccess: (res) => {
      queryClient.invalidateQueries(["managers"]);
      toast(res.message);
    },
    onError: (err) => toast("Manger registered failed"),
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryFn: () => getManagerById(user_id),
    queryKey: ["managers", user_id],
    enabled: false,
  });

  {
    user_id && refetch();
  }

  useEffect(() => {
    if (data) setFormData(data);
  }, [data]);

  const onformDataChanged = (e) => {
    if (e.target) {
      setFormData((curformData) => ({
        ...curformData,
        [e.target?.name]: e.target?.value,
      }));
    } else if (typeof e == "boolean") {
      setFormData((curformData) => ({ ...curformData, status: e + "" }));
    } else {
      setFormData((curformData) => ({
        ...curformData,
        [e.split(":")[0]]: e.split(":")[1],
      }));
    }
  };

  const onFormSubmited = async () => {
    console.log(formData);
    mutate(formData);
    //after all the work are done
    setFormData({ status: "true" });
  };

  const onFormResetted = () => {
    setFormData({ status: "true" });
  };

  useEffect(() => {
    console.log(formData);
    if (
      formData.name &&
      formData.user_name &&
      formData.email &&
      formData.contact_no &&
      formData.address
    ) {
      setBtnEnable(true);
    } else {
      setBtnEnable(false);
    }
    // console.log(formData);
    // console.log(formData.position == "hod" && formData.faculty);
  }, [formData]);

  return (
    <Dialog>
      <DialogTrigger
        className="flex items-center bg-primary text-primary-foreground shadow hover:bg-primary/90 rounded-md px-3 py-2 mb-3 text-sm"
        onClick={user_id ? null : onFormResetted}
      >
        {user_id ? (
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
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle> Manager</DialogTitle>
          <DialogDescription>
            You can {user_id ? "update" : "create"} a manager here
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              className="col-span-3"
              onChange={(e) => onformDataChanged(e)}
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
              onChange={(e) => onformDataChanged(e)}
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
              onChange={(e) => onformDataChanged(e)}
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
              onChange={(e) => onformDataChanged(e)}
              value={formData?.contact_no || ""}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">
              Address
            </Label>
            <Input
              id="address"
              name="address"
              className="col-span-3"
              onChange={(e) => onformDataChanged(e)}
              value={formData?.address || ""}
            />
          </div>

          <div className="grid grid-cols-4 gap-4">
            <Label className="text-right">Status</Label>
            <div className="items-top flex space-x-2 col-span-3 items-center">
              <Checkbox
                id="status"
                onCheckedChange={(e) => onformDataChanged(e)}
                checked={formData?.status === "true"}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="status"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  status
                </label>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onFormResetted}>
            Reset
          </Button>
          <Button type="button" disabled={!btnEnable} onClick={onFormSubmited}>
            <DialogClose>Create</DialogClose>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogBox;
