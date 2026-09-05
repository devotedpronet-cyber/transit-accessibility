# Planeador de Acessibilidade dos Transportes de Lisboa

🇬🇧 [Read in English](README.md)

## Contribuir

Este é um projeto de tecnologia cívica (civic-tech) e contribuições externas são bem-vindas. Ver [BACKLOG.md](BACKLOG.md) para trabalho em aberto e [CONTRIBUTING.pt-PT.md](CONTRIBUTING.pt-PT.md) para saber como começar.

## Problema

O sistema de transportes públicos de Lisboa carece de informação clara sobre acessibilidade. A maioria dos feeds GTFS na área de Lisboa (Carris Metropolitana, 12 752 paragens) simplesmente não têm dados fiáveis de acessibilidade a cadeira de rodas ao nível da paragem — apenas 19 estações de metro e 10 terminais fluviais têm uma bandeira "acessível" confirmada. As aplicações de transportes atuais não mostram isto de forma honesta, deixando os utilizadores sem conseguir planear as suas viagens com confiança.

## Solução

Um planeador de viagens que mostra as paragens de transporte mais próximas a partir de dados em tempo real da Carris Metropolitana e classifica cada uma honestamente: **known-accessible** (acesso confirmado a cadeira de rodas) ou **unknown** (sem dados — a grande maioria). Nunca inventa uma garantia falsa de acessibilidade. Introduza as suas coordenadas, veja as paragens próximas num mapa, ordenadas com as paragens confirmadas acessíveis primeiro.

## Funcionalidades

- **Dados de paragens em tempo real**: obtém as 12 752 paragens da API da Carris Metropolitana (sem necessidade de chave de API), com um ficheiro offline de reserva
- **Classificação honesta de acessibilidade**: cada paragem é `known-accessible` ou `unknown` — sem alegações falsas de acesso sem degraus
- **Pesquisa de paragens próximas**: encontre paragens dentro de uma distância configurável (2 km por defeito), com as paragens confirmadas acessíveis ordenadas primeiro
- **Vista de mapa**: mapa Leaflet com marcadores codificados por cor (cinzento para desconhecido, nunca um falso negativo a vermelho)
- **Cálculo de distância**: distância em tempo real a partir da sua localização
- **Interface simples**: sem login, sem registo, resultados instantâneos
- **Avisos de avarias em tempo real**: alertas ao vivo sobre elevadores/escadas rolantes fora de serviço nas estações de Metro

## Início rápido

```bash
npm install
npm test           # correr os testes com cobertura
open index.html    # abrir a aplicação no browser
```

## Estrutura de ficheiros

- `app.js` — lógica principal (cálculo de distância, pesquisa de paragens próximas, formatação de resultados)
- `app.test.js` — testes unitários
- `stops.js` — carrega dados de paragens em tempo real da API da Carris Metropolitana, com ficheiro offline de reserva
- `map.js` — renderização do mapa Leaflet
- `mapColors.js` — mapeamento de acessibilidade para cor/etiqueta dos marcadores do mapa
- `map.test.js` — testes de renderização do mapa
- `index.html` — interface do browser
- `docs/ARCHITECTURE.md` — justificação do desenho técnico

## Testes

Os testes cobrem:
- Precisão do cálculo de distância
- Pesquisa de paragens próximas e ordenação sensível à acessibilidade
- Tratamento de erros para coordenadas inválidas
- Formatação de resultados

Meta de cobertura: 70%+

## CI/CD

O GitHub Actions corre os testes em cada push para garantir qualidade.

## Deployment

Faça deploy no GitHub Pages ou em qualquer serviço de alojamento estático. Não é necessário backend.

## Próximos passos

1. Acompanhamento de autocarros em tempo real
2. Etiquetas de número de linha por paragem (precisa de um lookup cruzado com `/v2/lines`)
3. Dados de acessibilidade mais alargados à medida que os feeds GTFS a montante os forem adicionando

---

**Precisamos de ajuda técnica.** Ver a secção "🙋 Ajuda pedida: backend" em [BACKLOG.md](BACKLOG.md) — é o maior obstáculo ao progresso deste projeto.
