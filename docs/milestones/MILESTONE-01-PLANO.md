MIM-CORE — MILESTONE 01: BASE CANONICA

Contexto
Este é o primeiro milestone do mim-core, biblioteca de governança reutilizável da Neurônio Capital (não SaaS nesta fase). A arquitetura completa está definida no ADR-000 (anexo), status CONGELADO — não deve ser redesenhada neste milestone, apenas implementada.

Objetivo deste milestone
Construir apenas a Base Canônica: a estrutura de armazenamento versionado (Git + Markdown/YAML) que servirá de fonte de verdade para todos os outros componentes do mim-core (Context Builder, Motor de Convergência, etc., que virão em milestones futuros).

Não implementar neste milestone
* Context Builder;
* Motor de Convergência;
* Profundidade 3.0;
* Lateralidade;
* Sistema Circulatório;
* qualquer banco vetorial, fila, microserviço ou dependência além de Git/Markdown/YAML.

Escopo deste milestone
Criar a estrutura de pastas abaixo, usando o FullCommerce como primeiro projeto de exemplo dentro da Base Canônica. A estrutura separa explicitamente fontes (escritas por humanos) de derivados (gerados a partir das fontes) — ver ADR-000 para a justificativa:

mim-core/
  base-canonica/
    indice-global.yaml       (placeholder - só populado quando existir um 2o projeto)
    projetos/
      FullCommerce/
        manifesto.yaml
        fontes/
          Constituicao.md
          ADRs/
          DocumentosCanonicos/
        derivados/
          DNA.yaml
          Algoritmo.yaml
          EstadoAtual.yaml
        indices/            (pasta vazia - sem lógica de indexação neste milestone)
        timeline/

DNA.yaml e Algoritmo.yaml (em derivados/) devem seguir o formato de metadados estruturados definido no ADR-000. EstadoAtual.yaml deve registrar milestone atual, objetivo ativo e bloqueios conhecidos. manifesto.yaml é a porta de entrada do projeto (nome, versão, status, responsável, referências aos arquivos-chave). timeline/ usa arquivos prefixados por data (ex.: 2026-07-01-ADR000.md).

Importante: indices/ e indice-global.yaml são apenas placeholders estruturais neste milestone. Nenhuma lógica de geração de índice é implementada aqui — isso pertence aos Milestones 02 e 06.

Plano solicitado antes de implementar
1. Estrutura de pastas e arquivos proposta (pode refinar a acima).
2. Formato exato de cada arquivo (schema do YAML).
3. Como o conteúdo já existente do FullCommerce (Constituição, ADR-000/001/002, milestones) seria migrado para essa estrutura sem duplicar informação.
4. Critérios de aceitação: como saberemos que a Base Canônica está pronta e correta.
5. Plano de testes/validação.

Implementação
* Só implemente após minha aprovação explícita do plano.
* Siga a mesma disciplina de governança do FullCommerce: decisão -> aprovação -> implementação -> validação -> revisão -> commit -> push, sem pular etapas.
* Não execute git add / commit / push antes da validação e aprovação.
