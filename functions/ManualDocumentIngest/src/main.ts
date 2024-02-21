import { Client, Databases, Query, Storage} from 'node-appwrite';
import type { Models } from 'node-appwrite';
import { parseJsonText } from 'typescript';


interface Creation {
  name: string;
  format: string;
  type: string;
  description: string;
  tags?: string[];
  shops: string[];
  edition: string;
  official: boolean;
}

interface importDocument extends Models.Document {
  content: string
}

export default async ({ req, res, log, error }: any) => {
  // Discard wrong methods
  if (req.method != 'POST')
  {
    error("Wrong Method: Use POST.")
    return res.json({
      success: false
    }, 400);
  }

  // Appwrite setup
  const client = new Client()
    .setEndpoint(Bun.env["APPWRITE_FUNCTION_ENDPOINT"] || '')
    .setProject(Bun.env["APPWRITE_FUNCTION_PROJECT_ID"] || '')
    .setKey(Bun.env["APPWRITE_FUNCTION_API_KEY"] || '');

  const databases = new Databases(client)

  // Debug
  if (Bun.env["DEBUG_LOG"])
  {
    log("Debug Log enabled!")
  }

  //Split payload and add individual entries to db
  for (var entry of req.body)
  {
    log(entry.name)
  }
  

  // Return
  return res.json({
    success: true,
  }, 200);
};
