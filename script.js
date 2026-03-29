let zIndexCounter = 1;
let wallpaperData = null;
let username = "";

/* ================================
   DYNAMIC APP LOADER FUNCTION
================================ */
function loadAppsFromFiles(appFiles, taskbarId="taskbar", callback){
    window.Apps = []; // Reset global Apps array

    let loaded = 0;
    appFiles.forEach(src=>{
        const s = document.createElement("script");
        s.src = src;
        s.onload = ()=>{
            loaded++;
            if(loaded === appFiles.length && typeof callback === "function"){
                callback(window.Apps); // Return loaded apps
            }
        };
        document.body.appendChild(s);
    });
}

/* ================================
   TASKBAR & WINDOW FUNCTIONS
================================ */
function openWindow(id, html, title, fullscreen=true){
    if(document.getElementById(id)) return;

    const wrapper = document.createElement("div");
    wrapper.className="window-wrapper";
    wrapper.id=id;
    wrapper.style.zIndex=zIndexCounter++;

    wrapper.innerHTML=`
        <div class="window active">
            <div class="title-bar">
                <div class="title-bar-text">${title}</div>
                <div class="title-bar-controls">
                    <button aria-label="Minimize" onclick="minimizeWindow(this)"></button>
                    <button aria-label="Maximize" onclick="maximizeWindow(this)"></button>
                    <button aria-label="Close" onclick="closeWindow(this)"></button>
                </div>
            </div>
            <div class="window-body" style="padding:0;height:calc(100% - 32px)">
                ${html}
            </div>
        </div>
    `;

    if(!fullscreen) wrapper.querySelector(".window-body").style.height="calc(100% - 32px)";

    document.getElementById("windows").appendChild(wrapper);
    makeDraggable(wrapper);
}

function makeDraggable(wrapper){
    const bar = wrapper.querySelector(".title-bar");
    bar.onmousedown = function(e){
        let offsetX = e.clientX - wrapper.offsetLeft;
        let offsetY = e.clientY - wrapper.offsetTop;

        function move(e){
            wrapper.style.left = e.clientX - offsetX + "px";
            wrapper.style.top = e.clientY - offsetY + "px";
        }

        document.addEventListener("mousemove", move);
        document.addEventListener("mouseup", ()=> {
            document.removeEventListener("mousemove", move);
        }, {once:true});
    };
}

function minimizeWindow(btn){ btn.closest('.window-wrapper').style.display='none'; }
function maximizeWindow(btn){
    const win = btn.closest('.window-wrapper');
    if(win.classList.contains("max")){
        win.style.width="600px";
        win.style.height="400px";
        win.classList.remove("max");
    } else {
        win.style.top="0";
        win.style.left="0";
        win.style.width="100%";
        win.style.height="calc(100% - 48px)";
        win.classList.add("max");
    }
}
function closeWindow(btn){ btn.closest('.window-wrapper').remove(); }

/* ================================
   INITIALIZE TASKBAR AFTER LOADING APPS
================================ */
const appFiles = ["apps/terminal.js"];

window.onload = ()=>{
    loadAppsFromFiles(appFiles, "taskbar", (apps)=>{
        const taskbar = document.getElementById("taskbar");
        apps.forEach(app=>{
            const btn = document.createElement("button");
            btn.innerHTML = app.icon.includes("bi-") ? `<i class="bi ${app.icon}"></i>` : app.icon;
            btn.title = app.title;
            btn.onclick = ()=> openWindow(app.id, app.html, app.title, app.fullscreen!==false);
            taskbar.appendChild(btn);
        });
    });
};
