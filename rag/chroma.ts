import { ChromaClient } from "chromadb";

export const chromadbClient = new ChromaClient({
    path: process.env.CHROMA_PATH! || "http://localhost:8000",
});

export async function getCollection(collectionName: string = 'portfolio') {
    return chromadbClient.getOrCreateCollection({
        name: collectionName,
    });
}