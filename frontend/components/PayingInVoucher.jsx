import { useEffect } from "react";

const PayingInVoucher = ({
  paymentDetails,
  onRenderComplete,
  instructionsdata,
}) => {
  useEffect(() => {
    if (onRenderComplete && instructionsdata) {
      onRenderComplete();
    }
  }, [onRenderComplete, instructionsdata]);

  const { user_name, name, exam_type, subjects, amounts } = paymentDetails;

  const totalAmount = subjects
    .reduce((sum, subject) => sum + Number(amounts[subject.type]), 0)
    .toFixed(2);

  return (
    <div className="w-[210mm] p-[20mm] bg-white text-[12pt] font-serif relative">
      {/* Header */}
      <div className="absolute right-3 text-xs">
        Student Reg.No : {user_name}
      </div>

      {/* Title */}
      <h2 className="text-center text-lg font-bold uppercase">
        University of Vavuniya, sri lanka
      </h2>
      <h2 className="text-center text-lg font-bold mb-6 uppercase">
        paying in voucher
      </h2>

      {/* Dates Row */}
      {/* <div className="flex justify-between mb-3">
        <div className="text-sm">
          <span className="font-semibold">Generated Date :</span>{" "}
          {generated_date}
        </div>
        <div className="text-sm">
          <span className="font-semibold">Payment Deadline :</span>{" "}
          {payment_deadline}
        </div>
      </div> */}
      <div className="mb-2 text-sm">1) Name of Payer: {name}</div>
      <div className="mb-2 text-sm">
        2)&nbsp;Payer&apos;s&nbsp;Address&nbsp;:&nbsp;.........................................................................................................................................
      </div>
      {/* Table */}
      <div className="mb-3 text-sm">
        3) Reason for Payment : {exam_type} Payment
      </div>
      <table className="w-full border border-black border-collapse mb-2 text-sm">
        <thead>
          <tr>
            <th className="border border-black p-2 text-left w-28">
              Subject Code
            </th>
            <th className="border border-black p-2 text-left">Subject Name</th>
            <th className="border border-black p-2 text-right w-28">
              Amount&nbsp;(LKR)
            </th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((sub, idx) => (
            <tr key={idx}>
              <td className="border border-black p-2">{sub.sub_code}</td>
              <td className="border border-black p-2">{sub.subject_name}</td>
              <td className="border border-black p-2 text-right">
                {amounts[sub.type]}
              </td>
            </tr>
          ))}
          <tr>
            <td
              colSpan="2"
              className="border border-black p-2 text-right font-semibold"
            >
              Total
            </td>
            <td className="border border-black p-2 text-right font-semibold">
              {totalAmount}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="mb-2 text-sm">
        4)&nbsp;Total&nbsp;Amount&nbsp;(in&nbsp;words)&nbsp;Rs........................................................................................................................
        <br />
        .......................................................................Cts..............................................................................................
      </div>

      <div className="mb-2 text-sm">
        5)&nbsp;Mode&nbsp;of&nbsp;payment&nbsp;:&nbsp;<u>Cash</u>
        &nbsp;/&nbsp;Cheque&nbsp;/&nbsp;Money&nbsp;Order&nbsp;/&nbsp;Postal&nbsp;Order&nbsp;No&nbsp;......................................................
      </div>

      {/* Remarks */}
      <div className="mb-2 text-sm">
        6)&nbsp;Remarks&nbsp;:&nbsp;....................................................................................................................................................
      </div>

      <div className="mb-4 text-sm">
        7)&nbsp;Date&nbsp;:&nbsp;...........................................................................................................................................................
      </div>

      <div className="flex justify-end mb-4 pr-[2px]">
        <div className="text-sm">
          Signature of payer : ......................
        </div>
      </div>

      {/* Instructions
      <div>
        <h4 className="font-semibold">Payment Instructions</h4>
        <p className="text-justify text-slate-700 text-sm">
          {instructionsdata
            ? instructionsdata.find((item) => item.type == "payment")
                ?.instruction
            : "Please pay the above amount to the university account via the official payment portal before the deadline"}
        </p>
      </div> */}

      {/* Shroff use */}
      <div className="text-center text-base font-semibold mt-6">
        (For the use of the Shroff of the Receiving Department only)
      </div>
      <div className="text-center mb-6 text-sm">Received the above amount</div>

      <div className="flex justify-between">
        <div className="text-sm">Receipt No : .........................</div>
        <div className="flex flex-col gap-y-2 items-start">
          <div className="text-sm">Date : ........................</div>
          <div className="text-sm">Shroff : .....................</div>
        </div>
      </div>
    </div>
  );
};

export default PayingInVoucher;
