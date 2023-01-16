# demo-workspace

Make a workspace to write files easily ideal to write your tests

## How to use

Install with npm

```
npm add @jondotsoy/demo-workspace
```

In your code:

```ts
import { demoWorkspace } from "@jondotsoy/demo-workspace";

const workspace = demoWorkspace();

const file = workspace.file(
  "sample.ts",
  `
    console.log("OK");
  `
);

console.log(file);
// =>
// {
//   location: new URL('file:./__demos__/index/sample.ts')
// }
```

Also, your can be use `Workspace.property.makeTree()` for multiple files.

```ts
const file = workspace.makeTree({
  "README.md": `
    # Sample
  `,
  "src/index.ts": `
    console.log('Ok')
  `,
  "src/configs.json": JSON.stringify({
    foo: "baz",
  }),
});
// =>
// {
//   'README.md': new URL('file:./__demos__/index/README.md'),
//   'src/index.ts': new URL('file:./__demos__/index/src/index.ts'),
//   'src/configs.json': new URL('file:./__demos__/index/src/configs.json')
// }
```
