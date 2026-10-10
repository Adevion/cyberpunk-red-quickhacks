export async function enableDirectConnection(
  actor
) {

  await actor.setFlag(
    "cyberpunk-red-quickhacks",
    "neuroport.directConnection",
    true
  );

  ui.notifications.info(
    "Direct Connection active."
  );
}