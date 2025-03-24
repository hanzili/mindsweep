import { ClarifiedResult } from "~/components/ResultsScreen";

export async function processInput(input: string): Promise<ClarifiedResult> {
  try {
    // Create a FormData object to send to our API route
    const formData = new FormData();
    formData.append("input", input);

    // Make a POST request to our API route
    const response = await fetch('/api/process-braindump', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to process input");
    }

    const data = await response.json();
    return data.result as ClarifiedResult;
  } catch (error) {
    console.error("Error processing input:", error);
    throw error;
  }
}

// Fallback function in case the API is not available
// This can be useful during development or if the server is down
export async function processInputFallback(input: string): Promise<ClarifiedResult> {
  return new Promise((resolve) => {
    // Simulate API processing time
    setTimeout(() => {
      // Very simplistic categorization for demonstration purposes
      const lines = input.split(/\r?\n/).filter(line => line.trim() !== '');
      
      const result: ClarifiedResult = {
        next_actions: [],
        projects: [],
        someday_maybe: [],
        reflections: [],
        questions: [],
        references: []
      };

      for (const line of lines) {
        const trimmedLine = line.trim().replace(/^[-•*]\s*/, '');
        
        // Very basic classification heuristics - this should be AI-based in production
        if (/\?$/.test(trimmedLine)) {
          result.questions.push(trimmedLine);
        } else if (/^I feel|^I'm|feeling|emotion|sad|happy|anxious|worry|frustrat/i.test(trimmedLine)) {
          result.reflections.push(trimmedLine);
        } else if (/someday|maybe|future|could|might|consider|eventually|one day/i.test(trimmedLine)) {
          result.someday_maybe.push(trimmedLine);
        } else if (/project|create|develop|build|establish|implement|plan/i.test(trimmedLine)) {
          result.projects.push(trimmedLine);
        } else if (/need to|should|have to|must|important to|call|email|schedule|book|buy|find|check/i.test(trimmedLine)) {
          result.next_actions.push(trimmedLine);
        } else {
          // Default to reference material
          result.references.push(trimmedLine);
        }
      }

      resolve(result);
    }, 1500); // Simulate processing delay
  });
} 