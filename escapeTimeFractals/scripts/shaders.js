const vertexShader = `
    attribute vec4 position;

    void main() {
        gl_Position = position;
    }
`

const fragmentShader = `
    precision highp float;
    
    uniform float width;
    uniform float height;
    uniform float scale;
    uniform float offsetX;
    uniform float offsetY;
    uniform float defaultX;
    uniform float defaultY;
    uniform float p;
    uniform float numMax;
    uniform float fractalType;

    const float maxIterations = 100.0;

    float map(float value, float start1, float end1, float start2, float end2) {
        return start2 + (end2 - start2) * ((value - start1) / (end1 - start1));
    }

    float mandelbrot(float initX, float initY) {
        float x = defaultX;
        float y = defaultY;
        float a = initX;
        float b = initY;

        float iterations = 0.0;

        for (float i = 0.0; i < maxIterations; i++) {
            if (x * x + y * y > numMax) {
                break;
            }

            float tempZX = x * x - y * y + a;
            float tempZY = 2.0 * x * y + b;

            x = tempZX;
            y = tempZY;

            iterations++;
        }
        
        float percent = iterations / maxIterations;

        return percent;
    }
    
    float julia(float initX, float initY) {
        float x = initX;
        float y = initY;
        float a = defaultX;
        float b = defaultY;

        float iterations = 0.0;

        float lastX = x;
        float lastY = y;

        for (float i = 0.0; i < maxIterations; i++) {
            if (x * x + y * y > numMax) {
                break;
            }

            float tempX = x * x - y * y + a + p * lastX;
            float tempY = 2.0 * x * y + b + p * lastY;

            lastX = x;
            lastY = y;

            x = tempX;
            y = tempY;

            iterations++;
        }
        
        float percent = iterations / maxIterations;

        return percent;
    }

    float misiurewicz(float x, float y) {
        float zX = x;
        float zY = y;
        float cX = x;
        float cY = y;

        float iterations = 0.0;

        for (float i = 0.0; i < maxIterations; i++) {
            if (zX * zX + zY * zY > numMax) {
                break;
            }

            float tempZX = zX * zX - zY * zY + cX;
            float tempZY = 2.0 * zX * zY + cY;

            zX = tempZX;
            zY = tempZY;

            iterations++;
        }
        
        float percent = iterations / maxIterations;

        return percent;
    }
    
    float misc1(float initX, float initY) {
        float x = initX;
        float y = initY;
        float a = defaultX;
        float b = defaultY;

        float iterations = 0.0;

        for (float i = 0.0; i < maxIterations; i++) {
            if (x * x + y * y > numMax) {
                break;
            }

            float tempX = x * x - y * y + a * a - b * b;
            float tempY = 2.0 * (x * y + a * b);

            x = tempX;
            y = tempY;

            iterations++;
        }
        
        float percent = iterations / maxIterations;

        return percent;
    }

    void main() {
        float scaleX = scale;
        float scaleY = height / width * scale;

        float x = offsetX + map(gl_FragCoord.x, 0.0, width, -1.0 * scaleX, scaleX);
        float y = offsetY + map(gl_FragCoord.y, 0.0, height, -1.0 * scaleY, scaleY);

        float val;

        if (fractalType == 0.0) {
            val = mandelbrot(x, y);
        } else if (fractalType == 1.0) {
            val = julia(x, y);
        } else if (fractalType == 2.0) {
            val = misiurewicz(x, y);
        } else if (fractalType == 3.0) {
            val = misc1(x, y);
        }

        float percent = mod(val * 15.0, 1.0);

        vec4 color = vec4(0.0, 0.0, 0.0, 1.0);

        if (percent < 0.33) {
            color[0] = percent;
        } else if (percent < 0.66) {
            color[1] = percent;
        } else {
            color[2] = percent;
        }

        gl_FragColor = color;
    }
  `