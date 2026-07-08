import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { QuizAnswers, PartnerAnswers } from '../types';

// Firebase configuration from firebase-applet-config.json
const firebaseConfig = {
  apiKey: "AIzaSyAn7X0VYn_9Ueyo0KW6GwaRZzrtYu_GE8I",
  authDomain: "gen-lang-client-0458184706.firebaseapp.com",
  projectId: "gen-lang-client-0458184706",
  storageBucket: "gen-lang-client-0458184706.firebasestorage.app",
  messagingSenderId: "494408761310",
  appId: "1:494408761310:web:ea63c7179923963aea274f"
};

// Custom Firestore Database ID
const firestoreDatabaseId = "ai-studio-igreensimulaodee-37f74af3-a46b-4dba-a0b4-1c5b5bbb021b";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with the specific custom database ID
export const db = getFirestore(app, firestoreDatabaseId);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path
  };
  console.error('[FIREBASE] Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Saves a lead's quiz answers to Firestore.
 */
export async function saveLeadToFirestore(answers: QuizAnswers): Promise<string> {
  const collectionPath = 'leads';
  try {
    const docRef = await addDoc(collection(db, collectionPath), {
      nome: answers.nome,
      perfil: answers.perfil,
      consumo: answers.consumo,
      estado: answers.estado,
      imovelProprio: answers.imovelProprio,
      querEconomizar: answers.querEconomizar,
      whatsapp: answers.whatsapp,
      email: answers.email,
      type: 'customer',
      createdAt: new Date(),
    });
    console.log('[FIREBASE]: Lead saved successfully with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('[FIREBASE]: Error saving lead to Firestore:', error);
    handleFirestoreError(error, OperationType.WRITE, collectionPath);
  }
}

/**
 * Saves a partner lead's quiz answers to Firestore.
 */
export async function savePartnerToFirestore(answers: PartnerAnswers): Promise<string> {
  const collectionPath = 'leads';
  try {
    const docRef = await addDoc(collection(db, collectionPath), {
      nome: answers.nome,
      objetivo: answers.objetivo,
      dedicacao: answers.dedicacao,
      metaRenda: answers.metaRenda,
      experienciaVendas: answers.experienciaVendas,
      investimento: answers.investimento,
      whatsapp: answers.whatsapp,
      email: answers.email,
      type: 'partner',
      createdAt: new Date(),
    });
    console.log('[FIREBASE]: Partner lead saved successfully with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('[FIREBASE]: Error saving partner lead to Firestore:', error);
    handleFirestoreError(error, OperationType.WRITE, collectionPath);
  }
}
