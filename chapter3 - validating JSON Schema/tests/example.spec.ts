import { test, expect } from "@playwright/test";
import Ajv from "ajv"
import { iPet, schemaPet, schemaUser } from "../resources/interfaces";
const ajv = new Ajv()

let AuthToken: string;
let UserId: number;
let UserTypeId: number;

const username = "andbru";
const password = "Password123";

test.beforeAll(async ({ request }) => {
  let response = await request.post("user", {
    data: {
      "username": username,
      "firstName": "andre",
      "lastName": "brunelli",
      "email": "andre@fakeemail.com",
      "password": password,
      "phone": "987654321"
    },
    headers: {
      "accept": "application/json",
      "Content-Type": "application/json"
    }
  });
  expect(response.status(), "Is user registration successfull").toBe(200);

  response = await request.get(`user/${username}`, {
    headers: {
      "accept": "application/json"
    }
  });
  const user = await response.json();
  const valid = ajv.validate(schemaUser, user);
  expect(valid, "Validating login schema").toBeTruthy();

});

test.beforeEach(async ({ request }) => {
  let response = await request.get("user/login", {
    params: {
      "username": username,
      "password": password
    },
    headers: {
      Accept: "application/json",
    },
  });

  expect(response.status(), "Login").toBe(200);
  const login = await response.json();
});

test.afterEach(async ({ request }) => {
  let response = await request.get("user/logout", {
  });
  expect(response.status(), "Logout").toBe(200);

});

test.afterAll(async ({ request }) => {
  let response = await request.delete(`user/${username}`, {
  });
  expect(response.status(), "User deletion").toBe(200);

})

test("Add pet", async ({ request }) => {
  let response = await request.post(`pet`, {
    headers: {
      "accept": "application/json",
      "Content-Type": "application/json"
    },
    data: {
      "id": 0,
      "category": {
        "id": 0,
        "name": "string"
      },
      "name": "Baguette",
      "photoUrls": [
        "a", "b"
      ],
      "tags": [
        {
          "id": 0,
          "name": "French Bulldog"
        },
        {
          "id": 1,
          "name": "lazy"
        }
      ],
      "status": "available"
    }
  });
  const pet = await response.json();
  const validate = ajv.compile<iPet>(schemaPet);
  const valid = validate(pet);
  if (valid) {
    // data is Foo here
    console.log("valid")
  } else {
    console.log(validate.errors)
  }
  expect(valid, "Validating schema for new pet").toBeTruthy();

});
