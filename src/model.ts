import THREE = require('three')
import * as Render from './render'
import * as R      from 'ramda'

const modelSize   = 0.1
const modelLength = 1.0
const modelSpeed  = 0.01

const totalFreq = 0.1
const lapCount  = 3.0
const r1Value   = 0.5
const r2Value   = 0.1
const thFreq    = 7.0 / lapCount
const phFreq    = 1.0

export interface IModel {
    readonly index: number
    readonly src  : THREE.Mesh
             pos  : THREE.Vector3 | undefined
             r1   : number
             r2   : number
             th   : number
             ph   : number
             d    : number
}

export const createModels = (count: number, state: Render.IState) => {
    const geometry = new THREE.BoxGeometry(modelSize, modelSize, modelSize)

    const toHue = (x: number) => R.clamp(0.0, 1.0, x / count)

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
    const setAttr = (model: THREE.Mesh) => {
        model.matrixAutoUpdate = false
    }

    const toIModel = (mesh: THREE.Mesh, index: number) => ({
        index,
        src: mesh,
        pos: undefined,
        r1 : r1Value,
        r2 : r2Value,
        th : 0.0,
        ph : 0.0,
        d  : index / (count * totalFreq) * Math.PI * 2.0 * lapCount * modelLength
    })

    const comp = R.pipe(
        R.map(toHue),
        R.map(toMaterial),
        R.map(toMesh),
        R.forEach(setAttr),
        R.addIndex(R.map)(toIModel),
        x => R.reverse<IModel>(x)
    )
                       
    state.models = comp(R.range(0, count))
}

export const updateModel = (state: Render.IState) => (model: IModel) => {
    const poss = state.interactions!.poss
    
    if (poss.length === 0) {
        return
    }

    if (model.index === 0) {
        if (model.pos !== undefined) {
            const diff = new THREE.Vector3(poss[0].x, -poss[0].y, 0.0).sub(model.pos!)
            model.pos  = new THREE.Vector3()
                         .addVectors(model.pos, diff.normalize().multiplyScalar(modelSpeed))
        }
        else
        {
            model.pos = new THREE.Vector3(poss[0].x, -poss[0].y, 0.0)
        }
    }
    else {
        const prevModel = state.models[state.models.length - model.index]
        model.pos = prevModel.pos
    }

    const t = state.total! / 1000.0 * Math.PI * 2.0 - model.d

    model.th = t * totalFreq * thFreq
    model.ph = t * totalFreq * phFreq
}

export const transformModel = (state: Render.IState) => (model: IModel) => {
    if (model.pos === undefined) {
        model.src.visible = false
        return
    }

    model.src.visible = true

    model.src.matrix.identity()

    const pos = new THREE.Matrix4().makeTranslation(model.pos.x, model.pos.y, model.pos.z)
    model.src.matrix.multiply(pos)

    const phRot = new THREE.Matrix4().makeRotationZ(-model.ph)
    model.src.matrix.multiply(phRot)

    const r1Pos = new THREE.Matrix4().makeTranslation(0.0, model.r1, 0.0)
    model.src.matrix.multiply(r1Pos)

    const thRot = new THREE.Matrix4().makeRotationX(-model.th)
    model.src.matrix.multiply(thRot)

    const r2Pos = new THREE.Matrix4().makeTranslation(0.0, model.r2, 0.0)
    model.src.matrix.multiply(r2Pos)
}
