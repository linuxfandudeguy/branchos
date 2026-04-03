let zIndexCounter = 1;
let minimizedWindows = {};

function openWindow(id, html, title) {
    let win = document.getElementById(id);
    if (win) {
        if (win.style.display === "none") {
            win.style.display = "block";
            delete minimizedWindows[id];
        }
        win.style.zIndex = zIndexCounter++;
        return;
    }

    win = document.createElement("div");
    win.className = "window-wrapper";
    win.id = id;
    win.style.zIndex = zIndexCounter++;
    win.style.position = "absolute";
    win.style.width = "800px";
    win.style.height = "600px";
    win.style.top = "50px";
    win.style.left = "50px";

    win.innerHTML = `
        <div class="window active" style="width:100%;height:100%;">
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

    document.getElementById("windows").appendChild(win);
    makeDraggable(win);
}

function makeDraggable(wrapper) {
    const bar = wrapper.querySelector(".title-bar");
    bar.onmousedown = function(e) {
        const rect = wrapper.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
        function move(ev) {
            wrapper.style.left = ev.clientX - offsetX + "px";
            wrapper.style.top = ev.clientY - offsetY + "px";
        }
        document.addEventListener("mousemove", move);
        document.addEventListener("mouseup", () => document.removeEventListener("mousemove", move), { once: true });
    };
}

function minimizeWindow(id) {
    const win = document.getElementById(id);
    if (!win) return;
    win.style.display = "none";
    minimizedWindows[id] = win;
}

function maximizeWindow(btn) {
    const win = btn.closest(".window-wrapper");
    if (win.classList.contains("max")) {
        win.style.width = "800px";
        win.style.height = "600px";
        win.style.top = "50px";
        win.style.left = "50px";
        win.classList.remove("max");
    } else {
        win.style.top = "0";
        win.style.left = "0";
        win.style.width = "100%";
        win.style.height = "calc(100% - 48px)";
        win.classList.add("max");
    }
}

function closeWindow(btn) {
    const win = btn.closest(".window-wrapper");
    win.remove();
    delete minimizedWindows[win.id];
}

window.onload = () => {
    const desktop = document.getElementById("desktop");
    const taskbar = document.getElementById("taskbar");

    if (!window.Apps) return;

    window.Apps.forEach(app => {
        const desktopIcon = document.createElement("div");
        desktopIcon.className = "desktop-icon";
        desktopIcon.id = `desktop-icon-${app.id}`;
        desktopIcon.innerHTML = app.icon.includes("bi-")
            ? `<i class="bi ${app.icon}"></i><span>${app.title}</span>`
            : `<span>${app.title}</span>`;
        desktopIcon.onclick = () => openWindow(app.id, app.html, app.title);
        desktop.appendChild(desktopIcon);

        if (app.taskbar) {
            const btn = document.createElement("button");
            btn.innerHTML = app.icon.includes("bi-") ? `<i class="bi ${app.icon}"></i>` : app.icon;
            btn.title = app.title;
            btn.onclick = () => openWindow(app.id, app.html, app.title);
            taskbar.appendChild(btn);
        }
    });
};
