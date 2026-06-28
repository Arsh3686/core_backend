import { convertPortfolioToDocuments } from "./document";
import { embeddings } from "../config/ai_config";
import { chromadbClient, getCollection } from "./chroma";

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

async function ingestDocuments() {
    try {
        const docs = convertPortfolioToDocuments();
        const collection = await getCollection('portfolio');

        const count = await collection.count();
        if (count > 0) {
            console.log("Documents already exist.");
            return { success: true };
        }
        const vectors = await Promise.all(
            docs.map((doc) => embeddings.embedQuery(doc.pageContent))
        );

        await collection.add({
            ids: docs.map((d) => String(d.metadata.id!)),
            documents: docs.map((d) => d.pageContent),
            metadatas: docs.map((d) => d.metadata),
            embeddings: vectors,
        });

        console.log("Documents inserted.");
        return { success: true };
    } catch (error) {
        return error;
    }
}

export { initializeVectorStore, ingestDocuments }