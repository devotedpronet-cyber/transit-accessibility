# Planeador de Acessibilidade dos Transportes de Lisboa

🇬🇧 [Read in English](README.md)

## Contribuir

Este é um projeto de tecnologia cívica (civic-tech) e contribuições externas são bem-vindas. Ver [BACKLOG.md](BACKLOG.md) para trabalho em aberto e [CONTRIBUTING.pt-PT.md](CONTRIBUTING.pt-PT.md) para saber como começar.

## Problema

O sistema de transportes públicos de Lisboa carece de informação clara sobre acessibilidade. A maioria dos feeds GTFS na área de Lisboa (Carris Metropolitana, 12 752 paragens) simplesmente não têm dados fiáveis de acessibilidade a cadeira de rodas ao nível da paragem. As aplicações de transportes atuais não mostram isto de forma honesta, deixando os utilizadores sem conseguir planear as suas viagens com confiança.

## Solução

Um planeador de viagens que mostra as paragens de transporte mais próximas a partir de dados em tempo real da Carris Metropolitana e classifica cada uma honestamente: **known-accessible** (confirmado por fonte oficial ou por validação cruzada com dados OSM) ou **unknown** (sem dados — a grande maioria). Nunca inventa uma garantia falsa de acessibilidade. Introduza uma morada (ou use GPS), veja as paragens acessíveis próximas num mapa, e obtenha uma ligação direta ao Google Maps entre a paragem acessível mais próxima em cada ponta da viagem.

Atualmente confirmadas como acessíveis: 41 de 47 estações de metro, 9 terminais fluviais, 135 paragens de autocarro/elétrico (em toda a cidade, de um total de 12 752 paragens da Carris) — ver [stops.js](stops.js) para as fontes e a [issue #3](https://github.com/devotedpronet-cyber/transit-accessibility/issues/3) para o método de validação cruzada.

## Funcionalidades

- **Dados de paragens em tempo real**: obtém as 12 752 paragens da API da Carris Metropolitana (sem necessidade de chave de API), com um ficheiro offline de reserva
- **Classificação honesta de acessibilidade**: cada paragem é `known-accessible` ou `unknown` — sem alegações falsas de acesso sem degraus; paragens não confirmadas nunca são mostradas no mapa
- **Pesquisa por morada com autocompletar**: origem/destino em texto livre via geocodificação Photon/Komoot, ou GPS
- **Encaminhamento para a paragem acessível mais próxima**: encontra a paragem confirmada acessível mais próxima em cada ponta da viagem e encaminha para uma ligação direta ao Google Maps para as direções de transporte reais
- **Marcadores por modo de transporte**: ícones de autocarro/metro/ferry no mapa e nos resultados
- **Sobreposição de avarias de elevadores/escadas rolantes em tempo real**: `dashboard.html` mostra equipamento fora de serviço em tempo real (dados do Metro de Lisboa via um poller gratuito do GitHub Actions); os marcadores do mapa avisam quando o elevador de uma paragem está avariado
- **i18n em 7 idiomas**: EN, PT-PT, FR, ES, DE, PL, UK
- **Protótipo de encaminhamento pedonal**: `sidewalkRouting.js` — um protótipo A* sensível a rebaixamentos de passeio, sobre dados OSM reais para um cluster piloto, ainda não integrado na interface principal (ver [issue #6](https://github.com/devotedpronet-cyber/transit-accessibility/issues/6))
- **Interface simples**: sem login, sem registo, layout mobile-first em folha inferior (bottom-sheet)

## Início rápido

```bash
npm install
npm test           # correr os testes com cobertura
open index.html    # abrir a aplicação no browser
```

## Estrutura de ficheiros

- `app.js` — lógica principal (cálculo de distância, pesquisa de paragens próximas, formatação de resultados)
- `stops.js` — carrega dados de paragens em tempo real da API da Carris Metropolitana, com ficheiro offline de reserva e as sobreposições de validação cruzada de acessibilidade
- `map.js` / `mapColors.js` — renderização do mapa Leaflet e mapeamento de acessibilidade/modo para cor
- `elevatorStatus.js` — polling de avarias de elevadores/escadas rolantes em tempo real e correspondência por paragem
- `sidewalkRouting.js` — protótipo A* sensível a rebaixamentos de passeio (âmbito piloto, ver acima)
- `index.html` — interface principal do browser
- `dashboard.html` — dashboard de avarias de elevadores/escadas rolantes em tempo real
- `*.test.js` — testes unitários para cada módulo acima
- `docs/ARCHITECTURE.md` — justificação do desenho técnico

## Testes

Os testes cobrem cálculo de distância, pesquisa de paragens próximas e ordenação sensível à acessibilidade, tratamento de erros, formatação de resultados, renderização do mapa, correspondência de avarias de elevadores, e o grafo/pathfinding do protótipo de encaminhamento pedonal.

Meta de cobertura: 70%+ (atualmente ~98%)

## CI/CD

O GitHub Actions corre os testes em cada push para garantir qualidade, mais um poller agendado para o estado em tempo real dos elevadores/escadas rolantes.

## Deployment

Faça deploy no GitHub Pages ou em qualquer serviço de alojamento estático. Não é necessário backend.

## Próximos passos

Ver [BACKLOG.md](BACKLOG.md) e as [issues em aberto](https://github.com/devotedpronet-cyber/transit-accessibility/issues) para as prioridades atuais — principalmente fechar a lacuna restante de acessibilidade nas estações de metro (precisa de uma parceria de dados ou uma lista oficial atualizada) e decidir se/como escalar o protótipo de encaminhamento pedonal a toda a cidade.

---

**Precisamos de ajuda técnica.** Ver a secção "🙋 Ajuda pedida: backend" em [BACKLOG.md](BACKLOG.md) — é o maior obstáculo ao progresso deste projeto.
