import { openQuickHackDialog } from "./quickhacks.js";
import { performBreach } from "./breach.js";
import { getSelfIceCount, getPasswallDV } from "./neuroport.js";

Hooks.once("ready", () => {
  console.log("CPRED-QH Sheet Hook Loaded");
});

function addSelfIceDisplay(actor, html, selector, mode = "prepend") {
  const selfIceCount = getSelfIceCount(actor);
  if (selfIceCount < 1) return;
  const selfIceDV = getPasswallDV(actor);
  html.find(".cpred-self-ice").remove();

  const selfIceDisplay = $(`
    <div class="cpred-self-ice">
      <span class="cpred-self-ice-label">Self-ICE</span>
      <span class="cpred-self-ice-value">
        ${selfIceCount}/3
      </span>
      <span class="cpred-self-ice-dv">
        Passwall DV ${selfIceDV}
      </span>
    </div>
  `);

  const container = html.find(selector).first();
  if (!container.length) return;

  if (mode === "before") {
    container.before(selfIceDisplay);
  } else {
    container.prepend(selfIceDisplay);
  }
}

export function registerSheetHooks() {

  //
  // Character Sheet
  //
  Hooks.on("renderCPRCharacterActorSheet", (app, html) => {
    const actor = app.actor;

    addSelfIceDisplay(
      actor,
      html,
      ".fight-tab"
    );

    const isNetrunner = actor.items.some(
      i =>
        i.type === "role" &&
        i.system.mainRoleAbility === "Interface"
    );

    if (!isNetrunner) return;

    if (html.find(".cpred-edgerunners").length) return;

    const buttontextContent =
      game.i18n.localize("CPEDG.Breach");

    const controls = $(`
      <div class="cpred-edgerunners">
        <div class="cpred-edgerunners-title">
          <b>▶ NET Actions</b>
        </div>

        <button class="cpred-breach">
          <b>${buttontextContent}</b>
        </button>

        <button class="cpred-quickhack">
          <b>Perform QuickHack</b>
        </button>
      </div>
    `);

    html
      .find(".fight-tab")
      .first()
      .prepend(controls);

    controls.find(".cpred-breach")
      .click(async () => {
        const target = [...game.user.targets][0]?.actor;

        if (!target) {
          ui.notifications.warn("Select a target.");
          return;
        }

        await performBreach(actor, target);
      });

    controls.find(".cpred-quickhack")
      .click(() => openQuickHackDialog(actor));
  });

  //
  // Mook Sheet
  //
  Hooks.on("renderCPRMookActorSheet", (app, html) => {
    addSelfIceDisplay(
      app.actor,
      html,
      ".mook-derived-stats",
      "before"
    );
  });
}