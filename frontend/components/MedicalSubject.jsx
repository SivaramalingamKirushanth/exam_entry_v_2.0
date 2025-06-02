"use client";
import { useState } from "react";
import { MdOutlineSwapHorizontalCircle } from "react-icons/md";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { moveToResit } from "@/utils/apiRequests/entry.api";
import { toast } from "sonner";

const MedicalSubject = ({ id, sub_code, sub_name, user_name }) => {
  const [remark, setRemark] = useState("Not eligible for medical");
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: moveToResit,
    onSuccess: (res) => {
      queryClient.invalidateQueries(["requests"]);
      toast.success(res.message);
      setOpen(false);
    },
    onError: (err) => {
      toast.error("Operation failed");
    },
  });

  const moveHandler = () => {
    mutate({ id, remark });
  };

  return (
    <span className="flex items-center gap-1 w-full">
      <Badge className="flex flex-col items-center w-full">
        <span className="text-sm">{sub_code}</span>
        <span className="text-center">{sub_name}</span>
      </Badge>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className="trigger flex justify-center">
          <MdOutlineSwapHorizontalCircle
            size={22}
            className="text-black cursor-pointer hover:text-blue-700 shrink-0"
            onClick={() => setOpen(true)}
          />
        </PopoverTrigger>
        <PopoverContent className="w-64 h-48 flex flex-col gap-2 items-start">
          <h1 className="font-semibold text-sm text-center w-full">
            <span>Enter Remark</span>
          </h1>
          <p className="font-semibold flex justify-between text-sm w-full">
            <span>{sub_code}</span>
            <span>{user_name}</span>
          </p>
          <Textarea
            onChange={(e) => setRemark(e.target.value)}
            onBlur={() => setRemark("Not eligible for medical")}
            value={remark}
          />
          <Button
            className="self-end"
            onMouseDown={() => {
              if (remark) moveHandler();
            }}
            disabled={!remark}
          >
            Move to Resit
          </Button>
        </PopoverContent>
      </Popover>
    </span>
  );
};

export default MedicalSubject;
