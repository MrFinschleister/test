let inputs = {
    defaultX: {
        type: "range",
        min: -2,
        max: 2,
        step: 0.0001,
    },

    defaultY: {
        type: "range",
        min: -2,
        max: 2,
        step: 0.0001,
    },

    p: {
        type: "range",
        min: -2,
        max: 2,
        step: 0.0001,
    },

    numMax: {
        type: "range",
        min: 0,
        max: 8,
        step: 0.0001,
    },

    fractalType: {
        type: "select",
        options: ["mandelbrot", "julia", "misiurewicz", "misc1",],
    }
}

function hidescreen(fromButton) {
    document.getElementById('screen-shader').style.display = "inline";
    document.getElementById('info-div').style.display = "inline";

    if (!fromButton && JSON.parse(localStorage.getItem('hide-info-div'))) {
        openscreen();
    }
}

function openscreen() {
    document.getElementById('screen-shader').style.display = "none";
    document.getElementById('info-div').style.display = "none";

    if (document.getElementById('info-checkbox').checked) {
        localStorage.setItem('hide-info-div', JSON.stringify(true));
    }

    if (!loopStarted) {
        frame();
    }
}

function instantiateInputs() {
    let div = document.getElementById('input-div');
    div.innerHTML = "";

    let inputKeys = Object.keys(inputs);

    for (let i = 0; i < inputKeys.length; i++) {
        let key = inputKeys[i];
        let selInput = inputs[key];
        let type = selInput.type;

        let newInput;

        if (type == "range") {
            newInput = document.createElement('input');
            newInput.type = "range";
            newInput.min = selInput.min;
            newInput.max = selInput.max;
            newInput.step = selInput.step;

            let newLabel = document.createElement('label');
            newLabel.innerHTML = key + ": " + data[key];
            newLabel.id = key + "Label";

            div.appendChild(newLabel);
        } else if (type == "select") {
            newInput = document.createElement('select');
            let options = selInput.options;

            for (let o = 0; o < options.length; o++) {
                let newOption = document.createElement('option');
                newOption.value = o;
                newOption.innerHTML = options[o];

                newInput.appendChild(newOption);
            }
        }

        newInput.id = key + "Input";
        newInput.classList.add(type);
        newInput.value = data[key];
        newInput.oninput = () => {setFromInputs()};

        div.appendChild(newInput);
    }
}

function setFromInputs() {
    let inputKeys = Object.keys(inputs);

    for (let i = 0; i < inputKeys.length; i++) {
        let key = inputKeys[i];

        let val = document.getElementById(key + "Input").value;

        data[key] = val;

        if (inputs[key].type == "range") {
            document.getElementById(key + "Label").innerHTML = key + ": " + val;
        }
    }

    defaults.fractalType = data.fractalType;
}

function resetValues() {
    data = Object.assign({}, defaults);
    instantiateInputs();
}