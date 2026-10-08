/*
  ==========================================================
  SITE DATA: the only file you need to change to update content.

  You can edit it here on GitHub, or use the Edit buttons on the
  site and then export a new copy of this file.

  config
    title, subtitle   Heading text for the site
    year              Calendar year the schedule covers
    periodLabel       Text shown above the schedule
    currency          "USD", "PHP", "EUR" and so on
    preparedBy        Name shown in the footer
    source            Name of the spreadsheet the data came from

  trainings (one block per program)
    id          Short code such as "T1". Sets the program page address.
    name        Program name
    quarter     "Q1", "Q2", "Q3" or "Q4"
    start, end  Dates as "YYYY-MM-DD"
    days        Number of training days
    instructor  Instructor name(s)
    venue       Venue or delivery mode
    attendees   Number of learners, or null if not applicable
    status      "Completed", "In Progress", "Scheduled" or "Cancelled"
    budget      Budgeted amount, numbers only (no commas or symbols)
    spent       Amount spent, numbers only
    notes       Short note shown in tables

  tasks (one list per program id)
    phase     "Pre-Training", "During Training" or "Post-Training"
    task      Task description
    owner     Who is responsible, e.g. "PA" or "Instructor"
    due       Timing, e.g. "2 weeks before" or "Day of training"
    priority  "High", "Medium" or "Low"
    status    "Not started", "In Progress" or "Done"
    notes     Short note
    done      true or false (tick box on the site)

  Keep a comma after every item except the last one in each list.
  ==========================================================
*/

var T1_TASKS = [
  { phase: "Pre-Training", task: "Confirm training dates and program scope with client", owner: "PA", due: "4 weeks before", priority: "High", status: "Done", notes: "Align on deliverables and expectations", done: true },
  { phase: "Pre-Training", task: "Send calendar invites to instructor and stakeholders", owner: "PA", due: "4 weeks before", priority: "High", status: "Done", notes: "Include Zoom/venue link", done: true },
  { phase: "Pre-Training", task: "Coordinate venue booking or virtual platform setup", owner: "PA", due: "3 weeks before", priority: "High", status: "Done", notes: "Confirm AV setup and room capacity", done: true },
  { phase: "Pre-Training", task: "Confirm instructor availability and assignment", owner: "PA", due: "3 weeks before", priority: "High", status: "Done", notes: "Send confirmation email to instructor", done: true },
  { phase: "Pre-Training", task: "Prepare and distribute attendee registration form", owner: "PA", due: "3 weeks before", priority: "Medium", status: "Done", notes: "Track RSVPs via spreadsheet", done: true },
  { phase: "Pre-Training", task: "Finalize attendee list and share with instructor", owner: "PA", due: "2 weeks before", priority: "High", status: "Done", notes: "Include attendee names and roles", done: true },
  { phase: "Pre-Training", task: "Coordinate training materials (slides, workbooks, handouts)", owner: "Instructor", due: "2 weeks before", priority: "High", status: "Done", notes: "Review for completeness before printing", done: true },
  { phase: "Pre-Training", task: "Arrange printing or digital distribution of materials", owner: "PA", due: "1 week before", priority: "Medium", status: "Done", notes: "Print extra copies as buffer", done: true },
  { phase: "Pre-Training", task: "Send pre-training reminder to all attendees", owner: "PA", due: "3 days before", priority: "Medium", status: "Done", notes: "Include agenda, venue/link, and what to bring", done: true },
  { phase: "Pre-Training", task: "Confirm catering, accommodation, or logistics", owner: "PA", due: "2 weeks before", priority: "Low", status: "Done", notes: "For in-person events only. Send follow-up confirmation 2 days prior to training dates.", done: true },
  { phase: "Pre-Training", task: "Upload trainer receipts (flights, eSIMs, visa charges, etc.)", owner: "PA", due: "3 weeks before", priority: "Low", status: "Done", notes: "", done: false },
  { phase: "Pre-Training", task: "Prepare budget tracker entry for this training", owner: "PA", due: "1 week before", priority: "Medium", status: "Done", notes: "Log budgeted amount and initial estimates", done: true },
  { phase: "Pre-Training", task: "Conduct pre-training walkthrough or dry run with instructor", owner: "Instructor", due: "1 day before", priority: "High", status: "Done", notes: "Check AV, slides, and platform connectivity", done: true },
  { phase: "During Training", task: "Set up venue or virtual platform before session start", owner: "Client", due: "Day of training", priority: "High", status: "Done", notes: "Arrive 30 to 45 minutes early", done: true },
  { phase: "During Training", task: "Manage attendance sheet and track sign-ins", owner: "Instructor", due: "Day of training", priority: "High", status: "Done", notes: "Flag no-shows and follow up", done: true },
  { phase: "During Training", task: "Monitor training flow and provide real-time support", owner: "Instructor / PA", due: "Day of training", priority: "High", status: "Done", notes: "Address technical or logistical issues immediately", done: true },
  { phase: "During Training", task: "Liaise between instructor and stakeholders as needed", owner: "PA", due: "Day of training", priority: "Medium", status: "Done", notes: "Relay any real-time feedback or concerns", done: true },
  { phase: "During Training", task: "Document key highlights, issues, and notable moments", owner: "PA", due: "Day of training", priority: "Medium", status: "Done", notes: "Use notes for post-training report", done: true },
  { phase: "During Training", task: "Distribute and collect post-session feedback forms", owner: "PA", due: "Day 4", priority: "High", status: "Done", notes: "Ensure all attendees complete the form", done: true },
  { phase: "Post-Training", task: "Compile and review attendee feedback forms", owner: "PA", due: "1 day after", priority: "High", status: "Done", notes: "Summarize scores and key comments", done: true },
  { phase: "Post-Training", task: "Send thank-you email to instructor and client stakeholders", owner: "PA", due: "1 day after", priority: "Medium", status: "Done", notes: "Include highlights and attendance count", done: true },
  { phase: "Post-Training", task: "Update budget tracker with actual spend", owner: "PA", due: "2 days after", priority: "High", status: "Done", notes: "Log all receipts and invoices", done: true },
  { phase: "Post-Training", task: "Archive training materials and attendance records", owner: "PA", due: "3 days after", priority: "Medium", status: "Done", notes: "Store in shared drive under correct folder", done: true },
  { phase: "Post-Training", task: "Prepare post-training summary report for Project Manager", owner: "PA", due: "3 days after", priority: "High", status: "Done", notes: "Include attendance, budget, and feedback highlights", done: true },
  { phase: "Post-Training", task: "Update PM tool (Jira or Monday.com)", owner: "PA", due: "3 days after", priority: "Medium", status: "Done", notes: "Close out tasks and log completion notes", done: true },
  { phase: "Post-Training", task: "Follow up on any pending action items from the session", owner: "PA", due: "1 week after", priority: "Medium", status: "In Progress", notes: "Email stakeholders with open items", done: false },
  { phase: "Post-Training", task: "Conduct internal debrief with team", owner: "PA", due: "1 week after", priority: "Low", status: "In Progress", notes: "Discuss lessons learned and improvements", done: false }
];

window.SITE_DATA = {
  config: {
    title: "Live Training Operations",
    subtitle: "Budget, schedule and delivery status for instructor-led cybersecurity training.",
    year: 2024,
    periodLabel: "January to December 2024",
    currency: "USD",
    preparedBy: "Nathaniel Caramelo",
    source: "Budget & ILT Tracker 2024",

    // Columns shown in the "Training programs" table on the landing page (Dashboard).
    // Remove a name from this list to hide that column on the landing page.
    // Available names: "id" (Code), "name", "quarter", "status", "budget", "spent", "variance".
    // Budget, spent and variance still appear on the Budget Tracker page.
    landingColumns: ["id", "name", "quarter", "status"]
  },

  trainings: [
    {
      id: "T1",
      name: "Cybersecurity Fundamentals ILT",
      quarter: "Q1",
      start: "2024-01-15",
      end: "2024-01-19",
      days: 5,
      instructor: "James / Ryan",
      venue: "BGC Hub",
      attendees: 24,
      status: "Completed",
      budget: 12000,
      spent: 11450,
      notes: "Positive client feedback"
    },
    {
      id: "T2",
      name: "Advanced Threat Analysis ILT",
      quarter: "Q1",
      start: "2024-02-12",
      end: "2024-02-16",
      days: 5,
      instructor: "Sara / Clint",
      venue: "Cebu Hub",
      attendees: 18,
      status: "Completed",
      budget: 9500,
      spent: 9800,
      notes: "Slight budget overrun; approved"
    },
    {
      id: "T3",
      name: "Penetration Testing Bootcamp",
      quarter: "Q2",
      start: "2024-04-08",
      end: "2024-04-12",
      days: 5,
      instructor: "Mark / Raul",
      venue: "Davao Hub",
      attendees: 30,
      status: "Completed",
      budget: 15000,
      spent: 14200,
      notes: "Full attendance achieved"
    },
    {
      id: "T4",
      name: "Incident Response Workshop",
      quarter: "Q2",
      start: "2024-05-20",
      end: "2024-05-24",
      days: 5,
      instructor: "James / Ryan",
      venue: "Online (Virtual)",
      attendees: 20,
      status: "Completed",
      budget: 10500,
      spent: 10100,
      notes: "Materials reprinted"
    },
    {
      id: "T5",
      name: "Cloud Security Essentials",
      quarter: "Q3",
      start: "2024-07-08",
      end: "2024-07-10",
      days: 3,
      instructor: "Mark / Rody",
      venue: "Online (Virtual)",
      attendees: 27,
      status: "Completed",
      budget: 13000,
      spent: 12750,
      notes: "Smooth delivery"
    },
    {
      id: "T6",
      name: "Red Team Operations ILT",
      quarter: "Q3",
      start: "2024-08-26",
      end: "2024-08-30",
      days: 5,
      instructor: "Sara / Clint",
      venue: "Makati Hub",
      attendees: 15,
      status: "Completed",
      budget: 11000,
      spent: 11000,
      notes: "On budget"
    },
    {
      id: "T7",
      name: "Secure DevOps Fundamentals",
      quarter: "Q4",
      start: "2024-10-14",
      end: "2024-10-18",
      days: 5,
      instructor: "Mark / Ryan",
      venue: "Online (Virtual)",
      attendees: 22,
      status: "In Progress",
      budget: 12500,
      spent: 6200,
      notes: "Ongoing, Q4 session"
    },
    {
      id: "T8",
      name: "Advanced Threat Analysis ILT",
      quarter: "Q4",
      start: "2024-11-04",
      end: "2024-11-08",
      days: 5,
      instructor: "James / Sara",
      venue: "Manila Hub",
      attendees: null,
      status: "Cancelled",
      budget: 13000,
      spent: 0,
      notes: "Cancelled due to low number of learners"
    },
    {
      id: "T9",
      name: "Zero Trust Architecture ILT",
      quarter: "Q4",
      start: "2024-11-25",
      end: "2024-11-27",
      days: 3,
      instructor: "Nina / TBD",
      venue: "Cebu Hub",
      attendees: 0,
      status: "Scheduled",
      budget: 11500,
      spent: 0,
      notes: "Confirmed, awaiting kickoff"
    }
  ],

  tasks: {
    T1: T1_TASKS
  },

  // Starting task list for programs that do not have their own list yet.
  // Built from the T1 task list with every status reset.
  taskTemplate: T1_TASKS.map(function (t) {
    return { phase: t.phase, task: t.task, owner: t.owner, due: t.due, priority: t.priority, status: "Not started", notes: "", done: false };
  })
};
