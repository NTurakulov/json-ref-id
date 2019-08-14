import { Cycler } from './src/cycler';
import { Decycler } from './src/decycler';

/**
 * Restores all $ref -> $id references in object.
 * The original object will be modified as a side-effect.
 * @param object dereference target
 */
export function restoreCircularReferences(object: any): void {
    // each call will be executed in separate instance
    const instance = new Cycler();
    instance.restoreCircularReferences(object);
}

/**
 * Replaces circular referneces in object with $ids and $refs
 * The original object will be modified as a side-effect.
 * @param object object with circular referneces
 */
export function removeCircularReferences(object: any): void {
    const instance = new Decycler();
    instance.removeCircularReferences(object);
}