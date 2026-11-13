
const config = $ref({
  indexIsEmpty: false,
  agentEnabled: String(import.meta.env.VITE_AGENT_ENABLED ?? "").trim().toLowerCase() === "true",
});

export default config;
