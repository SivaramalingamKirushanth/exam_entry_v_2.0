import { useEffect } from "react";

const PaymentInvoice = ({
  paymentDetails,
  onRenderComplete,
  instructionsdata,
}) => {
  useEffect(() => {
    if (onRenderComplete && instructionsdata) {
      onRenderComplete();
    }
  }, [onRenderComplete, instructionsdata]);

  const {
    username,
    exam_type,
    generated_date,
    payment_deadline,
    subjects,
    amounts,
  } = paymentDetails;

  const totalAmount = subjects.reduce(
    (sum, subject) => sum + Number(amounts[subject.type]),
    0
  );

  return (
    <div className="w-[210mm] p-[20mm] bg-white text-[12pt] font-sans">
      {/* Header */}
      <div className="flex justify-between mb-4">
        <div>
          <span className="font-semibold">User:</span> {username}
        </div>
        <div>
          <span className="font-semibold">Exam Type:</span> {exam_type}
        </div>
      </div>

      {/* Title */}
      <h2 className="text-center text-xl font-bold mb-6">Examination Branch</h2>

      {/* Dates Row */}
      <div className="flex justify-between mb-6">
        <div>
          <span className="font-semibold">Generated Date:</span>{" "}
          {generated_date}
        </div>
        <div>
          <span className="font-semibold">Payment Deadline:</span>{" "}
          {payment_deadline}
        </div>
      </div>

      {/* Table */}
      <table className="w-full border border-black border-collapse mb-6">
        <thead>
          <tr>
            <th className="border border-black p-2 text-left">Subject Code</th>
            <th className="border border-black p-2 text-left">Subject Name</th>
            <th className="border border-black p-2 text-right">Amount (LKR)</th>
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

      {/* Instructions */}
      <div>
        <h4 className="font-semibold mb-2">Payment Instructions:</h4>
        <p className="text-justify">
          {instructionsdata
            ? instructionsdata.find((item) => item.type == "payment")
                ?.instruction
            : "Please pay the above amount to the university account via the official payment portal before the deadline"}
        </p>
      </div>
    </div>
  );
};

export default PaymentInvoice;
