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

        this.set$id(object);

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

    private set$id(object: any) {
        if (!has(object, Constants.$id)) {
            this.cache.push(object);
            object.$id = this.cache.length;
        }
    }
}