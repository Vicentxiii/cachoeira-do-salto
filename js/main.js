(function () {
  'use strict';

  /* =========================================================
     EDITE AQUI — dados que mudam com frequência
     ========================================================= */

  // [CONFIRMAR] Número de WhatsApp com DDI e DDD, somente dígitos.
  // Este é o número que já estava no site; confirme com o cliente antes de publicar.
  // Todas as links de WhatsApp da página são montadas a partir desta única constante.
  var WHATSAPP_NUMBER = '5511979860261';

  // [CONFIRMAR] Horários de funcionamento.
  // Formato: { abre: 'HH:MM', fecha: 'HH:MM' }. Use null para um dia sem horário confirmado.
  // Para um dia que nunca abre, use { fechado: true }.
  // Exemplo: sex: { abre: '11:00', fecha: '18:00' }
  // Dia sem horário (null) faz o selo mostrar "Confirme o horário pelo WhatsApp".
  // Só sabemos, por enquanto, que à sexta o restaurante abre até as 18h;
  // o horário de abertura e os demais dias precisam ser confirmados.
  var HORARIOS = {
    // Segunda-feira nunca abre (confirmado pelo cliente).
    seg: { fechado: true },
    ter: null,
    qua: null,
    qui: null,
    sex: { abre: null, fecha: '18:00' },
    sab: null,
    dom: null
  };

  // PRATO DO DIA — como o Leo atualiza:
  // 1) Edite este array PRATOS_DO_DIA, logo aqui no topo de js/main.js.
  // 2) Cada item segue o formato:
  //      { nome: 'Feijoada com couve', descricao: 'Servida com arroz, farofa e laranja.' }
  // 3) Use uma descrição curta (uma linha). Para esconder o bloco, deixe o array vazio: [].
  // 4) Não precisa mexer no HTML nem rodar build: salve o arquivo e recarregue a página.
  // Enquanto o array estiver vazio, o bloco "Hoje no fogão" fica invisível.
  var PRATOS_DO_DIA = [];

  /* =========================================================
     Fim da área de edição
     ========================================================= */

  // Brasas do hero
  var box = document.getElementById('embers');
  if (box) {
    for (var i = 0; i < 26; i++) {
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

  // Calculadora de grupo (mantida)
  var pessoas = 4, dia = 'semana';
  var elPessoas = document.getElementById('pessoas');
  var elTotal = document.getElementById('total');
  var elDica = document.getElementById('dica');
  var fmt = function (n) { return 'R$ ' + n.toLocaleString('pt-BR'); };
  var dicas = {
    semana: 'Dia de semana: as avaliações não apontam fila. Confirme o horário antes de sair.',
    fds: 'As avaliações citam fila nos fins de semana por causa de excursões. Chegue mais cedo ou fora do horário de pico.'
  };

  function render() {
    elPessoas.textContent = pessoas;
    elTotal.textContent = fmt(pessoas * 40);
    elDica.textContent = dicas[dia];
    document.querySelectorAll('.seg').forEach(function (b) {
      var on = b.getAttribute('data-dia') === dia;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  if (elPessoas && elTotal && elDica && document.getElementById('mais') && document.getElementById('menos')) {
    document.getElementById('mais').addEventListener('click', function () { pessoas = Math.min(40, pessoas + 1); render(); });
    document.getElementById('menos').addEventListener('click', function () { pessoas = Math.max(1, pessoas - 1); render(); });
    document.querySelectorAll('.seg').forEach(function (b) {
      b.addEventListener('click', function () { dia = b.getAttribute('data-dia'); render(); });
    });
    render();
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
})();
