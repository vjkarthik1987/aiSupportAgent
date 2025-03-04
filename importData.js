require("dotenv").config();
const mongoose = require("mongoose");
const data = require("./data"); // Import the data structure
const { Category, Symptom, Cause, RecommendedAction, DetectionMethod } = require("./models/DataModel");

const mongoURI = process.env.MONGO_URI; // Ensure this is in your .env file

async function connectDB() {
    try {
        await mongoose.connect(mongoURI);
        console.log("✅ MongoDB Connected...");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
        process.exit(1);
    }
}

async function uploadData() {
    await connectDB();

    try {
        console.log("🟡 Clearing old data...");
        await Category.deleteMany({});
        await Symptom.deleteMany({});
        await Cause.deleteMany({});
        await RecommendedAction.deleteMany({});
        await DetectionMethod.deleteMany({});
        console.log("✅ Cleared existing data.");

        const categoryMap = {};

        // Insert Categories
        for (const categoryName of data.uniqueCategories) {
            const category = new Category({ name: categoryName });
            await category.save();
            categoryMap[categoryName] = category._id;
            console.log(`✅ Inserted Category: ${categoryName}`);
        }

        const symptomMap = {};

        // Insert Symptoms
        for (const [categoryName, symptoms] of Object.entries(data.commonSymptoms)) {
            for (const symptomName of symptoms) {
                const symptom = new Symptom({
                    category: categoryMap[categoryName],
                    name: symptomName,
                });
                await symptom.save();
                symptomMap[symptomName] = symptom._id;
                console.log(`✅ Inserted Symptom: ${symptomName}`);
            }
        }

        // Insert Possible Causes
        for (const [symptomName, causes] of Object.entries(data.possibleCauses)) {
            if (symptomMap[symptomName]) {
                await Cause.create({ symptom: symptomMap[symptomName], causes });
                console.log(`✅ Inserted Causes for: ${symptomName}`);
            }
        }

        // Insert Recommended Actions
        for (const [symptomName, actions] of Object.entries(data.recommendedActions)) {
            if (symptomMap[symptomName]) {
                await RecommendedAction.create({ symptom: symptomMap[symptomName], actions });
                console.log(`✅ Inserted Recommended Actions for: ${symptomName}`);
            }
        }

        // Insert Detection Methods
        for (const [symptomName, methods] of Object.entries(data.detectionMethods)) {
            if (symptomMap[symptomName]) {
                await DetectionMethod.create({ symptom: symptomMap[symptomName], methods });
                console.log(`✅ Inserted Detection Methods for: ${symptomName}`);
            }
        }

        console.log("🎉 Data Upload Complete!");
    } catch (error) {
        console.error("❌ Error Uploading Data:", error);
    } finally {
        mongoose.connection.close();
    }
}

// Run the upload function
uploadData();
