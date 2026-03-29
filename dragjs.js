(function () {
    // Make sure there is a desktop element
    const desktop = document.getElementById("desktop");
    if (!desktop) {
        console.error("No #desktop element found. Drag-drop JS module cannot initialize.");
        return;
    }

    /* ================================
       DRAG & DROP HANDLER
    ================================= */
    desktop.addEventListener("dragover", (e) => e.preventDefault());

    desktop.addEventListener("drop", (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;

        for (const file of files) {
            if (file.type === "application/javascript" || file.name.endsWith(".js")) {
                showJSRunDialog(file);
            } else {
                alert(`Skipped "${file.name}": Not a JavaScript file.`);
            }
        }
    });

    /* ================================
       CUSTOM RUN DIALOG
    ================================= */
    function showJSRunDialog(file) {
        const id = `js-dialog-${Date.now()}`;

        const html = `
            <div class="window active is-bright" role="dialog" aria-labelledby="${id}-title">
                <div class="title-bar">
                    <div class="title-bar-text" id="${id}-title">Run JavaScript File</div>
                    <div class="title-bar-controls">
                        <button aria-label="Close" onclick="this.closest('.window-wrapper').remove()"></button>
                    </div>
                </div>
                <div class="window-body has-space">
                    <p>Do you want to run <strong>${file.name}</strong>? This can be unsafe.</p>
                </div>
                <footer style="text-align: right; padding: 4px 8px;">
                    <button onclick="this.closest('.window-wrapper').remove()">Cancel</button>
                    <button id="${id}-run">Run</button>
                </footer>
            </div>
        `;

        // Use existing openWindow function from main script
        if (typeof openWindow === "function") {
            openWindow(id, html, `Run JS: ${file.name}`);
        } else {
            console.warn("openWindow() not found. Creating raw dialog.");
            const wrapper = document.createElement("div");
            wrapper.className = "window-wrapper";
            wrapper.style.position = "absolute";
            wrapper.style.top = "50px";
            wrapper.style.left = "50px";
            wrapper.style.width = "400px";
            wrapper.style.zIndex = 9999;
            wrapper.innerHTML = html;
            desktop.appendChild(wrapper);
            makeDraggable(wrapper);
        }

        const runBtn = document.getElementById(`${id}-run`);
        runBtn.onclick = () => {
            const reader = new FileReader();
            reader.onload = function (event) {
                try {
                    const script = document.createElement("script");
                    script.textContent = event.target.result;
                    document.body.appendChild(script);
                    console.log(`Executed ${file.name}`);
                } catch (err) {
                    alert(`Error running ${file.name}: ${err}`);
                }
            };
            reader.readAsText(file);

            // Close the dialog
            const win = runBtn.closest(".window-wrapper");
            if (win) win.remove();
        };
    }

    /* ================================
       MAKE WINDOW DRAGGABLE (fallback)
    ================================= */
    function makeDraggable(wrapper) {
        const bar = wrapper.querySelector(".title-bar");
        if (!bar) return;

        bar.onmousedown = function (e) {
            const rect = wrapper.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;
            const offsetY = e.clientY - rect.top;

            function move(ev) {
                wrapper.style.left = ev.clientX - offsetX + "px";
                wrapper.style.top = ev.clientY - offsetY + "px";
            }

            document.addEventListener("mousemove", move);
            document.addEventListener(
                "mouseup",
                () => {
                    document.removeEventListener("mousemove", move);
                },
                { once: true }
            );
        };
    }
})();
