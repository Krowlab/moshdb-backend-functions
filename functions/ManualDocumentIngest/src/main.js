import { Client, Databases, Query, ID, Storage} from 'node-appwrite';


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
    log("Request: " + JSON.stringify(req.body))
  }

  //Split payload and add individual entries to db
  var payload = req.body
  
  const importDocument = await databases.getDocument(
    Bun.env["DATABASE_IMPORTS"],
    Bun.env["COLLECTION_IMPORTS_JSON"],
    payload.importId
  )

  const importDocumentData = JSON.parse(importDocument.content)

  importDocumentData.forEach(async (importItem) => {
    var shops = []
    if (importItem.dtrpg && importItem.dtrpg != "")
    {
      shops.push(JSON.stringify({
        name: "DriveThruRPG",
        url: importItem.dtrpg,
        price: "X.X",
        isPhysical: false,
      }))
    }
    if (importItem.itchio && importItem.itchio != "")
    {
      shops.push(JSON.stringify({
        name: "Itch.io",
        url: importItem.itchio,
        price: "X.X",
        isPhysical: false,
      }))
    }
    if (importItem.physical && importItem.physical != "")
    {
      shops.push(JSON.stringify({
        name: "Tuesday Knight Games",
        url: importItem.physical,
        price: "X.X",
        isPhysical: true,
      }))
    }

    var authorsRaw = importItem.authors.split(" & ")
    var authors = []
    authorsRaw.forEach((author) => {
      authors.push(JSON.stringify({
        name: author,
        url: null,
      }))
    })


    var creation = {
      name: importItem.name,
      authors: authors,
      description: null,
      notes: null,
      shops: shops,
      tags: [],
      edition: importItem.edition,
      format: null,
      type: importItem.type,
      party: importItem.party,
    }

    const documentCreation = await databases.createDocument(
      Bun.env["DATABASE_MOSHDATA"],
      Bun.env["COLLECTION_MOSHDATA_CREATIONS"],
      creation
    );
  });

  // Return
  return res.json({
    success: true,
  }, 200);
};
