**Load Testing Project**
- **Description**: A couple of `k6` scripts to run simple load tests against a public endpoint and a login endpoint.

**Files**
- **`index.js`**: Simple load test that performs `GET` requests to `https://mi.dominio.com/`.
  - **Imports**: `http` and `sleep` from `k6`.
  - **Options**: `stages` defines the user ramp:
    - `{ duration: "30s", target: 50 }` — ramp up to 50 users over 30s.
    - `{ duration: "1m", target: 200 }` — ramp up to 200 users over 1 minute.
    - `{ duration: "30s", target: 0 }` — ramp down to 0 over 30s.
  - **Default function**: performs `http.get("https://mi.dominio.com/")` and calls `sleep(1)`.
  - **Usage**: Run the test with:

```bash
k6 run index.js
```

- **`loginTest.js`**: Load test that simulates login POSTs to `https://mi.dominio.com/login`.
  - **Imports**: `http`, `check` and `sleep` from `k6`.
  - **Options**:
    - `stages` — user ramp: 10 → 30 → 50 → 0 with the durations defined in the script.
    - `thresholds` — acceptance rules:
      - `http_req_duration: ["p(95)<1500"]` — 95% of requests should complete in <1.5s.
      - `http_req_failed: ["rate<0.05"]` — fewer than 5% of requests should fail.
  - **Default function**:
    - Builds a `data` object with `email` and `password` and sends it with `http.post`.
    - Verifies the response with `check(res, { 'success login': (r) => r.status === 200 })`.
    - Calls `sleep(0.3)` between iterations.
  - **Body format note**: Passing a plain object as the second parameter sends `application/x-www-form-urlencoded` by default. If the API expects JSON, use `JSON.stringify(data)` and add the header `Content-Type: application/json`.
  - **Usage**: Run the test with:

```bash
k6 run loginTest.js
```

**Prerequisites**
- **`k6`**: On macOS you can install it with Homebrew:

```bash
brew install k6
```

**Useful commands**
- Run a specific script:

```bash
k6 run index.js
k6 run loginTest.js
```
- Save output to JSON for later analysis:

```bash
k6 run --out json=results.json loginTest.js
```

**Recommendations & Best Practices**
- **Credentials**: Do not store credentials in plain text in public repos; use environment variables and `__ENV` in `k6`:

```js
const data = {
  email: __ENV.EMAIL || 'admin@test.local',
  password: __ENV.PASSWORD || 'admin1234'
}
```

- **Validate payload format**: adapt headers when the API expects JSON.
- **Tune ramp-up**: adjust `stages` to emulate real traffic patterns for your system.

**Next steps**
- Update `loginTest.js` to read credentials from `__ENV` if you want to run tests with real credentials securely.
- I can run a local test and collect `results.json` if you want me to execute a trial run and share results.

File created: `readmeEn.md`
