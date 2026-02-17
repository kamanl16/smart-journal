# smart-journal
# 📓 Smart Journal AI

A full-stack application that uses Google's Gemini AI to analyze the sentiment of personal journal entries in real-time. It features a modern Vue 3 frontend, a Node.js/Express backend, and persistent data storage via Supabase.

## 🚀 Features

-   **AI-Powered Analysis:** Automatically detects the mood (Positive, Negative, Neutral) of journal entries using Google Gemini 1.5 Flash.
-   **Real-time Database:** Stores journal entries and analysis results instantly in Supabase (PostgreSQL).
-   **RESTful API:** Custom Node.js backend handling data processing and secure API communication.
-   **Modern Frontend:** Built with Vue 3 (Composition API) and Vite for a fast, reactive user experience.
-   **Security:** Environment variables used for API key protection.

## 🛠️ Tech Stack

-   **Frontend:** Vue.js 3, Vite, JavaScript
-   **Backend:** Node.js v24, Express.js
-   **Database:** Supabase (PostgreSQL)
-   **AI Model:** Google Gemini 1.5 Flash (via Google Generative AI SDK)
-   **Tools:** Git, npm, REST API

## ⚙️ Prerequisites

Before running this project, ensure you have the following:

-   Node.js (v20 or higher recommended)
-   A [Supabase](https://supabase.com/) account and project.
-   A [Google AI Studio](https://aistudio.google.com/) API Key.

## 📦 Installation & Setup

### 1. Clone the Repository
```bash
git clone [https://github.com/YOUR_USERNAME/smart-journal.git](https://github.com/YOUR_USERNAME/smart-journal.git)
cd smart-journal
```

### 2. Backend Setup
The backend runs on localhost:3000.
```bash
# Install backend dependencies
npm install
# Create a .env file in the root directory
touch .env
```
Configure your .env file: Open the .env file and add your keys (do NOT share this file):
```bash
GEMINI_API_KEY=your_google_gemini_key_here
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
```

### 3. Frontend Setup
The frontend runs on localhost:5173 and proxies API requests to the backend.
```bash
cd client
npm install
```

## 🏃‍♂️ Usage

You need to run the backend and frontend in two separate terminal windows.

Terminal 1 (Backend):
```bash
# From the root folder
node server.js
```

Terminal 2 (Frontend):
```bash
# From the client folder
cd client
npm run dev
```

Open your browser and navigate to http://localhost:5173.

## 🗄️ Database Schema

This project uses a single table in Supabase named journal_entries.
| Column | Type | Description |
| :---------- | :-------- | :---------- |
| `id` | `int8` | Primary Key |
| `created_at` | `timestamptz` | The user's journal entry |
| `content` | `text` | Auto-generated timestamp |
| `mood` | `text` | AI-generated sentiment analysis |


## 🚧 Roadmap / Current Status
* [x] Basic REST API Setup
* [x] Gemini AI Integration
* [x] Database Connection (Supabase)
* [x] Vue 3 Frontend Interface
* [ ] User Authentication (Google OAuth) [In Progress]
* [ ] Row Level Security (RLS) Implementation

## 📄 License
This project is licensed under the terms of the [MIT License](LICENSE.md).

