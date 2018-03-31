import THREE = require('three')
import * as Render from './render'
import * as _      from 'lodash'

const thFreq = 3.5

export interface IModel {
    readonly index: number
    readonly src  : THREE.Mesh
    readonly pos  : THREE.Vector3
             r    : number
             th   : number
             ph   : number
             d    : number
}

export const createModels = (count: number, state: Render.IState) => {
    const geometry = new THREE.BoxGeometry(1.0, 1.0, 1.0)

    const toHue = (x: number) => _.clamp(x / count, 0.0, 1.0)

    const toMaterial = (hue: number) => new THREE.MeshPhysicalMaterial({
        color: new THREE.Color().setHSL(hue, 1.0, 0.8),
        metalness: 0.5,
        roughness: 0.5,
        clearCoat: 0.5,
        clearCoatRoughness: 0.5,
        reflectivity: 1.0,
        fog: true
    })

    const toMesh  = (material: THREE.Material) => new THREE.Mesh(geometry, material)
    const toIModel = (mesh: THREE.Mesh, index: number) => ({
        index,
        src: mesh,
        pos: new THREE.Vector3(undefined, undefined, undefined),
        r  : 1.0,
        th : 0.0,
        ph : 0.0,
        d  : 0.0
    })

    const models = _(0).range(count)
                       .map(toHue)
                       .map(toMaterial)
                       .map(toMesh)
                       .map(toIModel)
                       .value()
    state.models = models
}

export const updateModel = (state: Render.IState) => (model: IModel) => {
    
}

export const transformModel = (state: Render.IState) => (model: IModel) => {
    
}
