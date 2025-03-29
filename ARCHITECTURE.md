# 🏗️ ARCHITECTURE.md – Strive (v1.0)

**Version:** 1.0
**Date:** March 29, 2025
**Status:** Draft

## 1. Overview

This document outlines the high-level technical architecture for the Strive application. It defines the core components, technologies, data flow, and architectural principles guiding development. The architecture is designed to be scalable and support the phased rollout of features outlined in the `MASTER_PRD.md`, starting with core daily execution features and anticipating future project management and AI capabilities.

## 2. Core Technologies

-   **Frontend Framework:** Next.js 14+ (App Router)
-   **Language:** TypeScript
-   **Backend Services:** Supabase Platform-as-a-Service
    -   **Database:** Supabase Postgres
    -   **Authentication:** Supabase Auth (Email/Password, Google OAuth)
    -   **Storage:** Supabase Storage (for future file attachments)
    -   **Edge Functions:** Supabase Edge Functions (for potential server-side logic/webhooks later)
    -   **Vector Database:** Supabase Vector/pgvector (for future AI/RAG features)
-   **UI Components:** shadcn/ui
-   **Styling:** Tailwind CSS
-   **Deployment:** Vercel
-   **State Management:** React Context API / Zustand (Decision TBD, start simple with Context or component state)
-   **(Future) AI/LLM:** Google Gemini API / OpenAI API
-   **(Future) Voice Transcription:** OpenAI Whisper API or similar
-   **(Future) Workflow Automation:** n8n (Self-hosted or Cloud)

## 3. System Components & Data Flow

```mermaid
graph TD
    subgraph Browser/Client (Next.js App on Vercel)
        A[User Interface (React Components + shadcn/ui)] --> B{User Interaction (Click, Type, Drag, Hover)};
        B --> C[Frontend Logic (State Management, API Calls)];
        B --> F[Voice Input Capture (Future)];
        C --> D[Supabase Client Library (JS)];
        E[Auth UI (Login/Signup)] --> D;
        F --> G[Voice Transcription API (Future)];
        G --> C;
    end

    subgraph Backend (Supabase Cloud Platform)
        H[Supabase Auth] <--> D;
        I[Supabase Database (Postgres)] <--> D;
        J[Supabase Storage (Future)] <--> D;
        K[Supabase Edge Functions (Future)] <--> D;
        L[Supabase Vector DB (Future)] <--> K; % Or directly from Client/Server Action
    end

    subgraph External Services (Future)
        M[LLM API (Gemini/OpenAI)] <--> K; % Or Server Action
        N[Automation Engine (n8n)] <--> K; % Via Webhooks
    end

    %% Data Flow Description
    %% User interacts (B) with UI (A). Auth actions (E) go via Supabase Client (D) to Supabase Auth (H).
    %% Other interactions (C) trigger API calls via Supabase Client (D) to Database (I) for CRUD operations on Tasks, Habits, etc.
    %% (Future) Voice Input (F) is sent to Transcription (G), text result fed back to Client Logic (C).
    %% (Future) Client Logic (C) or Edge Functions (K) call LLM API (M).
    %% (Future) Database triggers or client actions could call Edge Functions (K) which interact with Vector DB (L) or N8N (N).
    %% (Future) File uploads go via Supabase Client (D) to Supabase Storage (J).