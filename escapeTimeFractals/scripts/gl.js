function render() {
    const program = instantiateShaders();

    resetCanvas(program);
    setUniforms(program);
    setBuffers(program);
    drawScene(program);
}

function drawScene(program) {
    const position = gl.getAttribLocation(program, 'position');

    gl.vertexAttribPointer(
        position, // target
        3, // dimensions
        gl.FLOAT, // type
        false, // normalize
        0, // buffer offset
        0 // buffer offset
    );

    gl.enableVertexAttribArray(position);

    // draw vertices
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function instantiateShaders() {
    // Compile vertex shader
    const vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, vertexShader);
    gl.compileShader(vs);
    
    // Compile fragment shader
    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, fragmentShader);
    gl.compileShader(fs);
    
    // Create and launch the WebGL program
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    return program
}

function resetCanvas(program) {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
}

function setUniforms(program) {
    let dataKeys = Object.keys(data);

    for (let i = 0; i < dataKeys.length; i++) {
        let key = dataKeys[i];

        const uniformLocation = gl.getUniformLocation(program, key);
        gl.uniform1f(uniformLocation, data[key]);
    }
}

function setBuffers(program) {
    const vertices = new Float32Array([
        1.0, 1.0, 1.0, 
        -1.0, 1.0, 0.0, 
        1.0, -1.0, 0.0, 
        -1.0, -1.0, 0.0
    ]);

    const vertBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
}