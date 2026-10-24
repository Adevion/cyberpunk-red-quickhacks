export const QUICKHACK_EFFECTS = [
  {
    id: "quickhacked",
    label: "Quickhacked",
    icon: "modules/cyberpunk-red-quickhacks/icons/svg/lightning.svg"
  },
  {
    id: "breached",
    label: "Breached",
    icon: "modules/cyberpunk-red-quickhacks/icons/svg/whiplash.svg"
  },
  {
    id: "sonicShock",
    label: "Sonic Shock",
    icon: "modules/cyberpunk-red-quickhacks/icons/svg/sonic-boom.svg"
  },
  {
    id: "lure",
    label: "Lure",
    icon: "modules/cyberpunk-red-quickhacks/icons/svg/fishing-lure.svg"
  },
  {
    id: "puppet",
    label: "Puppet",
    icon: "modules/cyberpunk-red-quickhacks/icons/svg/puppet.svg"
  },
  {
    id: "shortCircuit",
    label: "Short Circuit",
    icon: "modules/cyberpunk-red-quickhacks/icons/svg/sonic-lightning.svg"
  },
  {
    id: "cyberwareMalfunction",
    label: "Cyberware Malfunction",
    icon: "modules/cyberpunk-red-quickhacks/icons/svg/skeleton-inside.svg"
  },
  {
    id: "systemReset",
    label: "System Reset",
    icon: "modules/cyberpunk-red-quickhacks/icons/svg/unconcious.svg"
  },
  {
    id: "directConnection",
    label: "Direct Connection",
    icon: "modules/cyberpunk-red-quickhacks/icons/svg/unplugged.svg"
  },
  {
    id: "slow",
    label: "Slow",
    icon: "modules/cyberpunk-red-quickhacks/icons/svg/sticky-boot.svg"
  },
  {
    id: "impairedMovement",
    label: "Impaired Movement",
    icon: "modules/cyberpunk-red-quickhacks/icons/svg/broken_leg.svg"
  },
  {
    id: "overheat",
    label: "Overheat",
    icon: "modules/cyberpunk-red-quickhacks/icons/svg/on_fire.svg"
  }
  
];

export function registerEffects() {
  CONFIG.statusEffects.push( ...QUICKHACK_EFFECTS );
}