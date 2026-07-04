import LegalPage from "@/components/LegalPage";

const sections = [
  {
    id: "overview-rc",
    heading: "Overview",
    body: [
      "This Refund & Cancellation Policy applies to all services, software licences, cloud subscriptions, mobile applications, and support engagements offered by Aatreya Infotech Systems LLP.",
      "Because temple and government software engagements are custom in nature and involve significant deployment effort, refunds are governed by the specific terms of each Work Order and this policy.",
    ],
  },
  {
    id: "principle",
    heading: "General Principle",
    body: [
      "Fees paid for effort already delivered — including consultation, design, custom development, deployment, staff training, and on-site support — are non-refundable.",
      "Refunds, where permitted, are prorated against work performed and expenses incurred up to the effective date of cancellation.",
    ],
  },
  {
    id: "implementation",
    heading: "Implementation Projects",
    body: [
      "For fixed-price implementations (Temple ERP, Digital ID Pass, Queue Management, etc.):",
      [
        "Advance / mobilisation fee is non-refundable once project kick-off has occurred.",
        "Milestone payments are non-refundable once the corresponding milestone has been delivered and accepted.",
        "If the client cancels a project mid-way, we retain fees proportionate to the work completed. Any unearned advance will be refunded within 30 working days.",
      ],
    ],
  },
  {
    id: "saas",
    heading: "Cloud / SaaS Subscriptions",
    body: [
      "For OmniCloud and other hosted subscriptions:",
      [
        "Monthly subscriptions may be cancelled at the end of the current billing cycle. No refunds are issued for partial months.",
        "Annual subscriptions cancelled mid-term will be refunded on a prorated basis, minus a 15% administrative and offboarding charge.",
        "Cancellations must be requested in writing to info@aatreya.co.in at least 15 days before the next renewal date.",
      ],
    ],
  },
  {
    id: "amc",
    heading: "Annual Maintenance Contracts (AMC)",
    body: [
      "AMC fees are non-refundable once the contract term has commenced. Renewal is at the client's discretion, subject to written notice at least 30 days before the current term ends.",
    ],
  },
  {
    id: "duplicate",
    heading: "Duplicate & Erroneous Payments",
    body: [
      "In the event of a duplicate payment, incorrect amount, or erroneous charge — please write to us within 15 days of the transaction with the invoice reference and transaction proof. Verified duplicate / erroneous payments will be refunded within 10–15 working days to the original source of payment.",
    ],
  },
  {
    id: "government",
    heading: "Government & Temple Engagements",
    body: [
      "For government departments and temple administrations, refunds and cancellations follow the terms specified in the applicable Work Order, RC, Tender document, or Purchase Order — read together with this policy.",
    ],
  },
  {
    id: "how-to-request",
    heading: "How to Request a Refund",
    body: [
      "To request a refund or cancellation, please send a written request to info@aatreya.co.in with:",
      [
        "Client / temple / department name",
        "Original invoice number and date",
        "Payment reference (bank transaction ID / UTR / receipt number)",
        "Reason for cancellation or refund",
      ],
      "We aim to acknowledge every request within 3 working days and complete verified refunds within 10–15 working days of approval.",
    ],
  },
  {
    id: "non-refundable",
    heading: "Non-Refundable Items",
    body: [
      "The following items are strictly non-refundable:",
      [
        "One-time setup, deployment, and training fees.",
        "Custom development already delivered.",
        "Third-party pass-through charges (WhatsApp Business API, cloud hosting, SMS credits, etc.).",
        "AMC fees for the completed contract period.",
      ],
    ],
  },
  {
    id: "contact-refund",
    heading: "Contact",
    body: [
      "For refund and cancellation queries, please contact:",
      "Aatreya Infotech Systems LLP, D. No. 2-105, Edlapalli, Tenali – 522211, Andhra Pradesh, India. Phone: +91 86442 97366. Email: info@aatreya.co.in",
    ],
  },
];

export default function RefundCancellation() {
  return (
    <LegalPage
      testid="page-refund"
      eyebrow="Legal"
      title="Refund & Cancellation Policy"
      updated="04 December 2025"
      sections={sections}
    />
  );
}
