import { ClarifiedResult } from "~/components/ResultsScreen";

// Nebius Studio API settings
const NEBIUS_STUDIO_API_URL = "https://api.studio.nebius.com/v1/chat/completions";
const NEBIUS_API_KEY = process.env.NEBIUS_API_KEY || "";

interface NebiusStudioResponse {
  success: boolean;
  result?: ClarifiedResult;
  error?: string;
}

/**
 * Process a brain dump input through Nebius Studio LLM
 * 
 * @param input The user's raw brain dump text input
 * @param apiKey Nebius Studio API key (defaults to the configured key)
 * @returns Processed GTD categorization
 */
export async function processWithNebiusStudio(input: string, apiKey: string = NEBIUS_API_KEY): Promise<NebiusStudioResponse> {
  try {
    const prompt = generatePrompt(input);
    
    console.log("Making request to Nebius API at:", NEBIUS_STUDIO_API_URL);
    
    const response = await fetch(NEBIUS_STUDIO_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-ai/DeepSeek-R1-fast",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 8192
      })
    });

    // Log the response status
    console.log("Nebius API response status:", response.status, response.statusText);
    
    const responseText = await response.text();
    console.log("Nebius API response body:", responseText.substring(0, 500) + "...");
    
    if (!response.ok) {
      try {
        const errorData = JSON.parse(responseText);
        throw new Error(errorData.error?.message || `Failed to process with Nebius Studio: ${response.status} ${response.statusText}`);
      } catch (parseError) {
        throw new Error(`Failed to process with Nebius Studio: ${response.status} ${response.statusText}. Response: ${responseText.substring(0, 200)}...`);
      }
    }

    // Parse the response text to JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Error parsing Nebius API response:", parseError);
      throw new Error(`Invalid JSON response from Nebius API: ${responseText.substring(0, 200)}...`);
    }
    
    console.log("Parsed Nebius API response:", JSON.stringify(data, null, 2).substring(0, 500) + "...");
    
    // Extract the response content based on the OpenAI format
    let jsonResponseText;
    
    if (data.choices && data.choices.length > 0 && data.choices[0].message) {
      jsonResponseText = data.choices[0].message.content;
    } else {
      console.error("Unexpected Nebius API response structure:", data);
      throw new Error("Unexpected response structure from Nebius API");
    }
    
    const result = extractJsonFromText(jsonResponseText);
    
    return { 
      success: true, 
      result: result as ClarifiedResult
    };
  } catch (error) {
    console.error("Error processing with Nebius Studio:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

/**
 * Generate the prompt for the LLM
 */
function generatePrompt(input: string): string {
  return `You are a GTD (Getting Things Done) productivity assistant. Your task is to transform a messy brain dump—containing raw thoughts, emotional reflections, tasks, and ideas—into a clean, structured JSON output following GTD principles.

Please parse the input into the following JSON structure:

{
  "next_actions": [ /* Immediate, actionable tasks (single-step tasks) */ ],
  "projects": [ /* Multi-step or grouped tasks requiring planning */ ],
  "someday_maybe": [ /* Ideas or goals to consider later */ ],
  "reflections": [ /* Personal thoughts, feelings, or mindset insights */ ],
  "questions": [ /* Uncertainties or open questions */ ],
  "references": [ /* Informational notes that are not directly actionable */ ]
}

Guidelines:
1. Analyze the entire input and extract items into the appropriate categories.
2. Preserve the original tone where appropriate, but ensure each item is expressed clearly and concisely.
3. Avoid duplicating content between categories.
4. Output only valid JSON and include every element from the input.

Below is an example to illustrate:

--- Example Input ---
- I'm such a loser I make zero money this semester while doing nothing
    - Still did meaningful things: meet Sean, made the carpool miniprogram, go to symposium, start reading books, go back visit family, start a redbook account
    - Already 1/3 of the year pass, time is not waiting for me
    - Need to break out of my comfort zone more, do different things (like what?)
- I want to learn to make drink, they are too expensive and I can't stop buying (milk tea, flavored coffee…)
    - Hard to stop drinking but can have some control
    - Even I buy ingredients it is hard to figure out the best ratio and this process would just disappoint me
    - **Need to figure out a good frequency to buy and how to control myself**
- Message back Sean, should keep on contact
    - Better meet in person and share thoughts
    - **Schedule a time to meet in person and prepare the speech**
- I want to submit sth for nebius but still want it a good idea (don't write useless code)
    - Through research I find it hard to make an all-in-one gtd tool
    - Some niche tool that follows GTD practice and gives good UX would be good (ex: an audio memo tool) and launch on App Store
    - **Find an idea that follows GTD practice and has customers and figure out the marketing strategy and distribution channel**
- Clean my house
    - **just go and clean**
- Vaccinate harris
    - **Go to vet and ask how it works**
- Vaccinate myself
    - Check my last vaccine time
    - Go and book it
- Make sure to send rent → need an automated solution for this
    - Wait for email
- Learn more about crypto
    - Should really start to trade
    - **Ask dafu about how to start investing in crypto**
- Cut my time on phone and doom scrolling
    - Do some research or read some book about phone indulgence
- I should go to school more often even if I'm just sitting there
    - **Add all my classes and office hours to calendar**
    - **Explore having a fixed schedule (get up, go to school, sleep at a regular time) and see if that works**
- I'm worrying about COMP461
    - Try to make some progress myself
    - **Need to plan out the work and send message in group chat**
    - **Fix cursor**
- The entrepreneurship in practice course
    - **Need to go to office hours and think about what to say with the instructor; be transparent about my struggles and commitment**
- The marketing course
    - **Check the group chat, see what is assigned, and communicate with teammates**
    - **Go to class, say hi, and introduce myself**
- Philosophy course
    - **Check the deadline and do assignment**
    - **Collect all final exam times**
- I need to keep myself lean and healthy, I'm gaining face fat
    - Need to exercise every day, but how to make sure I do it daily?
- I want to read more books
    - **Read books when going to bed and upon waking up**
- I want to contact my grandma and send meaningful sharings with her and also call her frequently
    - **Set up a goal each week and do a brief update every night before bed**
- Keep on contact with santosh
    - **Schedule a time to meetup**
- Keep on contact with Antony
    - **Schedule a time to meetup**
- I need more social, I want to connect with Montreal entrepreneurs and make international friends
    - Ideas: **ask entrepreneurs (santosh, Antony, Daniel) how they meet people**
    - People to connect with more: Lawrence, chris(?), simon(?)
    - Attend more Luma events
- I want to keep in contact with my existing friend
    - What kind of contact?
        - For my entrepreneurial network: Post on Substack about my journey (how reading books, symposium experience, and GTD implementation have helped me)
        - Share on social media (X, LinkedIn, WeChat, Instagram)
        - For old friends: offer support, reach out often, and share interesting life updates
- My current rent is high and the continual rental is about to start; I need to check
    - **Check the rental renewal email**
- Since I changed my credit card, I may need to redo the Virgin Plus internet subscription
    - **Check Virgin Plus**
- Club thing hack4impact
    - **Fix the PR problem**
- I want to learn to do social sports like badminton
    - **Message Vivian and ask what to prepare, be sincere**
- I want to start a business that makes progress (can be a startup for investment or a cash-flow niche business)
- **check the program santosh sent me**
- I still want to go back China during summer
    - Check the time, ask Autodesk, check flight, and figure out what to do when back
- Need to finish CAQ asap
    - **Work on the CAQ problem**
    - **Explore what's next and timeline**
- I want to listen to the music here so I can sing along when clubbing
    - **Try to find it, maybe ask on Reddit**
- Redbook content should go one direction and be more niche—not just posting anything
    - Think of a direction: genuine sharing, follower growth, or monetization?
- Indie game with phoebe
    - **Team meeting at 9:30pm Monday to explore technical aspects, split tasks, and set a timeline**
- I need a good online presence for myself
    - Purpose: share genuine thoughts, achievements, and connect with the entrepreneur community
- Dafu and Yuan project need pushing
    - **Need discussion and long-term planning; allocate time to strategize**
- **Message margaux**
- I'm spending too much time on Honor of Kings, which drains my energy and time
    - It's an escape, but I dislike the mental clutter it creates
- Teeth inspection
    - **Book a teeth inspection**
- I want to learn more ML knowledge
    - **Ask Lawrence, Vincent, or join an ML reading group**
    - **Add ML reading group meeting time to calendar**
- Podcast for Chinese international student
    - **Message to schedule a podcast**
    - **Explore marketing strategies and feasibility**
- Continue my French learning
    - Set up a schedule to study a French word each day

--- Example Output (JSON) ---
{
  "next_actions": [
    "Schedule a time to meet Sean in person and prepare discussion topics",
    "Check your last vaccine record and book your vaccination appointment",
    "Wait for the rental renewal email",
    "Check Virgin Plus subscription status",
    "Figure out a good buying frequency and control strategy for making drinks at home",
    "Add all your classes and office hours to your calendar",
    "Plan work for COMP461 and send a message in the group chat",
    "Fix the cursor issue",
    "Check the philosophy course deadline and complete the assignment",
    "Collect all final exam times for the philosophy course",
    "Read books before bed and upon waking",
    "Set up a weekly goal for contacting grandma and do a nightly update",
    "Schedule meetups with Santosh and Antony",
    "Ask entrepreneurs (santosh, Antony, Daniel) how they meet people",
    "Message Vivian about badminton preparations",
    "Message Margaux",
    "Check the program Santosh sent you",
    "Work on the CAQ problem",
    "Explore next steps and timeline after finishing CAQ",
    "Try to find music for clubbing (consider asking on Reddit)",
    "Hold a team meeting at 9:30pm Monday for the indie game project",
    "Attend office hours for the entrepreneurship course and prepare a candid discussion",
    "Check the marketing course group chat and communicate with teammates",
    "Attend the marketing class and introduce yourself",
    "Ask Lawrence or Vincent about ML learning or join an ML reading group",
    "Add the ML reading group meeting time to your calendar",
    "Message to schedule the podcast for Chinese international students",
    "Explore marketing strategies for the podcast",
    "Book a teeth inspection appointment"
  ],
  "projects": [
    "Develop a niche GTD tool concept for Nebius submission",
    "Create or adopt an automated solution for rent payment",
    "Maintain and enhance relationships with friends, family, and your entrepreneurial network",
    "Explore business opportunities (startup or niche cash-flow ideas)",
    "Refine your Redbook content strategy (authentic sharing vs. follower growth vs. monetization)",
    "Develop the indie game with Phoebe",
    "Build a strong online presence by sharing genuine thoughts and achievements",
    "Advance the Dafu and Yuan project through discussion and long-term planning",
    "Enhance your ML knowledge through self-study and group activities"
  ],
  "someday_maybe": [
    "Break out of your comfort zone with new activities",
    "Consider additional strategies for reducing phone time and doom scrolling",
    "Further develop the idea of making drinks at home balancing cost, quality, and control",
    "Explore additional approaches for ensuring a consistent daily exercise routine"
  ],
  "reflections": [
    "Feeling like a loser for not making money this semester despite achieving meaningful things",
    "Realizing that 1/3 of the year has passed and time is fleeting",
    "Frustration over expensive drinks and the challenge of controlling spending",
    "Concerns about academic performance and personal growth",
    "Worries about health, such as gaining face fat",
    "Feeling mentally drained by excessive gaming as an escape"
  ],
  "questions": [
    "What different actions can I take to break out of my comfort zone?",
    "How can I best control my drink purchasing habits and determine the optimal frequency?",
    "What strategies will ensure I stick to a daily exercise routine?",
    "Which niche direction should I pursue for my Redbook content: authenticity, follower growth, or monetization?"
  ],
  "references": [
    "Meaningful actions achieved: meeting Sean, making a carpool miniprogram, attending a symposium, reading books, visiting family, starting a Redbook account",
    "Notes on not making money this semester despite accomplishments",
    "Credit card change affecting Virgin Plus subscription",
    "Current high rent and upcoming rental renewal",
    "Interest in learning about crypto, ML, and French",
    "Academic courses: COMP461, entrepreneurship, marketing, and philosophy details"
  ]
}

Now, process the following input:

${input}

Respond ONLY with the JSON output, no explanations or additional text.`;
}

/**
 * Extract JSON from LLM response text which might contain markdown or other formatting
 */
function extractJsonFromText(text: string): ClarifiedResult {
  try {
    console.log("Extracting JSON from response text...");

    // If the response is already a JSON object, return it directly
    if (typeof text === 'object') {
      console.log("Response is already an object, using directly");
      return text as ClarifiedResult;
    }
    
    // Try to find JSON in the response
    console.log("Searching for JSON in text...");
    
    // First, try to find JSON inside code blocks
    const jsonCodeBlockMatch = text.match(/```(?:json)?([\s\S]*?)```/);
    if (jsonCodeBlockMatch) {
      console.log("Found JSON in code block");
      const jsonString = jsonCodeBlockMatch[1].trim();
      return JSON.parse(jsonString);
    }
    
    // Next, try to find a standalone JSON object
    const jsonObjectMatch = text.match(/{[\s\S]*}/);
    if (jsonObjectMatch) {
      console.log("Found standalone JSON object");
      const jsonString = jsonObjectMatch[0].trim();
      return JSON.parse(jsonString);
    }
    
    // If we reach here, we couldn't find a valid JSON object
    console.error("Failed to find valid JSON in response:", text.substring(0, 200) + "...");
    throw new Error("Could not extract JSON from response");
  } catch (error) {
    console.error("Error extracting JSON from response:", error, "Text:", text.substring(0, 500) + "...");
    throw new Error("Invalid JSON response from Nebius Studio");
  }
} 