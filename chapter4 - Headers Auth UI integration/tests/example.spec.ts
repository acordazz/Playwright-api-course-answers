import { test, expect } from "@playwright/test";
import Ajv from "ajv";
import { iPet, schemaPet, schemaUser } from "../resources/interfaces";
const ajv = new Ajv();

const username = "andbru";
const password = "Password123";

test.beforeAll(async ({ request }) => {
  let response = await request.post("user", {
    data: {
      username: username,
      firstName: "andre",
      lastName: "brunelli",
      email: "andre@fakeemail.com",
      password: password,
      phone: "987654321",
    },
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  expect(response.status(), "Is user registration successfull").toBe(200);

  response = await request.get(`user/${username}`, {
    headers: {
      accept: "application/json",
    },
  });
  const user = await response.json();
  const valid = ajv.validate(schemaUser, user);
  expect(valid, "Validating login schema").toBeTruthy();
});

test.beforeEach(async ({ request }) => {
  let response = await request.get("user/login", {
    params: {
      username: username,
      password: password,
    },
    headers: {
      Accept: "application/json",
    },
  });

  //saving storage state
  await request.storageState({ path: "state.json" });

  expect(response.status(), "Login").toBe(200);
});

test.afterEach(async ({ request }) => {
  let response = await request.get("user/logout", {});
  expect(response.status(), "Logout").toBe(200);
});

test.afterAll(async ({ request }) => {
  let response = await request.delete(`user/${username}`, {});
  expect(response.status(), "User deletion").toBe(200);
});

test("Add pet with API, delete with UI and verify on API", async ({
  request,
  browser,
}) => {
  let petId: number;
  await test.step("POST pet", async () => {
    let response = await request.post(`pet`, {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      data: {
        id: 12345678,
        category: {
          id: 0,
          name: "string",
        },
        name: "Baguette",
        photoUrls: ["a", "b"],
        tags: [
          {
            id: 0,
            name: "French Bulldog",
          },
          {
            id: 1,
            name: "lazy",
          },
        ],
        status: "available",
      },
    });

    // validate response
    const pet: iPet = await response.json();
    petId = pet.id;
    console.log(`pet id: ${petId}`);
    const validate = ajv.compile<iPet>(schemaPet);
    const valid = validate(pet);
    if (valid) {
      // data is Foo here
      console.log("valid");
    } else {
      console.log(validate.errors);
    }
    expect(valid, "Validating schema for new pet").toBeTruthy();

    // verifying that pet is added
    response = await request.get(`pet/${petId}`,{
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    expect(response.ok, `Pet id ${petId} is added`).toBeTruthy();
  });

  await test.step("DELETE pet", async () => {
    const context = await browser.newContext({ storageState: "state.json" });
    const page = await context.newPage();
    await page.goto("");
    await page.goto("https://petstore.swagger.io/#/");
    await page.getByRole("button", { name: "delete ​/pet​/{petId}" }).click();
    await page.getByRole("button", { name: "Try it out" }).click();
    await page.getByPlaceholder("petId").click();
    await page.getByPlaceholder("petId").fill(petId.toString());
    await page.getByRole("button", { name: "Execute" }).click();
    page.pause();
  });

  await test.step("GET pet returns 404", async () => {

    let response = await request.get(`pet/${petId}`, {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    expect(
      response.status(),
      `Should get 404 as id ${petId} has been deleted`
    ).toBe(404);
  });
});
