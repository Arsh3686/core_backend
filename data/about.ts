export const portfolioData = {
    is_present: "Yes",
    resume: {
        url: "https://drive.google.com/uc?export=download&id=1wJnPPv6yOXV6XEqphEhOI23ujnlObmai"
    },
    experience: [
        {
            id: 1,
            role: "Software Engineer",
            company: "Quantela Inc",
            duration: "15 May 23 - Present",
            description: "Delivered and maintained backend systems for large-scale government e-Governance platforms across multiple Indian states, building scalable REST APIs with Node.js, Fastify, Express.js, and PostgreSQL. Improved system performance by 70% through query optimization and indexing. Implemented secure UAM with RBAC and LDAP, integrated payment gateways and government systems (RTPS, RMS, CCTNS), and developed document management and PDF watermarking pipelines. Automated background processing using cron jobs, ensured production stability through load testing (JMeter), and improved deployment reliability using Docker and CI/CD."
        }
    ],
    projects: [
        {
            id: 1,
            name: "Himachal Pradesh e‑Governance Platform",
            status: "Ongoing",
            url: "https://edsttest.hp.gov.in/",
            bullets: [
                "Working on CCTNS (Crime & Criminal Tracking Network System) integration.",
                "Developing a configurable Workflow Engine for multi-stage approval processes.",
                "Designing metadata-driven architecture for dynamic service and form configuration.",
                "Integrating multiple 3rd-party government systems including CCTNS, HIMUDA, eKYC, ICCC, etc."
            ],
            tech: ["Node.js", "Fastify", "PostgreSQL", "External APIs", "Microservices", "Docker", "Redis", "Postman"]
        },
        {
            id: 2,
            name: "Bihar e‑Nibandhan",
            status: "Delivered",
            url: "https://enibandhan.bihar.gov.in/",
            bullets: [
                "Delivered User Access Management (UAM) with RBAC & LDAP for secure government user access.",
                "Integrated Payment Gateway & Fee Verification ensuring transaction validation before workflow progression.",
                "Implemented RTPS (Right to Public Services) integration to automate service delivery.",
                "Integrated Revenue Management System (RMS) for real-time fee reconciliation.",
                "Built Document Management System with secure uploads, access control, and audit logging.",
                "Developed automation & cron jobs for periodic validation and workflow updates.",
                "Handled 1 lakh+ API hits per day, ensuring system stability and high availability.",
                "Looked into and resolved real field issues raised by department officers in production.",
                "Worked with cross-functional teams to fix issues without service delays.",
                "Assisted new joiners with KT and environment setup, ensuring smooth onboarding."
            ],
            tech: ["Node.js", "Fastify", "PostgreSQL", "LDAP", "REST APIs", "Cron Jobs", "Docker", "Microservices", "Redis", "JMeter", "Postman"]
        },
        {
            id: 3,
            name: "MP WebGIS",
            status: "Delivered",
            url: "https://webgis2.mpbhulekh.gov.in/#/home",
            bullets: [
                "Implemented PDF processing & watermarking for official land and revenue documents.",
                "Built notifications and structured logging modules for traceability and diagnostics.",
                "Designed backend architecture & REST APIs supporting high concurrent traffic.",
                "Optimized PostgreSQL queries for reporting and transactional performance.",
                "Implemented scheduled automation jobs for system maintenance and data sync.",
                "Handled 1 lakh+ API hits per day in production environments.",
                "Resolved real-time production issues reported by department officers.",
                "Collaborated with cross teams to ensure quick resolution and minimal downtime.",
                "Provided KT and setup support to new joiners joining the project."
            ],
            tech: ["Node.js", "Express.js", "PostgreSQL", "PDF Processing", "Cron", "Microservices", "Redis", "Postman", "Production Monitoring"]
        }
    ],
    skills: {
        languages: ["JavaScript (ES6+)", "SQL", "Go (Beginner)", "Python"],
        backend: ["Node.js", "Express.js", "Fastify", "REST APIs", "Microservices"],
        frontend: ["React.js", "Redux", "Firebase", "HTML", "CSS", "Bootstrap", "React Native (Beginner)"],
        databaseAndCaching: ["SQL", "PostgreSQL", "Redis"],
        devOpsAndTools: ["Docker", "Git", "JMeter", "Postman", "VS Code", "Jira", "Production Monitoring", "Anti-gravity", "Cursor"],
        coreConcepts: ["RBAC", "LDAP", "Caching", "Load Testing", "JWT Auth", "CI/CD", "MVC Architecture", "DSA"],
        aiToolsAndConcepts: ["ChatGPT", "Gemini", "Claude", "Generative AI (GenAI)", "Retrieval-Augmented Generation (RAG)"]
    },
    education: [
        {
            id: 1,
            institution: "MIET",
            degree: "B.Tech",
            score: "7.1 CGPA",
            duration: "2018-2022"
        }
    ]
};

export const SYSTEM_PROMPT = `You are the AI assistant for Aditya Raj Singh's portfolio.

Your purpose is to answer questions about Aditya's:
- Experience
- Skills
- Projects
- Technologies
- Contact information

You must respond EXCLUSIVELY with a raw JSON object containing a "blocks" array. Do not wrap the response in markdown blocks (like \`\`\`json).

Each element in the "blocks" array must be a valid UI block object representing one of the following block types:

1. Heading Block:
   { "type": "heading", "level": 1 | 2 | 3, "text": string }

2. Paragraph Block:
   { "type": "paragraph", "text": string }

3. List Block:
   { "type": "list", "ordered": boolean, "items": string[] }

4. Project Card Block:
   { "type": "project-card", "title": string, "status": string, "description": string, "tech": string[] }

5. Skills Grid Block:
   { "type": "skills-grid", "categories": [ { "title": string, "skills": string[] } ] }

6. Experience Card Block:
   { "type": "experience-card", "company": string, "role": string, "duration": string, "achievements": string[] }

7. Timeline Block:
   { "type": "timeline", "items": [ { "title": string, "subtitle": string, "duration": string } ] }

8. Contact Block:
   { "email": string, "github": string, "linkedin": string }

9. Quote Block:
   { "type": "quote", "text": string }

10. Divider Block:
    { "type": "divider" }

11. Code Block:
    { "type": "code", "language": string, "code": string }

Rules:
- You MUST only respond with valid JSON.
- Only answer using the provided portfolio context.
- Never invent information.
- If information is unavailable, say so using a paragraph block.
- For projects, always prefer rendering them using a "project-card" block type so they display as cards!
`;

