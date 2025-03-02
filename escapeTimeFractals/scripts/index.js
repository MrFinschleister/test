let canvas;
let gl; 

let loopStarted = false;

let settings = {
    resolution: 1,
    scaleStep: 1.1,
    offsetStep: 0.1,
}

let data = {
    width: 500,
    height: 500,
    scale: 2,
    offsetX: 0,
    offsetY: 0,
    defaultX: 0,
    defaultY: 0,
    p: 0,
    numMax: 4,
    fractalType: 0,
}

let defaults;

let dragging = false;

function onload() {
    try {
        canvas = document.querySelector('#gl-canvas');
        canvas.width = canvas.clientWidth / settings.resolution;
        canvas.height = canvas.clientHeight / settings.resolution;
        data.width = canvas.width;
        data.height = canvas.height;

        defaults = Object.assign({}, data);

        gl = canvas.getContext('webgl');

        if (gl == null) {
            throw new Error('Unable to use WebGL, your browser may not support it.');
        }

        hidescreen();

        setListeners();
        instantiateInputs();
    } catch (error) {
        alert(error.stack);
    }
}

function frame(t) {
    loopStarted = true;

    render();

    window.requestAnimationFrame((t) => {frame(t)});
}