import { test, expect } from "@playwright/test";

/*

Using hooks

We begin with some of the calls we used on Chapter1. They were disconnected and disorganized. 
In order to group some tests according to a common purpose or even create a sequence of calls related to a same test:
- test.describe - organize tests into a group. Have contextualized variables
- test.beforeAll, beforeEach, afterAll, afterEach - same as other test frameworks
  - make an example where you instantiate a list for bookingIds and in afterAll you delete them all
- test.fail - use as TDD (Red, Green, Refactor)
- await test.step('test', async ({async () => {}})) -> organize report
*/
test.describe("Using common setup", () => {
  let bookingForBeforeAll: number;
  let bookingForBeforeEach: number;
  const seedNumber = Math.floor(Date.now() / 1000).toString();

  test.beforeAll(async ({ request }) => {
    let response = await request.post(
      "https://restful-booker.herokuapp.com/booking",
      {
        data: {
          firstname: "Mary Jane",
          lastname: `Watson${seedNumber}`,
          totalprice: 120,
          depositpaid: true,
          bookingdates: {
            checkin: "2018-01-01",
            checkout: "2019-01-01",
          },
          additionalneeds: "Breakfast",
        },
        headers: {
          Accept: "application/json",
        },
      }
    );

    expect(response.status(), "testing whether status is 200").toBe(200);
    const BodyPost = await response.json();
    bookingForBeforeAll = BodyPost.bookingid;
    console.log(`Booking for beforeAll: ${bookingForBeforeAll}`);
  });

  test.beforeEach(async ({ request }) => {
    let response = await request.post(
      "https://restful-booker.herokuapp.com/booking",
      {
        data: {
          firstname: "Peter",
          lastname: `Parker${seedNumber}`,
          totalprice: 130,
          depositpaid: true,
          bookingdates: {
            checkin: "2018-01-01",
            checkout: "2019-01-01",
          },
          additionalneeds: "Flies",
        },
        headers: {
          Accept: "application/json",
        },
      }
    );

    expect(response.status(), "testing whether status is 200").toBe(200);
    const BodyPost = await response.json();
    bookingForBeforeEach = BodyPost.bookingid;
    console.log(`Booking for beforeEach: ${bookingForBeforeEach}`);
  });

  test.afterEach(async ({ request }) => {
    const responseDel = await request.delete(
      `https://restful-booker.herokuapp.com/booking/${bookingForBeforeEach}`,
      {
        headers: {
          Authorization: "Basic YWRtaW46cGFzc3dvcmQxMjM=",
        },
      }
    );

    expect(
      responseDel.status(),
      "testing whether status is 201 (means it was successfully deleted)."
    ).toBe(201);
  });

  test.afterAll(async ({ request }) => {
    const responseDel = await request.delete(
      `https://restful-booker.herokuapp.com/booking/${bookingForBeforeAll}`,
      {
        headers: {
          Authorization: "Basic YWRtaW46cGFzc3dvcmQxMjM=",
        },
      }
    );

    expect(
      responseDel.status(),
      "testing whether status is 201 (means it was successfully deleted)."
    ).toBe(201);
  });

  test("Search for two bookings", async ({
    request,
  }) => {
    // test.fail(!process.env.CI, 'Test will fail unless if run on CI pipeline.');
    // expect(false).toBe(true);

    // test.skip(!process.env.CI, 'Skip this test when running outside a CI pipeline.');

    // surround with test.step

    await test.step("getting first booking", async () => {
      const responseFirstBooking = await request.get(
        `https://restful-booker.herokuapp.com/booking`,
        {
          params: {
            firstname: "Mary Jane",
            lastname: `Watson${seedNumber}`,
          },
        }
      );

      expect(
        responseFirstBooking.status(),
        "testing whether status is 200"
      ).toBe(200);
      const BodyFirstPost: any[] = await responseFirstBooking.json();
      const BookingIdFirst = BodyFirstPost[0].bookingid;
      console.log(`First booking: ${BookingIdFirst}`);
    });

    test.step("getting second booking", async () => {
      const responseSecondBooking = await request.get(
        `https://restful-booker.herokuapp.com/booking`,
        {
          params: {
            firstname: "Peter",
            lastname: `Parker${seedNumber}`,
          },
        }
      );
  
      expect(
        responseSecondBooking.status(),
        "testing whether status is 200"
      ).toBe(200);
      const BodySecondPost: any[] = await responseSecondBooking.json();
      const BookingIdSecond = BodySecondPost[0].bookingid;
      console.log(`Second booking: ${BookingIdSecond}`);
    })
  });
});

/*
Parameterized tests
*/
test.describe("Getting multiple bookings individually", async () => {
  const bookingIds = [1055, 1921, 2615];
  for (const id of bookingIds) {
    test(`Get booking ${id}`, async ({ request }) => {
      const responseFirstBooking = await request.get(
        `https://restful-booker.herokuapp.com/booking/${id}`
      );

      expect(
        responseFirstBooking.status(),
        "testing whether status is 200"
      ).toBe(200);
      const bodyJson = await responseFirstBooking.json();
      console.log(`Booking for id ${id}: ${JSON.stringify(bodyJson)}`);
    });
  }
});

/*

baseUrl, other cool stuff from playwright.config.ts

*/
