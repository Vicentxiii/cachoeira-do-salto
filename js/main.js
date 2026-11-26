(function () {
  'use strict';

  /* =========================================================
     EDITE AQUI — dados que mudam com frequência
     ========================================================= */

  // Número de WhatsApp com DDI e DDD, somente dígitos (confirmado).
  // Todas as links de WhatsApp da página são montadas a partir desta única constante.
  var WHATSAPP_NUMBER = '5511979860261';

  // Horários de funcionamento (confirmados): aberto todos os dias.
  // Formato: { abre: 'HH:MM', fecha: 'HH:MM' }. Use null para um dia sem horário confirmado.
  // Para um dia que nunca abre, use { fechado: true }.
  var HORARIOS = {
    seg: { abre: '11:00', fecha: '15:00' },
    ter: { abre: '11:00', fecha: '15:00' },
    qua: { abre: '11:00', fecha: '15:00' },
    qui: { abre: '11:00', fecha: '15:00' },
    sex: { abre: '11:00', fecha: '15:00' },
    sab: { abre: '11:00', fecha: '17:00' },
    dom: { abre: '11:00', fecha: '17:00' }
  };

  // PRATO DO DIA — como o Leo atualiza:
  // 1) Edite este array PRATOS_DO_DIA, logo aqui no topo de js/main.js.
  // 2) Cada item segue o formato:
  //      { nome: 'Feijoada com couve', descricao: 'Servida com arroz, farofa e laranja.' }
  // 3) Use uma descrição curta (uma linha). Para esconder o bloco, deixe o array vazio: [].
  // 4) Não precisa mexer no HTML nem rodar build: salve o arquivo e recarregue a página.
  // Enquanto o array estiver vazio, o bloco "Hoje no fogão" fica invisível.
  var PRATOS_DO_DIA = [];

  // Preço do self-service (comida à vontade) por pessoa. A calculadora troca
  // o valor quando a pessoa seleciona "Dia de semana" ou "Fim de semana".
  var PRECOS = {
    semana: 40,
    fds: 50
  };

  // Links diretos das avaliações no Google, na mesma ordem dos cards.
  // Copie o link de cada avaliação no Google Maps e cole aqui.
  // Com '' (vazio), o card abre a página de avaliações do restaurante.
  var REVIEW_LINKS = ['', '', '', '', ''];
  var URL_AVALIACOES = 'https://www.google.com/maps/place/?q=place_id:ChIJR6-Qm2OrzpQRdvUmJ9u0VYQ';

  /* =========================================================
     Fim da área de edição
     ========================================================= */

  // Brasas do hero e do rodapé (mesmo efeito, em escalas diferentes)
  function criarBrasas(id, quantidade) {
    var box = document.getElementById(id);
    if (!box) return;
    for (var i = 0; i < quantidade; i++) {
      var s = document.createElement('span');
      s.className = 'ember';
      var size = 3 + (i % 4) * 2;
      s.style.left = ((i * 37 + 8) % 62) + 'vw';
      s.style.bottom = (-10 + (i % 5) * 18) + 'px';
      s.style.width = size + 'px';
      s.style.height = size + 'px';
      s.style.animationDuration = (6 + (i % 7) * 1.3).toFixed(1) + 's';
      s.style.animationDelay = '-' + ((i * 0.83) % 8).toFixed(1) + 's';
      box.appendChild(s);
    }
  }
  criarBrasas('embers', 26);
  criarBrasas('embers-footer', 16);

  // Calculadora de grupo (mantida)
  var pessoas = 4, dia = 'semana';
  var elPessoas = document.getElementById('pessoas');
  var elTotal = document.getElementById('total');
  var elDica = document.getElementById('dica');
  var elPrecoNota = document.getElementById('preco-nota');
  var fmt = function (n) { return 'R$ ' + n.toLocaleString('pt-BR'); };
  var dicas = {
    semana: 'Dia de semana: as avaliações não apontam fila. Almoço das 11h às 15h.',
    fds: 'As avaliações citam fila nos fins de semana por causa de excursões. Chegue cedo: o almoço vai das 11h às 17h.'
  };

  function render() {
    var preco = PRECOS[dia];
    elPessoas.textContent = pessoas;
    elTotal.textContent = fmt(pessoas * preco);
    elDica.textContent = dicas[dia];
    if (elPrecoNota) {
      elPrecoNota.textContent = 'Self-service a ' + fmt(preco) + ' por pessoa, à vontade. Pode repetir quantos pratos quiser.';
    }
    document.querySelectorAll('.seg').forEach(function (b) {
      var on = b.getAttribute('data-dia') === dia;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  if (elPessoas && elTotal && elDica && document.getElementById('mais') && document.getElementById('menos')) {
    function mudarPessoas(delta) {
      pessoas = Math.min(40, Math.max(1, pessoas + delta));
      render();
    }

    // Um toque conta na hora; se a pessoa segurar, acelera sozinho.
    function configurarStepper(botao, delta) {
      if (!botao) return;
      if (!window.PointerEvent) {
        botao.addEventListener('click', function () { mudarPessoas(delta); });
        return;
      }
      var espera = null, repeticao = null;
      function parar() {
        if (espera) { clearTimeout(espera); espera = null; }
        if (repeticao) { clearInterval(repeticao); repeticao = null; }
      }
      botao.addEventListener('pointerdown', function (event) {
        if (event.pointerType === 'mouse' && event.button !== 0) return;
        event.preventDefault(); // evita o duplo toque dar zoom e a seleção de texto
        mudarPessoas(delta);
        espera = setTimeout(function () {
          repeticao = setInterval(function () { mudarPessoas(delta); }, 110);
        }, 350);
      });
      ['pointerup', 'pointercancel', 'pointerleave', 'blur'].forEach(function (nome) {
        botao.addEventListener(nome, parar);
      });
      // Enter/Espaço no teclado também contam como um toque.
      botao.addEventListener('click', function (event) {
        if (event.detail === 0) mudarPessoas(delta);
      });
    }

    configurarStepper(document.getElementById('mais'), 1);
    configurarStepper(document.getElementById('menos'), -1);
    document.querySelectorAll('.seg').forEach(function (b) {
      b.addEventListener('click', function () { dia = b.getAttribute('data-dia'); render(); });
    });
    render();
  }

  // As demais citações de preço na página usam a mesma constante PRECOS.
  document.querySelectorAll('[data-preco-resumo]').forEach(function (el) {
    el.textContent = fmt(PRECOS.semana) + ' na semana · ' + fmt(PRECOS.fds) + ' no fim de semana';
  });
  document.querySelectorAll('[data-preco-detalhe]').forEach(function (el) {
    el.textContent = fmt(PRECOS.semana) + ' por pessoa em dia de semana e ' + fmt(PRECOS.fds) + ' aos fins de semana, à vontade. Pode repetir quantos pratos quiser.';
  });

  /* ---------- Avaliações: links diretos e carrossel ---------- */
  document.querySelectorAll('[data-review-index]').forEach(function (link) {
    var i = parseInt(link.getAttribute('data-review-index'), 10);
    var url = REVIEW_LINKS[i];
    if (url) link.setAttribute('href', url);
  });

  var carousel = document.getElementById('reviews-carousel');
  if (carousel) {
    document.querySelectorAll('[data-review-scroll]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var card = carousel.querySelector('.quote');
        var passo = card ? card.getBoundingClientRect().width + 20 : 340;
        var dir = parseInt(btn.getAttribute('data-review-scroll'), 10);
        if (carousel.scrollBy) {
          carousel.scrollBy({ left: dir * passo, behavior: 'smooth' });
        } else {
          carousel.scrollLeft += dir * passo;
        }
      });
    });
  }

  /* ---------- WhatsApp: uma única constante ---------- */
  function waUrl(texto) {
    var url = 'https://wa.me/' + WHATSAPP_NUMBER;
    return texto ? url + '?text=' + encodeURIComponent(texto) : url;
  }

  document.querySelectorAll('[data-wa]').forEach(function (link) {
    link.setAttribute('href', waUrl());
  });

  // Texto do telefone também sai da mesma constante.
  function numeroParaExibir() {
    var d = String(WHATSAPP_NUMBER).replace(/\D/g, '');
    if (d.length > 11 && d.slice(0, 2) === '55') d = d.slice(2);
    if (d.length < 10) return d;
    var ddd = d.slice(0, 2);
    var resto = d.slice(2);
    return '(' + ddd + ') ' + resto.slice(0, resto.length - 4) + '-' + resto.slice(-4);
  }

  document.querySelectorAll('[data-wa-numero]').forEach(function (el) {
    el.textContent = numeroParaExibir();
  });

  // Botão "Ligar": mesmo número, em formato de telefone.
  document.querySelectorAll('[data-tel]').forEach(function (link) {
    link.setAttribute('href', 'tel:+' + String(WHATSAPP_NUMBER).replace(/\D/g, ''));
  });

  // "Enviar local no WhatsApp": mensagem pronta com endereço, Plus Code e rota.
  var mensagemLocal = [
    'Restaurante e Empório Cachoeira do Salto',
    'Endereço: Estr. Bela Vista, Extrema – MG, 37640-000',
    'Plus Code: 5P2J+M2 Extrema',
    'Google Maps: https://www.google.com/maps/dir/?api=1&destination=-22.848289,-46.2699398'
  ].join('\n');

  document.querySelectorAll('[data-wa-local]').forEach(function (link) {
    link.setAttribute('href', waUrl(mensagemLocal));
  });

  /* ---------- Selo "Aberto agora" (fuso America/Sao_Paulo) ---------- */
  var SEMANA = { Mon: 'seg', Tue: 'ter', Wed: 'qua', Thu: 'qui', Fri: 'sex', Sat: 'sab', Sun: 'dom' };
  var NOMES_DIA = { seg: 'segunda', ter: 'terça', qua: 'quarta', qui: 'quinta', sex: 'sexta', sab: 'sábado', dom: 'domingo' };
  var ORDEM = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'];

  var fmtDia = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', weekday: 'short' });
  var fmtHora = new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
  });

  function agoraEmSP() {
    var agora = new Date();
    return {
      dia: SEMANA[fmtDia.format(agora)],
      hora: fmtHora.format(agora)
    };
  }

  function proximaAbertura(diaAtual) {
    var i = ORDEM.indexOf(diaAtual);
    for (var passo = 1; passo <= 7; passo++) {
      var chave = ORDEM[(i + passo) % 7];
      var h = HORARIOS[chave];
      if (h && h.abre) {
        return (passo === 1 ? 'amanhã' : NOMES_DIA[chave]) + ' às ' + h.abre;
      }
    }
    return null;
  }

  function atualizarBadges() {
    var agora = agoraEmSP();
    var h = HORARIOS[agora.dia];
    var texto, estado;

    if (h && h.fechado) {
      texto = 'Fechado hoje · ' + NOMES_DIA[agora.dia] + ' não abre';
      estado = 'is-closed';
    } else if (!h || !h.abre || !h.fecha) {
      texto = 'Confirme o horário pelo WhatsApp';
      estado = 'is-unknown';
    } else if (agora.hora >= h.abre && agora.hora < h.fecha) {
      texto = 'Aberto agora · fecha às ' + h.fecha;
      estado = 'is-open';
    } else {
      var abertura = proximaAbertura(agora.dia);
      texto = 'Fechado · abre ' + (abertura || '[CONFIRMAR]');
      estado = 'is-closed';
    }

    document.querySelectorAll('[data-open-badge]').forEach(function (el) {
      if (el.textContent !== texto) el.textContent = texto;
      var cls = 'open-badge ' + estado;
      if (el.className !== cls) el.className = cls;
    });
  }

  if (document.querySelector('[data-open-badge]')) {
    atualizarBadges();
    window.setInterval(atualizarBadges, 60000);
  }

  /* ---------- Reserva para grupo pelo WhatsApp ---------- */
  var formGrupo = document.getElementById('form-grupo');
  if (formGrupo) {
    var campoData = document.getElementById('g-data');
    var status = document.getElementById('form-status');

    function hojeEmSP() {
      var partes = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit'
      }).formatToParts(new Date());
      var p = {};
      partes.forEach(function (x) { p[x.type] = x.value; });
      return p.year + '-' + p.month + '-' + p.day;
    }

    function dataParaBR(valor) {
      var p = valor.split('-');
      return p[2] + '/' + p[1] + '/' + p[0];
    }

    campoData.min = hojeEmSP();
    campoData.addEventListener('input', function () {
      campoData.setCustomValidity('');
      status.textContent = '';
    });

    formGrupo.addEventListener('submit', function (event) {
      event.preventDefault();
      status.textContent = '';

      if (!formGrupo.checkValidity()) {
        status.textContent = 'Confira os campos destacados antes de continuar.';
        var invalido = formGrupo.querySelector(':invalid');
        if (invalido) invalido.focus();
        formGrupo.reportValidity();
        return;
      }

      var hoje = hojeEmSP();
      if (campoData.value < hoje) {
        campoData.setCustomValidity('A data não pode ser no passado.');
        campoData.reportValidity();
        status.textContent = 'Escolha uma data de hoje em diante.';
        campoData.focus();
        return;
      }
      campoData.setCustomValidity('');

      var nome = document.getElementById('g-nome').value.trim();
      var pessoasGrupo = document.getElementById('g-pessoas').value.trim();
      var data = dataParaBR(campoData.value);
      var horario = document.getElementById('g-horario').value.trim();
      var obs = document.getElementById('g-obs').value.trim();

      var mensagem = [
        'Olá! Gostaria de reservar uma visita em grupo.',
        '',
        'Nome: ' + nome,
        'Pessoas: ' + pessoasGrupo,
        'Data: ' + data,
        'Horário de chegada: ' + horario,
        'Observações: ' + (obs || 'Nenhuma')
      ].join('\n');

      var novaJanela = window.open(waUrl(mensagem), '_blank', 'noopener,noreferrer');
      status.textContent = novaJanela
        ? 'Mensagem pronta! Confira no WhatsApp antes de enviar.'
        : 'Não foi possível abrir o WhatsApp. Permita pop-ups neste site e tente novamente.';
    });
  }

  /* ---------- Copiar endereço e Plus Code ---------- */
  var statusCopia = document.getElementById('copy-status');

  function copiarComFallback(texto, ok, falha) {
    var campo = document.createElement('textarea');
    campo.value = texto;
    campo.setAttribute('readonly', '');
    campo.style.position = 'fixed';
    campo.style.opacity = '0';
    document.body.appendChild(campo);
    campo.select();
    var sucesso = false;
    try { sucesso = document.execCommand('copy'); } catch (e) { sucesso = false; }
    document.body.removeChild(campo);
    sucesso ? ok() : falha();
  }

  document.querySelectorAll('[data-copy]').forEach(function (botao) {
    botao.addEventListener('click', function () {
      var alvo = document.getElementById(botao.getAttribute('data-copy'));
      if (!alvo || !statusCopia) return;
      var texto = alvo.textContent.trim();
      function ok() { statusCopia.textContent = 'Copiado: ' + texto; }
      function falha() { statusCopia.textContent = 'Não foi possível copiar. Selecione e copie o texto manualmente.'; }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(texto).then(ok, function () { copiarComFallback(texto, ok, falha); });
      } else {
        copiarComFallback(texto, ok, falha);
      }
    });
  });

  /* ---------- Prato do dia ---------- */
  var blocoDia = document.getElementById('prato-dia');
  if (blocoDia) {
    var listaDia = document.getElementById('prato-dia-lista');
    if (!Array.isArray(PRATOS_DO_DIA) || PRATOS_DO_DIA.length === 0) {
      blocoDia.hidden = true;
    } else {
      PRATOS_DO_DIA.forEach(function (prato) {
        var item = document.createElement('div');
        item.className = 'daily-item';
        var nome = document.createElement('div');
        nome.className = 'serif daily-item-nome';
        nome.textContent = prato && prato.nome ? prato.nome : '[CONFIRMAR]';
        var descricao = document.createElement('p');
        descricao.className = 'daily-item-desc';
        descricao.textContent = prato && prato.descricao ? prato.descricao : '';
        item.appendChild(nome);
        item.appendChild(descricao);
        listaDia.appendChild(item);
      });
      blocoDia.hidden = false;
    }
  }

  /* ---------- Mapa 3D (Mapbox GL JS) ---------- */
  var MAPBOX_TOKEN = 'pk.eyJ1IjoiYWdlbmNpYXYxM3ZpdmUiLCJhIjoiY213eTVsdnMyMDh2MDMwb2NvOWMyZWwwOCJ9.irbgB7wQ1wuJftihcpiUvw';
  var COORDS_EXATAS = [-46.2699398, -22.848289]; // [longitude, latitude]
  var ENDERECO_GEOCODE = 'Estrada Bela Vista, Extrema, MG, Brazil';

  // Centraliza via geocoding do Mapbox; se falhar, usa as coordenadas exatas.
  function buscarCentro(callback) {
    if (!window.fetch) { callback(COORDS_EXATAS); return; }
    var url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' +
      encodeURIComponent(ENDERECO_GEOCODE) + '.json?access_token=' +
      encodeURIComponent(MAPBOX_TOKEN) + '&limit=1&country=br';
    fetch(url)
      .then(function (resp) { return resp.ok ? resp.json() : null; })
      .then(function (dados) {
        var feature = dados && dados.features && dados.features[0];
        callback(feature && feature.center ? feature.center : COORDS_EXATAS);
      })
      .catch(function () { callback(COORDS_EXATAS); });
  }

  function iniciarMapa3D(centroInicial) {
    if (!document.getElementById('mapa-3d') || !window.mapboxgl) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;

    var mapa = new mapboxgl.Map({
      container: 'mapa-3d',
      style: 'mapbox://styles/mapbox/standard',
      center: centroInicial || COORDS_EXATAS,
      zoom: 13.5,
      pitch: 30,
      bearing: 0,
      antialias: true,
      attributionControl: false
    });

    mapa.addControl(new mapboxgl.NavigationControl({ showZoom: true, showCompass: true, visualizePitch: true }), 'top-right');
    mapa.addControl(new mapboxgl.FullscreenControl(), 'top-right');
    mapa.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-right');

    mapa.on('load', function () {
      try {
        mapa.addSource('mapbox-dem', {
          type: 'raster-dem',
          url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
          tileSize: 512,
          maxzoom: 14
        });
        mapa.setTerrain({ source: 'mapbox-dem', exaggeration: 1.4 });
      } catch (e) {}
      try {
        mapa.setFog({
          color: 'rgb(236, 227, 215)',
          'high-color': 'rgb(24, 38, 62)',
          'horizon-blend': 0.08,
          'space-color': 'rgb(11, 16, 28)',
          'star-intensity': 0.2
        });
        mapa.setConfigProperty('basemap', 'show3dObjects', true);
      } catch (e) {}

      var popup = new mapboxgl.Popup({ offset: 30, maxWidth: '260px', className: 'map-popup' })
        .setHTML(
          '<div class="popup-titulo">Restaurante e Empório Cachoeira do Salto</div>' +
          '<p class="popup-endereco">Estrada Bela Vista — Extrema, MG (37640-000)</p>' +
          '<a class="popup-rota" href="https://www.google.com/maps/dir/?api=1&destination=-22.848289,-46.2699398" target="_blank" rel="noopener noreferrer">Abrir rotas no Google Maps ↗</a>'
        );

      var pino = document.createElement('div');
      pino.className = 'map-pin';
      new mapboxgl.Marker({ element: pino, anchor: 'bottom' })
        .setLngLat(COORDS_EXATAS)
        .setPopup(popup)
        .addTo(mapa);

      window.setTimeout(function () {
        mapa.flyTo({
          center: COORDS_EXATAS,
          zoom: 15.5,
          pitch: 60,
          bearing: -25,
          duration: 4500,
          essential: true
        });
      }, 400);
    });
  }

  buscarCentro(iniciarMapa3D);
})();
