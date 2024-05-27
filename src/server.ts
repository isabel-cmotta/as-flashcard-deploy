import express, { Request, Response } from 'express';
import admin from 'firebase-admin';
import path from 'path';
import dotenv from 'dotenv';

// Carrega variáveis de ambiente do arquivo .env
dotenv.config();

// Validação das variáveis de ambiente
const requiredEnvVariables = [
  'FIREBASE_TYPE',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_PRIVATE_KEY_ID',
  'FIREBASE_PRIVATE_KEY',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_CLIENT_ID',
  'FIREBASE_DATABASE_URL'
];

requiredEnvVariables.forEach(variable => {
  if (!process.env[variable]) {
    throw new Error(`Missing required environment variable: ${variable}`);
  }
});

const serviceAccount = {
  type: process.env.FIREBASE_TYPE as string,
  project_id: process.env.FIREBASE_PROJECT_ID as string,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID as string,
  private_key: (process.env.FIREBASE_PRIVATE_KEY as string).replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL as string,
  client_id: process.env.FIREBASE_CLIENT_ID as string,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const db = admin.firestore();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Servindo arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req: Request, res: Response) => {
  try {
    const snapshot = await db.collection('flashcard-admin').get();
    const data = snapshot.docs.map(doc => doc.data());
    res.json(data);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send('Error getting documents: ' + error.message);
    } else {
      res.status(500).send('Unknown error occurred');
    }
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor Node.js rodando na porta ${PORT}`);
});


//ts-node src/server.ts