import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Please add your OpenAI API key to .env.local');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface GeneratePostParams {
  topic: string;
  category?: string;
  tags?: string[];
  tone?: 'professional' | 'casual' | 'technical';
  length?: 'short' | 'medium' | 'long';
}

export interface GeneratedPost {
  title: string;
  excerpt: string;
  content: string;
  suggestedTags: string[];
}

/**
 * Generate a blog post using OpenAI's GPT model
 */
export async function generateBlogPost(
  params: GeneratePostParams
): Promise<GeneratedPost> {
  const { topic, category, tags = [], tone = 'professional', length = 'medium' } = params;

  const wordCount = {
    short: '500-800',
    medium: '1000-1500',
    long: '2000-3000',
  };

  const systemPrompt = `You are a technical blog writer specializing in software development and programming.
Write engaging, informative, and accurate content for developers.
Use code examples where appropriate and explain complex concepts clearly.`;

  const userPrompt = `Write a ${tone} blog post about "${topic}"${
    category ? ` in the ${category} category` : ''
  }.

Requirements:
- Length: ${wordCount[length]} words
- Include practical code examples
- Use markdown formatting
- Add headings, lists, and code blocks
- Make it SEO-friendly
${tags.length > 0 ? `- Include these tags: ${tags.join(', ')}` : ''}

Return the response in the following JSON format:
{
  "title": "Blog post title",
  "excerpt": "A compelling 2-3 sentence excerpt",
  "content": "Full blog post content in markdown",
  "suggestedTags": ["tag1", "tag2", "tag3"]
}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No content generated');
    }

    const generatedPost = JSON.parse(content) as GeneratedPost;
    return generatedPost;
  } catch (error) {
    console.error('Error generating blog post:', error);
    throw new Error('Failed to generate blog post');
  }
}

/**
 * Generate a code snippet explanation
 */
export async function explainCode(
  code: string,
  language: string
): Promise<string> {
  const prompt = `Explain the following ${language} code in detail.
Break down what each part does and highlight any important concepts or best practices.

Code:
\`\`\`${language}
${code}
\`\`\`

Provide a clear, educational explanation suitable for a technical blog.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
      max_tokens: 1000,
    });

    return response.choices[0].message.content || '';
  } catch (error) {
    console.error('Error explaining code:', error);
    throw new Error('Failed to explain code');
  }
}

/**
 * Generate SEO metadata for a blog post
 */
export async function generateSEOMetadata(
  title: string,
  content: string
): Promise<{
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
}> {
  const prompt = `Generate SEO metadata for a blog post with the following:

Title: ${title}
Content Preview: ${content.substring(0, 500)}...

Return JSON with:
{
  "seoTitle": "SEO-optimized title (max 60 characters)",
  "seoDescription": "Compelling meta description (max 160 characters)",
  "seoKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
      max_tokens: 500,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No metadata generated');
    }

    return JSON.parse(content);
  } catch (error) {
    console.error('Error generating SEO metadata:', error);
    throw new Error('Failed to generate SEO metadata');
  }
}

/**
 * Improve existing blog content
 */
export async function improveBlogContent(
  content: string,
  improvements: string[]
): Promise<string> {
  const prompt = `Improve the following blog post content based on these requirements:
${improvements.map((imp, i) => `${i + 1}. ${imp}`).join('\n')}

Original Content:
${content}

Return the improved version maintaining markdown formatting.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 3000,
    });

    return response.choices[0].message.content || content;
  } catch (error) {
    console.error('Error improving content:', error);
    throw new Error('Failed to improve content');
  }
}

/**
 * Generate related post suggestions
 */
export async function generateRelatedTopics(
  currentTopic: string,
  category: string
): Promise<string[]> {
  const prompt = `Given a blog post about "${currentTopic}" in the ${category} category,
suggest 5 related topics that would interest the same audience.
Return only a JSON array of topic strings.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      max_tokens: 300,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No topics generated');
    }

    const result = JSON.parse(content);
    return result.topics || [];
  } catch (error) {
    console.error('Error generating related topics:', error);
    throw new Error('Failed to generate related topics');
  }
}

export default openai;
