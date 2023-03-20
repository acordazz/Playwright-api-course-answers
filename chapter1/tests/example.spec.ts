import { test, expect } from '@playwright/test';

test("GET booking summary", async ({ request }) => {
  const response = await request.get(
    "https://restful-booker.herokuapp.com/booking"
  );

  expect(response.status()).toBe(200);
  const body = await response.json();
  console.log(JSON.stringify(body));
});