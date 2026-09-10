'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { construirEntrada, carregarEntradaDeArquivo } = require('../src/entrada');

test('constrói entrada válida com os três campos obrigatórios (A)', () => {
  const entrada = construirEntrada({
    projeto: 'FullCommerce',
    pergunta: 'Qual é o estado atual do projeto?',
    objetivo: 'Entender o estado atual.',
  });
  assert.equal(entrada.projeto, 'FullCommerce');
  assert.equal(entrada.pergunta, 'Qual é o estado atual do projeto?');
  assert.equal(entrada.objetivo, 'Entender o estado atual.');
});

test('objetivo é apenas transportado, nunca inferido (B)', () => {
  const objetivoOriginal = 'Objetivo textual arbitrário, nunca reescrito.';
  const entrada = construirEntrada({
    projeto: 'FullCommerce',
    pergunta: 'pergunta qualquer',
    objetivo: objetivoOriginal,
  });
  assert.equal(entrada.objetivo, objetivoOriginal);
});

test('rejeita entrada sem projeto/pergunta/objetivo', () => {
  assert.throws(() => construirEntrada({ pergunta: 'x', objetivo: 'y' }), /projeto/);
  assert.throws(() => construirEntrada({ projeto: 'x', objetivo: 'y' }), /pergunta/);
  assert.throws(() => construirEntrada({ projeto: 'x', pergunta: 'y' }), /objetivo/);
});

test('rejeita campos obrigatórios vazios ou de tipo inválido', () => {
  assert.throws(() => construirEntrada({ projeto: '  ', pergunta: 'y', objetivo: 'z' }), /projeto/);
  assert.throws(() => construirEntrada({ projeto: 1, pergunta: 'y', objetivo: 'z' }), /projeto/);
  assert.throws(() => construirEntrada(null));
  assert.throws(() => construirEntrada('nao é objeto'));
  assert.throws(() => construirEntrada(['array', 'nao objeto']));
});

test('estado fornecido é apenas transportado, sem reinterpretação (D)', () => {
  const entrada = construirEntrada({
    projeto: 'FullCommerce',
    pergunta: 'p',
    objetivo: 'o',
    estado: 'Milestone 03 em execução',
  });
  assert.equal(entrada.estado, 'Milestone 03 em execução');
});

test('estado nunca é inferido pela entrada (C) — chave ausente vira "não fornecido" (E)', () => {
  const entrada = construirEntrada({ projeto: 'FullCommerce', pergunta: 'p', objetivo: 'o' });
  assert.equal('estado' in entrada, false, 'estado não deve existir no objeto interno quando ausente');
});

test('estado explicitamente null/~ é normalizado para "não fornecido", nunca reutilizado ambiguamente', () => {
  const entrada = construirEntrada({ projeto: 'FullCommerce', pergunta: 'p', objetivo: 'o', estado: null });
  assert.equal('estado' in entrada, false);
});

test('estado presente porém vazio é rejeitado explicitamente (nunca confundido com ausência)', () => {
  assert.throws(
    () => construirEntrada({ projeto: 'FullCommerce', pergunta: 'p', objetivo: 'o', estado: '   ' }),
    /estado/
  );
});

test('"próximo passo" NUNCA aparece no objeto interno de entrada, mesmo se fornecido bruto (Q)', () => {
  const entrada = construirEntrada({
    projeto: 'FullCommerce',
    pergunta: 'p',
    objetivo: 'o',
    proximo_passo: 'valor que não deveria sobreviver',
    próximo_passo: 'idem',
    proximos_passos: 'idem',
    next_step: 'idem',
    'next step': 'idem',
  });
  const chaves = Object.keys(entrada);
  assert.deepEqual(chaves.sort(), ['objetivo', 'pergunta', 'projeto']);
  for (const chave of chaves) {
    assert.ok(!/proximo|próximo|next[_ ]?step/i.test(chave));
  }
});

test('YAML de entrada malformado falha explicitamente, sem silenciar (B)', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mim-core-entrada-badyaml-'));
  const arq = path.join(dir, 'entrada.yaml');
  try {
    fs.writeFileSync(arq, 'projeto: [unclosed\n');
    assert.throws(() => carregarEntradaDeArquivo(arq), /YAML de entrada malformado/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('arquivo de entrada inexistente falha explicitamente', () => {
  assert.throws(
    () => carregarEntradaDeArquivo(path.join(os.tmpdir(), 'nao-existe-mim-core-xyz.yaml')),
    /Arquivo de entrada não encontrado/
  );
});
