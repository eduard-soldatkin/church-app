/**
 * Simple Upload Server for Church App
 * Allows operators to upload sermon files to Telegram channel
 * 
 * Usage: node upload-server.js
 * Then open: http://localhost:3001
 */

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

// Configuration
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8957414613:AAEFOs-4xAA6YUetbNHA16id5_14Ku2-JJU';
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID || '-3565559545';
const PORT = process.env.PORT || 3001;
const UPLOAD_DIR = path.join(__dirname, '../uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 2000 * 1024 * 1024, // 2GB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow audio and video files
    const allowedMimes = [
      'audio/mpeg',
      'audio/wav',
      'audio/ogg',
      'audio/mp4',
      'video/mp4',
      'video/quicktime',
      'video/x-msvideo',
      'video/x-matroska',
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only audio and video files are allowed.'));
    }
  },
});

const app = express();

// Middleware
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

/**
 * HTML Upload Page
 */
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="ru">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Загрузка проповедей - Церковь ВОЗРОЖДЕНИЕ</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
            'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
            sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }

        .container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          max-width: 500px;
          width: 100%;
          padding: 40px;
        }

        .header {
          text-align: center;
          margin-bottom: 30px;
        }

        .header h1 {
          font-size: 28px;
          color: #333;
          margin-bottom: 10px;
        }

        .header p {
          color: #666;
          font-size: 14px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        label {
          display: block;
          font-weight: 600;
          color: #333;
          margin-bottom: 8px;
          font-size: 14px;
        }

        input[type="text"],
        textarea {
          width: 100%;
          padding: 12px;
          border: 2px solid #e0e0e0;
          border-radius: 6px;
          font-size: 14px;
          font-family: inherit;
          transition: border-color 0.3s;
        }

        input[type="text"]:focus,
        textarea:focus {
          outline: none;
          border-color: #667eea;
        }

        textarea {
          resize: vertical;
          min-height: 80px;
        }

        .file-input-wrapper {
          position: relative;
          overflow: hidden;
          display: inline-block;
          width: 100%;
        }

        .file-input-wrapper input[type="file"] {
          position: absolute;
          left: -9999px;
        }

        .file-input-label {
          display: block;
          padding: 12px;
          background: #f5f5f5;
          border: 2px dashed #e0e0e0;
          border-radius: 6px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;
          font-weight: 500;
          color: #666;
        }

        .file-input-wrapper input[type="file"]:focus + .file-input-label {
          border-color: #667eea;
          background: #f0f4ff;
        }

        .file-input-wrapper:hover .file-input-label {
          border-color: #667eea;
          background: #f0f4ff;
        }

        .file-name {
          margin-top: 8px;
          font-size: 13px;
          color: #667eea;
          font-weight: 500;
        }

        .button-group {
          display: flex;
          gap: 10px;
          margin-top: 30px;
        }

        button {
          flex: 1;
          padding: 12px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-upload {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .btn-upload:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }

        .btn-upload:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-reset {
          background: #f0f0f0;
          color: #333;
        }

        .btn-reset:hover {
          background: #e0e0e0;
        }

        .status {
          margin-top: 20px;
          padding: 12px;
          border-radius: 6px;
          display: none;
          font-size: 14px;
        }

        .status.success {
          background: #e8f5e9;
          color: #2e7d32;
          display: block;
        }

        .status.error {
          background: #ffebee;
          color: #c62828;
          display: block;
        }

        .status.loading {
          background: #e3f2fd;
          color: #1565c0;
          display: block;
        }

        .progress {
          margin-top: 10px;
          height: 4px;
          background: #e0e0e0;
          border-radius: 2px;
          overflow: hidden;
          display: none;
        }

        .progress.active {
          display: block;
        }

        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          width: 0%;
          transition: width 0.3s;
        }

        .info-box {
          background: #f5f5f5;
          border-left: 4px solid #667eea;
          padding: 12px;
          border-radius: 4px;
          margin-top: 20px;
          font-size: 13px;
          color: #666;
          line-height: 1.6;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎙️ Загрузка проповедей</h1>
          <p>Церковь ВОЗРОЖДЕНИЕ</p>
        </div>

        <form id="uploadForm">
          <div class="form-group">
            <label for="title">Название проповеди *</label>
            <input 
              type="text" 
              id="title" 
              name="title" 
              placeholder="Например: Вера и надежда"
              required
            >
          </div>

          <div class="form-group">
            <label for="description">Описание (опционально)</label>
            <textarea 
              id="description" 
              name="description" 
              placeholder="Добавьте описание проповеди..."
            ></textarea>
          </div>

          <div class="form-group">
            <label for="file">Выберите файл (аудио или видео) *</label>
            <div class="file-input-wrapper">
              <input 
                type="file" 
                id="file" 
                name="file" 
                accept="audio/*,video/*"
                required
              >
              <label for="file" class="file-input-label">
                📁 Нажмите или перетащите файл сюда
              </label>
            </div>
            <div class="file-name" id="fileName"></div>
          </div>

          <div class="button-group">
            <button type="submit" class="btn-upload" id="submitBtn">
              Загрузить
            </button>
            <button type="reset" class="btn-reset">
              Очистить
            </button>
          </div>

          <div class="progress" id="progress">
            <div class="progress-bar" id="progressBar"></div>
          </div>

          <div class="status" id="status"></div>
        </form>

        <div class="info-box">
          <strong>ℹ️ Информация:</strong><br>
          • Максимальный размер файла: 2 ГБ<br>
          • Поддерживаемые форматы: MP3, WAV, OGG, MP4, MOV, AVI<br>
          • После загрузки проповедь появится в приложении за несколько секунд
        </div>
      </div>

      <script>
        const form = document.getElementById('uploadForm');
        const fileInput = document.getElementById('file');
        const fileNameDisplay = document.getElementById('fileName');
        const statusDiv = document.getElementById('status');
        const progressDiv = document.getElementById('progress');
        const progressBar = document.getElementById('progressBar');
        const submitBtn = document.getElementById('submitBtn');

        // Display selected file name
        fileInput.addEventListener('change', (e) => {
          if (e.target.files.length > 0) {
            const fileName = e.target.files[0].name;
            const fileSize = (e.target.files[0].size / 1024 / 1024).toFixed(2);
            fileNameDisplay.textContent = \`✓ \${fileName} (\${fileSize} МБ)\`;
          }
        });

        // Handle form submission
        form.addEventListener('submit', async (e) => {
          e.preventDefault();

          const formData = new FormData(form);
          submitBtn.disabled = true;
          statusDiv.className = 'status loading';
          statusDiv.textContent = '⏳ Загрузка файла...';
          progressDiv.classList.add('active');

          try {
            const xhr = new XMLHttpRequest();

            xhr.upload.addEventListener('progress', (e) => {
              if (e.lengthComputable) {
                const percentComplete = (e.loaded / e.total) * 100;
                progressBar.style.width = percentComplete + '%';
              }
            });

            xhr.addEventListener('load', () => {
              if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                statusDiv.className = 'status success';
                statusDiv.textContent = '✅ ' + response.message;
                form.reset();
                fileNameDisplay.textContent = '';
                progressBar.style.width = '0%';
                setTimeout(() => progressDiv.classList.remove('active'), 1000);
              } else {
                throw new Error('Upload failed');
              }
            });

            xhr.addEventListener('error', () => {
              statusDiv.className = 'status error';
              statusDiv.textContent = '❌ Ошибка при загрузке. Проверьте интернет-соединение.';
              progressDiv.classList.remove('active');
            });

            xhr.open('POST', '/upload');
            xhr.send(formData);
          } catch (error) {
            statusDiv.className = 'status error';
            statusDiv.textContent = '❌ ' + error.message;
            progressDiv.classList.remove('active');
          } finally {
            submitBtn.disabled = false;
          }
        });

        // Drag and drop
        document.addEventListener('dragover', (e) => {
          e.preventDefault();
          e.stopPropagation();
        });

        document.addEventListener('drop', (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          if (e.dataTransfer.files.length > 0) {
            fileInput.files = e.dataTransfer.files;
            const event = new Event('change', { bubbles: true });
            fileInput.dispatchEvent(event);
          }
        });
      </script>
    </body>
    </html>
  `);
});

/**
 * Upload endpoint
 */
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const title = req.body.title || 'Проповедь';
    const description = req.body.description || '';
    const filePath = req.file.path;

    // Prepare caption for Telegram
    let caption = title;
    if (description) {
      caption += '\n\n' + description;
    }

    // Upload to Telegram
    const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`;

    const formData = new FormData();
    formData.append('chat_id', CHANNEL_ID);
    formData.append('document', fs.createReadStream(filePath));
    formData.append('caption', caption);
    formData.append('parse_mode', 'HTML');

    const response = await axios.post(telegramUrl, formData, {
      headers: formData.getHeaders(),
    });

    if (response.data.ok) {
      // Clean up uploaded file
      fs.unlinkSync(filePath);

      res.json({
        success: true,
        message: 'Проповедь успешно загружена! Она появится в приложении через несколько секунд.',
      });
    } else {
      throw new Error(response.data.description || 'Telegram API error');
    }
  } catch (error) {
    console.error('Upload error:', error);

    // Clean up file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      error: 'Upload failed',
      message: error.message || 'An error occurred during upload',
    });
  }
});

/**
 * Health check
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Upload server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║     🎙️  Sermon Upload Server - Церковь ВОЗРОЖДЕНИЕ       ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║  Server is running at: http://localhost:${PORT}              ║
║                                                            ║
║  Open this URL in your browser to upload sermons:         ║
║  👉 http://localhost:${PORT}                                 ║
║                                                            ║
║  Configuration:                                            ║
║  • Bot Token: ${BOT_TOKEN.substring(0, 20)}...               ║
║  • Channel ID: ${CHANNEL_ID}                              ║
║  • Max File Size: 2 GB                                     ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});
