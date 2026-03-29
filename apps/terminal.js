// apps/terminal.js
const terminalApp = {
    id: "terminal",
    icon: "bi-terminal",
    title: "Terminal (tlick kernal by vvaltchev, v86)",
    html: `<iframe src="/apps/terminal/tlick.html" style="width:100%;height:100%;border:none;"></iframe>`
};

// Export for dynamic loader
window.Apps = window.Apps || [];
window.Apps.push(terminalApp);
