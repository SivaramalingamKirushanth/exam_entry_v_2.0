import { FaChevronDown, FaChevronRight } from "react-icons/fa6";

const faqs = [
  {
    id: "item-1",
    question: "How to make payment for MC/Resit?",
    answer: null,
  },
  {
    id: "item-2",
    question: "When should I pay after applying?",
    answer:
      "After the dean’s deadline, you'll be able to download a payment invoice. You must pay the specified amount and upload the payment reference before the payment deadline.",
  },
  {
    id: "item-3",
    question: "Can I edit or reapply after submitting?",
    answer:
      "No. Once submitted, the application cannot be changed. If you made a mistake before submitting, you can refresh the page to reset the form.",
  },
  {
    id: "item-4",
    question: "What does subject eligibility mean?",
    answer:
      "Eligibility is determined based on your current attendance. If a subject is marked as 'not eligible', you should still apply and consult the lecturer or responsible person to resolve it. This is not a final decision — just the current status.",
  },
  {
    id: "item-5",
    question: "Can I remove subjects from the Proper application?",
    answer:
      "Yes, if you're not planning to sit for a subject this time, you may remove it. However, make sure it's intentional — once submitted, applications cannot be modified.",
  },
  {
    id: "item-6",
    question: "Can I pay for multiple applications in one transaction?",
    answer:
      "No. You must make a separate payment for each batch and exam type (Medical or Resit).",
  },
  {
    id: "item-7",
    question:
      "Can I apply for the same subject through both Medical and Resit?",
    answer:
      "No. A subject can only be applied through either Medical or Resit, not both. However, different subjects from the same batch can be applied through different types.",
  },
  {
    id: "item-8",
    question: "Can my Medical application be changed to Resit?",
    answer:
      "Yes. If your medical requirements are not satisfied, the examination branch may convert your application to a Resit type.",
  },
];

export default function CustomFAQ({
  expandId,
  expandHandler,
  dynamicInstruction,
}) {
  return (
    <div className="w-full mt-6">
      {faqs.map((faq) => (
        <div key={faq.id} className="mb-3">
          <h1
            className="font-semibold mb-1 cursor-pointer flex gap-x-2 items-center"
            id={faq.id}
            onClick={expandHandler}
          >
            {expandId === faq.id ? (
              <FaChevronDown size={12} />
            ) : (
              <FaChevronRight size={12} />
            )}
            {faq.question}
          </h1>
          <div
            className={`px-6 transition-all ${
              expandId === faq.id ? "h-auto" : "h-0 overflow-hidden"
            }`}
          >
            {faq.answer !== null
              ? faq.answer
              : faq.id === "item-1"
              ? dynamicInstruction || "Loading instruction..."
              : null}
          </div>
        </div>
      ))}
    </div>
  );
}
