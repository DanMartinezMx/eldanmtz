import { createClient } from "tinacms/dist/client";
import { queries } from "./types.js";
export const client = createClient({ url: 'http://localhost:4001/graphql', token: '5b9166088c2378ab1a4e2c3874d79473a4b5003f', queries,  });
export default client;
  