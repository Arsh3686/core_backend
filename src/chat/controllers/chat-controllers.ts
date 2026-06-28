import type { FastifyReply, FastifyRequest } from "fastify";
import type { CHAT_WITH_USER_SCHEMA_TYPE } from "../types";
import { getAIResponses, loadContext, saveContext } from "@core/core_services/ai";
import { embeddings } from "config/ai_config";
import { getCollection } from "rag/chroma";

const CHAT_WITH_USER = async (request: FastifyRequest<CHAT_WITH_USER_SCHEMA_TYPE>, reply: FastifyReply) => {
  {
    const { message } = request.body as { message: string };

    if (!message) {
      return reply.status(400).send({ error: 'Message is required' });
    }

    try {
      const context = await loadContext('123');
      // embed the query first
      const queryEmbedding = await embeddings.embedQuery(
        "What's your qualification?"
      );

      // fetch collection details
      const collection = await getCollection('portfolio')

      // similarity search
      const results = await collection.query({
        queryEmbeddings: [queryEmbedding],
        nResults: 3
      })
      console.log(results.documents);

      const aiReply = await getAIResponses(message, results?.documents?.[0]?.join("\n\n") || '', context);

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