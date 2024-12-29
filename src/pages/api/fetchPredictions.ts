import type { NextApiRequest, NextApiResponse } from 'next';
import { storage } from '@/config/firebaseConfig';
import { getDownloadURL, ref } from 'firebase/storage';
import Papa from 'papaparse';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function fetchWithRetry(url: string, retries = MAX_RETRIES): Promise<Response> {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response;
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return fetchWithRetry(url, retries - 1);
    }
    throw error;
  }
}

interface PredictionRow {
  Date: string;
  'Predicted Close': string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('Attempting to fetch predictions from Firebase Storage');
    
    const fileRef = ref(storage, 'data/predictions.csv');
    console.log('Storage reference created for:', fileRef.fullPath);
    
    let url;
    try {
      url = await getDownloadURL(fileRef);
      console.log('Successfully obtained download URL');
    } catch (error: any) {
      console.error('Firebase Storage error:', {
        code: error.code,
        message: error.message,
        fullPath: fileRef.fullPath
      });
      throw new Error(`Failed to get download URL: ${error.message}`);
    }
    
    try {
      const testResponse = await fetch(url);
      if (!testResponse.ok) {
        throw new Error(`URL test failed with status: ${testResponse.status}`);
      }
      console.log('URL test successful - file is accessible');
    } catch (error) {
      console.error('URL test failed:', error);
      throw error;
    }

    const response = await fetchWithRetry(url);
    const csvText = await response.text();
    
    const parsed = Papa.parse<PredictionRow>(csvText, {
      header: true,
      skipEmptyLines: true,
      transform: (value, field) => {
        if (field === 'Predicted Close') {
          return value.replace(/[$,]/g, '');
        }
        return value;
      }
    });

    if (!parsed.data || parsed.data.length === 0) {
      throw new Error('No data found in predictions file');
    }

    const graphData = parsed.data
    .slice(0, 30)
    .reverse()
    .map(row => {
      try {
        return {
          x: new Date(row.Date).getTime(),
          y: parseFloat(row['Predicted Close'])
        };
      } catch (error) {
        console.error('Error parsing row:', row, error);
        return null;
      }
    })
    .filter(Boolean);

    const predictions = parsed.data.slice(0, 7).map(row => ({
      date: row.Date,
      price: parseFloat(row['Predicted Close']).toFixed(2)
    }));

    // Cache the response for 5 minutes
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    
    res.status(200).json({
      predictions,
      graphData,
      lastUpdated: new Date().toISOString()
    });
  } catch (error: Error | unknown) {
    console.error('Error fetching predictions:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch predictions' 
    });
  }
}