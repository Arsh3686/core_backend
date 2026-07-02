import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { embeddings } from "config/ai_config.js";

const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
});

const index = pinecone.index(process.env.PINECONE_INDEX!);

const vectorStore = new PineconeStore(
    embeddings,
    {
        pineconeIndex: index,
    }
);

export { pinecone, vectorStore, index as pinecone_index }