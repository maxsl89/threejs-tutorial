// Свет, который излучается из одной точки во всех направлениях

import * as THREE from '/build/three.module.js'
import { OrbitControls } from '/jsm/controls/OrbitControls'
import Stats from '/jsm/libs/stats.module'
import { GUI } from '/jsm/libs/dat.gui.module'

const scene: THREE.Scene = new THREE.Scene()
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

var light = new THREE.PointLight();
scene.add(light);

var helper = new THREE.PointLightHelper(light);
scene.add(helper);


const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)

document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

// const planeGeometry: THREE.PlaneGeometry = new THREE.PlaneGeometry(100, 20)
// const plane: THREE.Mesh = new THREE.Mesh(planeGeometry, new THREE.MeshPhongMaterial())
// plane.rotateX(-Math.PI / 2)
// //plane.position.y = -1.75
// scene.add(plane)

const torusGeometry: THREE.TorusGeometry[] = [
    new THREE.TorusGeometry(),
    new THREE.TorusGeometry(),
    new THREE.TorusGeometry(),
    new THREE.TorusGeometry(),
    new THREE.TorusGeometry()
]

const material: (THREE.MeshBasicMaterial | THREE.MeshLambertMaterial | THREE.MeshPhongMaterial | THREE.MeshPhysicalMaterial | THREE.MeshToonMaterial)[] = [
    new THREE.MeshBasicMaterial(),
    new THREE.MeshLambertMaterial(),
    new THREE.MeshPhongMaterial(),
    new THREE.MeshPhysicalMaterial({}),
    new THREE.MeshToonMaterial(),
]

const torus: THREE.Mesh[] = [
    new THREE.Mesh(torusGeometry[0], material[0]),
    new THREE.Mesh(torusGeometry[1], material[1]),
    new THREE.Mesh(torusGeometry[2], material[2]),
    new THREE.Mesh(torusGeometry[3], material[3]),
    new THREE.Mesh(torusGeometry[4], material[4])
]

const texture = new THREE.TextureLoader().load("img/grid.png")
material[0].map = texture
material[1].map = texture
material[2].map = texture
material[3].map = texture
material[4].map = texture

torus[0].position.x = -8
torus[1].position.x = -4
torus[2].position.x = 0
torus[3].position.x = 4
torus[4].position.x = 8

scene.add(torus[0])
scene.add(torus[1])
scene.add(torus[2])
scene.add(torus[3])
scene.add(torus[4])

camera.position.z = 7

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

const stats = Stats()
document.body.appendChild(stats.dom)

var data = {
    color: light.color.getHex(),
    mapsEnabled: true
};
const gui = new GUI()
const lightFolder = gui.addFolder('THREE.Light')
lightFolder.addColor(data, 'color').onChange(() => { light.color.setHex(Number(data.color.toString().replace('#', '0x'))) });
lightFolder.add(light, 'intensity', 0, 1, 0.01);
lightFolder.open()

const pointLightFolder = gui.addFolder('THREE.PointLight')
//hemisphereLightFolder.addColor(data, 'groundColor').onChange(() => { light.groundColor.setHex(Number(data.groundColor.toString().replace('#', '0x'))) });
pointLightFolder.add(light, "distance", 0, 100, 0.01)
pointLightFolder.add(light, "decay", 0, 4, 0.1)

pointLightFolder.add(light.position, "x", -50, 50, 0.01)
pointLightFolder.add(light.position, "y", -50, 50, 0.01)
pointLightFolder.add(light.position, "z", -50, 50, 0.01)
pointLightFolder.open()

const meshesFolder = gui.addFolder('Meshes')
meshesFolder.add(data, 'mapsEnabled').onChange(() => {
    material.forEach(m => {
        if (data.mapsEnabled) {
            m.map = texture
        } else {
            m.map = null;
        }
        m.needsUpdate = true;
    })
});

var animate = function () {
    requestAnimationFrame(animate)

    helper.update()    

    torus.forEach(t => {
        t.rotation.y += .01
    })

    render()

    stats.update()
};

function render() {
    renderer.render(scene, camera)
}
animate();