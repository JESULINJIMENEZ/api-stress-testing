import http from "k6/http";
import { sleep } from "k6";

export const options = {
  stages: [
    { duration: "30s", target: 50 },   //50 users
    { duration: "1m", target: 200 },   // 200 users
    { duration: "30s", target: 0 },    // down to 0
  ],
};

export default function () {
  http.get("https://midominio.com/");
  sleep(1);
}
