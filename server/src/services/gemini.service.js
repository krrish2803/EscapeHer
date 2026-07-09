const { GoogleGenerativeAI } = require("@google/generative-ai");
const geminiConfig = require("../config/gemini");

let genAI = null;
let model = null;

/**
 * Lazily initialise the Gemini client and model.
 */
function getModel() {
  if (!model) {
    if (!geminiConfig.apiKey) {
      throw new Error("GEMINI_API_KEY is not configured");
    }
    genAI = new GoogleGenerativeAI(geminiConfig.apiKey);
    model = genAI.getGenerativeModel({
      model: geminiConfig.model,
      generationConfig: geminiConfig.generationConfig,
      safetySettings: geminiConfig.safetySettings,
    });
  }
  return model;
}

/**
 * Generate text content from a prompt.
 * @param {string} prompt - The input prompt.
 * @returns {Promise<string>} The generated text.
 */
async function generateText(prompt) {
  const m = getModel();
  const result = await m.generateContent(prompt);
  const response = result.response;
  return response.text();
}

/**
 * Generate a structured JSON response from a prompt.
 * Wraps the prompt with instructions to return valid JSON.
 * @param {string} prompt - The input prompt.
 * @returns {Promise<object>} Parsed JSON response.
 */
async function generateJSON(prompt) {
  const wrappedPrompt = `${prompt}\n\nIMPORTANT: Respond ONLY with valid JSON. No markdown, no explanation, no code fences.`;
  const text = await generateText(wrappedPrompt);

  /* Strip potential markdown code fences */
  const cleaned = text
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("[Gemini] Failed to parse JSON response:", err.message);
    console.error("[Gemini] Raw response:", text);
    throw new Error("AI returned invalid JSON");
  }
}

/**
 * Analyse an emergency situation and return a risk assessment.
 * @param {object} data - Emergency context data.
 * @returns {Promise<object>} AI risk assessment.
 */
async function analyzeEmergency(data) {
  const prompt = `You are an emergency safety analyst AI for a women's safety application called EscapeHer.

Analyze the following emergency situation and provide a risk assessment:

Location: ${data.latitude}, ${data.longitude}
${data.address ? `Address: ${data.address}` : ""}
Trigger Method: ${data.triggerMethod || "unknown"}
Time: ${data.timestamp || new Date().toISOString()}
${data.additionalContext ? `Additional Context: ${data.additionalContext}` : ""}

Provide a JSON response with the following structure:
{
  "riskLevel": "low" | "medium" | "high" | "critical",
  "assessment": "Brief description of the risk assessment",
  "recommendations": ["array", "of", "recommended", "actions"],
  "nearbyResources": ["array of suggested nearby resources to seek"],
  "estimatedResponseTime": "estimated time for help to arrive"
}`;

  return generateJSON(prompt);
}

/**
 * Summarise evidence collected during an emergency session.
 * @param {object[]} evidence - Array of evidence items.
 * @returns {Promise<string>} AI-generated summary.
 */
async function summarizeEvidence(evidence) {
  const prompt = `You are an AI assistant for the EscapeHer women's safety platform.

Summarise the following pieces of evidence collected during an emergency session into a clear, factual, chronological narrative suitable for law enforcement or legal proceedings.

Evidence:
${JSON.stringify(evidence, null, 2)}

Write a professional summary that includes:
1. Timeline of events
2. Key observations
3. Location data analysis
4. Any patterns or concerns identified

Keep the tone factual and objective.`;

  return generateText(prompt);
}

/**
 * Draft a complaint letter from incident data.
 * @param {object} incident - Incident data.
 * @returns {Promise<string>} Drafted complaint text.
 */
async function draftComplaint(incident) {
  const prompt = `You are a legal assistant AI for the EscapeHer women's safety platform.

Draft a formal complaint letter based on the following incident details. The complaint should be suitable for submission to local law enforcement.

Incident Details:
${JSON.stringify(incident, null, 2)}

The complaint should include:
1. A formal header with date and reference
2. Clear description of what happened
3. Timeline of events
4. Evidence referenced
5. Request for investigation and action
6. Space for the complainant's signature

Use a professional, formal tone.`;

  return generateText(prompt);
}

/**
 * Generate an incident report.
 * @param {object} data - Session and incident data.
 * @returns {Promise<object>} Structured incident report.
 */
async function generateIncidentReport(data) {
  const prompt = `You are a report generation AI for the EscapeHer women's safety platform.

Generate a structured incident report from the following data:
${JSON.stringify(data, null, 2)}

Provide a JSON response with the following structure:
{
  "title": "Report title",
  "summary": "Executive summary",
  "timeline": [{"time": "timestamp", "event": "description"}],
  "evidenceAnalysis": "Analysis of collected evidence",
  "riskAssessment": "Assessment of ongoing risk",
  "recommendations": ["array of recommendations"],
  "conclusion": "Concluding remarks"
}`;

  return generateJSON(prompt);
}

/**
 * Suggest a safe route between two points.
 * @param {object} params - Origin, destination, and context.
 * @returns {Promise<object>} Safe route suggestion.
 */
async function suggestSafeRoute(params) {
  const prompt = `You are a safety routing AI for the EscapeHer women's safety platform.

Given the following parameters, suggest the safest route considerations:

Origin: ${params.originLat}, ${params.originLng}
Destination: ${params.destLat}, ${params.destLng}
Time of Day: ${params.timeOfDay || new Date().toLocaleTimeString()}
${params.additionalContext ? `Context: ${params.additionalContext}` : ""}

Provide a JSON response:
{
  "safetyScore": 1-10,
  "recommendations": ["array of safety tips for this route"],
  "avoidAreas": ["descriptions of areas to avoid"],
  "safeStops": ["suggested safe stopping points"],
  "estimatedTime": "estimated travel time",
  "generalAdvice": "general safety advice for this journey"
}`;

  return generateJSON(prompt);
}

module.exports = {
  generateText,
  generateJSON,
  analyzeEmergency,
  summarizeEvidence,
  draftComplaint,
  generateIncidentReport,
  suggestSafeRoute,
};
