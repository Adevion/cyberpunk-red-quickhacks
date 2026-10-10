import {
  openQuickHackDialog
}
from "./quickhacks.js";

import {
  performBreach
}
from "./breach.js";

export function registerSheetHooks() {

Hooks.on(
"renderActorSheet",
(app, html) => {

const actor =
  app.actor;

const isNetrunner =
actor.items.some(
i =>
i.type === "role" &&
i.system.mainRoleAbility ===
"Interface"
);

if (!isNetrunner)
return;

const controls = $(`
<div class="cpred-edgerunners">

<button
class="cpred-breach">

Breach

</button>

<button
class="cpred-quickhack">

Perform QuickHack

</button>

</div>
`);

html.find(
".role-abilities"
).append(controls);

html.find(
".cpred-breach"
).click(async () => {

const target =
[...game.user.targets][0]?.actor;

if (!target) return;

await performBreach(
actor,
target
);

});

html.find(
".cpred-quickhack"
).click(() => {

openQuickHackDialog(
actor
);

});

});
}