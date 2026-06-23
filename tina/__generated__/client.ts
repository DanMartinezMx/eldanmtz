import { createClient } from "tinacms/dist/client";
import { queries } from "./types.js";
export const client = createClient({ url: 'http://localhost:4001/graphql', token: 'b9f53e48232cf8aabac68bfaf41c17555169f1de', queries,  });
export default client;
  