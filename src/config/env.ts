import dotenv from 'dotenv';
dotenv.config();

export const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
export const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';