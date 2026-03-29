let zIndexCounter = 1;
let wallpaperData = null;
let username = "";

// ========================
// WINDOW SYSTEM
// ========================
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

// ========================
// DRAGGING
// ========================
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
        document.addEventListener("mouseup", ()=> document.removeEventListener("mousemove", move), {once:true});
    };
}

// ========================
// WINDOW CONTROLS
// ========================
function minimizeWindow(btn){ btn.closest('.window-wrapper').style.display='none'; }
function maximizeWindow(btn){
    const win = btn.closest('.window-wrapper');
    if(win.classList.contains('max')){
        win.style.width='600px'; win.style.height='400px';
        win.classList.remove('max');
    } else {
        win.style.top='0'; win.style.left='0';
        win.style.width='100%'; win.style.height='calc(100% - 48px)';
        win.classList.add('max');
    }
}
function closeWindow(btn){ btn.closest('.window-wrapper').remove(); }

// ========================
// SETTINGS PANEL
// ========================
function toggleSettingsPanel(){
    const panel=document.getElementById("settingsPanel");
    panel.style.display = panel.style.display==="none"?"block":"none";
}

function applySettings(){
    const userInput=document.getElementById("usernameInput").value;
    if(userInput) username=userInput;

    const wallpaperFile=document.getElementById("wallpaperInput").files[0];
    if(wallpaperFile){
        const reader=new FileReader();
        reader.onload=function(e){
            wallpaperData=e.target.result;
            document.body.style.backgroundImage=`url(${wallpaperData})`;
        };
        reader.readAsDataURL(wallpaperFile);
    }
    alert(`Settings applied!\nUsername: ${username}`);
}

// ========================
// LOAD APPS INTO TASKBAR
// ========================
function loadApps(appList){
    const taskbar = document.getElementById("taskbar");
    appList.forEach(app=>{
        const btn=document.createElement("button");
        btn.innerHTML=app.icon.includes("bi-")?`<i class="bi ${app.icon}"></i>`:app.icon;
        btn.title=app.title;
        btn.onclick=()=>openWindow(app.id, app.html, app.title, app.fullscreen!==false);
        taskbar.appendChild(btn);
    });
}
