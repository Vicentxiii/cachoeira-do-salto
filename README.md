# Restaurante e Empório Cachoeira do Salto

Landing page estática do restaurante em Extrema, MG. Feita em HTML, CSS e JavaScript puros, sem frameworks e sem etapa de build.

## Visualizar localmente

Abra esta pasta no VS Code e clique em **Go Live** (extensão Live Server). Também funciona com qualquer servidor estático simples. Evite abrir o `index.html` diretamente com `file://`, porque o mapa embutido e o botão de copiar podem não funcionar.

## Estrutura

- `index.html` — páginas, seções e JSON-LD
- `css/style.css` — cores, layout e animações
- `js/main.js` — dados editáveis, calculadora, reserva pelo WhatsApp, selo de horário e mapa 3D com Mapbox GL JS
- `images/` — fotos originais e `images/otimizadas/` (cópias em WebP)

## Edição rápida

O número de WhatsApp, os horários de funcionamento (`HORARIOS`), os feriados (`FERIADOS_FIXOS`), os preços do self-service (`PRECOS`) e o prato do dia ficam no topo de `js/main.js`, com comentários explicando como atualizar.

Horários confirmados: aberto todos os dias; almoço das 11h às 15h de segunda a sexta e das 11h às 17h aos sábados, domingos e feriados. Self-service à vontade: R$ 40 em dia de semana e R$ 50 no fim de semana ou feriado. Crianças de 5 a 12 anos pagam metade do preço; a calculadora soma adultos e crianças separadamente.

Para incluir um feriado local no selo "Aberto agora", adicione a data no formato `MM-DD` em `FERIADOS_FIXOS`. Feriados móveis (Carnaval, Sexta-feira Santa e Corpus Christi) são calculados automaticamente pela Páscoa.

O mapa 3D usa Mapbox GL JS via CDN (projeto sem build) e precisa de internet. O token público e as coordenadas ficam no topo da seção "Mapa 3D" em `js/main.js`. Se o geocoding não encontrar a Estrada Bela Vista, o mapa usa as coordenadas exatas `-22.848289, -46.2699398`.
