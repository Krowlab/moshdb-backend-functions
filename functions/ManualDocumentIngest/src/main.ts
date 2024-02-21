import { Client, Databases, Query, Storage, Users } from 'node-appwrite';

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
  const storage = new Storage(client)

  // Debug
  if (Bun.env["DEBUG_LOG"])
  {
    log("Debug Log enabled!")
    log("Request Body:")
    log(req.body)
  }

  // Parse json file
  // Get newest import file
  const importFile = await storage.listFiles(Bun.env["BUCKET_IMPORT_ID"] || '', [Query.orderDesc("$createdAt"), Query.limit(1)])
  const importFileId = importFile.files.at(0)?.$id
  // Get file content
  const fileContent = await storage.getFileView(Bun.env["BUCKET_IMPORT_ID"] || '', importFileId || '')
  if (Bun.env["DEBUG_LOG"])
  {
    log("Found import file:")
    log(fileContent)
  }
  

  // Return
  return res.json({
    success: true,
  }, 200);
};
