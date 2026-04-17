import axios from 'axios';


const DUMMY_UUID = '550e8400-e29b-41d4-a716-446655440000';

export const apiClient = axios.create({
  baseURL: 'https://k8s.mectest.ru/test-app',
  headers: {
    Authorization: `Bearer ${DUMMY_UUID}`,
    'Content-Type': 'application/json',
  },
});