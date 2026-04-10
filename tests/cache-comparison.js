/**
 * CACHE COMPARISON TEST
 * Run this AFTER setting up Redis to compare cached vs uncached performance.
 * Hits the same endpoints repeatedly to demonstrate cache hits.
 * 
 * Usage: k6 run cache-comparison.js
 * Save results: k6 run --out json=results/with-cache.json cache-comparison.js
 */

import http from 'k6/http';
import { sleep, check, group } from 'k6';
import { Trend, Rate } from 'k6/metrics';

const BASE_URL = 'http://PurduePete-1964525879.us-east-1.elb.amazonaws.com';

// Separate metrics for cache hit vs miss analysis
const firstRequestDuration    = new Trend('first_request_duration');   // likely cache miss
const repeatedRequestDuration = new Trend('repeated_request_duration'); // likely cache hit
const errorRate               = new Rate('error_rate');

export const options = {
  stages: [
    { duration: '1m', target: 100 },
    { duration: '3m', target: 100 },
    { duration: '1m', target: 500 },
    { duration: '3m', target: 500 },
    { duration: '1m', target: 0 },
  ],
  thresholds: {
    http_req_duration:         ['p(95)<2000'],
    repeated_request_duration: ['p(95)<500'],  // cached requests should be very fast
    error_rate:                ['rate<0.05'],
  },
};

export default function () {
  // ── Fixed queries — these WILL hit the cache after the first request ───────
  group('Cached Course Search', () => {
    // First request (cache miss)
    const res1 = http.get(`${BASE_URL}/api/courses/search?q=math`);
    firstRequestDuration.add(res1.timings.duration);
    check(res1, { 'first request ok': (r) => r.status === 200 });
    sleep(0.5);

    // Second request (cache hit — should be much faster)
    const res2 = http.get(`${BASE_URL}/api/courses/search?q=math`);
    repeatedRequestDuration.add(res2.timings.duration);
    const ok = check(res2, {
      'cached request ok':   (r) => r.status === 200,
      'cached under 500ms':  (r) => r.timings.duration < 500,
    });
    errorRate.add(!ok);
    sleep(0.5);
  });

  group('Cached Scheduling', () => {
    const res1 = http.get(`${BASE_URL}/api/courses/scheduling?subject=CS&courseID=25200`);
    firstRequestDuration.add(res1.timings.duration);
    check(res1, { 'scheduling first ok': (r) => r.status === 200 });
    sleep(0.5);

    const res2 = http.get(`${BASE_URL}/api/courses/scheduling?subject=CS&courseID=25200`);
    repeatedRequestDuration.add(res2.timings.duration);
    check(res2, {
      'scheduling cached ok':      (r) => r.status === 200,
      'scheduling cached fast':    (r) => r.timings.duration < 500,
    });
    sleep(0.5);
  });

  group('Boilergrades Cache', () => {
    const res1 = http.get(`${BASE_URL}/api/boilergrades/course?course=CS25200`);
    firstRequestDuration.add(res1.timings.duration);
    check(res1, { 'boilergrades first ok': (r) => r.status === 200 });
    sleep(0.5);

    const res2 = http.get(`${BASE_URL}/api/boilergrades/course?course=CS25200`);
    repeatedRequestDuration.add(res2.timings.duration);
    check(res2, { 'boilergrades cached ok': (r) => r.status === 200 });
    sleep(0.5);
  });
}
