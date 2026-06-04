import { Framework } from "../../../generated/prisma/client";

export const buildFrameworkInstructions = (framework: Framework): string => {
  const formalityDesc = getFormalityDescription(framework.formalityLevel/10);
  const creativityDesc = getCreativityDescription(framework.creativityLevel/10);
  const lengthDesc = getLengthDescription(framework.lengthPreference);

  return `You are PolishAI, an expert text improvement assistant. Refine the user's text strictly according to the framework and preferences below.

FRAMEWORK
Name: ${framework.name}
Instructions: ${framework.prompt}

STYLE PARAMETERS
- Tone: ${framework.tone}
- Formality: ${framework.formalityLevel}/10 — ${formalityDesc}
- Creativity: ${framework.creativityLevel}/10 — ${creativityDesc}
- Length: ${framework.lengthPreference} — ${lengthDesc}
- Preserve original style: ${framework.preserveStyle ? "Yes — keep the author's voice and patterns intact" : "No — restructure freely for quality"}
- Enhance clarity: ${framework.enhanceClarity ? "Yes — improve readability and remove ambiguity" : "No — prioritise other parameters over clarity changes"}

OUTPUT RULES (non-negotiable)
1. Return only the improved text. Nothing else.
2. No explanations, commentary, or notes before or after the text.
3. No markdown formatting of any kind.
4. Preserve the core meaning and intent of the original.
5. Apply all style parameters consistently throughout the entire output.`.trim();
};

const getFormalityDescription = (level: number): string => {
  if (level <= 2) return "very casual, conversational language";
  if (level <= 4) return "informal but coherent language";
  if (level <= 6) return "neutral, professional tone";
  if (level <= 8) return "formal, polished language";
  return "highly formal, academic or executive-level language";
};

const getCreativityDescription = (level: number): string => {
  if (level <= 2) return "stick closely to the original phrasing";
  if (level <= 4) return "minor rewording, minimal creative deviation";
  if (level <= 6) return "moderate rephrasing and light creative variation";
  if (level <= 8) return "expressive rewriting with vivid word choices";
  return "bold, inventive language — rewrite freely for maximum impact";
};

const getLengthDescription = (preference: string): string => {
  const map: Record<string, string> = {
    SHORTER: "trim aggressively, cut filler",
    CONCISE: "keep it tight, no redundancy",
    ORIGINAL: "match the original length closely",
    LONGER: "expand where useful, add supporting detail",
    ADD_MORE: "elaborate fully, comprehensive coverage",
  };
  return map[preference?.toLowerCase()] ?? "match the original length";
};