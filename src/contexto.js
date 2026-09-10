'use strict';

const path = require('path');
const { construirEntrada } = require('./entrada');
const { descobrirUniverso } = require('./descoberta');
const { selecionarEvidencias } = require('./selecao');
const { montarBlocoContexto } = require('./montagem');

const BASE_CANONICA_PADRAO = process.env.MIM_BASE_CANONICA_DIR
  ? path.resolve(process.env.MIM_BASE_CANONICA_DIR)
  : path.join(__dirname, '..', 'base-canonica');

/**
 * Contrato interno de M02 (Q2): recebe o objeto de entrada já estruturado
 * (não um arquivo, não argv) e devolve o bloco de contexto montado — pronto
 * para ser serializado (src/saida.js) por qualquer chamador, seja a CLI fina
 * (bin/context-builder.js) seja um futuro consumidor do mim-core como
 * biblioteca, sem depender de subprocess.
 *
 * @param {import('./entrada').EntradaContextBuilder | unknown} entradaBruta
 * @param {{ baseCanonicaDir?: string }} [opcoes]
 * @returns {Object} bloco de contexto (contrato Q1/Q4)
 */
function construirContexto(entradaBruta, opcoes = {}) {
  const entrada = construirEntrada(entradaBruta);
  const baseCanonicaDir = opcoes.baseCanonicaDir || BASE_CANONICA_PADRAO;

  const { documentos, falhas } = descobrirUniverso(baseCanonicaDir, entrada.projeto);
  const resultadoSelecao = selecionarEvidencias(documentos, {
    pergunta: entrada.pergunta,
    objetivo: entrada.objetivo,
  });

  // Conflitos (β1 — relay-only): M02 V1 NÃO deriva conflito. Não compara
  // valores entre documentos distintos, não infere contradição em prosa,
  // não compara repositório de código com `fontes/` e não usa IA/NLP. O
  // parâmetro `conflitos` de montarBlocoContexto é o ÚNICO ponto de entrada
  // de conflitos e apenas transporta verbatim o que uma fonte ou componente
  // competente já tenha entregue explicitamente identificado — do mesmo modo
  // que `estado`. Nenhum formato atual da Base Canônica declara conflito
  // relayável, portanto o conjunto é vazio aqui e `conflitos: []` significa
  // "nenhum conflito explicitamente declarado e relayável foi encontrado" —
  // nunca "não existem conflitos".
  const bloco = montarBlocoContexto(entrada, resultadoSelecao, { conflitos: [] });

  // Falha técnica não pode virar omissão silenciosa (princípio já
  // ratificado): quando algum documento do universo não pôde ser lido ou
  // usa formato não suportado, isso é sinalizado explicitamente, sem
  // abortar a montagem do restante do bloco.
  if (falhas.length > 0) {
    bloco.falhas_leitura = falhas;
  }

  return bloco;
}

module.exports = { construirContexto, BASE_CANONICA_PADRAO };
