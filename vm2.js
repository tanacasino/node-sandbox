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
`

const sandbox = {
  x: "x",
  log: {
    info: (...args) => _log('INFO', args),
  }
}

const vm = new NodeVM({
  console: 'disabled',
  console: 'inherit',
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

