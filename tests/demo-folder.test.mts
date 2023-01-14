import { existsSync, readFileSync, statSync } from "fs";
import { describe, expect, it, vitest } from "vitest";
import { demoWorkspace, getCallingFile } from "../src/demo-workspace.mjs";

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
