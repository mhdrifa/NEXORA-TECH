import {
  ServiceItem,
  StatItem,
  FeatureKey,
  SolutionItem,
  TechItem,
  ProjectItem,
  CaseStudyItem,
  TestimonialItem,
  WorkflowStep,
  TeamMember,
  BlogPost,
  JobPosition
} from "./types";

export const servicesData: ServiceItem[] = [
  {
    id: "ai-solutions",
    title: "Artificial Intelligence Solutions",
    description: "Harness next-generation neural architectures, predictive model systems, and automated cognitive pipelines.",
    longDescription: "Our elite intelligence team designs and deploys customized Large Language Models (LLMs), machine learning agents, computer vision pipelines, and deep neural predictive engines designed to optimize strategic decision-making and automate workflows.",
    features: [
      "Custom LLM Fine-Tuning & RAG pipelines",
      "Predictive Analytics & Forecasting Models",
      "Computer Vision & NLP systems",
      "Agentic AI Automation Workflows"
    ],
    iconName: "Brain"
  },
  {
    id: "cloud-engineering",
    title: "Cloud Engineering",
    description: "Construct scalable, serverless, and cloud-native backbones across global hyperscaler frameworks.",
    longDescription: "We engineer resilient cloud multi-tenant infrastructures on AWS, Azure, and Google Cloud Platform. From high-availability microservices to dynamic autoscaling structures, we guarantee maximum performance and cost optimization.",
    features: [
      "Multi-Cloud & Hybrid architectures",
      "Serverless Deployment & Microservices",
      "Elastic Application Autoscaling",
      "Cloud Infrastructure Auditing & Optimization"
    ],
    iconName: "Cloud"
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity Systems",
    description: "Fortify your physical, digital, and intellectual assets against highly specialized threat vectors.",
    longDescription: "Deploy active Zero-Trust infrastructures, continuous posture monitoring, automated penetration testing routines, and end-to-end encrypted tunnels designed to neutralize critical enterprise security risks.",
    features: [
      "Zero-Trust Network Architectures",
      "Incident Detection, Response & Orchestration",
      "Corporate Cryptology & Identity Governance",
      "Continuous Web Application Penetration Testing"
    ],
    iconName: "ShieldCheck"
  },
  {
    id: "software-development",
    title: "Enterprise Software Dev",
    description: "Develop bulletproof, high-concurrency software services aligned with specific digital demands.",
    longDescription: "Our experienced engineering teams construct stable, long-term backend engines and high-volume systems that process millions of requests every second, built with absolute modularity and type-safety.",
    features: [
      "High-Concurrency backend APIs",
      "Enterprise Database Integration",
      "Event-Driven Microservices (Kafka/RabbitMQ)",
      "Continuous Structural Refactoring"
    ],
    iconName: "Code"
  },
  {
    id: "web-development",
    title: "Next-Gen Web Platforms",
    description: "Build incredibly fast, responsive, and secure digital storefronts and web portals.",
    longDescription: "Combining responsive, interactive user journeys with lightning-fast load scores, we craft state-of-the-art administrative consoles, e-commerce solutions, and digital corporate hubs.",
    features: [
      "Vite & NextJS Serverless setups",
      "Optimized Core Web Vitals",
      "Tailwind Responsive layout engines",
      "Highly accessible semantic DOM layers"
    ],
    iconName: "Cpu"
  },
  {
    id: "mobile-app-development",
    title: "Mobile App Development",
    description: "Launch native or cross-platform applications optimized for elegant mobile touch ecosystems.",
    longDescription: "We engineer smooth, high-fidelity iOS and Android applications utilizing React Native or Swift/Kotlin, keeping interfaces responsive, fluid, and fully capable of native device operations.",
    features: [
      "Cross-platform React Native / Flutter",
      "Native Apple iOS & Android SDKs",
      "Robust client-side synchronization & caching",
      "Optimal runtime memory efficiency"
    ],
    iconName: "Smartphone"
  },
  {
    id: "devops",
    title: "DevOps & SRE",
    description: "Establish robust, zero-downtime CI/CD deployment pipelines and auto-recovery environments.",
    longDescription: "We streamline release cadences by implementing fully automated testing, immutable environment deployments (IaC), container orchestrations, and comprehensive live logging layers.",
    features: [
      "Infrastructure under GitOps & Terraform",
      "Kubernetes Clustering & Scaling",
      "Automated Health-Check self-healing layers",
      "High-frequency build verification loops"
    ],
    iconName: "Terminal"
  },
  {
    id: "data-analytics",
    title: "Big Data & BI Solutions",
    description: "Convert chaotic, multi-source raw logs into beautiful, interactive, and actionable dashboards.",
    longDescription: "Deploy unified modern data pipelines and processing clusters using technologies like Kafka, Spark, and Postgres to expose predictive patterns, automated alerts, and detailed graphs.",
    features: [
      "Real-time event processing streams",
      "Advanced interactive business metrics",
      "ETL pipeline construction",
      "Anomalous pattern detection algorithms"
    ],
    iconName: "BarChart3"
  },
  {
    id: "ui-ux-design",
    title: "Premium UI/UX Design",
    description: "Formulate breathtaking, intuitive visual design languages and structured user testing logs.",
    longDescription: "We design spectacular high-fidelity digital user interfaces centered on clarity, responsiveness, and aesthetic minimalism, creating a cohesive visual design system that commands prestige.",
    features: [
      "Intuitive high-fidelity Figma typography blueprints",
      "Interactive component prototypes",
      "Accessible contrast levels & dark setups",
      "Framer flow motion animation designs"
    ],
    iconName: "Layers"
  }
];

export const statsData: StatItem[] = [
  { id: "projects", value: 500, suffix: "+", label: "Projects Completed", growth: "+42% YoY" },
  { id: "clients", value: 200, suffix: "+", label: "Active Global Clients", growth: "+18% YoY" },
  { id: "countries", value: 15, suffix: "+", label: "Countries Served", growth: "Global coverage" },
  { id: "satisfaction", value: 99, suffix: "%", label: "Client Satisfaction", growth: "Industry leading" },
  { id: "support", value: 24, suffix: "/7", label: "Dedicated Live Support", growth: "SLA Guaranteed" }
];

export const whyChooseUsData: FeatureKey[] = [
  {
    title: "Elite Industry Experts",
    description: "Work with elite architects, PhD AI researchers, and certified Cisco/Kubernetes/AWS engineers.",
    iconName: "Users"
  },
  {
    title: "Secure-by-Design Architecture",
    description: "Zero Trust networks and ISO 27001 cybersecurity frameworks integrated at baseline level.",
    iconName: "Shield"
  },
  {
    title: "Accelerated Delivery Cycles",
    description: "Launch features quickly and continuously with clean CI/CD setups and rapid iteration patterns.",
    iconName: "Zap"
  },
  {
    title: "Agile Development Methodology",
    description: "Stay perfectly synchronized on Slack and Jira through weekly demo reviews and transparent cycles.",
    iconName: "RefreshCw"
  },
  {
    title: "Cloud-Native Adaptability",
    description: "Build robust solutions that scale instantly to support millions of concurrent connections seamlessly.",
    iconName: "Server"
  },
  {
    title: "AI-Powered Advanced Research",
    description: "Incorporate specialized predictive model agents directly into core logic layers for automated insight.",
    iconName: "Sparkles"
  },
  {
    title: "Dedicated Technical Support",
    description: "Receive instant escalation responses under a clear Service Level Agreement (SLA).",
    iconName: "Headphones"
  },
  {
    title: "Global Compliance Protocols",
    description: "Develop fully compliant architectures under standards including HIPAA, GDPR, and SOC2.",
    iconName: "Globe"
  }
];

export const solutionsData: SolutionItem[] = [
  {
    id: "ai-automation",
    title: "OmniAgent AI Automation",
    subtitle: "AI Autonomous Agents",
    description: "A complete multi-agent system designed to replace repetitive corporate backoffice work and generate automated analytics.",
    metrics: "85% reduction in administrative overhead",
    benefits: [
      "Natural language analytical processing",
      "Autonomous calendar and file updating",
      "Automatic generation of formatted executive briefs",
      "Plug-and-play REST endpoints"
    ],
    gradient: "from-blue-600 via-indigo-600 to-accent",
    iconName: "Bot"
  },
  {
    id: "cloud-migration",
    title: "Nexora CloudForge",
    subtitle: "Hybrid Cloud Framework",
    description: "Modern automated toolsets that transition legacy on-premise relational architectures into secure, autoscaling Kubernetes clusters on AWS or Microsoft Azure.",
    metrics: "99.99% uptime with 40% cloud savings",
    benefits: [
      "Live data migration with zero record downtime",
      "Terraform-generated infrastructure state",
      "Autonomous container failure auto-restart",
      "Direct Prometheus monitoring overlays"
    ],
    gradient: "from-cyan-500 to-blue-700",
    iconName: "CloudLightning"
  },
  {
    id: "security-operations",
    title: "Nexora Bastion SEC-OPS",
    subtitle: "Active Intrusion Prevention Suite",
    description: "A dynamic cyber defensive perimeter combining real-time anomaly tracking with military-grade behavioral firewall structures.",
    metrics: "Zero breaches detected across all active deployments",
    benefits: [
      "AI-driven predictive attack pattern analytics",
      "Continuous network posture evaluation",
      "Instant incident log auditing mechanisms",
      "Automatic isolate sandbox execution"
    ],
    gradient: "from-red-600 to-rose-900",
    iconName: "ShieldAlert"
  },
  {
    id: "business-intelligence",
    title: "Analytics Hub & BI Dashboard",
    subtitle: "Advanced Corporate Intelligence",
    description: "Interactive data pipeline that aggregates disparate marketing, operational, and financial databases into custom high-performance live visualizations.",
    metrics: "Over $12M of optimized spending unlocked",
    benefits: [
      "Clean visual d3 charts with latency below 50ms",
      "Configurable automatic anomaly report triggers",
      "Multi-platform database connectors (Postgre, SQL Server, Snowflake)",
      "Instant PDF format spreadsheet exports"
    ],
    gradient: "from-emerald-500 to-cyan-600",
    iconName: "PieChart"
  },
  {
    id: "saas-development",
    title: "CoreSaaS HyperScale Booster",
    subtitle: "Scalable SaaS Blueprint",
    description: "Our proprietary, pre-engineered enterprise boilerplate enabling startups and organizations to spin up modern multi-tenant apps with billing, roles, analytics, and security from Day One.",
    metrics: "Average launch schedule reduced by 14 weeks",
    benefits: [
      "Pre-integrated secure Firebase authentication setup",
      "Configurable Stripe tiered recurring payment hooks",
      "Clean UI component layout with responsive panels",
      "Comprehensive TypeScript absolute type checks"
    ],
    gradient: "from-purple-600 via-violet-700 to-blue-900",
    iconName: "Component"
  },
  {
    id: "enterprise-applications",
    title: "Aegis Enterprise ERP Enterprise Suite",
    subtitle: "Integrated Core Business System",
    description: "High-volume centralized ecosystem connecting procurement patterns, real-time inventory assets, manufacturing plans, and worldwide delivery logistics.",
    metrics: "8.6x inventory utility score increase",
    benefits: [
      "Robust transactional PostgreSQL backing",
      "Optimized mobile warehouse tablet compatibility",
      "Live global geolocation container reporting",
      "Legacy SAP / Salesforce background synchronizers"
    ],
    gradient: "from-indigo-600 to-blue-800",
    iconName: "Briefcase"
  }
];

export const techStackData: TechItem[] = [
  // Frontend
  { name: "React", category: "frontend", iconName: "React", proficiency: 98, description: "Declarative component structures and active react hooks." },
  { name: "Next.js", category: "frontend", iconName: "Next", proficiency: 94, description: "Server-side rendering frameworks and optimized metadata assets." },
  { name: "Vue", category: "frontend", iconName: "Vue", proficiency: 80, description: "Reactive view structures and clean modern layouts." },
  
  // Backend
  { name: "Node.js (TS)", category: "backend", iconName: "Node", proficiency: 96, description: "Type-safe asynchronous server API gateways built over Express." },
  { name: ".NET Core", category: "backend", iconName: "DotNet", proficiency: 84, description: "Cross-platform high-performance enterprise API foundations." },
  { name: "Python", category: "backend", iconName: "Python", proficiency: 90, description: "Data manipulation systems and deep AI pipeline controls." },
  
  // Databases
  { name: "PostgreSQL", category: "database", iconName: "Postgres", proficiency: 95, description: "Reliable relational queries and raw JSON database indices." },
  { name: "MongoDB", category: "database", iconName: "Mongo", proficiency: 88, description: "Document aggregation patterns and horizontal scaling arrays." },
  { name: "SQL Server", category: "database", iconName: "SqlServer", proficiency: 82, description: "Optimized corporate financial schemas and historical records." },
  
  // Cloud
  { name: "Microsoft Azure", category: "cloud", iconName: "Azure", proficiency: 92, description: "Active Directory, Azure Kubernetes Service and secure networking." },
  { name: "Amazon AWS", category: "cloud", iconName: "Aws", proficiency: 96, description: "EC2 architectures, RDS clusters, IAM locks, and CloudFront CDNs." },
  { name: "Google Cloud (GCP)", category: "cloud", iconName: "Gcp", proficiency: 93, description: "BigQuery telemetry, Cloud Run serverless hosting, and Firestore." },
  
  // DevOps
  { name: "Docker", category: "devops", iconName: "Docker", proficiency: 95, description: "Homogeneous container definitions for seamless local debugging." },
  { name: "Kubernetes", category: "devops", iconName: "Kubernetes", proficiency: 90, description: "Multi-node auto-recovery pod orchestrations on cloud services." },
  { name: "Terraform", category: "devops", iconName: "Terraform", proficiency: 88, description: "Declarative Infrastructure-as-Code (IaC) asset tracking." }
];

export const portfolioData: ProjectItem[] = [
  {
    id: "proj-1",
    title: "NeuroCore AI Medical Imaging",
    category: "ai",
    description: "Deep neural diagnostic app capable of highlighting microscopic tissue lesions from MRI scans in less than 30 seconds with 99.4% accuracy.",
    details: "Built in partnership with a leading global health organization, this solution utilizes specialized convolutional vision models orchestrated via cloud worker clusters to safely isolate target areas, complying with strict HIPAA laws.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
    tech: ["Python", "PyTorch", "Kubernetes", "React", "GCP"],
    metrics: "99.4% accuracy rate / HIPAA Compliant",
    demoUrl: "#projects"
  },
  {
    id: "proj-2",
    title: "ApexPay Decentralized Fintech Portal",
    category: "web",
    description: "High-frequency administrative portal handling over 40,000 global transactions per minute with millisecond settlement confirmations.",
    details: "This web console integrates complete multi-signature verification, localized currency translation rates, customizable balance sheets, and real-time fraud forecasting algorithms.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    tech: ["React", "Typescript", "Node.js", "PostgreSQL", "AWS"],
    metrics: "40k trx/min / 12ms active response",
    demoUrl: "#projects"
  },
  {
    id: "proj-3",
    title: "Vigilance Fleet Geolocation System",
    category: "mobile",
    description: "High-density cross-platform mobile tracking system utilized by over 800 transport vehicles across continental shipping routes.",
    details: "Implements hyper-optimized offline path calculation mechanisms, native background tracking timers, smart push-alert notifications, and optimized battery-saver algorithms.",
    image: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=800&q=80",
    tech: ["React Native", "Node.js", "MongoDB", "Google Maps API"],
    metrics: "800+ Active Vehicles / 30% battery improvement",
    demoUrl: "#projects"
  },
  {
    id: "proj-4",
    title: "Aetherial Multi-Cloud Vault Cluster",
    category: "cloud",
    description: "Automated distributed backup architecture spanning Azure, AWS, and GCP simultaneously to achieve 100% data access uptime.",
    details: "This cloud asset splits enterprise files into secure, sharded blocks across independent regions with end-to-end cryptographic key verification, rendering database hacking impossible.",
    image: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=800&q=80",
    tech: ["Terraform", "Docker", "Kubernetes", "AWS", "Azure", "GCP"],
    metrics: "100% access availability guaranteed",
    demoUrl: "#projects"
  },
  {
    id: "proj-5",
    title: "Centurion Retail ERP Operations Tool",
    category: "enterprise",
    description: "Scalable supply pipeline suite tracking global stock levels across 400 large retail stores in real-time.",
    details: "An elite administrative console featuring automated purchase ordering pipelines, intelligent delivery truck routing systems, and complete inventory forecasting dashboards.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    tech: ["React", ".NET Core", "Sql Server", "Docker", "Azure"],
    metrics: "$14M savings managed annually",
    demoUrl: "#projects"
  },
  {
    id: "proj-6",
    title: "SentientBot Autonomous Legal Arbitrage",
    category: "ai",
    description: "Deep text compliance analysis agent parsing 3,000-page corporate agreements in 5 seconds to highlight critical liability risks.",
    details: "Using fine-tuned transformer networks, this app highlights hidden cost exposure metrics and generates legal-compliant alternative drafts that are immediately ready for signature.",
    image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80",
    tech: ["Python", "GPT-4 API", "Pinecone DB", "React", "Node.JS"],
    metrics: "94% review speed improvement",
    demoUrl: "#projects"
  }
];

export const caseStudiesData: CaseStudyItem[] = [
  {
    id: "case-1",
    title: "Global Logistics Leader Transforms Operations via Nexora CloudForge",
    client: "TransitLink Logistics Corp",
    challenge: "TransitLink suffered from repeated critical outages during black Friday high-traffic surges. Their monolithic database platform could not autoscale, leading to lost transactions and server crashes.",
    solution: "Nexora migrated their systems into modular Docker containers microservices orchestration on Azure Kubernetes Service (AKS) managed via Terraform. Implemented dynamic database read-replicas and smart Redis caching layers.",
    result: "Achieved 100% system uptime during subsequent peak holiday traffic events. Database request processing delays dropped from 2400ms down to a flat 14ms.",
    metrics: "Zero Downtime achieved, 45% lower database costs",
    industry: "Logistics & Transport",
    duration: "4 Months"
  },
  {
    id: "case-2",
    title: "Fintech Platform Secures Enterprise Compliance via Bastion SecOps",
    client: "PayHelix Financial Systems",
    challenge: "PayHelix needed a rapid, bulletproof system audit to secure high-tier SOC2 and PCI-DSS compliance before launching their corporate loan facility.",
    solution: "Nexora integrated our modern Bastion Cybersecurity Suite. We conducted complete security mapping, designed Zero-Trust multi-sig administrative approvals, and established audited event logging trails.",
    result: "PayHelix passed their SOC2 Type II compliance audit on the first attempt with zero security highlights. Secured $400M in subsequent venture capital deployment.",
    metrics: "SOC2 Compliance passed, 0 security anomalies detected",
    industry: "Fintech",
    duration: "2 Months"
  },
  {
    id: "case-3",
    title: "Automated OmniAgent AI Optimizes Procurement and Reduces Costs",
    client: "Aerospace Composites International",
    challenge: "Manual supply logging was slow and prone to errors. Procurement agents spent 80% of their working hours parsing pricing tables from emails and filling spreadsheets manually.",
    solution: "We deployed an autonomous AI Procurement agent that automatically reads supplier files and updates internal Postgres tables with deep parsing capabilities.",
    result: "Transformed inventory updates. Procurement managers now spend less than 15 minutes a day reviewing beautiful pre-populated supply queues.",
    metrics: "95% operational overhead drop, $3M saved yearly",
    industry: "Aerospace Manufacturing",
    duration: "3 Months"
  }
];

export const testimonialsData: TestimonialItem[] = [
  {
    id: "t-1",
    name: "Dr. Amanda Ross",
    role: "Chief Technology Officer",
    company: "Sirona Health Systems",
    content: "Nexora Tech's engineering precision is unmatched. They succeeded in delivering a fully compliant, production-grade AI medical model in 3 months where others struggled for over a year.",
    stars: 5,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "t-2",
    name: "Marcus Vance",
    role: "VP of Cloud Architecture",
    company: "Apex Global Finance",
    content: "We migrated our core microservices using Nexora's CloudForge. The infrastructure setup is beautifully clean, utilizing Terraform and flawless Kubernetes state management that runs itself.",
    stars: 5,
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "t-3",
    name: "Elena Rostova",
    role: "Director of Product Engineering",
    company: "Veloce SaaS Mobility",
    content: "The custom dashboard design and frontend setup Nexora built is outstanding. It is ultra-responsive, works cleanly on mobile touchpads, and loads in less than a second.",
    stars: 5,
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "t-4",
    name: "Richard K. Cho",
    role: "SVP of Cybersecurity Operations",
    company: "Insignia Defense Technologies",
    content: "Bastion SEC-OPS from Nexora Tech has successfully defended our administrative portals from over 1,400 active penetration scans. It's the standard of enterprise defense.",
    stars: 5,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80"
  }
];

export const processWorkflow: WorkflowStep[] = [
  {
    stepNumber: 1,
    title: "1. Advanced Discovery Phase",
    description: "Evaluate active bottlenecks, map technical systems, and document compliance constraints.",
    details: "In this weekly discovery scope, our principal enterprise architects audit your platform capabilities, catalog database schemas, and align objectives with target metrics.",
    milestone: "Discovery Brief & Blueprint Strategy draft",
    iconName: "SearchCode"
  },
  {
    stepNumber: 2,
    title: "2. Strategic Architectural Planning",
    description: "Design cloud structural layouts, network diagrams, and choose modular technology stacks.",
    details: "Create custom Docker setup maps, model fine-tuning architectures, database scaling diagrams, and outline security plans designed to meet SOC2 standard levels.",
    milestone: "Approved Cloud Network Blueprint & Sprint Schedule",
    iconName: "Compass"
  },
  {
    stepNumber: 3,
    title: "3. Collaborative UI/UX Figma Design",
    description: "Prepare professional typography layout sheets, mobile system views, and dark/light components.",
    details: "Formulate beautiful interactive visual layouts. Every component is tested across responsive breakpoints to guarantee intuitive and elegant click pathways.",
    milestone: "High-Fidelity Interactive Figma Prototype & Design System",
    iconName: "Palette"
  },
  {
    stepNumber: 4,
    title: "4. Full-Scale Software Development",
    description: "Write bulletproof TypeScript, Python, or Go code backed by robust local verification sets.",
    details: "Our developers build services incrementally on separate staging branches. Every single pull request undergoes strict automated compilation tests and peer reviews.",
    milestone: "Clean code packages merged to continuous staging main Branch",
    iconName: "Braces"
  },
  {
    stepNumber: 5,
    title: "5. Rigorous Automated QA Testing",
    description: "Execute automated backend integration, payload stress modeling, and cybersecurity audits.",
    details: "Run automated security checks, responsive element sizing monitors, and memory optimization scans to guarantee lightning-fast load times across high-volume environments.",
    milestone: "Complete Quality Verification Report & Security Audit Seal",
    iconName: "ShieldAlert"
  },
  {
    stepNumber: 6,
    title: "6. Immutable Cloud Deployment",
    description: "Execute zero-downtime Blue-Green releases and configure persistent active log captures.",
    details: "Using GitOps routines, the deployment script compiles production packages and triggers Kubernetes blue-green updates, ensuring zero disruption for active customers.",
    milestone: "Productive Deployment on Cloud Ingress running on live domains",
    iconName: "Rocket"
  },
  {
    stepNumber: 7,
    title: "7. Proactive Support & Optimizations",
    description: "Continuous database indexing, monitoring metric alerts, and priority dev responses.",
    details: "Our dedicated support team listens for performance alerts, optimizes query pipelines, audits server utility targets, and responds rapidly under active SLAs.",
    milestone: "Monthly Engineering Audits & Continuous Live Security Reviews",
    iconName: "Fingerprint"
  }
];

export const teamMembers: TeamMember[] = [
  {
    id: "tm-1",
    name: "Dr. Evelyn Archer",
    role: "Chief Executive Officer & Founder",
    bio: "Former AI Principal Director at DeepMind and Stanford Computer Science Alumna with 15+ years leading high-performance scalable engineering groups.",
    iconName: "Award",
    linkedin: "https://linkedin.com",
    expertise: ["AI Governance", "Strategic Scale", "Venture Growth"],
    photoSeed: "evelyn"
  },
  {
    id: "tm-2",
    name: "Victor Sterling",
    role: "Chief Technology Officer",
    bio: "Kubernetes system contributor, former Senior Staff Infrastructure Architect at Vercel, and author of automated cloud autoscaling procedures.",
    iconName: "Cpu",
    linkedin: "https://linkedin.com",
    expertise: ["K8s Clusters", "High Concurrency", "Terraform IaC"],
    photoSeed: "victor"
  },
  {
    id: "tm-3",
    name: "Sarah Lin",
    role: "Principal AI Research Scientist",
    bio: "PhD in Neural Systems from MIT. Developed specialized vision-language transformers and deep reinforcement agents for industrial systems.",
    iconName: "BrainCircuit",
    linkedin: "https://linkedin.com",
    expertise: ["Fine-tuning Transformers", "PyTorch", "Cognitive Workflow"],
    photoSeed: "sarah"
  },
  {
    id: "tm-4",
    name: "Major Arthur Pendelton",
    role: "Head of Cybersecurity Operations",
    bio: "12 years in cyber-reconnaissance with defense departments. Certified CISSP and expert planner of active defensive response systems.",
    iconName: "ShieldAlert",
    linkedin: "https://linkedin.com",
    expertise: ["Zero Trust", "Threat Isolation", "SOC2 Readiness"],
    photoSeed: "arthur"
  },
  {
    id: "tm-5",
    name: "Nico Bellini",
    role: "Director of Interactive UI/UX Design",
    bio: "Award-winning visual developer and designer specialized in high-performance WebGL platforms and minimalist interface models.",
    iconName: "Paintbrush",
    linkedin: "https://linkedin.com",
    expertise: ["Responsive Systems", "Design Systems", "Framer Micro-Animations"],
    photoSeed: "nico"
  }
];

export const blogPosts: BlogPost[] = [
  {
    id: "blog-1",
    title: "Fine-Tuning Domain-Specific LLMs: The 2026 Enterprise Blueprint",
    slug: "finetuning-llms-2026",
    category: "AI News",
    summary: "Why generalized generic models fail corporate operations, and how to configure high-response Retrieval-Augmented Generation (RAG) datasets safely.",
    content: "Deploying general-purpose commercial API calls often fails key constraints in highly regulated environments. This deep analytical overview tracks hardware memory configurations, modern quantization formulas, and how semantic vector databases can isolate core customer records without leaking commercial information into public data systems.",
    publishedAt: "June 18, 2026",
    readTime: "6 Min Read",
    author: {
      name: "Sarah Lin",
      role: "Principal AI Scientist"
    },
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "blog-2",
    title: "Achieving Zero Trust: Securing Kubernetes Nodes on Multi-Cloud Networks",
    slug: "kubernetes-zerotrust-multicloud",
    category: "Cloud Engineering",
    summary: "Step-by-step tutorial on blocking lateral developer system attacks and configuring secure mutual TLS authentication on internal clusters.",
    content: "Securing modern multi-region pods requires more than standard firewall protection. By designing strict Envoy service-mesh protocols and automating rotating cryptographic identity passes, technology organizations can safely contain breaches to a single node and secure compliance audits.",
    publishedAt: "June 12, 2026",
    readTime: "8 Min Read",
    author: {
      name: "Victor Sterling",
      role: "Chief Technology Officer"
    },
    image: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "blog-3",
    title: "Behind the Screen: Crafting Breathtaking High-Performance WebGL UX Patterns",
    slug: "webgl-highperformance-ux-patterns",
    category: "Insights",
    summary: "How to marry smooth 60fps animations with responsive design layout systems without overloading standard mobile phone GPUs.",
    content: "Stunning modern SaaS tools shouldn't compromise performance. In this article, Nico discusses modular sprite optimization, smart CSS layer hardware accelerations, and dynamic viewport calculations that ensure animations feel fluid and load instantly across all devices.",
    publishedAt: "May 28, 2026",
    readTime: "5 Min Read",
    author: {
      name: "Nico Bellini",
      role: "Director of UI/UX"
    },
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "blog-4",
    title: "SOC 2 Type II Auditing: Avoid These Five Critical Infrastructure Gaps",
    slug: "soc2-compliance-avoid-gaps",
    category: "Cybersecurity",
    summary: "Simple mistakes in developer logging access and API rotation scopes that repeatedly delay venture audit schedules.",
    content: "Passing security reviews easily comes down to pre-planned organization behavior. Learn how setting up automated rotation logs, setting up robust read privileges, and implementing quick sandbox tests beforehand can save your organization months of administrative delays.",
    publishedAt: "May 15, 2026",
    readTime: "7 Min Read",
    author: {
      name: "Major Arthur Pendelton",
      role: "Head of Cyber Operations"
    },
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80"
  }
];

export const openCareers: JobPosition[] = [
  {
    id: "job-1",
    title: "Senior Cloud Infrastructure Architect",
    department: "Cloud Engineering Division",
    location: "Global Remote / Sri Lanka Office",
    type: "Full-Time",
    salary: "$180,000 - $220,000 + Equity",
    description: "Lead the design of hyper-available, multi-tenant Kubernetes networks and Terraform infrastructure definitions for our Fortune 100 enterprise clients.",
    requirements: [
      "7+ years experience in senior Cloud and Systems Engineering positions",
      "Deep practical command over Kubernetes clustering, ingress routing, and SDN setups",
      "Certified Solutions Architect status across AWS or Microsoft Azure",
      "Proficient script commands in Go, Python, or shell platforms"
    ],
    benefits: [
      "100% company-paid medical, dental, and vision insurance profiles",
      "Generous yearly tech workstation allowance ($5,000 budget)",
      "Uncapped Paid Time Off with minimum 4 weeks mandated yearly",
      "Collaborative research publications sponsorships"
    ]
  },
  {
    id: "job-2",
    title: "Machine Learning Solutions Engineer",
    department: "Applied AI Labs",
    location: "Puttalam HQ / Hybrid",
    type: "Full-Time",
    salary: "$160,000 - $195,000 + Equity",
    description: "Bridge the gap between model prototyping and scalable production. Optimize fine-tuned transformer weights, set up RAG vector data pipelines, and deploy secure microservices integrations.",
    requirements: [
      "3+ years building and deploying deep learning pipelines in PyTorch / HuggingFace",
      "Solid engineering skill with Python backend engines and SQL databases",
      "Proven history optimizing local AI pipelines for CUDA / GPU clusters",
      "Exceptional communication skills for enterprise integration syncs"
    ],
    benefits: [
      "Daily gourmet chef-prepared lunch and espresso bars",
      "Annual conference and AI research travel sponsorships",
      "Full 401k match program up to 6% baseline",
      "Stock option grants in high-growth startup environment"
    ]
  },
  {
    id: "job-3",
    title: "Graduate Cybersecurity Internship",
    department: "Bastion Defensive Lab Unit",
    location: "Global Remote",
    type: "Internship",
    salary: "$45 - $60 / Hour (Paid Contract)",
    description: "Work directly under military intelligence veterans executing web penetration routines, checking docker images for CVEs, and writing automated vulnerability tests.",
    requirements: [
      "Current student or recent graduate in Computer Science or Cybersecurity",
      "Command of standard routing targets, web protocols, and encryption models",
      "Basic understanding of Linux system security rules and CLI utilities",
      "Passionate interest in active ethical system hacking"
    ],
    benefits: [
      "Mentorship from certified CISSP experts",
      "Fully covered OSCP or Security+ certification training courses",
      "Dedicated placement track for subsequent full-time engineering career",
      "Weekly team-building virtual gaming and code challenge challenges"
    ]
  }
];
