import { useState, useRef, useEffect } from "react";
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

const MedResEligibilityHeader = ({
  filteredData,
  onMultipleEligibilityChanged,
  setIsAnyonePending,
  end_date,
}) => {
  const [remark, setRemark] = useState("");

  const isAnyonePending = filteredData.some((stu) => stu.eligibility == "");
  const isEveryonePending = filteredData.every((stu) => stu.eligibility == "");

  const isAnyoneNotEligible = filteredData.some(
    (stu) => stu.eligibility == "false"
  );
  useEffect(() => {
    setIsAnyonePending(isAnyonePending);
  }, [isAnyonePending, setIsAnyonePending]);

  return (
    <h1 className="flex justify-center gap-x-5 items-center">
      <span>Eligibility</span>

      <Select
        onValueChange={(e) => {
          if (isEveryonePending) {
            onMultipleEligibilityChanged(e, remark);
          } else {
            if (remark) {
              onMultipleEligibilityChanged(e, remark);
            }
          }
        }}
        value={isAnyonePending ? "" : !isAnyoneNotEligible + ""}
        disabled={new Date() > new Date(end_date) || !filteredData.length}
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Pending" />
        </SelectTrigger>
        <SelectContent className="p-2 w-64">
          <p className="font-semibold flex flex-col gap-y-1 text-sm w-full">
            <span>Enter Remark {isEveryonePending ? "(optional)" : ""}</span>
            <span>All/Filtered Students</span>
          </p>
          <Textarea
            onChange={(e) => setRemark(e.target.value)}
            value={remark}
            className="my-2"
          />
          <SelectItem
            disabled={!isEveryonePending && !remark}
            className={`${
              !isAnyoneNotEligible && !isAnyonePending ? "hidden" : ""
            }`}
            value="true"
          >
            Eligible
          </SelectItem>
          <SelectItem
            disabled={!isEveryonePending && !remark}
            className={`${
              isAnyoneNotEligible && !isAnyonePending ? "hidden" : ""
            }`}
            value="false"
          >
            Not Eligible
          </SelectItem>
        </SelectContent>
      </Select>
    </h1>
  );
};

export default MedResEligibilityHeader;
