'use strict';

const SENTINELA_ESTADO_NAO_DETERMINADO = 'não determinado';

/**
 * Monta o objeto do bloco de contexto final (contrato Q1/Q4) a partir do
 * resultado da seleção. Não decide inclusão nem lê arquivos — apenas
 * formata o que a recuperação (descoberta + seleção) já decidiu.
 *
 * `conflitos` é uma estrutura própria, sempre presente, sem campo de
 * resolução (M02 nunca adjudica: não escolhe vencedor, não resolve). É um
 * canal RELAY-ONLY (β1): transporta verbatim apenas conflitos/divergências
 * que uma fonte ou componente competente já tenha entregue explicitamente
 * identificados — do mesmo modo que `estado`. M02 V1 NÃO detecta conflito
 * por conta própria: não compara valores entre documentos distintos, não
 * infere contradição em texto livre, não compara repositório de código com
 * `fontes/` e não usa IA/NLP. Por isso `conflitos: []` significa
 * estritamente "nenhum conflito explicitamente declarado e relayável foi
 * encontrado nas evidências selecionadas" — NÃO significa "não existem
 * conflitos", "as evidências foram semanticamente comparadas" nem "a
 * inexistência de contradições foi verificada". Ver
 * docs/revisoes/REVISAO-M02-CONFLITOS-E-CONTENCAO.md.
 *
 * "estado não determinado" nunca é confundido com "ausência de evidência":
 * são campos estruturalmente distintos (`estado` vs. `ausencia_evidencia`).
 *
 * O campo "próximo passo" NUNCA é produzido por esta função, em nenhuma
 * hipótese — não pertence ao contrato de M02 (H3 / fronteira M02×M03).
 *
 * @param {import('./entrada').EntradaContextBuilder} entrada
 * @param {{ incluidos: import('./descoberta').DocumentoLido[] }} resultadoSelecao
 * @param {{ conflitos?: Array<Object>, ausenciaEvidencia?: string[] }} [extras]
 * @returns {Object} bloco de contexto pronto para serialização (Q1)
 */
function montarBlocoContexto(entrada, resultadoSelecao, extras = {}) {
  const evidencias = resultadoSelecao.incluidos.map((documento) => ({
    fonte: documento.fonte,
    natureza: documento.natureza,
    maturidade: documento.maturidade,
    conteudo: documento.conteudo,
  }));

  const conflitos = extras.conflitos ? extras.conflitos.slice() : [];
  const ausenciaEvidencia = extras.ausenciaEvidencia ? extras.ausenciaEvidencia.slice() : [];

  if (evidencias.length === 0 && ausenciaEvidencia.length === 0) {
    ausenciaEvidencia.push(
      `nenhuma evidência localizada para: pergunta="${entrada.pergunta}" objetivo="${entrada.objetivo}"`
    );
  }

  return {
    projeto: entrada.projeto,
    objetivo: entrada.objetivo,
    estado: entrada.estado !== undefined ? entrada.estado : SENTINELA_ESTADO_NAO_DETERMINADO,
    pergunta: entrada.pergunta,
    evidencias,
    conflitos,
    ausencia_evidencia: ausenciaEvidencia,
  };
}

module.exports = { montarBlocoContexto, SENTINELA_ESTADO_NAO_DETERMINADO };
