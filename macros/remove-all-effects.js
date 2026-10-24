const actor = token?.actor;

if (!actor) {
  ui.notifications.warn("Select a token.");
  return;
}

await cpredqh.removeAllQuickhackEffects( actor );