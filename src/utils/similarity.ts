
export function cosineSimilarity(textA: string, textB: string): number {
    const wordsA = textA.split(/\s+/);
    const wordsB = textB.split(/\s+/);
    
    const uniqueWords = Array.from(new Set([...wordsA, ...wordsB]));
    
    const vectorA = uniqueWords.map(word => wordsA.filter(w => w === word).length);
    const vectorB = uniqueWords.map(word => wordsB.filter(w => w === word).length);
    
    const dotProduct = vectorA.reduce((sum, val, idx) => sum + val * vectorB[idx], 0);
    const magnitudeA = Math.sqrt(vectorA.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(vectorB.reduce((sum, val) => sum + val * val, 0));
    
    if (magnitudeA === 0 || magnitudeB === 0) return 0; // Para evitar la división por cero
    return dotProduct / (magnitudeA * magnitudeB);
}
