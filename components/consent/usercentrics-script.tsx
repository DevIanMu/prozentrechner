const PLACEHOLDER_RULESET_ID = 'YOUR_USERCENTRICS_RULESET_ID';

export function UsercentricsLoaderScript() {
  const rulesetId =
    process.env.NEXT_PUBLIC_USERCENTRICS_RULESET_ID?.trim() || PLACEHOLDER_RULESET_ID;

  if (!rulesetId || rulesetId === PLACEHOLDER_RULESET_ID) {
    return null;
  }

  return (
    <script
      id="usercentrics-cmp"
      src="https://web.cmp.usercentrics.eu/ui/loader.js"
      data-ruleset-id={rulesetId}
      async
    />
  );
}
