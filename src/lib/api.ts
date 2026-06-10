/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnalysisResult } from '../types';

export async function analyzeImage(base64Image: string, mode: 'ocr' | 'explain', context?: string, retries = 3): Promise<AnalysisResult> {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64Image, mode, context }),
    });

    if (!response.ok) {
      let errMsg = 'Failed to analyze image';
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        try {
          const err = await response.json();
          errMsg = err.error || errMsg;
        } catch (e) {
          // ignore parsing error and keep default fallback
        }
      } else {
        // Not a JSON response (like an HTML/Text error page). Gracefully evaluate.
        if (response.status === 503) {
          errMsg = "The reading assistant is currently experiencing high demand. Please try again in 30 seconds.";
        } else if (response.status === 429) {
          errMsg = "Service is currently very busy (Quota reached). Please wait a moment and try again.";
        } else {
          errMsg = `Server error (${response.status})`;
        }
      }

      const isRetriable = response.status === 503 || 
                          response.status === 429 || 
                          errMsg.toLowerCase().includes('demand') || 
                          errMsg.toLowerCase().includes('overloaded') || 
                          errMsg.toLowerCase().includes('busy') || 
                          errMsg.toLowerCase().includes('quota') ||
                          errMsg.toLowerCase().includes('unavailable') ||
                          errMsg.toLowerCase().includes('temporary');

      if (retries > 0 && isRetriable) {
        const waitTime = (4 - retries) * 2000; // progressive wait: 2s, 4s, 6s
        console.log(`Retrying analysis due to service status/message. Retries left: ${retries}. Waiting ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        return analyzeImage(base64Image, mode, context, retries - 1);
      }
      
      throw new Error(errMsg);
    }

    try {
      const data = await response.json();
      return {
        text: data.text,
        timestamp: Date.now(),
      };
    } catch (parseError) {
      throw new Error("Received an invalid response format from the server. Please try again.");
    }
  } catch (error: any) {
    const errorStr = (error.message || '').toLowerCase();
    const isNetworkOrParsingError = errorStr.includes('timeout') || 
                                    errorStr.includes('fetch') || 
                                    errorStr.includes('network') ||
                                    errorStr.includes('unexpected token') ||
                                    error instanceof SyntaxError;

    if (retries > 0 && isNetworkOrParsingError) {
      const waitTime = (4 - retries) * 2000;
      console.log(`Retrying analysis after network/parsing error. Retries left: ${retries}. Waiting ${waitTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return analyzeImage(base64Image, mode, context, retries - 1);
    }
    throw error;
  }
}
