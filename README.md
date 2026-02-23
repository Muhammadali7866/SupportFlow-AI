# SupportFlow-AI 🛠️

**An Intelligent Ticket Triage Agent built for the Elastic AI Agent Builder Hackathon.**

SupportFlow-AI solves the "Support Bottleneck" by using an AI Agent to automate the analysis, categorization, and resolution-discovery of incoming support tickets directly within the Elastic ecosystem.

## 🌟 Key Features

- **Automated Triage:** Instantly determines Category, Priority, and Sentiment.
- **Historical Discovery:** Uses **ES|QL** to find similar resolved tickets and suggest proven solutions.
- **Real-time Analytics:** Provides instant queue statistics via natural language.
- **Native Orchestration:** 100% built using **Elastic Agent Builder**—no external backend required.

## 🏗️ Architecture

- **Elasticsearch Serverless:** Managed vector and text database.
- **Agent Builder:** Reasoning engine and tool orchestration.
- **ES|QL (Elasticsearch Query Language):** Powering the discovery tools for high-precision retrieval.

## 🛠️ Custom Tools (ES|QL)

This agent is equipped with two powerful tools:

1. **`search_similar_tickets`**: Finds historical matches using the `QSTR` function.
2. **`get_ticket_stats`**: Aggregates ticket volume and priority levels using `STATS`.

## 📂 Project Structure

- `/agent`: Exported Agent configuration (instructions & tool settings).
- `/data`: Elasticsearch index mappings and 30-ticket sample dataset.
- `/queries`: Raw ES|QL queries used for agent tools.

## 🚀 Getting Started

1. Create an **Elasticsearch Serverless** project.
2. Run the mapping in `data/index-mapping.json` via Dev Tools.
3. Import the `data/sample-tickets.json` using the Bulk API.
4. Import the `agent/agent-config.json` into the **Agent Builder**.

## 📺 Demo Video

<!-- will update the link after recording demo video -->
