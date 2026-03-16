import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 10, // 10 virtual users running simultaneously
  duration: '30s', // Run the test for 30 seconds
};

export default function () {
  // This tells k6 to "knock" on your backend's door
  http.get('http://host.docker.internal:8000/api/health'); 
  sleep(1); // Wait 1 second between requests so we don't kill the CPU instantly
}