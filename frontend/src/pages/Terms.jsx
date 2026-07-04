import LegalPage from "@/components/LegalPage";

const sections = [
  {
    id: "acceptance",
    heading: "Acceptance of Terms",
    body: [
      "By accessing or using the websites, applications, or services provided by Aatreya Infotech Systems LLP (the “Company”, “we”, “us”), you agree to be bound by these Terms & Conditions. If you do not agree, please do not use our services.",
      "These Terms apply to all visitors, temple administrations, government departments, contractors, and other users who access our digital solutions.",
    ],
  },
  {
    id: "services",
    heading: "Scope of Services",
    body: [
      "Aatreya Infotech Systems LLP designs, develops, implements, and maintains enterprise digital solutions for temples, religious institutions, and public sector projects — including Temple ERP, Queue Management, Digital ID Pass, QR Technology, WhatsApp Business Platform, Mobile Applications, and Cloud Platforms.",
      "Specific deliverables, timelines, and commercial terms for each engagement are governed by the signed Work Order, Purchase Order, or Master Services Agreement between the Company and the client.",
    ],
  },
  {
    id: "eligibility",
    heading: "Eligibility & Client Account",
    body: [
      "Our software is licensed to authorized temple administrators, government departments, and enterprise clients. Access credentials are issued to designated personnel.",
      "Clients agree to keep credentials confidential and are responsible for all activity that occurs under their accounts.",
    ],
  },
  {
    id: "ip",
    heading: "Intellectual Property",
    body: [
      "All software, source code, designs, trademarks, logos, and content on Aatreya platforms are the exclusive property of Aatreya Infotech Systems LLP, unless expressly assigned in writing.",
      "Clients receive a limited, non-transferable licence to use deployed software for the scope defined in their Work Order for the duration of the engagement.",
    ],
  },
  {
    id: "acceptable-use",
    heading: "Acceptable Use",
    body: [
      "You agree not to:",
      [
        "Reverse engineer, copy, or resell our software.",
        "Attempt to circumvent security controls, QR verification, or access management.",
        "Upload malicious code or use our platforms for unlawful, misleading, or infringing activity.",
        "Interfere with the normal operation of our systems.",
      ],
    ],
  },
  {
    id: "sla",
    heading: "Service Levels & Availability",
    body: [
      "We endeavour to maintain 99.9% uptime on our cloud platforms and 24×7 technical support during Brahmotsavam and major religious events, as per the SLA specified in the Work Order.",
      "Planned maintenance windows will be communicated in advance via email or WhatsApp Business.",
    ],
  },
  {
    id: "third-party",
    heading: "Third-Party Services",
    body: [
      "Our platforms may integrate with third-party services such as WhatsApp Business API, cloud hosting, SMS gateways, and payment providers. Your use of those services is also subject to their respective terms.",
    ],
  },
  {
    id: "liability",
    heading: "Limitation of Liability",
    body: [
      "To the maximum extent permitted by law, Aatreya Infotech Systems LLP shall not be liable for any indirect, incidental, or consequential damages arising from use of our services.",
      "Our total liability for any claim shall not exceed the fees paid by the client to the Company for the specific engagement in the twelve months preceding the claim.",
    ],
  },
  {
    id: "termination",
    heading: "Termination",
    body: [
      "The Company reserves the right to suspend or terminate services in the event of material breach, non-payment, or unlawful conduct, subject to the terms of the applicable Work Order.",
    ],
  },
  {
    id: "governing-law",
    heading: "Governing Law & Jurisdiction",
    body: [
      "These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts at Tenali, Andhra Pradesh.",
    ],
  },
  {
    id: "contact-tc",
    heading: "Contact",
    body: [
      "For questions about these Terms, contact us at:",
      "Aatreya Infotech Systems LLP, D. No. 2-105, Edlapalli, Tenali – 522211, Andhra Pradesh, India. Phone: +91 86442 97366. Email: info@aatreya.co.in",
    ],
  },
];

export default function Terms() {
  return (
    <LegalPage
      testid="page-terms"
      eyebrow="Legal"
      title="Terms & Conditions"
      updated="04 December 2025"
      sections={sections}
    />
  );
}
