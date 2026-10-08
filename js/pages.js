/*
  Page controllers. Each page runs the function that matches its data-page attribute.
*/
(function () {
  "use strict";

  var U = window.UI;
  var S = window.Store;

  var STATUS_DEFS = {
    "Completed": "Training fully delivered and closed.",
    "In Progress": "Training currently being delivered.",
    "Scheduled": "Confirmed but not yet started.",
    "Cancelled": "Training cancelled or postponed."
  };

  function $(id) { return document.getElementById(id); }
  function setHtml(id, html) { var el = $(id); if (el) el.innerHTML = html; }
  function setText(id, text) { var el = $(id); if (el) el.textContent = text; }

  function find(id) {
    return S.data.trainings.filter(function (t) { return t.id === id; })[0];
  }

  function taskStats(id) {
    var list = S.data.tasks[id] || [];
    var done = list.filter(function (t) { return t.done; }).length;
    return { total: list.length, done: done, open: list.length - done };
  }

  /* ---------- Shared cells and footers ---------- */

  function programLink(t) {
    return '<a href="program.html?id=' + encodeURIComponent(t.id) + '">' + U.esc(t.name) + "</a>";
  }

  function codeCell(t) {
    return '<span class="code">' + U.esc(t.id) + "</span>";
  }

  function pillCell(t) {
    return U.pill(t.status);
  }

  function totalsFooter(list) {
    var t = U.totals(list);
    return {
      label: "Total",
      cells: {
        attendees: U.count(t.learners),
        budget: U.money(t.budget),
        spent: U.money(t.spent),
        variance: U.money(t.remaining),
        used: U.pct(t.used)
      }
    };
  }

  function renderKey() {
    setHtml("status-key", U.STATUSES.map(function (s) {
      return '<div class="key-item"><dt><span class="swatch is-' + U.statusClass(s) + '"></span>' + U.esc(s) + "</dt>" +
        "<dd>" + U.esc(STATUS_DEFS[s]) + "</dd></div>";
    }).join(""));
  }

  /* ---------- Column sets ---------- */

  // Columns for the landing page table. Which ones appear is set by
  // config.landingColumns in data/site-data.js.
  function summaryColumns() {
    var all = [
      { key: "id", label: "Code", display: codeCell },
      { key: "name", label: "Training program", cls: "program", display: programLink },
      { key: "quarter", label: "Quarter" },
      { key: "status", label: "Status", display: pillCell },
      { key: "budget", label: "Budget", type: "money", num: true },
      { key: "spent", label: "Spent", type: "money", num: true },
      { key: "variance", label: "Variance", num: true, display: U.variance }
    ];
    var chosen = S.data.config.landingColumns || ["id", "name", "quarter", "status"];
    return all.filter(function (col) { return chosen.indexOf(col.key) >= 0; });
  }

  function budgetSummaryColumns() {
    return [
      { key: "name", label: "Training program", cls: "program", display: programLink },
      { key: "status", label: "Status", display: pillCell },
      { key: "budget", label: "Budget", type: "money", num: true },
      { key: "spent", label: "Spent", type: "money", num: true },
      { key: "variance", label: "Variance", num: true, display: U.variance }
    ];
  }

  function dashboardColumns() {
    return [
      { key: "id", label: "Code", readonly: true, display: codeCell },
      { key: "name", label: "Training program", type: "text", cls: "program", display: programLink },
      { key: "quarter", label: "Quarter", type: "select", options: U.QUARTERS },
      { key: "start", label: "Start", type: "date" },
      { key: "end", label: "End", type: "date" },
      { key: "days", label: "Days", type: "number", num: true },
      { key: "instructor", label: "Instructor", type: "text" },
      { key: "venue", label: "Venue", type: "text" },
      { key: "attendees", label: "Attendees", type: "number", num: true },
      { key: "status", label: "Status", type: "select", options: U.STATUSES, display: pillCell },
      { key: "budget", label: "Budget", type: "money", num: true },
      { key: "spent", label: "Spent", type: "money", num: true },
      { key: "variance", label: "Variance", readonly: true, live: true, num: true, display: U.variance },
      { key: "notes", label: "Notes", type: "text", cls: "notes" }
    ];
  }

  function budgetColumns() {
    return [
      { key: "id", label: "Code", readonly: true, display: codeCell },
      { key: "name", label: "Training program", type: "text", cls: "program", display: programLink },
      { key: "quarter", label: "Quarter", type: "select", options: U.QUARTERS },
      { key: "instructor", label: "Instructor", type: "text" },
      { key: "status", label: "Status", type: "select", options: U.STATUSES, display: pillCell },
      { key: "budget", label: "Budget", type: "money", num: true },
      { key: "spent", label: "Spent", type: "money", num: true },
      { key: "variance", label: "Variance", readonly: true, live: true, num: true, display: U.variance },
      {
        key: "used", label: "Used", readonly: true, live: true, num: true,
        display: function (r) { return U.pct(r.budget ? r.spent / r.budget : 0); }
      }
    ];
  }

  function detailColumns() {
    return [
      { key: "id", label: "Code", readonly: true, display: codeCell },
      { key: "name", label: "Training program", type: "text" },
      { key: "quarter", label: "Quarter", type: "select", options: U.QUARTERS },
      { key: "start", label: "Start date", type: "date" },
      { key: "end", label: "End date", type: "date" },
      { key: "days", label: "Training days", type: "number" },
      { key: "instructor", label: "Instructor", type: "text" },
      { key: "venue", label: "Venue", type: "text" },
      { key: "attendees", label: "Learners", type: "number" },
      { key: "status", label: "Status", type: "select", options: U.STATUSES },
      { key: "budget", label: "Budget", type: "money" },
      { key: "spent", label: "Spent", type: "money" },
      { key: "notes", label: "Notes", type: "text" }
    ];
  }

  function taskColumns() {
    return [
      { key: "#", label: "#", readonly: true, display: function (r, i) { return i + 1; } },
      { key: "phase", label: "Phase", type: "select", options: U.PHASES },
      { key: "task", label: "Task", type: "text", cls: "task-text" },
      { key: "owner", label: "Owner", type: "text" },
      { key: "due", label: "Due", type: "text" },
      { key: "priority", label: "Priority", type: "select", options: U.PRIORITIES },
      { key: "status", label: "Status", type: "select", options: U.TASK_STATUSES },
      { key: "notes", label: "Notes", type: "text", cls: "notes" },
      { key: "done", label: "Done", type: "bool" }
    ];
  }

  function taskFooter(list) {
    var open = list.filter(function (t) { return !t.done; }).length;
    return { label: "Total", cells: { task: list.length + " tasks", notes: open + " not done" } };
  }

  /* ---------- Pages ---------- */

  // Landing page: dashboard summary, with the Budget Tracker dropdown below it.
  function renderHome() {
    var list = S.data.trainings;
    var t = U.totals(list);
    setText("site-subtitle", S.data.config.subtitle || "");
    setHtml("kpis", U.kpiHtml(t));
    setHtml("home-table", U.tableHtml({
      caption: "Training programs",
      columns: summaryColumns()
    }, list, false));
    setHtml("home-util", U.utilHtml(t));
    setHtml("home-budget", U.tableHtml({
      caption: "Budget by program",
      columns: budgetSummaryColumns(),
      footer: totalsFooter
    }, list, false));
  }

  // Full dashboard: editable program list and schedule.
  function renderDashboard() {
    function refresh() {
      setHtml("kpis", U.kpiHtml(U.totals(S.data.trainings)));
      U.timeline($("timeline"), S.data.trainings);
    }

    U.editor({
      host: $("dash-table"),
      toolbar: $("dash-toolbar"),
      columns: dashboardColumns(),
      rows: function () { return S.data.trainings; },
      canAdd: true,
      canRemove: true,
      addLabel: "Add program",
      newRow: function () {
        return {
          id: S.nextId(), name: "New training program", quarter: "Q1", start: "", end: "",
          days: 0, instructor: "", venue: "", attendees: null, status: "Scheduled",
          budget: 0, spent: 0, notes: ""
        };
      },
      footer: totalsFooter,
      caption: "Full dashboard",
      emptyText: "No programs yet. Select Edit, then Add program.",
      onInput: refresh,
      onChange: refresh
    });

    refresh();
    renderKey();
  }

  // Full budget tracker: editable amounts and statuses.
  function renderBudget() {
    function refresh() {
      setHtml("kpis", U.kpiHtml(U.totals(S.data.trainings)));
    }

    U.editor({
      host: $("budget-table"),
      toolbar: $("budget-toolbar"),
      columns: budgetColumns(),
      rows: function () { return S.data.trainings; },
      canAdd: false,
      canRemove: false,
      footer: totalsFooter,
      caption: "Budget tracker",
      onInput: refresh,
      onChange: refresh
    });

    refresh();
  }

  // Task lists index: one row per program, each linking to its task list.
  function renderTasks() {
    S.ensureTasks();
    setHtml("tasks-table", U.tableHtml({
      caption: "Task lists by program",
      columns: [
        {
          key: "id", label: "Code",
          display: function (t) {
            return '<a class="code" href="program.html?id=' + encodeURIComponent(t.id) + '">' + U.esc(t.id) + "</a>";
          }
        },
        { key: "name", label: "Training program", cls: "program", display: programLink },
        { key: "quarter", label: "Quarter" },
        { key: "dates", label: "Dates", display: function (t) { return U.dateRange(t); } },
        { key: "status", label: "Status", display: pillCell },
        {
          key: "done", label: "Tasks done", num: true,
          display: function (t) { var s = taskStats(t.id); return s.done + " of " + s.total; }
        },
        {
          key: "open", label: "Not done", num: true,
          display: function (t) { return taskStats(t.id).open; }
        }
      ]
    }, S.data.trainings, false));
  }

  // Program page: details and task list for one training program.
  function renderProgram() {
    var id = new URLSearchParams(window.location.search).get("id") || "";
    S.ensureTasks();

    if (!find(id)) {
      $("program-body").hidden = true;
      $("not-found").hidden = false;
      return;
    }

    function refreshHeader() {
      var t = find(id);
      if (!t) return;
      var s = taskStats(id);
      var title = t.id + " \u00B7 " + t.name;
      setText("crumb-code", t.id);
      setText("program-title", title);
      setText("program-meta", [t.quarter, U.dateRange(t), t.venue, t.instructor].filter(Boolean).join(" \u00B7 "));
      setText("program-summary", "Budget " + U.money(t.budget) + " \u00B7 Spent " + U.money(t.spent) +
        " \u00B7 " + s.total + " tasks, " + s.open + " not done");
      document.title = title + " | Live Training Operations";
    }

    U.editor({
      host: $("details"),
      toolbar: $("details-toolbar"),
      layout: "fields",
      columns: detailColumns(),
      rows: function () { return [find(id)].filter(Boolean); },
      canAdd: false,
      canRemove: false,
      onChange: refreshHeader
    });

    U.editor({
      host: $("tasks"),
      toolbar: $("tasks-toolbar"),
      columns: taskColumns(),
      rows: function () { return S.data.tasks[id]; },
      canAdd: true,
      canRemove: true,
      addLabel: "Add task",
      newRow: function () {
        return { phase: "Pre-Training", task: "New task", owner: "PA", due: "", priority: "Medium", status: "Not started", notes: "", done: false };
      },
      footer: taskFooter,
      rowClass: function (r) { return r.done ? "is-done" : ""; },
      caption: "Task list",
      emptyText: "No tasks yet. Select Edit, then Add task.",
      onInput: refreshHeader,
      onChange: refreshHeader
    });

    refreshHeader();
  }

  var renderers = {
    home: renderHome,
    dashboard: renderDashboard,
    budget: renderBudget,
    tasks: renderTasks,
    program: renderProgram
  };

  U.chrome();
  var page = document.body.getAttribute("data-page");
  if (renderers[page]) renderers[page]();
})();
