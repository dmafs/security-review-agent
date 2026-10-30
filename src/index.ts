import { getPullRequestDiff } from './github/githubClient';
import { separarDiffPorArchivo, filtrarArchivosRelevantes } from './github/diffParser';

async function main() {
  const diff = await getPullRequestDiff('dmafs', 'security-review-agent', 1);
  const archivos = separarDiffPorArchivo(diff);
  const archivosRelevantes = filtrarArchivosRelevantes(archivos);

  console.log(`Total de archivos en el PR: ${archivos.length}`);
  console.log(`Archivos relevantes para analizar: ${archivosRelevantes.length}\n`);

  archivosRelevantes.forEach((archivo) => {
    console.log(`📄 ${archivo.nombreArchivo}`);
  });
}

main();