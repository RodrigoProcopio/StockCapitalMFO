/* /public/admin/preview.js */
(() => {
  const CMS = window.CMS;
  if (!CMS) {
    console.error("Decap CMS não carregou (window.CMS indefinido). Verifique a ordem dos scripts em /admin/index.html");
    return;
  }

  // CSS inline para o preview (sem usar data:)
  const previewCss = `
    .sc-card { border:1px solid #e5e7eb; border-radius:12px; padding:16px; background:#fff; box-shadow:0 4px 12px rgba(0,0,0,.06); }
    .sc-title { font-weight:700; color:#1c2846; margin:0 0 4px; }
    .sc-date { font-size:12px; color:#64748b; margin:0 0 8px; }
    .sc-summary { font-size:14px; color:#334155; margin:8px 0 12px; }
    .sc-btn { display:inline-flex; align-items:center; justify-content:center; gap:8px;
              width:100%; padding:10px 12px; border-radius:10px; border:1px solid #e2e8f0;
              background:#1c2846; color:#fff; font-weight:600; }
    .sc-icon { width:16px; height:16px; }
  `;
  CMS.registerPreviewStyle(previewCss, { raw: true });

  // Preact (do Decap)
  const h = (window.h || window.preact?.h);
  if (!h) {
    console.error("Preact (h) não disponível no preview.");
    return;
  }

  function CardPreview({ entry, getAsset }) {
    const data = entry.get('data');
    const title = data.get('title') || 'Sem título';
    const date  = data.get('date')  || '';          // já vem como DD/MM/YYYY pelo config.yml
    const summary = data.get('summary') || '';      // opcional
    const pdfPath = data.get('pdf');
    const pdfUrl  = pdfPath ? getAsset(pdfPath) : null;

    return h('div', { className: 'sc-card' }, [
      h('h3', { className: 'sc-title' }, title),
      date ? h('p', { className: 'sc-date' }, String(date)) : null,
      summary ? h('p', { className: 'sc-summary' }, summary) : null,
      h('a', {
        className: 'sc-btn',
        href: pdfUrl || '#',
        target: pdfUrl ? '_blank' : undefined,
        rel: pdfUrl ? 'noopener noreferrer' : undefined
      }, [
        h('svg', { className: 'sc-icon', viewBox: '0 0 24 24', fill: 'none' }, [
          h('path', { d: 'M12 3v12m0 0l4-4m-4 4l-4-4M5 21h14', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })
        ]),
        pdfUrl ? 'Abrir PDF' : 'Selecione um PDF'
      ])
    ]);
  }

  ['cartas', 'relatorios', 'insights', 'compliance'].forEach((coll) => {
    CMS.registerPreviewTemplate(coll, CardPreview);
  });

  /* ────────────────────────────────────────────────────────────────
     Preview da coleção "Fundos" — reproduz a cara da página real
     (src/pages/FundoInvestimento.jsx): cabeçalho com categoria/nome/
     símbolo, taxa em destaque, os 3 cards de topo, características,
     exposição, tabela de rentabilidade, taxas e documentos.
     ──────────────────────────────────────────────────────────────── */
  const fundoPreviewCss = `
    .sc-fundo { font-family: 'Poppins', system-ui, sans-serif; color:#333846; }
    .sc-fundo h1, .sc-fundo h2, .sc-fundo h3 { color:#1c2846; margin:0; }
    .sc-fundo section { margin-bottom:20px; border:1px solid rgba(28,40,70,.15); border-radius:16px; background:#fff; padding:20px; }
    .sc-fundo .sc-f-badge { display:inline-flex; align-items:center; border:1px solid rgba(28,40,70,.15); background:rgba(28,40,70,.06); color:#1c2846; font-size:11px; font-weight:700; letter-spacing:.06em; padding:4px 10px; border-radius:999px; text-transform:uppercase; }
    .sc-fundo .sc-f-nome { font-size:22px; font-weight:700; margin-top:10px; }
    .sc-fundo .sc-f-simbolo { font-size:13px; color:#64748b; margin-top:6px; }
    .sc-fundo .sc-f-header-top { display:flex; flex-wrap:wrap; gap:16px; justify-content:space-between; align-items:flex-start; }
    .sc-fundo .sc-f-taxa-box { border:1px solid rgba(28,40,70,.15); border-radius:12px; padding:12px 20px; text-align:center; min-width:200px; }
    .sc-fundo .sc-f-taxa-box .sc-f-taxa-label { font-size:11px; color:#64748b; }
    .sc-fundo .sc-f-taxa-box .sc-f-taxa-valor { font-size:22px; font-weight:700; color:#1c2846; }
    .sc-fundo .sc-f-kpis { display:grid; grid-template-columns:repeat(auto-fit, minmax(150px,1fr)); gap:12px; margin-top:16px; }
    .sc-fundo .sc-f-kpi { border:1px solid rgba(28,40,70,.15); border-radius:10px; padding:12px; }
    .sc-fundo .sc-f-kpi .sc-f-kpi-title { font-size:11px; font-weight:600; color:#64748b; }
    .sc-fundo .sc-f-kpi .sc-f-kpi-valor { font-size:19px; font-weight:700; color:#1c2846; margin-top:6px; }
    .sc-fundo .sc-f-kpi .sc-f-kpi-meta { font-size:11px; color:#94a3b8; margin-top:4px; }
    .sc-fundo table { width:100%; border-collapse:collapse; font-size:13px; }
    .sc-fundo table th { text-align:left; background:rgba(28,40,70,.06); padding:8px 10px; font-weight:600; color:#334155; }
    .sc-fundo table td { padding:8px 10px; border-top:1px solid rgba(28,40,70,.08); color:#334155; }
    .sc-fundo table td.sc-f-label-cell { background:rgba(28,40,70,.03); font-weight:600; width:45%; }
    .sc-fundo .sc-f-doc-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(160px,1fr)); gap:10px; }
    .sc-fundo .sc-f-doc-card { border:1px solid rgba(28,40,70,.15); border-radius:10px; padding:12px; }
    .sc-fundo .sc-f-doc-card .sc-f-doc-titulo { font-weight:600; font-size:13px; }
    .sc-fundo .sc-f-doc-card .sc-f-doc-data { font-size:11px; color:#94a3b8; margin-top:2px; }
    .sc-fundo .sc-f-empty { font-size:13px; color:#94a3b8; font-style:italic; }
    .sc-fundo .sc-f-note { margin-top:6px; font-size:11px; color:#94a3b8; }
  `;
  CMS.registerPreviewStyle(fundoPreviewCss, { raw: true });

  function fmtBRL(v) {
    const n = Number(v);
    if (v === undefined || v === null || Number.isNaN(n)) return '—';
    try {
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 2 }).format(n);
    } catch (e) {
      return `R$ ${v}`;
    }
  }

  function fmtPct(v) {
    const n = Number(v);
    if (v === undefined || v === null || Number.isNaN(n)) return '—';
    return `${n.toFixed(2)}%`;
  }

  function fmtDataRef(v) {
    if (!v) return '';
    try {
      const d = new Date(v);
      if (Number.isNaN(d.getTime())) return String(v);
      return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(d).replace('.', '');
    } catch (e) {
      return String(v);
    }
  }

  function toJsList(data, path) {
    const v = data.getIn(path);
    if (!v) return [];
    if (typeof v.toJS === 'function') return v.toJS();
    return Array.isArray(v) ? v : [];
  }

  function FundoPreview({ entry }) {
    const data = entry.get('data');
    const nome = data.get('nome') || 'Sem nome';
    const categoria = data.get('categoria_label') || '';
    const simbolo = data.get('simbolo') || '';

    const taxaDestaque = data.getIn(['topo', 'taxa_administracao_destaque']) || '—';
    const prospectoLabel = data.getIn(['topo', 'prospecto_label']) || '';

    const kpis = [
      {
        titulo: data.getIn(['topo', 'valor_cota', 'label']) || 'Valor da Cota',
        valor: fmtBRL(data.getIn(['topo', 'valor_cota', 'valor'])),
        meta: data.getIn(['topo', 'valor_cota', 'data_referencia']) ? `Ref.: ${fmtDataRef(data.getIn(['topo', 'valor_cota', 'data_referencia']))}` : '',
      },
      {
        titulo: data.getIn(['topo', 'variacao_cota', 'label']) || 'Variação da Cota',
        valor: fmtPct(data.getIn(['topo', 'variacao_cota', 'valor'])),
        meta: data.getIn(['topo', 'variacao_cota', 'data_referencia']) ? `Ref.: ${fmtDataRef(data.getIn(['topo', 'variacao_cota', 'data_referencia']))}` : '',
      },
      {
        titulo: data.getIn(['topo', 'rendimento_total_cota', 'label']) || 'Rendimento Total da Cota',
        valor: fmtPct(data.getIn(['topo', 'rendimento_total_cota', 'valor'])),
        meta: data.getIn(['topo', 'rendimento_total_cota', 'data_referencia']) ? `Ref.: ${fmtDataRef(data.getIn(['topo', 'rendimento_total_cota', 'data_referencia']))}` : '',
      },
    ];

    const caracteristicasChave = [
      ['Patrimônio líquido do fundo', data.getIn(['caracteristicas_chave', 'patrimonio_liquido'])],
      ['Bolsa', data.getIn(['caracteristicas_chave', 'bolsa'])],
      ['Classe de ativos', data.getIn(['caracteristicas_chave', 'classe_de_ativos'])],
      ['Código CVM', data.getIn(['caracteristicas_chave', 'codigo_cvm'])],
      ['Domicílio', data.getIn(['caracteristicas_chave', 'domicilio'])],
      ['Data de constituição', data.getIn(['caracteristicas_chave', 'data_constituicao'])],
      ['Moeda', data.getIn(['caracteristicas_chave', 'moeda'])],
      ['Índice de benchmark', data.getIn(['caracteristicas_chave', 'benchmark'])],
    ];

    const caracteristicasPortfolio = [
      ['Número de ativos na carteira', data.getIn(['caracteristicas_portfolio', 'numero_ativos_carteira'])],
      ['Retorno 12m', data.getIn(['caracteristicas_portfolio', 'retorno_12m'])],
      ['Volatilidade', data.getIn(['caracteristicas_portfolio', 'volatilidade'])],
      ['Beta (Versus CDI)', data.getIn(['caracteristicas_portfolio', 'beta'])],
      ['Sharpe', data.getIn(['caracteristicas_portfolio', 'sharpe'])],
      ['Máximo drawdown', data.getIn(['caracteristicas_portfolio', 'maximo_drawdown'])],
    ];

    const exposicaoItens = toJsList(data, ['exposicao', 'itens']);
    const tabelaMensal = toJsList(data, ['rentabilidade', 'tabela_mensal']).slice(-6).reverse();
    const taxas = toJsList(data, ['taxas']);
    const documentos = toJsList(data, ['documentos']);

    return h('div', { className: 'sc-fundo' }, [
      // Cabeçalho
      h('section', {}, [
        h('div', { className: 'sc-f-header-top' }, [
          h('div', {}, [
            categoria ? h('span', { className: 'sc-f-badge' }, categoria) : null,
            h('h1', { className: 'sc-f-nome' }, nome),
            h('div', { className: 'sc-f-simbolo' }, simbolo ? `Símbolo: ${simbolo}` : ''),
          ]),
          h('div', { className: 'sc-f-taxa-box' }, [
            h('div', { className: 'sc-f-taxa-label' }, 'Taxa de Administração'),
            h('div', { className: 'sc-f-taxa-valor' }, taxaDestaque),
            prospectoLabel ? h('div', { className: 'sc-f-taxa-label' }, prospectoLabel) : null,
          ]),
        ]),
        h('div', { className: 'sc-f-kpis' }, kpis.map((k, i) =>
          h('div', { className: 'sc-f-kpi', key: i }, [
            h('div', { className: 'sc-f-kpi-title' }, k.titulo),
            h('div', { className: 'sc-f-kpi-valor' }, k.valor),
            k.meta ? h('div', { className: 'sc-f-kpi-meta' }, k.meta) : null,
          ])
        )),
      ]),

      // Características-chave
      h('section', {}, [
        h('h2', {}, 'Características-chave'),
        h('table', {}, h('tbody', {}, caracteristicasChave.map(([label, val], i) =>
          h('tr', { key: i }, [
            h('td', { className: 'sc-f-label-cell' }, label),
            h('td', {}, val || '—'),
          ])
        ))),
      ]),

      // Portfólio + Exposição
      h('section', {}, [
        h('h2', {}, 'Características do portfólio'),
        h('table', {}, h('tbody', {}, caracteristicasPortfolio.map(([label, val], i) =>
          h('tr', { key: i }, [
            h('td', { className: 'sc-f-label-cell' }, label),
            h('td', {}, val || '—'),
          ])
        ))),
        h('h3', { style: { marginTop: '16px', fontSize: '14px' } }, 'Exposição por setor'),
        exposicaoItens.length === 0
          ? h('p', { className: 'sc-f-empty' }, 'Nenhum item de exposição cadastrado.')
          : h('table', { style: { marginTop: '8px' } }, h('tbody', {}, exposicaoItens.map((it, i) =>
              h('tr', { key: i }, [
                h('td', { className: 'sc-f-label-cell' }, it.setor || '—'),
                h('td', {}, fmtPct(it.percentual)),
              ])
            ))),
      ]),

      // Rentabilidade
      h('section', {}, [
        h('h2', {}, 'Rentabilidade'),
        tabelaMensal.length === 0
          ? h('p', { className: 'sc-f-empty' }, 'Nenhum mês cadastrado ainda.')
          : h('table', {}, [
              h('thead', {}, h('tr', {}, [h('th', {}, 'Mês'), h('th', {}, 'Fundo (%)'), h('th', {}, 'CDI (%)')])),
              h('tbody', {}, tabelaMensal.map((r, i) =>
                h('tr', { key: i }, [
                  h('td', {}, r.mes || '—'),
                  h('td', {}, fmtPct(r.fundo)),
                  h('td', {}, fmtPct(r.cdi)),
                ])
              )),
            ]),
        h('p', { className: 'sc-f-note' }, 'Mostrando os 6 meses mais recentes cadastrados.'),
      ]),

      // Taxas
      h('section', {}, [
        h('h2', {}, 'Taxas'),
        taxas.length === 0
          ? h('p', { className: 'sc-f-empty' }, 'Nenhuma taxa cadastrada.')
          : h('table', {}, [
              h('thead', {}, h('tr', {}, [h('th', {}, 'Nome'), h('th', {}, 'Valor')])),
              h('tbody', {}, taxas.map((t, i) =>
                h('tr', { key: i }, [h('td', {}, t.nome || '—'), h('td', {}, t.valor || '—')])
              )),
            ]),
      ]),

      // Documentos
      h('section', {}, [
        h('h2', {}, 'Documentos'),
        documentos.length === 0
          ? h('p', { className: 'sc-f-empty' }, 'Nenhum documento cadastrado.')
          : h('div', { className: 'sc-f-doc-grid' }, documentos.map((d, i) =>
              h('div', { className: 'sc-f-doc-card', key: i }, [
                h('div', { className: 'sc-f-doc-titulo' }, d.titulo || 'Sem título'),
                d.data ? h('div', { className: 'sc-f-doc-data' }, d.data) : null,
              ])
            )),
      ]),
    ]);
  }

  CMS.registerPreviewTemplate('fundos', FundoPreview);
})();
