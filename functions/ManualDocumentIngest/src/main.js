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

  // Functions

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  //Split payload and add individual entries to db
  var payload = req.body
  
  const importDocument = await databases.getDocument(
    Bun.env["DATABASE_IMPORTS"],
    Bun.env["COLLECTION_IMPORTS_JSON"],
    payload.importId
  )

  const importDocumentData = JSON.parse(importDocument.content)
  log("Importing " + importDocumentData.length + " items.")
 

  var counter = 0
  for (const importItem of importDocumentData) {
    counter++

    if (importItem.name == "")
    {
      log("Skipping empty item.")
      continue
    }

    var shops = []
    if (importItem.dtrpg && importItem.dtrpg != "")
    {
      shops.push(JSON.stringify({
        name: "DriveThruRPG",
        url: importItem.dtrpg,
        price: null,
        isPhysical: false,
      }))
    }
    if (importItem.itchio && importItem.itchio != "")
    {
      shops.push(JSON.stringify({
        name: "Itch.io",
        url: importItem.itchio,
        price: null,
        isPhysical: false,
      }))
    }
    if (importItem.physical && importItem.physical != "")
    {
      shops.push(JSON.stringify({
        name: "Tuesday Knight Games",
        url: importItem.physical,
        price: null,
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
      edition: importItem.edition.toUpperCase(),
      format: null,
      type: capitalizeFirstLetter(importItem.type),
      party: importItem.party,
    }

    const documentCreation = await databases.createDocument(
      Bun.env["DATABASE_MOSHDATA"],
      Bun.env["COLLECTION_MOSHDATA_CREATIONS"],
      ID.unique(),
      creation
    );

    log("Created document " + documentCreation["$id"] + ". Item " + counter + "/" + importDocumentData.length) + "."
  };

  // Return
  return res.json({
    success: true,
  }, 200);
};
