(function () {
  var data = window.IR_DATA;
  if (!data) return;

  var platform = 'entra';
  var view = 'graph';
  var selected = null;
  var LANE_H = 68;

  var els = {
    shell: document.getElementById('irApp'),
    metrics: document.getElementById('irMetrics'),
    identityFields: document.getElementById('irIdentityFields'),
    range: document.getElementById('irRange'),
    lanes: document.getElementById('irLanes'),
    times: document.getElementById('irTimes'),
    board: document.getElementById('irBoard'),
    boardHost: document.getElementById('irBoardHost'),
    tableWrap: document.getElementById('irTableWrap'),
    tableBody: document.getElementById('irTableBody'),
    panel: document.getElementById('irPanel')
  };

  function pack() { return data.platforms[platform]; }

  /** Only lanes that have at least one node — empty lanes are removed. */
  function activeLanes() {
    var used = {};
    pack().nodes.forEach(function (n) { used[n.lane] = true; });
    return data.LANES.filter(function (l) { return used[l.id]; });
  }

  function laneIndex(id) {
    return activeLanes().findIndex(function (l) { return l.id === id; });
  }
  function timeIndex(id) {
    return data.TIMES.findIndex(function (t) { return t.id === id; });
  }
  function laneColor(id) {
    var l = data.LANES.find(function (x) { return x.id === id; });
    return l ? l.color : '#8494A7';
  }
  function nodeById(id) {
    return pack().nodes.find(function (n) { return n.id === id; });
  }

  function nodeCenter(n) {
    var lanes = activeLanes();
    var li = laneIndex(n.lane);
    var ti = timeIndex(n.time);
    var x = ((ti + 0.5) / data.TIMES.length) * 100;
    var y = ((li + 0.5) / lanes.length) * 100;
    return { x: x, y: y };
  }

  function renderIdentity() {
    var id = pack().identity;
    els.identityFields.innerHTML =
      '<div class="ir-field"><span class="k">Selected Identity</span><span class="v">' + id.name + '</span></div>' +
      '<div class="ir-field"><span class="k">Identity Type</span><span class="v">' + id.type + '</span></div>' +
      '<div class="ir-field"><span class="k">Source</span><span class="v">' + id.source + '</span></div>' +
      '<div class="ir-field"><span class="k">Start Date</span><span class="v">' + id.start + '</span></div>' +
      '<div class="ir-field"><span class="k">End Date</span><span class="v">' + id.end + '</span></div>';
    els.range.textContent = pack().rangeLabel;
  }

  function renderMetrics() {
    els.metrics.innerHTML = pack().metrics.map(function (m) {
      return '<div class="ir-metric"><strong>' + m.value + '</strong><span>' + m.label + '</span></div>';
    }).join('');
  }

  function renderLanes() {
    var lanes = activeLanes();
    els.lanes.innerHTML = lanes.map(function (l) {
      return '<div class="ir-lane"><span class="ir-lane__dot" style="background:' + l.color + '"></span>' + l.label + '</div>';
    }).join('');
    els.lanes.style.height = (lanes.length * LANE_H) + 'px';
    els.board.style.height = (lanes.length * LANE_H) + 'px';
  }

  function renderTimes() {
    els.times.innerHTML = data.TIMES.map(function (t) {
      return '<span>' + t.label + '</span>';
    }).join('');
  }

  function sevClass(sev) {
    var s = String(sev || '').toLowerCase();
    if (s.indexOf('critical') !== -1) return 'ir-sev--critical';
    if (s.indexOf('high') !== -1) return 'ir-sev--high';
    if (s.indexOf('low') !== -1) return 'ir-sev--low';
    return 'ir-sev--medium';
  }

  function renderPanel(kind, payload) {
    if (!payload) {
      els.panel.innerHTML =
        '<p class="eyebrow">Detail</p>' +
        '<h4>Select a node or action</h4>' +
        '<p>Click an identity card or an action chip (Created, Modified, Added, Deleted) to inspect MITRE mapping, severity, scenario, and recovery control.</p>';
      return;
    }
    if (kind === 'node') {
      els.panel.innerHTML =
        '<p class="eyebrow">Identity object</p>' +
        '<h4>' + payload.title + '</h4>' +
        '<p class="meta">' + payload.subtitle + ' · ' + payload.lane + '</p>' +
        '<p>' + (payload.selected ? 'Compromised identity — primary pivot for this activity window.' : 'Impacted identity object in the selected analysis scope.') + '</p>';
      return;
    }
    var from = nodeById(payload.from);
    var to = nodeById(payload.to);
    els.panel.innerHTML =
      '<p class="eyebrow">Activity · ' + payload.action + '</p>' +
      '<h4>' + (from ? from.title : payload.from) + ' → ' + (to ? to.title : payload.to) + '</h4>' +
      '<p class="meta">' + payload.tactic + ' · <code>' + payload.tech + '</code> · ' +
        '<span class="ir-sev ' + sevClass(payload.sev) + '">' + payload.sev + '</span></p>' +
      '<p><strong>Scenario.</strong> ' + payload.scenario + '</p>' +
      '<p style="margin-top:8px"><strong>Recovery control.</strong> ' + payload.recovery + '</p>';
  }

  function gapMarkerHtml() {
    var g = pack().gap;
    if (!g) return '';
    var ti = timeIndex(g.after);
    if (ti < 0) return '';
    var x = ((ti + 1) / data.TIMES.length) * 100;
    return (
      '<div class="ir-gap" style="left:' + x + '%">' +
        '<span class="ir-gap__line"></span>' +
        '<span class="ir-gap__label">' + g.label + '</span>' +
      '</div>'
    );
  }

  function renderGraph() {
    var p = pack();
    renderLanes();

    var nodesHtml = p.nodes.map(function (n) {
      var c = nodeCenter(n);
      var color = laneColor(n.lane);
      var sel = (selected && selected.kind === 'node' && selected.id === n.id) || (!selected && n.selected);
      return (
        '<button type="button" class="ir-node' + (sel ? ' is-selected' : '') + '" data-node="' + n.id + '" style="left:' + c.x + '%;top:' + c.y + '%;--node:' + color + '">' +
          '<p class="ir-node__title">' + n.title + '</p>' +
          '<p class="ir-node__sub">' + n.subtitle + '</p>' +
        '</button>'
      );
    }).join('');

    var paths = [];
    var chips = [];
    p.edges.forEach(function (e, idx) {
      var a = nodeById(e.from);
      var b = nodeById(e.to);
      if (!a || !b) return;
      var A = nodeCenter(a);
      var B = nodeCenter(b);
      var mx = (A.x + B.x) / 2;
      var my = (A.y + B.y) / 2;
      var thick = e.sev === 'High' ? 2.4 : 1.6;
      var active = selected && selected.kind === 'edge' && selected.idx === idx;
      paths.push(
        '<path d="M' + A.x + ' ' + A.y + ' C ' + ((A.x + mx) / 2) + ' ' + A.y + ', ' + ((B.x + mx) / 2) + ' ' + B.y + ', ' + B.x + ' ' + B.y +
        '" fill="none" stroke="#94A3B8" stroke-width="' + thick + '" stroke-dasharray="4 4" vector-effect="non-scaling-stroke"/>'
      );
      chips.push(
        '<button type="button" class="ir-chip ir-chip--' + e.tone + (active ? ' is-active' : '') + '" data-edge="' + idx + '" style="left:' + mx + '%;top:' + my + '%">' +
          e.action +
        '</button>'
      );
    });

    els.board.innerHTML =
      '<svg class="ir-edge-layer" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">' + paths.join('') + '</svg>' +
      gapMarkerHtml() +
      chips.join('') +
      nodesHtml;

    els.board.querySelectorAll('[data-node]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var n = nodeById(btn.getAttribute('data-node'));
        selected = { kind: 'node', id: n.id };
        renderGraph();
        renderPanel('node', n);
      });
    });
    els.board.querySelectorAll('[data-edge]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = parseInt(btn.getAttribute('data-edge'), 10);
        selected = { kind: 'edge', idx: idx };
        renderGraph();
        renderPanel('edge', p.edges[idx]);
      });
    });
  }

  function renderTable() {
    var p = pack();
    els.tableBody.innerHTML = p.edges.map(function (e, idx) {
      var from = nodeById(e.from);
      var to = nodeById(e.to);
      return (
        '<tr data-edge="' + idx + '">' +
          '<td>' + e.action + '</td>' +
          '<td>' + e.sev + '</td>' +
          '<td>' + e.tactic + '<br><code>' + e.tech + '</code></td>' +
          '<td>' + (from ? from.title : e.from) + '</td>' +
          '<td>' + (to ? to.title : e.to) + '</td>' +
          '<td>' + e.recovery + '</td>' +
        '</tr>'
      );
    }).join('');
    els.tableBody.querySelectorAll('tr').forEach(function (tr) {
      tr.addEventListener('click', function () {
        var idx = parseInt(tr.getAttribute('data-edge'), 10);
        selected = { kind: 'edge', idx: idx };
        renderPanel('edge', p.edges[idx]);
      });
    });
  }

  function setView(next) {
    view = next;
    document.querySelectorAll('[data-ir-view]').forEach(function (btn) {
      btn.classList.toggle('is-active', btn.getAttribute('data-ir-view') === view);
    });
    els.boardHost.classList.toggle('is-hidden', view !== 'graph');
    els.tableWrap.classList.toggle('is-on', view === 'table');
    if (view === 'graph') renderGraph();
    else renderTable();
  }

  function setPlatform(next) {
    platform = next;
    selected = null;
    document.querySelectorAll('[data-ir-platform]').forEach(function (btn) {
      btn.classList.toggle('is-active', btn.getAttribute('data-ir-platform') === platform);
    });
    renderIdentity();
    renderMetrics();
    renderPanel(null);
    setView(view);
  }

  document.querySelectorAll('[data-ir-platform]').forEach(function (btn) {
    btn.addEventListener('click', function () { setPlatform(btn.getAttribute('data-ir-platform')); });
  });
  document.querySelectorAll('[data-ir-view]').forEach(function (btn) {
    btn.addEventListener('click', function () { setView(btn.getAttribute('data-ir-view')); });
  });

  renderTimes();
  setPlatform('entra');
})();
