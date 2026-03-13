const db = require('../config/db');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.chatWithSalesAI = async (req, res) => {
  const { message } = req.body;

  try {
    // 1. Fetch context (Top products & Total Revenue) to give to AI
    const [products] = await db.query('SELECT product_name, stock_quantity, price FROM products');
    const [revenue] = await db.query('SELECT SUM(total_amount) as total FROM sales');

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = `
      You are a Sales Assistant for Sankalpa's Sales System. 
      Current Data: 
      - Total Revenue: ₹${revenue[0].total || 0}
      - Products in Stock: ${JSON.stringify(products)}
      
      User Question: ${message}
      Answer concisely based on the data provided.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json({ reply: response.text() });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "AI failed to process message" });
  }
};