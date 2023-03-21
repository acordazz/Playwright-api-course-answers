import { test, expect } from '@playwright/test';

/* 
First test

- request fixture: respects configuration options like baseURL or extraHTTPHeaders in playwright.config.ts
- request.get( - calling API
- expect( - write assertions
    - asserting only on response status
- run test, see playwright-report/index.html
- Ctrl Shift P - 'view in browser' 
*/
test("GET list of bookings", async ({ request }) => {
  const response = await request.get(
    "https://restful-booker.herokuapp.com/booking"
  );

  expect(response.status(), "testing whether status is 200").toBe(200);
  const body = await response.json();
  console.log(JSON.stringify(body));
});

/*
Using relative addresses

Change playwright.config.ts:
- baseURL: 'https://restful-booker.herokuapp.com/',
Change test:

*/
test("GET list of bookings, baseURL from .env", async ({ request }) => {
  const response = await request.get("booking/");

  expect(response.status(), "testing whether status is 200").toBe(200);
  const body = await response.json();
  console.log(JSON.stringify(body));
});

/*
Using parameters
3721 - John Doe
*/
test("GET list of bookings, using params", async ({ request }) => {
  const response = await request.get("booking/9503");

  expect(response.status(), "testing whether status is 200").toBe(200);
  const body = await response.json();
  console.log(JSON.stringify(body));
});

/*
POST
- data
- headers
*/
test("POST booking", async ({ request }) => {
  const response = await request.post("booking", {
    data: {
      "firstname" : "Johnny",
      "lastname" : "Cash",
      "totalprice" : 111,
      "depositpaid" : true,
      "bookingdates" : {
          "checkin" : "2018-01-01",
          "checkout" : "2019-01-01"
      },
      "additionalneeds" : "Breakfast"
  },
  headers: {
    'Accept': "application/json"
  }
  });

  expect(response.status(), "testing whether status is 200").toBe(200);
  const body = await response.json();
  console.log(JSON.stringify(body));
});


/*

creating API key and using it on DEL

*/
const Token = 'd278cef88883cba'
const BookingId = "18312"
test("DELETE booking", async ({ request }) => {
  const response = await request.delete(`booking/${BookingId}`, {
    headers: {
      // 'Cookie': `token=${Token}`
      'Authorization': 'Basic YWRtaW46cGFzc3dvcmQxMjM='
    }
  });

  expect(response.status(), "testing whether status is 201").toBe(201);
  const body = await response.json();
  console.log(JSON.stringify(body));
});