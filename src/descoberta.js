'use strict';

const fs = require('fs');
const path = require('path');

const CATEGORIAS = [
  { pasta: 'fontes', natureza: 'primaria' },
  { pasta: 'derivados', natureza: 'derivada' },
  { pasta: 'timeline', natureza: 'timeline' },
];

const EXTENSOES_SUPORTADAS = new Set(['.md', '.yaml', '.yml']);

/**
 * @typedef {Object} DocumentoLido
 * @property {string} fonte caminho relativo à Base Canônica
 * @property {'primaria'|'derivada'|'timeline'} natureza
 * @property {string} maturidade
 * @property {string} conteudo
 */

/**
 * @typedef {Object} ResultadoDescoberta
 * @property {DocumentoLido[]} documentos
 * @property {string[]} falhas descrições explícitas de falhas técnicas, nunca silenciadas
 */

/**
 * Resolve — com contenção — o diretório raiz de um projeto dentro da Base
 * Canônica. Invariante: o caminho resolvido NUNCA pode sair de
 * `base-canonica/projetos/` por manipulação do input `projeto`
 * (`../`, `..\`, caminho absoluto, separadores alternativos, normalização,
 * symlink/junction). Projeto inexistente falha explicitamente.
 *
 * @param {string} baseCanonicaDir
 * @param {string} projeto
 * @returns {string} caminho absoluto, contido, do diretório do projeto
 */
function resolverRaizProjeto(baseCanonicaDir, projeto) {
  // Gate sintático: `projeto` tem de ser um único segmento de diretório —
  // sem separadores, sem travessia, sem caminho absoluto.
  if (
    typeof projeto !== 'string' ||
    projeto.length === 0 ||
    projeto === '.' ||
    projeto === '..' ||
    projeto.includes('/') ||
    projeto.includes('\\') ||
    projeto.includes('\0') ||
    path.isAbsolute(projeto) ||
    path.basename(projeto) !== projeto
  ) {
    throw new Error(
      `Nome de projeto inválido: "${projeto}" (deve ser um único segmento de diretório dentro de base-canonica/projetos/).`
    );
  }

  const projetosDir = path.resolve(baseCanonicaDir, 'projetos');
  const raizProjeto = path.resolve(projetosDir, projeto);

  // Contenção lexical: filho direto de projetos/, nunca neto nem fora.
  if (path.dirname(raizProjeto) !== projetosDir) {
    throw new Error(`Projeto fora do universo autorizado: "${projeto}".`);
  }

  const manifestoPath = path.join(raizProjeto, 'manifesto.yaml');
  if (!fs.existsSync(manifestoPath)) {
    throw new Error(`Projeto inexistente na Base Canônica: "${projeto}" (esperado ${manifestoPath}).`);
  }

  // Contenção física: resolve symlink/junction e confirma que o diretório
  // real do projeto continua sendo filho direto do projetos/ real.
  const raizReal = fs.realpathSync(raizProjeto);
  const projetosReal = fs.realpathSync(projetosDir);
  if (path.dirname(raizReal) !== projetosReal) {
    throw new Error(`Projeto fora do universo autorizado: "${projeto}".`);
  }

  return raizProjeto;
}

function enumerarArquivosRecursivo(diretorio) {
  if (!fs.existsSync(diretorio)) {
    return [];
  }
  const resultado = [];
  const pilha = [diretorio];
  while (pilha.length > 0) {
    const atual = pilha.pop();
    const entradas = fs.readdirSync(atual, { withFileTypes: true });
    for (const entrada of entradas) {
      const caminhoCompleto = path.join(atual, entrada.name);
      if (entrada.isDirectory()) {
        pilha.push(caminhoCompleto);
      } else if (entrada.isFile()) {
        resultado.push(caminhoCompleto);
      }
    }
  }
  return resultado.sort();
}

function extrairMaturidade(conteudo, rotuloPadrao) {
  const casamento = conteudo.match(/\*{0,2}Status\*{0,2}\s*:\*{0,2}\s*\*{0,2}([^\n*]+)/i);
  if (casamento && casamento[1].trim().length > 0) {
    return casamento[1].trim();
  }
  return rotuloPadrao;
}

/**
 * Lê sequencialmente e por completo todo o universo de descoberta permitido
 * (fontes/ + derivados/ + timeline/) de um projeto (Q3). Nenhuma
 * correspondência textual decide se um arquivo é aberto — todos os
 * documentos elegíveis são lidos antes de qualquer seleção. Documentos são
 * tratados como texto puro (nunca parseados como YAML estruturado), o que
 * torna "YAML malformado" irrelevante para leitura do corpus — apenas para
 * o arquivo de entrada (ver src/entrada.js).
 *
 * @param {string} baseCanonicaDir
 * @param {string} projeto
 * @returns {ResultadoDescoberta}
 */
function descobrirUniverso(baseCanonicaDir, projeto) {
  const raizProjeto = resolverRaizProjeto(baseCanonicaDir, projeto);
  const documentos = [];
  const falhas = [];

  for (const { pasta, natureza } of CATEGORIAS) {
    const diretorioCategoria = path.join(raizProjeto, pasta);
    const arquivos = enumerarArquivosRecursivo(diretorioCategoria);

    for (const caminhoAbsoluto of arquivos) {
      const nomeBase = path.basename(caminhoAbsoluto);
      const extensao = path.extname(caminhoAbsoluto).toLowerCase();
      const caminhoRelativo = path.relative(baseCanonicaDir, caminhoAbsoluto).split(path.sep).join('/');

      let estatisticas;
      try {
        estatisticas = fs.statSync(caminhoAbsoluto);
      } catch (erro) {
        falhas.push(`Documento ilegível (${caminhoRelativo}): ${erro.message}`);
        continue;
      }

      // .gitkeep e arquivos vazios são artefatos de Git, não conteúdo
      // documental — excluídos mecanicamente; isto não é falha técnica.
      if (nomeBase === '.gitkeep' || estatisticas.size === 0) {
        continue;
      }

      if (!EXTENSOES_SUPORTADAS.has(extensao)) {
        falhas.push(`Formato não suportado, não lido (${caminhoRelativo}).`);
        continue;
      }

      let conteudo;
      try {
        conteudo = fs.readFileSync(caminhoAbsoluto, 'utf8');
      } catch (erro) {
        falhas.push(`Documento ilegível (${caminhoRelativo}): ${erro.message}`);
        continue;
      }

      documentos.push({
        fonte: caminhoRelativo,
        natureza,
        maturidade: extrairMaturidade(conteudo, natureza),
        conteudo,
      });
    }
  }

  return { documentos, falhas };
}

module.exports = { descobrirUniverso };
