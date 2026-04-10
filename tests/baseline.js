/**
 * BASELINE TEST — No Redis, No Autoscaling
 * Run this FIRST to get baseline metrics before any optimizations.
 * 
 * Usage: k6 run baseline.js
 * Save results: k6 run --out json=results/baseline.json baseline.js
 */

import http from 'k6/http';
import { sleep, check, group } from 'k6';
import { Trend, Rate, Counter } from 'k6/metrics';

const BASE_URL = 'http://PurduePete-1964525879.us-east-1.elb.amazonaws.com';

// Custom metrics
const courseSearchDuration = new Trend('course_search_duration');
const schedulingDuration   = new Trend('scheduling_duration');
const loginDuration        = new Trend('login_duration');
const degreePlanDuration   = new Trend('degree_plan_duration');
const errorRate            = new Rate('error_rate');
const totalRequests        = new Counter('total_requests');

export const options = {
  stages: [
    { duration: '1m', target: 50 },    // warm up
    { duration: '2m', target: 50 },    // hold at 50
    { duration: '1m', target: 200 },   // ramp to 200
    { duration: '2m', target: 200 },   // hold at 200
    { duration: '1m', target: 500 },   // ramp to 500
    { duration: '2m', target: 500 },   // hold at 500
    { duration: '1m', target: 1000 },  // ramp to 1000
    { duration: '2m', target: 1000 },  // hold at 1000
    { duration: '1m', target: 0 },     // ramp down
  ],
  thresholds: {
    http_req_duration:      ['p(95)<3000'],  // 95% of requests under 3s
    http_req_failed:        ['rate<0.1'],    // error rate under 10%
    course_search_duration: ['p(95)<2000'],
    login_duration:         ['p(95)<2000'],
  },
};

// ─── Unauthenticated flows ───────────────────────────────────────────────────

export default function () {
  group('Course Search', () => {
    const queries = ['math', 'cs', 'physics', 'english', 'history'];
    const q = queries[Math.floor(Math.random() * queries.length)];

    const res = http.get(`${BASE_URL}/api/courses/search?q=${q}`);
    courseSearchDuration.add(res.timings.duration);
    totalRequests.add(1);

    const ok = check(res, {
      'search status 200':  (r) => r.status === 200,
      'search under 3s':    (r) => r.timings.duration < 3000,
      'search has results': (r) => {
        try { return Array.isArray(JSON.parse(r.body)); } catch { return false; }
      },
    });
    errorRate.add(!ok);
    sleep(1);
  });

  group('Course Scheduling', () => {
    const res = http.get(`${BASE_URL}/api/courses/scheduling?subject=CS&courseID=25200`);
    schedulingDuration.add(res.timings.duration);
    totalRequests.add(1);

    const ok = check(res, {
      'scheduling status 200': (r) => r.status === 200,
      'scheduling under 3s':   (r) => r.timings.duration < 3000,
    });
    errorRate.add(!ok);
    sleep(1);
  });
}
