import axios from 'axios';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { text, source, target } = req.body;

    if (!text || !source || !target) {
        return res.status(400).json({ error: 'Missing parameters' });
    }

    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;
        const response = await axios.get(url);

        if (response.data && response.data[0]) {
            const translatedText = response.data[0].map(item => item[0]).join("");
            res.status(200).json({ translatedText });
        } else {
            res.status(500).json({ error: 'Translation failed upstream' });
        }
    } catch (error) {
        console.error('Translation error:', error.message);
        res.status(500).json({ error: 'Translation server error' });
    }
}
