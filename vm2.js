const { NodeVM } = require('vm2');
const { inspect } = require('util');


let logs = [];

function _log(type, args) {
  const now = new Date();
  logs.push(`${now.toISOString()} [${type}] ${args.map((x) => inspect(x)).join(' ')}`)
}

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

`

const sandbox = {
  x: "x",
  log: {
    info: (...args) => _log('INFO', args),
  }
}

const vm = new NodeVM({
  console: 'disabled',
  sandbox: sandbox,
  require: {
    external: false,
    root: "./",
  }
});
const result = vm.run(code, 'index.js');

console.log("**********");
console.log(logs.join("\n"));
console.log("**********");
console.log(sandbox);
console.log("**********");

