import express from 'express';
import cors from 'cors';
import { MasterAgent } from './agents/MasterAgent';

const app = express();
const port = process.env.PORT || 3001;
const masterAgent = new MasterAgent();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

app.post('/generate', async (req, res) => {
    try {
        console.log('Received request for /generate');
        const { text } = req.body;
        if (!text) {
            console.log('Text is missing from the query parameters');
            return res.status(400).json({ error: 'Text is required' });
        }

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();

        console.log(`Processing request for text: "${text}"`);
        const stream = masterAgent.processRequestWithProgress(text);

        for await (const chunk of stream) {
            if (chunk.type === 'progress') {
                res.write(`data: ${JSON.stringify({ progress: chunk.data })}\n\n`);
            } else if (chunk.type === 'svg') {
                res.write(`data: ${JSON.stringify({ svgChunk: chunk.data })}\n\n`);
            }
        }

        res.write('data: {"status": "done"}\n\n');
        res.end();

    } catch (error) {
        console.error('Error in /generate endpoint:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'An error occurred during SVG generation.' });
        } else {
            res.end();
        }
    }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});