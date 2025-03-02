let mouseX = 0.5;
let mouseY = 0.5;

function setListeners() {
    document.addEventListener('keydown', keydown);
    canvas.addEventListener('wheel', wheel);
    canvas.addEventListener('mousedown', mousedown);
    canvas.addEventListener('mousemove', mousemove);
    canvas.addEventListener('mouseup', mouseup);

    canvas.addEventListener('touchstart', touchstart);
    canvas.addEventListener('touchmove', touchmove);
    canvas.addEventListener('touchend', touchend);
}

function keydown(e) {
    let code = e.code;

    let offsetStep = settings.offsetStep * data.scale;

    if (code == "KeyI") {
        data.scale /= settings.scaleStep;
    } else if (code == "KeyK") {
        data.scale *= settings.scaleStep;
    } else if (code == "KeyD") {
        data.offsetX += offsetStep;
    } else if (code == "KeyA") {
        data.offsetX -= offsetStep;
    } else if (code == "KeyW") {
        data.offsetY += offsetStep;
    } else if (code == "KeyS") {
        data.offsetY -= offsetStep;
    } else if (code == "Space") {
        resetValues();
    }
}

function zoom(deltaY, zoomIn, moveToward) {
    if (zoomIn) {
        data.scale /= settings.scaleStep ** Math.abs(deltaY / window.innerHeight * 10);

        if (moveToward) {
            let movementX = (mouseX / window.innerWidth - 0.5) / 10;
            let movementY = (mouseY / window.innerHeight - 0.5) / 10;
         
            data.offsetX += movementX * data.scale;
            data.offsetY -= movementY * data.scale;
        }
    } else {
        data.scale *= settings.scaleStep ** Math.abs(deltaY / window.innerHeight * 10);
    }
}

function wheel(e) {
    e.preventDefault();

    zoom(e.deltaY, e.deltaY < 0, e.ctrlKey);
}

function mousedown(e) {
    dragging = true;

    mouseX = e.clientX;
    mouseY = e.clientY;
}

function touchstart(e) {
    mousedown(e.touches[0]);
}

function mousemove(e) {
    if (dragging) {
        data.offsetX -= data.scale * (e.clientX - mouseX) / window.innerHeight;
        data.offsetY += data.scale * (e.clientY - mouseY) / window.innerHeight;
    }

    mouseX = e.clientX;
    mouseY = e.clientY;
}

function touchmove(e) {
    mousemove(e.touches[0]);

    if (e.touches.length == 2) {

    }
}

function mouseup(e) {
    dragging = false;
}

function touchend(e) {
    mouseup(e.touches[0]);
}

function frame(t) {
    render();

    window.requestAnimationFrame((t) => {frame(t)});
}