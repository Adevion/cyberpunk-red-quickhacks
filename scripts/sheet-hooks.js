import { openQuickHackDialog} from "./quickhacks.js";
import { performBreach } from "./breach.js";

console.log("CPRED-QH Sheet Hook");

export function registerSheetHooks() {
  Hooks.on(
    "renderCPRCharacterActorSheet",
    (app, html) => {
      const actor = app.actor;
      const isNetrunner = actor.items.some(
        i =>
          i.type === "role" &&
          i.system.mainRoleAbility === "Interface"
      );

      if (!isNetrunner) return;
      if (html.find(".cpred-edgerunners").length) return;

      const controls = $(`
        <div class="cpred-edgerunners">

          <div class="cpred-edgerunners-title">
            <b>▶ NET Actions</b>
          </div>

          <button class="cpred-breach">
            <b>Breach</b> 
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

      controls
        .find(".cpred-breach")
        .click(async () => {
          const target = [...game.user.targets][0]?.actor;
          if (!target) {
            ui.notifications.warn(
              "Select a target."
            );
            return;
          }

          await performBreach( actor, target );
        });

      controls
        .find(".cpred-quickhack")
        .click(() => {
          openQuickHackDialog(actor);
        });
    }
  );
}