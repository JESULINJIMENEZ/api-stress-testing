import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  stages: [
    { duration: "20s", target: 10 },   // Up to 10 users
    { duration: "20s", target: 30 },   // Up to 30 users
    { duration: "30s", target: 50 },   // Up to 50 users
    { duration: "20s", target: 0 },    // Down to 0 users
  ],
  thresholds: {
    http_req_duration: ["p(95)<1500"], // 95% percent <1.5s
    http_req_failed: ["rate<0.05"],    // <5% should fail
  }
}

export default function () {
  const data = { 
    email: 'admin@test.local', 
    password: 'admin1234' 
  }

  let res = http.post('https://mi.dominio.com/login', data)

  check(res, { 'success login': (r) => r.status === 200 })

  sleep(0.3)
}
