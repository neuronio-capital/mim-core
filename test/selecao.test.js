'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { selecionarEvidencias } = require('../src/selecao');

const documentosFixture = [
  { fonte: 'b/doc2.md', natureza: 'derivada', maturidade: 'derivada', conteudo: 'Fala sobre convergência de dados.' },
  { fonte: 'a/doc1.md', natureza: 'primaria', maturidade: 'Canônico', conteudo: 'Nada relacionado ao termo buscado.' },
  { fonte: 'c/doc3.md', natureza: 'timeline', maturidade: 'timeline', conteudo: 'Evento sobre convergência registrado.' },
];

test('seleção é determinística — mesma entrada e mesmo corpus produzem sempre o mesmo resultado (H)', () => {
  const necessidade = { pergunta: 'O que houve com convergência?', objetivo: 'Entender convergência.' };
  const resultado1 = selecionarEvidencias(documentosFixture, necessidade);
  const resultado2 = selecionarEvidencias(documentosFixture, necessidade);
  assert.deepEqual(
    resultado1.incluidos.map((d) => d.fonte),
    resultado2.incluidos.map((d) => d.fonte)
  );
});

test('inclusão segue correspondência textual simples contra pergunta/objetivo', () => {
  const { incluidos } = selecionarEvidencias(documentosFixture, {
    pergunta: 'convergência',
    objetivo: '',
  });
  const fontes = incluidos.map((d) => d.fonte).sort();
  assert.deepEqual(fontes, ['b/doc2.md', 'c/doc3.md']);
});

test('resultado é ordenado por path, independente da ordem de entrada', () => {
  const { incluidos } = selecionarEvidencias(documentosFixture, {
    pergunta: 'convergência',
    objetivo: '',
  });
  assert.deepEqual(incluidos.map((d) => d.fonte), ['b/doc2.md', 'c/doc3.md']);
});

test('sem termos relevantes na pergunta/objetivo, nenhuma evidência é incluída', () => {
  const { incluidos } = selecionarEvidencias(documentosFixture, { pergunta: 'a e', objetivo: '' });
  assert.equal(incluidos.length, 0);
});
