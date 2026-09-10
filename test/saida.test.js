'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const yaml = require('js-yaml');
const { serializarBlocoContexto } = require('../src/saida');

const blocoFixture = {
  projeto: 'FullCommerce',
  objetivo: 'Objetivo com acentuação e Unicode: café, ação, çedilha.',
  estado: 'não determinado',
  pergunta: 'Pergunta com\nmúltiplas linhas e "aspas".',
  evidencias: [
    { fonte: 'a.md', natureza: 'primaria', maturidade: 'Canônico', conteudo: 'linha1\nlinha2\nlinha3' },
  ],
  conflitos: [],
  ausencia_evidencia: [],
};

test('saída YAML é determinística — mesmo objeto produz sempre a mesma string (N)', () => {
  const saida1 = serializarBlocoContexto(blocoFixture);
  const saida2 = serializarBlocoContexto(blocoFixture);
  assert.equal(saida1, saida2);
});

test('ordem das chaves de topo é preservada, nunca reordenada alfabeticamente', () => {
  const saida = serializarBlocoContexto(blocoFixture);
  const indiceProjeto = saida.indexOf('projeto:');
  const indiceObjetivo = saida.indexOf('objetivo:');
  const indiceEstado = saida.indexOf('estado:');
  const indicePergunta = saida.indexOf('pergunta:');
  assert.ok(indiceProjeto < indiceObjetivo);
  assert.ok(indiceObjetivo < indiceEstado);
  assert.ok(indiceEstado < indicePergunta);
});

test('round-trip preserva Unicode, multilinha e aspas sem perda', () => {
  const saida = serializarBlocoContexto(blocoFixture);
  const reconstruido = yaml.load(saida);
  assert.deepEqual(reconstruido, blocoFixture);
});

test('"próximo passo" não aparece na saída serializada (R)', () => {
  const saida = serializarBlocoContexto(blocoFixture);
  assert.ok(!/proximo[_ ]passo|próximo[_ ]passo|proximos[_ ]passos|próximos[_ ]passos/i.test(saida));
});
