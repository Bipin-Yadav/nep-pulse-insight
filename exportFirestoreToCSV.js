// exportFirestoreToCSV.js

import fs from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBLwAFUx1AZp25bokXM6VcAsDOU2f4U840",
  authDomain: "nep-survey-89184.firebaseapp.com",
  projectId: "nep-survey-89184",
  storageBucket: "nep-survey-89184.firebasestorage.app",
  messagingSenderId: "713078794899",
  appId: "1:713078794899:web:8990bb7e6bbb6eadcffb66"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// The name of your collection in Firestore
const collectionName = 'survey_responses';

// Helper function to convert JSON array to CSV
function jsonToCSV(items) {
  if (!items || items.length === 0) return '';

  const headers = Object.keys(items[0]);
  const csv = [
    headers.join(','), // header row first
    ...items.map(row =>
      headers.map(fieldName => `"${row[fieldName] || ''}"`).join(',')
    )
  ].join('\n');

  return csv;
}

async function exportToCSV() {
  try {
    const snapshot = await getDocs(collection(db, collectionName));
    const data = snapshot.docs.map(doc => doc.data());

    if (data.length === 0) {
      console.log('No data found in the collection.');
      return;
    }

    const csv = jsonToCSV(data);
    fs.writeFileSync('survey_responses.csv', csv);
    console.log('CSV export successful! File: survey_responses.csv');
  } catch (err) {
    console.error('Error exporting data:', err);
  }
}

// Run the export
exportToCSV();
