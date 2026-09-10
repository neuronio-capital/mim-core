#!/usr/bin/env node
'use strict';

const { carregarEntradaDeArquivo } = require('../src/entrada');
const { construirContexto } = require('../src/contexto');
const { serializarBlocoContexto } = require('../src/saida');

/**
 * CLI fina (Q2): recebe/localiza o arquivo de entrada, constrói o objeto
 * interno e delega integralmente à lógica do Context Builder
 * (src/contexto.js). Não contém lógica substantiva de descoberta, seleção,
 * autoridade, conflito ou montagem — apenas orquestra I/O de borda.
 *
 * @param {string[]} argv
 */
function main(argv) {
  const caminhoEntrada = argv[2];
  if (!caminhoEntrada) {
    process.stderr.write('Uso: context-builder.js <caminho-arquivo-entrada.yaml>\n');
    process.exitCode = 1;
    return;
  }

  let entrada;
  try {
    entrada = carregarEntradaDeArquivo(caminhoEntrada);
  } catch (erro) {
    process.stderr.write(`${erro.message}\n`);
    process.exitCode = 1;
    return;
  }

  let bloco;
  try {
    bloco = construirContexto(entrada);
  } catch (erro) {
    process.stderr.write(`${erro.message}\n`);
    process.exitCode = 1;
    return;
  }

  process.stdout.write(serializarBlocoContexto(bloco));
}

if (require.main === module) {
  main(process.argv);
}

module.exports = { main };
