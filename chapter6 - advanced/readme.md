
API mocking: https://playwright.dev/docs/mock
https://playwright.dev/docs/network#handle-requests

fixtures (better than beforeEach): https://playwright.dev/docs/test-fixtures

Using Fiddler:
- Tools -> options -> HTTPS: capture HTTPS CONNECTs, Decrypt HTTPS traffic
- Tools -> Options -> Gateway: manual proxy - 127.0.0.1, 8888 (set back to using system proxy after using to avoid connectivity issues all over)

on playwright.config.ts:
```

    proxy: {
      server: "http://127.0.0.1:8888"      
    },
    ignoreHTTPSErrors: true
```