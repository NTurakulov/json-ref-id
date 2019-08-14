import forOwn from "lodash.forown";
import isObject from "lodash.isobject";
import includes from "lodash.includes";
import * as Constants from './constants';

/**
 * Simple interface of JS object with key-value pairs
 */
interface IDerefObject {
    [key: string]: any;
}

/**
 * Describes exact instance of derefencer
 */
export class Cycler {

    /**
     * id-target reference map
     */
    private map: any = {};

    /**
     * processing objects stack
     */
    private stack: IDerefObject[] = [];

    /**
     * Restores $ref->$id referneces in object
     * @param object object with references to restore
     */
    restoreCircularReferences(object: IDerefObject): void {
        // if null or undefined - nothing to resotre
        if (!object)
            return;

        // if array - process first
        if (Array.isArray(object)) {
            object.forEach((item, index, array) => {
                // if null or undefined - nothing to resotre
                if (!item)
                    return;

                // MAIN: Replace reference in array with actual value from map
                let child = this.replaceRef(item, array, index);

                // recusively derefrence child(ren)
                if (child) {
                    this.restoreCircularReferences(child);
                }
            });
            return;
        }

        // if not an object (simple literals)
        if (!isObject(object)) {
            return;
        }

        object = (<IDerefObject>object);

        if (includes(this.stack, object)) {
            return;
        }

        // add processing element to stack
        this.stack.push(object);

        // NOTE: explicitly cast to IDerefObject after isObject check to avoid type error
        let id = object[Constants.$id];
        if (id) // if object has own id - add it to the map
        {
            this.map[id] = object;
            delete object.$id;
        }

        // process children
        forOwn(object, (value, key) => {
            // if null or undefined
            if (!value)
                return;

            // MAIN: Replace reference with actual value from map
            let child = this.replaceRef(value, object, key);

            // recusively derefrence child(ren)
            if (child) {
                this.restoreCircularReferences(child);
            }
        });

        // Remove processed element from stack
        this.stack.pop();
    }

    /**
     * Replaces reference object with actual value
     * @param value Object that contains $ref and should be replaced
     * @param element Object/Array that contains @value that should be replaced
     * @param key key or index of value in element
     */
    private replaceRef(value: any, element: any, key: string | number): any {
        let targetId = value[Constants.$ref];
        if (targetId) {
            let target = this.map[targetId];
            element[key] = target;
            return null;
        }
        return value;
    }
}