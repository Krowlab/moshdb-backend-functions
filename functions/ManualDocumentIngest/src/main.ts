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
    log("Request Body:")
    log(req.body)
  }

  // Parse jsonImport
  // Get newest import file
  /*const importDocuments = await databases.listDocuments(Bun.env["DATABASE_IMPORTS_ID"] || '', Bun.env["COLLECTION_IMPORTS_JSON_ID"] || '', [Query.orderDesc("$createdAt"), Query.limit(1)])
  const importDocumentId = importDocuments.documents.at(0)?.$id
  if (Bun.env["DEBUG_LOG"])
  {
    log("Found import document with ID:")
    log(importDocumentId)
  }
  // Get file content
  const importDocument = await databases.getDocument(Bun.env["DATABASE_IMPORTS_ID"] || '', Bun.env["COLLECTION_IMPORTS_JSON_ID"] || '', importDocumentId || '') as importDocument
  const importText = importDocument.content
  const importJson = JSON.parse(importText)
  if (Bun.env["DEBUG_LOG"])
  {
    log("File content:")
    log(importJson)
  }*/
  

  // Return
  return res.json({
    success: true,
  }, 200);
};
