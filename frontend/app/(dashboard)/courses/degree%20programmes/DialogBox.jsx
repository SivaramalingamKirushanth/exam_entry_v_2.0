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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FaPlus } from "react-icons/fa6";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

const DialogBox = () => {
  const [data, setData] = useState({ active: true, levels: [] });
  const [btnEnable, setBtnEnable] = useState(false);
  const [open, setOpen] = useState(false);

  const managers = [
    {
      value: "next.js",
      label: "Next.js",
    },
    {
      value: "sveltekit",
      label: "SvelteKit",
    },
    {
      value: "nuxt.js",
      label: "Nuxt.js",
    },
    {
      value: "remix",
      label: "Remix",
    },
    {
      value: "astro",
      label: "Astro",
    },
  ];

  const onDataChanged = (e) => {
    if (typeof e == "string" && e.startsWith("level")) {
      setData((curData) => ({
        ...curData,
        levels: [...curData.levels, e.split(":")[1]],
      }));
    } else if (e?.target) {
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
    setData({ active: true, levels: [] });
  };

  const onFormResetted = () => {
    setData({ active: true, levels: [] });
  };

  useEffect(() => {
    if (
      data.name &&
      data.shortname &&
      data.department &&
      data.faculty &&
      data.levels.length
    ) {
      setBtnEnable(true);
    } else {
      setBtnEnable(false);
    }
  }, [data]);

  return (
    <Dialog>
      <DialogTrigger className="flex items-center bg-primary text-primary-foreground shadow hover:bg-primary/90 rounded-md px-3 py-2 mb-3 text-sm">
        <FaPlus />
        &nbsp;Create a degree programme
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle> Degree programme</DialogTitle>
          <DialogDescription>
            You can create a degree programme here
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
              onChange={(e) => onDataChanged(e)}
              value={data.name || ""}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="shortname" className="text-right">
              Short name
            </Label>
            <Input
              id="shortname"
              name="shortname"
              className="col-span-3 uppercase"
              onChange={(e) => {
                let ele = e;
                ele.target.value = ele.target.value.toUpperCase();
                onDataChanged(ele);
              }}
              value={data.shortname || ""}
            />
          </div>

          <div className={`grid grid-cols-4 items-center gap-4`}>
            <Label className="text-right">Faculty</Label>
            <Select
              onValueChange={(e) => {
                setData((cur) => ({ ...cur, department: "" }));
                onDataChanged(e);
              }}
              value={data.faculty ? "faculty:" + data.faculty : ""}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select faculty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="faculty:light">ABC</SelectItem>
                <SelectItem value="faculty:dark">Dark</SelectItem>
                <SelectItem value="faculty:system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className={`grid grid-cols-4 items-center gap-4`}>
            <Label className="text-right">Department</Label>
            <Select
              onValueChange={(e) => {
                onDataChanged(e);
              }}
              disabled={!data.faculty}
              value={data.department ? "department:" + data.department : ""}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="department:light">ABC</SelectItem>
                <SelectItem value="department:dark">Dark</SelectItem>
                <SelectItem value="department:system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <Label className="text-right">Levels</Label>
            <div className="items-top flex col-span-3 items-center gap-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div className="items-top flex space-x-2 items-center">
                  <Checkbox
                    id={`level${item}`}
                    onCheckedChange={(e) => {
                      e
                        ? onDataChanged(`level:${item}`)
                        : setData((curData) => ({
                            ...curData,
                            levels: curData.levels.filter((ele) => ele != item),
                          }));
                    }}
                    checked={data.levels.includes(item + "")}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor={`level${item}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {item}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
