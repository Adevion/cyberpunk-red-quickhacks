export function getSelfIceCount(actor) {

  const installs = actor.items.filter(
    i =>
      i.type === "cyberware" &&
      i.name === "Self-ICE"
  );

  return Math.min(installs.length, 3);
}

export function getPasswallDV(actor) {

  const count = getSelfIceCount(actor);

  switch (count) {
    case 1: return 6;
    case 2: return 8;
    case 3: return 10;
    default: return 0;
  }
}