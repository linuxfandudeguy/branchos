// apps/terminal.js
const terminalApp = {
    id: "terminal",
    icon: "bi-terminal",
    title: "Terminal",
    html: `<iframe src="https://webshell-omega.vercel.app/terminal.html" style="width:100%;height:100%;border:none;"></iframe>`
};

// Export for dynamic loader
window.Apps = window.Apps || [];
window.Apps.push(terminalApp);
