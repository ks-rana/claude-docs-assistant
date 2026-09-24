// Claude Docs Assistant
// Single-file React artifact for Claude.ai. Built per /docs/requirements-v2.md
// and /docs/ui-design-spec.md (Direction C: monochrome, one signal).
// Sections: CONFIG, CORPUS, RETRIEVAL, GENERATION, UI.

import React, { useState, useRef, useEffect, useMemo } from "react";

// ============================================================================
// CONFIG (requirements section 14). All tunables live here; no magic numbers.
// ============================================================================
const CONFIG = {
  MODEL: "claude-sonnet-4-6", // per requirements 14; the generation model
  MAX_TOKENS: 1000,
  RETRIEVAL_K: 4,
  KEYWORD_BOOST: 0.6,
  BM25_K1: 1.2,
  BM25_B: 0.75,
  // MOCK_MODE must ship false. When true, the app builds a realistic answer
  // from the retrieved doc text so the full UI can be previewed with no API
  // call (see Phase 7 QA item).
  MOCK_MODE: false,
  // Below this best-retrieval score, treat the question as outside the loaded
  // docs: show a graceful closest-match refusal instead of answering. A pure
  // score cutoff is imperfect (the model is the authoritative out-of-scope
  // judge in a live run), so this is kept modest and tuned against the eval set.
  RELEVANCE_MIN: 5.0,
  EXAMPLE_QUESTIONS: [
    "How do I stop Claude from making things up?",
    "How many examples should I give for multishot prompting?",
    "What is indirect prompt injection?",
    "How can I reduce my app's latency?",
  ],
  // Randomized greeting on the empty state (author override of HM-4/HM-10).
  // No emoji, no exclamation points.
  GREETINGS: [
    "Hi. What can the docs help with?",
    "Hello. Ask anything within the loaded docs.",
    "Welcome. What are you looking for?",
    "Good to see you. Ask away.",
    "Ready when you are.",
    "Let's dig into the docs.",
    "What would you like to know?",
    "Hey. Point me at a question.",
  ],
  GATE_HEADING: "Before you start",
  GATE_STATEMENTS: [
    "This assistant's responses are AI-generated. Although answers are drawn from Claude Platform documentation content, they may contain errors, be incomplete, or fall out of date as the docs change.",
    "Do not trust answers blindly. Always double-check important information against the official documentation at platform.claude.com/docs.",
    "This is an independent educational project and is not affiliated with or endorsed by Anthropic.",
  ],
  DOCS_URL: "https://platform.claude.com/docs",
  MSG_LABEL: "AI-generated · verify against official docs",
  CANNED_REPLY:
    "The docs sections I have loaded don't cover this. Try rephrasing, or search the full documentation at platform.claude.com/docs.",
};

// Radix Colors (light) tokens, inlined because artifacts cannot load external CSS.
// Roles per design spec 5.2. Teal is the only hue and appears on interactive
// elements only; measurement bars are grayscale.
// Claude.ai-inspired warm palette (author override of Direction C). Coral is
// the single accent. Kept AA: inkSoft and accentText verified >= 4.5:1 on paper.
const T = {
  ink: "#141413", // primary text
  inkSoft: "#6c6a64", // secondary text and metadata (AA on paper and card)
  surface: "#faf9f5", // warm paper app background
  card: "#ffffff", // message and panel surface
  line: "#e6dfd8", // warm hairline border and dividers
  lineStrong: "#d9d1c7", // stronger separators
  userBubble: "#efe9df", // user message fill (warm tint), ink text on top
  barFill: "#6c6a64", // relevance bar fill (muted, transparency aid)
  barTrack: "#eee9e2", // relevance bar track
  accent: "#cc785c", // coral, solid button fills and brand mark
  accentHover: "#a9583e", // darker coral, hover
  accentText: "#a9583e", // darker coral for links and accent text (AA on paper)
  accentSoft: "#f5ede8", // soft coral tint for pills and hovers
  alertSurface: "#fbeee9", // error card background
  alertText: "#8a3b1e", // error text (AA)
  alertBorder: "#f0d9cf", // error card border
};
const FONT_DISPLAY = 'Georgia, "Times New Roman", "Iowan Old Style", serif';
const FONT_BODY =
  '-apple-system, system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
const FONT_MONO =
  'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace';

// ============================================================================
// CORPUS (data-only; edits touch only this array). Built from /corpus/chunks.json.
// ============================================================================
const CORPUS = [
  {"id":"pe-clarity","page":"Prompting best practices","section":"Be clear and direct","url":"https://platform.claude.com/en/docs/build-with-claude/prompt-engineering/claude-prompting-best-practices","keywords":["clear instructions","specific","vague prompt","detailed","context","explain why","new employee","output format"],"text":"Claude responds well to clear, explicit instructions. Be specific about the desired output format and constraints, and if you want above-and-beyond behavior, request it explicitly rather than relying on the model to infer it from a vague prompt. Think of Claude as a brilliant but new employee who lacks context on your norms and workflows: the more precisely you explain what you want, the better the result. A useful golden rule is to show your prompt to a colleague with minimal context and ask them to follow it; if they would be confused, Claude will be too. Provide instructions as sequential steps using numbered lists or bullet points when order or completeness matters. Adding context or motivation, such as explaining why a behavior is important, further improves targeting because Claude generalizes from the explanation. For example, 'Your response will be read aloud by a text-to-speech engine, so never use ellipses' works better than a bare 'NEVER use ellipses.'"},
  {"id":"pe-examples","page":"Prompting best practices","section":"Use examples (multishot prompting)","url":"https://platform.claude.com/en/docs/build-with-claude/prompt-engineering/claude-prompting-best-practices","keywords":["examples","few shot","multishot","sample outputs","demonstrations","show don't tell","consistency"],"text":"Examples, also called few-shot or multishot prompting, are one of the most reliable ways to steer Claude's output format, tone, and structure. Include 3 to 5 examples for best results. Make examples relevant so they mirror your actual use case closely, diverse so they cover edge cases and vary enough that Claude does not latch onto an unintended pattern, and structured by wrapping each example in <example> tags (and multiple examples in <examples> tags) so Claude can distinguish them from your instructions. You can also ask Claude to evaluate your examples for relevance and diversity, or to generate additional examples based on your initial set. Well-chosen examples improve accuracy and consistency more than abstract descriptions of what you want."},
  {"id":"pe-xml-tags","page":"Prompting best practices","section":"Structure prompts with XML tags","url":"https://platform.claude.com/en/docs/build-with-claude/prompt-engineering/claude-prompting-best-practices","keywords":["xml tags","structure","delimiters","organize prompt","tags","sections","separate instructions"],"text":"XML tags help Claude parse complex prompts unambiguously, especially when a prompt mixes instructions, context, examples, and variable inputs. Wrap each type of content in its own tag, for example <instructions>, <context>, and <input>, so Claude does not confuse one kind of content for another. Use consistent, descriptive tag names across your prompts rather than inventing new names each time. Nest tags when the content has a natural hierarchy, such as several documents inside a <documents> tag with each one inside a <document index=\"n\"> tag. Clear tagging reduces misinterpretation and makes it easier to refer back to a specific part of the prompt in your instructions."},
  {"id":"pe-role","page":"Prompting best practices","section":"Give Claude a role (system prompts)","url":"https://platform.claude.com/en/docs/build-with-claude/prompt-engineering/claude-prompting-best-practices","keywords":["role","system prompt","persona","expertise","tone","set behavior","you are a"],"text":"Setting a role in the system prompt focuses Claude's behavior and tone for your use case, and even a single sentence makes a difference. The role is placed in the system parameter of the API call, separate from the user message. For example, a system prompt of 'You are a helpful coding assistant specializing in Python' primes Claude to answer with that expertise and voice. Because the system prompt applies across the whole conversation, a well-chosen role keeps the model's responses consistent in perspective and focus without you having to restate the framing in every user message. Pair the role with clear, specific instructions about the task itself: the role sets the voice and expertise, while the instructions define what to actually do."},
  {"id":"pe-long-context","page":"Prompting best practices","section":"Long context prompting","url":"https://platform.claude.com/en/docs/build-with-claude/prompt-engineering/claude-prompting-best-practices","keywords":["long context","large documents","many tokens","document order","quotes","grounding","20k tokens","placement"],"text":"When working with large documents or data-rich inputs of roughly 20,000 tokens or more, structure the prompt carefully. Put longform data at the top: place long documents and inputs near the top of your prompt, above your query, instructions, and examples. Placing the query at the end can improve response quality by up to 30 percent in tests, especially with complex multi-document inputs. Structure document content and metadata with XML tags, wrapping each document in a <document> tag with <document_content> and <source> subtags. Ground responses in quotes by asking Claude to first quote the relevant parts of the documents before carrying out its task, which helps it cut through the noise of long inputs."},
  {"id":"pe-output-format","page":"Prompting best practices","section":"Control the format of responses","url":"https://platform.claude.com/en/docs/build-with-claude/prompt-engineering/claude-prompting-best-practices","keywords":["output format","formatting","markdown","control style","response shape","tell what to do","prose"],"text":"There are several effective ways to steer Claude's output formatting. First, tell Claude what to do instead of what not to do: instead of 'Do not use markdown,' try 'Your response should be composed of smoothly flowing prose paragraphs.' Second, use XML format indicators, for example 'Write the prose sections of your response in <smoothly_flowing_prose_paragraphs> tags.' Third, match your prompt style to the desired output, because the formatting style used in your prompt influences Claude's response style; removing markdown from your prompt can reduce the volume of markdown in the output. Fourth, use detailed prompts when you need fine control over specific markdown and formatting preferences."},
  {"id":"pe-chain-of-thought","page":"Prompting best practices","section":"Chain of thought and thinking","url":"https://platform.claude.com/en/docs/build-with-claude/prompt-engineering/claude-prompting-best-practices","keywords":["chain of thought","cot","thinking","reasoning","step by step","self check","verify","reflection"],"text":"Claude's thinking capabilities are especially helpful for reflection after tool use or complex multi-step reasoning. Prefer general instructions over prescriptive steps: a prompt like 'think thoroughly' often produces better reasoning than a hand-written step-by-step plan. Multishot examples work with thinking, so you can place <thinking> tags inside few-shot examples to show the reasoning pattern you want. As a fallback when thinking is off, use manual chain-of-thought prompting by asking Claude to think through the problem, using structured tags like <thinking> and <answer> to separate reasoning from the final output. Ask Claude to self-check by appending something like 'Before you finish, verify your answer against the test criteria,' which reliably catches errors, especially for coding and math."},
  {"id":"pe-chain-prompts","page":"Prompting best practices","section":"Chain complex prompts","url":"https://platform.claude.com/en/docs/build-with-claude/prompt-engineering/claude-prompting-best-practices","keywords":["prompt chaining","chain prompts","subtasks","pipeline","self correction","multiple calls","break down task"],"text":"Explicit prompt chaining means breaking a task into sequential API calls. With adaptive thinking and subagent orchestration, Claude now handles most multi-step reasoning internally, so explicit chaining is most useful when you need to inspect intermediate outputs or enforce a specific pipeline structure. The most common chaining pattern is self-correction: generate a draft, have Claude review it against criteria, then have Claude refine based on that review. Because each step is a separate API call, you can log, evaluate, or branch at any point, which lets you catch and correct a bad intermediate result before it propagates to the final output."},
  {"id":"gr-hallucination-basic","page":"Reduce hallucinations","section":"Basic hallucination minimization strategies","url":"https://platform.claude.com/en/docs/test-and-evaluate/strengthen-guardrails/reduce-hallucinations","keywords":["hallucination","accurate answers","accuracy","making things up","made up","false information","wrong answers","correct information"],"text":"A hallucination is when a model generates text that is factually incorrect or inconsistent with the given context. Three basic strategies reduce it. First, allow Claude to say 'I don't know': explicitly give it permission to admit uncertainty, for example by instructing it to say 'I don't have enough information to confidently assess this' when unsure. This alone can drastically reduce false information. Second, use direct quotes for factual grounding: for long documents over 20,000 tokens, ask Claude to extract word-for-word quotes first before performing its task, so its response is anchored in the actual text. Third, verify with citations: have Claude cite a supporting quote for each claim, and after drafting, find a direct quote for each claim and remove any claim it cannot support. These techniques make answers auditable and reduce invented facts."},
  {"id":"gr-hallucination-advanced","page":"Reduce hallucinations","section":"Advanced techniques","url":"https://platform.claude.com/en/docs/test-and-evaluate/strengthen-guardrails/reduce-hallucinations","keywords":["hallucination","accurate","reliable answers","verification","restrict knowledge","only use documents","iterative","reasoning"],"text":"Beyond the basic strategies, several advanced techniques further reduce hallucinations. Chain-of-thought verification asks Claude to explain its reasoning step by step before giving a final answer, which can reveal faulty logic or assumptions. Best-of-N verification runs Claude through the same prompt multiple times and compares the outputs; inconsistencies across runs can indicate hallucinations. Iterative refinement uses Claude's outputs as inputs to follow-up prompts that ask it to verify or expand on previous statements, catching and correcting inconsistencies. External knowledge restriction explicitly instructs Claude to use only the information in the provided documents and not its general knowledge. None of these eliminate hallucinations entirely, so always validate critical information for high-stakes decisions."},
  {"id":"gr-output-consistency","page":"Increase output consistency","section":"Specify format, examples, and retrieval","url":"https://platform.claude.com/en/docs/test-and-evaluate/strengthen-guardrails/increase-consistency","keywords":["consistency","same format","structured output","json","templates","retrieval","knowledge base","reliable output"],"text":"To make Claude's responses more consistent, combine three techniques. Specify the desired output format precisely using JSON, XML, or custom templates so Claude understands every formatting element you require, for example an analysis returned as JSON with fixed keys. Constrain with examples by providing a filled-in template of the exact output you want, which trains Claude's understanding better than abstract instructions. Use retrieval for contextual consistency in tasks like chatbots and knowledge bases: provide a fixed information set, instruct Claude to check it first, and respond in a fixed format that names the source entry used. For guaranteed JSON schema conformance specifically, use the Structured Outputs feature instead of prompt engineering, since it provides guaranteed schema compliance."},
  {"id":"gr-keep-character","page":"Increase output consistency","section":"Keep Claude in character","url":"https://platform.claude.com/en/docs/test-and-evaluate/strengthen-guardrails/increase-consistency","keywords":["character","persona","role consistency","stay in role","chatbot personality","break character","scenarios"],"text":"For role-based applications, keeping Claude in character requires deliberate prompting. Use the system prompt to set the role and personality, providing detailed information about the character's background and any specific traits or quirks so the model can emulate and generalize them. This gives a strong foundation for consistent responses across a conversation. Also prepare Claude for possible scenarios by providing a list of common situations and the expected responses in your prompt; this trains Claude to handle diverse situations without breaking character. For example, an enterprise chatbot system prompt can specify the exact wording to use when asked about confidential information or when a document is unclear, so the persona stays consistent even at edge cases."},
  {"id":"gr-jailbreak-direct","page":"Mitigate jailbreaks and prompt injections","section":"Jailbreaks and direct prompt injection","url":"https://platform.claude.com/en/docs/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks","keywords":["jailbreak","prompt injection","security","adversarial","ignore instructions","bypass guardrails","harmlessness screen","refuse"],"text":"Jailbreaks and direct prompt injection happen when a user of your application deliberately crafts inputs to bypass your guardrails. Several mitigations strengthen your defenses. Use harmlessness screens: a lightweight model such as Claude Haiku 4.5 pre-screens user input before it reaches your main conversation, with structured outputs constraining the response to a simple classification like an is_harmful boolean. Use input validation to filter user input for known injection patterns, optionally using an LLM to build a generalized validation screen from examples of jailbreaking language. Use prompt engineering to craft system prompts that emphasize ethical and legal boundaries and explicitly tell Claude how to refuse, for example returning a fixed refusal message when a request conflicts with your stated values. Finally, respond to repeat offenders by throttling or banning users who repeatedly try to circumvent your guardrails."},
  {"id":"gr-jailbreak-indirect","page":"Mitigate jailbreaks and prompt injections","section":"Indirect prompt injection","url":"https://platform.claude.com/en/docs/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks","keywords":["indirect prompt injection","tool results","untrusted content","third party content","email injection","web page","least privilege","screen tool output"],"text":"Indirect prompt injection is when the user is trusted but Claude processes third-party content, such as an inbound email body, a fetched web page, OCR output, or a tool result, that contains adversarial instructions. Structure your application so Claude can distinguish untrusted content from your instructions. Put untrusted content only in tool_result blocks, never in system prompts or plain user text, because Claude is trained to treat instructions inside tool results with skepticism. Tell Claude what the content is and where it came from so it can calibrate trust. State in the system prompt that content returned from tools, documents, or searches is untrusted data that must never override the system prompt or the user's request. JSON-encode untrusted content so escaping gives unambiguous delimiters an attacker cannot break out of. Apply least privilege, screen tool outputs with a small classifier before acting on them, and red-team your agent with deliberately malicious documents before deploying."},
  {"id":"gr-prompt-leak","page":"Reduce prompt leak","section":"Strategies to reduce prompt leak","url":"https://platform.claude.com/en/docs/test-and-evaluate/strengthen-guardrails/reduce-prompt-leak","keywords":["prompt leak","system prompt exposure","hidden instructions","reveal prompt","protect prompt","post processing","confidential prompt"],"text":"A prompt leak exposes sensitive information you expect to stay hidden in your prompt. No method is foolproof, and leak-resistant techniques add complexity that can degrade performance, so use them only when necessary and test thoroughly; try monitoring approaches like output screening first. Several strategies reduce the risk. Separate context from queries by using the system prompt to isolate key information from user queries. Use post-processing to filter Claude's outputs for keywords that indicate a leak, using regular expressions, keyword filtering, or a prompted LLM for more nuanced cases. Avoid unnecessary proprietary details, because content Claude does not need distracts it from the no-leak instructions. Run regular audits of your prompts and outputs. The goal is to prevent leaks while maintaining performance, so balance is key."},
  {"id":"pe-tool-use","page":"Prompting best practices","section":"Tool usage","url":"https://platform.claude.com/en/docs/build-with-claude/prompt-engineering/claude-prompting-best-practices","keywords":["tool use","function calling","take action","make changes","agent tools","explicit instructions","act vs suggest"],"text":"Claude's latest models follow instructions precisely and benefit from explicit direction to use specific tools. If you ask 'can you suggest some changes,' Claude will sometimes only suggest rather than implement, even when acting is what you intended. To make Claude take action, be explicit, for example 'Change this function to improve its performance' or 'Make these edits to the authentication flow.' You can add a system prompt instruction to implement changes rather than only suggest them by default. If a model overtriggers tools, dial back aggressive wording: instead of 'CRITICAL: You MUST use this tool when...', use normal phrasing like 'Use this tool when...' so the model does not call tools more often than you want."},
  {"id":"pe-parallel-tools","page":"Prompting best practices","section":"Optimize parallel tool calling","url":"https://platform.claude.com/en/docs/build-with-claude/prompt-engineering/claude-prompting-best-practices","keywords":["parallel tool calls","speed","simultaneous","multiple tools at once","efficiency","sequential","dependencies"],"text":"Claude's latest models run independent tool calls in parallel, such as multiple searches, reading several files at once, or running commands at the same time. This behavior is steerable. To push parallel calling toward 100 percent, add a system prompt instructing Claude to make all independent tool calls simultaneously when there are no dependencies between them, and to fall back to sequential calls only when one call depends on the result of another, never using placeholders or guessing missing parameters. To reduce parallelism instead, instruct Claude to execute operations sequentially. Parallel calling increases speed and efficiency, so it is usually worth encouraging for read-only work like gathering context."},
  {"id":"pe-agentic-state","page":"Prompting best practices","section":"Long-horizon reasoning and state tracking","url":"https://platform.claude.com/en/docs/build-with-claude/prompt-engineering/claude-prompting-best-practices","keywords":["long horizon","state tracking","multi step","agent","context window","progress","resume work","checkpoints"],"text":"Claude's latest models handle long-horizon tasks with strong state tracking, maintaining orientation across extended sessions by making steady incremental progress rather than attempting everything at once. For tasks that span multiple context windows, use a different prompt for the first window to set up a framework such as writing tests and setup scripts, then iterate on a todo list in later windows. Have the model write tests in a structured format like tests.json, and set up quality-of-life scripts such as init.sh. Consider starting a fresh context window rather than compacting, since the models are effective at discovering state from the filesystem and git. Use structured formats like JSON for state data, freeform text for progress notes, and git for checkpoints across sessions."},
  {"id":"pe-subagents","page":"Prompting best practices","section":"Subagent orchestration","url":"https://platform.claude.com/en/docs/build-with-claude/prompt-engineering/claude-prompting-best-practices","keywords":["subagents","delegation","orchestration","parallel work","specialized agents","overuse","when to delegate"],"text":"Claude's latest models orchestrate subagents natively, recognizing when a task benefits from delegating work to specialized subagents and doing so without explicit instruction. To take advantage, make well-defined subagent tools available in your tool definitions and let Claude orchestrate naturally. Watch for overuse, since a model may spawn subagents where a simpler direct approach, such as a single search, would be faster and sufficient. If you see excessive subagent use, add guidance: use subagents when tasks can run in parallel, need isolated context, or are independent workstreams; for simple tasks, sequential operations, single-file edits, or work that needs shared context across steps, work directly rather than delegating."},
  {"id":"pe-overengineering","page":"Prompting best practices","section":"Avoid over-engineering","url":"https://platform.claude.com/en/docs/build-with-claude/prompt-engineering/claude-prompting-best-practices","keywords":["over-engineering","overeagerness","minimal solution","scope creep","keep it simple","unnecessary abstractions","extra files"],"text":"Claude can overengineer by creating extra files, adding unnecessary abstractions, or building flexibility that was not requested. To keep solutions minimal, instruct Claude to make only changes that are directly requested or clearly necessary. Specifically: do not add features, refactor code, or make improvements beyond what was asked, since a bug fix does not need surrounding cleanup; do not add docstrings, comments, or type annotations to code you did not change, adding comments only where the logic is not self-evident; do not add error handling or validation for scenarios that cannot happen, validating only at system boundaries like user input and external APIs; and do not create helpers or abstractions for one-time operations. The right amount of complexity is the minimum needed for the current task."},
  {"id":"pe-frontend-design","page":"Prompting best practices","section":"Frontend design","url":"https://platform.claude.com/en/docs/build-with-claude/prompt-engineering/claude-prompting-best-practices","keywords":["frontend","ui design","ai slop","generic design","aesthetics","typography","avoid purple gradients","web design"],"text":"Without guidance, models can default to generic patterns that create what users call an AI slop aesthetic. To get distinctive frontends, use a system prompt that tells Claude to avoid generic outputs and focus on a few things: distinctive typography, avoiding overused fonts like Arial and Inter; a cohesive color theme with dominant colors and sharp accents rather than timid, evenly distributed palettes; purposeful motion reserved for high-impact moments such as a single well-orchestrated page load; and backgrounds with atmosphere and depth rather than flat solid colors. Explicitly instruct it to avoid overused fonts, cliched color schemes such as purple gradients on white backgrounds, predictable layouts, and cookie-cutter design that lacks context-specific character."},
  {"id":"pe-vision","page":"Prompting best practices","section":"Vision capabilities","url":"https://platform.claude.com/en/docs/build-with-claude/prompt-engineering/claude-prompting-best-practices","keywords":["vision","images","image analysis","screenshots","data extraction","crop tool","video frames","multimodal"],"text":"Claude's latest models have strong vision capabilities for image processing and data extraction, performing especially well when multiple images are present in context, and these improvements carry over to interpreting screenshots and UI elements. You can analyze videos by breaking them into frames and passing the frames as images. One technique that consistently improves results is to give Claude a crop tool so it can zoom into the relevant region of an image; testing has shown consistent uplift on image evaluations when Claude can focus on a specific part of an image rather than reasoning over the whole thing at once."},
  {"id":"gr-latency-model","page":"Reducing latency","section":"Measure latency and choose the right model","url":"https://platform.claude.com/en/docs/test-and-evaluate/strengthen-guardrails/reduce-latency","keywords":["latency","speed","faster response","slow","haiku","model choice","time to first token","ttft"],"text":"Latency is the time it takes for the model to process a prompt and generate output, influenced by model size, prompt complexity, and infrastructure. Engineer a prompt that works well first, then reduce latency afterward, so you do not miss what top performance looks like. Two measurements matter: baseline latency, the overall time to process the prompt and generate the response, and time to first token (TTFT), the time to produce the first token after the prompt is sent, which matters most when streaming. One of the most direct ways to reduce latency is to choose the right model for your use case. For speed-critical applications, Claude Haiku 4.5 offers the fastest response times while maintaining high intelligence, so pick the model that best fits your needs for speed and output quality."},
  {"id":"gr-latency-tokens","page":"Reducing latency","section":"Optimize length and stream responses","url":"https://platform.claude.com/en/docs/test-and-evaluate/strengthen-guardrails/reduce-latency","keywords":["latency","faster","max_tokens","shorter responses","concise","streaming","temperature","token count"],"text":"Two further ways to reduce latency are shortening tokens and streaming. Minimize tokens in both the input prompt and the expected output while keeping performance high, since fewer tokens means a faster response. Be clear but concise and avoid unnecessary detail; ask Claude directly to be concise, and because models count tokens rather than words, request a paragraph or sentence limit rather than a word count. Use the max_tokens parameter to cap output length, remembering it cuts the response off bluntly, so it suits short or multiple-choice answers. Lower temperature values such as 0.2 can yield more focused, shorter responses. Finally, stream responses so the model sends output before it is complete, which significantly improves perceived responsiveness because users see output in real time."},
  {"id":"bc-structured-outputs","page":"Structured outputs","section":"JSON outputs","url":"https://platform.claude.com/en/docs/build-with-claude/structured-outputs","keywords":["structured outputs","json output","schema","valid json","parse","output_config","guaranteed format","data extraction"],"text":"Structured outputs constrain Claude's responses to follow a specific schema, guaranteeing valid, parseable output through constrained decoding. There are two capabilities: JSON outputs control the response format, and strict tool use validates tool inputs. The benefit is that output is always valid (no JSON.parse errors), type safe, and reliable with no retries for schema violations. To get JSON output, add an output_config.format parameter with type 'json_schema' and your schema written in standard JSON Schema; Claude's response is valid JSON matching the schema, returned in the text content block. SDKs add helpers, for example the Python client.messages.parse() accepts Pydantic models and returns a parsed_output, and the TypeScript SDK accepts Zod schemas. This is useful for extracting data from text or images, classification, and formatting API responses."},
  {"id":"bc-structured-schema-limits","page":"Structured outputs","section":"JSON schema limitations","url":"https://platform.claude.com/en/docs/build-with-claude/structured-outputs","keywords":["json schema","supported","not supported","constraints","recursive","minimum maximum","grammar","limits"],"text":"Structured outputs support a subset of JSON Schema. Supported: basic types (object, array, string, integer, number, boolean, null), enum, const, anyOf, allOf, internal $ref and $def, common string formats (date-time, date, time, email, uri, uuid, and others), and array minItems limited to 0 or 1. Not supported: recursive schemas, complex types inside enums, external $ref, numerical constraints like minimum, maximum, and multipleOf, string length constraints like minLength and maxLength, and array constraints beyond minItems. The Python, TypeScript, Ruby, and PHP SDKs automatically transform schemas to drop unsupported constraints and still validate the response against your original schema. The first request has extra latency while the grammar compiles, and compiled grammars are cached for 24 hours; changing the schema structure or tool set invalidates that grammar cache, while name or description changes do not."},
  {"id":"bc-tool-use-flow","page":"Tool use with Claude","section":"How tool use works","url":"https://platform.claude.com/en/docs/agents-and-tools/tool-use/overview","keywords":["tool use","function calling","tool_use","tool_result","client tools","server tools","input_schema","round trip"],"text":"Tool use (function calling) lets Claude call functions you define or that Anthropic provides, deciding when to call based on the request and the tool's description. Tools differ by where the code runs. Client tools run in your application: Claude responds with stop_reason 'tool_use' and one or more tool_use blocks, your code executes the operation and sends back a tool_result. Server tools such as web_search and code_execution run on Anthropic's infrastructure and return results directly. To use a function you define, pass a tool with a name, description, and input_schema. The round trip: the first request defines the tool; Claude returns a tool_use block naming the tool and its arguments; your code runs the operation; a second request sends the outcome back in a tool_result block that references the tool_use_id, so Claude can produce the final answer."},
  {"id":"bc-tool-choice","page":"Tool use with Claude","section":"Controlling when Claude uses tools","url":"https://platform.claude.com/en/docs/agents-and-tools/tool-use/overview","keywords":["tool_choice","force tool","auto","when to call tools","parallel tool use","strict","steer tools"],"text":"By default tool_choice is {\"type\": \"auto\"}, so Claude decides on each turn whether to call a tool or answer directly; it calls a tool when the request maps to that tool's capability and the answer is not already in context. This is steerable through the system prompt: an instruction like 'Use the tools to investigate before responding' increases tool use, while 'Use your judgment about whether to call a tool' keeps it conservative. To require a tool call rather than rely on prompting, set tool_choice explicitly. Set disable_parallel_tool_use to ask for at most one tool call per turn. Add strict: true to a custom tool definition to guarantee that Claude's calls match your input schema exactly."},
  {"id":"bc-tool-types","page":"Tool use with Claude","section":"Kinds of tools","url":"https://platform.claude.com/en/docs/agents-and-tools/tool-use/overview","keywords":["kinds of tools","server tools","client tools","web search","code execution","bash tool","computer use","memory tool"],"text":"There are three kinds of tools. Your own tools: you write the schema and your application executes each call. Anthropic-schema client tools: Anthropic publishes the schema and trains Claude on it, but your application still executes the call and returns the tool_result; these include the memory tool, bash tool, text editor tool, computer use tool, and browser use tool. Server tools: they run on Anthropic's infrastructure with no handler code in your application, and include web search, web fetch, code execution, the advisor tool, tool search, and the MCP connector. Pricing reflects total input tokens (including the tools parameter) plus output tokens, and server tools can add usage-based charges such as a per-search fee for web search."},
  {"id":"bc-prompt-caching","page":"Prompt caching","section":"How to enable prompt caching","url":"https://platform.claude.com/en/docs/build-with-claude/prompt-caching","keywords":["prompt caching","cache_control","ephemeral","reduce cost","reuse prompt","breakpoint","ttl","latency"],"text":"Prompt caching lets you resume from cached prefixes in your prompts, cutting processing time and cost for repetitive prompts or ones with consistent elements. Enable it two ways. Automatic caching, recommended for multi-turn conversations, adds a single cache_control field at the top level of the request; the system puts the cache breakpoint on the last cacheable block and moves it forward as the conversation grows. Explicit breakpoints place cache_control ({\"type\": \"ephemeral\"}) directly on individual content blocks, with up to 4 breakpoints for sections that change at different rates. Cache stable, reusable content such as system instructions, tool definitions, and large context, and place it at the start of the prompt. The default cache lifetime is 5 minutes, measured from request start and refreshed for free when reused; a 1-hour cache is available at extra cost with cache_control 'ttl': '1h'."},
  {"id":"bc-prompt-caching-details","page":"Prompt caching","section":"Invalidation, minimums, and tracking","url":"https://platform.claude.com/en/docs/build-with-claude/prompt-caching","keywords":["cache invalidation","minimum tokens","cache hit","usage","cache_read_input_tokens","cache_creation_input_tokens","what breaks cache"],"text":"A change at one level of the prompt invalidates that level and everything after it: changing tool definitions invalidates the tools, system, and message caches; changing the system prompt invalidates the system and message caches; and images, tool_choice, and thinking parameters affect the caches per the documented rules. Place cache_control on the last block whose prefix stays identical across requests. The minimum cacheable prompt length varies by model, roughly from 512 tokens on the newest models up to about 4,096 tokens on some models; shorter prompts are simply not cached and return no error, so check the usage fields to confirm. Track caching with the response usage fields: cache_read_input_tokens (read from cache), cache_creation_input_tokens (written to cache), and input_tokens (after the last breakpoint, not cache eligible)."},
  {"id":"bc-thinking-manual","page":"Extended thinking","section":"Manual extended thinking","url":"https://platform.claude.com/en/docs/build-with-claude/extended-thinking","keywords":["extended thinking","budget_tokens","reasoning","thinking budget","deprecated","max_tokens","manual thinking"],"text":"Thinking lets Claude reason internally before its final answer, which helps on complex, multi-step problems. In manual extended thinking you set a fixed budget with thinking: {type: \"enabled\", budget_tokens: N}, useful when you need predictable latency or precise control over thinking cost. The budget must be at least 1,024 tokens and must be less than max_tokens, because thinking tokens count toward the turn's max_tokens limit; the budget is a target rather than a strict cap, and max_tokens stays the hard ceiling. For simple tasks start near the 1,024 minimum and increase; for complex tasks start at 16,000 or more, with diminishing returns and higher latency. Manual extended thinking is deprecated on the Claude 4.6 models and is rejected with a 400 error on Claude 4.7 and later, which use adaptive thinking instead."},
  {"id":"bc-thinking-adaptive","page":"Extended thinking","section":"Adaptive thinking and migration","url":"https://platform.claude.com/en/docs/build-with-claude/extended-thinking","keywords":["adaptive thinking","effort","output_config","migrate thinking","when to think","reasoning depth","thinking mode"],"text":"Adaptive thinking is the newer thinking mode: set thinking: {type: \"adaptive\"} and control reasoning depth with output_config: {effort: ...} instead of a token budget. The behavioral difference matters: with a fixed budget Claude thinks on every request, whereas with adaptive thinking Claude decides whether and how much to think on each request, and at lower effort it may skip thinking entirely on easy inputs. To migrate off manual mode, remove budget_tokens, set thinking to type adaptive, and use output_config effort (effort 'high' matches the API default). Switching modes is a thinking-configuration change, so the first request after the switch invalidates prompt cache breakpoints. Track thinking cost with usage.output_tokens_details.thinking_tokens, which when streaming appears only on the final message_delta event."},
  {"id":"bc-streaming","page":"Streaming messages","section":"Streaming with server-sent events","url":"https://platform.claude.com/en/docs/build-with-claude/streaming","keywords":["streaming","stream true","server-sent events","sse","incremental","real time","sdk helpers"],"text":"When creating a Message, set \"stream\": true to receive the response incrementally as server-sent events (SSE). Streaming improves perceived responsiveness because your client can process output as it arrives instead of waiting for the whole answer. The Python and TypeScript SDKs offer streaming helpers, such as messages.stream, that accumulate the events for you and expose a convenient text stream; using these helpers is preferred over parsing raw events by hand. To reconstruct the full response manually, start from the message_start object and apply each delta to the content block at its index, closing each block on content_block_stop."},
  {"id":"bc-streaming-events","page":"Streaming messages","section":"Event types and order","url":"https://platform.claude.com/en/docs/build-with-claude/streaming","keywords":["event types","message_start","content_block_delta","text_delta","message_delta","message_stop","ping","order of events"],"text":"A streaming response is a sequence of server-sent events in a defined order. First a message_start event carries a Message object with empty content. Then each content block streams as a content_block_start, one or more content_block_delta events, and a content_block_stop; delta types include text_delta for streamed text, input_json_delta for a tool_use block's input JSON, and thinking_delta for streamed thinking. After the blocks come one or more message_delta events that report top-level changes to the Message, including the final usage on the last one, and finally a message_stop event. Periodic ping events and error events (such as an overloaded_error under high load) can appear at any time, so clients should tolerate unknown event and delta types to keep working as new ones are added."},
];

// Load-time duplicate id assertion (FR-2.6).
(() => {
  const seen = new Set();
  for (const c of CORPUS) {
    if (seen.has(c.id)) console.assert(false, `Duplicate corpus id: ${c.id}`);
    seen.add(c.id);
  }
})();

// Tier 1 cached question-and-answer set (data-only; from corpus/qa.json). These
// surface as type-ahead suggestions and are served instantly with no API call.
// Answers are author-drafted from the corpus and cite sources by [n].
const QA_CACHE = [
  {"id":"qa-hallucinations","question":"How do I stop Claude from making things up?","answer":"Give Claude explicit permission to say it does not know, which sharply reduces made-up answers [1]. For document tasks, have it pull exact quotes before answering and attach a supporting quote to each claim, dropping any claim it cannot support [1]. You can also restrict it to only the provided information and ask it to reason step by step to catch faulty logic [2].","sourceIds":["gr-hallucination-basic","gr-hallucination-advanced"]},
  {"id":"qa-examples","question":"How many examples should I give for multishot prompting?","answer":"Include 3 to 5 examples for best results. Make them relevant so they mirror your real use case, diverse so they cover edge cases, and wrap each one in <example> tags so Claude can tell them apart from your instructions [1].","sourceIds":["pe-examples"]},
  {"id":"qa-indirect-injection","question":"What is indirect prompt injection?","answer":"Indirect prompt injection is when Claude processes third-party content, such as an inbound email, a fetched web page, or a tool result, that hides adversarial instructions [1]. Defend against it by putting untrusted content only in tool_result blocks, telling Claude that such content is untrusted data that must never override your instructions, and screening tool output before Claude acts on it [1].","sourceIds":["gr-jailbreak-indirect"]},
  {"id":"qa-latency","question":"How can I reduce my app's latency?","answer":"Choose a faster model such as Claude Haiku 4.5 for speed-critical work [1]. Keep prompts and outputs short and cap length with the max_tokens parameter [2]. Stream responses so users see output as it is generated rather than waiting for the whole answer [2].","sourceIds":["gr-latency-model","gr-latency-tokens"]},
  {"id":"qa-consistency","question":"How do I get consistent JSON output from Claude?","answer":"Specify the exact format with JSON, XML, or a template, and give a filled-in example of the output you want [1]. For guaranteed JSON schema conformance, use the Structured Outputs feature instead of prompt engineering, since it enforces the schema [1].","sourceIds":["gr-output-consistency"]},
  {"id":"qa-tool-use","question":"How do I get Claude to make changes instead of just suggesting them?","answer":"Be explicit and use action verbs, for example 'Change this function to improve its performance' or 'Make these edits', rather than 'can you suggest some changes' [1]. You can also add a system prompt instruction telling Claude to implement changes by default rather than only suggesting them [1].","sourceIds":["pe-tool-use"]},
  {"id":"qa-long-context","question":"Where should I put a long document in my prompt?","answer":"Put long documents near the top of the prompt, above your question, instructions, and examples; placing the query at the end can improve response quality by up to 30 percent [1]. Wrap each document in XML tags and ask Claude to quote the relevant parts first so it cuts through the noise [1].","sourceIds":["pe-long-context"]},
  {"id":"qa-role","question":"How do I give Claude a role or persona?","answer":"Set the role in the system prompt; even a single sentence like 'You are a helpful coding assistant specializing in Python' focuses Claude's tone and expertise [1]. Because the system prompt applies across the whole conversation, the role keeps responses consistent in perspective without you restating the framing each turn [1].","sourceIds":["pe-role"]},
  {"id":"qa-keep-character","question":"How do I keep a chatbot in character?","answer":"Define the role and personality in the system prompt with detailed traits and background, and give the model a list of common scenarios with the expected responses so it stays in character even at edge cases [1].","sourceIds":["gr-keep-character"]},
  {"id":"qa-prompt-leak","question":"How do I stop my system prompt from leaking?","answer":"Use leak-resistant techniques only when necessary, since they add complexity. Separate context from queries in the system prompt, post-process outputs to filter for keywords that indicate a leak, avoid including unnecessary proprietary details, and audit your prompts and outputs regularly [1].","sourceIds":["gr-prompt-leak"]},
  {"id":"qa-xml-tags","question":"How do I use XML tags in prompts?","answer":"Wrap each kind of content in its own tag, such as <instructions>, <context>, and <input>, so Claude does not confuse one kind for another. Use consistent, descriptive tag names, and nest tags when the content has a natural hierarchy [1].","sourceIds":["pe-xml-tags"]},
  {"id":"qa-chain-of-thought","question":"Should I use chain of thought prompting?","answer":"For complex, multi-step reasoning, prefer a general instruction like 'think thoroughly' over a rigid hand-written step list, and use <thinking> and <answer> tags to separate the reasoning from the final output. Asking Claude to self-check before finishing reliably catches errors [1].","sourceIds":["pe-chain-of-thought"]},
  {"id":"qa-structured-outputs","question":"How do I get guaranteed valid JSON from Claude?","answer":"Use structured outputs: add an output_config.format parameter with type json_schema and your schema, and Claude returns valid JSON matching it through constrained decoding, so there are no JSON.parse errors and no retries for schema violations [1]. The SDKs add helpers, such as the Python client.messages.parse() with Pydantic models [1].","sourceIds":["bc-structured-outputs"]},
  {"id":"qa-tool-use-flow","question":"How does tool use work with Claude?","answer":"Define a tool with a name, description, and input_schema. Claude replies with stop_reason tool_use and a tool_use block naming the tool and its arguments; your code runs the operation and sends the outcome back in a tool_result block that references the tool_use_id, and Claude uses it to produce the answer [1]. Client tools run in your application, while server tools such as web search run on Anthropic's infrastructure [1].","sourceIds":["bc-tool-use-flow"]},
  {"id":"qa-prompt-caching","question":"What is prompt caching and how do I use it?","answer":"Prompt caching resumes from cached prefixes to cut cost and latency for repeated prompts. Enable it with a cache_control field, either automatically at the top level of the request or with explicit ephemeral breakpoints (up to 4) placed on stable content like system prompts and tool definitions at the start of the prompt [1]. The default cache lasts 5 minutes and refreshes for free when reused; a 1-hour cache is available at extra cost [1].","sourceIds":["bc-prompt-caching"]},
  {"id":"qa-thinking","question":"How do I control how much Claude thinks?","answer":"On newer models use adaptive thinking: set thinking to type adaptive and use output_config effort to control depth, and Claude decides whether and how much to think on each request [1]. Older models use manual extended thinking with thinking type enabled and a budget_tokens value (at least 1,024 and less than max_tokens); manual mode is deprecated on the 4.6 models and rejected with a 400 error on 4.7 and later [2].","sourceIds":["bc-thinking-adaptive","bc-thinking-manual"]},
  {"id":"qa-streaming","question":"How do I stream responses from Claude?","answer":"Set stream to true when creating a message to receive it incrementally as server-sent events, which improves perceived responsiveness [1]. The events arrive in order: message_start, then for each content block a content_block_start, one or more content_block_delta events (text_delta, input_json_delta, thinking_delta), and content_block_stop, followed by message_delta and message_stop [2]. SDK helpers like messages.stream accumulate the events for you [1].","sourceIds":["bc-streaming","bc-streaming-events"]},
];

// ============================================================================
// RETRIEVAL (client-side BM25-lite, no network). FR-3 series.
// ============================================================================
const STOPWORDS = new Set(
  ("a an and are as at be but by for from how i if in into is it its of on or " +
    "that the their then there these this to was what when where which who with " +
    "you your do does can could should would will my me our we they them he she " +
    "his her about over under against so than too very just only also any all each " +
    "some such no not more most other own same up out off down again").split(/\s+/)
);

function tokenize(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/[\s-]+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

// Precompute per-corpus statistics once at module load (FR-3.4, NFR-2).
const RETRIEVAL_INDEX = (() => {
  const docs = CORPUS.map((c) => {
    const tokens = tokenize(`${c.text} ${c.section} ${c.page} ${c.keywords.join(" ")}`);
    const tf = {};
    for (const t of tokens) tf[t] = (tf[t] || 0) + 1;
    return { chunk: c, tf, len: tokens.length, kwTokens: new Set(tokenize(c.keywords.join(" "))) };
  });
  const N = docs.length;
  const avgdl = docs.reduce((s, d) => s + d.len, 0) / N;
  const df = {};
  for (const d of docs) for (const t of Object.keys(d.tf)) df[t] = (df[t] || 0) + 1;
  return { docs, N, avgdl, df };
})();

function idf(term) {
  const { N, df } = RETRIEVAL_INDEX;
  const d = df[term] || 0;
  return Math.log(1 + (N - d + 0.5) / (d + 0.5));
}

function retrieve(query) {
  const q = tokenize(query);
  if (q.length === 0) return [];
  const { docs, avgdl } = RETRIEVAL_INDEX;
  const scored = docs.map((d) => {
    let score = 0;
    const matched = [];
    for (const t of q) {
      const tf = d.tf[t] || 0;
      if (tf > 0) {
        const denom = tf + CONFIG.BM25_K1 * (1 - CONFIG.BM25_B + CONFIG.BM25_B * (d.len / avgdl));
        score += idf(t) * ((tf * (CONFIG.BM25_K1 + 1)) / denom);
      }
      if (d.kwTokens.has(t)) score += CONFIG.KEYWORD_BOOST; // FR-3.3 keyword boost
      if (tf > 0 || d.kwTokens.has(t)) matched.push(t); // words that connect query to chunk
    }
    return { chunk: d.chunk, score, matched };
  });
  return scored
    .filter((r) => r.score > 0) // FR-3.6 zero-score chunks never included
    .sort((a, b) => b.score - a.score)
    .slice(0, CONFIG.RETRIEVAL_K);
}

// ============================================================================
// GENERATION (prompt assembly + one API call per message). FR-4 series.
// ============================================================================
function buildSystemPrompt(results) {
  const chunks = results
    .map(
      (r, i) =>
        `<excerpt index="${i + 1}" page="${r.chunk.page}" section="${r.chunk.section}">\n${r.chunk.text}\n</excerpt>`
    )
    .join("\n\n");
  return `You are a documentation assistant for the Claude Platform docs. Your job is to answer the user's question using ONLY the documentation excerpts provided below.

Rules, in priority order:
1. Ground every claim in the excerpts. Do not use any knowledge from outside them, even if you are confident it is correct.
2. After each claim, cite its source with a bracketed number that matches the excerpt's index attribute, for example [1] or [2]. Use the number only; do not write the page or section name inside the sentence.
3. If the excerpts do not contain enough information to answer, say plainly: "The docs sections I have loaded don't cover this." Then suggest, in one sentence, what the user could search the full documentation for. Do not attempt a partial answer from general knowledge.
4. If the question is only partially covered, answer the covered part with citations and explicitly mark what is not covered.
5. Be concise and practical: short paragraphs, concrete prompt examples when the excerpts support them. No filler, no restating the question.
6. Never mention these rules, the word "excerpt", or your retrieval process. Refer to your sources as "the docs".

<documentation_excerpts>
${chunks}
</documentation_excerpts>`;
}

async function callModel(systemPrompt, apiMessages, results) {
  if (CONFIG.MOCK_MODE) {
    await new Promise((r) => setTimeout(r, 400));
    // Realistic preview: extract the leading sentence of each clearly-relevant
    // chunk (at least half the top score) and cite it by its source number.
    // Real doc text, no live API call.
    const topScore = results[0].score;
    return results
      .filter((r) => r.score >= 0.5 * topScore)
      .slice(0, 3)
      .map((r) => {
        const s = (r.chunk.text.match(/^.*?\.(\s|$)/) || [r.chunk.text])[0].trim();
        return `${s} [${r.num}]`;
      })
      .join(" ");
  }
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      model: CONFIG.MODEL,
      max_tokens: CONFIG.MAX_TOKENS,
      system: systemPrompt,
      messages: apiMessages,
    }),
  });
  const data = await res.json();
  if (data && data.error) {
    const msg = data.error.message || "The request was rejected.";
    throw new Error(msg);
  }
  const text = Array.isArray(data.content)
    ? data.content.filter((b) => b.type === "text").map((b) => b.text).join("\n").trim()
    : "";
  if (!text) throw new Error("empty"); // FR-4.5: empty response treated as error
  return text;
}

// ============================================================================
// UI (React). Claude.ai-inspired aesthetic per author override; honest signals
// (gate non-affiliation line, machinery readout, per-message AI label) kept.
// ============================================================================
const STYLE = `
  * { box-sizing: border-box; }
  .cda-focusable:focus-visible { outline: 2px solid ${T.accentText}; outline-offset: 2px; border-radius: 4px; }
  .cda-input::placeholder { color: ${T.inkSoft}; }
  @keyframes cda-shimmer { 0% { opacity: 0.55; } 50% { opacity: 1; } 100% { opacity: 0.55; } }
  .cda-shimmer { animation: cda-shimmer 1.4s ease-in-out infinite; }
  .cda-fade { animation: cda-fade 0.12s ease-in; }
  @keyframes cda-fade { from { opacity: 0; } to { opacity: 1; } }
  @media (prefers-reduced-motion: reduce) {
    .cda-shimmer, .cda-fade { animation: none !important; }
  }
`;

function ScoreBar({ score, top }) {
  const ratio = top > 0 ? Math.max(0.08, score / top) : 0;
  const level = ratio >= 0.66 ? "high" : ratio >= 0.33 ? "medium" : "low";
  return (
    <div
      aria-label={`relevance: ${level} relative to top result`}
      style={{ height: 5, background: T.barTrack, borderRadius: 3, overflow: "hidden", width: 64, flexShrink: 0 }}
    >
      <div style={{ width: `${ratio * 100}%`, height: "100%", background: T.barFill }} />
    </div>
  );
}

// Always-visible numbered Sources list (Copilot-style), each linking to the docs.
function Sources({ sources }) {
  const scored = sources.filter((s) => typeof s.score === "number");
  const top = scored.length ? Math.max(...scored.map((s) => s.score)) : 0;
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ font: `600 10.5px ${FONT_MONO}`, letterSpacing: "0.08em", textTransform: "uppercase", color: T.inkSoft, marginBottom: 8 }}>
        Sources
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {sources.map((r) => (
          <a
            key={r.chunk.id}
            href={r.chunk.url}
            target="_blank"
            rel="noreferrer"
            className="cda-focusable"
            style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}
          >
            <span style={{ font: `600 12px ${FONT_MONO}`, color: T.inkSoft, flexShrink: 0 }}>[{r.num}]</span>
            <span style={{ flex: 1, minWidth: 0, font: `12.5px ${FONT_BODY}`, color: T.accentText }}>
              {r.chunk.page}: {r.chunk.section}
            </span>
            {typeof r.score === "number" && <ScoreBar score={r.score} top={top} />}
          </a>
        ))}
      </div>
    </div>
  );
}

function Message({ m }) {
  if (m.role === "user") {
    return (
      <div className="cda-fade" style={{ display: "flex", justifyContent: "flex-end", marginTop: 18 }}>
        <div
          style={{
            maxWidth: "85%", background: T.userBubble, color: T.ink, padding: "10px 14px",
            borderRadius: "14px 14px 4px 14px", font: `14.5px/1.55 ${FONT_BODY}`, whiteSpace: "pre-wrap",
          }}
        >
          {m.content}
        </div>
      </div>
    );
  }
  // Assistant, error variant: just the alert, no empty answer card.
  if (m.error) {
    return (
      <div className="cda-fade" style={{ marginTop: 18 }}>
        <div
          role="alert"
          style={{
            maxWidth: "94%", background: T.alertSurface, border: `1px solid ${T.alertBorder}`,
            borderRadius: 12, padding: "10px 12px", font: `13.5px/1.5 ${FONT_BODY}`, color: T.alertText,
          }}
        >
          {m.error}
        </div>
      </div>
    );
  }
  // Assistant, answer or graceful out-of-scope.
  return (
    <div className="cda-fade" style={{ marginTop: 18 }}>
      <div style={{ maxWidth: "94%", background: T.card, border: `1px solid ${T.line}`, borderRadius: "14px 14px 14px 4px", padding: "14px 16px" }}>
        {m.outOfScope ? (
          <div style={{ font: `14.5px/1.6 ${FONT_BODY}`, color: T.ink }}>
            This is outside the docs loaded here.
            {m.closest ? (
              <div style={{ marginTop: 10, font: `13.5px/1.5 ${FONT_BODY}`, color: T.inkSoft }}>
                Closest loaded section:{" "}
                <a href={m.closest.chunk.url} target="_blank" rel="noreferrer" className="cda-focusable" style={{ color: T.accentText, textDecoration: "underline" }}>
                  {m.closest.chunk.page}: {m.closest.chunk.section}
                </a>
                {m.closest.matched && m.closest.matched.length > 0 && (
                  <span style={{ font: `12px ${FONT_MONO}` }}> · matched: {m.closest.matched.slice(0, 5).join(", ")}</span>
                )}
              </div>
            ) : (
              <div style={{ marginTop: 8, font: `13.5px/1.5 ${FONT_BODY}`, color: T.inkSoft }}>
                Try rephrasing, or search the full documentation at platform.claude.com/docs.
              </div>
            )}
          </div>
        ) : (
          <div style={{ font: `14.5px/1.65 ${FONT_BODY}`, color: T.ink, whiteSpace: "pre-wrap" }}>{m.content}</div>
        )}
        <div style={{ borderTop: `1px solid ${T.line}`, margin: "12px 0 8px" }} />
        <div style={{ font: `10.5px ${FONT_MONO}`, color: T.inkSoft, letterSpacing: "0.03em" }}>{CONFIG.MSG_LABEL}</div>
      </div>
      {m.sources && m.sources.length > 0 && <Sources sources={m.sources} />}
    </div>
  );
}

export default function App() {
  const [acknowledged, setAcknowledged] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingRetry, setPendingRetry] = useState(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const scrollRef = useRef(null);
  const taRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const corpusReadout = useMemo(
    () => `corpus: ${CORPUS.length} chunks · retrieval: client-side BM25 · generation: Sonnet`,
    []
  );
  const [greeting] = useState(() => CONFIG.GREETINGS[Math.floor(Math.random() * CONFIG.GREETINGS.length)]);
  const [showSuggest, setShowSuggest] = useState(true);

  // Tier 1: type-ahead suggestions from the cached Q&A set.
  const suggestions = useMemo(() => {
    if (!showSuggest || loading) return [];
    const s = input.trim().toLowerCase();
    if (s.length < 2) return [];
    const toks = tokenize(s);
    return QA_CACHE.filter((qa) => {
      if (qa.question.toLowerCase().includes(s)) return true;
      const qToks = new Set(tokenize(qa.question));
      return toks.some((t) => qToks.has(t));
    }).slice(0, 5);
  }, [input, showSuggest, loading]);

  async function ask(question) {
    const q = question.trim();
    if (!q || loading) return; // FR-6.3 empty ignored, FR-6.4 no double send
    setInput("");
    setPendingRetry(null);
    // Build API history from prior turns, keeping only assistant turns that
    // have real text content (cached or generated). Out-of-scope and error
    // turns carry no content and the Messages API rejects empty messages, so
    // drop each such turn and the user question it answered, preserving valid
    // user/assistant alternation (FR-4.3, FR-6.5).
    const history = [];
    for (const m of messages) {
      if (m.role === "user") {
        history.push({ role: "user", content: m.content });
      } else if (typeof m.content === "string" && m.content.trim() !== "") {
        history.push({ role: "assistant", content: m.content });
      } else if (history.length && history[history.length - 1].role === "user") {
        history.pop();
      }
    }
    setMessages((prev) => [...prev, { role: "user", content: q }]);

    const results = retrieve(q);
    results.forEach((r, i) => (r.num = i + 1)); // stable citation numbers
    const best = results[0];
    if (!best || best.score < CONFIG.RELEVANCE_MIN) {
      // Graceful out-of-scope: no API call. Show the closest match as a link
      // with the words that connected it, or a plain refusal if nothing matched.
      setMessages((prev) => [...prev, { role: "assistant", outOfScope: true, closest: best || null }]);
      return;
    }

    setLoading(true);
    try {
      const systemPrompt = buildSystemPrompt(results);
      const apiMessages = [...history, { role: "user", content: q }];
      const answer = await callModel(systemPrompt, apiMessages, results);
      // Show only the sources actually cited in the answer (Copilot-style). If
      // the answer cited nothing, fall back to all retrieved sources.
      const cited = [...new Set((answer.match(/\[(\d+)\]/g) || []).map((s) => parseInt(s.slice(1, -1), 10)))];
      const displayed = cited.length ? results.filter((r) => cited.includes(r.num)) : results;
      setMessages((prev) => [...prev, { role: "assistant", content: answer, sources: displayed }]);
    } catch (e) {
      const friendly =
        e.message && e.message !== "empty"
          ? `Request failed: ${e.message} Try sending the message again.`
          : "Request failed. Try sending the message again.";
      setMessages((prev) => [...prev, { role: "assistant", content: "", sources: results, error: friendly }]);
      setPendingRetry(q); // US-6 one-click retry of the same question
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      ask(input);
    }
  }

  function newSession() {
    setMessages([]);
    setPendingRetry(null);
    setInput("");
    setConfirmClear(false);
  }

  // Tier 1: serve a cached answer instantly, no API call.
  function askCached(qa) {
    setShowSuggest(false);
    setInput("");
    setPendingRetry(null);
    const sources = qa.sourceIds.map((id, i) => ({ chunk: CORPUS.find((c) => c.id === id), num: i + 1, score: null }));
    setMessages((prev) => [
      ...prev,
      { role: "user", content: qa.question },
      { role: "assistant", content: qa.answer, sources, cached: true },
    ]);
  }

  // ---- Gate (S0). Top-level conditional render so nothing else is in the DOM (FR-1.4).
  if (!acknowledged) {
    return (
      <div style={{ minHeight: "100vh", background: T.surface, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
        <style>{STYLE}</style>
        <div style={{ width: "100%", maxWidth: 480, background: T.card, border: `1px solid ${T.line}`, borderRadius: 12, padding: 24 }}>
          <h2 style={{ margin: "0 0 14px", font: `600 22px ${FONT_DISPLAY}`, color: T.ink }}>
            Before you start
          </h2>
          {CONFIG.GATE_STATEMENTS.map((line, i) => (
            <p key={i} style={{ font: `14.5px/1.6 ${FONT_BODY}`, color: T.ink, margin: "0 0 12px" }}>
              {line.includes("platform.claude.com/docs") ? (
                <>
                  {line.split("platform.claude.com/docs")[0]}
                  <a href={CONFIG.DOCS_URL} target="_blank" rel="noreferrer" className="cda-focusable" style={{ color: T.accentText, textDecoration: "underline" }}>
                    platform.claude.com/docs
                  </a>
                  {line.split("platform.claude.com/docs")[1]}
                </>
              ) : (
                line
              )}
            </p>
          ))}
          <button
            className="cda-focusable"
            onClick={() => setAcknowledged(true)}
            style={{
              marginTop: 8, width: "100%", minHeight: 44, background: T.accent, color: "#ffffff",
              border: "none", borderRadius: 10, font: `600 15px ${FONT_BODY}`, cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = T.accentHover)}
            onMouseLeave={(e) => (e.currentTarget.style.background = T.accent)}
          >
            I understand
          </button>
        </div>
      </div>
    );
  }

  // ---- Chat (S1 to S5).
  const empty = messages.length === 0;
  const canSend = input.trim().length > 0 && !loading;
  return (
    <div style={{ minHeight: "100vh", background: T.surface, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <style>{STYLE}</style>
      <div style={{ width: "100%", maxWidth: 720, display: "flex", flexDirection: "column", flex: 1, minHeight: "100vh" }}>
        {/* Header */}
        <header style={{ padding: "16px 20px", borderBottom: `1px solid ${T.line}`, background: T.surface }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
            <h1 style={{ margin: 0, font: `600 20px ${FONT_DISPLAY}`, color: T.ink }}>Claude Docs Assistant</h1>
            {confirmClear ? (
              <span style={{ font: `11px ${FONT_MONO}`, color: T.inkSoft, display: "flex", gap: 8, alignItems: "center" }}>
                Clear this conversation?
                <button className="cda-focusable" onClick={newSession} style={{ background: "none", border: "none", color: T.accentText, cursor: "pointer", font: `11px ${FONT_MONO}` }}>Confirm</button>
                <button className="cda-focusable" onClick={() => setConfirmClear(false)} style={{ background: "none", border: "none", color: T.inkSoft, cursor: "pointer", font: `11px ${FONT_MONO}` }}>Keep</button>
              </span>
            ) : (
              !empty && (
                <button className="cda-focusable" onClick={() => setConfirmClear(true)} style={{ background: "none", border: "none", color: T.accentText, cursor: "pointer", font: `11px ${FONT_MONO}` }}>
                  New session
                </button>
              )
            )}
          </div>
          <div style={{ marginTop: 4, font: `11px ${FONT_MONO}`, color: T.inkSoft }}>{corpusReadout}</div>
        </header>

        {/* Message list */}
        <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "8px 20px 20px" }}>
          {empty ? (
            <div style={{ marginTop: 28 }}>
              <h2 style={{ margin: "0 0 8px", font: `600 24px/1.3 ${FONT_DISPLAY}`, color: T.ink }}>{greeting}</h2>
              <p style={{ font: `14.5px/1.6 ${FONT_BODY}`, color: T.inkSoft, maxWidth: 560, margin: "0 0 18px" }}>
                Ask anything covered by the loaded docs on prompt engineering, guardrails, and core build-with-Claude features like tool use, structured outputs, prompt caching, thinking, and streaming. When a question is outside them, this tool says so and points you to the closest section.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {CONFIG.EXAMPLE_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    className="cda-focusable"
                    disabled={loading}
                    onClick={() => {
                      // Example questions all have cached answers, so serve them
                      // instantly with no API call; fall back to retrieval if not.
                      const hit = QA_CACHE.find((e) => e.question === q);
                      hit ? askCached(hit) : ask(q);
                    }}
                    style={{
                      background: T.accentSoft, color: T.ink, border: `1px solid ${T.line}`, borderRadius: 999,
                      padding: "8px 14px", font: `13px ${FONT_BODY}`, cursor: loading ? "default" : "pointer",
                      opacity: loading ? 0.5 : 1,
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m, i) => <Message key={i} m={m} />)
          )}
          {loading && (
            <div style={{ marginTop: 16 }}>
              <span className="cda-shimmer" style={{ font: `12px ${FONT_MONO}`, color: T.inkSoft }}>
                retrieving sections → generating answer…
              </span>
            </div>
          )}
        </div>

        {/* Input area */}
        <div style={{ borderTop: `1px solid ${T.line}`, padding: "12px 20px 16px", background: T.surface }}>
          {pendingRetry && !loading && (
            <button
              className="cda-focusable"
              onClick={() => ask(pendingRetry)}
              style={{ marginBottom: 8, background: "none", border: "none", color: T.accentText, cursor: "pointer", font: `12px ${FONT_MONO}` }}
            >
              Try again
            </button>
          )}
          {suggestions.length > 0 && (
            <div style={{ marginBottom: 8, border: `1px solid ${T.line}`, borderRadius: 12, background: T.card, overflow: "hidden" }}>
              {suggestions.map((qa, i) => (
                <button
                  key={qa.id}
                  className="cda-focusable"
                  onClick={() => askCached(qa)}
                  style={{
                    display: "flex", alignItems: "baseline", gap: 8, width: "100%", textAlign: "left",
                    background: "none", border: "none", borderTop: i ? `1px solid ${T.line}` : "none",
                    padding: "10px 12px", cursor: "pointer", font: `13.5px ${FONT_BODY}`, color: T.ink,
                  }}
                >
                  <span style={{ font: `9.5px ${FONT_MONO}`, letterSpacing: "0.08em", textTransform: "uppercase", color: T.accentText, flexShrink: 0 }}>saved</span>
                  <span>{qa.question}</span>
                </button>
              ))}
            </div>
          )}
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
            <textarea
              ref={taRef}
              className="cda-input cda-focusable"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setShowSuggest(true);
              }}
              onKeyDown={onKeyDown}
              disabled={loading}
              rows={1}
              placeholder="Ask the docs…"
              style={{
                flex: 1, resize: "none", maxHeight: 120, minHeight: 44, padding: "11px 12px",
                border: `1px solid ${T.line}`, borderRadius: 10, background: T.card, color: T.ink,
                font: `14.5px/1.5 ${FONT_BODY}`,
              }}
            />
            <button
              className="cda-focusable"
              onClick={() => ask(input)}
              disabled={!canSend}
              aria-label="Ask"
              style={{
                minHeight: 44, padding: "0 20px", border: "none", borderRadius: 10,
                background: canSend ? T.accent : T.line, color: canSend ? "#ffffff" : T.inkSoft,
                font: `600 14.5px ${FONT_BODY}`, cursor: canSend ? "pointer" : "default",
              }}
            >
              Ask
            </button>
          </div>
          <div style={{ marginTop: 8, font: `10.5px ${FONT_MONO}`, color: T.inkSoft }}>
            Answers grounded in loaded docs only · sources linked below each answer
          </div>
        </div>
      </div>
    </div>
  );
}
