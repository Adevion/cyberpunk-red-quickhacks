# Cyberpunk RED: Edgerunners QuickHacks

A Foundry VTT module for Cyberpunk RED that adds the QuickHack system from the Cyberpunk: Edgerunners Mission Kit.

## Features

### QuickHacks

Adds 11 QuickHack Programs:

#### Simple (DV 6)

- Impair Movement
- Sonic Shock

#### Standard (DV 8)

- Overheat
- Short Circuit

#### Difficult (DV 10)

- Cyberware Malfunction
- Lure
- Slow
- Synapse Burnout

#### Advanced (DV 12)

- Puppet
- Shard Ejection
- System Reset

### New NET Actions

- Breach
- Perform QuickHack

### Cyberware

- Self-ICE

### Drugs

- Immunoblockers

### Reference Journals

- QuickHack Reference
- QuickHack Cost Table
- QuickHack DV Reference
- Neuroport Security
- QuickHacking Cyberware
- Direct Connection Netrunning
- Self-ICE Rules
- QuickHack Range Reference

## Automation

Current automation includes:

- Breach DV calculation
- Self-ICE detection
- QuickHack execution dialog
- QuickHack status effects
- MOVE reduction effects
- Damage automation for Synapse Burnout
- Overheat state tracking
- Cyberware disabling support
- Direct Connection tracking
- Neuroport flag tracking

## Status Effects

The module adds:

- QuickHacked
- Breached
- Sonic Shock
- System Reset
- Direct Connection

## Requirements

- Foundry VTT v12 Build 343+
- Cyberpunk RED Core v0.92.4+

## Installation

1. Download the latest release ZIP.
2. Extract into:

   Data/modules/

3. Enable:

   Cyberpunk RED: Edgerunners QuickHacks

4. Start your world.

## Module Structure

```text
data/
├── quickhacks/
├── cyberware/
├── drugs/
├── netactions/
└── journals/

scripts/
├── breach.js
├── compendium-loader.js
├── direct-connection.js
├── effects.js
├── flags.js
├── migration.js
├── module.js
├── neuroport.js
├── quickhack-effects.js
├── quickhacks.js
├── settings.js
└── sheet-hooks.js
```

## Current Known Limitations

This is currently an early implementation.

The following systems are partially automated and may still require GM interaction:

- Puppet
- Lure
- Short Circuit
- Cyberware Malfunction
- Shard Ejection

## Planned Features

- Neuroport tracker panel
- QuickHack range validation
- Scene-based shard drops
- Advanced CPR sheet integration
- Full Direct Connection automation
- Black ICE support

## License

GPL-3.0

## Credits

Cyberpunk RED © R. Talsorian Games.

Cyberpunk: Edgerunners © CD Projekt Red / Studio Trigger.

This module is a fan-made add-on for Foundry VTT and is not affiliated with or endorsed by R. Talsorian Games, CD Projekt Red, or Foundry Gaming LLC.

## Changelog

### v1.0.0
- Initial release
- Added 11 QuickHacks
- Added Breach NET Action
- Added Perform QuickHack NET Action
- Added Self-ICE
- Added Immunoblockers
- Added QuickHack journals