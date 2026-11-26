# Restaurante e Empório Cachoeira do Salto

Landing page estática do restaurante em Extrema, MG. Feita em HTML, CSS e JavaScript puros, sem frameworks e sem etapa de build.

## Visualizar localmente

Abra esta pasta no VS Code e clique em **Go Live** (extensão Live Server). Também funciona com qualquer servidor estático simples. Evite abrir o `index.html` diretamente com `file://`, porque o mapa embutido e o botão de copiar podem não funcionar.

## Estrutura

- `index.html` — páginas, seções e JSON-LD
- `css/style.css` — cores, layout e animações
- `js/main.js` — dados editáveis, calculadora, reserva pelo WhatsApp e selo de horário
- `images/` — fotos originais e `images/otimizadas/` (cópias em WebP)

## Edição rápida

O número de WhatsApp, os horários de funcionamento (`HORARIOS`), os preços do self-service (`PRECOS`) e o prato do dia ficam no topo de `js/main.js`, com comentários explicando como atualizar.

Horários confirmados: aberto todos os dias; almoço das 11h às 15h de segunda a sexta e das 11h às 17h aos sábados e domingos. Self-service à vontade: R$ 40 em dia de semana e R$ 50 no fim de semana.
