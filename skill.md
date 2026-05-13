# General Project Skill & Context Guidelines

This document serves as a universal template to provide context, guidelines, and instructions for developers and AI assistants working on this project. It can be adapted for any project to maintain consistency and quality.

## 🎯 Project Overview
* **Project Name:** [Insert Project Name]
* **Description:** [Briefly describe the core purpose and functionality of the project]
* **Primary Objective:** [What is the main problem this project solves?]

## 🛠️ Technology Stack
* **Frontend:** [e.g., React, Vue, Vanilla HTML/CSS]
* **Backend:** [e.g., Node.js, Python/Django, Go]
* **Database:** [e.g., PostgreSQL, MongoDB, Redis]
* **Infrastructure/Tools:** [e.g., Docker, GitHub Actions, AWS]

## 🏗️ Architectural & Coding Standards
1. **Consistency:** Match the existing coding style, indentation, and formatting of the project.
2. **Modularity:** Build small, reusable, and independent components or functions.
3. **Naming Conventions:** Use clear, descriptive names (e.g., `camelCase` for variables, `PascalCase` for classes/components).
4. **Error Handling:** Gracefully handle errors and provide meaningful logging or user feedback.
5. **Comments & Docs:** Document complex logic and keep the `README.md` up to date.

## 🚀 Development Workflow
* **Install Dependencies:** `npm install` (or equivalent)
* **Run Locally:** `npm run dev` (or equivalent)
* **Run Tests:** `npm test` (or equivalent)
* **Build for Production:** `npm run build` (or equivalent)

## 🤖 AI Assistant Instructions (Skill Directives)
*When using an AI assistant on this project, the AI should follow these rules:*
1. **Analyze First:** Always review existing project architecture and context before suggesting or making changes.
2. **Write Clean Code:** Prioritize readability and performance. Do not use deprecated methods.
3. **Incremental Changes:** Propose changes in small, manageable chunks rather than massive rewrites.
4. **Test-Driven:** Whenever possible, ensure that new code comes with appropriate testing strategies.
5. **Safety First:** Never execute destructive commands (like deleting databases or wiping directories) without explicit user approval.

## 📋 Standard Task Checklist
- [ ] Understand the core requirements of the task.
- [ ] Identify and review the files relevant to the task.
- [ ] Implement the feature or fix the bug.
- [ ] Verify changes locally (run tests, check UI/logs).
- [ ] Refactor and clean up the code.
- [ ] Update documentation (if applicable).
