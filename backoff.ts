export async function exponentialBackoff<T>(fn: () => Promise<T>, retries: number = 10, delay: number = 20000): Promise<T> {
    for (let i = 0; i < retries; i++) {
      try {
        return await fn(); // Try executing the function
      } catch (error) {
        if (i === retries - 1) 
            throw error; // If max retries reached, throw the error
        
        // Calculate and wait for exponential delay
        const waitTime = delay * Math.pow(3, i);
        //console.log(`Waiting for ${waitTime}ms before retrying...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
    throw new Error("Exponential backoff failed"); // Should never reach here due to throw in catch block
  }