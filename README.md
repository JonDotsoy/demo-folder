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

console.log(file)
// =>
// {
//   location: new URL('file:./__demos__/index/sample.ts')
// }
```
