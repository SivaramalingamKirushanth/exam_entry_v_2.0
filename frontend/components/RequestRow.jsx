import { useEffect, useState } from "react";
import MedicalSubject from "./MedicalSubject";
import ResitSubject from "./ResitSubject";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Textarea } from "./ui/textarea";
import { numberToOrdinalWord } from "@/utils/functions";
import {
  acceptMedicalResitStudents,
  rejectMedicalResitApplication,
  revokeMedicalResitApplication,
  updateReference,
  updateVerified,
} from "@/utils/apiRequests/entry.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { GoDotFill } from "react-icons/go";
import {
  getBatchOpenDate,
  getDeadlinesForBatch,
} from "@/utils/apiRequests/batch.api";

const grades = {
  0: "N/A",
  1: "F",
  2: "E",
  3: "D",
  4: "D+",
  5: "C-",
  6: "C",
};

const RequestRow = ({ obj }) => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({});
  const [updateResitRef, setUpdateResitRef] = useState("");
  const [updateMedicalRef, setUpdateMedicalRef] = useState("");
  const [rejectRemark, setRejectRemark] = useState("");
  const [isMedSubCheckEnable, setIsMedSubCheckEnable] = useState(false);
  const [isMedRefCheckEnable, setIsMedRefCheckEnable] = useState(false);
  const [isResSubCheckEnable, setIsResSubCheckEnable] = useState(false);
  const [isResRefCheckEnable, setIsResRefCheckEnable] = useState(false);
  const [deadlineObj, setDeadlineObj] = useState({
    lec_deadline: "",
    hod_deadline: "",
    dean_deadline: "",
    stu_deadline: "",
  });

  const { mutate: mutateRef, isPending: isMutateRefPending } = useMutation({
    mutationFn: updateReference,
    onSuccess: (res) => {
      queryClient.invalidateQueries(["requests", "medical", "resit"]);
      toast.success(res.message);
    },
    onError: (err) => {
      toast.error("Operation failed");
    },
  });

  const { mutate: mutateVerified, isPending: isMutateVerifiedPending } =
    useMutation({
      mutationFn: updateVerified,
      onSuccess: (res) => {
        toast.success(res.message);
      },
      onError: (err) => {
        toast.error("Operation failed");
      },
    });

  const { mutate: acceptMutate, isPending: isMutateAcceptPending } =
    useMutation({
      mutationFn: acceptMedicalResitStudents,
      onSuccess: (res) => {
        queryClient.invalidateQueries(["requests", "medical", "resit"]);

        toast.success(res.message);
      },
      onError: (err) => {
        toast.error("Operation failed");
      },
    });

  const { mutate: rejectMutate } = useMutation({
    mutationFn: rejectMedicalResitApplication,
    onSuccess: (res) => {
      queryClient.invalidateQueries(["requests", "medical", "resit"]);
      toast.success(res.message);
    },
    onError: (err) => {
      toast.error("Operation failed");
    },
  });

  const { mutate: revokeMutate } = useMutation({
    mutationFn: revokeMedicalResitApplication,
    onSuccess: (res) => {
      queryClient.invalidateQueries(["requests", "medical", "resit"]);
      toast.success(res.message);
    },
    onError: (err) => {
      toast.error("Operation failed");
    },
  });

  const { data: openDateData } = useQuery({
    queryFn: () => getBatchOpenDate(obj?.batch_id),
    queryKey: ["batch", "openDate", obj?.batch_id],
  });

  const { data: deadlineData } = useQuery({
    queryFn: () => getDeadlinesForBatch(obj?.batch_id),
    queryKey: ["batch", "dealines", obj?.batch_id],
  });

  const onCheckedChanged = (e) => {
    if (e.target) {
      setFormData((curData) => ({
        ...curData,
        [e.target?.name]: e.target?.checked,
      }));

      let id;
      if (e.target?.name.startsWith("medical")) {
        id = formData?.medical_id;
      } else if (e.target?.name.startsWith("resit")) {
        id = formData?.resit_id;
      }

      let data = {
        request: e.target?.name,
        id,
        verified: e.target?.checked + "",
      };

      mutateVerified(data);
    }
  };

  const updateMedicalRefHandler = () => {
    if (formData?.medical_id && updateMedicalRef) {
      mutateRef({
        request: "m",
        id: formData?.medical_id,
        ref: updateMedicalRef,
      });
    }
  };

  const updateResitRefHandler = () => {
    if (formData?.resit_id && updateResitRef) {
      mutateRef({ request: "r", id: formData?.resit_id, ref: updateResitRef });
    }
  };

  const onAccept = () => {
    acceptMutate({ s_id: obj?.s_id, batch_id: obj?.batch_id });
  };

  const onReject = () => {
    rejectMutate({ s_id: obj?.s_id, batch_id: obj?.batch_id });
  };

  const handleRevoke = () => {
    revokeMutate({ s_id: obj?.s_id, batch_id: obj?.batch_id });
  };

  useEffect(() => {
    if (obj) {
      setFormData({
        ...obj,

        resit_payment_verified:
          obj?.resit_payment_verified == "false" ||
          obj?.resit_payment_verified == false ||
          obj?.resit_payment_verified == null
            ? false
            : true,
        resit_subjects_verified:
          obj?.resit_subjects_verified == "false" ||
          obj?.resit_subjects_verified == false ||
          obj?.resit_subjects_verified == null
            ? false
            : true,
        medical_payment_verified:
          obj?.medical_payment_verified == "false" ||
          obj?.medical_payment_verified == false ||
          obj?.medical_payment_verified == null
            ? false
            : true,
        medical_subjects_verified:
          obj?.medical_subjects_verified == "false" ||
          obj?.medical_subjects_verified == false ||
          obj?.medical_subjects_verified == null
            ? false
            : true,
      });

      setUpdateResitRef(obj.resit_reference);
      setUpdateMedicalRef(obj.medical_reference);
    }
  }, [obj]);

  useEffect(() => {
    setIsMedSubCheckEnable(formData?.medical_subs?.length);
    setIsMedRefCheckEnable(formData?.medical_reference);
    setIsResSubCheckEnable(formData?.resit_subs?.length);
    setIsResRefCheckEnable(formData?.resit_reference);
  }, [formData]);

  useEffect(() => {
    if (deadlineData && deadlineData.length) {
      setDeadlineObj({
        stu_deadline: deadlineData.filter((obj) => obj.user_type == "5")[0]
          .deadline,
        lec_deadline: deadlineData.filter((obj) => obj.user_type == "4")[0]
          .deadline,
        hod_deadline: deadlineData.filter((obj) => obj.user_type == "3")[0]
          .deadline,
        dean_deadline: deadlineData.filter((obj) => obj.user_type == "2")[0]
          .deadline,
      });
    }
  }, [deadlineData]);

  return (
    <>
      <tr className="bg-white">
        <td className="px-2 border border-gray-300 text-center" rowSpan={2}>
          {formData?._user_name}
        </td>
        <td className=" p-2 border border-gray-300 align-top bg-pink-50">
          <span className="flex flex-col justify-between gap-y-5 h-full min-h-full">
            <span className="flex flex-col items-start justify-start gap-2">
              {formData?.medical_subs?.map((item, i) => (
                <MedicalSubject
                  id={item.id}
                  sub_code={item.sub_code}
                  sub_name={item.sub_name}
                  user_name={formData?._user_name}
                  key={i}
                />
              ))}
            </span>
            <input
              onChange={onCheckedChanged}
              name="medical_subjects_verified"
              type="checkbox"
              className="accent-black rounded-md w-4 h-4 self-center"
              checked={formData.medical_subjects_verified || ""}
              disabled={!isMedSubCheckEnable}
            />
          </span>
        </td>
        <td className="p-2 border border-gray-300 align-top bg-pink-50">
          <div className="flex flex-col justify-between h-full min-h-full items-center gap-y-5">
            <span className="flex flex-col gap-y-2 items-center">
              <Input
                id="medical_reference"
                name="medical_reference"
                className="w-full"
                onChange={(e) => setUpdateMedicalRef(e.target.value)}
                onBlur={(e) => {
                  setUpdateMedicalRef(e.target.value.trim());
                }}
                value={updateMedicalRef || ""}
              />
              <Button
                type="button"
                disabled={
                  !updateMedicalRef ||
                  obj?.medical_reference == updateMedicalRef
                }
                onClick={updateMedicalRefHandler}
              >
                Update
              </Button>
            </span>
            <input
              onChange={onCheckedChanged}
              name="medical_payment_verified"
              type="checkbox"
              className="accent-black rounded-md w-4 h-4 self-center"
              checked={formData.medical_payment_verified || ""}
              disabled={!isMedRefCheckEnable}
            />
          </div>
        </td>
        <td className=" p-2 border border-gray-300 align-top bg-green-50">
          <span className="flex flex-col justify-between gap-y-5 h-full min-h-full">
            <span className="flex flex-col items-start justify-start gap-2">
              {formData?.resit_subs?.map((item, i) => (
                <ResitSubject
                  id={item.id}
                  sub_code={item.sub_code}
                  sub_name={item.sub_name}
                  user_name={formData?._user_name}
                  attempt_1={grades[item.attempt_1]}
                  attempt_2={grades[item.attempt_2]}
                  attempt_3={grades[item.attempt_3]}
                  key={i}
                />
              ))}
            </span>
            <input
              onChange={onCheckedChanged}
              name="resit_subjects_verified"
              type="checkbox"
              className="accent-black rounded-md w-4 h-4 self-center"
              checked={formData.resit_subjects_verified || ""}
              disabled={!isResSubCheckEnable}
            />
          </span>
        </td>
        <td className="p-2 border border-gray-300 align-top bg-green-50">
          <div className="flex flex-col justify-between h-full min-h-full items-center gap-y-5">
            <span className="flex flex-col gap-y-2 items-center">
              <Input
                id="resit_reference"
                name="resit_reference"
                className="w-full"
                onChange={(e) => setUpdateResitRef(e.target.value)}
                onBlur={(e) => {
                  setUpdateResitRef(e.target.value.trim());
                }}
                value={updateResitRef || ""}
              />
              <Button
                type="button"
                disabled={
                  !updateResitRef || obj?.resit_reference == updateResitRef
                }
                onClick={updateResitRefHandler}
              >
                Update
              </Button>
            </span>
            <input
              onChange={onCheckedChanged}
              name="resit_payment_verified"
              type="checkbox"
              className="accent-black rounded-md w-4 h-4 self-center"
              checked={formData.resit_payment_verified || ""}
              disabled={!isResRefCheckEnable}
            />
          </div>
        </td>
        <td className="px-2 border border-gray-300 text-center" rowSpan={2}>
          <Button
            className="mb-3"
            type="button"
            disabled={
              (isMedSubCheckEnable && !formData.medical_subjects_verified) ||
              (isMedRefCheckEnable && !formData.medical_payment_verified) ||
              (isResSubCheckEnable && !formData.resit_subjects_verified) ||
              (isResRefCheckEnable && !formData.resit_payment_verified) ||
              new Date() > new Date(openDateData?.admin_end) ||
              new Date() < new Date(deadlineObj?.dean_deadline)
            }
            onClick={onAccept}
          >
            Accept
          </Button>
          <Popover>
            <PopoverTrigger className="trigger flex justify-center mx-auto mb-3">
              <span
                type="button"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-red-500 bg-background shadow-sm hover:bg-red-500 text-red-500 hover:text-white h-9 px-4 py-2"
              >
                Reject
              </span>
            </PopoverTrigger>
            <PopoverContent className="w-64 h-40 flex flex-col gap-2 items-start">
              <p className="font-semibold flex justify-between text-sm w-full">
                <span>Enter Remark</span>
                <span>{formData?._user_name}</span>
              </p>
              <Textarea
                onChange={(e) => setRejectRemark(e.target.value)}
                onBlur={() => setRejectRemark("")}
                value={rejectRemark}
              />
              <Button
                className="self-end"
                type="button"
                variant="warning"
                onClick={onReject}
              >
                Reject
              </Button>
            </PopoverContent>
          </Popover>
          <AlertDialog>
            <AlertDialogTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-red-500 text-primary-foreground shadow hover:bg-red-500/90 hover:text-white h-9 px-4 py-2">
              Revoke
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  student's <strong>all the requests</strong> of this batch.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleRevoke}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </td>
      </tr>
      <tr className="bg-white">
        <td
          className="text-center pt-3 pb-5 font-semibold border border-gray-300"
          colSpan={4}
        >
          <div className="flex flex-col items-center gap-x-1">
            <p className="uppercase">
              {numberToOrdinalWord(formData?.level)} examination in{" "}
              {formData?.grp_course_title} {formData?.academic_year}{" "}
            </p>
            <p className="uppercase">
              {numberToOrdinalWord(formData?.sem_no)} semester
            </p>

            <p>{formData?.batch_code}</p>
            <p>
              Request acceptance period :{" "}
              {new Date(deadlineObj?.dean_deadline)
                .toString()
                .slice(
                  4,
                  new Date(deadlineObj?.dean_deadline).toString().indexOf("GMT")
                )}{" "}
              &#8208;{" "}
              {new Date(openDateData?.admin_end)
                .toString()
                .slice(
                  4,
                  new Date(openDateData?.admin_end).toString().indexOf("GMT")
                )}
            </p>
            <p className="flex mt-2 items-center text-rose-700">
              <GoDotFill className="text-red-600" />
              {new Date() < new Date(deadlineObj?.stu_deadline)
                ? "Student Submission Phase"
                : new Date() < new Date(deadlineObj?.lec_deadline)
                ? "Lecturer Review Phase"
                : new Date() < new Date(deadlineObj?.hod_deadline)
                ? "HOD Approval Phase"
                : new Date() < new Date(deadlineObj?.dean_deadline)
                ? "Dean Approval Phase"
                : new Date() < new Date(openDateData?.payment_end)
                ? "Payment Processing Phase"
                : new Date() < new Date(openDateData?.admin_end)
                ? "Final Admin Approval Phase"
                : "Request Expired"}
            </p>
          </div>
        </td>
      </tr>
      <tr className="h-5">
        <td colSpan="6"></td>
      </tr>
    </>
  );
};

export default RequestRow;
