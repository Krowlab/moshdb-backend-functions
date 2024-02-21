import { Client, Databases, Query, Storage} from 'node-appwrite';


export default async ({ req, res, log, error }) => {
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
  var payload = JSON.parse(req.body)
  payload.forEach((importItem) => {
    log(importItem.Name)
  })
  

  // Return
  return res.json({
    success: true,
  }, 200);
};
