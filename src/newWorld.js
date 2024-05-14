// Vertex shader program
var VSHADER_SOURCE = `
    precision mediump float;
    attribute vec4 a_Position;
    attribute vec2 a_UV;
    varying vec2 v_UV;
    uniform mat4 u_ModelMatrix;
    uniform mat4 u_GlobalRotateMatrix;
    uniform mat4 u_ViewMatrix;
    uniform mat4 u_ProjectionMatrix;
    uniform float u_Size;
    void main() {
        gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
        v_UV = a_UV;
    }`

// Fragment shader program
var FSHADER_SOURCE = `
    precision mediump float;
    varying vec2 v_UV;
    uniform vec4 u_FragColor;  // uniform変数
    uniform sampler2D u_Sampler0;
    uniform sampler2D u_Sampler1;
    uniform int u_whichTexture;
    void main() {
        if (u_whichTexture == -2) {
            gl_FragColor = u_FragColor;
        }
        else if (u_whichTexture == -1) {
            gl_FragColor = vec4(v_UV, 1.0, 1.0);
        }
        else if (u_whichTexture == 0) {
            gl_FragColor = texture2D(u_Sampler0, v_UV);
        }
        else if (u_whichTexture == 1) {
            gl_FragColor = texture2D(u_Sampler1, v_UV);
        }
        else {
            gl_FragColor = vec4(1,.2,.2,1);
        }
    }`

// Global Variables
let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_Sampler0;
let u_Sampler1;
let u_whichTexture;
let g_globalX = 0;
let g_globalY = 0;
let g_globalZ = 0;
let g_origin = [0, 0];

function setupWebGL() {
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });

    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    gl.enable(gl.DEPTH_TEST);
}

function connectVariablestoGLSL() {
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    // Get the storage location of a_Position
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    // Get the storage location of a_UV
    a_UV = gl.getAttribLocation(gl.program, 'a_UV');
    if (a_UV < 0) {
        console.log('Failed to get the storage location of a_UV');
        return;
    }

    // Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }

    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.log('Failed to get the storage location of u_ModelMatrix');
        return;
    }

    u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
    if (!u_GlobalRotateMatrix) {
        console.log('Failed to get the storage location of u_GlobalRotateMatrix');
        return;
    }

    u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    if (!u_ViewMatrix) {
        console.log('Failed to get the storage location of u_ViewMatrix');
        return;
    }

    u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
    if (!u_ProjectionMatrix) {
        console.log('Failed to get the storage location of u_ProjectionMatrix');
        return;
    }

    u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
    if (!u_Sampler0) {
        console.log('Failed to get the storage location of u_Sampler0');
        return;
    }

    u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
    if (!u_Sampler0) {
        console.log('Failed to get the storage location of u_Sampler1');
        return;
    }

    u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
    if (!u_whichTexture) {  
        console.log('Failed to get the storage location of u_whichTexture');
        return;
    }

    var identityM = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);

}

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;
let g_globalAngle = 25;
let g_headAngle = 0;
let g_leftAngle = -12;
let g_rightAngle = -12;
let g_leftFootAngle = 12;
let g_rightFootAngle = 12;
let g_magentaAngle = 0;
let g_headAnimation = false;
let g_magentaAnimation = false;

// Set up actions for the HTML UI elements
function addActionsforHTMLUI() {

    // Size slider
    document.getElementById('kickLeft').addEventListener('input', function () { g_leftAngle = this.value; renderAllShapes() });
    document.getElementById('kickLeftFoot').addEventListener('input', function () { g_leftFootAngle = this.value; renderAllShapes() });
    document.getElementById('kickRight').addEventListener('input', function () { g_rightAngle = this.value; renderAllShapes() });
    document.getElementById('kickRightFoot').addEventListener('input', function () { g_rightFootAngle = this.value; renderAllShapes() });
    document.getElementById('angleSlide').addEventListener('input', function() { g_globalY = this.value; renderAllShapes(); });
    
}

function initTextures() {
   
    var image = new Image();
    if (!image) {
        console.log('Failed to create the image object');
        return false;
    }
    image.onload = function(){ sendImagetoTexture0(image);}
    image.src = 'bookshelves.jpg';

    var image2 = new Image();
    if (!image2) {
        console.log('Failed to create the image object');
        return false;
    }
    image2.onload = function(){ sendImagetoTexture1(image2);}
    image2.src = 'strawberry.jpg';

    return true;
}

function sendImagetoTexture0(image) {
    var texture = gl.createTexture();
    if (!texture) {
        console.log('Failed to create the texture object');
        return false;
    }
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_Sampler0, 0);
    console.log('Finished loadTexture');
}

function sendImagetoTexture1(image) {
    var texture = gl.createTexture();
    if (!texture) {
        console.log('Failed to create the texture object');
        return false;
    }
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_Sampler1, 1);
    console.log('Finished loadTexture');
}

function main() {
    setupWebGL();
    
    connectVariablestoGLSL();

    addActionsforHTMLUI();

    document.onkeydown = keydown;

    initTextures();

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    
    requestAnimationFrame(tick);

}

var g_startTime = performance.now()/1000.0;
var g_seconds=performance.now()/1000.0-g_startTime;

function tick() {
    g_seconds=performance.now()/1000.0-g_startTime;
    updateAnimationAngles();
    
    renderAllShapes();
    requestAnimationFrame(tick);
}

var g_shapesList = [];

function origin(ev) {
    var x = ev.clientX;
    var y = ev.clientY;
    g_origin = [x, y];
}

function click(ev) {
    let coordinates = convertCoordinatesEventToGL(ev);
    g_globalX = g_globalX - coordinates[0]*360;
    g_globalY = g_globalY - coordinates[1]*360;

    renderAllShapes();
}

function originCoords(ev) {
    var x = ev.clientX;
    var y = ev.clientY;
    g_origin = [x, y];
}

function convertCoordinatesEventToGL(ev) {
    var x = ev.clientX;
    var y = ev.clientY;

    let temp = [x,y];
    x = (x - g_origin[0])/400;
    y = (y - g_origin[1])/400;
    g_origin = temp;

    return([x,y]);
}

function updateAnimationAngles() {
    // if (g_headAnimation) {
    //     g_headAngle = (45 * Math.sin(g_seconds));
    // }

    if (g_magentaAnimation) {
        g_magentaAngle = (45 * Math.sin(3 * g_seconds));
      }

}

var g_camera = new Camera();

function keydown(ev) {
    if (ev.keyCode == 65) {     // A
        g_camera.left();
    }
    else if (ev.keyCode == 68) {    // D
        g_camera.right();
    }
    else if (ev.keyCode == 83) {  // S
        g_camera.back();
    }
    else if (ev.keyCode == 87) {  // W
        g_camera.forward();
    }
    else if (ev.keyCode == 81) {    // Q
        g_camera.panLeft();
    }
    else if (ev.keyCode == 69) {    // E
        g_camera.panRight();
    }

    else if(ev.keyCode == 82) { // R
        g_camera.panUp();
    } 
    
    else if(ev.keyCode == 70) { // F
        g_camera.panDown();
    }

    renderAllShapes();
    console.log(ev.keyCode);
}

var g_map = [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
];
    

function drawMap() {
    for (x = 0; x < 16; x++) {
        for (y = 0; y < 16; y++) {
            if (x < 1 || x == 31 || y == 0 || y ==31) {
                var wall = new Cube();
                wall.color = [0.8, 1.0, 1.0, 1.0];
                wall.textureNum = -2;
                wall.matrix.translate(0, -0.75, 0);
                wall.matrix.scale(0.3, 0.3, 0.3);
                wall.matrix.translate(x-8, 0, y-8);
                wall.renderfast();
            }
        }
    }
}

function renderAllShapes() {
    var startTime = performance.now();

    var projMat = new Matrix4();
    projMat.setPerspective(30, 1*canvas.width/canvas.height, 1, 100);
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

    var viewMat = new Matrix4();
    viewMat.setLookAt(
        g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2],
        g_camera.at.elements[0],  g_camera.at.elements[1],  g_camera.at.elements[2],
        g_camera.up.elements[0],  g_camera.up.elements[1],  g_camera.up.elements[2]);
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

    var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0); 
    globalRotMat.rotate(g_globalX,1,0,0); // x-axis
    globalRotMat.rotate(g_globalY,0,1,0); // y-axis
    globalRotMat.rotate(g_globalZ,0,0,1);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Colors
    var BLACK = [0.230, 0.182, 0.182, 1.0];
    // var BROWN = [0.610, 0.603, 0.531, 1.0];
    var PINK = [0.830, 0.681, 0.681, 1.0];
    var WHITE = [1.0, 1.0, 1.0, 1.0];

    // Skybox 
    var sky = new Cube();
    sky.color = [1.0, 0.0, 0.0, 1.0];
    sky.textureNum = 0;
    sky.matrix.scale(50, 50, 50);
    sky.matrix.translate(-0.5, -0.5, -0.5);
    sky.render();

    // Floor
    var floor = new Cube();
    floor.color = [1.0, 0.0, 0.0, 1.0];
    floor.textureNum = 1;
    floor.matrix.translate(0, -0.75, 0.0);
    floor.matrix.scale(10, 0.01, 10);
    floor.matrix.translate(-0.5, 0.0, -0.5);
    floor.render();

    // Bunny head

    var head = new Cube();
    head.color = WHITE;
    head.matrix.scale(0.45, 0.4, 0.4);
    head.matrix.translate(0, 0.4, -2.125);
    head.matrix.translate(-0.5, -0.5, 0);
    head.render();

    // Eyes

    var leftEye = new Cube();
    leftEye.color = BLACK;
    leftEye.matrix.scale(0.075, 0.15, 0.1);
    leftEye.matrix.translate(-2, 1.3, -8.6);
    leftEye.render();

    var rightEye = new Cube();
    rightEye.color = BLACK;
    rightEye.matrix.scale(0.075, 0.15, 0.1);
    rightEye.matrix.translate(1, 1.3, -8.6);
    rightEye.render();
    
    // Ears
    var ear1 = new Cube();
    ear1.color = WHITE;
    ear1.matrix.scale(0.11, 0.6, 0.1);
    ear1.matrix.translate(-1.5, 0.25, -5.75);
    ear1.matrix.rotate(-20, 1, 45, 0);
    ear1.render();

    var ear2 = new Cube();
    ear2.color = WHITE;
    ear2.matrix.scale(0.11, 0.6, 0.1);
    ear2.matrix.translate(0.5, 0.25, -5.75);
    ear2.matrix.rotate(20, 1, 45, 0);
    ear2.render();

    var nose = new Cube();
    nose.color = PINK;
    nose.matrix.scale(0.1, 0.1, 0.1);
    nose.matrix.translate(-0.5, 0.9, -9);
    nose.render();

    
    // Body

    var body = new Cube();
    body.color = WHITE;
    body.matrix.rotate(12, 1, 0, 0);
    body.matrix.scale(0.5, 0.4, 0.8);
    body.matrix.translate(-0.5, -1, -0.8);
    body.render();

    // Legs
    var frontlegL = new Cube();
    frontlegL.color = WHITE;
    frontlegL.matrix.rotate(12, 1, 0, 0);
    frontlegL.matrix.scale(0.15, 0.5, 0.13);
    frontlegL.matrix.translate(-2, -1.5, -5); 
    frontlegL.render();

    var frontlegR = new Cube();
    frontlegR.color = WHITE;
    frontlegR.matrix.rotate(12, 1, 0, 0);
    frontlegR.matrix.scale(0.15, 0.5, 0.13);
    frontlegR.matrix.translate(1, -1.5, -5);
    frontlegR.render();

    // Back haunches
    var haunchL = new Cube();
    haunchL.color = WHITE;
    haunchL.matrix.rotate(12, 1, 0, 0);
    haunchL.matrix.rotate(g_leftAngle, 1, 0, 0);
    haunchL.matrix.rotate(0, 1, 0, 0);
    haunchL.matrix.translate(-0.3, -0.56, -0.15);
    var leftCoords = new Matrix4(haunchL.matrix);
    haunchL.matrix.scale(0.15, 0.4, 0.3);
    haunchL.render();

    var haunchR = new Cube();
    haunchR.color = WHITE;
    haunchR.matrix.rotate(12, 1, 0, 0);
    haunchR.matrix.rotate(g_rightAngle, 1, 0, 0);
    haunchR.matrix.translate(0.15, -0.56, -0.15);
    var rightCoords = new Matrix4(haunchR.matrix);
    haunchR.matrix.scale(0.15, 0.4, 0.3);
    haunchR.render();

    // Back legs

    var backlegL = new Cube();
    backlegL.color = WHITE;
    backlegL.matrix = leftCoords;
    backlegL.matrix.translate(0, 0, 0.3);
    backlegL.matrix.rotate(280 - g_leftFootAngle, 1, 0, 0);
    backlegL.matrix.translate(0, 0, -0.075 / 2);
    backlegL.matrix.scale(0.15, 0.5, 0.075);
    backlegL.render();

    var backlegR = new Cube();
    backlegR.color = WHITE;
    backlegR.matrix = rightCoords;
    backlegR.matrix.translate(0, 0, 0.3);
    backlegR.matrix.rotate(280 - g_rightFootAngle, 1, 0, 0);
    backlegR.matrix.translate(0, 0, -0.075 / 2);
    backlegR.matrix.scale(0.15, 0.5, 0.075);
    backlegR.render();

    var tail = new Cube();
    tail.color = WHITE;
    tail.matrix.scale(0.2, 0.2, 0.2);
    tail.matrix.translate(-0.5, -1.6, 0);
    tail.matrix.rotate(12, 1, 0, 0);
    tail.render();
    
    var duration = performance.now() - startTime;
	sendTextToHTML(" ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration)/10, "numdot");
}

function sendTextToHTML(text, htmlID) {   // we take the text and its htmlID
    var htmlElm = document.getElementById(htmlID);
    if (!htmlElm) {
      console.log("Failed to get " + htmlID + " from HTML");
      return;
    }
    htmlElm.innerHTML = text; // send inner html to whatver the text was
  }