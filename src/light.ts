import THREE = require('three')
import * as Render from './render'
import * as _      from 'lodash'

const rotCycle = 10.0

export interface ILight {
    readonly index: number
    readonly src  : THREE.Light
    readonly pos  : THREE.Vector3
             ph   : number
}

export const createLights = (count: number, state: Render.IState) => {
    const toHue = (x: number) => _.clamp(x / count, 0.0, 1.0)
    const toHSL = (hue: number) => [hue, 0.5, 0.5]

    const pos = () => _.random(-5.0, 5.0, true)
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

    const lights = _(0).range(count)
                       .map(toHue)
                       .map(toHSL)
                       .map(toLight)
                       .forEach(setAttr)
    state.lights = _.map(lights, toILight)
}

export const updateLight = (state: Render.IState) => (light: ILight) => {
    light.ph = state.total! / (1000.0 * rotCycle) * Math.PI * 2.0
}

export const transformLight = (state: Render.IState) => (light: ILight) => {
    light.src.matrix.identity()

    const euler = new THREE.Euler(0.0, light.ph, 0.0, 'YXZ')
    const rot = new THREE.Matrix4().makeRotationFromEuler(euler)
    light.src.matrix.multiply(rot)

    const pos = new THREE.Matrix4().makeTranslation(light.pos.x, light.pos.y, light.pos.z)
    light.src.matrix.multiply(pos)
}
