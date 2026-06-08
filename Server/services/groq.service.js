const axios = require("axios");
const { env } = require("../config/env");

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

/**
 * Sends a chat completion request to the Groq API.
 * @param {Array} messages List of chat message objects: [{ role: 'system'|'user'|'assistant', content: '...' }]
 * @param {Object} [options] Optional parameters (model, temperature, max_tokens)
 * @returns {Promise<string>} The model's response text
 */
const getChatCompletion = async (messages, options = {}) => {
  try {
    const payload = {
      model: options.model || "llama-3.1-8b-instant",
      messages: messages,
      temperature: options.temperature !== undefined ? options.temperature : 0.7,
      max_tokens: options.max_tokens || 2048,
    };

    const response = await axios.post(GROQ_API_URL, payload, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${env.groqApiKey}`,
      },
      timeout: 20000, // 20s timeout
    });

    const content = response.data?.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("No response content received from Groq API");
    }

    return content;
  } catch (err) {
    console.error("Groq API Call Failed:", err.message);
    if (err.response) {
      console.error("Groq Response Error Data:", JSON.stringify(err.response.data, null, 2));
    }
    throw new Error(`Groq service error: ${err.message}`);
  }
};

module.exports = {
  getChatCompletion,
};
