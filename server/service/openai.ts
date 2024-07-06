import OpenAI from 'openai';
import { OPENAI_BASE_URL, OPENAI_KEY } from './envValues';

export const openai = new OpenAI({
  baseURL: OPENAI_BASE_URL,
  apiKey: OPENAI_KEY,
});
