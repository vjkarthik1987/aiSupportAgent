const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String }
});

const SymptomSchema = new mongoose.Schema({
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    name: { type: String, required: true, unique: true }
});

const CauseSchema = new mongoose.Schema({
    symptom: { type: mongoose.Schema.Types.ObjectId, ref: "Symptom", required: true },
    causes: [{ type: String }]
});

const RecommendedActionSchema = new mongoose.Schema({
    symptom: { type: mongoose.Schema.Types.ObjectId, ref: "Symptom", required: true },
    actions: [{ type: String }]
});

const DetectionMethodSchema = new mongoose.Schema({
    symptom: { type: mongoose.Schema.Types.ObjectId, ref: "Symptom", required: true },
    methods: [{ type: String }]
});

const Category = mongoose.model("Category", CategorySchema);
const Symptom = mongoose.model("Symptom", SymptomSchema);
const Cause = mongoose.model("Cause", CauseSchema);
const RecommendedAction = mongoose.model("RecommendedAction", RecommendedActionSchema);
const DetectionMethod = mongoose.model("DetectionMethod", DetectionMethodSchema);

module.exports = { Category, Symptom, Cause, RecommendedAction, DetectionMethod };
