/*
  Data store
  - Loads the published data (data/site-data.js).
  - Keeps edits made in this browser until they are exported.
  - Exports a new site-data.js file you can upload to GitHub.
*/
(function () {
  "use strict";

  var KEY = "ilt-tracker-data-v2";
  var published = window.SITE_DATA || { config: {}, trainings: [], tasks: {} };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  // Make sure every program has a task list (copies the template if missing).
  function ensureTasks(d) {
    var template = published.taskTemplate || [];
    d.tasks = d.tasks || {};
    (d.trainings || []).forEach(function (t) {
      if (!Array.isArray(d.tasks[t.id])) d.tasks[t.id] = clone(template);
    });
    return d;
  }

  function indent(text, pad) {
    return text.split("\n").map(function (line) { return pad + line; }).join("\n");
  }

  // Writes the data in the same layout as the original file, so it stays easy to read.
  function toFile(d) {
    var out = [];
    out.push("/*");
    out.push("  SITE DATA. Exported from the site editor on " + new Date().toISOString().slice(0, 10) + ".");
    out.push("  Upload this file to the data folder as site-data.js.");
    out.push("*/");
    out.push("window.SITE_DATA = {");
    out.push("  config: " + JSON.stringify(d.config, null, 2).replace(/\n/g, "\n  ") + ",");
    out.push("");
    out.push("  trainings: [");
    d.trainings.forEach(function (t) {
      out.push(indent(JSON.stringify(t, null, 2), "    ") + ",");
    });
    out.push("  ],");
    out.push("");
    out.push("  tasks: {");
    Object.keys(d.tasks).forEach(function (id) {
      out.push("    " + JSON.stringify(id) + ": [");
      (d.tasks[id] || []).forEach(function (task) {
        out.push("      " + JSON.stringify(task) + ",");
      });
      out.push("    ],");
    });
    out.push("  }");
    out.push("};");
    return out.join("\n") + "\n";
  }

  var stored = null;
  try {
    stored = JSON.parse(localStorage.getItem(KEY));
  } catch (e) {
    stored = null;
  }
  var hasStored = !!(stored && stored.trainings);

  var store = {
    data: ensureTasks(hasStored ? stored : clone(published)),
    isDraft: hasStored,
    clone: clone,

    ensureTasks: function () {
      ensureTasks(store.data);
    },

    nextId: function () {
      var max = 0;
      store.data.trainings.forEach(function (t) {
        var n = parseInt(String(t.id).replace(/\D/g, ""), 10);
        if (n > max) max = n;
      });
      return "T" + (max + 1);
    },

    save: function () {
      ensureTasks(store.data);
      try {
        localStorage.setItem(KEY, JSON.stringify(store.data));
      } catch (e) {
        // Storage may be unavailable (for example in private browsing). Changes still work until the page closes.
      }
      store.isDraft = true;
    },

    restore: function (snapshot) {
      store.data = ensureTasks(snapshot);
    },

    discard: function () {
      try {
        localStorage.removeItem(KEY);
      } catch (e) {}
      store.data = ensureTasks(clone(published));
      store.isDraft = false;
    },

    download: function () {
      var blob = new Blob([toFile(store.data)], { type: "text/javascript" });
      var url = URL.createObjectURL(blob);
      var link = document.createElement("a");
      link.href = url;
      link.download = "site-data.js";
      document.body.appendChild(link);
      link.click();
      setTimeout(function () {
        URL.revokeObjectURL(url);
        link.remove();
      }, 0);
    }
  };

  window.Store = store;
})();
