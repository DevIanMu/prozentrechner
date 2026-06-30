const PLACEHOLDER_RULESET_ID = 'YOUR_USERCENTRICS_RULESET_ID';

export function UsercentricsScript() {
  const rulesetId =
    process.env.NEXT_PUBLIC_USERCENTRICS_RULESET_ID?.trim() || PLACEHOLDER_RULESET_ID;

  if (!rulesetId || rulesetId === PLACEHOLDER_RULESET_ID) {
    return null;
  }

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      <script
        src="https://web.cmp.usercentrics.eu/modules/autoblocker.js"
      />
      <script
        id="usercentrics-cmp"
        src="https://web.cmp.usercentrics.eu/ui/loader.js"
        data-ruleset-id={rulesetId}
        async
      />
    </>
  );
}
