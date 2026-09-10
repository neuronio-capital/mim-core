'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { descobrirUniverso } = require('../src/descoberta');
const { criarFixtureBaseCanonica } = require('./helpers/fixtureBaseCanonica');

test('descoberta cobre fontes/ + derivados/ + timeline/ (F) e lê tudo antes de qualquer seleção (G)', () => {
  const fixture = criarFixtureBaseCanonica();
  try {
    const { documentos } = descobrirUniverso(fixture.raiz, fixture.nomeProjeto);
    const naturezas = new Set(documentos.map((d) => d.natureza));
    assert.ok(naturezas.has('primaria'));
    assert.ok(naturezas.has('derivada'));
    assert.ok(naturezas.has('timeline'));
    // 3 documentos elegíveis (.md/.yaml) no fixture — .gitkeep e .png excluídos
    assert.equal(documentos.length, 3);
    for (const documento of documentos) {
      assert.ok(documento.conteudo.length > 0, 'conteúdo deve ter sido lido por completo');
      assert.ok(documento.fonte);
      assert.ok(documento.maturidade);
    }
  } finally {
    fixture.limpar();
  }
});

test('proveniência (path/fonte) é preservada por documento (I)', () => {
  const fixture = criarFixtureBaseCanonica();
  try {
    const { documentos } = descobrirUniverso(fixture.raiz, fixture.nomeProjeto);
    const fontePrimaria = documentos.find((d) => d.natureza === 'primaria');
    assert.match(fontePrimaria.fonte, /^projetos\/ProjetoTeste\/fontes\//);
  } finally {
    fixture.limpar();
  }
});

test('maturidade não é promovida silenciosamente (J) — reflete rótulo real ou natureza da pasta', () => {
  const fixture = criarFixtureBaseCanonica();
  try {
    const { documentos } = descobrirUniverso(fixture.raiz, fixture.nomeProjeto);
    const fontePrimaria = documentos.find((d) => d.natureza === 'primaria');
    assert.equal(fontePrimaria.maturidade, 'Canônico'); // extraído do "Status:" real do fixture
    const derivado = documentos.find((d) => d.natureza === 'derivada');
    assert.equal(derivado.maturidade, 'derivada'); // sem Status explícito -> rótulo de natureza, nunca promovido
  } finally {
    fixture.limpar();
  }
});

test('.gitkeep e arquivos vazios são excluídos mecanicamente, sem virar falha', () => {
  const fixture = criarFixtureBaseCanonica();
  try {
    const { falhas } = descobrirUniverso(fixture.raiz, fixture.nomeProjeto);
    assert.ok(!falhas.some((f) => f.includes('.gitkeep')));
  } finally {
    fixture.limpar();
  }
});

test('formato não suportado é sinalizado explicitamente, nunca omitido silenciosamente (P)', () => {
  const fixture = criarFixtureBaseCanonica();
  try {
    const { falhas } = descobrirUniverso(fixture.raiz, fixture.nomeProjeto);
    assert.ok(falhas.some((f) => f.includes('imagem.png') && f.includes('não suportado')));
  } finally {
    fixture.limpar();
  }
});

test('projeto inexistente falha explicitamente, não silenciosamente', () => {
  const fixture = criarFixtureBaseCanonica();
  try {
    assert.throws(() => descobrirUniverso(fixture.raiz, 'ProjetoQueNaoExiste'), /Projeto inexistente/);
  } finally {
    fixture.limpar();
  }
});

test('pasta esperada ausente (ex.: sem timeline/) não é erro fatal — categoria vazia', () => {
  const fixture = criarFixtureBaseCanonica();
  try {
    const fs = require('fs');
    const path = require('path');
    fs.rmSync(path.join(fixture.raiz, 'projetos', fixture.nomeProjeto, 'timeline'), {
      recursive: true,
      force: true,
    });
    const { documentos } = descobrirUniverso(fixture.raiz, fixture.nomeProjeto);
    assert.ok(!documentos.some((d) => d.natureza === 'timeline'));
  } finally {
    fixture.limpar();
  }
});

// --- Contenção de path (correção do defeito de traversal) ---------------------

test('projeto legítimo (segmento único) continua resolvendo e lendo normalmente', () => {
  const fixture = criarFixtureBaseCanonica();
  try {
    const { documentos } = descobrirUniverso(fixture.raiz, fixture.nomeProjeto);
    assert.equal(documentos.length, 3);
  } finally {
    fixture.limpar();
  }
});

test('traversal com "../" é rejeitado explicitamente, sem ler fora do universo', () => {
  const fixture = criarFixtureBaseCanonica();
  try {
    assert.throws(
      () => descobrirUniverso(fixture.raiz, '../projetos/' + fixture.nomeProjeto),
      /Nome de projeto inválido/
    );
    assert.throws(() => descobrirUniverso(fixture.raiz, '../../..'), /Nome de projeto inválido/);
  } finally {
    fixture.limpar();
  }
});

test('traversal com separador Windows "..\\" é rejeitado explicitamente', () => {
  const fixture = criarFixtureBaseCanonica();
  try {
    assert.throws(
      () => descobrirUniverso(fixture.raiz, '..\\..\\segredo'),
      /Nome de projeto inválido/
    );
  } finally {
    fixture.limpar();
  }
});

test('caminho absoluto como projeto é rejeitado explicitamente', () => {
  const fixture = criarFixtureBaseCanonica();
  try {
    assert.throws(() => descobrirUniverso(fixture.raiz, 'C:\\Windows'), /Nome de projeto inválido/);
    assert.throws(() => descobrirUniverso(fixture.raiz, '/etc'), /Nome de projeto inválido/);
  } finally {
    fixture.limpar();
  }
});

test('segmento aninhado ("a/b"), "." e ".." são rejeitados explicitamente', () => {
  const fixture = criarFixtureBaseCanonica();
  try {
    assert.throws(() => descobrirUniverso(fixture.raiz, 'a/b'), /Nome de projeto inválido/);
    assert.throws(() => descobrirUniverso(fixture.raiz, '.'), /Nome de projeto inválido/);
    assert.throws(() => descobrirUniverso(fixture.raiz, '..'), /Nome de projeto inválido/);
    assert.throws(() => descobrirUniverso(fixture.raiz, ''), /Nome de projeto inválido/);
  } finally {
    fixture.limpar();
  }
});

test('projeto inexistente (segmento válido) continua falhando explicitamente', () => {
  const fixture = criarFixtureBaseCanonica();
  try {
    assert.throws(
      () => descobrirUniverso(fixture.raiz, 'ProjetoQueNaoExiste'),
      /Projeto inexistente/
    );
  } finally {
    fixture.limpar();
  }
});

test('escape via symlink/junction do diretório do projeto é bloqueado (contenção física)', (t) => {
  const fs = require('fs');
  const os = require('os');
  const path = require('path');
  const fixture = criarFixtureBaseCanonica();
  // "evil" fica FORA de base-canonica/, com estrutura compatível.
  const evilRaiz = fs.mkdtempSync(path.join(os.tmpdir(), 'mim-core-evil-'));
  const evilProj = path.join(evilRaiz, 'evil');
  fs.mkdirSync(path.join(evilProj, 'fontes'), { recursive: true });
  fs.writeFileSync(path.join(evilProj, 'manifesto.yaml'), 'nome: evil\n');
  fs.writeFileSync(path.join(evilProj, 'fontes', 'segredo.md'), '# SECRET\n\nconteudo sensivel\n');

  const linkPath = path.join(fixture.raiz, 'projetos', 'ViaLink');
  let linkCriado = false;
  try {
    try {
      fs.symlinkSync(evilProj, linkPath, 'junction');
      linkCriado = true;
    } catch (erro) {
      try {
        fs.symlinkSync(evilProj, linkPath, 'dir');
        linkCriado = true;
      } catch (_) {
        t.skip(
          'symlink/junction não pôde ser criado neste ambiente sem privilégio — implementação não enfraquecida; ver relatório'
        );
        return;
      }
    }

    assert.throws(
      () => descobrirUniverso(fixture.raiz, 'ViaLink'),
      /fora do universo autorizado/,
      'symlink/junction que aponta para fora de base-canonica/projetos/ deve ser bloqueado'
    );
  } finally {
    if (linkCriado) {
      try {
        fs.rmSync(linkPath, { recursive: true, force: true });
      } catch (_) {
        /* noop */
      }
    }
    fs.rmSync(evilRaiz, { recursive: true, force: true });
    fixture.limpar();
  }
});
