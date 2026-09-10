'use strict';

const yaml = require('js-yaml');

/**
 * Serializa o bloco de contexto final em YAML determinístico (Q1),
 * preservando a ordem de inserção das chaves (nunca reordenadas
 * alfabeticamente) e blocos multilinha legíveis. A mesma entrada de objeto
 * produz sempre a mesma string de saída.
 *
 * @param {Object} blocoContexto
 * @returns {string}
 */
function serializarBlocoContexto(blocoContexto) {
  return yaml.dump(blocoContexto, {
    sortKeys: false,
    lineWidth: -1,
    noRefs: true,
  });
}

module.exports = { serializarBlocoContexto };
