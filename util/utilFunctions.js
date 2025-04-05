function extendArray(source, targetLength) {
    let newArr = [];

    let sourceLength = source.length;

    for (let i = 0; i < targetLength; i++) {
        newArr[i] = source[i % sourceLength];
    }

    return newArr;
}

function createRectangleMeshX(quads, height, depth, offsetX, offsetY, offsetZ) {
    let positions = [];

    let startY = offsetY - height / 2;
    let startZ = offsetZ - depth / 2;

    let stepY = height / quads;
    let stepZ = depth / quads;

    let vertices = [];
    let indices = []

    for (let z = 0; z <= quads; z++) {
        let w = startZ + z * stepZ;
        for (let y = 0; y <= quads; y++) {
            let u = startY + x * stepY;
            vertices.push([offsetX, u, w]);
        }
    }

    let rowSize = (quads + 1);

    for (let z = 0; z < quads; z++) {
        let rowOffset0 = (z + 0) * rowSize;
        let rowOffset1 = (z + 1) * rowSize;
        
        for (let y = 0; y < quads; y++) {
            let offset0 = rowOffset0 + y;
            let offset1 = rowOffset1 + y;

            indices.push(offset0, offset0 + 1, offset1);
            indices.push(offset1, offset0 + 1, offset1 + 1);
        }
    }

    for (let i = 0; i < indices.length - 1; i++) {
        let index = indices[i];
        positions.push(vertices[index]);
    }

    return positions.flat();
}

function createRectangleMeshY(quads, width, depth, offsetX, offsetY, offsetZ) {
    let positions = [];

    let startX = offsetX - width / 2;
    let startZ = offsetZ - depth / 2;

    let stepX = width / quads;
    let stepZ = depth / quads;

    let vertices = [];
    let indices = []

    for (let z = 0; z <= quads; z++) {
        let w = startZ + z * stepZ;
        for (let x = 0; x <= quads; x++) {
            let u = startX + x * stepX;
            vertices.push([u, offsetY, w]);
        }
    }

    let rowSize = (quads + 1);

    for (let z = 0; z < quads; z++) {
        let rowOffset0 = (z + 0) * rowSize;
        let rowOffset1 = (z + 1) * rowSize;
        
        for (let x = 0; x < quads; x++) {
            let offset0 = rowOffset0 + x;
            let offset1 = rowOffset1 + x;

            indices.push(offset0, offset0 + 1, offset1);
            indices.push(offset1, offset0 + 1, offset1 + 1);
        }
    }

    for (let i = 0; i < indices.length - 1; i++) {
        let index = indices[i];
        positions.push(vertices[index]);
    }

    return positions.flat();
}

function createRectangleMeshZ(quads, width, height, offsetX, offsetY, offsetZ) {
    let positions = [];

    let startX = offsetX - width / 2;
    let startY = offsetY - height / 2;

    let stepX = width / quads;
    let stepY = height / quads;

    let vertices = [];
    let indices = []

    for (let y = 0; y <= quads; y++) {
        let v = startY + y * stepY;
        for (let x = 0; x <= quads; x++) {
            let u = startX + x * stepX;
            vertices.push([u, v, offsetZ]);
        }
    }

    let rowSize = (quads + 1);

    for (let y = 0; y < quads; y++) {
        let rowOffset0 = (y + 0) * rowSize;
        let rowOffset1 = (y + 1) * rowSize;
        
        for (let x = 0; x < quads; x++) {
            let offset0 = rowOffset0 + x;
            let offset1 = rowOffset1 + x;

            indices.push(offset0, offset0 + 1, offset1);
            indices.push(offset1, offset0 + 1, offset1 + 1);
        }
    }

    for (let i = 0; i < indices.length - 1; i++) {
        let index = indices[i];
        positions.push(vertices[index]);
    }

    return positions.flat();
}

function createCubeMesh(width, height, depth, centerX, centerY, centerZ) {
    let positions = [];

    let vertices = [
        // Front face
        -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,

        // Back face
        -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,

        // Top face
        -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,

        // Bottom face
        -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,

        // Right face
        1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,

        // Left face
        -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
    ];

    let indices = [
        0,
        1,
        2,
        0,
        2,
        3, // front
        4,
        5,
        6,
        4,
        6,
        7, // back
        8,
        9,
        10,
        8,
        10,
        11, // top
        12,
        13,
        14,
        12,
        14,
        15, // bottom
        16,
        17,
        18,
        16,
        18,
        19, // right
        20,
        21,
        22,
        20,
        22,
        23, // left
    ];

    for (let i = 0; i < indices.length; i++) {
        let index = indices[i] * 3;
        
        let x = vertices[index + 0] * width + centerX;
        let y = vertices[index + 1] * height + centerY;
        let z = vertices[index + 2] * depth + centerZ;

        positions.push(x, y, z);
    }

    return positions;
}

function createSphereMesh(faces, radius, centerX, centerY, centerZ) {
    let positions = [];
    let vertices = [];

    let numVertices = Math.floor(Math.sqrt(faces));

    for (let x = 0; x <= numVertices; x++) {
        for (let y = 0; y <= numVertices; y++) {
            let theta = 2 * Math.PI * (x / numVertices);
            let phi = Math.PI / 2 - Math.PI * (y / numVertices);

            let newX = centerX + (radius * Math.cos(phi)) * Math.cos(theta);
            let newY = centerY + (radius * Math.cos(phi)) * Math.sin(theta);
            let newZ = centerZ + radius * Math.sin(phi);
            
            vertices.push([newX, newY, newZ]);
        }
    }

    for (let i = numVertices; i < vertices.length; i++) {
        positions.push(vertices[i - numVertices]);
        positions.push(vertices[i]);
    }

    return positions.flat();
}