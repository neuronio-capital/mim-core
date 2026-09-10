'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { construirEntrada } = require('../src/entrada');
const { montarBlocoContexto, SENTINELA_ESTADO_NAO_DETERMINADO } = require('../src/montagem');

const documentoFixture = {
  fonte: 'projetos/X/fontes/doc.md',
  natureza: 'primaria',
  maturidade: 'Canônico',
  conteudo: 'conteúdo de evidência',
};

test('proveniência é preservada no bloco final (I)', () => {
  const entrada = construirEntrada({ projeto: 'X', pergunta: 'p', objetivo: 'o' });
  const bloco = montarBlocoContexto(entrada, { incluidos: [documentoFixture] });
  assert.equal(bloco.evidencias[0].fonte, documentoFixture.fonte);
  assert.equal(bloco.evidencias[0].natureza, 'primaria');
  assert.equal(bloco.evidencias[0].maturidade, 'Canônico');
});

test('estado fornecido é transportado sem reinterpretação (D)', () => {
  const entrada = construirEntrada({ projeto: 'X', pergunta: 'p', objetivo: 'o', estado: 'Estado real fornecido' });
  const bloco = montarBlocoContexto(entrada, { incluidos: [] }, { ausenciaEvidencia: [] });
  assert.equal(bloco.estado, 'Estado real fornecido');
});

test('estado ausente vira sentinela semanticamente não determinado (E)', () => {
  const entrada = construirEntrada({ projeto: 'X', pergunta: 'p', objetivo: 'o' });
  const bloco = montarBlocoContexto(entrada, { incluidos: [documentoFixture] });
  assert.equal(bloco.estado, SENTINELA_ESTADO_NAO_DETERMINADO);
});

test('ausência de evidência é explícita quando nada é incluído (L)', () => {
  const entrada = construirEntrada({ projeto: 'X', pergunta: 'p', objetivo: 'o' });
  const bloco = montarBlocoContexto(entrada, { incluidos: [] });
  assert.equal(bloco.evidencias.length, 0);
  assert.ok(bloco.ausencia_evidencia.length > 0);
});

test('ausência de evidência NUNCA é confundida com estado não determinado (M)', () => {
  // estado FORNECIDO, mas sem evidência -> os dois continuam independentes
  const entrada = construirEntrada({ projeto: 'X', pergunta: 'p', objetivo: 'o', estado: 'fornecido' });
  const bloco = montarBlocoContexto(entrada, { incluidos: [] });
  assert.equal(bloco.estado, 'fornecido');
  assert.ok(bloco.ausencia_evidencia.length > 0);

  // evidência PRESENTE, mas estado não fornecido -> os dois continuam independentes
  const entradaSemEstado = construirEntrada({ projeto: 'X', pergunta: 'p', objetivo: 'o' });
  const blocoComEvidencia = montarBlocoContexto(entradaSemEstado, { incluidos: [documentoFixture] });
  assert.equal(blocoComEvidencia.estado, SENTINELA_ESTADO_NAO_DETERMINADO);
  assert.equal(blocoComEvidencia.ausencia_evidencia.length, 0);
});

test('conflito permanece conflito — preservado sem resolução automática (K)', () => {
  const entrada = construirEntrada({ projeto: 'X', pergunta: 'p', objetivo: 'o' });
  const conflitoOriginal = [
    {
      descricao: 'fontes/A diverge de derivados/B quanto a X',
      fontes: ['projetos/X/fontes/A.md', 'projetos/X/derivados/B.yaml'],
      posicoes: { 'projetos/X/fontes/A.md': 'afirma X', 'projetos/X/derivados/B.yaml': 'afirma Y' },
    },
  ];
  const bloco = montarBlocoContexto(entrada, { incluidos: [documentoFixture] }, { conflitos: conflitoOriginal });
  assert.deepEqual(bloco.conflitos, conflitoOriginal);
  for (const conflito of bloco.conflitos) {
    assert.ok(!('resolucao' in conflito), 'conflito não deve receber campo de resolução automática');
    assert.ok(!('vencedor' in conflito), 'conflito não deve escolher vencedor');
  }
});

test('"próximo passo" NUNCA aparece no bloco de contexto produzido (R)', () => {
  const entrada = construirEntrada({ projeto: 'X', pergunta: 'p', objetivo: 'o', estado: 'e' });
  const bloco = montarBlocoContexto(entrada, { incluidos: [documentoFixture] });
  const chaves = Object.keys(bloco);
  for (const chave of chaves) {
    assert.ok(!/proximo|próximo/i.test(chave), `chave inesperada relacionada a próximo passo: ${chave}`);
  }
});
