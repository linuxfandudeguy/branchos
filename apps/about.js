// apps/settings.js

const settingsApp = {
    id: "about",
    icon: "bi-gear-fill",
    title: "About",
    fullscreen: false, // optional, default true if omitted
    html: `
        <div style="padding:20px;font-family:Segoe UI,sans-serif;color:#111;max-width:600px;margin:auto;line-height:1.6;">
    <h2 style="margin-bottom:10px;">About ブランチ</h2>
    
    <img src="assets/logo.png" alt="Branch Logo" style="width:120px;height:auto;margin-bottom:15px;border-radius:10px;">

    <p>ブランチ (Branch) is an Web-based OS designed for modern users who want a seamless, modular, and lightweight computing experience directly in their browser. Customize your workflow, explore apps, and enjoy a responsive interface built with simplicity in mind.</p>
    
    <p>With ブランチ, you can:</p>
    <ul>
        <li>Launch and manage apps with ease</li>
        <li>Customize themes and wallpapers</li>
        <li>Save your profile and preferences safely</li>
        <li>Explore a growing ecosystem of community-made modules</li>
    </ul>

    <p>Version: <strong>1.0.0</strong></p>
    <p>Developed by: <strong>ブランチ Team</strong></p>

    <button id="visitWebsiteBtn" class="btn btn-primary" style="margin-top:15px;">Visit Official Website</button>
</div>
    `
};

// Push to Apps array for dynamic loader
window.Apps = window.Apps || [];
window.Apps.push(settingsApp);
