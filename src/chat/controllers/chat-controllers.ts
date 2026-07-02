import type { FastifyReply, FastifyRequest } from "fastify";
import type { CHAT_WITH_USER_SCHEMA_TYPE } from "../types.js";
import { getAIResponses, loadContext, saveContext } from "@core/core_services/ai.js";
import { embeddings } from "config/ai_config.js";
import { getCollection } from "rag/chroma.js";
import { pinecone_index, vectorStore } from "rag/pinecone.js";

const CHAT_WITH_USER = async (request: FastifyRequest<CHAT_WITH_USER_SCHEMA_TYPE>, reply: FastifyReply) => {
  {
    const { message } = request.body as { message: string };

    if (!message) {
      return reply.status(400).send({ error: 'Message is required' });
    }

    try {
      const context = await loadContext('123');
      // embed the query first
      // const queryEmbedding = await embeddings.embedQuery(
      //   message
      // );
      // vectorStore.similaritySearch(queryEmbedding)
      // fetch collection details
      // const collection = await getCollection('portfolio')

      // similarity search
      // const results = await pinecone_index.query({
      //   vector: queryEmbedding,
      //   topK: 10,
      //   includeValues: true,
      //   includeMetadata: true
      // })
      // console.log(results.matches, { depth: null });
      // const stats = await pinecone_index.describeIndexStats();

      const results = await vectorStore.similaritySearch(message, 100);
      console.log(results)
      const aiReply = await getAIResponses(message, results?.map(doc => doc.pageContent)?.join("\n\n") || '', context);

      context.push({ role: "human", content: message }, { role: "ai", content: aiReply })
      saveContext('123', context);

      return {
        reply: aiReply,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: 'Jarvis is currently unavailable' });
    }
  }
};

// export async function ingestDocuments(docs: any[]) {
//   const collection = await getCollection();

//   const vectors = await Promise.all(
//     docs.map((doc) => embeddings.embedQuery(doc.text))
//   );

//   await collection.add({
//     ids: docs.map((d) => d.id),
//     documents: docs.map((d) => d.text),
//     metadatas: docs.map((d) => d.metadata),
//     embeddings: vectors,
//   });

//   console.log("Documents inserted.");
// }


export { CHAT_WITH_USER };