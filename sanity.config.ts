import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";

import { schemaTypes } from "./sanity/schemas";
import { SINGLETON_TYPES, structure } from "./sanity/structure";
import { apiVersion, dataset, projectId } from "./lib/sanity.client";

export default defineConfig({
  name: "ruvyne",
  title: "Ruvyne",
  basePath: "/studio",

  projectId: projectId ?? "8l2ub7v1",
  dataset,

  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    newDocumentOptions: (prev) =>
      prev.filter(
        (item) =>
          !SINGLETON_TYPES.includes(item.templateId as (typeof SINGLETON_TYPES)[number])
      ),
    actions: (prev, { schemaType }) =>
      SINGLETON_TYPES.includes(schemaType as (typeof SINGLETON_TYPES)[number])
        ? prev.filter(
            ({ action }) =>
              action && !["delete", "duplicate", "unpublish"].includes(action)
          )
        : prev,
  },
});
