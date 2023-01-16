import { existsSync, readFileSync, statSync } from "fs";
import { expect, it } from "vitest";
import { demoWorkspace } from "../src/demo-workspace.mjs";

it("should create a directory", (ctx) => {
  const workspace = demoWorkspace({ workspaceName: ctx.meta.name });

  expect(workspace.cwd).toBeInstanceOf(URL);

  expect(existsSync(workspace.cwd)).toBeTruthy();
  expect(statSync(workspace.cwd).isDirectory()).toBeTruthy();
});

it("should create a directory and check the .gitignore file exits", (ctx) => {
  const workspace = demoWorkspace({ workspaceName: ctx.meta.name });

  expect(workspace.location).toBeInstanceOf(URL);
  expect(workspace.cwd).toBeInstanceOf(URL);

  const gitignoreLocation = new URL(".gitignore", workspace.cwd);

  expect(existsSync(gitignoreLocation)).toBeTruthy();
  expect(statSync(gitignoreLocation).isFile()).toBeTruthy();
  expect(
    readFileSync(gitignoreLocation).toString("utf-8")
  ).toMatchInlineSnapshot('"*"');
});

it("should create a file", (ctx) => {
  const workspace = demoWorkspace({ workspaceName: ctx.meta.name });
  const holaFile = workspace.file("hola");

  expect(holaFile.location).toBeInstanceOf(URL);
  expect(existsSync(holaFile.location)).toBeTruthy();
  expect(statSync(holaFile.location).isFile()).toBeTruthy();
});

it("should create a JSON file", (ctx) => {
  const workspace = demoWorkspace({ workspaceName: ctx.meta.name });
  const holaFile = workspace.file("hola", { contentType: "json", body: {} });

  expect(holaFile.location).toBeInstanceOf(URL);
  expect(existsSync(holaFile.location)).toBeTruthy();
  expect(statSync(holaFile.location).isFile()).toBeTruthy();
  expect(readFileSync(holaFile.location, "utf-8")).toMatchInlineSnapshot(
    '"{}"'
  );
});


it('should use syntax to make tree directory', (ctx) => {
  const workspace = demoWorkspace({ workspaceName: ctx.meta.name });

  const tree = workspace.makeTree({
    'README.md': `
      # Sample
    `,
    'src/index.ts': `
      console.log('Ok')
    `,
    'src/configs.json': JSON.stringify({
      foo: 'baz',
    }),
  })

  expect(tree).toBeTypeOf('object')
  expect(tree).not.toBeNull()
  const keysFiles = ['README.md', 'src/index.ts', 'src/configs.json'] as const;
  expect(tree).keys(keysFiles)
  for (const key of keysFiles) {
    expect(tree[key]).instanceOf(URL)
    expect(existsSync(tree[key])).toBeTruthy()
    expect(statSync(tree[key]).isFile()).toBeTruthy()
  }
})
