import { type FastifyInstance } from "fastify";
import fs from "fs";
import path from "path";

// All collection JSON files live here:
// backend/collections/<collection-id>.autoflow.json
const COLLECTIONS_DIR = path.resolve(process.cwd(), "collections");

// Ensure the directory exists when the module loads
if (!fs.existsSync(COLLECTIONS_DIR)) {
  fs.mkdirSync(COLLECTIONS_DIR, { recursive: true });
}

const CollectionsRoutes = async (fastify: FastifyInstance) => {

  // ── GET /api/collections ─────────────────────────────────────────────────
  // Returns an array of all saved collections (full JSON content of each file)
  fastify.get("/", async (_req, reply) => {
    try {
      const files = fs.readdirSync(COLLECTIONS_DIR).filter(f => f.endsWith(".autoflow.json"));
      const collections = files.map(file => {
        const raw = fs.readFileSync(path.join(COLLECTIONS_DIR, file), "utf-8");
        return JSON.parse(raw);
      });
      return reply.send({ ok: true, collections });
    } catch (err) {
      fastify.log.error(err);
      return reply.status(500).send({ ok: false, message: "Failed to list collections" });
    }
  });

  // ── GET /api/collections/:id ─────────────────────────────────────────────
  // Returns a single collection by id
  fastify.get("/:id", async (req: any, reply) => {
    const filePath = path.join(COLLECTIONS_DIR, `${req.params.id}.autoflow.json`);
    if (!fs.existsSync(filePath)) {
      return reply.status(404).send({ ok: false, message: "Collection not found" });
    }
    try {
      const raw = fs.readFileSync(filePath, "utf-8");
      return reply.send({ ok: true, collection: JSON.parse(raw) });
    } catch (err) {
      fastify.log.error(err);
      return reply.status(500).send({ ok: false, message: "Failed to read collection" });
    }
  });

  // ── POST /api/collections/:id ────────────────────────────────────────────
  // Upsert (create or overwrite) a collection file.
  // Body: full Collection JSON { id, name, nodes[] }
  fastify.post("/:id", async (req: any, reply) => {
    const { id } = req.params;
    const body = req.body as Record<string, any>;

    if (!body || !Array.isArray(body.nodes)) {
      return reply.status(400).send({ ok: false, message: "Invalid collection payload — must include nodes[]" });
    }

    // Enforce that the ID in the URL matches the body
    const payload = { ...body, id };
    const filePath = path.join(COLLECTIONS_DIR, `${id}.autoflow.json`);

    try {
      fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), "utf-8");
      return reply.send({ ok: true, message: "Collection saved", filePath });
    } catch (err) {
      fastify.log.error(err);
      return reply.status(500).send({ ok: false, message: "Failed to write collection file" });
    }
  });

  // ── DELETE /api/collections/:id ──────────────────────────────────────────
  // Deletes the collection file
  fastify.delete("/:id", async (req: any, reply) => {
    const filePath = path.join(COLLECTIONS_DIR, `${req.params.id}.autoflow.json`);
    if (!fs.existsSync(filePath)) {
      return reply.status(404).send({ ok: false, message: "Collection not found" });
    }
    try {
      fs.unlinkSync(filePath);
      return reply.send({ ok: true, message: "Collection deleted" });
    } catch (err) {
      fastify.log.error(err);
      return reply.status(500).send({ ok: false, message: "Failed to delete collection" });
    }
  });
};

export default CollectionsRoutes;
