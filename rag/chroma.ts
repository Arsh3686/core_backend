import { ChromaClient } from "chromadb";
import { vectorStore } from "./pinecone.js";

export const chromadbClient = new ChromaClient({
    path: process.env.CHROMA_PATH! || "http://localhost:8000",
});

export async function getCollection(collectionName: string = 'portfolio') {
    return chromadbClient.getOrCreateCollection({
        name: collectionName,
    });
}

// export async function getCollection(collectionName: string = 'portfolio') {
//     return vectorStore.asRetriever({})
// }