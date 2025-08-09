import { useEffect } from "react";

const PaymentInstructionsPage = ({
  paymentDetails,
  onRenderComplete,
  instructionsdata,
}) => {
  useEffect(() => {
    if (onRenderComplete && instructionsdata) {
      onRenderComplete();
    }
  }, [onRenderComplete, instructionsdata]);

  const { payment_deadline } = paymentDetails;

  return (
    <div className="w-[210mm] p-[20mm] bg-white text-[12pt] font-serif relative">
      {/* Title */}
      <h2 className="text-center text-lg font-bold mb-6 uppercase">
        Payment Instructions
      </h2>

      <div className="mb-2 text-sm text-red-600">
        <span className="font-semibold">Payment Deadline:</span>{" "}
        {payment_deadline}
      </div>

      {/* Payment Instructions */}
      <div className="mb-6">
        <div className="text-sm text-justify leading-relaxed">
          {instructionsdata
            ? instructionsdata.find((item) => item.type === "payment")
                ?.instruction ||
              "Print two copies of the Paying in Voucher. Present one copy of the Paying-in Voucher at the Shroff Counter, Finance Branch, University of Vavuniya, to make the payment (Anyone with a printed Paying-in Voucher can make the payment).	Obtain the original payment receipt from the Shroff. Enter the receipt number into the System for Examination Entry by clicking “SUBMIT RECEIPT NO” for the relevant examination. Attach the other copy of the Paying in Voucher and the original payment receipt together, and submit them to the Examination Branch before the payment deadline."
            : "Print two copies of the Paying in Voucher. Present one copy of the Paying-in Voucher at the Shroff Counter, Finance Branch, University of Vavuniya, to make the payment (Anyone with a printed Paying-in Voucher can make the payment).	Obtain the original payment receipt from the Shroff. Enter the receipt number into the System for Examination Entry by clicking “SUBMIT RECEIPT NO” for the relevant examination. Attach the other copy of the Paying in Voucher and the original payment receipt together, and submit them to the Examination Branch before the payment deadline."}
        </div>
      </div>
    </div>
  );
};

export default PaymentInstructionsPage;
