import { useState, useRef } from "react";
import { Switch } from "./ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const MedResEligibilityCell = ({
  row,
  onEligibilityChanged,
  end_date,
  lec,
}) => {
  const [remark, setRemark] = useState("");

  return (
    <h1 className="capitalize shrink-0 text-center text-sm sm:text-base">
      <Select
        onValueChange={(e) => {
          if (lec) {
            onEligibilityChanged(row.original.s_id, e, remark);
          } else {
            if (remark) {
              onEligibilityChanged(row.original.s_id, e, remark);
            }
          }
        }}
        value={row.original.eligibility}
        disabled={new Date() > new Date(end_date)}
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Pending" />
        </SelectTrigger>
        <SelectContent className="p-2 w-64">
          <p className="font-semibold flex flex-col gap-y-1 text-sm w-full">
            {lec ? (
              <span>Enter Remark (optional)</span>
            ) : (
              <span>Enter Remark</span>
            )}
            <span>{row.original.user_name}</span>
          </p>
          <Textarea
            onChange={(e) => setRemark(e.target.value)}
            value={remark}
            className="my-2"
          />
          <SelectItem disabled={!lec && !remark} value="true">
            Eligible
          </SelectItem>
          <SelectItem disabled={!lec && !remark} value="false">
            Not Eligible
          </SelectItem>
        </SelectContent>
      </Select>
    </h1>
  );
};

export default MedResEligibilityCell;
