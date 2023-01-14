import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

export type ContentType = "text" | "json";

interface CallSite {
  getFileName(): string;
}

const isStackCallSite = (err: any): err is { stack: CallSite[] } =>
  Array.isArray(err.stack);
const atStackCallSite = (err: Error): CallSite[] | null => {
  if (isStackCallSite(err)) {
    return err.stack;
  }
  return null;
};

export const getCallingFile = () => {
  const originalPrepareStackTrace = Error.prepareStackTrace;
  try {
    const err = new Error();
    Error.prepareStackTrace = (_err, stack) => stack;

    const callingFile = atStackCallSite(err)?.at(2)?.getFileName();

    if (!callingFile) throw new Error("Undetermined calling location");

    return new URL(callingFile, "file://");
  } catch (ex) {
    throw ex;
  } finally {
    Error.prepareStackTrace = originalPrepareStackTrace;
  }
};

interface DemoFolderOptions {
  applyGitIgnore?: boolean;
  workspaceName?: string;
}

const serialize = (str: string) =>
  Array.from(new Uint16Array(new TextEncoder().encode(str)))
    .map((code) => `[0x${code.toString(16)}]`)
    .join("");

export const demoWorkspace = (options?: DemoFolderOptions) => {
  const filepath = getCallingFile();
  const applyGitIgnore = options?.applyGitIgnore ?? true;
  const workspaceName =
    options?.workspaceName?.replace(/\W/g, (_, char) => serialize(char)) ?? ".";

  if (!filepath) throw new Error("Undetected filepath of test");

  const cwd = new URL(
    `./__demos__/${path.basename(
      filepath.pathname,
      path.extname(filepath.pathname)
    )}/${workspaceName}/`,
    new URL(filepath, "file://")
  );

  const file = makeDemoFile(cwd);

  mkdirSync(cwd, { recursive: true });

  if (applyGitIgnore) {
    file(".gitignore", "*");
  }

  return { location: cwd, cwd, file };
};

interface DemoFileOptions {
  contentType: ContentType;
  body: any;
  insertFinalNewline?: boolean;
}

const toDemoFileOptions = (
  options?: string | DemoFileOptions
): DemoFileOptions => {
  if (typeof options === "string")
    return { body: options, contentType: "text" };
  return options ?? { contentType: "text", body: "" };
};

const makeDemoFile =
  (cwd: URL) => (relativePath: string, options?: string | DemoFileOptions) => {
    const opts = toDemoFileOptions(options);
    const contentType = opts.contentType ?? "text";
    const payload = opts?.body ?? "";
    const insertFinalNewline = opts?.insertFinalNewline ?? true;
    const url = new URL(relativePath, cwd);

    const cleanIndent = (str: string) => {
      if (str.startsWith("\n")) {
        const [, indent] = /^\n(\s+)/.exec(str)!;
        return str
          .slice(1)
          .split("\n")
          .map((line, index, lines): string | null => {
            if (index === lines.length - 1 && /^\s+$/.test(line))
              return insertFinalNewline ? "" : null;
            if (!line.startsWith(indent))
              throw new Error(
                `Failed cleaning indent. Line ${
                  index + 1
                } expected an indent of ${indent.length} length`
              );
            return line.slice(indent.length);
          })
          .filter((e) => e !== null)
          .join("\n");
      }

      return str;
    };

    const stringify = (contentType: ContentType, payload: any): string => {
      switch (contentType) {
        case "json":
          return JSON.stringify(payload, null, 2);
        case "text":
          return cleanIndent(payload);
      }
    };

    const initialBuffer: Uint8Array = new TextEncoder().encode(
      stringify(contentType, payload)
    );

    mkdirSync(new URL(".", url), { recursive: true });
    writeFileSync(url, initialBuffer);

    return { location: url };
  };
