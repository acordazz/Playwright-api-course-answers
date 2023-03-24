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
  const response = await request.get("https://restful-booker.herokuapp.com/booking/");

  expect(response.status(), "testing whether status is 200").toBe(200);
  const body = await response.json();
  console.log(JSON.stringify(body));
});

/*
Using parameters
3721 - John Doe
*/
test("GET individual booking, using params", async ({ request }) => {
  const bookingId = 852;
  const response = await request.get(`https://restful-booker.herokuapp.com/booking/${bookingId}`);

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
  const response = await request.post("https://restful-booker.herokuapp.com/booking", {
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
    'Accept': "application/json",
    "Content-Type": "application/json"
  }
  });

  expect(response.status(), "testing whether status is 200").toBe(200);
  const body = await response.json();
  console.log(JSON.stringify(body));
});


/*

creating API key and using it on DEL
- chaining calls
- response is JSON
- Save bookingId in variable to use in new request
- MAKE FIRST WITHOUT AUTHORIZATION
- use of some authentication
*/


test("POST and DELETE booking", async ({ request }) => {

  let response = await request.post("https://restful-booker.herokuapp.com/booking", {
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
  const BodyPost = await response.json();
  const BookingId = BodyPost.bookingid;
  console.log(`New booking: ${BookingId}`);

  const responseDel = await request.delete(`https://restful-booker.herokuapp.com/booking/${BookingId}`, {
    headers: {
      // 'Cookie': `token=${Token}`
      'Authorization': 'Basic YWRtaW46cGFzc3dvcmQxMjM='
    }
  });

  expect(responseDel.status(), "testing whether status is 201").toBe(201);
});

/*
PUT
- you update the entire entry - not just parts of it (that would be PATCH)
*/
test("PUT booking", async ({ request }) => {
  const bookingId = 852;
  const response = await request.put(`https://restful-booker.herokuapp.com/booking/${bookingId}`, {
    data: {
      firstname: "Johnny",
      lastname: "Cash",
      totalprice: 111,
      depositpaid: false,
      bookingdates: {
        checkin: "2013-01-01",
        checkout: "2014-01-01",
      },
      additionalneeds: "lunch",
    },
  headers: {
    'Accept': "application/json",
    'Content-Type': 'application/json',
    'Authorization': 'Basic YWRtaW46cGFzc3dvcmQxMjM='
  }
  });

  expect(response.status(), "testing whether status is 200").toBe(200);
  const body = await response.json();
  console.log(JSON.stringify(body));
});