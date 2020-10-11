import * as THREE from '/build/three.module.js';
import { PointerLockControls } from '/jsm/controls/PointerLockControls';
import { FBXLoader } from '/jsm/loaders/FBXLoader'
import { GUI } from '/jsm/libs/dat.gui.module'
import Stats from '/jsm/libs/stats.module';
const scene = new THREE.Scene();
var light = new THREE.AmbientLight();
scene.add(light);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const menuPanel = document.getElementById('menuPanel');
const startButton = document.getElementById('startButton');
startButton.addEventListener('click', function () {
    controls.lock();
}, false);
const controls = new PointerLockControls(camera, renderer.domElement);
//controls.addEventListener('change', () => console.log("Controls Change"))
controls.addEventListener('lock', () => menuPanel.style.display = 'none');
controls.addEventListener('unlock', () => menuPanel.style.display = 'block');


let mixer: THREE.AnimationMixer
let modelReady = false;
let animationActions: THREE.AnimationAction[] = new Array()
let activeAction: THREE.AnimationAction
let lastAction: THREE.AnimationAction
const fbxLoader: FBXLoader = new FBXLoader();



fbxLoader.load(
    'models/xbot.fbx',
    (object) => {
       
        object.position.z = -2  
        camera.add(object );
              
        object.scale.set(.01, .01, .01)
        mixer = new THREE.AnimationMixer(object);

        let animationAction = mixer.clipAction((object as any).animations[0]);
        animationActions.push(animationAction)
        animationsFolder.add(animations, "default")
        activeAction = animationActions[0]
        
        scene.add(object);

        //add an animation from another file
        fbxLoader.load('models/runForward.fbx',
            (object) => {
                console.log("loaded runForward");
                (object as any).animations[0].tracks.shift()

                let animationAction = mixer.clipAction((object as any).animations[0]);
                animationActions.push(animationAction)         
                animationsFolder.add(animations, "runForward")

                //add an animation from another file
                fbxLoader.load('models/jump.fbx',
                    (object) => {
                        console.log("loaded jump");
                        (object as any).animations[0].tracks.shift()
                        let animationAction = mixer.clipAction((object as any).animations[0]);
                        animationActions.push(animationAction)
                        animationsFolder.add(animations, "jump")

                        //add an animation from another file
                        fbxLoader.load('models/runBackward.fbx',
                            (object) => {
                                console.log("loaded runBackward");
                                (object as any).animations[0].tracks.shift() //delete the specific track that moves the object forward while running
                                //console.dir((object as any).animations[0])
                                let animationAction = mixer.clipAction((object as any).animations[0]);
                                animationActions.push(animationAction)
                                animationsFolder.add(animations, "runBackward")

                                modelReady = true
                            },
                            (xhr) => {
                                console.log((xhr.loaded / xhr.total * 100) + '% loaded')
                            },
                            (error) => {
                                console.log(error);
                            }
                        )
                    },
                    (xhr) => {
                        console.log((xhr.loaded / xhr.total * 100) + '% loaded')
                    },
                    (error) => {
                        console.log(error);
                    }
                )
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded')
            },
            (error) => {
                console.log(error);
            }
        )
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded')
    },
    (error) => {
        console.log(error);
    }
)




var animations = {
    default: function () {
        setAction(animationActions[0])
    },
    runForward: function () {
        setAction(animationActions[1])
    },
    jump: function () {
        setAction(animationActions[2])
    },
    runBackward: function () {
        setAction(animationActions[3])
    },
}

const setAction = (toAction: THREE.AnimationAction) => {
    if (toAction != activeAction) {
        lastAction = activeAction
        activeAction = toAction
        //lastAction.stop()
        lastAction.fadeOut(1)
        activeAction.reset()
        activeAction.fadeIn(1)
        activeAction.play()
    }
}


const gui = new GUI()
const animationsFolder = gui.addFolder("Animations")
animationsFolder.open()

const clock: THREE.Clock = new THREE.Clock()

const planeGeometry = new THREE.PlaneGeometry(100, 100, 50, 50);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
const plane = new THREE.Mesh(planeGeometry, material);
plane.rotateX(-Math.PI / 2);
scene.add(plane);
let cubes = new Array();
for (let i = 0; i < 100; i++) {
    const geo = new THREE.BoxGeometry(Math.random() * 4, Math.random() * 16, Math.random() * 4);
    const mat = new THREE.MeshBasicMaterial({ wireframe: true });
    switch (i % 3) {
        case 0:
            mat.color = new THREE.Color(0xff0000);
            break;
        case 1:
            mat.color = new THREE.Color(0xffff00);
            break;
        case 2:
            mat.color = new THREE.Color(0x0000ff);
            break;
    }
    const cube = new THREE.Mesh(geo, mat);
    cubes.push(cube);
}
cubes.forEach((c) => {
    c.position.x = (Math.random() * 100) - 50;
    c.position.z = (Math.random() * 100) - 50;
    c.geometry.computeBoundingBox();
    c.position.y = (c.geometry.boundingBox.max.y - c.geometry.boundingBox.min.y) / 2;
    scene.add(c);
});
camera.position.y = 1;
camera.position.z = 2;
var mesh = new THREE.Mesh( new THREE.SphereGeometry( 5, 16, 8 ), new THREE.MeshNormalMaterial() );
mesh.position.z = -10; // some negative number
// scene.add( camera ); // для меню
// camera.add( mesh );


let acts = [] 
const characterSpeed = 0.15

const onKeyDown = function (event) {



    switch (event.keyCode) {
        case 87: // w
            //controls.moveForward(.25);
            if(!acts.some(act => act.actionId === 1)){
                console.log("Добавляю экшн вперед")
                acts.push({actionId:1, action: controls.moveForward, value: characterSpeed})
               
            }

           
            
            break;
        case 65: // a
            //controls.moveRight(-.25);
            if(!acts.some(act => act.actionId === 2)){
                console.log("Добавляю экшн влево")
            acts.push({actionId:2, action: controls.moveRight, value: -1 * characterSpeed})
            }
            break;
        case 83: // s
            //controls.moveForward(-.25);
            if(!acts.some(act => act.actionId === 3)){
                console.log("Добавляю экшн назад")
            acts.push({actionId:3, action: controls.moveForward, value: -1 * characterSpeed})
            }
            break;
        case 68: // d
            //controls.moveRight(.25);  
            if(!acts.some(act => act.actionId === 4)){  
                console.log("Добавляю экшн вправо")  
            acts.push({actionId:4, action: controls.moveRight, value: characterSpeed})
            }
            break;
    }
};

const onKeyUp = function (event) {



    switch (event.keyCode) {
        case 87: // w
            //controls.moveForward(.25);
            if(acts.some(act => act.actionId === 1)){
                console.log("Удаляю экшн вперед")
                acts = acts.filter( act => act.actionId !==1 )
            }            
            break;
        case 65: // a
            //controls.moveRight(-.25);
            if(acts.some(act => act.actionId === 2)){
                console.log("Удаляю экшн влево")
                acts = acts.filter( act => act.actionId !==2 )
            }
            break;
        case 83: // s
            //controls.moveForward(-.25);
            if(acts.some(act => act.actionId === 3)){
                console.log("Удаляю экшн назад")
                acts = acts.filter( act => act.actionId !==3 )
            }
            break;
        case 68: // d
            //controls.moveRight(.25);  
            if(acts.some(act => act.actionId === 4)){  
                console.log("Удаляю экшн вправо")  
                acts = acts.filter( act => act.actionId !==4 )
            }
            break;
    }
};

const onWheel = (event) => {
    if( event.deltaY === -100){
        if(camera.position.y >= 1){
            camera.position.y = camera.position.y-0.1
        }        
    }else if(event.deltaY === 100){
        if(camera.position.y <= 3){
            camera.position.y = camera.position.y+0.1
        }        
    }
}
const backGroundTexture = new THREE.CubeTextureLoader().load(["img/px_eso0932a.jpg", "img/nx_eso0932a.jpg", "img/py_eso0932a.jpg", "img/ny_eso0932a.jpg", "img/pz_eso0932a.jpg", "img/nz_eso0932a.jpg"]);
scene.background = backGroundTexture;
document.addEventListener('keydown', onKeyDown, false);
document.addEventListener('keyup', onKeyUp, false);
document.addEventListener('wheel', onWheel, false);
window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}
const stats = Stats();
document.body.appendChild(stats.dom);
var animate = function () {
    requestAnimationFrame(animate);

    if (modelReady) mixer.update(clock.getDelta());
    

    acts.forEach( act => act.action(act.value) )
    
    render();
    stats.update();
};
function render() {
    renderer.render(scene, camera);
}
animate();
