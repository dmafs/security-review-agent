import { Octokit } from 'octokit';
import { GITHUB_TOKEN } from '../config/env';

export const octokit = new Octokit({ auth: GITHUB_TOKEN });

// Función de prueba: confirma que la conexión funciona
export async function testConnection() {
  const { data } = await octokit.rest.users.getAuthenticated();
  console.log(`Conectado a GitHub como: ${data.login}`);
}

export async function getPullRequestDiff(owner: string, repo: string, pullNumber: number) {
  const { data } = await octokit.rest.pulls.get({
    owner,
    repo,
    pull_number: pullNumber,
    mediaType: { format: 'diff' },
  });
  
  return data as unknown as string;
}