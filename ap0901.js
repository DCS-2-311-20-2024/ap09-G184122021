//
// 応用プログラミング 第9,10回 自由課題 (ap0901.js)
// G184122021　内田晴陽
//
"use strict"; // 厳格モード

const seg =12;
const gap = 0.01;

// ライブラリをモジュールとして読み込む
import * as THREE from "three";
import {GLTFLoader} from "three/addons";
import { OrbitControls } from 'three/addons';
import { GUI } from "ili-gui";

// ３Ｄページ作成関数の定義
function init() {
  // 制御変数の定義
  const param = {
    axes: true, // 座標軸
  };

  // GUIコントローラの設定
  const gui = new GUI();
  gui.add(param, "axes").name("座標軸");

  // シーン作成
  const scene = new THREE.Scene();

  // 座標軸の設定
  const axes = new THREE.AxesHelper(18);
  scene.add(axes);
  //WASDによるスピードの追加
  //const speed = 0.02;

  const keys = {
    forward: false,
    backward: false,
    left: false,
    right: false,
  };

  
  // カメラの作成
  const camera = new THREE.PerspectiveCamera(
    50, window.innerWidth/window.innerHeight, 0.1, 1000);
    

  // レンダラの設定
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x406080);
    document.getElementById("output").appendChild(renderer.domElement);
//カメラコントロール
 const orbitControls = new OrbitControls(camera,renderer.domElement);


 const textureLoader = new THREE.TextureLoader();
 const mapgazou = textureLoader.load("gazou2.jpeg");
 //mapgazou.repeat.x = -1;
 //mapgazou.offset.x = 1;
//平面の作成
const planeGeometry = new THREE.PlaneGeometry(200, 200);
  const planeMaterial = new THREE.MeshLambertMaterial();
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  planeMaterial.map=mapgazou;
  plane.rotation.x = -0.5 * Math.PI;
  plane.receiveShadow = true;
  scene.add(plane)

  let xwing; // モデルを格納する変数
  function loadModel() { // モデル読み込み関数の定義
    const loader = new GLTFLoader();
    loader.load(
      "xwing.glb",
      (gltf)=>{
        xwing = gltf.scene;
        scene.add(xwing);
        //render();
        //setBackground();
      }
    );
  }
  loadModel(); // モデル読み込み実行
// ビル
function makeBuilding(x,z,type){
  const height = [2,2,7,4,5];
  const bldgH = height[type]*5;
  const geometry = new THREE.BoxGeometry(8,bldgH,8);
  

  const material = new THREE.MeshLambertMaterial({color:0x808080});
  const sideUvS = (type*2+1)/11;
  const sideUvE = (type*2+2)/11;
  const topUvS = (type*2+2)/11;
  const topUvE = (type*2+3)/11;
  const uvs = geometry.getAttribute("uv");
  for(let i = 0;i<48;i+=4){
      if(i<16 || i > 22){
          uvs.array[i]=sideUvS;
          uvs.array[i+2]=sideUvE;
      }else{
          uvs.array[i]=topUvS;
          uvs.array[i+2]=topUvE;
      }
}
  const bldg = new THREE.Mesh(
      geometry,
      material
  )
//  const bldg2 = new THREE.Mesh(

 // )
  bldg.position.set(x,bldgH/2,z);
  scene.add(bldg)
}
//makeBuilding(20,0,2);
//makeBuilding(-20,0,2);
for(let i =-100;i<100;i=i+5){
      if(i!=25||i!=30){
      makeBuilding(i,100,0);
      }
      makeBuilding(i,-100,0);
      makeBuilding(100,i,0);
      makeBuilding(-100,i,0);
  }

//makeBuilding(0,20,0);
//コースの制御点が何たらかんたら
const controlPoints = [
[25,7,40],
  [25,7,-20],
  [5,7,40],
  [-20,7,-20],
  [-50,7,40],
  [-50,7,-20]
];
//コースの補完
const p0 = new THREE.Vector3();
  const p1 = new THREE.Vector3();
  const course = new THREE.CatmullRomCurve3(
    controlPoints.map((p,i) => {
      p0.set(...p);
      p1.set(...controlPoints[(i+1)%controlPoints.length]);
      return [
        (new THREE.Vector3()).copy(p0),
        (new THREE.Vector3()).lerpVectors(p0,p1,1/3),
        (new THREE.Vector3()).lerpVectors(p0,p1,2/3),
      ];
    }).flat(),true
  )
function makemetalRobot(){
// メタルロボットの設定


const metalRobot = new THREE.Group
const metalMaterial = new THREE.MeshPhongMaterial(
  {color: 0x707777, shininess: 60, specular: 0x222222 });
const redMaterial = new THREE.MeshBasicMaterial({color: 0xc00000});
const legRad = 0.5; // 脚の円柱の半径
const legLen = 3; // 脚の円柱の長さ
const legSep = 1.2; // 脚の間隔
const bodyW = 3; // 胴体の幅
const bodyH = 3; // 胴体の高さ
const bodyD = 2; // 胴体の奥行
const armRad = 0.4; // 腕の円柱の半径
const armLen = 3.8; // 腕の円柱の長さ
const headRad = 1.2; // 頭の半径
const eyeRad = 0.2; // 目の半径
const eyeSep = 0.8; // 目の間隔
//  脚の作成
const legGeometry
  = new THREE.CylinderGeometry(legRad, legRad, legLen, seg, seg);
const legR = new THREE.Mesh(legGeometry, metalMaterial);
legR.position.set(-legSep/2, legLen/2, 0);
metalRobot.add(legR);
const legL = new THREE.Mesh(legGeometry,metalMaterial);
legL.position.set(legSep/2,legLen/2,0);
metalRobot.add(legL);
//  胴体の作成
const bodyGeometry = new THREE.BoxGeometry(bodyW - bodyD, bodyH, bodyD);
const body = new THREE.Group;
body.add(new THREE.Mesh(bodyGeometry,metalMaterial));
const bodyL = new THREE.Mesh(
  new THREE.CylinderGeometry(
    bodyD/2, bodyD/2, bodyH, seg, 1, false, 0, Math.PI),
  metalMaterial);
bodyL.position.x = (bodyW - bodyD)/2;
body.add(bodyL);
const bodyR = new THREE.Mesh(
  new THREE.CylinderGeometry(
    bodyD/2, bodyD/2, bodyH, seg, 1, false, Math.PI,Math.PI),
  metalMaterial);
  bodyR.position.x = -(bodyW - bodyD)/2;
  body.add(bodyR);
const triangleGeometry = new THREE.BufferGeometry();
const triangleVertices = new Float32Array( [
0, 0, bodyD/2+gap,
(bodyW - bodyD)/2, bodyH/2, bodyD/2+gap,
-(bodyW - bodyD)/2, bodyH/2, bodyD/2+gap] );
triangleGeometry.setAttribute( 'position',
  new THREE.BufferAttribute( triangleVertices, 3));
body.add(new THREE.Mesh(triangleGeometry, redMaterial));
body.children.forEach((child) => {
  child.castShadow = true;
  child.receiveShadow = true;
});
  body.position.y = legLen + bodyH/2;
  metalRobot.add(body);

//  腕の作成
const armGeometry
= new THREE.CylinderGeometry(armRad, armRad, armLen, seg, 1);
const armL = new THREE.Mesh(armGeometry, metalMaterial);
armL.position.set(bodyW/2 + armRad, legLen + bodyH - armLen/2, 0);
metalRobot.add(armL);
const armR = new THREE.Mesh(armGeometry, metalMaterial);
armR.position.set(-bodyW/2 - armRad, legLen + bodyH + -armLen/2, 0);
metalRobot.add(armR);
//  頭の作成
const head = new THREE.Group;
head.name = "head";
const headGeometry = new THREE.SphereGeometry(headRad, seg, seg);
head.add(new THREE.Mesh(headGeometry, metalMaterial));
const circleGeometry = new THREE.CircleGeometry(eyeRad, seg);
const eyeL = new THREE.Mesh(circleGeometry, redMaterial);
eyeL.position.set(eyeSep/2+0.08, headRad/3, headRad-0.04);
head.add(eyeL);
const eyeR = new THREE.Mesh(circleGeometry, redMaterial);
eyeR.position.set(-eyeSep/2-0.08, headRad/3, headRad-0.04);
head.add(eyeR);
const eyeS = new THREE.Mesh(circleGeometry,redMaterial);
eyeS.name = "eyeS";
eyeS.position.set((eyeR.x+eyeL.x)/2,headRad/3,headRad-0.05);
head.add(eyeR);
head.children.forEach((child) => {
child.castShadow = true;
child.receiveShadow = true;
});
head.position.y = legLen + bodyH + headRad;
metalRobot.add(head);

// 影についての設定
metalRobot.children.forEach((child) => {
child.castShadow = true;
child.receiveShadow = true;
});
scene.add(metalRobot);

const headPosition = metalRobot.getObjectByName("head").position.clone();
camera.position.set(headPosition.x, headPosition.y, headPosition.z-0.1);
camera.lookAt(headPosition);

return metalRobot;
}

 //光源の設定
  
  const light = new THREE.DirectionalLight(0xffffff,2);
  light.position.set(3,6,8);
  light.castShadow = true;
  scene.add(light);
  
  window.addEventListener("resize", ()=>{
    mainCamera.updateProjectionMatrix();
    sizeR = 0.8 * window.innerWidth;
    mainRenderer.setSize(sizeR, sizeR);
    parts.forEach((part) => {
      part.module.resize();
    });
  }, false);
  const metalRobot = makemetalRobot();
  scene.add(metalRobot);
  //ロボットの作成終

document.addEventListener( 'keydown', (event)=> {
  switch ( event.key ) {
    case "w":
      keys.forward = true;
      break;
    case "a":
      keys.left = true;
      break;
    case "s":
      keys.backward = true;
      break;
    case "d":
      keys.right = true;
      break;
  }
}, false );

// キーアップイベント設定
document.addEventListener( 'keyup', (event)=> {
  switch ( event.key ) {
    case "w":
      keys.forward = false;
      break;
    case "a":
      keys.left = false;
      break;
    case "s":
      keys.backward = false;
      break;
    case "d":
      keys.right = false;
      break;
  }
}, false );

  // 描画処理
const clock = new THREE.Clock();
const xwingPosition = new THREE.Vector3();
const xwingTarget = new THREE.Vector3();
const metalRobotTarget = new THREE.Vector3();
  // 描画関数
  function render() {
    if(metalRobot){
      const speed = 0.25;
      const movement = new THREE.Vector3();
      if (keys.forward) movement.z += speed;
    if (keys.backward) movement.z -= speed;
    if (keys.left) movement.x += speed;
    if (keys.right) movement.x -= speed;
    if(keys.forward||keys.backward||keys.left||keys.right){
   metalRobotTarget.copy(metalRobot.position).add(movement);
    metalRobot.lookAt(metalRobotTarget);
    }
    metalRobot.position.add(movement);
  
    const cameraOffset = new THREE.Vector3(0,100,-20);
    const cameraPosition = metalRobot.position.clone().add(cameraOffset);
    camera.position.copy(cameraPosition);
    camera.lookAt(metalRobot.position);
  }
   /* const headPosition = new THREE.Vector3(
      metalRobot.position.x,
      metalRobot.position.y+5,
      metalRobot.position.z
    );
    camera.position.copy(headPosition);
    camera.rotation.copy(metalRobot.rotation); 
    
  }*/
    //xwingの位置と向き
    if(xwing){
    const elapsedTime = clock.getElapsedTime()/30;
    course.getPointAt(elapsedTime%1,xwingPosition);
    xwing.position.copy(xwingPosition);
    course.getPointAt((elapsedTime+0.01)%1,xwingTarget);
    xwing.lookAt(xwingTarget);
    }
    // カメラ制御の更新
    //orbitControls.update();
    /*camera.position.set(
      camera.position.x + 10,
      camera.position.y + 10,
      camera.position.z + 10
    );
    camera.lookAt(metalRobot.position);
  }*/
   
    
  
    // 座標軸の表示
    axes.visible = param.axes;
    // 描画
    renderer.render(scene, camera);
    // 次のフレームでの描画要請
    requestAnimationFrame(render);
  }

  // 描画開始
  render();
}

init();