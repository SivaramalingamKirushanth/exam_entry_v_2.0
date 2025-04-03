const EligibilityHeader = ({ filteredData, onMultipleEligibilityChanged }) => {
  const [remark, setRemark] = useState("");
  const triggerRef = useRef(null);

  const isAnyoneNotEligible = filteredData.some(
    (stu) => stu.eligibility == "false"
  );

  return (
    <div className="flex justify-between">
      <span>Eligibility</span>
      <Switch
        onClick={(e) => {
          e.preventDefault();
          triggerRef.current.click();
        }}
        checked={filteredData.length && !isAnyoneNotEligible}
        disabled={!filteredData.length}
      />
      <Popover>
        <PopoverTrigger ref={triggerRef} className="w-[0px]" />
        <PopoverContent className="w-64 h-40 flex flex-col gap-2 items-start">
          <p className="font-semibold flex justify-between text-sm w-full">
            <span>Enter Remark</span>
            <span>All/Filtered Students</span>
          </p>
          <Textarea
            onChange={(e) => setRemark(e.target.value)}
            onBlur={() => setRemark("")}
            value={remark}
          />
          <Button
            className="self-end changeEli"
            onMouseDown={() => {
              if (remark) {
                onMultipleEligibilityChanged(isAnyoneNotEligible + "", remark);
              }
            }}
            disabled={!remark}
          >
            Change Eligibility
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
};
