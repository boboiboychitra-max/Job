import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Increase body parser limits to safely receive base64 PDF resume uploads
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // POST endpoint to handle candidate job applications
  app.post('/api/apply', async (req, res) => {
    const { name, email, coverLetter, jobTitle, companyName, fileName, fileDataUrl } = req.body;

    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;

    // Gracefully handle missing configuration keys without crashing the server
    if (!telegramBotToken || !telegramChatId) {
      console.warn('⚠️ Telegram Bot Configuration Missing: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID are not set.');
      return res.status(200).json({
        success: true,
        warning: 'Telegram environment variables are not configured in settings. Resume submitted locally, but notification not sent.',
      });
    }

    try {
      // 1. Prepare HTML-formatted notification text
      const escapeHTML = (str: string = '') => {
        return str
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');
      };

      const htmlMessage = `
<b>🔔 New Job Application Received!</b>

💼 <b>Position:</b> ${escapeHTML(jobTitle)}
🏢 <b>Company:</b> ${escapeHTML(companyName)}

👤 <b>Candidate Name:</b> ${escapeHTML(name)}
📧 <b>Candidate Email:</b> <a href="mailto:${escapeHTML(email)}">${escapeHTML(email)}</a>

📝 <b>Cover Pitch Letter:</b>
${escapeHTML(coverLetter || 'No cover letter provided.')}
`;

      // 2. Transmit details to the Telegram Bot via sendMessage
      const sendMessageUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
      const textResponse = await fetch(sendMessageUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: htmlMessage,
          parse_mode: 'HTML',
        }),
      });

      if (!textResponse.ok) {
        const errorDetail = await textResponse.text();
        console.error('Telegram sendMessage API error detail:', errorDetail);
        throw new Error(`Telegram server error during notification dispatch: ${textResponse.status}`);
      }

      // 3. Optional resume transmission via sendDocument
      if (fileDataUrl && fileName) {
        const matches = fileDataUrl.match(/^data:(.+);base64,(.+)$/);
        if (matches) {
          const mimeType = matches[1];
          const base64Data = matches[2];
          const buffer = Buffer.from(base64Data, 'base64');

          // Build dynamic Form data with native Blob & File components
          const fileBlob = new Blob([buffer], { type: mimeType });
          const fileObject = new File([fileBlob], fileName, { type: mimeType });

          const formData = new FormData();
          formData.append('chat_id', telegramChatId);
          formData.append('document', fileObject);
          formData.append('caption', `📄 Resume attachment for ${name} (${jobTitle})`);

          const sendDocUrl = `https://api.telegram.org/bot${telegramBotToken}/sendDocument`;
          const fileResponse = await fetch(sendDocUrl, {
            method: 'POST',
            body: formData,
          });

          if (!fileResponse.ok) {
            const errorDetail = await fileResponse.text();
            console.error('Telegram sendDocument API error detail:', errorDetail);
          }
        }
      }

      return res.status(200).json({
        success: true,
        message: 'Application processed and Telegram notifications dispatched successfully.',
      });
    } catch (err: any) {
      console.error('Error in application pipeline:', err);
      return res.status(500).json({
        success: false,
        error: err.message || 'An internal error occurred during notification processing.',
      });
    }
  });

  // Vite middleware integration for asset serving & HMR development proxying
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Full-stack application runner loaded. Access on http://localhost:${PORT}`);
  });
}

startServer();
