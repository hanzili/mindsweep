import { json } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import { processWithNebiusStudio } from "~/services/nebiusService";
import type { ClarifiedResult } from "~/components/ResultsScreen";

/**
 * This is a server-side API route that processes brain dump inputs
 * and returns a structured GTD-formatted result using Nebius Studio.
 */
export async function action({ request }: ActionFunctionArgs) {
  // Get the input text from the request
  const formData = await request.formData();
  const inputText = formData.get("input");

  // Simple validation
  if (typeof inputText !== "string" || !inputText.trim()) {
    return json({ error: "Input text is required" }, { status: 400 });
  }

  try {
    // Try using the Nebius Studio API first
    try {
      console.log("Attempting to use Nebius Studio API...");
      const nebiusResponse = await processWithNebiusStudio(inputText);
      
      if (nebiusResponse.success && nebiusResponse.result) {
        console.log("Nebius API processing successful");
        return json({ success: true, result: nebiusResponse.result });
      } else {
        console.warn("Nebius API processing failed, falling back to local processing:", nebiusResponse.error);
        throw new Error(nebiusResponse.error || "Unknown Nebius error");
      }
    } catch (nebiusError) {
      // If Nebius fails, use local processing as fallback
      console.log("Using local processing as fallback due to error:", nebiusError);
      console.log("Starting local rule-based processing of input...");
      const result = processInput(inputText);
      return json({ success: true, result, usedFallback: true });
    }
  } catch (error) {
    console.error("Error processing brain dump:", error);
    return json(
      { error: "Failed to process your input. Please try again." },
      { status: 500 }
    );
  }
}

// Simple rule-based classification system
// Used when Nebius Studio is not available
function processInput(input: string): ClarifiedResult {
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
    
    // Very basic classification heuristics - should be LLM-based in production
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
  
  // Ensure we have at least one item in each category for a better user experience
  if (result.next_actions.length === 0) result.next_actions.push("Review your brain dump and identify immediate next actions");
  if (result.projects.length === 0) result.projects.push("Consider organizing your tasks into projects for better management");
  if (result.someday_maybe.length === 0) result.someday_maybe.push("Think about future possibilities that aren't urgent right now");
  
  console.log("Local processing complete, identified items:", {
    nextActions: result.next_actions.length,
    projects: result.projects.length,
    somedayMaybe: result.someday_maybe.length,
    reflections: result.reflections.length,
    questions: result.questions.length,
    references: result.references.length
  });

  return result;
} 