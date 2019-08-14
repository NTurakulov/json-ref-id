import isObject from 'lodash.isobject';
import isDate from 'lodash.isdate';
import isArray from 'lodash.isarray';
import has from 'lodash.has';
import forOwn from 'lodash.forown';
import * as Constants from './constants';

export class Decycler {

    private cache: any[] = [];

    public removeCircularReferences(object: any) {
        if (isArray(object)) {
            object.forEach(element => this.processObject(element));
        }
        else {
            this.processObject(object);
        }
    }

    private processObject(object: any) {
        if (isDate(object)) {
            return;
        }

        if (!isObject(object)) {
            return;
        }

        if (has(object, Constants.$id)) {
            return;
        }

        this.cache.push(object);
        (<any>object)[Constants.$id] = this.cache.length;

        forOwn(object, (value: any, key: string, source: any) => {
            if (value == null) { // null or undefined
                return;
            }

            if (value.$id) {
                source[key] = { $ref: value.$id };
            } else {
                this.removeCircularReferences(value);
            }
        });
    }
}