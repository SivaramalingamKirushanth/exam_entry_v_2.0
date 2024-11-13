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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select";
import { FaPlus } from "react-icons/fa6";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

const DialogBox = () => {
  const [data, setData] = useState({ position: "lecturer", active: true });
  const [btnEnable, setBtnEnable] = useState(false);

  const onDataChanged = (e) => {
    if (e.target) {
      setData((curData) => ({ ...curData, [e.target?.name]: e.target?.value }));
    } else if (typeof e == "boolean") {
      setData((curData) => ({ ...curData, active: e }));
    } else {
      setData((curData) => ({
        ...curData,
        [e.split(":")[0]]: e.split(":")[1],
      }));
    }
  };

  const onFormSubmited = () => {
    console.log(data);

    //after all the work are done
    setData({ active: true });
  };

  const onFormResetted = () => {
    setData({ active: true });
  };

  useEffect(() => {
    if (data.name && data.uname && data.email && data.contact && data.address) {
      setBtnEnable(true);
    } else {
      setBtnEnable(false);
    }
    // console.log(data);
    // console.log(data.position == "hod" && data.faculty);
  }, [data]);

  return (
    <Dialog>
      <DialogTrigger className="flex items-center bg-primary text-primary-foreground shadow hover:bg-primary/90 rounded-md px-3 py-2 mb-3 text-sm">
        <FaPlus />
        &nbsp;Create a manager
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle> Manager</DialogTitle>
          <DialogDescription>You can create a manager here</DialogDescription>
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
              onChange={(e) => onDataChanged(e)}
              value={data.name || ""}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="uname" className="text-right">
              User name
            </Label>
            <Input
              id="uname"
              name="uname"
              className="col-span-3"
              onChange={(e) => onDataChanged(e)}
              value={data.uname || ""}
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
              onChange={(e) => onDataChanged(e)}
              value={data.email || ""}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="contact" className="text-right">
              Contact No
            </Label>
            <Input
              id="contact"
              name="contact"
              className="col-span-3"
              onChange={(e) => onDataChanged(e)}
              value={data.contact || ""}
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
              onChange={(e) => onDataChanged(e)}
              value={data.address || ""}
            />
          </div>
          {/* <div className="grid grid-cols-4 gap-4">
            <Label className="text-right">Position</Label>
            <RadioGroup
              defaultValue="position:lecturer"
              onValueChange={(e) => onDataChanged(e)}
              className="flex col-span-3 gap-4 flex-wrap"
            >
              <div className="flex items-center space-x-1">
                <RadioGroupItem
                  value="position:lecturer"
                  id="r1"
                  checked={data.position == "lecturer"}
                />
                <Label htmlFor="r1">Lecturer</Label>
              </div>

              <div className="flex items-center space-x-1">
                <RadioGroupItem
                  value="position:hod"
                  id="r2"
                  checked={data.position == "hod"}
                />
                <Label htmlFor="r2">Hod</Label>
              </div>

              <div className="flex items-center space-x-1 pr-3">
                <RadioGroupItem
                  value="position:dean"
                  id="r3"
                  checked={data.position == "dean"}
                />
                <Label htmlFor="r3">Dean</Label>
              </div>
            </RadioGroup>
          </div> */}

          <div className="grid grid-cols-4 gap-4">
            <Label className="text-right">Status</Label>
            <div className="items-top flex space-x-2 col-span-3 items-center">
              <Checkbox
                id="status"
                onCheckedChange={(e) => onDataChanged(e)}
                checked={data.active}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="status"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Active
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
