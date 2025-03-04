const express = require('express');
const app = express();
require('dotenv').config();
const { OpenAI } = require('openai');
const data = require('./data'); // Import structured JSON data

app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// API Route: Categorize Issue Using GPT-4o
app.post('/api/categorize', async (req, res) => {
    const { user_description, rejected_categories = [] } = req.body;

    if (!user_description) {
        return res.status(400).json({ error: "Issue description is required." });
    }

    if (!data.uniqueCategories) {
        console.error("Error: uniqueCategories is undefined in data.js");
        return res.status(500).json({ error: "Internal Server Error - Data not loaded" });
    }

    // Remove rejected categories from available options
    const availableCategories = data.uniqueCategories.filter(cat => !rejected_categories.includes(cat));

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "You are an AI Support Agent that classifies issues into predefined categories based on similarity. Prioritize the most relevant match." },
                { role: "user", content: `The user reported an issue: "${user_description}". 
                The previously suggested category was rejected. 
                Remaining categories: ${availableCategories.join(", ")}. 
                Suggest the next best category from the list based on relevance. 
                Do not return any explanations, only the category name.` }
            ]
        });

        const matchedCategory = response.choices[0].message.content.trim();

        res.json({ user_description, matched_category: matchedCategory });

    } catch (error) {
        console.error("Error calling GPT-4o:", error);
        res.status(500).json({ error: "Failed to categorize issue." });
    }
});

// API Route: Get Symptoms for a Category
app.get('/api/symptoms', (req, res) => {
    const category = req.query.category.trim();

    if (!category) {
        return res.status(400).json({ error: "Category parameter is required." });
    }

    // Convert to exact case-insensitive match
    const matchedCategory = Object.keys(data.commonSymptoms).find(cat => cat.toLowerCase() === category.toLowerCase());

    if (!matchedCategory) {
        console.error(`Category not found: ${category}`);
        return res.status(404).json({ error: `Category not found: ${category}` });
    }

    const symptoms = data.commonSymptoms[matchedCategory];

    if (!symptoms || symptoms.length === 0) {
        return res.status(404).json({ error: "No symptoms found for this category." });
    }

    res.json({ category: matchedCategory, symptoms });
});

//API to fetch causes
app.get('/api/causes', (req, res) => {
    const symptom = req.query.symptom.trim();

    if (!symptom) {
        return res.status(400).json({ error: "Symptom parameter is required." });
    }

    const possibleCauses = data.possibleCauses[symptom];

    if (!possibleCauses || possibleCauses.length === 0) {
        return res.status(404).json({ error: "No causes found for this symptom." });
    }

    res.json({ symptom, possibleCauses });
});


// Render the UI
app.get('/', (req, res) => {
    res.render('index');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
