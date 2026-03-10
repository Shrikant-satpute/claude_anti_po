import OpenAI from 'openai';
import { NextRequest } from 'next/server';
import { retrieveContext } from '@/lib/rag';

const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
});

export async function POST(req: NextRequest) {
    const { question } = await req.json();

    if (!question?.trim()) {
        return new Response('No question provided', { status: 400 });
    }

    // RAG — retrieve only relevant chunks for this query
    const context = retrieveContext(question);

    const systemPrompt = `You are an AI assistant on Shrikant Satpute's portfolio website.
Answer visitor questions using ONLY the information provided below.
Be friendly and concise.

FORMATTING RULES:
- Start with one clear summary sentence.
- Follow with bullet points using the • symbol for details.
- Each bullet: 1-2 sentences max.
- Do NOT add any intro like "Sure!" or "Great question!". Just answer directly.

RELEVANT INFORMATION:
${context}`;

    const stream = await openai.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 400,
        stream: true,
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: question },
        ],
    });

    return new Response(
        new ReadableStream({
            async start(controller) {
                for await (const chunk of stream) {
                    const text = chunk.choices[0]?.delta?.content ?? '';
                    if (text) controller.enqueue(new TextEncoder().encode(text));
                }
                controller.close();
            },
        }),
        { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
    );
}
