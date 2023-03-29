import Ajv from "ajv";
const ajv = new Ajv();

type iUser = {
  userId: number;
  firstName: string | undefined;
  lastName: string | undefined;
  username: string | undefined;
  password: string | undefined;
  gender: string | undefined;
  userTypeId: number;
};

type iLogin = {
  token: string;
  userDetails: iUser;
}

export const schemaLogin = {
  type: "object",
  properties: {
    token: { type: "string" },
    userDetails: { 
      type: "object",
      properties: {
        userId: {type: "number" },
        firstName: {type: ["string", "null"] },
        lastName: {type: ["string", "null"] },
        username: {type: ["string", "null"] },
        password: {type: ["string", "null"] },
        gender: {type: ["string", "null"] },
        userTypeId: {type: "number" },
      },
      required: ["userId", "userTypeId"]
   },
  },
  required: ["token", "userDetails"]
};
