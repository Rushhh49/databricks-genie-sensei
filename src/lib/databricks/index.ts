import axios from 'axios';

const host = process.env.DATABRICKS_HOST;
const token = process.env.DATABRICKS_PAT;

if (!host || !token) {
  throw new Error('DATABRICKS_HOST and DATABRICKS_PAT must be set in the environment');
}

export const databricksClient = axios.create({
  baseURL: host,
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});
