import { model } from 'config/ai_config';
import { SYSTEM_PROMPT } from 'data/about';
import fs from 'fs/promises';
import { AIMessage, HumanMessage, SystemMessage } from 'langchain';

export const getFilePath = (user_id: string) => `chat_${user_id}.json`

async function loadContext(user_id: string) {
  try {
    const data = await fs.readFile(getFilePath(user_id), 'utf8')
    const parsedData = JSON.parse(data) || []
    return parsedData
  } catch (error) {
    return []
  }
}

export function formatContext(context: any[]) {
  try {
    return context.map(item => {
      if (item.role === 'ai') return new AIMessage(item.content);
      if (item.role === 'human') return new HumanMessage(item.content);
      return null;
    }).filter((msg): msg is AIMessage | HumanMessage => msg !== null);
  } catch (error) {
    throw error;
  }
}

export async function saveContext(user_id: string, data: any) {
  try {
    const path = getFilePath(user_id)
    await fs.writeFile(path, JSON.stringify(data))
  } catch (error) {
    throw error
  }
}

async function getAIResponses(questions: string, closeRelevantDocuments: string, context: any[]) {
  try {

    const formattedContext = formatContext(context.slice(-6))

    const messages = [
      new SystemMessage(SYSTEM_PROMPT),
      new SystemMessage(`
        Portfolio Context:
              
        ${closeRelevantDocuments}
        `),
      ...formattedContext,
      new HumanMessage(questions)
    ]

    // const chain = prompts.pipe(model).pipe(new StringOutputParser());

    const response = await model.invoke(messages);
    console.log(response.content);
    return response.content
  } catch (error) {
    throw error
  }
}

export { loadContext, getAIResponses }