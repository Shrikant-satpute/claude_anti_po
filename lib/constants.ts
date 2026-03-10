// Exporting constants for the portfolio data


export const COLORS = {
  background: '#050508',
  primary: '#6C63FF', // electric indigo
  secondary: '#00F5FF', // neon cyan
  tertiary: '#9D4EDD', // violet purple
  surfaceGlass: 'rgba(255,255,255,0.05)',
  textPrimary: '#FFFFFF',
  textMuted: '#8888AA',
};

export const TECH_COLORS = {
  dotNet: '#512BD4',
  angular: '#DD0031',
  postgresql: '#336791',
  azure: '#0078D4',
  python: '#FFD43B',
  docker: '#2496ED',
  devops: '#FF6B35',
  claude: '#7C3AED',
  csharp: '#239120',
  js: '#F7DF1E',
  html: '#E34F26',
  css: '#1572B6',
};

export const TYPEWRITER_TEXTS = [
  'Full-Stack .NET Developer',
  'AI Systems Builder',
  'Cloud & DevOps Engineer',
  'PostgreSQL Architect',
];

export const SKILLS_CONSTELLATION = [
  // Backend Cluster (Center)
  { id: 'dotnet', label: '.NET 9', group: 'backend', color: TECH_COLORS.dotNet },
  { id: 'csharp', label: 'C#', group: 'backend', color: TECH_COLORS.csharp },
  { id: 'aspnet', label: 'ASP.NET Core', group: 'backend', color: TECH_COLORS.dotNet },
  { id: 'webapi', label: 'Web API', group: 'backend', color: TECH_COLORS.dotNet },
  { id: 'efcore', label: 'Entity Framework', group: 'backend', color: TECH_COLORS.dotNet },
  { id: 'sk', label: 'Semantic Kernel', group: 'backend', color: TECH_COLORS.dotNet },
  // Database Cluster
  { id: 'postgres', label: 'PostgreSQL', group: 'database', color: TECH_COLORS.postgresql },
  { id: 'sqlserver', label: 'SQL Server', group: 'database', color: TECH_COLORS.postgresql },
  { id: 'adonet', label: 'ADO.NET', group: 'database', color: TECH_COLORS.dotNet },
  { id: 'linq', label: 'LINQ', group: 'database', color: TECH_COLORS.dotNet },
  // Frontend Cluster
  { id: 'angular', label: 'Angular 17+', group: 'frontend', color: TECH_COLORS.angular },
  { id: 'ts', label: 'TypeScript', group: 'frontend', color: COLORS.secondary },
  { id: 'html', label: 'HTML5', group: 'frontend', color: TECH_COLORS.html },
  { id: 'css', label: 'CSS3', group: 'frontend', color: TECH_COLORS.css },
  { id: 'bootstrap', label: 'Bootstrap', group: 'frontend', color: '#7952B3' },
  { id: 'jquery', label: 'jQuery', group: 'frontend', color: '#0769AD' },
  // Cloud/AI Cluster
  { id: 'openai', label: 'Azure OpenAI', group: 'cloud-ai', color: TECH_COLORS.azure },
  { id: 'azure', label: 'Azure', group: 'cloud-ai', color: TECH_COLORS.azure },
  { id: 'docker', label: 'Docker', group: 'cloud-ai', color: TECH_COLORS.docker },
  { id: 'devops', label: 'DevOps', group: 'cloud-ai', color: TECH_COLORS.devops },
  { id: 'claude', label: 'Claude AI', group: 'cloud-ai', color: TECH_COLORS.claude },
  { id: 'mcp', label: 'MCP Servers', group: 'cloud-ai', color: COLORS.secondary },
  // Tools Cluster
  { id: 'git', label: 'Git', group: 'tools', color: '#F05032' },
  { id: 'vscode', label: 'Visual Studio', group: 'tools', color: '#5C2D91' },
  { id: 'postman', label: 'Postman', group: 'tools', color: '#FF6C37' },
  { id: 'pgadmin', label: 'pgAdmin', group: 'tools', color: TECH_COLORS.postgresql },
];

export const EXPERIENCE_TIMELINE = [
  {
    role: 'Trainee Engineer',
    company: 'LandMark TechEdge Pvt. Ltd.',
    period: 'Oct 2022 – Mar 2023',
    location: 'Pune',
    bullets: [
      'Learned enterprise .NET development patterns',
      'Assisted in database modeling and stored procedure creation',
      'Contributed to UI development with HTML/CSS/jQuery',
    ],
    tech: ['C#', '.NET', 'SQL Server', 'HTML', 'CSS', 'jQuery'],
  },
  {
    role: 'Software Engineer',
    company: 'LandMark TechEdge Pvt. Ltd.',
    period: 'Aug 2023 – May 2025',
    location: 'Pune',
    bullets: [
      'Built full-stack enterprise web applications using C# and ASP.NET',
      'Developed RESTful Web APIs with action and exception filters',
      'Complex SQL Server stored procedures, functions, triggers',
      'Implemented ADO.NET data access with LINQ providers',
      'HTML5/CSS3/Bootstrap responsive interfaces',
      'Agile/SCRUM methodology, Git code management',
    ],
    tech: ['C#', 'ASP.NET', 'SQL Server', 'ADO.NET', 'Bootstrap', 'Git'],
  },
  {
    role: 'Software Engineer',
    company: 'Saeculum Solutions Pvt. Ltd.',
    period: 'Jun 2025 – Present',
    location: 'Ahmedabad',
    bullets: [
      'Building enterprise-grade SaaS platform with .NET 9 and Angular 17+',
      'Designing microservices architecture for workforce management modules',
      'Integrated Azure OpenAI and Semantic Kernel for AI-driven chat features',
      'PostgreSQL database design with complex queries and optimization',
      'Implemented RAG pipeline for intelligent knowledge base responses',
    ],
    tech: ['.NET 9', 'Angular 17+', 'PostgreSQL', 'Azure OpenAI', 'Semantic Kernel', 'Docker'],
  },
];

export const PROJECTS = [
  {
    title: 'IQCheckPoint — Workforce SaaS',
    role: 'Developer',
    stack: '.NET 9, Angular 17+, PostgreSQL, Azure OpenAI',
    gradient: 'from-violet-500 to-cyan-500',
    highlights: [
      'Enterprise workforce management SaaS with microservices architecture',
      'Azure OpenAI + Semantic Kernel for natural language workforce queries',
      'RAG pipeline with intelligent knowledge base and context-aware responses',
      'Scalable modules for scheduling, timesheets, forms and reporting',
    ],
  },
  {
    title: 'ERP EduTech School Management',
    role: 'Developer',
    stack: 'C#, ASP.NET MVC, SQL Server, Bootstrap',
    gradient: 'from-indigo-500 to-purple-600',
    highlights: [
      'Reduced paperwork by 60% with all-in-one school management',
      'Automatic receipt generation for cash/check/bank transfers',
      'Communication tools boosted on-time fee payments by 25%',
      'Real-time dashboards for staff and management',
    ],
  },
  {
    title: 'Agrotourism Booking Platform',
    role: 'Developer',
    stack: 'C#, ASP.NET MVC, SQL Server, jQuery',
    gradient: 'from-green-400 to-teal-500',
    highlights: [
      'Farm listing and activity management for farm owners',
      'Tourist booking system with packages, payments, reviews',
      'Analytics dashboard: bookings, revenue, popular farms',
    ],
  },
  {
    title: 'HRMantra',
    role: 'Developer',
    stack: 'C#, WinForms, ADO.NET, SQL Server',
    gradient: 'from-orange-400 to-red-500',
    highlights: [
      'Full applicant tracking from contact to hire',
      'Interview scheduling and status dashboards',
      'Role-based screens for HR staff and assistants',
    ],
  },
];

export const CURRENT_PROJECT = {
  title: 'IQCheckPoint — Workforce Management SaaS',
  subtitle: 'Currently building • .NET 9 • Angular 17+ • PostgreSQL',
  features: [
    {
      title: 'AI Chat Intelligence',
      description: 'Azure OpenAI + Semantic Kernel integration for natural language workforce queries',
      icon: 'Brain', // String identifier, mapping to Lucide component later
    },
    {
      title: 'Microservices Architecture',
      description: 'Scalable enterprise modules for scheduling, timesheets, forms, reporting',
      icon: 'Blocks',
    },
    {
      title: 'RAG Pipeline',
      description: 'Knowledge base with intelligent context-aware responses',
      icon: 'DatabaseZap',
    },
  ],
};
