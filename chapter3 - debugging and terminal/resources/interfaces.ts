import { JSONSchemaType } from "ajv";
import Ajv from "ajv/dist/jtd";
const ajv = new Ajv();

type tUser = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  userStatus: number;
};

export const schemaUser = {
  type: "object",
  properties: {
    id: { type: "number" },
    username: { type: "string" },
    firstName: { type: "string" },
    lastName: { type: "string" },
    email: { type: "string" },
    password: { type: "string" },
    phone: { type: "string" },
    userStatus: { type: "number" },
  },
};

interface iTag {
  id: number;
  name: string;
};

export interface iPet {
  id: number;
  category: {
    id: number;
    name: string;
  };
  name: string;
  photoUrls: string[];
  tags: iTag[];
  status: string;
};

const schemaTag: JSONSchemaType<iTag> = {
  type: "object",
  properties: {
    id: { type: "number" },
    name: { type: "string" },
  },
  required: ["id", "name"]
}

export const schemaPet: JSONSchemaType<iPet> = {
  type: "object",
  properties: {
    id: { type: "number" },
    category: {
      type: "object",
      properties: {
        id: { type: "number" },
        name: { type: "string" },
      },
      required: ["id", "name"],
    },
    name: { type: "string" },
    photoUrls: {
      type: "array",
      items: { type: "string" },
    },
    tags: {
      type: "array",
      items: schemaTag,
    },
    status: { 
      type: "string", 
      enum: ["available", "pending", "sold"] 
    },
  },
  required: ["id", "category", "name", "photoUrls", "tags", "status"],
  additionalProperties: false
};
