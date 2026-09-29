import 'dotenv/config';

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY || '';
  if (!apiKey) {
    console.error('No API key found in .env');
    return;
  }
  
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.error) {
      console.error('API Error:', data.error);
    } else if (data.models) {
      console.log('Available models:');
      data.models.forEach((m: any) => console.log(m.name));
    } else {
      console.log('Response:', data);
    }
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

listModels();
