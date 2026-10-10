export async function enableDirectConnection(
  actor
) {

  await actor.setFlag(
    "cpred-edgerunners-quickhacks",
    "neuroport.directConnection",
    true
  );

  ui.notifications.info(
    "Direct Connection active."
  );
}