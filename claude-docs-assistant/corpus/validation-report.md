# Corpus validation report

Total chunks: 35

## Chunks per page
- Prompting best practices: 15
- Reduce hallucinations: 2
- Increase output consistency: 2
- Mitigate jailbreaks and prompt injections: 2
- Reduce prompt leak: 1
- Reducing latency: 2
- Structured outputs: 2
- Tool use with Claude: 3
- Prompt caching: 2
- Extended thinking: 2
- Streaming messages: 2

## Missing required fields
- none

## Duplicate ids
- none

## Ids without a valid area prefix (pe-/gr-/uc-/te-)
- none

## Keyword count outside 3 to 8
- none

## Token estimate per chunk (chars/4), flagged if outside 150 to 500
- pe-clarity: 237 tokens
- pe-examples: 189 tokens
- pe-xml-tags: 170 tokens
- pe-role: 168 tokens
- pe-long-context: 178 tokens
- pe-output-format: 176 tokens
- pe-chain-of-thought: 203 tokens
- pe-chain-prompts: 206 tokens
- gr-hallucination-basic: 216 tokens
- gr-hallucination-advanced: 208 tokens
- gr-output-consistency: 203 tokens
- gr-keep-character: 195 tokens
- gr-jailbreak-direct: 236 tokens
- gr-jailbreak-indirect: 254 tokens
- gr-prompt-leak: 212 tokens
- pe-tool-use: 183 tokens
- pe-parallel-tools: 181 tokens
- pe-agentic-state: 199 tokens
- pe-subagents: 185 tokens
- pe-overengineering: 204 tokens
- pe-frontend-design: 195 tokens
- pe-vision: 157 tokens
- gr-latency-model: 200 tokens
- gr-latency-tokens: 201 tokens
- bc-structured-outputs: 218 tokens
- bc-structured-schema-limits: 232 tokens
- bc-tool-use-flow: 216 tokens
- bc-tool-choice: 175 tokens
- bc-tool-types: 182 tokens
- bc-prompt-caching: 228 tokens
- bc-prompt-caching-details: 212 tokens
- bc-thinking-manual: 207 tokens
- bc-thinking-adaptive: 208 tokens
- bc-streaming: 161 tokens
- bc-streaming-events: 200 tokens

## Size violations
- none

## All section names (for coverage gap review)
- [pe-clarity] Prompting best practices / Be clear and direct
- [pe-examples] Prompting best practices / Use examples (multishot prompting)
- [pe-xml-tags] Prompting best practices / Structure prompts with XML tags
- [pe-role] Prompting best practices / Give Claude a role (system prompts)
- [pe-long-context] Prompting best practices / Long context prompting
- [pe-output-format] Prompting best practices / Control the format of responses
- [pe-chain-of-thought] Prompting best practices / Chain of thought and thinking
- [pe-chain-prompts] Prompting best practices / Chain complex prompts
- [gr-hallucination-basic] Reduce hallucinations / Basic hallucination minimization strategies
- [gr-hallucination-advanced] Reduce hallucinations / Advanced techniques
- [gr-output-consistency] Increase output consistency / Specify format, examples, and retrieval
- [gr-keep-character] Increase output consistency / Keep Claude in character
- [gr-jailbreak-direct] Mitigate jailbreaks and prompt injections / Jailbreaks and direct prompt injection
- [gr-jailbreak-indirect] Mitigate jailbreaks and prompt injections / Indirect prompt injection
- [gr-prompt-leak] Reduce prompt leak / Strategies to reduce prompt leak
- [pe-tool-use] Prompting best practices / Tool usage
- [pe-parallel-tools] Prompting best practices / Optimize parallel tool calling
- [pe-agentic-state] Prompting best practices / Long-horizon reasoning and state tracking
- [pe-subagents] Prompting best practices / Subagent orchestration
- [pe-overengineering] Prompting best practices / Avoid over-engineering
- [pe-frontend-design] Prompting best practices / Frontend design
- [pe-vision] Prompting best practices / Vision capabilities
- [gr-latency-model] Reducing latency / Measure latency and choose the right model
- [gr-latency-tokens] Reducing latency / Optimize length and stream responses
- [bc-structured-outputs] Structured outputs / JSON outputs
- [bc-structured-schema-limits] Structured outputs / JSON schema limitations
- [bc-tool-use-flow] Tool use with Claude / How tool use works
- [bc-tool-choice] Tool use with Claude / Controlling when Claude uses tools
- [bc-tool-types] Tool use with Claude / Kinds of tools
- [bc-prompt-caching] Prompt caching / How to enable prompt caching
- [bc-prompt-caching-details] Prompt caching / Invalidation, minimums, and tracking
- [bc-thinking-manual] Extended thinking / Manual extended thinking
- [bc-thinking-adaptive] Extended thinking / Adaptive thinking and migration
- [bc-streaming] Streaming messages / Streaming with server-sent events
- [bc-streaming-events] Streaming messages / Event types and order

## Result: PASS, all checks clean
