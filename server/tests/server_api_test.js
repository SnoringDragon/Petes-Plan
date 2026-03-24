import http from 'k6/http';
import { check, sleep } from 'k6';

// 1. Define the Load Profile
export const options = {
  stages: [
    { duration: '30s', target: 50 }, // Warm up: 10 users
    { duration: '1m', target: 5000 },  // Stress: 30 concurrent users
    { duration: '30s', target: 0 },  // Cool down
  ],
  thresholds: {
    http_req_failed: ['rate<0.05'],   // Allow <5% error rate (Cloud can be jittery)
    http_req_duration: ['p(95)<500'], // 95% of cloud requests should be < 500ms
  },
};

export default function () {
  // 2. Diversify the queries to test MongoDB's search index
  const queries = ['math101', 'math101', 'math101', 'math101'];
  const randomQuery = queries[Math.floor(Math.random() * queries.length)];
  
  const url = `http://host.docker.internal:8000/api/courses/search?q=${randomQuery}`;
  
  // 3. Execute the request
  const res = http.get(url);

  // 4. Validate the response
  check(res, {
    'status is 200': (r) => r.status === 200,
    'body is not empty': (r) => r.body.length > 2,
  });

  // 5. Pacing: Simulate a student typing or reading results
  sleep(1);
}