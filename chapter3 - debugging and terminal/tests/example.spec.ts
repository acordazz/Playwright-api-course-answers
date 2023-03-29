import { test, expect } from "@playwright/test";
import Ajv from "ajv"
import { schemaLogin } from "../resources/interfaces";
const ajv = new Ajv()

let AuthToken: string;
let UserId: number;
let UserTypeId: number;
test.beforeEach(async ({ request }) => {
  let response = await request.post("api/Login", {
    data: {
      firstName: "Andre",
      lastName: "Brunelli",
      username: "acordazz",
      password: "APITestingPlaywright",
      gender: "male"
    },
    headers: {
      Accept: "application/json",
    },
  });

  expect(response.status(), "testing whether status is 200").toBe(200);
  const login = await response.json();
  const valid = ajv.validate(schemaLogin, login);
  expect(valid, "Validating login schema").toBeTruthy();
  AuthToken = "bearer ".concat(login.token);
  UserId = login.userDetails.userId;
  UserTypeId = login.userDetails.userTypeId;
});

test("Add book", async ({ request }) => {
  const newBookResponse = await request.post("api/Book", {
    headers: {
      "Authorization": AuthToken
    }
  });
  const newBook = await newBookResponse.json();
  expect(newBookResponse.status(), "new book created successfully").toBe(200);
  // const bookId = newBook.

});
