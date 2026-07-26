---
status: shipped
featured: true
title: "REED: Real-time Equity and Economic Digest"
description: "Self-hosted market-news webapp. Five scheduled briefs per US-trading day, terminal-style dashboard, single-turn LLM call on a curated RSS pre-flight. Bring your own model key."
longDescription: "Local-first architecture: clone the repo, run the setup wizard, and the in-process scheduler fires five weekday sessions plus a Monday-morning weekend recap against a curated RSS pre-flight. The single LLM call gets the headlines, time window, and topic in one prompt and produces a structured digest with sentiment, tickers, and numbered sources. Story URLs that are not in the pre-fetched link set are dropped to prevent fabrication. The dashboard reads briefs from the local API in dev mode, or from a public HF Dataset repo in static-demo mode (the author's hosted variant)."
tags: ["Python", "FastAPI", "RSS", "OpenRouter", "Gemini", "Cron", "Scheduler", "Financial News"]
link: "https://georgejieh.dev/reed"
repo: "https://github.com/georgejieh/REED"
sortOrder: 1
---
