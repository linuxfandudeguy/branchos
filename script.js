let zIndexCounter = 1;
let wallpaperData = null;

// Track minimized windows globally
let minimizedWindows = {};

/* ================================
   DYNAMIC APP LOADER
================================ */
function loadAppsFromFiles(appFiles, taskbarId = "taskbar", callback) {
    window.Apps = []; // Reset global Apps array
    let loaded = 0;

    appFiles.forEach(src => {
        const s = document.createElement("script");
        s.src = src;
        s.onload = () => {
            loaded++;
            if (loaded === appFiles.length && typeof callback === "function") {
                callback(window.Apps);
            }
        };
        document.body.appendChild(s);
    });
}

/* ================================
   OPEN WINDOW
================================ */
function openWindow(id, html, title, fullscreen = true) {
    let wrapper = document.getElementById(id);

    // Restore minimized window
    if (wrapper && wrapper.style.display === "none") {
        wrapper.style.display = "block";
        wrapper.style.zIndex = zIndexCounter++;
        delete minimizedWindows[id];
        return;
    }

    // Bring existing window to front
    if (wrapper) {
        wrapper.style.zIndex = zIndexCounter++;
        return;
    }

    // Create new window
    wrapper = document.createElement("div");
    wrapper.className = "window-wrapper";
    wrapper.id = id;
    wrapper.style.zIndex = zIndexCounter++;

    wrapper.innerHTML = `
        <div class="window active">
            <div class="title-bar">
                <div class="title-bar-text">${title}</div>
                <div class="title-bar-controls">
                    <button aria-label="Minimize" onclick="minimizeWindow('${id}')"></button>
                    <button aria-label="Maximize" onclick="maximizeWindow(this)"></button>
                    <button aria-label="Close" onclick="closeWindow(this)"></button>
                </div>
            </div>
            <div class="window-body" style="padding:0;height:calc(100% - 32px)">
                ${html}
            </div>
        </div>
    `;

    document.getElementById("windows").appendChild(wrapper);
    makeDraggable(wrapper);
}

/* ================================
   DRAG FUNCTION
================================ */
function makeDraggable(wrapper) {
    const bar = wrapper.querySelector(".title-bar");
    bar.onmousedown = function (e) {
        const rect = wrapper.getBoundingClientRect();
        let offsetX = e.clientX - rect.left;
        let offsetY = e.clientY - rect.top;

        function move(e) {
            wrapper.style.left = e.clientX - offsetX + "px";
            wrapper.style.top = e.clientY - offsetY + "px";
        }

        document.addEventListener("mousemove", move);
        document.addEventListener("mouseup", () => {
            document.removeEventListener("mousemove", move);
        }, { once: true });
    };
}

/* ================================
   WINDOW CONTROLS
================================ */
function minimizeWindow(id) {
    const win = document.getElementById(id);
    if (!win) return;
    win.style.display = "none";
    minimizedWindows[id] = win;
}

function maximizeWindow(btn) {
    const win = btn.closest('.window-wrapper');

    if (win.classList.contains("max")) {
        // Restore
        if (document.fullscreenElement === win) document.exitFullscreen().catch(err => console.log(err));
        win.style.width = "600px";
        win.style.height = "400px";
        win.style.top = "";
        win.style.left = "";
        win.classList.remove("max");
    } else {
        // Maximize container
        win.style.top = "0";
        win.style.left = "0";
        win.style.width = "100%";
        win.style.height = "calc(100% - 48px)";
        win.classList.add("max");

        // Attempt fullscreen
        if (win.requestFullscreen) win.requestFullscreen().catch(err => console.log(err));
    }
}

function closeWindow(btn) {
    const win = btn.closest('.window-wrapper');
    if (document.fullscreenElement === win) document.exitFullscreen().catch(err => console.log(err));
    win.remove();
    delete minimizedWindows[win.id];
}

/* ================================
   TASKBAR INITIALIZATION
================================ */
const appFiles = ["apps/terminal.js", "apps/about.js"];

window.onload = () => {
    loadAppsFromFiles(appFiles, "taskbar", (apps) => {
        const taskbar = document.getElementById("taskbar");

        apps.forEach(app => {
            const btn = document.createElement("button");
            btn.innerHTML = app.icon.includes("bi-") ? `<i class="bi ${app.icon}"></i>` : app.icon;
            btn.title = app.title;

            // Clicking taskbar opens/restores window
            btn.onclick = () => openWindow(app.id, app.html, app.title, app.fullscreen !== false);

            taskbar.appendChild(btn);
        });
    });
};
