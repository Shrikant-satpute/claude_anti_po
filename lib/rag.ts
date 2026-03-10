// RAG Pipeline — chunks portfolio data, retrieves relevant context per query

type Chunk = { id: string; category: string; text: string; keywords: string[] };

const CHUNKS: Chunk[] = [
    {
        id: 'about',
        category: 'About',
        text: 'Shrikant Satpute is a Full-Stack Software Engineer with 2+ years of experience based in Ahmedabad, India. He is passionate about AI-driven coding, building intelligent systems, and the future of AI. He is currently available for new opportunities. Contact: satpute.connect@gmail.com, LinkedIn: linkedin.com/in/shrikant.',
        keywords: ['about', 'who', 'shrikant', 'contact', 'email', 'linkedin', 'location', 'available', 'hire', 'experience', 'years'],
    },
    {
        id: 'skills',
        category: 'Skills',
        text: 'Skills — Backend: .NET 9, C#, ASP.NET Core, Web API, Entity Framework Core, Semantic Kernel. Database: PostgreSQL, SQL Server, ADO.NET, LINQ. Frontend: Angular 17+, TypeScript, HTML5, CSS3, Bootstrap, jQuery. Cloud & AI: Azure OpenAI, Azure, Docker, DevOps, Claude AI, MCP Servers. Tools: Git, Visual Studio, Postman, pgAdmin.',
        keywords: ['skills', 'tech', 'technology', 'stack', 'languages', 'tools', 'dotnet', 'angular', 'postgresql', 'azure', 'docker', 'csharp', 'typescript', 'expertise', 'knows', 'familiar'],
    },
    {
        id: 'exp_trainee',
        category: 'Experience',
        text: 'Trainee Engineer at LandMark TechEdge Pvt. Ltd. (Oct 2022 – Mar 2023, Pune). Learned enterprise .NET development patterns, assisted in database modeling and stored procedure creation, contributed to UI with HTML/CSS/jQuery.',
        keywords: ['trainee', 'landmark', 'first job', 'pune', '2022', '2023', 'junior', 'intern'],
    },
    {
        id: 'exp_landmark',
        category: 'Experience',
        text: 'Software Engineer at LandMark TechEdge Pvt. Ltd. (Aug 2023 – May 2025, Pune). Built full-stack enterprise web applications with C# and ASP.NET, developed RESTful Web APIs, wrote complex SQL Server stored procedures, implemented ADO.NET with LINQ, built responsive UI with Bootstrap. Followed Agile/SCRUM with Git.',
        keywords: ['landmark', 'software engineer', 'pune', '2023', '2024', '2025', 'aspnet', 'webapi', 'restful', 'agile', 'scrum', 'experience', 'job', 'work'],
    },
    {
        id: 'exp_saeculum',
        category: 'Experience',
        text: 'Software Engineer at Saeculum Solutions Pvt. Ltd. (Jun 2025 – Present, Ahmedabad). Building enterprise SaaS with .NET 9 and Angular 17+, designing microservices architecture, integrating Azure OpenAI and Semantic Kernel for AI chat, PostgreSQL database design, and implementing a RAG pipeline for intelligent knowledge base responses.',
        keywords: ['saeculum', 'current', 'present', 'ahmedabad', '2025', 'dotnet9', 'angular17', 'microservices', 'saas', 'ai', 'openai', 'rag', 'postgresql', 'current job', 'working'],
    },
    {
        id: 'project_iqcheckpoint',
        category: 'Project',
        text: 'IQCheckPoint — Workforce SaaS (current project). Stack: .NET 9, Angular 17+, PostgreSQL, Azure OpenAI. Enterprise workforce management with microservices architecture. Azure OpenAI + Semantic Kernel for natural language queries. RAG pipeline for context-aware knowledge base responses. Modules for scheduling, timesheets, forms, reporting.',
        keywords: ['iqcheckpoint', 'workforce', 'saas', 'current', 'ai', 'rag', 'openai', 'microservices', 'scheduling', 'timesheets', 'project'],
    },
    {
        id: 'project_edutech',
        category: 'Project',
        text: 'ERP EduTech School Management. Stack: C#, ASP.NET MVC, SQL Server, Bootstrap. Reduced paperwork by 60%. Automatic receipt generation for cash/check/bank transfers. Communication tools boosted on-time fee payments by 25%. Real-time dashboards for staff and management.',
        keywords: ['edutech', 'erp', 'school', 'education', 'management', 'receipt', 'fee', 'dashboard', 'project'],
    },
    {
        id: 'project_agrotourism',
        category: 'Project',
        text: 'Agrotourism Booking Platform. Stack: C#, ASP.NET MVC, SQL Server, jQuery. Farm listing and activity management for farm owners. Tourist booking with packages, payments, and reviews. Analytics dashboard tracking bookings, revenue, and popular farms.',
        keywords: ['agrotourism', 'booking', 'farm', 'tourist', 'travel', 'analytics', 'payments', 'project'],
    },
    {
        id: 'project_hrmantra',
        category: 'Project',
        text: 'HRMantra — Applicant Tracking System. Stack: C#, WinForms, ADO.NET, SQL Server. Full applicant tracking from first contact to hire. Interview scheduling with status dashboards. Role-based screens for HR staff and assistants.',
        keywords: ['hrmantra', 'hr', 'applicant', 'tracking', 'interview', 'hiring', 'winforms', 'recruitment', 'project'],
    },
];

// Stop words to ignore
const STOP_WORDS = new Set(['the', 'and', 'for', 'with', 'that', 'this', 'are', 'was', 'has', 'his', 'from', 'have', 'what', 'how', 'many', 'did', 'does', 'about', 'tell', 'can', 'you']);

function tokenize(text: string): string[] {
    return text.toLowerCase()
        .split(/[\s\W]+/)
        .filter(w => w.length > 2 && !STOP_WORDS.has(w));
}

function scoreChunk(queryTokens: Set<string>, chunk: Chunk): number {
    const allText   = `${chunk.text} ${chunk.keywords.join(' ')}`;
    const tokens    = tokenize(allText);
    let textMatches = 0;
    for (const token of tokens) {
        if (queryTokens.has(token)) textMatches++;
    }
    const keywordBoost = chunk.keywords.filter(k => queryTokens.has(k)).length * 4;
    return (textMatches + keywordBoost) / (tokens.length + 1);
}

export function retrieveContext(query: string): string {
    const queryTokens = new Set(tokenize(query));

    // If asking about projects broadly, return all project chunks
    const projectWords = ['project', 'projects', 'built', 'worked', 'made', 'created', 'developed', 'build'];
    const isProjectQuery = Array.from(queryTokens).some(t => projectWords.includes(t));
    if (isProjectQuery) {
        return CHUNKS
            .filter(c => c.category === 'Project')
            .map(c => c.text)
            .join('\n\n');
    }

    // Score all chunks and return top 3
    const scored = CHUNKS
        .map(chunk => ({ chunk, score: scoreChunk(queryTokens, chunk) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

    return scored.map(s => s.chunk.text).join('\n\n');
}
