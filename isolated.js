const { inspect } = require('util');

const ivm = require('isolated-vm');

const isolate = new ivm.Isolate({ memoryLimit: 128 });
const context = isolate.createContextSync();
const jail = context.global;
jail.setSync('global', jail.derefInto());

// log function
let logs = []
const logCallback = function(...args) {
  const now = new Date();
  logs.push(`${now.toISOString()} [INFO] ${args.map((x) => inspect(x)).join(' ')}`)
};

context.evalClosureSync(`global.log = { info: function(...args) {
  $0.applySync(undefined, args, { arguments: { copy: true } });
}}`, [ logCallback ], { arguments: { reference: true } });

context.evalSync('var x = "x";');

const code = `
const message = "Hello, World!";
log.info(message);
log.info(x);
x = "y";
log.info(x);
try {
  y
} catch (e) {
  log.info(e);
}

const params = {
  a: "A",
  b: "B",
  c: {
    c1: "C1"
  }
}

log.info(params);
log.info(JSON.stringify(params));
JSON.stringify(params);
`

const result = context.evalSync(code);

console.log("**********");
console.log(result);
console.log("**********");
console.log(logs.join("\n"));
console.log("**********");
