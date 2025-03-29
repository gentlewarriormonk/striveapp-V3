# 🗺️ PROJECT_PLAN.md – Strive (v1.0)

**Version:** 1.0
**Date:** March 29, 2025
**Status:** Active

## 1. Overview

This document outlines the high-level project plan for developing the Strive application. It breaks down the development into distinct modules (corresponding to Minimum Viable Product increments) based on the features defined in `MASTER_PRD.md`. The goal is to deliver value incrementally, starting with core daily execution features.

## 2. Development Phases & Modules

The project will be developed in the following phases/modules. Each module will have its own dedicated folder within `/feature_modules/` containing detailed planning documents (`MINI_PRD.md`, `FLOW.md`, `TECH_DECISIONS.md`, `IMPLEMENTATION_PLAN.md`, `PROGRESS.md`).

| Module ID          | Module Name                      | Status        | Description                                                                                                       | Target Features (from MASTER_PRD)                          |
| :----------------- | :------------------------------- | :------------ | :---------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------- |
| **Phase 1: Core Daily Execution** |                                  |               |                                                                                                   |                                                            |
| `00_auth_setup`    | Core Setup & Authentication    | **Not Started** | Initialize project codebase, configure Supabase, implement basic user login/signup, profile management.             | MVP 0 Features                                             |
| `01_core_tasks`    | Core Task Management           | **Not Started** | Implement basic Task CRUD, priority, status, ordering, and list view.                                             | MVP 1 Features                                             |
| `02_core_habits`   | Core Habit Tracking            | **Not Started** | Implement basic Habit CRUD, daily check-in mechanism, and list view.                                              | MVP 2 Features                                             |
| `03_gamification`  | Streaks, XP & Tiers            | **Not Started** | Implement logic for streak calculation, XP awards, Tier progression, and display basic gamification elements.     | MVP 3 Features                                             |
| `04_dashboard`     | Basic Dashboard View ("Today") | **Not Started** | Create the main view integrating Today's tasks, daily habits, streaks, XP, and tier progress.                      | MVP 4 Features                                             |
| `05_groups`        | Basic Groups & Sharing         | **Not Started** | Implement group creation/joining, member viewing, and display of shared member gamification stats (XP, Streaks, Tier). | MVP 5 Features                                             |
| **Phase 2: Project Management & Enhancements** |                                  |               |                                                                                                   |                                                            |
| `06_projects`      | Project & Milestone Management | **Not Started** | Implement Project & Milestone CRUD, task linking, hierarchical views.                                             | Subset of MVP 6+ Features                                  |
| `07_file_linking`  | File Linking                   | **Not Started** | Allow attaching/linking files/URLs to tasks.                                                                      | Subset of MVP 6+ Features                                  |
| `08_adv_filtering` | Advanced Filtering & Views     | **Not Started** | Implement Upcoming view, Project-specific task views.                                                             | Subset of MVP 6+ Features                                  |
| `09_recurring`     | Recurring Items                | **Not Started** | Add support for recurring tasks and habits.                                                                       | Subset of MVP 6+ Features                                  |
| `10_task_details`  | Task Descriptions & Details    | **Not Started** | Add description fields and potentially other details to tasks.                                                    | Subset of MVP 6+ Features                                  |
| `11_adv_gamify`    | Enhanced Gamification          | **Not Started** | Implement badges, levels, leaderboards (Optional, design TBD).                                                    | Subset of MVP 6+ Features                                  |
| **Phase 3: Voice & AI Features** |                                  |               |                                                                                                   |                                                            |
| `12_voice_input`   | Basic Voice Interaction        | **Not Started** | Integrate voice transcription and basic command processing for tasks/habits.                                      | Subset of Phase 3 Features                                 |
| `13_ai_coach`      | AI Coach (Initial)             | **Not Started** | Basic conversational interface for reflection, planning. Setup RAG foundation.                                    | Subset of Phase 3 Features                                 |
| `14_ai_search`     | AI-Powered Search              | **Not Started** | Implement semantic search for tasks/projects/files.                                                               | Subset of Phase 3 Features                                 |
| *(Further AI modules TBD)* |                          |               |                                                                                                   |                                                            |

## 3. Timeline & Milestones (High-Level)

*(Specific timelines TBD - This provides sequence)*

-   **Milestone 1:** Complete MVP 0 (Authentication working).
-   **Milestone 2:** Complete MVPs 1 & 2 (Core Task & Habit tracking functional).
-   **Milestone 3:** Complete MVPs 3 & 4 (Gamification & Dashboard integrated).
-   **Milestone 4:** Complete MVP 5 (Basic Group functionality working).
-   **Subsequent Milestones:** Target completion of Phase 2 & 3 modules based on priority and resources.

## 4. Development Workflow Reminder

-   Follow the Master Plan Framework v2.0.
-   Plan each module (`MINI_PRD`, `FLOW`, `TECH_DECISIONS`, `IMPLEMENTATION_PLAN`) within its `/feature_modules/` subfolder using AI assistance in Cursor, referencing `MASTER_PRD.md` and `ARCHITECTURE.md`.
-   Use the module's `PROGRESS.md` checklist during implementation.
-   Implement code using AI assistance in Cursor, focusing on steps from the `IMPLEMENTATION_PLAN`.
-   Commit frequently to Git and push to the `striveapp-V3` remote repository.
-   Update the Status column in this document as each module progresses.

---

**Action:**

1.  Create a new file named `PROJECT_PLAN.md` in the root of your `striveapp` folder (alongside `MASTER_PRD.md` and `ARCHITECTURE.md`).
2.  Copy and paste the content above into this file and save it.
3.  **Important:** Use Git to commit this new file:
    *   Open the terminal in Cursor.
    *   Run `git add PROJECT_PLAN.md`
    *   Run `git commit -m "Add initial PROJECT_PLAN.md outlining modules"`
    *   Run `git push` (you don't need `-u origin main` anymore as the tracking is set up).

**Next Step After This:**

With the high-level planning documents (`MASTER_PRD`, `ARCHITECTURE`, `PROJECT_PLAN`) in place, we are ready to start planning the *first specific module*: **`00_auth_setup`**.

This involves:

1.  Creating the folder `/feature_modules/00_auth_setup/`.
2.  Creating the planning documents (`MINI_PRD.md`, `FLOW.md`, `TECH_DECISIONS.md`, `IMPLEMENTATION_PLAN.md`, `PROGRESS.md`) *inside* that folder using the templates from `/planning_templates/`.
3.  Using the AI agent in Cursor to help fill out the details for *each* of those documents specifically for the Authentication module.
