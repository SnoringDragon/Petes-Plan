/**
 * SPIKE TEST — Simulates Purdue Registration Day
 * Sudden surge of 10,000 students hitting the system at once.
 * Tests autoscaling response time and system resilience.
 * 
 * Usage: k6 run spike.js
 * Save results: k6 run --out json=results/spike.json spike.js
 */

import http from 'k6/http';
import { sleep, check } from 'k6';
import { Trend, Rate } from 'k6/metrics';

const BASE_URL = 'http://PurduePete-1964525879.us-east-1.elb.amazonaws.com';

const responseDuration = new Trend('response_duration');
const errorRate        = new Rate('error_rate');

export const options = {
  stages: [
    { duration: '2m',  target: 100 },    // normal traffic before registration
    { duration: '30s', target: 5000 },   // registration opens — sudden spike!
    { duration: '5m',  target: 5000 },   // peak registration traffic
    { duration: '30s', target: 10000 },  // absolute peak
    { duration: '3m',  target: 10000 },  // hold at max
    { duration: '2m',  target: 100 },    // registration closes, traffic drops
    { duration: '1m',  target: 0 },      // done
  ],
  thresholds: {
    http_req_duration: ['p(95)<5000'],  // more lenient during spike
    http_req_failed:   ['rate<0.2'],    // allow up to 20% errors during spike
    error_rate:        ['rate<0.2'],
  },
};

export default function () {
  // Most students during registration just search for courses
  const subjects = ['cs', 'math', 'ece', 'ma', 'ie', 'me', 'phys', 'engl'];
  const q = subjects[Math.floor(Math.random() * subjects.length)];

  const res = http.get(`${BASE_URL}/api/courses/search?q=${q}`);
  responseDuration.add(res.timings.duration);

  const ok = check(res, {
    'status 200':  (r) => r.status === 200,
    'under 5s':    (r) => r.timings.duration < 5000,
  });
  errorRate.add(!ok);

  sleep(1);
}
