// apps/calculator.js
const calculatorApp = {
    id: "calculator",
    icon: "bi bi-calculator",
    taskbar: true, // show on taskbar

    title: "Calculator",
    html: `<iframe src="./apps/calculator.html" style="width:100%;height:100%;border:none;"></iframe>`
};

// Push to Apps array for dynamic loader
window.Apps = window.Apps || [];
window.Apps.push(calculatorApp);
