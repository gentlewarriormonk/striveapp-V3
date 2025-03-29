# 📄 MASTER Product Requirements Document (PRD) – Strive (v1.0)

**Version:** 1.0
**Date:** March 29, 2025
**Status:** Draft

## 1. Overview

### 1.1 Product Name
Strive (Domain: striveapp.io)

### 1.2 Vision
To create a minimalist, intuitive, and powerful personal productivity system that seamlessly integrates habit tracking, task/project management, gamified motivation, and (eventually) AI-driven assistance, helping users achieve meaningful progress in both personal and professional contexts.

### 1.3 Purpose
Strive aims to reduce the friction in daily planning and execution by providing clear visibility into tasks and habits, fostering motivation through streaks and XP, and supporting focused work. It merges the motivational aspects of habit tracking (from the original Strive concept) with effective task management (inspired by VoiceFlow and user needs), accessible via a clean GUI and planned voice/AI interactions.

### 1.4 Target Audience
-   **Individuals:** Seeking a unified system for personal habits, tasks, and goals.
-   **Students:** Tracking academic tasks, study habits, and personal development goals.
-   **Professionals/Freelancers:** Managing daily tasks, deadlines, personal habits, and potentially lightweight project tracking.
-   **Informal Groups (Friends, Family, Clubs):** Sharing progress (streaks, XP) and providing mutual accountability and encouragement within a group context.
    *(Note: The initial focus is on individual productivity, with group features added early but kept simple.)*

## 2. Goals

### 2.1 Product Goals
-   Develop a reliable and intuitive platform for tracking daily tasks and habits.
-   Implement a motivating gamification system based on streaks, XP, and tier progression.
-   Provide clear views for daily planning ("Today") and upcoming tasks.
-   Enable basic grouping for shared visibility and accountability.
-   Establish a foundation for future project management, voice control, and AI coaching features.
-   Ensure a high-quality, minimalist, and frictionless user experience.

### 2.2 Business Goals (High-Level)
-   Achieve strong user adoption and retention within target segments.
-   Validate the core value proposition of integrated task/habit tracking with gamification.
-   Create a scalable platform capable of supporting future premium/business features.
-   Build a foundation for a potentially profitable SaaS application.

## 3. Core Principles & Approach

-   **Minimalism:** Prioritize simplicity and clarity; avoid feature bloat.
-   **Intuitive UX:** Design interfaces that are easy to understand and use with minimal friction.
-   **Modularity (Master Plan Framework):** Develop features incrementally in well-defined modules.
-   **AI-Assisted Development:** Leverage integrated AI (Gemini 2.5 Pro in Cursor) for planning, scaffolding, code generation, testing, and review, following defined guidelines.
-   **Start Fresh:** Build upon concepts from previous projects but implement with a clean codebase.
-   **Dark Mode First:** Prioritize a polished dark mode experience based on the defined Strive aesthetic, with light mode as a secondary goal.
-   **Phased Rollout:** Focus on core daily execution features first, layering more complex functionality (project management, advanced AI) later.

## 4. Key Features (Phased Overview)

*(Detailed requirements per feature will be in module-specific MINI_PRD.md files)*

### 4.1 Gamification Core Components
-   **XP System:** Points awarded for task/habit completion (details TBD). Daily cap may apply.
-   **Streak System:** Tracking consecutive daily habit completions (Current & Best).
-   **Tier Progression System:** Users advance through named tiers (e.g., Seedling, Sapling) based on accumulating total XP, providing a long-term sense of growth and achievement. Initial tiers and XP thresholds to be defined.

### Phase 1: Core Daily Execution (MVPs 0-5)
-   **MVP 0: Core Setup & Authentication**
    -   User registration & login (Email/Password, Google OAuth via Supabase Auth).
    -   Basic profile management.
    -   Secure session handling.
-   **MVP 1: Core Task Management**
    -   Task CRUD (Create, Read, Update, Delete).
    -   Fields: Title, Due Date, Priority (High/Medium/Low), Status (e.g., To Do, Done).
    *   *No Projects initially.*
    -   Visual priority indicators (e.g., color-coding).
    -   Ability to manually reorder tasks (Drag/Drop).
    -   Simple Task List view.
-   **MVP 2: Core Habit Tracking**
    -   Habit CRUD.
    -   Fields: Title, Frequency (initially Daily).
    -   Mechanism for daily check-in/completion log.
    -   Simple Habit List view.
-   **MVP 3: Streaks & Basic XP / Tiers**
    -   Implement streak calculation logic for Habits (Current & Best).
    -   Basic XP calculation logic for completing Tasks/Habits.
    -   Implement basic Tier system logic (tracking total XP against defined thresholds).
    -   Display current streak per habit, daily/total XP, and current Tier name/progress.
-   **MVP 4: Basic Dashboard View ("Today")**
    -   Integrated view showing:
        -   Tasks due/planned for Today.
        -   Daily Habits for check-in.
        -   Current Streaks summary.
        -   Today's XP earned.
        -   Current Tier/Progress summary.
    -   Basic daily planning support (identifying today's tasks, rollover logic TBD).
-   **MVP 5: Basic Groups & Sharing**
    -   Group CRUD (Create, Join via code/invite, Leave).
    -   View group members.
    -   Display aggregated/individual member Streaks, XP totals, and Tier within the group view (read-only).
    *   *No granular task/habit sharing initially.*

### Phase 2: Project Management & Enhancements (MVPs 6+)
-   **Project & Milestone Management:**
    -   Project CRUD.
    -   Milestone CRUD within Projects.
    -   Linking Tasks to specific Milestones/Projects.
    -   Hierarchical navigation (Projects -> Milestones -> Tasks).
-   **File Linking:** Ability to attach/link files or URLs to Tasks.
-   **Advanced Filtering & Views:** Upcoming view, Project-specific views.
-   **Recurring Tasks/Habits:** Support for different recurrence patterns.
-   **Task Descriptions & Details:** Adding more context to tasks.
-   **Enhanced Gamification:** Badges, levels, leaderboards (carefully designed).

### Phase 3: Voice & AI Features (Future Vision)
-   **Voice Interaction:** Basic task/habit management via voice commands (integrated input).
-   **AI Coach:** Conversational AI for reflection, goal setting, planning, habit suggestions.
-   **AI-Powered Search:** Searching tasks, projects, and linked files using natural language.
-   **RAG Implementation:** Leveraging user history (tasks, habits, reflections) for personalized AI insights and memory (requires Vector DB).
-   **Competency Tracking:** Mapping progress to underlying skills/goals.

## 5. UI/UX Principles

-   **Aesthetic:** Clean, minimal, modern, inspired by the Strive branding.
-   **Color Palette:** Dark mode primary (based on defined palette: `#0F172A` background, `#FFFFFF` text, `#00A7E1` primary accent), with consistent use of priority colors (`#EF4444` High, `#3B82F6` Medium/Low).
-   **Layout:** Focus on clarity and intuitive navigation. Use whitespace effectively. Avoid dense or cluttered interfaces.
-   **Components:** Utilize `shadcn/ui` component library for consistency, accessibility, and customization.
-   **Interaction:**
    -   Keep interactions simple and direct.
    -   Task actions (Edit/Delete) accessible via long-press (mobile) or hover menu (desktop - e.g., three dots).
    -   Task completion via intuitive mechanism (e.g., checkbox, click/tap).
    -   Support drag-and-drop for manual task reordering.
    -   Minimize reliance on complex settings panels; favor sensible defaults and AI assistance.
-   **Responsiveness:** Ensure a seamless experience across desktop and mobile devices.

## 6. Technical Overview

-   **Frontend:** Next.js (App Router), React, TypeScript
-   **Backend:** Supabase (PostgreSQL Database, Auth, potentially Edge Functions/Storage/Vector later)
-   **Styling:** Tailwind CSS
-   **UI Components:** shadcn/ui
-   **Deployment:** Vercel (initially)
-   **(Future) Voice:** OpenAI Whisper or similar
-   **(Future) AI:** Gemini models (via API), LangChain
-   **(Future) Automation:** n8n (for potential external workflows)

## 7. Success Metrics (Initial Focus)

-   **User Activation:** % of signups completing first task AND first habit check-in.
-   **Engagement:** Daily Active Users (DAU), Weekly Active Users (WAU), average number of tasks/habits completed per day.
-   **Retention:** Week 1, Month 1 retention rates.
-   **Core Loop Adoption:** % of active users consistently maintaining streaks (>3 days).
-   **Gamification:** Average Tier achieved after X weeks/months.
-   **Qualitative Feedback:** User interviews and feedback forms on ease of use and motivation.

## 8. Future Vision Considerations

-   The platform architecture should anticipate the future integration of advanced AI features, including RAG for personalized memory and coaching.
-   The data model should be flexible enough to support evolving features like competency tracking and more complex project relationships.
-   Ethical considerations, particularly around AI coaching, motivation, and data privacy (especially if minors use the platform), must be paramount in future design phases.