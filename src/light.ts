import THREE = require('three')
import * as Render from './render'
import * as R      from 'ramda'

const phFreq = 0.1

export interface ILight {
    readonly index: number
    readonly src  : THREE.Light
    readonly pos  : THREE.Vector3
             ph   : number
}

export const createLights = (count: number, state: Render.IState) => {
    const toHue = (x: number) => R.clamp(0.0, 1.0, x / count)
    const toHSL = (hue: number) => [hue, 0.5, 0.5]

    const pos = () => Math.random() * 10.0 - 5.0
    const setHSL = (hsl: number[]) => new THREE.Color().setHSL(hsl[0], hsl[1], hsl[2])

    const toLight = (hsl: number[]) => new THREE.PointLight(setHSL(hsl))
    const setAttr = (light: THREE.Light) => {
        light.matrixAutoUpdate = false
    }

    const toILight = (light: THREE.Light, index: number) => ({
        index,
        src: light,
        pos: new THREE.Vector3(pos(), pos(), pos()),
        ph : 0.0
    })

    const comp = R.pipe(
        R.map(toHue),
        R.map(toHSL),
        R.map(toLight),
        R.forEach(setAttr),
        R.addIndex(R.map)(toILight)
    )

    state.lights = comp(R.range(0, count))
}

export const updateLight = (state: Render.IState) => (light: ILight) => {
    light.ph = state.total! / 1000.0 * Math.PI * 2.0 * phFreq
}

export const transformLight = (state: Render.IState) => (light: ILight) => {
    light.src.matrix.identity()

    const euler = new THREE.Euler(0.0, light.ph, 0.0, 'YXZ')
    const rot = new THREE.Matrix4().makeRotationFromEuler(euler)
    light.src.matrix.multiply(rot)

    const pos = new THREE.Matrix4().makeTranslation(light.pos.x, light.pos.y, light.pos.z)
    light.src.matrix.multiply(pos)
}
