// 1. IMPORT THE TOOLS
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(bodyParser.json());

// --- CONFIGURATION ---
// process.env loads variables from your .env file
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

// Safety Check: Stop the server if keys are missing
if (!GEMINI_API_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
    console.error("❌ ERROR: Missing API Keys in .env file!");
    process.exit(1);
}

// 2. SETUP THE CONNECTIONS
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

// 3. DEFINE THE REST API ENDPOINT (The "Waiter")
// This creates a POST route at http://localhost:3000/api/journal
app.post('/api/journal', async (req, res) => {
    try {
        const userText = req.body.text; // The text you send
        console.log("Received entry:", userText);

        // STEP A: Ask Gemini for the mood (The "Brain")
        const prompt = `Analyze the sentiment of this journal entry and return ONLY one word (Positive, Negative, or Neutral): "${userText}"`;
        const result = await model.generateContent(prompt);
        const mood = result.response.text().trim();
        console.log("Gemini says the mood is:", mood);

        // STEP B: Save to Supabase (The "Filing Cabinet")
        const { data, error } = await supabase
            .from('journal_entries')
            .insert([{ content: userText, mood: mood }])
            .select();

        if (error) throw error;

        // STEP C: Send success message back to user
        res.json({ 
            status: "success", 
            message: "Entry saved!", 
            analysis: mood,
            data: data 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong!" });
    }
});

// 4. START THE SERVER
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});