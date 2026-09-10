'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const yaml = require('js-yaml');
const { construirContexto } = require('../src/contexto');
const { serializarBlocoContexto } = require('../src/saida');
const { criarFixtureBaseCanonica } = require('./helpers/fixtureBaseCanonica');

const CAMINHO_CLI = path.join(__dirname, '..', 'bin', 'context-builder.js');

function executarCli(caminhoEntrada, baseCanonicaDir) {
  return execFileSync(process.execPath, [CAMINHO_CLI, caminhoEntrada], {
    env: { ...process.env, MIM_BASE_CANONICA_DIR: baseCanonicaDir },
    encoding: 'utf8',
  });
}

test('CLI e chamada interna produzem resultado equivalente (O)', () => {
  const fixture = criarFixtureBaseCanonica();
  const arquivoEntrada = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'mim-core-entrada-')), 'entrada.yaml');
  try {
    const entradaBruta = { projeto: fixture.nomeProjeto, pergunta: 'convergência', objetivo: 'convergência' };
    fs.writeFileSync(arquivoEntrada, yaml.dump(entradaBruta));

    const saidaCli = executarCli(arquivoEntrada, fixture.raiz);

    const blocoInterno = construirContexto(entradaBruta, { baseCanonicaDir: fixture.raiz });
    const saidaInterna = serializarBlocoContexto(blocoInterno);

    assert.equal(saidaCli, saidaInterna);
  } finally {
    fixture.limpar();
    fs.rmSync(path.dirname(arquivoEntrada), { recursive: true, force: true });
  }
});

test('CLI falha explicitamente (exit code != 0) para arquivo de entrada inexistente', () => {
  assert.throws(() => executarCli('caminho/que/nao/existe.yaml', process.cwd()));
});

test('CLI falha explicitamente para campo obrigatório ausente', () => {
  const dirTemp = fs.mkdtempSync(path.join(os.tmpdir(), 'mim-core-entrada-invalida-'));
  const arquivoEntrada = path.join(dirTemp, 'entrada.yaml');
  try {
    fs.writeFileSync(arquivoEntrada, yaml.dump({ pergunta: 'p', objetivo: 'o' }));
    assert.throws(() => executarCli(arquivoEntrada, process.cwd()));
  } finally {
    fs.rmSync(dirTemp, { recursive: true, force: true });
  }
});

test('CLI falha explicitamente (exit != 0) para YAML de entrada malformado', () => {
  const dirTemp = fs.mkdtempSync(path.join(os.tmpdir(), 'mim-core-entrada-badyaml-'));
  const arquivoEntrada = path.join(dirTemp, 'entrada.yaml');
  try {
    fs.writeFileSync(arquivoEntrada, 'projeto: [unclosed\n');
    assert.throws(() => executarCli(arquivoEntrada, process.cwd()));
  } finally {
    fs.rmSync(dirTemp, { recursive: true, force: true });
  }
});

test('CLI falha explicitamente para tentativa de traversal no campo projeto', () => {
  const fixture = criarFixtureBaseCanonica();
  const dirTemp = fs.mkdtempSync(path.join(os.tmpdir(), 'mim-core-entrada-traversal-'));
  const arquivoEntrada = path.join(dirTemp, 'entrada.yaml');
  try {
    fs.writeFileSync(
      arquivoEntrada,
      yaml.dump({ projeto: '../../..', pergunta: 'p', objetivo: 'o' })
    );
    assert.throws(() => executarCli(arquivoEntrada, fixture.raiz));
  } finally {
    fixture.limpar();
    fs.rmSync(dirTemp, { recursive: true, force: true });
  }
});
