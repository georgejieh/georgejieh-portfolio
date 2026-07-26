---
status: shipped
featured: true
title: "REED: Real-time Equity and Economic Digest"
description: "Self-hosted market news agent. Scheduled briefs written from curated RSS feeds by a single-turn LLM call, with a terminal-style React dashboard to read them in. Bring your own model key."
longDescription: "Local-first by design: clone the repo, run the setup wizard, and an in-process scheduler fires four sessions per trading day plus a Monday weekend recap, skipping days the NYSE is closed. The research step is deliberately kept off the model. Curated RSS feeds are fetched, deduplicated, and time-filtered first, then one LLM call with zero tools exposed turns those headlines into a structured digest with sentiment, tickers, and numbered sources. Stories whose URL is not in the pre-fetched link set are dropped, which is what prevents the model from inventing sources. An earlier build used a crawler and scraper; it was slow and frequently blocked, so the RSS pre-flight replaced it. Five provider classes are supported (Anthropic, OpenAI, OpenRouter, Ollama, any OpenAI-compatible endpoint) with no default model. The dashboard reads the local API in dev, or a public dataset repo in static-demo mode."
tags: ["Python", "FastAPI", "Pydantic", "React", "TypeScript", "RSS", "OpenRouter", "APScheduler", "Financial News"]
link: "https://georgejieh.dev/reed"
repo: "https://github.com/georgejieh/REED"
sortOrder: 1
---
