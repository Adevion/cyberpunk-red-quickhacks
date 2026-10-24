/*
const options = [
  { value: "cyberwareMalfunction", label: "Cyberware Malfunction" },
  { value: "impairedMovement",    label: "Impaired Movement" },
  { value: "lure",                label: "Lure" },
  { value: "overheat",            label: "Overheat" },
  { value: "puppet",              label: "Puppet" },
  { value: "shortCircuit",        label: "Short Circuit" },
  { value: "slow",                label: "Slow" },
  { value: "sonicShock",          label: "Sonic Shock" },
  { value: "systemReset",         label: "System Reset" }
];
*/

const actor = token?.actor;

if (!actor) {
  ui.notifications.warn("Select a token.");
  return;
}

const effects = actor.effects
  .filter(e =>
    e.getFlag(
      "cyberpunk-red-quickhacks",
      "quickhack"
    )
  );

if (!effects.length) {
  ui.notifications.warn(
    `${actor.name} has no Quickhack effects.`
  );
  return;
}

new Dialog({
  title: "Remove Quickhack Effect",
  content: `
    <form>
      <div class="form-group">
        <label>Effect</label>
        <select id="effect" style="width:100%;">
          ${effects.map(e => {
            const qh = e.getFlag( "cyberpunk-red-quickhacks", "quickhack" );
            return `<option value="${qh}">${qh}</option>`;
          }).join("")}
        </select>
      </div>
    </form>
  `,
  buttons: {
    remove: {
      label: "Remove",
      callback: async html => {
        const effect = html.find("#effect").val();
        await cpredqh.removeQuickhackEffect( actor.uuid, effect );
      }
    }
  },
  default: "remove"
}).render(true);

