import '../sass/style'
import THREE = require('three')
import OrbitControls = require('three-orbitcontrols')

interface IThreeObjects {
    scene   : THREE.Scene
    camera  : THREE.Camera
    controls: THREE.OrbitControls
    renderer: THREE.Renderer
}

window.onload = () => {
    const width  = window.innerWidth  - 20
    const height = window.innerHeight - 20

    const threeObjects = init(width, height)
    window.requestAnimationFrame(animate(threeObjects))
}

const init = (width: number, height: number) => {
    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(60.0, width / height)
    camera.position.set(0.0, 0.0, 3.0)
    const controls = new OrbitControls(camera)

    const geometry = new THREE.BoxGeometry(1.0, 1.0, 1.0)
    const material = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(1.0, 1.0, 1.0),
        metalness: 0.5,
        roughness: 0.5,
        clearCoat: 0.5,
        clearCoatRoughness: 0.5,
        reflectivity: 1.0,
        fog: true
    })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const lights = [
        new THREE.PointLight(new THREE.Color().setHSL(0.6, 0.5, 0.8)),
        new THREE.PointLight(new THREE.Color().setHSL(0.2, 0.5, 0.8)),
        new THREE.PointLight(new THREE.Color().setHSL(0.1, 0.5, 0.8)),
        new THREE.PointLight(new THREE.Color().setHSL(0.4, 0.5, 0.8)),
        new THREE.PointLight(new THREE.Color().setHSL(0.8, 0.5, 0.8))
    ]
    const poss = [
        [ 2.0,  4.0,  2.0],
        [-2.0,  4.0, -2.0],
        [ 2.0,  0.0,  2.0],
        [-2.0,  0.0, -2.0],
        [ 1.0, -4.0,  1.0]
    ]
    lights.map((x, i) => x.position.set(poss[i][0], poss[i][1], poss[i][2]))
    lights.forEach(x => scene.add(x))

    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    })
    renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0), 1.0)
    renderer.setSize(width, height)
    document.getElementById('container')!.appendChild(renderer.domElement)

    return {
        scene,
        camera,
        controls,
        renderer
    }
}

let start : number | null = null
let before: number | null = null
const animate = (threeObjects: IThreeObjects) => (timestamp: number) => {
    if (!start) {
        start = timestamp
    }
    if (!before) {
        before = timestamp
    }
    const total   : number = timestamp - start
    const progress: number = timestamp - before
    before = timestamp

    render(threeObjects, total, progress)

    window.requestAnimationFrame(animate(threeObjects))
}

const render = (threeObjects: IThreeObjects, total: number, progress: number) => {
    threeObjects.controls.update()
    threeObjects.renderer.render(threeObjects.scene, threeObjects.camera)
}
