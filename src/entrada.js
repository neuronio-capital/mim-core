'use strict';

const fs = require('fs');
const yaml = require('js-yaml');

const CAMPOS_OBRIGATORIOS = ['projeto', 'pergunta', 'objetivo'];

/**
 * @typedef {Object} EntradaContextBuilder
 * @property {string} projeto
 * @property {string} pergunta
 * @property {string} objetivo
 * @property {string} [estado]
 */

function ehStringNaoVazia(valor) {
  return typeof valor === 'string' && valor.trim().length > 0;
}

/**
 * Constrói e valida o objeto interno de entrada (contrato Q2) a partir de um
 * objeto bruto já parseado (ex.: resultado de yaml.load). Nunca infere
 * projeto, pergunta, objetivo ou estado — apenas valida presença e tipo.
 *
 * @param {unknown} bruto
 * @returns {EntradaContextBuilder}
 */
function construirEntrada(bruto) {
  if (bruto === null || typeof bruto !== 'object' || Array.isArray(bruto)) {
    throw new Error('Entrada inválida: esperado um objeto YAML com projeto/pergunta/objetivo.');
  }

  for (const campo of CAMPOS_OBRIGATORIOS) {
    if (!ehStringNaoVazia(bruto[campo])) {
      throw new Error(`Entrada inválida: campo obrigatório "${campo}" ausente ou vazio.`);
    }
  }

  /** @type {EntradaContextBuilder} */
  const entrada = {
    projeto: bruto.projeto,
    pergunta: bruto.pergunta,
    objetivo: bruto.objetivo,
  };

  // `estado` é opcional. Ausência, `null` e `~` (YAML) são normalizados para
  // "não fornecido" — nunca reutilizamos null do parser como sentinela
  // ambígua; a ausência da chave em `entrada` é o único sinal interno de
  // "estado não fornecido". Nenhum outro campo do objeto bruto (incluindo
  // qualquer eventual "proximo_passo") é transportado para o contrato
  // interno — apenas os quatro campos acima existem nele.
  if (bruto.estado !== undefined && bruto.estado !== null) {
    if (!ehStringNaoVazia(bruto.estado)) {
      throw new Error('Entrada inválida: campo opcional "estado", quando presente, deve ser uma string não vazia.');
    }
    entrada.estado = bruto.estado;
  }

  return entrada;
}

/**
 * Lê e parseia o arquivo YAML de entrada, produzindo o objeto interno (Q2).
 * @param {string} caminhoArquivo
 * @returns {EntradaContextBuilder}
 */
function carregarEntradaDeArquivo(caminhoArquivo) {
  let conteudo;
  try {
    conteudo = fs.readFileSync(caminhoArquivo, 'utf8');
  } catch (erro) {
    if (erro.code === 'ENOENT') {
      throw new Error(`Arquivo de entrada não encontrado: ${caminhoArquivo}`);
    }
    throw new Error(`Não foi possível ler o arquivo de entrada (${caminhoArquivo}): ${erro.message}`);
  }

  let bruto;
  try {
    bruto = yaml.load(conteudo);
  } catch (erro) {
    throw new Error(`YAML de entrada malformado (${caminhoArquivo}): ${erro.message}`);
  }

  return construirEntrada(bruto);
}

module.exports = { construirEntrada, carregarEntradaDeArquivo };
