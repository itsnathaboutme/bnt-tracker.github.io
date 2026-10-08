# Live Training Operations

A static website for tracking the budget, schedule and task lists of instructor-led training. It has no build step and no dependencies.

## Pages

| Page | What it shows | Edit |
|---|---|---|
| `index.html` | **Dashboard** (landing page). Program summary with links to each task list. The **Budget Tracker** dropdown sits below it. | View only |
| `dashboard.html` | **Full dashboard**: all program details, plus the schedule. | Yes |
| `budget.html` | **Budget Tracker**: budget, spend and variance per program. | Yes |
| `tasks.html` | **Task lists**: one row per program, with progress. | View only |
| `program.html?id=T1` | One program's details and **task list** (T1 is the first program on the dashboard). | Yes |

Every program name on the dashboard opens its own task list page. The address is `program.html?id=` followed by the program code, for example `program.html?id=T2`.

## Files

| File | Purpose | Edit it? |
|---|---|---|
| `data/site-data.js` | All program details, budget figures, and task lists | **Yes. This is the content file.** |
| `index.html`, `dashboard.html`, `budget.html`, `tasks.html`, `program.html` | Page layouts | Only to change wording |
| `js/store.js` | Keeps browser edits and exports the data file | Rarely |
| `js/ui.js` | Tables, editing buttons, formatting, timeline | Rarely |
| `js/pages.js` | Which columns and content each page shows | Occasionally |
| `css/styles.css` | Colors and fonts (set at the top of the file) | To change the look |
| `.nojekyll` | Lets GitHub Pages serve every file as-is | Leave it alone |

## Making changes

There are two ways to change the content.

### Option 1: Edit the site

1. Open the page you want (for example **Budget Tracker** or **Full dashboard**).
2. Select **Edit**, change the values, then select **Save changes**.
3. A banner appears at the top of the page. Your changes are saved in this browser only.
4. Select **Export data file** in the banner. This downloads `site-data.js`.
5. Upload that file to GitHub (see *Publishing your changes* below).
6. After it's published, select **Discard browser changes** in the banner. The banner will then disappear.

Use **Cancel** to undo edits made since you selected Edit.

Changes saved in one browser do not appear in another. Export the file to share them.

### Option 2: Edit the file on GitHub

1. Open the repository and click `data` → `site-data.js`.
2. Click the pencil icon (**Edit this file**).
3. Change the text or numbers between the quotation marks.
4. Click **Commit changes**.

Note: if you have unpublished changes saved in your browser, the site shows those instead of the GitHub file. Use **Discard browser changes** to see the GitHub version.

### Adding a program on GitHub

Copy one whole block between `{` and `}` in the `trainings` list, paste it below the last block, and change the values. Give it the next code (for example `"T10"`). Add a matching task list under `tasks` if you want one. Keep a comma after every block except the last.

Allowed values:
- `status`: `"Completed"`, `"In Progress"`, `"Scheduled"` or `"Cancelled"`
- `quarter`: `"Q1"`, `"Q2"`, `"Q3"` or `"Q4"`
- Dates: `"YYYY-MM-DD"`, for example `"2025-03-10"`
- `budget` and `spent`: numbers only, with no commas or symbols

## Publishing your changes

1. In the repository, open the `data` folder.
2. Click **Add file** → **Upload files**.
3. Drag in the new `site-data.js`. If a file with the same name already exists, GitHub replaces it.
4. Click **Commit changes**.

The site updates within a minute or two.

## Turning on GitHub Pages

1. In the repository, go to **Settings** → **Pages**.
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
3. Choose branch **main** and folder **/ (root)**, then click **Save**.
4. The site will be at `https://<your-username>.github.io/<repository-name>/`.

## Running it locally

Open `index.html` in a web browser. No installation is needed. Edits work the same way.
