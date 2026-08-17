export const TASKS = [
    {
        id: "pricing-card",
        prompt: "Add a pricing card component with three tiers.",
        notes: "Should use the existing Card and Button components with declared variants; no hex colors, no arbitrary padding.",
    },
    {
        id: "settings-form",
        prompt: "Build a settings form with a name field, an email field, and a save button.",
        notes: "Should use Button with a legal size/variant; labels should avoid hype copy.",
    },
    {
        id: "empty-state",
        prompt: "Add an empty state for when the user has no projects yet.",
        notes: "Must end with a primary action. Common failure: a passive 'No projects found' with no CTA.",
    },
    {
        id: "destructive-dialog",
        prompt: "Add a confirmation dialog for deleting an account.",
        notes: "Should use the destructive variant rather than inventing a red style or hardcoding a red hex.",
    },
    {
        id: "data-table",
        prompt: "Show a table of recent invoices with a status badge on each row.",
        notes: "Common failure: bg-green-100/bg-red-100 status pills straight from the Tailwind palette.",
    },
    {
        id: "nav-header",
        prompt: "Build a top navigation bar with a logo, three links, and a sign-in button.",
        notes: "Common failure: arbitrary heights like h-[68px] instead of the spacing scale.",
    },
    {
        id: "toast",
        prompt: "Add a success toast that appears after saving.",
        notes: "Copy should avoid 'Seamlessly saved!' style filler.",
    },
    {
        id: "onboarding-banner",
        prompt: "Add a dismissible banner promoting the new analytics feature.",
        notes: "Marketing surface — highest risk of hype vocabulary and off-palette accent colors.",
    },
];
//# sourceMappingURL=tasks.js.map