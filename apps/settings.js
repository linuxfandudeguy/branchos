// apps/settings.js

const settingsApp = {
    id: "settings",
    icon: "bi-gear-fill",
    title: "Settings",
    fullscreen: false, // optional, default true if omitted
    html: `
        <div style="padding:10px;font-family:Segoe UI,sans-serif;color:#000;">
            <h3>Profile & Wallpaper Settings</h3>
            
            <label for="usernameInput">Username:</label>
            <input id="usernameInput" type="text" class="form-control" placeholder="Enter username" style="margin-bottom:10px;">
            
            <label for="wallpaperInput">Upload Wallpaper:</label>
            <input id="wallpaperInput" type="file" accept="image/*" style="margin-bottom:10px;">
            
            <button id="applySettingsBtn" class="btn btn-primary">Apply</button>
        </div>
    `,
    onLoad: function(wrapper){
        // Wrapper is the window-body container
        const usernameInput = wrapper.querySelector("#usernameInput");
        const wallpaperInput = wrapper.querySelector("#wallpaperInput");
        const applyBtn = wrapper.querySelector("#applySettingsBtn");

        // Load saved values if any
        if(localStorage.getItem("username")) usernameInput.value = localStorage.getItem("username");
        if(localStorage.getItem("wallpaperData")) {
            document.body.style.backgroundImage = `url(${localStorage.getItem("wallpaperData")})`;
        }

        // Apply button
        applyBtn.onclick = () => {
            const username = usernameInput.value.trim();
            localStorage.setItem("username", username);

            if(wallpaperInput.files.length > 0){
                const file = wallpaperInput.files[0];
                const reader = new FileReader();
                reader.onload = function(e){
                    localStorage.setItem("wallpaperData", e.target.result);
                    document.body.style.backgroundImage = `url(${e.target.result})`;
                }
                reader.readAsDataURL(file);
            }

            alert("Settings applied and saved!");
        }
    }
};

// Push to Apps array for dynamic loader
window.Apps = window.Apps || [];
window.Apps.push(settingsApp);
