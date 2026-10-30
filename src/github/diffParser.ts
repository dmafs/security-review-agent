export interface ArchivoModificado {
    nombreArchivo: string;
    contenido: string;
  }
  
  export function separarDiffPorArchivo(diffCompleto: string): ArchivoModificado[] {
    const bloques = diffCompleto.split(/^diff --git /m).filter(b => b.trim() !== '');
  
    return bloques.map((bloque) => {
      const primeraLinea = bloque.split('\n')[0];
      // Busca el patrón "a/ruta b/ruta" y toma solo la parte después de "b/"
      const match = primeraLinea.match(/a\/(.+?)\s+b\/(.+)$/);
      const nombreArchivo = match ? match[2].trim() : 'archivo-desconocido';
  
      return {
        nombreArchivo,
        contenido: 'diff --git ' + bloque,
      };
    });
  }
  const EXTENSIONES_IGNORADAS = [
    '.lock', '.json', '.md', '.gitignore', '.yml', '.yaml', '.env.example'
  ];
  
  const ARCHIVOS_IGNORADOS = [
    'package-lock.json',
    'package.json',
    'tsconfig.json',
    '.gitignore',
  ];
  
  export function filtrarArchivosRelevantes(archivos: ArchivoModificado[]): ArchivoModificado[] {
    return archivos.filter((archivo) => {
      const nombre = archivo.nombreArchivo.toLowerCase();
  
      // Ignora archivos específicos que no son código de aplicación
      if (ARCHIVOS_IGNORADOS.some((ignorado) => nombre.endsWith(ignorado.toLowerCase()))) {
        return false;
      }
  
      // Ignora por extensión
      if (EXTENSIONES_IGNORADAS.some((ext) => nombre.endsWith(ext))) {
        return false;
      }
  
      return true;
    });
  }