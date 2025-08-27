import { cert } from 'firebase-admin/app';
import serviceAccount from './serviceAccountKey.json'; // JSON dosyanızın yolunu doğru belirtin

export const serviceAccountKey = cert(serviceAccount as any);