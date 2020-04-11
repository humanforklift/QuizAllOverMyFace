import { observe, IValueDidChange, IObservableArray, IArrayChange, IArraySplice, IMapDidChange, IObjectDidChange } from "mobx"
import { deepObserve } from 'mobx-utils'

export type IDeepObserveChange = IObjectDidChange | IArrayChange | IArraySplice | IMapDidChange

/**
 * manages and disposes mobx observables observations
 */
export default class ObservationsManager {
    observations = [] as (()=> any)[]

    /**
     * dispose previous observes
     */
    disposePreviousObservations() {
        this.observations.forEach(observationDisposer => {
            observationDisposer()
        })
        this.observations = []
    }

    /**
     * 
     * @param object observable that will be observed
     * @param property property from the observable that will be observed
     * @param listener function that will be called when the property changes
     */
    setNewObservation<T, K extends keyof T>(object: T, property: K, listener: (change: IValueDidChange<T[K]>) => void) {
        this.observations.push(observe(object, property, listener))
    }

    setNewArrayObservation<T>(observableArray: IObservableArray<T>, listener: (change: IArrayChange<T> | IArraySplice<T>) => void) {
        this.observations.push(observe(observableArray, listener, false))
    }

    setNewDeepObserve(observable: any, listener: (change: IDeepObserveChange, path: string, root: any) => void) {
        this.observations.push(deepObserve(observable, listener))
    }
}