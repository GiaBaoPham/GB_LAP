const express = require("express");
const axios = require("axios");
const router = express.Router();

const COZE_API_URL = "https://api.coze.com/open_api/v2/chat";
const API_KEY = process.env.COZE_API_KEY || "pat_rNzWaoL6vNTFG0PHLRqaQVtO7Zs8ClOD2tzZHSQc9W7oebgKbrjOFq2edL225sKd"; 
const BOT_ID = "7471465917801676818"; 

router.post("/", async (req, res) => {
    try {
        const { userMessage } = req.body;

        const payload = {
            bot_id: BOT_ID,
            user: { user_id: "guest" },
            query: { text: userMessage }
        };

        const response = await axios.post(COZE_API_URL, payload, {
            headers: { 
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        res.json({ botReply: response.data?.data?.messages?.[0]?.text || "Không có phản hồi từ AI." });
    } catch (error) {
        console.error("Lỗi khi gọi Coze API:", error.response?.data || error.message);
        res.status(500).json({ error: "Lỗi khi kết nối chatbot." });
    }
});

module.exports = router;