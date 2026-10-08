/*
  Shared helpers for every page.
  - Formatting (money, dates, numbers)
  - Read-only tables and detail fields
  - The editor: Edit / Add / Save / Cancel, used on the dashboard,
    budget tracker, program details and task lists
*/
(function () {
  "use strict";

  var STATUSES = ["Completed", "In Progress", "Scheduled", "Cancelled"];
  var QUARTERS = ["Q1", "Q2", "Q3", "Q4"];
  var PHASES = ["Pre-Training", "During Training", "Post-Training"];
  var PRIORITIES = ["High", "Medium", "Low"];
  var TASK_STATUSES = ["Not started", "In Progress", "Done"];
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var DAY_MS = 24 * 60 * 60 * 1000;
  var DASH = "\u2014";

  /* ---------- Formatting ---------- */

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function num(value) {
    var n = Number(value);
    return isFinite(n) ? n : 0;
  }

  function money(value) {
    if (value == null || value === "") return DASH;
    var n = num(value);
    var formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: (window.Store.data.config && window.Store.data.config.currency) || "USD",
      maximumFractionDigits: 0
    });
    var text = formatter.format(Math.abs(n));
    return n < 0 ? "(" + text + ")" : text;
  }

  function count(value) {
    if (value == null || value === "") return DASH;
    return num(value).toLocaleString("en-US");
  }

  function pct(value) {
    return (num(value) * 100).toFixed(1) + "%";
  }

  function statusClass(status) {
    return String(status || "").toLowerCase().replace(/\s+/g, "-");
  }

  function hasDate(value) {
    return /^\d{4}-\d{2}-\d{2}$/.test(String(value || ""));
  }

  // "YYYY-MM-DD" becomes a UTC timestamp, so dates never shift with time zones.
  function utc(value) {
    var p = String(value).split("-");
    return Date.UTC(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
  }

  function fmtDate(value, withYear) {
    if (!hasDate(value)) return DASH;
    var options = withYear
      ? { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }
      : { month: "short", day: "numeric", timeZone: "UTC" };
    return new Date(utc(value)).toLocaleDateString("en-US", options);
  }

  function dateRange(t) {
    if (!hasDate(t.start) || !hasDate(t.end)) return "Dates not set";
    return fmtDate(t.start) + " \u2013 " + fmtDate(t.end, true);
  }

  function pill(status) {
    return '<span class="status is-' + statusClass(status) + '">' + esc(status) + "</span>";
  }

  function variance(row) {
    var v = num(row.budget) - num(row.spent);
    return '<span class="' + (v < 0 ? "neg" : "") + '">' + money(v) + "</span>";
  }

  function format(col, value) {
    switch (col.type) {
      case "money": return money(value);
      case "number": return count(value);
      case "date": return fmtDate(value, true);
      case "bool": return value ? "Yes" : "No";
      default: return value == null || value === "" ? DASH : esc(value);
    }
  }

  /* ---------- Totals and summaries ---------- */

  function totals(list) {
    var t = { budget: 0, spent: 0, learners: 0, counts: {} };
    STATUSES.forEach(function (s) { t.counts[s] = 0; });
    list.forEach(function (row) {
      t.budget += num(row.budget);
      t.spent += num(row.spent);
      if (row.attendees != null) t.learners += num(row.attendees);
      t.counts[row.status] = (t.counts[row.status] || 0) + 1;
    });
    t.remaining = t.budget - t.spent;
    t.used = t.budget ? t.spent / t.budget : 0;
    return t;
  }

  function kpiHtml(t) {
    function item(label, value) {
      return '<div class="kpi"><dt>' + label + "</dt><dd>" + value + "</dd></div>";
    }
    return '<dl class="kpis">' +
      item("Total budget", money(t.budget)) +
      item("Spent to date", money(t.spent)) +
      item("Remaining", money(t.remaining)) +
      item("Budget used", pct(t.used)) +
      "</dl>";
  }

  function utilHtml(t) {
    var width = Math.min(t.used * 100, 100).toFixed(1);
    return '<div class="util-labels"><span>Budget used</span><span>' + pct(t.used) + " of " + money(t.budget) + "</span></div>" +
      '<div class="util-bar"><div class="util-fill" style="width:' + width + '%"></div></div>';
  }

  /* ---------- Tables and fields ---------- */

  function cellClass(col) {
    return [col.num ? "num" : "", col.cls || ""].join(" ").trim();
  }

  // Input controls used in edit mode.
  function control(col, value, index) {
    var attrs = ' data-key="' + esc(col.key) + '" data-row="' + index + '" data-type="' + esc(col.type || "text") + '"';
    var v = value == null ? "" : value;

    if (col.type === "select") {
      var options = (col.options || []).slice();
      if (v !== "" && options.indexOf(v) < 0) options.unshift(v);
      var items = options.map(function (o) {
        return '<option value="' + esc(o) + '"' + (String(o) === String(v) ? " selected" : "") + ">" + esc(o) + "</option>";
      }).join("");
      return "<select" + attrs + ">" + items + "</select>";
    }
    if (col.type === "bool") {
      return '<input type="checkbox"' + attrs + (value ? " checked" : "") + ">";
    }
    if (col.type === "money" || col.type === "number") {
      return '<input type="number" step="any" min="0"' + attrs + ' value="' + esc(v) + '">';
    }
    if (col.type === "date") {
      return '<input type="date"' + attrs + ' value="' + esc(v) + '">';
    }
    return '<input type="text"' + attrs + ' value="' + esc(v) + '">';
  }

  function read(el) {
    if (el.type === "checkbox") return el.checked;
    if (el.type === "number") return el.value === "" ? null : Number(el.value);
    return el.value;
  }

  function footHtml(cfg, list, removeCol) {
    if (!cfg.footer) return "";
    var f = cfg.footer(list) || {};
    var cells = cfg.columns.slice(1).map(function (col) {
      var value = f.cells && f.cells[col.key] != null ? f.cells[col.key] : "";
      return '<td class="' + cellClass(col) + '">' + value + "</td>";
    }).join("");
    return '<tr><th scope="row">' + esc(f.label || "Total") + "</th>" + cells + (removeCol ? "<td></td>" : "") + "</tr>";
  }

  function tableHtml(cfg, list, editing) {
    var cols = cfg.columns;
    var removeCol = editing && cfg.canRemove;

    var head = "<thead><tr>" +
      cols.map(function (col) {
        return '<th scope="col" class="' + cellClass(col) + '">' + esc(col.label) + "</th>";
      }).join("") +
      (removeCol ? '<th scope="col"><span class="sr-only">Remove</span></th>' : "") +
      "</tr></thead>";

    var body;
    if (!list.length) {
      body = '<tr><td class="empty" colspan="' + (cols.length + (removeCol ? 1 : 0)) + '">' + esc(cfg.emptyText || "Nothing to show yet.") + "</td></tr>";
    } else {
      body = list.map(function (row, i) {
        var cells = cols.map(function (col) {
          var content;
          if (editing && !col.readonly) content = control(col, row[col.key], i);
          else if (col.display) content = col.display(row, i);
          else content = format(col, row[col.key]);
          var live = col.live ? ' data-live="' + esc(col.key) + '" data-row="' + i + '"' : "";
          return "<td" + ' class="' + cellClass(col) + '"' + live + ">" + content + "</td>";
        }).join("");
        var remove = removeCol
          ? '<td><button type="button" class="link-btn danger" data-action="remove" data-row="' + i + '">Remove</button></td>'
          : "";
        var rowClass = cfg.rowClass ? cfg.rowClass(row) : "";
        return '<tr class="' + rowClass + '">' + cells + remove + "</tr>";
      }).join("");
    }

    return '<div class="table-scroll"><table class="ledger">' +
      '<caption class="sr-only">' + esc(cfg.caption || "") + "</caption>" +
      head +
      "<tbody>" + body + "</tbody>" +
      "<tfoot>" + footHtml(cfg, list, removeCol) + "</tfoot>" +
      "</table></div>";
  }

  function fieldsHtml(cfg, list, editing) {
    var row = list[0] || {};
    return '<dl class="fields">' +
      cfg.columns.map(function (col) {
        var content;
        if (editing && !col.readonly) content = control(col, row[col.key], 0);
        else if (col.display) content = col.display(row, 0);
        else content = format(col, row[col.key]);
        return '<div class="field"><dt>' + esc(col.label) + "</dt><dd>" + content + "</dd></div>";
      }).join("") +
      "</dl>";
  }

  /* ---------- Editor ---------- */

  // Creates an editable table or detail list with Edit / Add / Save / Cancel.
  function editor(cfg) {
    var state = { editing: false, snapshot: null };
    var host = cfg.host;
    var bar = cfg.toolbar;
    var isFields = cfg.layout === "fields";

    function rows() {
      return cfg.rows();
    }

    function toolbarHtml() {
      var note = window.Store.isDraft ? '<span class="draft-note">Changes saved in this browser</span>' : "";
      if (!state.editing) {
        return '<button type="button" class="btn" data-action="edit">Edit</button>' + note;
      }
      return (cfg.canAdd ? '<button type="button" class="btn ghost" data-action="add">' + esc(cfg.addLabel || "Add row") + "</button>" : "") +
        '<button type="button" class="btn primary" data-action="save">Save changes</button>' +
        '<button type="button" class="btn ghost" data-action="cancel">Cancel</button>' +
        '<span class="draft-note editing">Editing</span>';
    }

    function draw() {
      var list = rows();
      host.innerHTML = isFields ? fieldsHtml(cfg, list, state.editing) : tableHtml(cfg, list, state.editing);
      bar.innerHTML = toolbarHtml();
    }

    // Updates totals and calculated cells while typing, without redrawing the table
    // (so the input keeps focus).
    function refreshLive() {
      var list = rows();
      var tfoot = host.querySelector("tfoot");
      if (tfoot) tfoot.innerHTML = footHtml(cfg, list, state.editing && cfg.canRemove);
      host.querySelectorAll("[data-live]").forEach(function (td) {
        var index = Number(td.getAttribute("data-row"));
        var key = td.getAttribute("data-live");
        var col = cfg.columns.filter(function (c) { return c.key === key; })[0];
        if (col && col.display && list[index]) td.innerHTML = col.display(list[index], index);
      });
    }

    function onField(event) {
      var el = event.target;
      if (!state.editing || !el.getAttribute || !el.getAttribute("data-key")) return;
      var row = rows()[Number(el.getAttribute("data-row"))];
      if (!row) return;
      row[el.getAttribute("data-key")] = read(el);
      refreshLive();
      if (cfg.onInput) cfg.onInput();
    }

    function onRemove(event) {
      var button = event.target.closest && event.target.closest('[data-action="remove"]');
      if (!button || !state.editing) return;
      rows().splice(Number(button.getAttribute("data-row")), 1);
      draw();
      if (cfg.onInput) cfg.onInput();
    }

    function onBar(event) {
      var button = event.target.closest && event.target.closest("[data-action]");
      if (!button) return;
      var action = button.getAttribute("data-action");

      if (action === "edit") {
        state.snapshot = window.Store.clone(window.Store.data);
        state.editing = true;
        draw();
      } else if (action === "add") {
        var list = rows();
        list.push(cfg.newRow());
        draw();
        if (cfg.onInput) cfg.onInput();
      } else if (action === "save") {
        window.Store.save();
        state.editing = false;
        draw();
        banner();
        if (cfg.onChange) cfg.onChange();
      } else if (action === "cancel") {
        window.Store.restore(state.snapshot);
        state.editing = false;
        draw();
        banner();
        if (cfg.onChange) cfg.onChange();
      }
    }

    host.addEventListener("input", onField);
    host.addEventListener("change", onField);
    host.addEventListener("click", onRemove);
    bar.addEventListener("click", onBar);

    draw();
    return { redraw: draw };
  }

  /* ---------- Timeline ---------- */

  function timeline(host, list) {
    var year = window.Store.data.config.year;
    var start = Date.UTC(year, 0, 1);
    var end = Date.UTC(year + 1, 0, 1);
    var span = end - start;

    var head = '<div class="gantt-head"><div></div><div class="gantt-months">' +
      MONTHS.map(function (m) { return "<span>" + m + "</span>"; }).join("") +
      "</div></div>";

    var rows = list.filter(function (t) {
      return hasDate(t.start) && hasDate(t.end);
    }).map(function (t) {
      var s = utc(t.start);
      var e = utc(t.end) + DAY_MS;
      var left = Math.max(0, ((s - start) / span) * 100);
      var width = Math.max(0.6, ((e - s) / span) * 100);
      return '<div class="gantt-row">' +
        '<div class="gantt-label"><span class="gantt-name">' + esc(t.name) + "</span>" +
        '<span class="gantt-meta">' + esc(t.id) + " \u00B7 " + esc(t.venue) + " \u00B7 " + dateRange(t) + "</span></div>" +
        '<div class="gantt-track"><span class="gantt-bar is-' + statusClass(t.status) + '" style="left:' + left.toFixed(2) + "%;width:" + width.toFixed(2) + '%" title="' + esc(t.name + ": " + t.status) + '"></span></div>' +
        "</div>";
    }).join("");

    host.innerHTML = '<div class="gantt-scroll"><div class="gantt">' + head + rows + "</div></div>";
  }

  /* ---------- Draft banner and navigation ---------- */

  function banner() {
    var el = document.getElementById("draft-banner");
    if (!el) return;
    el.hidden = !window.Store.isDraft;
    el.innerHTML = window.Store.isDraft
      ? '<div class="wrap banner-inner"><p>Some changes are saved only in this browser. To publish them, export the data file and upload it to <code>data/site-data.js</code> on GitHub.</p>' +
        '<div class="banner-actions"><button type="button" class="btn" data-banner="export">Export data file</button>' +
        '<button type="button" class="btn ghost" data-banner="discard">Discard browser changes</button></div></div>'
      : "";
  }

  function chrome() {
    banner();
    var el = document.getElementById("draft-banner");
    if (el) {
      el.addEventListener("click", function (event) {
        var button = event.target.closest && event.target.closest("[data-banner]");
        if (!button) return;
        if (button.getAttribute("data-banner") === "export") {
          window.Store.download();
        } else if (window.confirm("Discard all changes saved in this browser and show the published data?")) {
          window.Store.discard();
          window.location.reload();
        }
      });
    }

    var key = document.body.getAttribute("data-nav");
    document.querySelectorAll(".site-nav a").forEach(function (a) {
      if (a.getAttribute("data-nav") === key) a.setAttribute("aria-current", "page");
    });
  }

  window.UI = {
    STATUSES: STATUSES,
    QUARTERS: QUARTERS,
    PHASES: PHASES,
    PRIORITIES: PRIORITIES,
    TASK_STATUSES: TASK_STATUSES,
    esc: esc,
    num: num,
    money: money,
    count: count,
    pct: pct,
    statusClass: statusClass,
    hasDate: hasDate,
    fmtDate: fmtDate,
    dateRange: dateRange,
    pill: pill,
    variance: variance,
    format: format,
    totals: totals,
    kpiHtml: kpiHtml,
    utilHtml: utilHtml,
    tableHtml: tableHtml,
    fieldsHtml: fieldsHtml,
    editor: editor,
    timeline: timeline,
    banner: banner,
    chrome: chrome
  };
})();
