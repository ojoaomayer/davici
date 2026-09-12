import OpenAI from 'openai'

// Using Gemini's OpenAI compatibility endpoint
export const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY || 'placeholder-key',
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/'
})
