import { convertPortfolioToDocuments } from "./document.js";
import { embeddings } from "../config/ai_config.js";
import { chromadbClient, getCollection } from "./chroma.js";
import { pinecone_index, vectorStore } from "./pinecone.js";

const initializeVectorStore = async () => {
    try {
        // const docs = convertPortfolioToDocuments();
        // const vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);
        await chromadbClient.getOrCreateCollection({
            name: "portfolio"
        });

        return chromadbClient;
    } catch (error) {
        throw error;
    }
}

// async function ingestDocumentsByChroma() {
//     try {
//         const docs = convertPortfolioToDocuments();
//         const collection = await getCollection('portfolio');

//         const count = await collection.count();
//         if (count > 0) {
//             console.log("Documents already exist.");
//             return { success: true };
//         }
//         const vectors = await Promise.all(
//             docs.map((doc) => embeddings.embedQuery(doc.pageContent))
//         );

//         await collection.add({
//             ids: docs.map((d) => String(d.metadata.id!)),
//             documents: docs.map((d) => d.pageContent),
//             metadatas: docs.map((d) => d.metadata),
//             embeddings: vectors,
//         });

//         console.log("Documents inserted.");
//         return { success: true };
//     } catch (error) {
//         return error;
//     }
// }

async function ingestDocumentsByPinecone() {
    try {
        const { docs, ids } = convertPortfolioToDocuments();
        // const vectorStores = await vectorStore.asRetriever()

        // const count = await vectorStore.();
        // if (count > 0) {
        //     console.log("Documents already exist.");
        //     return { success: true };
        // }
        // const vectors = await Promise.all(
        //     docs.map((doc) => embeddings.embedQuery(doc.pageContent))
        // );
        const indexDetails = await pinecone_index.fetch(['skills'])

        if (Object.keys(indexDetails.records).length > 0) {
            console.log("Documents already exist.");
            return { success: true };
        } else {
            await vectorStore.addDocuments(docs, { ids });
        }

        //     ids: docs.map((d) => String(d.metadata.id!)),
        //     documents: docs.map((d) => d.pageContent),
        //     metadatas: docs.map((d) => d.metadata),
        //     embeddings: vectors,
        // });

        console.log("Documents inserted.");
        return { success: true };
    } catch (error) {
        return error;
    }
}

export { initializeVectorStore, ingestDocumentsByPinecone }