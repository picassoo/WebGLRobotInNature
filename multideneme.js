var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Normal;\n' +
  'uniform mat4 u_MvpMatrix;\n' +
  'uniform mat4 u_NormalMatrix;\n' +
  'uniform vec3 u_Color;\n'+
  'uniform float u_aa;\n'+
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_Position = u_MvpMatrix * a_Position;\n' +
  '  vec3 lightDirection = normalize(vec3(-80, -140, 500));\n' + // Light direction
  '  vec3 normal = normalize((u_NormalMatrix * a_Normal).xyz);\n' +
  '  float nDotL = max(dot(normal, lightDirection), 0.0);\n' +
   '  v_Color = vec4(u_Color * nDotL + u_Color,u_aa);\n' +
  '}\n';
var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_FragColor = v_Color;\n' +
  '}\n';

  var Palette = [
    0.0, 0.0, 0.0, //black
    1.0, 0.0, 0.0, //red
    1.0, 1.0, 0.0, //yellow
    0.0, 1.0, 0.0, //green
    0.0, 0.0, 1.0, //blue
    1.0, 0.0, 1.0, //magneta
    0.0, 1.0, 1.0, //cyan
    1.0 ,1.0 ,1.0, //white
    0.35 , 0.16, 0.14 //brown
  ];

  var Direction = [
    0,1 , 0.25,0.96 , 0.5,0.86 , 0.7,0.7 , 0.86,0.5 , 0.96,0.25 , 1,0 ,
    0.96,-0.25 , 0.86,-0.5 ,  0.7,-0.7 ,  0.5,-0.86 ,  0.25,-0.96 ,  0,-1 ,
    -0.25,-0.96 , -0.5,-0.86 , -0.7,-0.7 , -0.86,-0.5 , -0.96,-0.25 , -1,0 ,
    -0.96,0.25 , -0.86,0.5 ,  -0.7,0.7 ,  -0.5,0.86 ,  -0.25,0.96
  ];
  var Angle = [
    360 , 15 , 30 , 45 , 60 , 75 , 90,
    105 , 120 , 135 , 150 , 165 , 180 ,
    195 , 210 , 225 , 240 , 255 , 270 ,
    285 , 300 , 315 , 330 , 345
  ];

function main() {
  var canvas = document.getElementById('webgl');
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }
  gl.clearColor(0.0, 0.0, 1.0, 0.5);
  gl.enable(gl.DEPTH_TEST);

  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  var u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
  if (a_Position < 0 || !u_MvpMatrix || !u_NormalMatrix) {
    console.log('Failed to get the storage location of attribute or uniform variable');
    return;
  }

  var viewProjMatrix = new Matrix4();
  viewProjMatrix.setPerspective(30.0, canvas.width / canvas.height, 1.0, 10000.0);
  viewProjMatrix.lookAt(5, 10.0, 80.0, 5.0, 10.0, 2.0, 0.0, 1.0, 0.0);

    var tick = function() {
          currentAngle = animate(currentAngle,100);
          draw(gl, n, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix);
          requestAnimationFrame(tick, canvas);
    }
    tick();
}
var xdirection=10;
var currentAngle=20;
var g_last = Date.now();                                  //get time when program works
function animate(angle,time) {                            //changed angel in per time
  var now = Date.now();                                   //get now time
  var elapsed = now - g_last;                             //calculate passing time
  g_last = now;                                           //update g_last
  var newAngle = angle + (ANGLE_STEP * elapsed) / time;
    xdirection=newAngle%=360;
  return newAngle %= 360;
}

var ANGLE_STEP = 3.0;     // The increments of rotation angle (degrees)
var angleRobot = 0 ;
//40 up , 38 down , 39 right , 37 left , 90 z , 88 x , 86 v , 67 c
var  w_key = W_key = S_key = s_key = a_key = d_key = shift_key = space_key = up_key = down_key = false;

function keypress(ev) {
  if(ev.keyCode==16){
    shift_key=true;
  }
}
function keydown(ev) {
  var temp = ev.keyCode;

  if(temp==16)  shift_key=true;
  if(temp==32){  //space_key
    if (!keepUp) {
      keepUp=true;
      space_key=true;
    }
  }
  if(temp == 87){  //w
    if (shift_key) {
        W_key = true;
    }else {
        w_key = true;
    }
  }
  else if(temp==83){//s
    if (shift_key) {
        S_key = true;
    }else {
        s_key = true;
    }
  }

  if (temp == 65 ) {
    a_key=true;
  }else if(temp == 68 ){
    d_key=true;
  }

  if (temp==38) {
    up_key=true;
  }else if(temp==40){
    down_key=true;
  }
}
function keyup(ev){
  var temp = ev.keyCode;
  if(temp == 16) shift_key=false;
  if(temp == 32) space_key=false;
  if(temp == 87){  //w
    w_key=false;
    W_key=false;
  }else if(temp==83){//s
    s_key=false;
    S_key=false;
  }
  if (temp == 65 || temp == 97 ) {
    a_key=false;
  }else if(temp == 68 || temp == 100){
    d_key=false;
  }
  if (temp==38) {
    up_key=false;
  }else if(temp==40){
    down_key=false;
  }
}
var g_baseBuffer = null;
var g_leg1Buffer = null;
var g_bodyBuffer = null;
var g_arm1Buffer = null;
var g_sunsBuffer = null;
var g_roadBuffer = null;

function CreateCube(x,y,z,x2,y2,z2){                                //create cube according to give coordinates
  var vertices = new Float32Array([
     x, y, z,   x2, y, z,  x2, y2, z, x, y2, z,                         // v0-v1-v2-v3 front
     x, y, z,   x, y2, z,  x, y2,z2,  x, y,z2,                          // v0-v3-v4-v5 right
     x, y, z,   x, y,z2,   x2, y,z2,  x2, y, z,                         // v0-v5-v6-v1 up
    x2, y, z,   x2, y,z2,  x2, y2,z2, x2, y2, z,                        // v1-v6-v7-v2 left
    x2, y2,z2,  x,y2,z2,   x, y2, z,  x2, y2, z,                        // v7-v4-v3-v2 down
     x, y2,z2,  x2,y2,z2,  x2, y,z2,  x, y,z2                           // v4-v7-v6-v5 back
  ]);
  return vertices;
}
function initVertexBuffers(gl){
  // Vertex coordinate (prepare coordinates of cuboids for all segments)
  var vertices_base = CreateCube(2000,0,5000,-2000,-1,-5000);

  var vertices_leg1 = CreateCube(2,12,2,0,0,0);

  var vertices_body = CreateCube(9,8,4,0,0,0);

  var vertices_arm1 = CreateCube(2,6,2,0,0,0);

  var vertices_suns = CreateCube(5,20,5,0,0,0);

  var vertices_road = CreateCube(1,1,1,0,0,0);
  // Normal
  var normals = new Float32Array([
     0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0, // v0-v1-v2-v3 front
     1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0, // v0-v3-v4-v5 right
     0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0, // v0-v5-v6-v1 up
    -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, // v1-v6-v7-v2 left
     0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0, // v7-v4-v3-v2 down
     0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0  // v4-v7-v6-v5 back
  ]);

  // Indices of the vertices
  var indices = new Uint8Array([
     0, 1, 2,   0, 2, 3,    // front
     4, 5, 6,   4, 6, 7,    // right
     8, 9,10,   8,10,11,    // up
    12,13,14,  12,14,15,    // left
    16,17,18,  16,18,19,    // down
    20,21,22,  20,22,23     // back
  ]);

  // Write coords to buffers, but don't assign to attribute variables
  g_baseBuffer = initArrayBufferForLaterUse(gl, vertices_base, 3, gl.FLOAT);
  g_leg1Buffer = initArrayBufferForLaterUse(gl, vertices_leg1, 3, gl.FLOAT);
  g_bodyBuffer = initArrayBufferForLaterUse(gl, vertices_body, 3, gl.FLOAT);
  g_arm1Buffer = initArrayBufferForLaterUse(gl, vertices_arm1, 3, gl.FLOAT);
  g_sunsBuffer = initArrayBufferForLaterUse(gl, vertices_suns, 3, gl.FLOAT);
  g_roadBuffer = initArrayBufferForLaterUse(gl, vertices_road, 3, gl.FLOAT);
  if (!g_baseBuffer || !g_arm1Buffer ||  !g_bodyBuffer || !g_leg1Buffer || !g_sunsBuffer) return -1;

  if (!initArrayBuffer(gl, 'a_Normal', normals, 3, gl.FLOAT)) return -1;
  var indexBuffer = gl.createBuffer();
  if (!indexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return indices.length;
}
function initArrayBufferForLaterUse(gl, data, num, type){
  var buffer = gl.createBuffer();   // Create a buffer object
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return null;
  }
  // Write date into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  // Store the necessary information to assign the object to the attribute variable later
  buffer.num = num;
  buffer.type = type;

  return buffer;
}

function initArrayBuffer(gl, attribute, data, num, type){
  var buffer = gl.createBuffer();   // Create a buffer object
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return false;
  }
  // Write date into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  // Assign the buffer object to the attribute variable
  var a_attribute = gl.getAttribLocation(gl.program, attribute);
  if (a_attribute < 0) {
    console.log('Failed to get the storage location of ' + attribute);
    return false;
  }
  gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
  // Enable the assignment of the buffer object to the attribute variable
  gl.enableVertexAttribArray(a_attribute);

  return true;
}

// Coordinate transformation matrix
var g_modelMatrix = new Matrix4(), g_mvpMatrix = new Matrix4();

var xside=0,yside=0,zside=1;
var legAngle=0;
var j =0,k=0;
var up=[0 , 0.25, 0.5 , 0.7, 0.86 , 0.96, 1];
var keepUp=false,down=false;
var angleLeg=0,angleArm=0,angleHead=0;

function jump(){
  var yy;
  if (keepUp && !down ) {
    if (k<6) {
      yy=up[k];
      k++;

    }else {
      down=true;
      k=1; yy=up[6];

    }
  }else if (keepUp && down) {
    if (k<=5) {
      yy=up[6-k];
      k++;

    }else {
      down=false;
      keepUp=false;
      k=0;
      yy=0;
    }
  }else {
    yy=0;
  }
  return yy;
}
function draw(gl, n, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix) {

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  //base
  g_modelMatrix.setTranslate(0.0,0.0, 0.0);
  drawSegment(gl, n, g_baseBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix,8,0.9);

  //draw sun
  g_modelMatrix.setTranslate(80,140, -500.0);
  g_modelMatrix.rotate(currentAngle,0,0,1);
  drawSegment(gl, n, g_sunsBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix,2,1);
  for (var i = 1; i < 24; i++) {
    g_modelMatrix.rotate(15,0,0,1);
    drawSegment(gl, n, g_sunsBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix,2,1);
  }
  //fences
  g_modelMatrix.setTranslate(-70,2,-200);
  g_modelMatrix.scale(150,6,1);
  drawSegment(gl, n, g_roadBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix,5,1);
  g_modelMatrix.translate(0,2,0);
  drawSegment(gl, n, g_roadBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix,5,1);
  g_modelMatrix.setTranslate(-50,0.0,-200);
  g_modelMatrix.scale(5,25,10);
  drawSegment(gl, n, g_roadBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix,5,1);
  g_modelMatrix.translate(5,0.0,0);
  drawSegment(gl, n, g_roadBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix,5,1);
  g_modelMatrix.translate(5,0.0,0);
  drawSegment(gl, n, g_roadBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix,5,1);
  g_modelMatrix.translate(5,0.0,0);
  drawSegment(gl, n, g_roadBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix,5,1);
  g_modelMatrix.translate(5,0.0,0);
  drawSegment(gl, n, g_roadBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix,5,1);

  //tree
  g_modelMatrix.setTranslate(5,0,-220);
  g_modelMatrix.scale(10,25,10);
  drawSegment(gl, n, g_roadBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix,8,1);
  g_modelMatrix.translate(-1,1,0);
  g_modelMatrix.scale(3,0.7,1);
  drawSegment(gl, n, g_roadBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix,3,1);

  g_modelMatrix.setTranslate(40,0,-220);
  g_modelMatrix.scale(10,25,10);
  drawSegment(gl, n, g_roadBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix,8,1);
  g_modelMatrix.translate(-1,1,0);
  g_modelMatrix.scale(3,0.8,1);
  drawSegment(gl, n, g_roadBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix,3,1);

  g_modelMatrix.setTranslate(-30,0,-220);
  g_modelMatrix.scale(10,25,10);
  drawSegment(gl, n, g_roadBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix,8,1);
  g_modelMatrix.translate(-1,1,0);
  g_modelMatrix.scale(3,0.8,1);
  drawSegment(gl, n, g_roadBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix,3,1);

  //wind turbines
  g_modelMatrix.setTranslate(0,50,-200);
  g_modelMatrix.rotate(currentAngle,0,0,1);
  g_modelMatrix.translate(-5.5,0,0);
  g_modelMatrix.scale(10,1,1);
  drawSegment(gl, n, g_roadBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix,4,1);
  g_modelMatrix.setTranslate(0,50,-200);
  g_modelMatrix.rotate(currentAngle+90,0,0,1);
  g_modelMatrix.translate(-4.5,0,0);
  g_modelMatrix.scale(10,1,1);
  drawSegment(gl, n, g_roadBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix,4,1);
  g_modelMatrix.setTranslate(-3.5,0,-220);
  g_modelMatrix.scale(5,55,10);
  drawSegment(gl, n, g_roadBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix,6,1);

  g_modelMatrix.setTranslate(-56,50,-200);
  g_modelMatrix.rotate(-currentAngle,0,0,1);
  g_modelMatrix.translate(-10.5,0,0);
  g_modelMatrix.scale(20,1,1);
  drawSegment(gl, n, g_roadBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix,4,1);
  g_modelMatrix.setTranslate(-56,50,-200);
  g_modelMatrix.rotate(-currentAngle+90,0,0,1);
  g_modelMatrix.translate(-10.5,0,0);
  g_modelMatrix.scale(20,1,1);
  drawSegment(gl, n, g_roadBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix,4,1);
  g_modelMatrix.setTranslate(-59.5,0,-220);
  g_modelMatrix.scale(5,55,10);
  drawSegment(gl, n, g_roadBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix,6,1);

  //clouds
  g_modelMatrix.setTranslate(-120+xdirection,58+(xdirection/20),-220);
  g_modelMatrix.scale(40,15,1);
  g_modelMatrix.rotate(45,1,1,0);
  drawSegment(gl, n, g_roadBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix,7,0.1);

  g_modelMatrix.setTranslate(-180+xdirection,64+(xdirection/20),-200);
  g_modelMatrix.scale(40,12,1);
  drawSegment(gl, n, g_roadBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix,7,0.5);

  g_modelMatrix.setTranslate(-270+xdirection,64,-200);
  g_modelMatrix.scale(40,10,1);
  drawSegment(gl, n, g_roadBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix,0,0.5);

  //Mount
  g_modelMatrix.setTranslate(-60,-70,-300);
  g_modelMatrix.scale(100,100,1);
  g_modelMatrix.rotate(45,0,1,1);
  drawSegment(gl, n, g_roadBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix,0,0.5);


  //Robot
  if (a_key) {
    if (j==0) {
        j=23;
    }else {
      j=j-1;
    }
  }else if(d_key){
    j=j+1;
    j=j%23;
  }

  if (w_key ){
    zside+=Direction[2*j+1];
    xside+=Direction[2*j];
    legAngle+=15;
    angleArm=30;
  }
  else if(W_key){
    zside+=Direction[2*j+1]*3;
    xside+=Direction[2*j]*3;
    legAngle+=45;
    angleArm=60;
  }
  else if(s_key){
    zside-=Direction[2*j+1];
    xside-=Direction[2*j];
    legAngle-=15;
    angleArm=-30;
  }
  else if(S_key){
    zside-=Direction[2*j+1]*3;
    xside-=Direction[2*j]*3;
    legAngle+=45;
    angleArm=-60;
  }else{
    angleArm=0;
  }
  if (keepUp) {
    angleArm*=(-4);
    if (angleArm==0) {
      angleArm=-120;
    }
  }
  yside = 6*jump();

  if (down_key) {
      if (angleHead<60) {
        angleHead+=10;
      }
  }else if(up_key) {
    if (angleHead>-60) {
      angleHead-=10;
    }
  }

  console.log("angle :: " + Angle[j] + " Direction "+Direction[j*2]+","+Direction[1+j*2] +" j :: "+j+" yside : "+yside+" k :: "+k +" angleHead :: "+angleHead);

  //robot low segment
  g_modelMatrix.setTranslate(0+xside,3+yside,0+zside);
  g_modelMatrix.rotate(Angle[j],0,1,0);
  drawSegment(gl, n, g_bodyBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix,4,1);

  g_modelMatrix.translate(-2,2,2);
  g_modelMatrix.rotate(legAngle,1,0,0);
  g_modelMatrix.translate(0,-6,-1);
  drawSegment(gl, n, g_leg1Buffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix,4,0.6);

  g_modelMatrix.translate(0,7,-5);
  g_modelMatrix.rotate(90,1,0,0);
  drawSegment(gl, n, g_leg1Buffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix,4,0.6);

  g_modelMatrix.translate(11,0,0);
  drawSegment(gl, n, g_leg1Buffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix,4,0.6);

  g_modelMatrix.rotate(90,1,0,0);
    g_modelMatrix.translate(0,-5,-7);
  drawSegment(gl, n, g_leg1Buffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix,4,0.6);


  //robot middle segment
  g_modelMatrix.setTranslate(0+xside,11+yside,0+zside);
  g_modelMatrix.scale(1,2,1);
  g_modelMatrix.rotate(Angle[j],0,1,0);
  drawSegment(gl, n, g_bodyBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix,2,1);


  g_modelMatrix.translate(-2,5,2);
  g_modelMatrix.rotate(angleArm,1,0,0);
  g_modelMatrix.translate(0,-5,-1);
  drawSegment(gl, n, g_arm1Buffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix,1,1);

  g_modelMatrix.translate(11,0,0);
  drawSegment(gl, n, g_arm1Buffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix,1,1);


    //robot high segment
  g_modelMatrix.setTranslate(0+xside,27+yside,0+zside);
  g_modelMatrix.scale(1,0.4,1);
  g_modelMatrix.rotate(Angle[j],0,1,0);
  drawSegment(gl, n, g_bodyBuffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix,3,0.5);

  g_modelMatrix.translate(3.5,0,4);
  drawSegment(gl, n, g_arm1Buffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix,1,1);

  g_modelMatrix.scale(2,2,1);
  g_modelMatrix.translate(1.5,0,1);
  g_modelMatrix.rotate(angleHead,1,0,0);
  g_modelMatrix.translate(-2,0,1);
  drawSegment(gl, n, g_arm1Buffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix,8,1);

  g_modelMatrix.scale(0.2,0.2,0.3);
  g_modelMatrix.translate(1,6,5);
  drawSegment(gl, n, g_arm1Buffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix,7,1);4

  g_modelMatrix.translate(6,0,0);
  drawSegment(gl, n, g_arm1Buffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix,7,1);

  g_modelMatrix.scale(1,2,1);
  g_modelMatrix.translate(0.6,8,-1);
  drawSegment(gl, n, g_arm1Buffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix,0,1);

  g_modelMatrix.translate(-7,0,0);
  drawSegment(gl, n, g_arm1Buffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix,0,1);
}

var g_normalMatrix = new Matrix4();  // Coordinate transformation matrix for nomals

// Draw segments
function drawSegment(gl, n, buffer, viewProjMatrix, a_Position, u_MvpMatrix, u_NormalMatrix,color,opak) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  // Assign the buffer object to the attribute variable
  gl.vertexAttribPointer(a_Position, buffer.num, buffer.type, false, 0, 0);
  // Enable the assignment of the buffer object to the attribute variable
  gl.enableVertexAttribArray(a_Position);

  // Calculate the model view project matrix and pass it to u_MvpMatrix
  g_mvpMatrix.set(viewProjMatrix);
  g_mvpMatrix.multiply(g_modelMatrix);
  gl.uniformMatrix4fv(u_MvpMatrix, false, g_mvpMatrix.elements);
  // Calculate matrix for normal and pass it to u_NormalMatrix
  g_normalMatrix.setInverseOf(g_modelMatrix);
  g_normalMatrix.transpose();
  gl.uniformMatrix4fv(u_NormalMatrix, false, g_normalMatrix.elements);
  // Draw
  var j=color*3;
  var opacity = gl.getUniformLocation(gl.program,'u_aa');
  gl.uniform1f(opacity,opak);
  var colorLocate = gl.getUniformLocation(gl.program,'u_Color');
  gl.uniform3f(colorLocate, Palette[j], Palette[j+1], Palette[j+2]);



  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}
