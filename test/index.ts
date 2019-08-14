import { removeCircularReferences } from "../index";

let a: any = {};
let b = { orgs: [a] };
a.users = [b];


console.log("TCL: a", a);

removeCircularReferences([a]);

console.log("TCL: a", a);
