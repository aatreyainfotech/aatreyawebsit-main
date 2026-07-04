import LegalPage from "@/components/LegalPage";

const sections = [
  {
    id: "overview",
    heading: "Overview",
    body: [
      "This Payment Policy governs how Aatreya Infotech Systems LLP invoices, receives, and reconciles payments for software licences, implementation services, cloud subscriptions, mobile applications, and technical support.",
      "All commercial terms — pricing, milestones, taxes, and payment schedule — are defined in the Work Order, Purchase Order, or Master Services Agreement executed between the Company and the client.",
    ],
  },
  {
    id: "billing-model",
    heading: "Billing Models",
    body: [
      "We offer three billing models based on the engagement:",
      [
        "Fixed-Price Implementation — one-time project fee split across defined milestones.",
        "Cloud / SaaS Subscription — monthly, quarterly, or annual subscription for OmniCloud and hosted platforms.",
        "Annual Maintenance Contract (AMC) — recurring fee for technical support, updates, and 24×7 assistance.",
      ],
    ],
  },
  {
    id: "invoicing",
    heading: "Invoicing",
    body: [
      "Invoices are raised in Indian Rupees (INR) unless otherwise agreed in writing and are inclusive of applicable GST as per prevailing Indian tax laws.",
      "Digital invoices are sent to the authorised billing contact designated by the client. Physical invoices can be issued on request.",
    ],
  },
  {
    id: "payment-methods",
    heading: "Accepted Payment Methods",
    body: [
      "Payments to Aatreya Infotech Systems LLP may be made through:",
      [
        "NEFT / RTGS / IMPS bank transfer to our designated business account (details in each invoice).",
        "UPI transfer to our verified business UPI ID (details in each invoice).",
        "Cheque / Demand Draft in favour of “Aatreya Infotech Systems LLP”, payable at Tenali, Andhra Pradesh.",
        "Government / temple procurement processes as per the client's departmental procedure.",
      ],
    ],
  },
  {
    id: "payment-terms",
    heading: "Standard Payment Terms",
    body: [
      "Unless otherwise agreed in writing:",
      [
        "Advance payment of 30–50% is due upon issuance of the Work Order.",
        "Balance is due against project milestones or on Go-Live, as specified.",
        "SaaS / AMC invoices are due within 15 days of invoice date.",
        "Interest at 1.5% per month may be levied on payments delayed beyond 30 days.",
      ],
    ],
  },
  {
    id: "government-procurement",
    heading: "Government & Temple Procurement",
    body: [
      "For temple and government engagements, we follow the payment schedule defined in the applicable Work Order, RC, or Tender document. Payments are subject to standard government verification and disbursement processes.",
    ],
  },
  {
    id: "taxes",
    heading: "Taxes",
    body: [
      "All fees are exclusive of applicable taxes such as GST, TDS, and any statutory levies, which will be charged additionally at the rates prevailing on the invoice date. Clients are responsible for deducting TDS where applicable and issuing certificates in a timely manner.",
    ],
  },
  {
    id: "receipts",
    heading: "Receipts & Reconciliation",
    body: [
      "Upon receipt of payment, we issue a GST-compliant receipt. Any reconciliation queries must be raised within 30 days of the receipt to allow prompt resolution.",
    ],
  },
  {
    id: "changes",
    heading: "Change Requests & Additional Work",
    body: [
      "Any work outside the scope of the original Work Order — including additional modules, custom development, or extended support — will be quoted separately and billed upon written approval by the client.",
    ],
  },
  {
    id: "contact-payment",
    heading: "Contact",
    body: [
      "For invoice or payment queries, please contact:",
      "Accounts — Aatreya Infotech Systems LLP, D. No. 2-105, Edlapalli, Tenali – 522211, Andhra Pradesh, India. Phone: +91 86442 97366. Email: info@aatreya.co.in",
    ],
  },
];

export default function PaymentPolicy() {
  return (
    <LegalPage
      testid="page-payment"
      eyebrow="Legal"
      title="Payment Policy"
      updated="04 December 2025"
      sections={sections}
    />
  );
}
