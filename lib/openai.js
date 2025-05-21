import OpenAI from 'openai';

let openai;
if (process.env.NEXT_PUBLIC_OPENAI_KEY) {
  openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
    dangerouslyAllowBrowser: true 
  });
} else {
  console.warn("OpenAI API key not found. AI summaries will not be generated. Please set NEXT_PUBLIC_OPENAI_KEY environment variable.");

  openai = {
    chat: {
      completions: {
        create: async () => {
          console.error("OpenAI not configured. Cannot generate summary.");
          return { choices: [{ message: { content: "[Yapay zeka özeti oluşturulamadı - API anahtarı eksik.]" } }] };
        }
      }
    }
  };
}

const generateAISummary = async (prompt) => {
  if (!process.env.NEXT_PUBLIC_OPENAI_KEY || !openai || typeof openai.chat.completions.create !== 'function') {
    console.error("OpenAI client is not properly configured. Cannot generate AI summary.");
    return "[Yapay zeka özeti oluşturulamadı - yapılandırma hatası.]"; 
  }

  console.log("Sending prompt to OpenAI:", prompt.substring(0, 200) + "...");

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: "You are a helpful assistant that summarizes product reviews. Provide the summary in Turkish and ensure it is under 200 words. Do not mention that you are an AI or that this is an AI-generated summary. Directly provide the summary of the reviews."
        },
        { 
          role: "user", 
          content: prompt 
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const summary = response.choices[0]?.message?.content?.trim();
    
    if (!summary) {
        console.error("OpenAI response did not contain a summary.", response);
        return "[Yapay zeka özeti alınamadı.]";
    }
    
    console.log("Received summary from OpenAI:", summary);
    return summary;

  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return "[Yapay zeka özeti oluşturulurken bir hata oluştu.]"; 
  }
};

export { generateAISummary }; 