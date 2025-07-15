const { PrismaClient } = require('@prisma/client');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const prisma = new PrismaClient();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

exports.recommendRecipes = async (req, res) => {
    try {
        const { prompt } = req.body;

        const publicRecipes = await prisma.recipe.findMany({
            where: {
                Privacy_settings: 'PUBLIC',
                Approval_Status: 'APPROVED',
            },
            select: {
                id: true,
                name: true,
                preparation_time: true,
                ingredients: {
                    select: {
                        ingredient: { select: { name: true } },
                        quantity: true,
                        measurement_unit: true
                    }
                },
                recipeTypes: {
                    select: {
                        filter: { select: { Name: true } }
                    }
                }
            }
        });

        const simplified = publicRecipes.map(r => ({
            id: r.id,
            title: r.name,
            time: r.preparation_time,
            ingredients: r.ingredients.map(i => `${i.quantity} ${i.measurement_unit} ${i.ingredient.name}`),
            tags: r.recipeTypes.map(t => t.filter.Name)
        }));

        const sysPrompt = `
Eres un chef asistente. Un usuario te dará un mensaje con ingredientes, tiempo máximo para cocinar y estilo de comida. 
Usa esa información para elegir hasta 5 recetas de esta lista (en JSON) que encajen mejor. Responde en formato JSON:

{
  "recommendations": [
    { "id": <id>, "title": "...", "reason": "..." }
  ]
}
`;

        const userPrompt = `
Usuario dice:
${prompt}

Recetas disponibles:
${JSON.stringify(simplified, null, 2)}
`;

        const result = await model.generateContent([sysPrompt, userPrompt]);
        const text = await result.response.text();
        const cleanText = text.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleanText);
        res.json(parsed);

    } catch (err) {
        console.error('Chatbot error:', err);
        res.status(500).json({ error: 'Error generando recomendaciones.' });
    }
};
