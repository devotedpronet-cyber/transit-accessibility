# Como contribuir

🇬🇧 [Read in English](CONTRIBUTING.md)

Obrigado por considerar contribuir para o Planeador de Acessibilidade dos Transportes de Lisboa.

## Âmbito do projeto

Esta é uma aplicação web estática, pequena e com poucas dependências: JavaScript puro (módulos ES), Leaflet.js para mapas, sem bundler, publicada como ficheiros estáticos (GitHub Pages). Mantenha as alterações dentro desse espírito — evite introduzir um passo de build, uma framework ou um bundler, a menos que haja uma razão forte e isso seja discutido primeiro numa issue.

A regra central que molda quase todas as decisões aqui: **nunca inventar dados de acessibilidade**. Uma paragem é `known-accessible` (confirmada através de uma fonte oficial) ou `unknown`. Se não tiver a certeza se os dados a montante justificam mudar de `unknown` para `known-accessible`, abra uma issue primeiro.

## Começar

```bash
git clone <repo-url>
cd experiment1
npm install
npm test           # correr os testes com cobertura
open index.html    # abrir a aplicação no browser
```

Não são necessárias chaves de API — os dados das paragens vêm da API pública da Carris Metropolitana, com um ficheiro offline de reserva.

## Estrutura de ficheiros

- `app.js` — lógica principal (cálculo de distância, pesquisa de paragens próximas, formatação de resultados)
- `app.test.js` — testes unitários para `app.js`
- `stops.js` — carrega dados de paragens em tempo real da API da Carris Metropolitana, com ficheiro offline de reserva
- `map.js` — renderização do mapa Leaflet
- `mapColors.js` — mapeamento de acessibilidade para cor/etiqueta dos marcadores do mapa
- `map.test.js` — testes para `map.js`
- `index.html` — interface do browser (inclui strings traduzidas para 7 idiomas)
- `docs/ARCHITECTURE.md` — justificação do desenho técnico
- `WORK_PLAN_MOBILE.md` — backlog ativo e registo de progresso por fase

## Fazer alterações

1. Abra uma issue primeiro para qualquer coisa além de uma pequena correção — especialmente algo que toque nos dados de acessibilidade, no mapa ou nos textos da interface.
2. Escreva ou atualize testes para qualquer alteração de lógica em `app.js`, `map.js` ou `stops.js`. Meta de cobertura: 70%+.
3. Corra `npm test` antes de abrir um PR. O CI corre a mesma suite em cada push.
4. Se alterar textos da interface em `index.html`, atualize as 7 variantes de idioma, não apenas o inglês.
5. Mantenha os PRs focados — um assunto por PR é mais fácil de rever e mais fácil de reverter se algo correr mal.

## Alterações a dados de acessibilidade

Se estiver a adicionar ou corrigir uma entrada `known-accessible` em `stops.js`:

- Cite a fonte (anúncio oficial da autoridade de transportes, ou um nó/tag específico do OSM com `wheelchair=yes`).
- Se a sua fonte discordar de uma entrada existente, não a substitua silenciosamente — adicione um comentário a documentar o desacordo e em que fonte está a confiar, e porquê.
- Nunca marque uma paragem como `known-accessible` por inferência ou suposição. Em caso de dúvida, mantenha-a `unknown`.

## Reportar bugs / pedir funcionalidades

Abra uma issue no GitHub. Inclua os passos para reproduzir no caso de bugs, ou o caso de uso no caso de pedidos de funcionalidades.

## 🙋 Ajuda pedida: backend

A aplicação é atualmente um frontend estático (GitHub Pages) mais Firestore e um poller gratuito no GitHub Actions — ainda sem Cloud Functions pagas. É esse o teto que está a bloquear a Fase 5.5 (ver [BACKLOG.md](BACKLOG.md)), que precisa de um pequeno serviço de routing para cálculo de rotas em passeios/rebaixamentos de lancil. Se souber construir Firebase Functions / peças em Cloud Run, ou ajudar a cobrir o custo do plano Blaze caso o uso cresça, esta é a forma de maior impacto para desbloquear o projeto. Abra uma issue ou comente na [#6](https://github.com/devotedpronet-cyber/transit-accessibility/issues/6) para pegar nisto.
