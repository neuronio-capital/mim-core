'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

/**
 * Cria uma Base Canônica sintética mínima, fora do repositório (em
 * os.tmpdir()), para uso exclusivo em testes — nunca altera
 * base-canonica/ real. Devolve o diretório raiz e uma função de limpeza.
 */
function criarFixtureBaseCanonica() {
  const raiz = fs.mkdtempSync(path.join(os.tmpdir(), 'mim-core-fixture-'));
  const projetoDir = path.join(raiz, 'projetos', 'ProjetoTeste');

  fs.mkdirSync(path.join(projetoDir, 'fontes', 'ADRs'), { recursive: true });
  fs.mkdirSync(path.join(projetoDir, 'fontes', 'DocumentosCanonicos'), { recursive: true });
  fs.mkdirSync(path.join(projetoDir, 'derivados'), { recursive: true });
  fs.mkdirSync(path.join(projetoDir, 'timeline'), { recursive: true });
  fs.mkdirSync(path.join(projetoDir, 'indices'), { recursive: true });

  fs.writeFileSync(
    path.join(projetoDir, 'manifesto.yaml'),
    'nome: ProjetoTeste\nversao: v0\nstatus: teste\n'
  );

  fs.writeFileSync(
    path.join(projetoDir, 'fontes', 'ADRs', 'ADR-000-teste.md'),
    '# ADR-000 — Teste\n\n- **Status:** Canônico\n\nConteúdo sobre convergência e arquitetura de testes.\n'
  );

  fs.writeFileSync(
    path.join(projetoDir, 'derivados', 'EstadoAtual.yaml'),
    'projeto: ProjetoTeste\nmilestone_atual: "Fase de testes automatizados em andamento."\n'
  );

  fs.writeFileSync(
    path.join(projetoDir, 'timeline', '2026-01-01-evento.md'),
    '# 2026-01-01 — Evento de teste\n\nRegistro de linha do tempo sobre convergência.\n'
  );

  // artefatos que devem ser excluídos mecanicamente, não como falha
  fs.writeFileSync(path.join(projetoDir, 'fontes', 'DocumentosCanonicos', '.gitkeep'), '');
  fs.writeFileSync(path.join(projetoDir, 'indices', '.gitkeep'), '');

  // formato não suportado dentro do universo — deve virar falha explícita
  fs.writeFileSync(path.join(projetoDir, 'fontes', 'imagem.png'), Buffer.from([0x89, 0x50, 0x4e, 0x47]));

  function limpar() {
    fs.rmSync(raiz, { recursive: true, force: true });
  }

  return { raiz, nomeProjeto: 'ProjetoTeste', limpar };
}

module.exports = { criarFixtureBaseCanonica };
