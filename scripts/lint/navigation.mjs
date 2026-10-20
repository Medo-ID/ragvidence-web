import { readdirSync } from "node:fs";
import { relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { findVariable, getStringIfConstant } from "@eslint-community/eslint-utils";

// Location analysis adapts the Next.js rule; see NOTICE.txt for its MIT license.
// Discover actual App Router pages so report, license and media links stay anchors.
const appDirectory = fileURLToPath(new URL("../../src/app/", import.meta.url));
const pagePatterns = readdirSync(appDirectory, { recursive: true, withFileTypes: true })
  .filter(entry => entry.isFile() && /^page\.[jt]sx?$/.test(entry.name))
  .map(entry => {
    const segments = relative(appDirectory, entry.parentPath).split(sep)
      .filter(segment => segment && !segment.startsWith("(") && !segment.startsWith("@"));
    const pattern = segments.map(segment => {
      if (segment.startsWith("[[...")) return "(?:/.*)?";
      if (segment.startsWith("[...")) return "/.+";
      if (segment.startsWith("[")) return "/[^/]+";
      return `/${segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`;
    }).join("");
    return new RegExp(`^${pattern}/?$`);
  });

const propertyIs = (node, name) => node?.type === "MemberExpression" &&
  (node.computed ? node.property.type === "Literal" && node.property.value === name : node.property.name === name);
const absoluteUrl = /^(?:[a-z][\d+.a-z-]*:|\/\/)/i;
const browserGlobals = new Set(["window", "globalThis", "document", "self"]);

function isBrowserLocation(node, source) {
  const root = node?.type === "Identifier" && node.name === "location" ? node :
    propertyIs(node, "location") && node.object.type === "Identifier" && browserGlobals.has(node.object.name) ? node.object : null;
  if (!root) return false;
  const variable = findVariable(source.getScope(root), root);
  return Boolean(variable && variable.defs.length === 0);
}

function stringPrefix(node, source, seen = new Set()) {
  if (!node || seen.has(node)) return null;
  seen.add(node);
  const value = getStringIfConstant(node, source.getScope(node));
  if (value !== null) return value;
  if (node.type === "TemplateLiteral") return node.quasis[0].value.cooked ?? node.quasis[0].value.raw;
  if (node.type === "BinaryExpression" && node.operator === "+") return stringPrefix(node.left, source, seen);
  if (node.type === "Identifier") {
    const variable = findVariable(source.getScope(node), node);
    const definition = variable?.defs.at(-1);
    if (definition?.type !== "Variable") return null;
    let expression = definition.node.init;
    for (const reference of variable.references) {
      if (reference.identifier.range[0] >= node.range[0]) break;
      if (reference.isWrite() && reference.writeExpr) expression = reference.writeExpr;
    }
    return stringPrefix(expression, source, seen);
  }
  return null;
}

const navigation = {
  rules: {
    "no-html-link-for-pages": {
      meta: { type: "problem", schema: [], messages: { link: "Use next/link for internal pages. Keep anchors for files and external URLs." } },
      create(context) {
        return {
          JSXOpeningElement(node) {
            if (node.name.type !== "JSXIdentifier" || node.name.name !== "a") return;
            const attributes = node.attributes.filter(attribute => attribute.type === "JSXAttribute");
            if (attributes.some(attribute => attribute.name.name === "download" ||
              attribute.name.name === "target" && attribute.value?.value === "_blank")) return;
            const value = attributes.find(attribute => attribute.name.name === "href")?.value;
            const href = value?.type === "Literal" ? value.value :
              value?.type === "JSXExpressionContainer" ? getStringIfConstant(value.expression, context.sourceCode.getScope(node)) : null;
            if (typeof href !== "string" || !href || href.startsWith("#") || absoluteUrl.test(href)) return;
            const path = href.split(/[?#]/, 1)[0];
            if (pagePatterns.some(pattern => pattern.test(path))) context.report({ node, messageId: "link" });
          },
        };
      },
    },
    "no-location-assign-relative-destination": {
      meta: { type: "problem", schema: [], messages: { navigate: "Use redirect() or useRouter().push() for internal Next.js navigation." } },
      create(context) {
        const source = context.sourceCode;
        const check = (node, location, destination) => {
          if (!isBrowserLocation(location, source) || destination?.type === "SpreadElement") return;
          const prefix = stringPrefix(destination, source);
          if (prefix !== null && !absoluteUrl.test(prefix)) context.report({ node, messageId: "navigate" });
        };
        return {
          CallExpression(node) {
            if (propertyIs(node.callee, "assign")) check(node, node.callee.object, node.arguments[0]);
          },
          AssignmentExpression(node) {
            if (propertyIs(node.left, "href")) check(node, node.left.object, node.right);
          },
        };
      },
    },
  },
};

export default navigation;
