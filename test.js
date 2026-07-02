import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

// embeddings
const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: 'AQ.Ab8RN6LntjgQ6Mcdo_Ur-J2P8PoMpkH5Uc6TN6XiTcc3aCQBbQ',
    model: "gemini-embedding-001",
});

const embedding = async () => {
    try {
        const data = await embeddings.embedQuery("hey")
        console.log("Length", data.length);
        console.log("Vector", data);

    } catch (error) {
        console.log("Error", error.message);

    }
}

embedding();


