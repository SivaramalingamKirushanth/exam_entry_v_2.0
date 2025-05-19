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

const MedResEligibilityHeader = ({
  filteredData,
  onMultipleEligibilityChanged,
  setIsAnyonePending,
  end_date,
}) => {
  const [remark, setRemark] = useState("Details verified");

  const isAnyonePending = filteredData.some((stu) => stu.eligibility == "");
  setIsAnyonePending(isAnyonePending);
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
          if (remark) {
            onMultipleEligibilityChanged(e, remark);
          }
        }}
        value={isAnyonePending ? "" : !isAnyoneNotEligible + ""}
        disabled={new Date() > new Date(end_date)}
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Pending" />
        </SelectTrigger>
        <SelectContent className="p-2 w-64">
          <p className="font-semibold flex justify-between text-sm w-full">
            <span>Enter Remark</span>
            <span>All/Filtered Students</span>
          </p>
          <Textarea
            onChange={(e) => setRemark(e.target.value)}
            value={remark}
            className="my-2"
          />
          <SelectItem disabled={!remark} value="true">
            Eligible
          </SelectItem>
          <SelectItem disabled={!remark} value="false">
            Not Eligible
          </SelectItem>
        </SelectContent>
      </Select>
    </h1>
  );
};

export default MedResEligibilityHeader;
