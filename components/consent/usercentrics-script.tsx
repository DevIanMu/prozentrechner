const PLACEHOLDER_SETTINGS_ID = 'YOUR_USERCENTRICS_SETTINGS_ID';

export function UsercentricsScript() {
  const settingsId =
    process.env.NEXT_PUBLIC_USERCENTRICS_SETTINGS_ID?.trim() || PLACEHOLDER_SETTINGS_ID;

  if (!settingsId || settingsId === PLACEHOLDER_SETTINGS_ID) {
    return null;
  }

  return (
    <script
      id="usercentrics-cmp"
      src="https://app.usercentrics.eu/latest/main.js"
      data-settings-id={settingsId}
      data-eu-mode="true"
      async
    />
  );
}
