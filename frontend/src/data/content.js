export const COMPANY = {
  name: "Aatreya Infotech Systems LLP",
  short: "Aatreya",
  tagline: "Technology with Devotion. Innovation with Integrity.",
  established: "18 May 2021",
  heroTitle: "India's Trusted Digital Transformation Partner for Temples",
  heroSubtitle:
    "Building Smart Temple Ecosystems with Secure, Scalable & Innovative Technology.",
  heroIntro:
    "A Government-registered Indian Startup delivering enterprise-grade digital solutions for temples, religious institutions, government organizations, and public sector projects.",
  address: {
    line1: "D. No. 2-105, Edlapalli,",
    line2: "Tenali – 522211, Andhra Pradesh, India",
  },
  phone: "+91 86442 97366",
  emails: ["info@aatreya.co.in", "support@aatreyanews.in"],
  websites: [
    "www.aatreya.co.in",
    "www.aatreyanews.in",
    "www.aatreya.org",
    "www.aatreyaomnicloud.com",
  ],
};

export const NAV = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Projects", to: "/projects" },
  { label: "Products", to: "/products" },
  { label: "Technology", to: "/technology" },
  { label: "Media", to: "/media" },
  { label: "Careers", to: "/careers" },
  { label: "Contact", to: "/contact" },
];

export const SERVICES = [
  {
    key: "erp",
    title: "Temple ERP Solutions",
    desc: "Complete temple administration software for end-to-end operations across departments, finance, and services.",
    icon: "LayoutDashboard",
  },
  {
    key: "queue",
    title: "Queue Management Systems",
    desc: "Smart queue, slot, and token management for seamless devotee flow with real-time capacity monitoring.",
    icon: "Users",
  },
  {
    key: "id-pass",
    title: "Digital ID Pass Systems",
    desc: "Secure QR-enabled digital identity, verification, and access management for staff, vehicles, and darshan.",
    icon: "IdCard",
  },
  {
    key: "mobile",
    title: "Mobile Applications",
    desc: "Native Android and cloud-based applications for on-ground temple operations and verification.",
    icon: "Smartphone",
  },
  {
    key: "qr",
    title: "QR Code Technology",
    desc: "Advanced QR generation, secure verification, and anti-fraud tokenization for high-volume events.",
    icon: "QrCode",
  },
  {
    key: "whatsapp",
    title: "WhatsApp Business Platform",
    desc: "Automated devotee communication, seva notifications, donation receipts, and daily temple updates.",
    icon: "MessageCircle",
  },
  {
    key: "photo",
    title: "Photo Capture Ticketing",
    desc: "Instant photo-enabled ticket generation and verification for annadanam, sarees, and prasadam.",
    icon: "Camera",
  },
  {
    key: "cloud",
    title: "Cloud-Based Temple Management",
    desc: "Modern SaaS platforms with centralized, multi-temple administration on secure Azure infrastructure.",
    icon: "CloudCog",
  },
  {
    key: "dashboard",
    title: "Live Dashboards & Reports",
    desc: "Real-time analytics, operational reports, and administrative insights for informed decisions.",
    icon: "LineChart",
  },
];

export const PROJECTS = [
  {
    id: "dwaraka-tirumala",
    name: "Sri Venkateswara Swamy Temple",
    location: "Dwaraka Tirumala, Eluru District",
    order: "Work Order — REV65-ENGG0ELEC(EMIS)/3/2022-E2",
    status: "Successfully Running Since 2022",
    features: [
      "Free Annadanam Token System",
      "Photo Capture Ticketing",
      "Counter Management",
      "Live Dashboard",
      "Reporting System",
    ],
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da",
  },
  {
    id: "indrakeeladri",
    name: "Sri Durga Malleswara Swamy Temple",
    location: "Indrakeeladri, Vijayawada",
    order: "RC No: K2/891/2023",
    status: "Successfully Running",
    features: [
      "Vastra Prasadam Management",
      "Saree Photo Capture",
      "QR Code Generation",
      "Contractor Management",
      "Reporting System",
    ],
    image: "https://images.pexels.com/photos/12227013/pexels-photo-12227013.jpeg",
  },
  {
    id: "srisailam",
    name: "Sri Bhramaramba Mallikarjuna Swamy Temple",
    location: "Srisailam",
    order: "RC No: SBMSD-ADMNOENG/82/2025-SAD(SBMSD)",
    status: "Successfully Executed during 2025 & 2026 Brahmotsavam",
    features: [
      "Digital ID Pass System",
      "Vehicle Pass",
      "Darshan Pass",
      "Mobile Application",
      "QR Verification",
      "Live Dashboard",
      "Staff Management",
    ],
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220",
  },
  {
    id: "bhadrachalam",
    name: "Sri Seetharamachandra Swamy Temple",
    location: "Bhadrachalam",
    order: "RC No: K3/468/2018",
    status: "Successfully Running",
    features: [
      "Protocol Digitization",
      "Annadanam Photo Capture",
      "Saree Management",
      "Mobile Application",
      "WhatsApp Integration",
      "QR-Based Management",
    ],
    image: "https://images.unsplash.com/photo-1523731407965-2430cd12f5e4",
  },
  {
    id: "vemulawada",
    name: "Sri Raja Rajeshwara Swamy Temple",
    location: "Vemulawada",
    order: "RC No: ET/95/2026",
    status: "Successfully Running",
    features: [
      "WhatsApp Communication Platform",
      "Annadanam Ticketing",
      "Photo Capture System",
      "Seva Notifications",
      "Donation Messages",
      "Daily Temple Updates",
    ],
    image: "https://images.unsplash.com/photo-1567254790685-6b6d6abe4689",
  },
  {
    id: "pm-visit",
    name: "Hon'ble Prime Minister Visit",
    location: "Srisailam",
    order: "Government of India — Special Deployment",
    status: "Successfully Completed",
    features: [
      "Police Digital ID Pass System",
      "QR Security Passes",
      "Staff Management",
      "Vehicle Pass Management",
      "Digital Verification",
      "Live Dashboard",
    ],
    image: "https://images.pexels.com/photos/35322805/pexels-photo-35322805.jpeg",
    isSpecial: true,
  },
];

export const RECOGNITIONS = [
  {
    name: "MSME",
    label: "Ministry of Micro, Small & Medium Enterprises",
    sub: "Registered Enterprise",
    logo: "https://customer-assets.emergentagent.com/job_temple-cloud-ops/artifacts/mha2iq71_image.png",
  },
  {
    name: "DPIIT",
    label: "Department for Promotion of Industry & Internal Trade",
    sub: "Ministry of Commerce & Industry",
    logo: "https://customer-assets.emergentagent.com/job_temple-cloud-ops/artifacts/8i5yesr1_image.png",
  },
  {
    name: "Startup India",
    label: "Recognized under #startupindia",
    sub: "Government of India Initiative",
    logo: "https://customer-assets.emergentagent.com/job_temple-cloud-ops/artifacts/8io180f2_image.png",
  },
];

export const WHY_CHOOSE = [
  "Government Project Experience",
  "Successfully Implemented in Major Temples",
  "Proven Track Record",
  "Enterprise Cloud Architecture",
  "QR Technology Expertise",
  "Android & Web Applications",
  "WhatsApp Business Automation",
  "AI-Enabled Digital Solutions",
  "24×7 Technical Support",
  "Dedicated Temple Software Team",
  "Secure & Scalable Infrastructure",
  "Long-Term Technical Maintenance",
];

export const ECOSYSTEM = [
  "Temple ERP",
  "Queue Management",
  "Annadanam Management",
  "Darshan Management",
  "Temple Protocol Management",
  "Digital ID Pass",
  "Vehicle Pass",
  "QR Code Technology",
  "Photo Capture Systems",
  "WhatsApp Business Platform",
  "Android Applications",
  "Cloud Applications",
  "Live Dashboards",
  "AI Notifications",
  "Visitor Management",
  "Reports & Analytics",
];

export const VISION_POINTS = [
  "Faster Devotee Services",
  "Smart Queue Management",
  "Complete Transparency",
  "Digital Administration",
  "Secure QR Verification",
  "AI-Enabled Automation",
  "Cloud-Based Operations",
  "Mobile-First Experience",
  "Real-Time Analytics",
  "Paperless Temple Management",
];

export const TECH_STACK = [
  { name: "React", family: "Frontend" },
  { name: "Node.js", family: "Backend" },
  { name: "SQL Server", family: "Database" },
  { name: "Azure Cloud", family: "Cloud" },
  { name: "Android", family: "Mobile" },
  { name: "Progressive Web Apps", family: "Mobile" },
  { name: "REST APIs", family: "Integration" },
  { name: "QR Technology", family: "Security" },
  { name: "AI Integration", family: "Intelligence" },
  { name: "WhatsApp Business API", family: "Communication" },
  { name: "Real-Time Dashboards", family: "Analytics" },
  { name: "Cloud Infrastructure", family: "Cloud" },
];

export const ACHIEVEMENTS = [
  { value: "6+", label: "Major Temple Deployments" },
  { value: "10K+", label: "Devotees Served Daily" },
  { value: "99.9%", label: "Uptime on Cloud Systems" },
  { value: "2021", label: "Government-Registered" },
];
