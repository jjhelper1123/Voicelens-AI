/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnalysisResult } from '../types';

export async function analyzeImage(base64Image: string, mode: 'ocr' | 'explain', context?: string, retries = 2): Promise<AnalysisResult> {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64Image, mode, context }),
    });

    if (!response.ok) {
      const err = await response.json();
      
      // If we have retries left and it's a 503 or 429, wait and retry
      if (retries > 0 && (response.status === 503 || response.status === 429 || err.error?.includes('overloaded') || err.error?.includes('busy'))) {
        console.log(`Retrying analysis... (${retries} left)`);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s
        return analyzeImage(base64Image, mode, context, retries - 1);
      }
      
      throw new Error(err.error || 'Failed to analyze image');
    }

    const data = await response.json();
    return {
      text: data.text,
      timestamp: Date.now(),
    };
  } catch (error: any) {
    if (retries > 0 && error.message?.includes('timeout')) {
      return analyzeImage(base64Image, mode, context, retries - 1);
    }
    throw error;
  }
}
