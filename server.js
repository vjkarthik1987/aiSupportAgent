const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const { OpenAI } = require('openai');
const { Category, Symptom, Cause, RecommendedAction, DetectionMethod } = require('./models/DataModel'); // MongoDB models

const app = express();
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));

console.log("Loaded API Key:", process.env.OPENAI_API_KEY ? "Key Found" : "No Key Found");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {})
    .then(() => console.log("✅ MongoDB Connected..."))
    .catch(error => {
        console.error("❌ MongoDB Connection Error:", error);
        process.exit(1);
    });

/**
 * 📌 API Route: Categorize Issue Using GPT-4o
 * - Fetches all categories from MongoDB
 * - GPT-4o suggests the 3 most relevant categories with explanations
 */
app.post('/api/categorize', async (req, res) => {
    const { user_description, previous_descriptions = [], rejected_categories = [] } = req.body;

    if (!user_description) {
        return res.status(400).json({ error: "Issue description is required." });
    }

    try {
        // Fetch all available categories from MongoDB
        const categories = await Category.find({}, 'name description');

        if (!categories.length) {
            return res.status(500).json({ error: "No categories found in database." });
        }

        // Filter out rejected categories
        const availableCategories = categories.filter(cat => !rejected_categories.includes(cat.name));

        if (availableCategories.length === 0) {
            return res.json({
                message: "No more categories left to suggest. Please refine your issue further."
            });
        }

        // Build the full description including refinements
        const full_description = [...previous_descriptions, user_description].join(" ");

        // Call GPT-4o to suggest 2-3 categories
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "You are an AI Support Agent that categorizes software issues into predefined categories based on similarity. Always return a valid JSON response." },
                { role: "user", content: `The user described this issue: "${full_description}".  
                The previously rejected categories were: ${rejected_categories.join(", ")}.  
                Here are the remaining categories: ${availableCategories.map(cat => cat.name).join(", ")}.  

                1️⃣ **Suggest the top 2-3 categories** that best match the issue.  
                2️⃣ **Provide a brief explanation for each category**.  
                3️⃣ **Ask a follow-up question to refine further**.  
                4️⃣ **Once refinement is done, confirm the final category.**  

                Return a JSON response like this:
                {
                    "suggestions": [
                        { "category": "UI Performance Issues", "explanation": "This involves UI lag, freezing, and slow response." },
                        { "category": "Batch Performance Issues", "explanation": "If the issue occurs during batch jobs, it might be related to processing delays." }
                    ],
                    "follow_up_question": "Is this issue happening only in the UI, or also during background jobs?"
                }
                If only one category remains:
                {
                    "final_category": "UI Performance Issues",
                    "confirmation_message": "Based on my analysis, it looks like the category of the issue is **UI Performance Issues**. Do you confirm? (Y/N)"
                }
                **Do not return any extra text or formatting. Only return the JSON object.**` }
            ]  // ✅ Closing the array properly now.
        });

        let gptResponse;
        try {
            const rawContent = response.choices[0].message.content.trim();
            const jsonString = rawContent.replace(/```json|```/g, "").trim();
            gptResponse = JSON.parse(jsonString);
        } catch (parseError) {
            console.error("❌ Error parsing GPT-4o response:", parseError);
            return res.status(500).json({ error: "Failed to process AI response." });
        }

        res.json({
            user_description,
            previous_descriptions,
            rejected_categories,
            ...gptResponse
        });

    } catch (error) {
        console.error("❌ Error calling GPT-4o:", error);
        res.status(500).json({ error: "Failed to categorize issue." });
    }
});


/**
 * 📌 API Route: Get Symptoms for a Category
 * - Fetches symptoms from MongoDB based on category
 */
app.get('/api/symptoms', async (req, res) => {
    const categoryName = req.query.category.trim();

    if (!categoryName) {
        return res.status(400).json({ error: "Category parameter is required." });
    }

    try {
        // Find category
        const category = await Category.findOne({ name: categoryName });
        if (!category) {
            return res.status(404).json({ error: `Category not found: ${categoryName}` });
        }

        // Find symptoms under this category
        const symptoms = await Symptom.find({ category: category._id }, 'name');

        if (!symptoms.length) {
            return res.status(404).json({ error: "No symptoms found for this category." });
        }

        res.json({ category: categoryName, symptoms: symptoms.map(s => s.name) });

    } catch (error) {
        console.error("❌ Error fetching symptoms:", error);
        res.status(500).json({ error: "Failed to retrieve symptoms." });
    }
});

app.post('/api/refine-issue', async (req, res) => {
    const { user_message } = req.body;

    if (!user_message) {
        return res.status(400).json({ error: "User message is required." });
    }

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "You are an AI assistant that determines if a user's response refines an issue further or eliminates a category. If the response adds more context, classify it as 'additional_info'. If the response removes a category, classify it as 'elimination'." },
                { role: "user", content: `User input: "${user_message}". Does this refine the issue further, or does it eliminate a category?  
                Respond with ONLY 'additional_info' or 'elimination'.` }
            ]
        });

        const gptResponse = response.choices[0].message.content.trim().toLowerCase();

        res.json({
            is_additional_info: gptResponse === "additional_info",
            is_elimination: gptResponse === "elimination"
        });

    } catch (error) {
        console.error("❌ Error refining issue:", error);
        res.status(500).json({ error: "Failed to refine issue." });
    }
});

/**
 * 📌 API Route: Get Possible Causes for a Symptom
 * - Fetches possible causes from MongoDB based on symptom
 */
app.get('/api/causes', async (req, res) => {
    const symptomName = req.query.symptom.trim();

    if (!symptomName) {
        return res.status(400).json({ error: "Symptom parameter is required." });
    }

    try {
        // Find symptom
        const symptom = await Symptom.findOne({ name: symptomName });
        if (!symptom) {
            return res.status(404).json({ error: `Symptom not found: ${symptomName}` });
        }

        // Find possible causes
        const possibleCauses = await Cause.findOne({ symptom: symptom._id });

        if (!possibleCauses) {
            return res.status(404).json({ error: "No causes found for this symptom." });
        }

        res.json({ symptom: symptomName, possibleCauses: possibleCauses.causes });

    } catch (error) {
        console.error("❌ Error fetching causes:", error);
        res.status(500).json({ error: "Failed to retrieve causes." });
    }
});

/**
 * 📌 API Route: Match User-Described Symptom to Predefined Symptoms
 * - Uses GPT-4o to find the closest symptom match
 */
app.post('/api/match-symptom', async (req, res) => {
    const { user_symptom } = req.body;

    if (!user_symptom) {
        return res.status(400).json({ error: "Symptom description is required." });
    }

    try {
        // Fetch all symptoms from MongoDB
        const symptoms = await Symptom.find({}, 'name');

        if (!symptoms.length) {
            return res.status(500).json({ error: "No symptoms found in database." });
        }

        const symptomNames = symptoms.map(s => s.name);

        // Call GPT-4o to match symptom
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "You are an AI Support Agent that maps user-described symptoms to predefined symptoms." },
                { role: "user", content: `
The user reported this issue: "${user_symptom}".  
Here are the predefined symptoms: ${symptomNames.join(", ")}.  

1️⃣ Suggest **the best matching symptom** from the list.  
2️⃣ Return only the symptom name in **structured JSON format** like:
{
    "matched_symptom": "Crashes or freezes"
}` }
            ]
        });

        const gptResponse = JSON.parse(response.choices[0].message.content);

        res.json({ user_symptom, matched_symptom: gptResponse.matched_symptom });

    } catch (error) {
        console.error("❌ Error calling GPT-4o:", error);
        res.status(500).json({ error: "Failed to match symptom." });
    }
});

// Serve the UI
app.get('/', (req, res) => {
    res.render('index');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
