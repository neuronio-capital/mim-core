'use strict';

const PADRAO_TOKEN = /[a-zà-öø-ÿ0-9]+/gi;
const TAMANHO_MINIMO_TOKEN = 3;

function tokenizar(texto) {
  const bruto = String(texto).toLowerCase().match(PADRAO_TOKEN) || [];
  return [...new Set(bruto.filter((token) => token.length >= TAMANHO_MINIMO_TOKEN))];
}

/**
 * Seleciona, de forma simples e determinística, quais documentos já lidos
 * (Q3) satisfazem a necessidade representada por pergunta/objetivo. A
 * correspondência textual decide apenas INCLUSÃO — nunca decide se um
 * arquivo é aberto (a leitura completa já ocorreu antes desta etapa, em
 * src/descoberta.js). Sem ranking, score, embeddings ou heurística
 * sofisticada: um documento é incluído se seu conteúdo contém, como
 * substring literal e caso-insensível, ao menos um dos termos (tokens de 3+
 * caracteres) extraídos de pergunta/objetivo. Correspondência por substring,
 * não por fronteira de token — limitação conhecida e aceita do V1.
 *
 * @param {import('./descoberta').DocumentoLido[]} documentos
 * @param {{ pergunta: string, objetivo: string }} necessidade
 * @returns {{ incluidos: import('./descoberta').DocumentoLido[], termos: string[] }}
 */
function selecionarEvidencias(documentos, { pergunta, objetivo }) {
  const termos = [...new Set([...tokenizar(pergunta), ...tokenizar(objetivo)])];

  // Ordenação por path garante que a mesma entrada + mesmo corpus produzam
  // sempre a mesma ordem de resultado, independentemente da ordem de
  // enumeração do sistema de arquivos.
  const documentosOrdenados = [...documentos].sort((a, b) => a.fonte.localeCompare(b.fonte));

  if (termos.length === 0) {
    return { incluidos: [], termos };
  }

  const incluidos = documentosOrdenados.filter((documento) => {
    const conteudoNormalizado = documento.conteudo.toLowerCase();
    return termos.some((termo) => conteudoNormalizado.includes(termo));
  });

  return { incluidos, termos };
}

module.exports = { selecionarEvidencias };
