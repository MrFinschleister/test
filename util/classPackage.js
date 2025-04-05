class Terminal {
    static init() {
        Terminal.commands = {
            "eval": function (content) {
                eval(content);
            },
            "collapse": function () {
                if (Terminal.collapsed) {
                    Terminal.el.style.height = "90vh";
                } else {
                    Terminal.el.style.height = "5vh";
                }

                Terminal.collapsed = !Terminal.collapsed;
            }
        }

        Terminal.benchmarks = [];
        Terminal.benchmarkGroups = {};
        Terminal.collapsed = false;

        Terminal.el = document.createElement("div");
        Terminal.el.id = "terminal";

        Terminal.el.style.height = "90vh";
        Terminal.el.style.width = "30vw";
        Terminal.el.style.backgroundColor = "rgba(0, 0, 0, .9)";
        Terminal.el.style.position = "absolute";
        Terminal.el.style.right = "1vh";
        Terminal.el.style.top = "1vh";
        Terminal.el.style.overflowY = "hidden";
        Terminal.el.style.overflowX = "hidden";
        Terminal.el.style.border = "1px black solid";

        Terminal.in = document.createElement('input');
        Terminal.in.onchange = function () {
            Terminal.inputCommand();
        }

        Terminal.in.placeholder = "Input Command";
        Terminal.in.type = "text";
        Terminal.in.style.width = "25vw";
        Terminal.in.style.height = "2vh";
        Terminal.in.style.position = "absolute";
        Terminal.in.style.bottom = "0.5vh";
        Terminal.in.style.backgroundColor = "rgba(30, 30, 30, 1)";
        Terminal.in.style.border = "0";
        Terminal.in.style.color = "white";

        let hr = document.createElement("hr");
        hr.style.width = "30vw";
        hr.style.position = "absolute";
        hr.style.top = "84vh";

        Terminal.out = document.createElement("div");
        Terminal.out.style.height = "85vh";
        Terminal.out.style.overflowY = "scroll";
        Terminal.out.style.overflowX = "clip";
        Terminal.out.style.color = "lightgray";

        document.body.appendChild(Terminal.el);
        Terminal.el.appendChild(Terminal.out);
        Terminal.el.appendChild(hr);
        Terminal.el.appendChild(Terminal.in);
    }

    static print(text) {
        let p = document.createElement('p');
        p.innerHTML = String(text).split(" ").join("&nbsp");
        p.style.height = "fit-content";
        p.style.wordBreak = "break-all";
        p.style.display = "block";

        Terminal.out.appendChild(p);
    }

    static printLink(text, link, fileName) {
        let a = document.createElement('a');
        a.innerHTML = JSON.stringify(text).split(" ").join("&nbsp");
        a.style.height = "fit-content";
        a.style.wordBreak = "break-all";
        a.style.display = "block";
        a.style.textDecoration = "none";
        a.href = link;
        a.target = "_blank";

        if (fileName) {
            a.download = fileName;
        }

        Terminal.out.appendChild(a);
    }

    static printElement(element) {
        Terminal.out.appendChild(element);
    }

    static inputCommand() {
        let command = Terminal.in.value;
        Terminal.in.value = "";

        try {
            let comm = command.split(" ");

            Terminal.commands[comm[0]](comm.slice(1).join(" "));
        } catch (error) {
            Terminal.error(error);
        }
    }

    static error(error) {
        let stack = error.stack.split(":");
        let fileFull = stack[2].split("/");
        let file = fileFull[fileFull.length - 1];

        let row = stack[3];
        let column = stack[4].split(')')[0];

        let output = error + "<br>        " + file + " - " + row + ":" + column;

        let urlBase = new Blob([error.stack], { type: "text/plain" });
        let url = URL.createObjectURL(urlBase);

        Terminal.print(output);
        Terminal.printLink("       ~ view full ~", url);
    }

    static clear() {
        Terminal.out.innerHTML = "";
    }

    static clearBenchmarks() {
        Terminal.benchmarkGroups = {};

        Terminal.createBenchmarkGroup("Main");
    }

    static addBenchmark(name) {
        Terminal.addBenchmarkToGroup("Main", name);
    }

    static createBenchmarkGroup(group) {
        if (!Terminal.benchmarkGroups[group]) {
            Terminal.benchmarkGroups[group] = new BenchmarkGroup((text) => { Terminal.print(text) });
        }
    }

    static addBenchmarkToGroup(group, name) {
        if (!Terminal.benchmarkGroups[group]) {
            return;
        }

        Terminal.benchmarkGroups[group].addBenchmark(name);
    }

    static printBenchmarkGroup(group) {
        if (!Terminal.benchmarkGroups[group]) {
            return;
        }

        Terminal.printBenchmarkGroupNames(group);
        Terminal.print("~~~");
        Terminal.printBenchmarkGroupTimes(group);
    }

    static printBenchmarkGroupNames(group) {
        if (!Terminal.benchmarkGroups[group]) {
            return;
        }

        Terminal.benchmarkGroups[group].printNames();
    }

    static printBenchmarkGroupTimes(group) {
        if (!Terminal.benchmarkGroups[group]) {
            return;
        }

        Terminal.benchmarkGroups[group].printTimes();
    }

    static printBenchmarkGroupTimesBreakdown() {
        if (!Terminal.benchmarkGroups[group]) {
            return;
        }

        Terminal.benchmarkGroups[group].printTimesBreakdown();
    }

    static printBenchmarks() {
        Terminal.printBenchmarkGroup("Main");
    }
}

class Benchmark {
    constructor(name, timestamp) {
        this.name = name;
        this.timestamp = timestamp;
    }
}

class BenchmarkGroup {
    constructor(printFn, elementFn) {
        this.printFn = printFn || ((text) => { Terminal.out.print(text) });
        this.elementFn = elementFn || ((element) => { Terminal.printElement(element) });

        this.benchmarks = [];

        this.precision = 3;
    }

    addBenchmark(name) {
        let newBenchmark = new Benchmark(name, performance.now());

        this.benchmarks.push(newBenchmark);
    }

    printNames() {
        let benchmarks = this.benchmarks;

        for (let x = 0; x < benchmarks.length; x++) {
            this.printFn("Name: " + benchmarks[x].name + "</br> Timestamp: " + String(benchmarks[x].timestamp));
        }
    }

    printTimes() {
        let benchmarks = this.benchmarks;

        let printString = "";

        for (let x = 1; x < benchmarks.length; x++) {
            let name = benchmarks[x - 1].name + " to " + benchmarks[x].name + ": ";
            let time = benchmarks[x].timestamp - benchmarks[x - 1].timestamp;
            let timeString = String((time).toFixed(this.precision)) + "ms";

            printString += name + timeString + "</br>";
        }

        let totalTime = String((benchmarks[benchmarks.length - 1].timestamp - benchmarks[0].timestamp).toFixed(this.precision)) + "ms";

        this.printFn(printString);
        this.printFn("Total Time: " + totalTime);
    }

    printTimesBreakdown() {
        let benchmarks = this.benchmarks;

        let times = [];

        let printString = "";

        for (let x = 1; x < benchmarks.length; x++) {
            let name = benchmarks[x - 1].name + " to " + benchmarks[x].name + ": ";
            let time = benchmarks[x].timestamp - benchmarks[x - 1].timestamp;
            let timeString = String((time).toFixed(this.precision)) + "ms";

            times.push([x, time]);

            printString += name + timeString + "</br>";
        }

        let totalTime = String((benchmarks[benchmarks.length - 1].timestamp - benchmarks[0].timestamp).toFixed(this.precision)) + "ms";

        let calculator = new RegressionCalculator(times);
        let regression = calculator.getBestRegression();
        let similarity = calculator.getSimilarity(regression.equation.fn);

        let newTimes = [];

        for (let i of times) {
            newTimes.push([i[0], regression.equation.fn(i[0])]);
        }

        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');

        let clientDimensions = "15vw";
        let canvasDimensions = 500;

        canvas.style.width = clientDimensions;
        canvas.style.height = clientDimensions;
        canvas.style.border = "1px white solid;"
        canvas.width = canvasDimensions;
        canvas.height = canvasDimensions;

        let scaleX = canvasDimensions / (times.length + 1);
        let scaleY = 1;

        for (let x = 0; x < times.length - 1; x++) {
            let sel00 = times[x];
            let sel01 = times[x + 1];
            let sel10 = newTimes[x];
            let sel11 = newTimes[x + 1];

            ctx.strokeStyle = "white";
            ctx.beginPath();
            ctx.moveTo(sel00[0] * scaleX, sel00[1] * scaleY);
            ctx.lineTo(sel01[0] * scaleX, sel01[1] * scaleY);
            ctx.stroke();

            ctx.strokeStyle = "blue";
            ctx.beginPath();
            ctx.moveTo(sel10[0] * scaleX, sel10[1] * scaleY);
            ctx.lineTo(sel11[0] * scaleX, sel11[1] * scaleY);
            ctx.stroke();
        }

        this.printFn(printString);
        this.printFn("Total Time: " + totalTime);
        this.printFn("Rate of Change Type: " + regression.type + "</br>Format: " + regression.equation.format + "</br>Equation: " + regression.equation.stringFn + "</br>Similarity: " + String(similarity) + (similarity >= 0.7 ? " (good)" : " (bad)"));
        this.elementFn(canvas);
    }
}

class Matrix {
    // Instiantiate new matrix with defined row and column values
    constructor(rows, columns) {
        this.rows = rows;
        this.columns = columns;

        this.matrix = [];
        this.presetMatrix();
    }

    // Return a stringified matrix
    toString() {
        return JSON.stringify(this.matrix);
    }

    // Prefill the matrix with zeros
    presetMatrix() {
        for (let x = 0; x < this.rows; x++) {
            this.matrix[x] = [];

            for (let y = 0; y < this.columns; y++) {
                this.matrix[x][y] = 0;
            }
        }
    }

    // Return the value at a row/column index within the matrix
    getValue(row, column) {
        return this.matrix[row][column];
    }

    // Set the value at a row/column index within the index
    setValue(row, column, val) {
        if (row > this.rows || column > this.columns) {
            throw new Error('Outside matrix bounds.');
        }

        this.matrix[row][column] = val;
    }

    // Fill the matrix from a defined source array
    setMatrix(source) {
        for (let x = 0; x < this.rows && x < source.length; x++) {
            for (let y = 0; y < this.columns && y < source[x].length; y++) {
                this.setValue(x, y, source[x][y]);
            }
        }
    }

    // Return the determinant of the matrix
    getDeterminant() {
        if (this.rows != this.columns) {
            throw new Error('Matrix not square.');
        }

        if (this.rows == 2) {
            let a = this.getValue(0, 0);
            let b = this.getValue(0, 1);
            let c = this.getValue(1, 0);
            let d = this.getValue(1, 1);

            return a * d - b * c;
        } else if (this.rows == 3) {
            let a = this.getValue(0, 0);
            let b = this.getValue(0, 1);
            let c = this.getValue(0, 2);
            let d = this.getValue(1, 0);
            let e = this.getValue(1, 1);
            let f = this.getValue(1, 2);
            let g = this.getValue(2, 0);
            let h = this.getValue(2, 1);
            let i = this.getValue(2, 2);

            return a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
        } else {
            throw new Error('I\'m too lazy to implement that.');
        }
    }

    // Return a new matrix where each value is equal to its corresponding index's minors in the original matrix
    replaceMinors() {
        if (this.rows != 3 || this.columns != 3) {
            throw new Error('Not a 3x3 matrix.');
        }
        let newMatrix = new Matrix(this.rows, this.columns);

        let a = this.getValue(0, 0);
        let b = this.getValue(0, 1);
        let c = this.getValue(0, 2);
        let d = this.getValue(1, 0);
        let e = this.getValue(1, 1);
        let f = this.getValue(1, 2);
        let g = this.getValue(2, 0);
        let h = this.getValue(2, 1);
        let i = this.getValue(2, 2);

        let a1 = e * i - h * f;
        let b1 = d * i - g * f;
        let c1 = d * h - g * e;
        let d1 = b * i - h * c;
        let e1 = a * i - g * c;
        let f1 = a * h - g * b;
        let g1 = b * f - e * c;
        let h1 = a * f - d * c;
        let i1 = a * e - d * b;

        let matrixArr = [
            [a1, b1, c1],
            [d1, e1, f1],
            [g1, h1, i1]
        ];

        newMatrix.setMatrix(matrixArr);

        return newMatrix;
    }

    // Invert every other sign within the matrix from a defined starting value
    invertSigns(start) {
        let counter = start || 0;

        let newMatrix = new Matrix(this.rows, this.columns);

        for (let x = 0; x < this.rows; x++) {
            for (let y = 0; y < this.columns; y++) {
                let value = this.getValue(x, y);

                if (counter % 2 != 0) {
                    value *= -1;
                }

                newMatrix.setValue(x, y, value);

                counter++;
            }
        }

        return newMatrix;
    }

    // Return the matrix with its X and Y axes swapped
    transpose() {
        let newMatrix = new Matrix(this.columns, this.rows);

        for (let x = 0; x < this.rows; x++) {
            for (let y = 0; y < this.columns; y++) {
                newMatrix.setValue(y, x, this.getValue(x, y));
            }
        }

        return newMatrix;
    }

    // Scale each value within the matrix by a defined scalar
    scale(scalar) {
        let newMatrix = new Matrix(this.rows, this.columns);

        for (let x = 0; x < this.rows; x++) {
            for (let y = 0; y < this.columns; y++) {
                newMatrix.setValue(x, y, this.getValue(x, y) * scalar);
            }
        }

        return newMatrix;
    }

    // Add two matrices of similar dimensions 
    add(source) {
        if (this.rows != source.rows || this.columns != source.columns) {
            throw new Error('Matrix dimensions not equivilent.');
        }

        let newMatrix = new Matrix(this.rows, this.columns);

        for (let x = 0; x < this.rows; x++) {
            for (let y = 0; y < this.columns; y++) {
                let val = this.getValue(x, y) + source.getValue(x, y);

                newMatrix.setValue(x, y, val);
            }
        }

        return newMatrix;
    }

    // Multiply two matrices of similar inner dimensions
    multiply(source) {
        if (this.columns != source.rows) {
            throw new Error('Inner dimensions not equivilent.');
        }

        let newMatrix = new Matrix(this.rows, source.columns);

        for (let column = 0; column < source.columns; column++) {
            for (let x = 0; x < this.rows; x++) {
                let val = 0;

                for (let y = 0; y < this.columns; y++) {
                    val += this.getValue(x, y) * source.getValue(y, column);
                }

                newMatrix.setValue(x, column, val);
            }
        }

        return newMatrix;
    }

    // Return the inversion of the matrix
    invert() {
        let determinant = this.getDeterminant();
        let minors = this.replaceMinors();
        let signInverted = minors.invertSigns();
        let transposed = signInverted.transpose();

        let result = transposed.scale(1 / determinant);

        return result;
    }
}

class RegressionCalculator {
    constructor(points) {
        this.points = points;

        this.precision = 3;
    }

    // Find all regressions and return the best fit
    getBestRegression() {
        let lin = { type: "linear", equation: this.linearRegression() };
        let quad = { type: "quadratic", equation: this.quadraticRegression() };
        let exp = { type: "exponential", equation: this.exponentialRegression() };

        let equations = [lin, quad, exp];

        equations.sort((a, b) => (this.getSimilarity(b.equation.fn) - this.getSimilarity(a.equation.fn)));

        return equations[0];
    }

    // Return the linear regression of the sample points
    linearRegression() {
        let n = this.points.length;

        let sX = 0;
        let sY = 0;
        let sXY = 0;
        let sXX = 0;
        let sYY = 0;

        for (let i of this.points) {
            let x = i[0];
            let y = i[1];

            sX += x;
            sY += y;

            sXY += x * y;
            sXX += x * x;
            sYY += y * y;
        }

        const sXsYBar = (sX * sY) / n;
        const sXsXBar = (sX * sX) / n;
        const sYsYBar = (sY * sY) / n;

        const xBar = sX / n;
        const yBar = sY / n;

        const numerator = sXY - sXsYBar;
        const denominator = sXX - sXsXBar;
        const rDenom = Math.sqrt((sXX - sXsXBar) * (sYY - sYsYBar));

        const slope = numerator / denominator;
        const intercept = yBar - slope * xBar;
        const r = numerator / rDenom;

        const fn = (x) => { return intercept + slope * x };
        const stringFn = `f(x) = ${intercept.toFixed(this.precision)} + ${slope.toFixed(this.precision)}x`;
        const format = "f(x) = a + bx";
        const equation = { a: intercept, b: slope, r: r, fn: fn, stringFn: stringFn, format: format };

        return equation;
    }

    // Return the exponential regression of the sample points
    exponentialRegression() {
        let newPoints = [];

        for (let i of this.points) {
            if (i[1] != 0) {
                newPoints.push([i[0], Math.log(i[1])]);
            }
        }

        const calculator = new RegressionCalculator(newPoints);
        const linEquation = calculator.linearRegression();

        const fn = (x) => { return Math.pow(Math.E, linEquation.a) * Math.pow(Math.pow(Math.E, linEquation.b), x) };
        const stringFn = `f(x) = ${Math.pow(Math.E, linEquation.a).toFixed(this.precision)} * ${Math.pow(Math.E, linEquation.b).toFixed(this.precision)} ^ x)`;
        const format = "f(x) = ab ^ x";
        const equation = { a: Math.pow(Math.E, linEquation.a), b: Math.pow(Math.E, linEquation.b), r: linEquation.r, fn: fn, stringFn: stringFn, format: format };

        return equation;
    }

    // Return the quadratic regression of the sample points
    quadraticRegression() {
        let n = this.points.length;

        let sX = 0;
        let sY = 0;
        let sX2 = 0;
        let sX3 = 0;
        let sX4 = 0;
        let sXY = 0;
        let sX2Y = 0;

        for (let i of this.points) {
            let x = i[0];
            let y = i[1];

            sX += x;
            sY += y;
            sX2 += x * x;
            sX3 += x * x * x;
            sX4 += x * x * x * x;
            sXY += x * y;
            sX2Y += x * x * y;
        };

        const intermediate = new Matrix(3, 3);
        intermediate.setMatrix([
            [sX4, sX3, sX2],
            [sX3, sX2, sX],
            [sX2, sX, n],
        ]);

        const output = new Matrix(3, 1)
        output.setMatrix([
            [sX2Y],
            [sXY],
            [sY],
        ]);

        const result = intermediate.invert().multiply(output);

        const a = result.getValue(0, 0);
        const b = result.getValue(1, 0);
        const c = result.getValue(2, 0);

        const fn = (x) => { return a * x * x + b * x + c };
        const stringFn = `f(x) = ${a.toFixed(this.precision)}x ^ 2 + ${b.toFixed(this.precision)}x + ${c.toFixed(this.precision)}`;
        const format = "f(x) = ax ^ 2 + bx + c";
        const equation = { a: a, b: b, c: c, fn: fn, stringFn: stringFn, format: format };

        return equation;
    }

    // Find the similarity coefficient between the input function and the sample points
    getSimilarity(fn) {
        const n = this.points.length;

        let sY = 0;
        let sSR = 0;
        let sST = 0;

        for (let i of this.points) {
            let x = i[0];
            let y1 = i[1];
            let y2 = fn(x);

            sY += y1;
            sSR += Math.pow(y1 - y2, 2);
        }

        sY /= n;

        for (let i of this.points) {
            sST += Math.pow(i[1] - sY, 2);
        }

        const r2 = 1 - sSR / sST;

        return r2.toFixed(this.precision);
    }
}

class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static neutral() {
        return new Vector2(0, 0);
    }

    static unitRand() {
        let angle = Math.random() * Math.PI * 2;

        return new Vector2(-Math.cos(angle), Math.sin(angle));
    }

    static up() {
        return new Vector2(0, 1);
    }

    static upRand() {
        return new Vector2(0, Math.random());
    }

    static down() {
        return new Vector2(0, -1);
    }

    static downRand() {
        return new Vector2(0, -Math.random());
    }

    static left() {
        return new Vector2(-1, 0);
    }

    static leftRand() {
        return new Vector2(-Math.random(), 0);
    }

    static right() {
        return new Vector2(1, 0);
    }

    static rightRand() {
        return new Vector2(Math.random(), 0);
    }

    static positive() {
        return new Vector2(1, 1);
    }

    static negative() {
        return new Vector2(-1, -1);
    }

    static from(sourceArr) {
        return new Vector2(sourceArr[0], sourceArr[1]);
    }

    toString() {
        return this.x + ", " + this.y;
    }

    valueOf() {
        return this.magnitude();
    }

    array() {
        return [this.x, this.y];
    }

    clone() {
        return new Vector2(this.x, this.y);
    }

    set(v2) {
        this.x = v2.x;
        this.y = v2.y;
    }

    // basic operations that reassign values

    add(v2) {
        this.x += v2.x;
        this.y += v2.y;
    }

    subtract(v2) {
        this.x -= v2.x;
        this.y -= v2.y;
    }

    multiply(v2) {
        this.x *= v2.x;
        this.y *= v2.y;
    }

    divide(v2) {
        this.x /= v2.x;
        this.y /= v2.y;
    }

    scale(scalar) {
        this.x *= scalar;
        this.y *= scalar;
    }

    normalise() {
        let magnitude = this.magnitude();

        if (magnitude == 0) {
            return;
        } else {
            this.x /= magnitude;
            this.y /= magnitude;
        }
    }

    // basic operations the maintain values and return a new vector

    sum(v2) {
        return new Vector2(this.x + v2.x, this.y + v2.y);
    }

    difference(v2) {
        return new Vector2(this.x - v2.x, this.y - v2.y);
    }

    product(v2) {
        return new Vector2(this.x * v2.x, this.y * v2.y);
    }

    quotient(v2) {
        return new Vector2(this.x / v2.x, this.y / v2.y);
    }

    distance(v2) {
        let xDiff = this.x - v2.x;
        let yDiff = this.y - v2.y;

        return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    }

    squaredDistance(v2) {
        let xDiff = this.x - v2.x;
        let yDiff = this.y - v2.y;

        return xDiff * xDiff + yDiff * yDiff;
    }

    scaled(scalar) {
        return new Vector2(this.x * scalar, this.y * scalar);
    }

    normalised() {
        let magnitude = this.magnitude();

        if (magnitude == 0) {
            return new Vector2(0, 0);
        } else {
            return new Vector2(this.x / magnitude, this.y / magnitude);
        }
    }

    // other general operations

    average(v2) {
        return new Vector2((this.x + v2.x) / 2, (this.y + v2.y) / 2);
    }

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    dotProd(v2) {
        return this.x * v2.x + this.y * v2.y;
    }

    dotProdSelf() {
        let x = this.x;
        let y = this.y;

        return x * x + y * y;
    }

    capNum(num) {
        if (this.x > num) {
            this.x = num;
        } else if (this.x < -num) {
            this.x = -num;
        }

        if (this.y > num) {
            this.y = num;
        } else if (this.y < -num) {
            this.y = -num;
        }
    }

    isEqual(v2, tolerance) {
        if (tolerance) {
            if (Math.abs(this.x - v2.x) < tolerance && Math.abs(this.y - v2.y) < tolerance) {
                return true;
            }
        } else {
            if (this.x == v2.x && this.y == v2.y) {
                return true;
            }
        }

        return false
    }

    lerp(v2, weight) {
        return this.sum(new Vector2(v2.x - this.x, v2.y - this.y).scaled(weight));
    }

    distance(v2) {
        return this.difference(v2).magnitude();
    }

    rotateRad(theta, origin) {
        let v1 = this.difference(origin)

        let ct = Math.cos(theta);
        let st = Math.sin(theta);

        v1.x = v1.x * ct - v1.y * st;
        v1.y = v1.x * st + v1.y * ct;

        return v1.sum(origin);
    }

    round() {
        return new Vector2(Math.round(this.x), Math.round(this.y));
    }

    greaterThan(v2) {
        return (this.x > v2.x && this.y > v2.y);
    }

    greaterThanEq(v2) {
        return (this.x >= v2.x && this.y >= v2.y);
    }

    lessThan(v2) {
        return (this.x < v2.x && this.y < v2.y);
    }

    lessThanEq(v2) {
        return (this.x <= v2.x && this.y <= v2.y);
    }
}

class Vector3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    static neutral() {
        return new Vector3(0, 0, 0);
    }

    static unitRand() {
        let theta = Math.random() * Math.PI * 2;
        let phi = Math.random() * Math.PI;

        return new Vector3(Math.sin(phi) * Math.cos(theta), Math.sin(phi) * Math.sin(theta), Math.cos(phi));
    }

    static up() {
        return new Vector3(0, 1, 0);
    }

    static down() {
        return new Vector3(0, -1, 0);
    }

    static left() {
        return new Vector3(-1, 0, 0);
    }

    static right() {
        return new Vector3(1, 0, 0);
    }

    static from(sourceArr) {
        return new Vector3(sourceArr[0], sourceArr[1], sourceArr[2]);
    }

    toString() {
        return this.x + ", " + this.y + ", " + this.z;
    }

    valueOf() {
        return this.magnitude();
    }

    array() {
        return [this.x, this.y, this.z];
    }

    clone() {
        return new Vector3(this.x, this.y, this.z);
    }

    set(v2) {
        this.x = v2.x;
        this.y = v2.y;
        this.z = v2.z;
    }

    // basic operations that reassign values

    add(v2) {
        this.x += v2.x;
        this.y += v2.y;
        this.z += v2.z;
    }

    subtract(v2) {
        this.x -= v2.x;
        this.y -= v2.y;
        this.z -= v2.z;
    }

    multiply(v2) {
        this.x *= v2.x;
        this.y *= v2.y;
        this.z *= v2.z;
    }

    divide(v2) {
        this.x /= v2.x;
        this.y /= v2.y;
        this.z /= v2.z;
    }

    scale(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
    }

    normalise() {
        let magnitude = this.magnitude();

        if (magnitude == 0) {
            return;
        } else {
            this.x /= magnitude;
            this.y /= magnitude;
            this.z /= magnitude;
        }
    }

    // basic operations the maintain values and return a new vector

    sum(v2) {
        return new Vector3(this.x + v2.x, this.y + v2.y, this.z + v2.z);
    }

    sum1(x, y, z) {
        return new Vector3(this.x + x, this.y + y, this.z + z);
    }

    difference(v2) {
        return new Vector3(this.x - v2.x, this.y - v2.y, this.z - v2.z);
    }

    product(v2) {
        return new Vector3(this.x * v2.x, this.y * v2.y, this.z * v2.z);
    }

    quotient(v2) {
        return new Vector3(this.x / v2.x, this.y / v2.y, this.z / v2.z);
    }

    distance(v2) {
        let xDiff = this.x - v2.x;
        let yDiff = this.y - v2.y;
        let zDiff = this.z - v2.z;

        return Math.sqrt(xDiff * xDiff + yDiff * yDiff + zDiff * zDiff);
    }

    squaredDistance(v2) {
        let xDiff = this.x - v2.x;
        let yDiff = this.y - v2.y;
        let zDiff = this.z - v2.z;

        return xDiff * xDiff + yDiff * yDiff + zDiff * zDiff;
    }

    scaled(scalar) {
        return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
    }

    normalised() {
        let magnitude = this.magnitude();

        if (magnitude == 0) {
            return new Vector3(0, 0, 0);
        } else {
            return new Vector3(this.x / magnitude, this.y / magnitude, this.z / magnitude);
        }
    }

    // other general operations

    average(v2) {
        return new Vector3((this.x + v2.x) / 2, (this.y + v2.y) / 2, (this.z + v2.z) / 2);
    }

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    dotProd(v2) {
        return this.x * v2.x + this.y * v2.y + this.z * v2.z;
    }

    dotProdSelf() {
        let x = this.x;
        let y = this.y;
        let z = this.z;

        return x * x + y * y + z * z;
    }

    crossProd(v2) {
        let x = (this.y * v2.z) - (this.z * v2.y);
        let y = (this.z * v2.x) - (this.x * v2.z);
        let z = (this.x * v2.y) - (this.y * v2.x);

        return new Vector3(x, y, z);
    }

    capNum(num) {
        if (this.x > num) {
            this.x = num;
        } else if (this.x < -num) {
            this.x = -num;
        }

        if (this.y > num) {
            this.y = num;
        } else if (this.y < -num) {
            this.y = -num;
        }

        if (this.z > num) {
            this.z = num;
        } else if (this.z < -num) {
            this.z = -num;
        }
    }

    isEqual(v2, tolerance) {
        if (tolerance) {
            if (Math.abs(this.x - v2.x) < tolerance && Math.abs(this.y - v2.y) < tolerance && Math.abs(this.z - v2.z) < tolerance) {
                return true;
            }
        } else {
            if (this.x == v2.x && this.y == v2.y && this.z == v2.z) {
                return true;
            }
        }

        return false
    }

    lerp(v2, weight) {
        return this.sum(new Vector3(v2.x - this.x, v2.y - this.y, v2.z - this.z).scaled(weight));
    }


    scaleZ(scalar, origin) {
        let difference = this.difference(origin);

        if (difference.z == 0) {
            return this.clone();
        }

        return difference.scaled(scalar / difference.z);
    }

    rotateDeg(degs, origin) {
        let rads = degs.scaled(Math.PI / 180);

        return this.rotateRad(rads, origin);
    }

    rotateRad(rads, origin) {
        let v1 = this.difference(origin)

        rads.x = rads.x;
        rads.y = rads.y;
        rads.z = rads.z;

        let cx = Math.cos(rads.x);
        let sx = Math.sin(rads.x);
        let cy = Math.cos(rads.y);
        let sy = Math.sin(rads.y);
        let cz = Math.cos(rads.z);
        let sz = Math.sin(rads.z);

        let zx = rads.z != 0 ? v1.x * cz - v1.y * sz : v1.x;
        let zy = rads.z != 0 ? v1.y * cz + v1.x * sz : v1.y;

        let yx = rads.y != 0 ? zx * cy - v1.z * sy : zx;
        let yz = rads.y != 0 ? v1.z * cy + zx * sy : v1.z;

        let xy = rads.x != 0 ? zy * cx - yz * sx : zy;
        let xz = rads.x != 0 ? yz * cx + zy * sx : yz;

        v1.x = yx;
        v1.y = xy;
        v1.z = xz;

        return v1.sum(origin);
    }

    round() {
        return new Vector3(Math.round(this.x), Math.round(this.y), Math.round(this.z));
    }

    greaterThan(v2) {
        return (this.x > v2.x && this.y > v2.y && this.z > v2.z);
    }

    greaterThanEq(v2) {
        return (this.x >= v2.x && this.y >= v2.y && this.z >= v2.z);
    }

    lessThan(v2) {
        return (this.x < v2.x && this.y < v2.y && this.z < v2.z);
    }

    lessThanEq(v2) {
        return (this.x <= v2.x && this.y <= v2.y && this.z <= v2.z);
    }
}

class Perlin {
    constructor(seed) {
        this.seed = 0;

        for (let x = 0; x < String(seed).length; x++) {
            this.seed += String(seed).charCodeAt(x);
        }

        this.perm = [151, 160, 137, 91, 90, 15,
            131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23,
            190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33,
            88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166,
            77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244,
            102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196,
            135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123,
            5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42,
            223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9,
            129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228,
            251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107,
            49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254,
            138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180];

        this.randLookup = {};
        this.valLookup = {};
    }

    random(seed) {
        let h1 = 1779033703, h2 = 3144134277,
            h3 = 1013904242, h4 = 2773480762;

        h1 = h2 ^ (h1 ^ seed * 597399067);
        h2 = h3 ^ (h2 ^ seed * 2869860233);
        h3 = h4 ^ (h3 ^ seed * 951274213);
        h4 = h1 ^ (h4 ^ seed * 2716044179);

        h1 ^= (h2 ^ h3 ^ h4), h2 ^= h1, h3 ^= h1, h4 ^= h1;
        return Math.abs(h1 / (h2 ^ h3) * h4) % 1;
    }

    getUnitVector(x, y) {
        let seed = this.seedSum ^ (x ^ this.perm[x % 512]) ^ (y ^ this.perm[y ^ 512]);

        if (this.randLookup[seed]) {
            return this.randLookup[seed];
        } else {
            let rand = this.random(seed);
            let x1 = Math.cos(rand * Math.PI * 2);
            let y1 = Math.sin(rand * Math.PI * 2);
            this.randLookup[seed] = [x1, y1];

            return [x1, y1]
        }

    }

    dotProduct(v1, x2, y2) {
        return v1[0] * x2 + v1[1] * y2;
    }

    interpolate(val1, val2, weight) {
        let val = val1 + (val2 - val1) * weight;
        return val;
    }

    ease(t) {
        let t3 = t * t * t;
        let t4 = t3 * t;
        let t5 = t4 * t;
        return 6 * t5 - 15 * t4 + 10 * t3;
    }

    perlin(x, y) {
        let x1 = Math.floor(x);
        let y1 = Math.floor(y);
        let x2 = x1 + 1;
        let y2 = y1 + 1;

        let x3 = x - x1;
        let y3 = y - y1;
        let x4 = 1 - x3;
        let y4 = 1 - y3;

        let dotProd1 = this.dotProduct(this.getUnitVector(x1, y1), x3, y3);
        let dotProd2 = this.dotProduct(this.getUnitVector(x2, y1), -x4, y3);
        let dotProd3 = this.dotProduct(this.getUnitVector(x1, y2), x3, -y4);
        let dotProd4 = this.dotProduct(this.getUnitVector(x2, y2), -x4, -y4);

        let iP1 = this.interpolate(dotProd1, dotProd2, this.ease(x3));
        let iP2 = this.interpolate(dotProd3, dotProd4, this.ease(x3));
        let iP3 = this.interpolate(iP1, iP2, this.ease(y3));

        return iP3;
    }

    perlinLayered(x, y) {
        x /= this.cellSize;
        y /= this.cellSize;

        let val = 0;

        let frequency = this.frequency;
        let factor = this.factor;

        for (let i = 0; i < this.octaves; i++) {
            let x1 = x * frequency + i * 0.72;
            let y1 = y * frequency + i * 0.72;

            val += this.perlin(x1, y1) * factor;

            frequency *= this.roughness;
            factor *= this.persistence;
        }

        return val * this.contrast;
    }
}

class Particle2D {
    constructor(position) {
        this.position = position;
        this.prevPosition = position.clone();
        this.velocity = Vector2.neutral();
        this.locked = false;
    }

    lock() {
        this.locked = !this.locked;
    }

    force(force) {
        if (!this.locked) {
            this.position.add(force);
        }
    }

    tick(velocityMax) {
        if (!this.locked) {
            let position = this.position;
            let prevPosition = this.prevPosition;

            let force = position.difference(prevPosition);

            if (velocityMax) {
                force.capNum(velocityMax);
            }

            prevPosition.set(position);
            position.add(force);
        }
    }
}

class VelocityParticle2D {
    constructor(position) {
        this.position = position;
        this.velocity = Vector2.neutral();
        this.acceleration = Vector2.neutral();
        this.prevPosition = position.clone();;
        this.locked = false;
        this.density = 0;
    }

    lock() {
        this.locked = !this.locked;
    }

    tick() {
        if (this.locked) {
            this.velocity.scale(0);
            this.acceleration.scale(0);

            return;
        }

        this.prevPosition.set(this.position);

        this.velocity.add(this.acceleration);
        this.acceleration.scale(0);
        this.position.add(this.velocity);
    }

    force(force) {
        this.acceleration.add(force);
    }
}

class ParticleConnection2D {
    constructor(particleA, particleB, length, rigidity) {
        this.particleA = particleA;
        this.particleB = particleB;

        this.length = length;
        this.rigidity = rigidity;
    }

    tick() {
        let length = this.length;
        let rigidity = this.rigidity;

        let particleA = this.particleA;
        let particleB = this.particleB;

        let positionA = particleA.position;
        let positionB = particleB.position;

        let direction = positionA.difference(positionB);
        let distance = direction.magnitude();
        direction.scale(1 / distance);

        let moveLength = length - distance;
        let springForce = moveLength * rigidity * 0.5;

        direction.scale(springForce);

        if (!particleA.locked) {
            positionA.add(direction);
        }
        if (!particleB.locked) {
            positionB.subtract(direction);
        }
    }
}

class ParticleLooseConnection2D {
    constructor(particleA, particleB, length) {
        this.particleA = particleA;
        this.particleB = particleB;

        this.length = length;
    }

    tick() {
        let length = this.length;

        let particleA = this.particleA;
        let particleB = this.particleB;

        let positionA = particleA.position;
        let positionB = particleB.position;

        let difference = positionA.difference(positionB);
        let center = positionA.average(positionB);

        let stickDir = difference.normalised().scaled(length / 2)

        if (!particleA.locked) {
            positionA.set(center.sum(stickDir));
        }
        if (!particleB.locked) {
            positionB.set(center.difference(stickDir));
        }
    }
}

class RectangleCollider2D {
    constructor(position, width, height) {
        this.type = 0;
        this.position = position;
        this.width = width;
        this.height = height;
    }
}

class CircleCollider2D {
    constructor(position, radius) {
        this.type = 1;
        this.position = position;
        this.radius = radius;
    }
}

class NullCollider2D {
    constructor(position) {
        this.position = position;
        this.type = -1;
    }
}

class MeshSoftbodyPhysicsObject2D {
    constructor(position, particles, particleConnections, width, height, collisionPadding, numIterations, useCollision) {
        if (!collisionPadding) {
            collisionPadding = 0;
        }

        this.position = position;
        this.width = width;
        this.height = height;
        this.particles = particles;
        this.particleConnections = particleConnections;
        this.numIterations = numIterations || 1;

        if (useCollision) {
            this.collider = new RectangleCollider2D(position, width + collisionPadding, height + collisionPadding);
        } else {
            this.collider = new NullCollider2D(position);
        }
    }

    setPosition() {
        let particles = this.particles;
        let length = particles.length;

        if (length == 0) {
            return;
        }

        let avgPosition = Vector2.neutral();

        let minX;
        let minY;
        let maxX;
        let maxY;

        for (let p = 0; p < particles.length; p++) {
            let particle = particles[p];
            let position = particle.position;

            avgPosition.add(position);

            if (!minX || position.x < minX) {
                minX = position.x;
            } else if (!maxX || position.x > maxX) {
                maxX = position.x;
            }
            if (!minY || position.y < minY) {
                minY = position.y;
            } else if (!maxY || position.y > maxY) {
                maxY = position.y;
            }
        }

        this.collider.width = maxX - minX;
        this.collider.height = maxY - minY;

        this.position.set(avgPosition.scaled(1 / length));
    }

    applyForce(force) {
        let particles = this.particles;

        for (let p = 0; p < particles.length; p++) {
            let particle = particles[p];
            particle.force(force);
        }
    }
}

class RectangleSoftbodyPhysicsObject2D {
    constructor(position, rigidity, width, height, numIterations) {
        if (!collisionPadding) {
            collisionPadding = 0;
        }

        this.width = width;
        this.height = height;
        this.position = position;

        this.numIterations = numIterations || 1;

        let halfWidth = width / 2;
        let halfHeight = height / 2;

        let p1 = new Particle2D(new Vector2(position.x + halfWidth, position.y + halfHeight));
        let p2 = new Particle2D(new Vector2(position.x + halfWidth, position.y - halfHeight));
        let p3 = new Particle2D(new Vector2(position.x - halfWidth, position.y - halfHeight));
        let p4 = new Particle2D(new Vector2(position.x - halfWidth, position.y + halfHeight));

        let side1 = new ParticleConnection2D(p1, p2, height, rigidity);
        let side2 = new ParticleConnection2D(p2, p3, width, rigidity);
        let side3 = new ParticleConnection2D(p3, p4, height, rigidity);
        let side4 = new ParticleConnection2D(p4, p1, width, rigidity);

        let crossLength = Math.sqrt(width * width + height * height);

        let cross5 = new ParticleConnection2D(p1, p3, crossLength, rigidity);
        let cross6 = new ParticleConnection2D(p2, p4, crossLength, rigidity);

        this.particles = [p1, p2, p3, p4];
        this.particleConnections = [side1, side2, side3, side4, cross5, cross6];

        this.collider = new RectangleCollider2D(this.position, width + collisionPadding, height + collisionPadding);
    }

    setPosition() {
        let particles = this.particles;
        let length = particles.length;

        if (length == 0) {
            return;
        }

        let avgPosition = Vector2.neutral();

        for (let p = 0; p < particles.length; p++) {
            let particle = particles[p];

            avgPosition.add(particle.position);
        }

        this.position.set(avgPosition.scaled(1 / length));
    }

    applyForce(force) {
        let particles = this.particles;

        for (let p = 0; p < particles.length; p++) {
            let particle = particles[p];
            particle.force(force);
        }
    }
}

class CircleSoftbodyPhysicsObject2D {
    constructor(position, rigidity, radius, collisionPadding, numIterations) {
        if (!collisionPadding) {
            collisionPadding = 0;
        }

        this.position = position;
        this.radius = radius;
        
        this.numIterations = numIterations || 1;

        let steps = 8;
        let crossStep = 3;
        let numCrosses = steps / crossStep;

        let particles = [];
        let particleConnections = [];

        let radStep = (Math.PI * 2) / steps;
        let rads = 0;

        for (let i = 0; i < steps; i++) {
            let newPos = position.sum(new Vector2(-Math.cos(rads), Math.sin(rads)).scaled(radius));
            let newParticle = new Particle2D(newPos);

            particles.push(newParticle);

            rads += radStep;
        }

        for (let i = 0; i < particles.length; i++) {
            let p1 = particles[i];

            for (let j = 0; j < numCrosses; j++) {
                let k = (i + (j + 1) * crossStep) % particles.length;

                if (k == i) {
                    continue;
                }

                let p2 = particles[k];
                let newConnection = new ParticleConnection2D(p1, p2, p1.position.distance(p2.position), rigidity);
                particleConnections.push(newConnection);
            }
        }

        this.particles = particles;
        this.particleConnections = particleConnections;

        this.collider = new CircleCollider2D(this.position, radius + collisionPadding);
    }

    setPosition() {
        let particles = this.particles;
        let length = particles.length;

        if (length == 0) {
            return;
        }

        let avgPosition = Vector2.neutral();

        for (let p = 0; p < particles.length; p++) {
            let particle = particles[p];

            avgPosition.add(particle.position);
        }

        this.position.set(avgPosition.scaled(1 / length));
    }

    applyForce(force) {
        let particles = this.particles;

        for (let p = 0; p < particles.length; p++) {
            let particle = particles[p];
            particle.force(force);
        }
    }
}

class RectangleRigidbodyPhysicsObject2D {
    constructor(position, width, height, collisionPadding) {
        if (!collisionPadding) {
            collisionPadding = 0;
        }

        this.type = 0;
        this.density = 0;
        this.position = position;
        this.width = width;
        this.height = height;
        this.particle = new Particle2D(this.position);
        this.collider = new RectangleCollider2D(this.position, width + collisionPadding, height + collisionPadding);
    }

    applyForce(force) {
        this.particle.force(force);
    }
}

class CircleRigidbodyPhysicsObject2D {
    constructor(position, radius, collisionPadding) {
        if (!collisionPadding) {
            collisionPadding = 0;
        }

        this.type = 1;
        this.density = 0;
        this.position = position;
        this.radius = radius;
        this.particle = new Particle2D(this.position);
        this.collider = new CircleCollider2D(this.position, this.radius + collisionPadding);
    }

    applyForce(force) {
        this.particle.force(force);
    }
}

class CollisionDetector2D {
    collision(collider1, collider2) {
        let type1 = collider1.type;
        let type2 = collider2.type;

        switch (type1) {
            case 0: {
                switch (type2) {
                    case 0: {
                        return this.rectangleRectangleCollision(collider1, collider2);
                    }

                    case 1: {
                        return this.circleRectangleCollision(collider1, collider2);
                    }
                }
            }
            case 1: {
                switch (type2) {
                    case 0: {
                        return this.circleRectangleCollision(collider1, collider2);
                    }

                    case 1: {
                        return this.circleCircleCollision(collider1, collider2);
                    }
                }
            }
        }
    }

    rectangleRectangleCollision(collider1, collider2) {
        let difference = collider1.position.difference(collider2.position);

        let combinedWidth = (collider1.width + collider2.width) / 2;
        let combinedHeight = (collider1.height + collider2.height) / 2;

        if (Math.abs(difference.x) <= combinedWidth && Math.abs(difference.y) <= combinedHeight) {
            return difference.magnitude();
        }

        return false;
    }

    circleCircleCollision(collider1, collider2) {
        let pos1 = collider1.position;
        let pos2 = collider2.position;

        let diffX = pos1.x - pos2.x;
        let diffY = pos1.y - pos2.y;
        let distance = diffX * diffX + diffY * diffY;

        let combinedRadius = collider1.radius + collider2.radius;

        if (distance <= combinedRadius * combinedRadius) {
            return Math.sqrt(distance);
        }

        return false;
    }

    circleRectangleCollision(circleCollider, rectangleCollider) {
        let difference = circleCollider.position.difference(rectangleCollider.position);

        let diffX = Math.abs(difference.x);
        let diffY = Math.abs(difference.y);

        let radius = circleCollider.radius;
        let halfWidth = rectangleCollider.width / 2;
        let halfHeight = rectangleCollider.height / 2;

        if (diffX > halfWidth + radius) {
            return false;
        }
        if (diffY > halfHeight + radius) {
            return false;
        }

        if (diffX <= halfWidth) {
            return Math.sqrt(diffX * diffX + diffY * diffY);
        }
        if (diffY <= halfHeight) {
            return Math.sqrt(diffX * diffX + diffY * diffY);
        }

        let widthOverflow = diffX - halfWidth;
        let heightOverflow = diffY - halfHeight;

        if (widthOverflow * widthOverflow + heightOverflow * heightOverflow <= radius * radius) {
            return Math.sqrt(diffX * diffX + diffY * diffY);
        }

        return false;
    }
}

class PhysicsWorld2D {
    constructor() {
        this.gravity = Vector2.neutral();
        this.collisionDampening = -1;

        this.boundingMin = Vector2.neutral();
        this.boundingMax = Vector2.neutral();

        this.doPrintParticles = true;
        this.doPrintParticleConnections = true;
        this.useBounding = false;
        this.useCollisions = false;
        this.quadrantSize = 50;

        this.collisionDampening = 1;
        this.reboundDampening = 0.2;
        this.friction = 1;
        this.velocityMax = 2;
        this.densitySamplingRadius = 15;

        this.physicsObjects = [];
    }

    setPrintParticles(doPrintParticles) {
        this.doPrintParticles = doPrintParticles;
    }

    setPrintParticleConnections(doPrintParticleConnections) {
        this.doPrintParticleConnections = doPrintParticleConnections;
    }

    setGravity(gravity) {
        this.gravity.set(gravity);
    }

    setCollisionDampening(collisionDampening) {
        this.collisionDampening = collisionDampening;
    }

    setReboundDampening(reboundDampening) {
        this.reboundDampening = reboundDampening;
    }

    setFriction(friction) {
        this.friction = friction;
    }

    setVelocityMax(velocityMax) {
        this.velocityMax = velocityMax;
    }

    setQuadrantSize(quadrantSize) {
        this.quadrantSize = quadrantSize;
    }

    setDensitySamplingRadius(densitySamplingRadius) {
        this.densitySamplingRadius = densitySamplingRadius;
    }

    enableBounding() {
        this.useBounding = !this.useBounding;
    }

    enableCollisions() {
        this.useCollisions = !this.useCollisions;
    }

    setBoundingBox(boundingMin, boundingMax) {
        this.boundingMin.set(boundingMin);
        this.boundingMax.set(boundingMax);
    }

    addPhysicsObject(physicsObject) {
        this.physicsObjects.push(physicsObject);
    }

    circleSegmentIntersection(pX, pY, radius, seg1, seg2) {
        pX -= seg1.x;
        pY -= seg1.y;

        let dir = seg1.difference(seg2);
        let length = dir.magnitude();
        dir.normalise();

        let b = -(dir.x * pX + dir.y * pY);
        let c = pX * pX + pY * pY - radius * radius;
        let descr = b * b - c;

        if (descr > 0) {
            let descrRoot = Math.sqrt(descr);

            let t1 = b - descrRoot;
            let t2 = b + descrRoot;

            if (t1 >= -radius && t2 <= length + radius) {
                return true;
            }
        }
    }

    rectangleRectangleCollision(collider1, collider2) {
        let difference = collider1.position.difference(collider2.position);

        let combinedWidth = (collider1.width + collider2.width) / 2;
        let combinedHeight = (collider1.height + collider2.height) / 2;

        if (Math.abs(difference.x) <= combinedWidth && Math.abs(difference.y) <= combinedHeight) {
            return difference.magnitude();
        }

        return false;
    }

    circleCircleCollision(collider1, collider2) {
        let pos1 = collider1.position;
        let pos2 = collider2.position;

        let diffX = pos1.x - pos2.x;
        let diffY = pos1.y - pos2.y;
        let distance = diffX * diffX + diffY * diffY;

        let combinedRadius = collider1.radius + collider2.radius;

        if (distance <= combinedRadius * combinedRadius) {
            return Math.sqrt(distance);
        }

        return false;
    }

    circleRectangleCollision(circleCollider, rectangleCollider) {
        let difference = rectangleCollider.position.difference(circleCollider.position);

        let diffX = Math.abs(difference.x);
        let diffY = Math.abs(difference.y);

        let radius = circleCollider.radius;
        let halfWidth = rectangleCollider.width / 2;
        let halfHeight = rectangleCollider.height / 2;

        if (diffX > halfWidth + radius) {
            return false;
        }
        if (diffY > halfHeight + radius) {
            return false;
        }

        if (diffX <= halfWidth) {
            return Math.sqrt(diffX * diffX + diffY * diffY);
        }
        if (diffY <= halfHeight) {
            return Math.sqrt(diffX * diffX + diffY * diffY);
        }

        let widthOverflow = diffX - halfWidth;
        let heightOverflow = diffY - halfHeight;

        if (widthOverflow * widthOverflow + heightOverflow * heightOverflow <= radius * radius) {
            return Math.sqrt(diffX * diffX + diffY * diffY);
        }

        return false;
    }

    calculatePhysicsCollisions() {
        let collisionDampening = this.collisionDampening;
        let physicsObjects = this.physicsObjects;

        let densitySamplingRadius_2 = this.densitySamplingRadius ** 2;

        for (let p = 0; p < physicsObjects.length; p++) {
            let sel1 = physicsObjects[p];
            let collider1 = sel1.collider;
            let type1 = collider1.type;

            let pos1 = collider1.position;
            let x1 = pos1.x;
            let y1 = pos1.y;

            let width1 = 0;
            let height1 = 0;

            let radius1 = 0;

            if (type1 == 0) {
                width1 = collider1.width;
                height1 = collider1.height;
            } else {
                radius1 = collider1.radius;
            }

            let density = 0;
            

            for (let p1 = 0; p1 < physicsObjects.length; p1++) {
                if (p1 == p) {
                    continue;
                }

                let sel2 = physicsObjects[p1];
                let collider2 = sel2.collider;
                let type2 = collider2.type;

                let pos2 = collider2.position;
                let diffX = x1 - pos2.x;
                let diffY = y1 - pos2.y;

                let dist_2 = diffX * diffX + diffY * diffY;

                let doesCollide = false;

                if (type1 == 0) {
                    if (type2 == 0) {
                        let combinedWidth = (width1 + collider2.width) / 2;
                        let combinedHeight = (height1 + collider2.height) / 2;

                        if (Math.abs(diffX) <= combinedWidth && Math.abs(diffY) <= combinedHeight) {
                            doesCollide = Math.sqrt(dist_2);
                        }
                    } else if (type2 == 1) {
                        doesCollide = this.circleRectangleCollision(collider1, collider2);
                    }
                } else if (type1 == 1) {
                    if (type2 == 0) {
                        doesCollide = this.circleRectangleCollision(collider1, collider2);
                    } else if (type2 == 1) {
                        let combinedRadius = radius1 + collider2.radius;

                        if (dist_2 <= combinedRadius * combinedRadius) {
                            doesCollide = Math.sqrt(dist_2);
                        }
                    }
                }

                if (doesCollide) {
                    let scale = collisionDampening / doesCollide;

                    let direction = new Vector2(diffX * scale, diffY * scale);

                    sel1.applyForce(direction);
                    sel2.applyForce(direction.scaled(-1));
                }

                if (dist_2 < densitySamplingRadius_2) {
                    density++;
                }
            }

            sel1.density = density;
        }
    }
}

class SoftbodyPhysicsWorld2D extends PhysicsWorld2D {
    tick() {
        this.tickPhysicsObjects();

        if (this.useCollisions) {
            this.calculatePhysicsCollisions();;
        }
    }

    tickPhysicsObjects() {
        let gravity = this.gravity;
        let useBounding = this.useBounding;
        let physicsObjects = this.physicsObjects;
        let velocityMax = this.velocityMax;
        let reboundDampening = this.reboundDampening;

        let boundingMin = this.boundingMin;
        let boundingMax = this.boundingMax;

        let bMinX = boundingMin.x;
        let bMinY = boundingMin.y;
        let bMaxX = boundingMax.x;
        let bMaxY = boundingMax.y;

        for (let pO = 0; pO < physicsObjects.length; pO++) {
            let physicsObject = physicsObjects[pO];

            let particles = physicsObject.particles;
            let particleConnections = physicsObject.particleConnections;

            for (let p = 0; p < particles.length; p++) {
                let particle = particles[p];

                particle.force(gravity);
                particle.tick();

                if (useBounding) {
                    let prevPosition = particle.prevPosition;
                    let position = particle.position;
    
                    let pX = position.x;
                    let pY = position.y;
    
                    let reboundVector;
    
                    if (pX < bMinX) {
                        position.x = bMinX;
                        reboundVector = Vector2.right();
                    } else if (pX > bMaxX) {
                        position.x = bMaxX;
                        reboundVector = Vector2.right();
                    }
                    if (pY < bMinY) {
                        position.y = bMinY;
                        reboundVector = Vector2.up();
                    } else if (pY > bMaxY) {
                        position.y = bMaxY;
                        reboundVector = Vector2.up();
                    }
    
                    if (reboundVector) {
                        let velocity = reboundVector.product(position.difference(prevPosition)).scaled(reboundDampening);
                        velocity.capNum(velocityMax);
                        particle.force(velocity);
                    }
                }
            }

            for (let i = 0; i < physicsObject.numIterations; i++) {
                for (let pC = 0; pC < particleConnections.length; pC++) {
                    let particleConnection = particleConnections[pC];
    
                    particleConnection.tick();
                }
            }

            physicsObject.setPosition();
        }
    }

    print(ctx, size) {
        this.printPhysicsObjects(ctx, size);
    }

    printPhysicsObjects(ctx, size) {
        let halfSize = size / 2;
        let physicsObjects = this.physicsObjects;
        let doPrintParticles = this.doPrintParticles;
        let doPrintParticleConnections = this.doPrintParticleConnections;

        for (let pO = 0; pO < physicsObjects.length; pO++) {
            let physicsObject = physicsObjects[pO];

            let particles = physicsObject.particles;
            let particleConnections = physicsObject.particleConnections;

            if (doPrintParticles) {
                for (let p = 0; p < particles.length; p++) {
                    let particle = particles[p];
                    let position = particle.position;

                    ctx.fillRect(position.x - halfSize, position.y - halfSize, size, size);
                }
            }

            if (doPrintParticleConnections) {
                ctx.beginPath();

                for (let pC = 0; pC < particleConnections.length; pC++) {
                    let particleConnection = particleConnections[pC];

                    let pos1 = particleConnection.particleA.position;
                    let pos2 = particleConnection.particleB.position;

                    ctx.moveTo(pos1.x, pos1.y);
                    ctx.lineTo(pos2.x, pos2.y);
                }

                ctx.stroke();
            }
        }
    }
}

class RigidbodyPhysicsWorld2D extends PhysicsWorld2D {
    tick() {
        this.tickPhysicsObjects();

        if (this.useCollisions) {
            this.calculatePhysicsCollisions();
        }
    }

    tickPhysicsObjects() {
        let gravity = this.gravity;
        let reboundDampening = this.reboundDampening;
        let useBounding = this.useBounding;
        let physicsObjects = this.physicsObjects;
        let velocityMax = this.velocityMax;

        let topRight = this.boundingMax;
        let bottomLeft = this.boundingMin;

        let bMinX = bottomLeft.x;
        let bMinY = bottomLeft.y;
        let bMaxX = topRight.x;
        let bMaxY = topRight.y;

        for (let pO = 0; pO < physicsObjects.length; pO++) {
            let physicsObject = physicsObjects[pO];
            let particle = physicsObject.particle;

            particle.force(gravity);
            particle.tick(velocityMax);

            if (useBounding) {
                let prevPosition = particle.prevPosition;
                let position = particle.position;
                let type = physicsObject.type;

                let pX = position.x;
                let pY = position.y;

                let reboundVector;

                let sizeX;
                let sizeY;

                if (type == 0) {
                    sizeX = physicsObject.width;
                    sizeY = physicsObject.height;
                } else if (type == 1) {
                    sizeX = physicsObject.radius;
                    sizeY = physicsObject.radius;
                }

                if (pX < bMinX + sizeX) {
                    position.x = bMinX + sizeX;
                    reboundVector = Vector2.right();
                } else if (pX > bMaxX - sizeX) {
                    position.x = bMaxX - sizeX;
                    reboundVector = Vector2.right();
                }
                if (pY < bMinY + sizeY) {
                    position.y = bMinY + sizeY;
                    reboundVector = Vector2.positive();
                } else if (pY > bMaxY - sizeY) {
                    position.y = bMaxY - sizeY;
                    reboundVector = Vector2.positive();
                }
    
                if (reboundVector) {
                    let velocity = reboundVector.product(position.difference(prevPosition)).scaled(reboundDampening);
                    velocity.capNum(velocityMax);
                    physicsObject.applyForce(velocity);
                }
            }
        }
    }

    print(ctx, size) {
        this.printPhysicsObjects(ctx, size);
    }

    printPhysicsObjects(ctx) {
        let physicsObjects = this.physicsObjects;

        let r1 = 255;
        let g1 = 255;
        let b1 = 255;
        let r2 = 50;
        let g2 = 50;
        let b2 = 255;

        let rDiff = (r2 - r1);
        let gDiff = (g2 - g1);
        let bDiff = (b2 - b1);

        for (let pO = 0; pO < physicsObjects.length; pO++) {
            let physicsObject = physicsObjects[pO];
            let type = physicsObject.type;
            let position = physicsObject.position;

            let density = physicsObject.density;

            let percent = density / 10;

            let r = r1 + rDiff * percent;
            let g = g1 + gDiff * percent;
            let b = b1 + bDiff * percent;

            ctx.strokeStyle = `rgb(${r},${g},${b})`;

            switch (type) {
                case 0: {
                    let width = physicsObject.width;
                    let height = physicsObject.height;
                    ctx.strokeRect(position.x, position.y, width, height);
                }
                case 1: {
                    ctx.beginPath();
                    ctx.arc(position.x, position.y, physicsObject.radius, 0, Math.PI * 2, false);
                    ctx.stroke();
                }
            }
        }
    }
}