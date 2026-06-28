import { Document } from "@langchain/core/documents";
import { portfolioData } from "../data/about";

export function convertPortfolioToDocuments() {
    const docs: Document[] = [];

    /* ---------------- Experience ---------------- */

    portfolioData.experience.forEach((exp) => {
        docs.push(
            new Document({
                pageContent: `
                    Experience
                    Role: ${exp.role}
                    Company: ${exp.company}
                    Duration: ${exp.duration}
                    Description:
                    ${exp.description}
                `,
                metadata: {
                    type: "experience",
                    id: `experience-${exp.id}`
                }
            })
        );
    });

    /* ---------------- Projects ---------------- */

    portfolioData.projects.forEach((project) => {
        docs.push(
            new Document({
                pageContent: `
                    Project
                    Name: ${project.name}
                    Status: ${project.status}
                    Responsibilities:
                    ${project.bullets.join("\n")}
                    Technologies:
                    ${project.tech.join(", ")}
                `,
                metadata: {
                    type: "project",
                    id: `project-${project.id}`,
                    project: project.name
                }
            })
        );
    });

    /* ---------------- Skills ---------------- */

    docs.push(
        new Document({
            pageContent: `
                    Skills

                    Languages:
                    ${portfolioData.skills.languages.join(", ")}

                    Backend:
                    ${portfolioData.skills.backend.join(", ")}

                    Frontend:
                    ${portfolioData.skills.frontend.join(", ")}

                    Database:
                    ${portfolioData.skills.databaseAndCaching.join(", ")}

                    DevOps:
                    ${portfolioData.skills.devOpsAndTools.join(", ")}

                    Core Concepts:
                    ${portfolioData.skills.coreConcepts.join(", ")}

                    AI:
                    ${portfolioData.skills.aiToolsAndConcepts.join(", ")}
            `,
            metadata: {
                type: "skills",
                id: `skills`
            }
        })
    );

    /* ---------------- Education ---------------- */

    portfolioData.education.forEach((edu) => {
        docs.push(
            new Document({
                pageContent: `
                Education

                Institution:
                ${edu.institution}

                Degree:
                ${edu.degree}

                CGPA:
                ${edu.score}

                Duration:
                ${edu.duration}
                `,
                metadata: {
                    type: "education",
                    id: `education-${edu.id}`
                }
            })
        );
    });

    return docs;
}