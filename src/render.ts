import THREE = require('three')
import * as Model    from './model'
import * as Light    from './light'
import * as Interact from './interact'
import * as _        from 'lodash'

const modelCount = 50
const lightCount = 10

export interface IThreeObjects {
    readonly scene    : THREE.Scene
    readonly camera   : THREE.Camera
    readonly renderer : THREE.Renderer
}

export interface IState {
    interactions: Interact.IInteractions | undefined
    models  : Model.IModel[]
    lights  : Light.ILight[]
    start   : number | undefined
    before  : number | undefined
    total   : number | undefined
    progress: number | undefined
}

export const initRender = (width: number, height: number) => {
    const state = {
        interactions: <Interact.IInteractions | undefined>undefined,
        models  : <Model.IModel[]>[],
        lights  : <Light.ILight[]>[],
        start   : <number | undefined>undefined,
        before  : <number | undefined>undefined,
        total   : <number | undefined>undefined,
        progress: <number | undefined>undefined
    }

    const scene = new THREE.Scene()

    Model.createModels(modelCount, state)
    scene.add(..._.map(state.models, x => x.src))

    Light.createLights(lightCount, state)
    scene.add(..._.map(state.lights, x => x.src))

    const camera = new THREE.PerspectiveCamera(60.0, width / height)
    camera.position.set(-2.0, 1.0, 3.0)
    camera.lookAt(0.0, 0.0, 0.0)

    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    })
    renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0), 1.0)
    renderer.setSize(width, height)

    const threeObjects = {
        scene,
        camera,
        renderer
    }

    const intr = Interact.initInteract(threeObjects, width, height)
    intr.subscribe(i => state.interactions = i)

    window.requestAnimationFrame(animate(threeObjects, state))
}

const animate = (threeObjects: IThreeObjects, state: IState) => (timestamp: number) => {
    if (!state.start) {
        state.start = timestamp
    }
    if (!state.before) {
        state.before = timestamp
    }
    state.total    = timestamp - state.start
    state.progress = timestamp - state.before
    state.before = timestamp

    render(threeObjects, state)

    window.requestAnimationFrame(animate(threeObjects, state))
}

const render = (threeObjects: IThreeObjects, state: IState) => {
    _(state.models).forEach(Model.updateModel(state))
    _(state.lights).forEach(Light.updateLight(state))

    _(state.models).forEach(Model.transformModel(state))
    _(state.lights).forEach(Light.transformLight(state))

    threeObjects.renderer.render(threeObjects.scene, threeObjects.camera)
}
