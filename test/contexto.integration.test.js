'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { construirContexto } = require('../src/contexto');
const { montarBlocoContexto } = require('../src/montagem');
const { serializarBlocoContexto } = require('../src/saida');
const { criarFixtureBaseCanonica } = require('./helpers/fixtureBaseCanonica');

test('fluxo completo: entrada -> descoberta -> seleção -> montagem produz bloco válido (F, G, H, I)', () => {
  const fixture = criarFixtureBaseCanonica();
  try {
    const bloco = construirContexto(
      { projeto: fixture.nomeProjeto, pergunta: 'convergência', objetivo: 'entender convergência' },
      { baseCanonicaDir: fixture.raiz }
    );

    assert.equal(bloco.projeto, fixture.nomeProjeto);
    assert.ok(bloco.evidencias.length > 0, 'evidências devem ter sido selecionadas para o termo do fixture');
    for (const evidencia of bloco.evidencias) {
      assert.ok(evidencia.fonte);
      assert.ok(evidencia.natureza);
    }
    assert.ok(Array.isArray(bloco.conflitos));
    assert.ok(Array.isArray(bloco.ausencia_evidencia));
    // formato não suportado do fixture (imagem.png) deve ter sido sinalizado, não omitido
    assert.ok(bloco.falhas_leitura && bloco.falhas_leitura.some((f) => f.includes('imagem.png')));
  } finally {
    fixture.limpar();
  }
});

test('corpus sem correspondência produz evidências vazias + ausência de evidência explícita', () => {
  const fixture = criarFixtureBaseCanonica();
  try {
    const bloco = construirContexto(
      { projeto: fixture.nomeProjeto, pergunta: 'zzzznadaencontravel', objetivo: 'zzzz' },
      { baseCanonicaDir: fixture.raiz }
    );
    assert.equal(bloco.evidencias.length, 0);
    assert.ok(bloco.ausencia_evidencia.length > 0);
  } finally {
    fixture.limpar();
  }
});

test('"próximo passo" não aparece em nenhum nível do bloco produzido pelo fluxo completo (R, S)', () => {
  const fixture = criarFixtureBaseCanonica();
  try {
    const bloco = construirContexto(
      { projeto: fixture.nomeProjeto, pergunta: 'convergência', objetivo: 'convergência' },
      { baseCanonicaDir: fixture.raiz }
    );
    const serializado = JSON.stringify(bloco);
    assert.ok(!/proximo[_ ]?passo|próximo[_ ]?passo|next[_ ]?step/i.test(serializado));
  } finally {
    fixture.limpar();
  }
});

test('fluxo completo é determinístico — 2 execuções produzem saída serializada byte-idêntica (P)', () => {
  const fixture = criarFixtureBaseCanonica();
  try {
    const entrada = {
      projeto: fixture.nomeProjeto,
      pergunta: 'convergência e arquitetura',
      objetivo: 'entender convergência',
    };
    const s1 = serializarBlocoContexto(
      construirContexto(entrada, { baseCanonicaDir: fixture.raiz })
    );
    const s2 = serializarBlocoContexto(
      construirContexto(entrada, { baseCanonicaDir: fixture.raiz })
    );
    assert.equal(s1, s2);
  } finally {
    fixture.limpar();
  }
});

test('β1 relay-only: sem conflito explicitamente declarado, o fluxo completo produz conflitos: [] (F)', () => {
  const fixture = criarFixtureBaseCanonica();
  try {
    const bloco = construirContexto(
      { projeto: fixture.nomeProjeto, pergunta: 'convergência', objetivo: 'convergência' },
      { baseCanonicaDir: fixture.raiz }
    );
    assert.ok(Array.isArray(bloco.conflitos));
    assert.equal(bloco.conflitos.length, 0);
  } finally {
    fixture.limpar();
  }
});

test('β1 relay-only: conflito entregue por fonte competente é transportado verbatim, sem adjudicação (K)', () => {
  const conflitoDeclarado = [
    {
      descricao: 'fontes/A e derivados/B divergem quanto a X (declarado pela fonte)',
      fontes: ['projetos/X/fontes/A.md', 'projetos/X/derivados/B.yaml'],
      posicoes: {
        'projetos/X/fontes/A.md': 'afirma X',
        'projetos/X/derivados/B.yaml': 'afirma Y',
      },
    },
  ];
  const bloco = montarBlocoContexto(
    { projeto: 'X', pergunta: 'p', objetivo: 'o' },
    { incluidos: [{ fonte: 'projetos/X/fontes/A.md', natureza: 'primaria', maturidade: 'Aceito', conteudo: 'x' }] },
    { conflitos: conflitoDeclarado }
  );
  assert.deepEqual(bloco.conflitos, conflitoDeclarado);
  for (const c of bloco.conflitos) {
    assert.ok(!('resolucao' in c));
    assert.ok(!('vencedor' in c));
    assert.deepEqual(Object.keys(c.posicoes).sort(), [
      'projetos/X/derivados/B.yaml',
      'projetos/X/fontes/A.md',
    ]);
  }
});

test('prova negativa de β2: dois documentos com valores diferentes NÃO são transformados em conflito pelo M02', () => {
  // Corpus temporário isolado (fora do repo), fora do fixture compartilhado.
  const raiz = fs.mkdtempSync(path.join(os.tmpdir(), 'mim-core-beta2-'));
  const proj = path.join(raiz, 'projetos', 'DemoB2');
  fs.mkdirSync(path.join(proj, 'fontes'), { recursive: true });
  fs.mkdirSync(path.join(proj, 'derivados'), { recursive: true });
  fs.writeFileSync(path.join(proj, 'manifesto.yaml'), 'nome: DemoB2\n');
  // Mesmo campo estruturado, valores DIFERENTES, nenhuma declaração de conflito:
  fs.writeFileSync(path.join(proj, 'fontes', 'a.yaml'), 'campo_x: AZUL\nassunto: cor\n');
  fs.writeFileSync(path.join(proj, 'derivados', 'b.yaml'), 'campo_x: VERMELHO\nassunto: cor\n');
  try {
    const bloco = construirContexto(
      { projeto: 'DemoB2', pergunta: 'cor', objetivo: 'cor' },
      { baseCanonicaDir: raiz }
    );
    assert.ok(bloco.evidencias.length >= 2, 'ambos os documentos devem ser recuperados');
    assert.deepEqual(bloco.conflitos, [], 'M02 não pode inventar conflito por comparação própria (β2 fora)');
  } finally {
    fs.rmSync(raiz, { recursive: true, force: true });
  }
});

test('ausencia_evidencia é acionada quando o fluxo completo seleciona zero evidências, sem juízo de suficiência', () => {
  const fixture = criarFixtureBaseCanonica();
  try {
    const bloco = construirContexto(
      { projeto: fixture.nomeProjeto, pergunta: 'zzzznadaencontravel', objetivo: 'zzzz' },
      { baseCanonicaDir: fixture.raiz }
    );
    assert.equal(bloco.evidencias.length, 0);
    assert.equal(bloco.ausencia_evidencia.length, 1);
    assert.match(bloco.ausencia_evidencia[0], /nenhuma evidência localizada/);
  } finally {
    fixture.limpar();
  }
});

test('estado ausente no fluxo completo vira sentinela "não determinado", distinta de ausência de evidência', () => {
  const fixture = criarFixtureBaseCanonica();
  try {
    const bloco = construirContexto(
      { projeto: fixture.nomeProjeto, pergunta: 'convergência', objetivo: 'convergência' },
      { baseCanonicaDir: fixture.raiz }
    );
    assert.equal(bloco.estado, 'não determinado');
    assert.equal(bloco.ausencia_evidencia.length, 0);
  } finally {
    fixture.limpar();
  }
});
