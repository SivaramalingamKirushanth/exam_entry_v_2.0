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
  const [data, setData] = useState({ active: true });
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
    if (data.name && data.email && data.contact && data.hod && data.faculty) {
      setBtnEnable(true);
    } else {
      setBtnEnable(false);
    }
  }, [data]);

  return (
    <Dialog>
      <DialogTrigger className="flex items-center bg-primary text-primary-foreground shadow hover:bg-primary/90 rounded-md px-3 py-2 mb-3 text-sm">
        <FaPlus />
        &nbsp;Create a department
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle> Department</DialogTitle>
          <DialogDescription>
            You can create a department here
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

          <div className={`grid grid-cols-4 items-center gap-4`}>
            <Label className="text-right">HOD</Label>
            <div className="grid col-span-3">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <button
                    role="combobox"
                    aria-expanded={open}
                    className="col-span-3 flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-white px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 cursor-pointer"
                  >
                    {data.hod
                      ? managers.find((manager) => manager.value === data.hod)
                          ?.label
                      : "Select manager"}
                    <ChevronsUpDown className="opacity-50 size-[17px] " />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="py-0 px-1 border-none shadow-none">
                  <Command className="border shadow-md">
                    <CommandInput placeholder="Search manager" />
                    <CommandList>
                      <CommandEmpty>No manager found.</CommandEmpty>
                      <CommandGroup>
                        {managers.map((manager) => (
                          <CommandItem
                            key={manager.value}
                            value={manager.value}
                            onSelect={(currentValue) => {
                              setData((cur) => ({
                                ...cur,
                                hod:
                                  currentValue === data.hod ? "" : currentValue,
                              }));
                              setOpen(false);
                            }}
                          >
                            {manager.label}
                            <Check
                              className={cn(
                                "ml-auto",
                                data.hod === manager.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className={`grid grid-cols-4 items-center gap-4`}>
            <Label className="text-right">Faculty</Label>
            <Select
              onValueChange={(e) => {
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
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
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
