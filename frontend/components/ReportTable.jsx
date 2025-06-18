import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { FaQuestionCircle, FaTimes } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import Timeline from "./Timeline";
import { GoDash } from "react-icons/go";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./ui/context-menu";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import {
  updateEligibility,
  updateMedicalEligibility,
  updateResitEligibility,
} from "@/utils/apiRequests/curriculum.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const ReportTable = ({ subjects, data, exam_type, batch_id, editEnable }) => {
  const totObj = {};
  const [remark, setRemark] = useState("");
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn:
      exam_type == "P"
        ? updateEligibility
        : exam_type == "M"
        ? updateMedicalEligibility
        : updateResitEligibility,
    onSuccess: (res) => {
      queryClient.invalidateQueries(["dashboard", batch_id]);
      toast.success(res.message);
      setRemark("");
    },
    onError: (err) => {
      toast.error("Operation failed");
      setRemark("");
    },
  });

  const onEligibilityChanged = async (sub_id, s_id, eligibility, remark) => {
    mutate({ batch_id, sub_id, eligibility, s_id, remark });
  };

  Object.values(data).forEach((stuArr) =>
    stuArr.forEach((subObj) => {
      if (!totObj?.eligible) {
        totObj.eligible = {};
      }
      if (!totObj?.total) {
        totObj.total = {};
      }
      if (subObj.eligibility == "true") {
        if (totObj.eligible.hasOwnProperty(subObj?.sub_id)) {
          totObj.eligible[subObj.sub_id]++;
        } else {
          totObj.eligible[subObj.sub_id] = 1;
        }
      }

      if (totObj.total.hasOwnProperty(subObj?.sub_id)) {
        totObj.total[subObj.sub_id]++;
      } else {
        totObj.total[subObj.sub_id] = 1;
      }
    })
  );

  return (
    <Table className="bg-white">
      <TableHeader>
        <TableRow className="bg-black hover:bg-black">
          <TableHead className="w-[50px] text-white">#</TableHead>
          <TableHead className="w-[100px] text-white">Reg. No.</TableHead>

          {subjects?.map((obj) => (
            <TableHead
              className="text-white text-center"
              key={"header" + obj.sub_id + exam_type + batch_id}
            >
              {obj.sub_code}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.entries(data).map(([index_num, subObjArr], i) => (
          <TableRow key={index_num + exam_type}>
            <TableCell>{i + 1}</TableCell>
            <TableCell>{subObjArr.user_name}</TableCell>
            {subjects?.map((obj) => (
              <TableCell
                key={"body" + index_num + obj.sub_id + exam_type + batch_id}
              >
                {(() => {
                  const subject = subObjArr.find(
                    (subObj) => subObj.sub_id == obj.sub_id
                  );
                  return subject ? (
                    subject.remarks.length ? (
                      <ContextMenu>
                        <ContextMenuTrigger>
                          <Popover>
                            <PopoverTrigger className="flex py-1 justify-center bg-yellow-300 w-full cursor-default">
                              {subject.eligibility == "true" ? (
                                <FaCheck />
                              ) : (
                                <FaTimes className="text-red-500" />
                              )}
                            </PopoverTrigger>
                            <PopoverContent className="min-w-64">
                              <h1 className="font-bold mb-1 text-lg text-center">
                                Remarks
                              </h1>
                              <Timeline
                                timelineData={subject.remarks?.sort(
                                  (a, b) =>
                                    new Date(b.date_time) -
                                    new Date(a.date_time)
                                )}
                              />
                            </PopoverContent>
                          </Popover>
                        </ContextMenuTrigger>
                        {editEnable && (
                          <ContextMenuContent className="w-64 p-2">
                            <p className="font-semibold flex justify-center text-sm w-full mb-2">
                              <span>
                                Enter Remark{" "}
                                {subject.eligibility == "" ? "(optional)" : ""}
                              </span>
                            </p>
                            <p className="font-semibold flex justify-between text-sm w-full mb-2">
                              <span>{subject.sub_code}</span>
                              <span>
                                {index_num || subject.user_name || ""}
                              </span>
                            </p>
                            <Textarea
                              onChange={(e) => setRemark(e.target.value)}
                              value={remark}
                              className="my-2"
                            />
                            <ContextMenuItem
                              disabled={subject.eligibility != "" && !remark}
                              className={`${
                                subject.eligibility == "true" ? "hidden" : ""
                              }`}
                              onClick={() =>
                                onEligibilityChanged(
                                  subject.sub_id,
                                  subject.s_id,
                                  "true",
                                  remark
                                )
                              }
                            >
                              Eligible
                            </ContextMenuItem>
                            <ContextMenuItem
                              disabled={subject.eligibility != "" && !remark}
                              className={`${
                                subject.eligibility == "false" ? "hidden" : ""
                              }`}
                              onClick={() =>
                                onEligibilityChanged(
                                  subject.sub_id,
                                  subject.s_id,
                                  "false",
                                  remark
                                )
                              }
                            >
                              Not eligible
                            </ContextMenuItem>
                          </ContextMenuContent>
                        )}
                      </ContextMenu>
                    ) : (
                      <h1 className="justify-center flex">
                        <ContextMenu>
                          <ContextMenuTrigger className="flex py-1 justify-center w-full cursor-default">
                            {subject.eligibility == "true" ? (
                              <FaCheck />
                            ) : subject.eligibility == "false" ? (
                              <FaTimes className="text-red-500" />
                            ) : (
                              <FaQuestionCircle
                                size={18}
                                className="text-red-500"
                              />
                            )}
                          </ContextMenuTrigger>
                          {editEnable && (
                            <ContextMenuContent className="w-64 p-2">
                              <p className="font-semibold flex justify-center text-sm w-full mb-2">
                                <span>
                                  Enter Remark{" "}
                                  {subject.eligibility == ""
                                    ? "(optional)"
                                    : ""}
                                </span>
                              </p>
                              <p className="font-semibold flex justify-between text-sm w-full mb-2">
                                <span>{subject.sub_code}</span>
                                <span>
                                  {index_num || subject.user_name || ""}
                                </span>
                              </p>
                              <Textarea
                                onChange={(e) => setRemark(e.target.value)}
                                value={remark}
                                className="my-2"
                              />
                              <ContextMenuItem
                                disabled={subject.eligibility != "" && !remark}
                                className={`${
                                  subject.eligibility == "true" ? "hidden" : ""
                                }`}
                                onClick={() =>
                                  onEligibilityChanged(
                                    subject.sub_id,
                                    subject.s_id,
                                    "true",
                                    remark
                                  )
                                }
                              >
                                Eligible
                              </ContextMenuItem>
                              <ContextMenuItem
                                disabled={subject.eligibility != "" && !remark}
                                className={`${
                                  subject.eligibility == "false" ? "hidden" : ""
                                }`}
                                onClick={() =>
                                  onEligibilityChanged(
                                    subject.sub_id,
                                    subject.s_id,
                                    "false",
                                    remark
                                  )
                                }
                              >
                                Not eligible
                              </ContextMenuItem>
                            </ContextMenuContent>
                          )}
                        </ContextMenu>
                      </h1>
                    )
                  ) : (
                    <h1 className="justify-center py-1 flex">
                      <GoDash />
                    </h1>
                  );
                })()}
              </TableCell>
            ))}
          </TableRow>
        ))}

        <TableRow className="bg-zinc-200 hover:bg-zinc-200">
          <TableCell rowSpan={2} className="font-bold">
            Total
          </TableCell>
          <TableCell className="font-bold">Eligible</TableCell>
          {subjects?.map((obj) => (
            <TableCell key={"total" + obj.sub_id + exam_type + batch_id}>
              <h1 className="justify-center flex font-bold">
                {totObj?.eligible?.[obj.sub_id]
                  ? totObj?.eligible?.[obj.sub_id]
                  : 0}
              </h1>
            </TableCell>
          ))}
        </TableRow>
        <TableRow className="bg-zinc-200 hover:bg-zinc-200">
          <TableCell className="font-bold">Applied</TableCell>
          {subjects?.map((obj) => (
            <TableCell key={"total" + obj.sub_id + exam_type + batch_id}>
              <h1 className="justify-center flex font-bold">
                {totObj?.total?.[obj.sub_id] ? totObj?.total?.[obj.sub_id] : 0}
              </h1>
            </TableCell>
          ))}
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default ReportTable;
