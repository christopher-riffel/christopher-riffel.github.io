# ProfileChat — Early Foundation

This is the early public version of ProfileChat, an AI-powered career profile platform built on the Anthropic API.

A hosted version of this early build is live at **[christopher-riffel.github.io](https://christopher-riffel.github.io)**.

---

## What It Does

ProfileChat gives professionals their own personal URL with an AI chatbot that knows their entire career story. Recruiters, hiring managers, and clients can ask it questions and get thoughtful, narrative answers — not a resume dump.

This version contains a single profile (mine) and a simple chat interface. The full platform supports multiple clients, per-profile theming, dynamic feature flags, rate limiting, QR codes, certification badges, career timelines, and more.

---

## How It Works

The app is a static frontend backed by Vercel serverless functions. There is no database. Each profile is a self-contained JavaScript data file that drives both the page display and the AI chatbot's behavior.

When a visitor sends a message, the frontend calls `/api/chat`, which forwards the conversation to an LLM API with a dynamically constructed system prompt built from the profile data. The response renders in the chat UI.

**Tech stack:**
- Vanilla JavaScript and HTML — no framework
- Vercel serverless functions (Node.js)
- LLM API integration via serverless proxy
- Deployed via Vercel with GitHub auto-deploy

---

## File Structure

```
index.html        # Chat UI — layout, styles, suggestion chips
app.js            # Frontend JS — message handling, rendering, API calls
api/
  chat.js         # Serverless endpoint — proxies messages to LLM API
vercel.json       # Routing config for Vercel deployment
```

---

## What Was Actually Built Here

The file structure is simple. What is inside it is not.

**Prompt engineering as a product.** The `botInstructions` field in each profile is not a paragraph of instructions — it is a structured document. It contains named rules, a sequenced conversation arc across five to seven story beats, specific handling for different question types, tone controls, and constraints on how and when certain information surfaces. Writing a good one is closer to screenwriting than software development. Each one takes real time and deliberate thought.

**Conversation architecture.** The chatbot does not answer questions and wait. It has a strategy — guiding the visitor through a narrative arc from earliest career to most recent, ending with a personal close. Each beat has a defined transition to the next. The visitor feels like they are pulling the story out, not being pitched at. That behavior is entirely engineered through the system prompt, not hardcoded.

**Profile-as-data pattern.** The AI's entire identity — personality, story, rules, vocabulary, what it will and will not say — is driven by a single profile data file. Swapping the file changes the chatbot completely. This separation of concerns was a deliberate architectural decision that makes the platform extensible to any number of clients without touching the application code.

**Theming system.** Each profile drives its own complete visual identity — background colors, accent colors, bubble styles, light or dark mode, header treatment. One codebase renders as an entirely different product per client. All theme values live in the profile data file alongside the AI configuration.

**Suggestion chips.** The prompt chips visible below the input are not generic. They are crafted per-profile to guide visitors toward the most compelling parts of each person's story. A small detail that required intentional thinking about what each chatbot does best.

**Chat UX.** Typing indicators, message entrance animations, scroll behavior, input locking during response flight, mobile responsiveness across all screen sizes — every interaction state was designed and built deliberately. None of it is automatic.

**The vm module problem.** Profile files are loaded dynamically at runtime using Node's `vm` module rather than static imports — a pattern that makes adding new profiles as simple as dropping a file into a folder without touching application code. The constraint this created: JavaScript comments anywhere in a profile file cause the vm sandbox to fail silently, with no error thrown and no indication of what went wrong. Diagnosing that took hours. The fix was a single rule: no comments in profile files, ever.

**Rate limiting.** The full platform implements per-IP rate limiting directly in the serverless chat handler to prevent API abuse. Built without a database — tracked entirely in memory with a rolling window reset on cold start.

---

## What Is Being Built Next

This early version handles the core chatbot experience. The next phase focuses on client onboarding, operations, and payments:

**Intake form.** A structured multi-section form that collects everything needed to build a new profile — work history, skills, certifications, social links, feature preferences, and color theme. Fields that require supporting detail reveal input areas inline when selected rather than cluttering the form upfront.

**Transactional email.** On form submission, two emails fire via a transactional email API — a formatted admin notification with all client data organized and ready to act on, and an auto-reply to the client confirming their submission and setting expectations. The admin notification is structured specifically to feed directly into an AI-assisted profile generation workflow.

**Stripe payment integration.** A Stripe payment link triggers after intake form review. The build does not start until payment clears. Clean two-step flow: submit the form, receive a payment link, go live within three business days of payment.

**Landing page.** A marketing page replacing the current chat-only index, with feature highlights, demo profiles, pricing, and the intake form in a single scrollable page.

The goal is a complete self-contained loop: client submits the form, receives a confirmation, pays via Stripe, I get a structured brief, and a new profile goes live within three business days.

---

## Technical Skills Demonstrated

- LLM API integration and serverless proxy architecture
- Prompt engineering and conversation flow design
- Agentic application design — behavior driven entirely by data, not hardcoded logic
- Dynamic module loading via Node `vm`
- Per-IP rate limiting without a database
- Multi-client theming from a single codebase
- Vanilla JS application architecture — state management, async handling, UI interaction
- Vercel serverless deployment and environment variable management
- Transactional email integration (Resend API)
- Stripe payment integration (in progress)

---

## About

Built by **[Christopher Riffel](https://www.linkedin.com/in/christopher-riffel)** — Senior Technical Analyst with 10+ years in insurtech and API integration, currently building agentic AI applications nights and weekends with no prior experience in this space and no tutorials written specifically for what I was trying to build.

This started as a creative outlet. It became a real platform.

&rarr; [christopher-riffel.github.io](https://christopher-riffel.github.io) &nbsp;·&nbsp; [LinkedIn](https://www.linkedin.com/in/christopher-riffel)
