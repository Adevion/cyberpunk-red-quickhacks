### v0.2.0

Added: 
✓ Full multiplayer support via SocketLib 
✓ Automated QuickHack execution 
✓ Neuroport Breach workflow 
✓ Self-ICE support 
✓ Dedicated Breach roll card 
✓ Interface Rank 3 auto-bypass support 
✓ Installed Cyberdeck QuickHack filtering 
✓ Status effects 
✓ GM cleanup utilities 
✓ Debug mode 
✓ GM audit logging

Breach System
✓ Added Self-ICE support 
✓ Added Passwall DV handling 
✓ Added Interface Rank 3 auto-bypass 
✓ Added Neuroport breach tracking 
✓ Added Breach status effect 
✓ Added dedicated Breach chat card

Improved:
✓ Firefox compatibility for status effect icons 
✓ Breach UX and player feedback 
✓ GM and Player execution workflows

Notes:
All implemented Quickhacks now function for both Players and GMs against GM-owned NPCs.

### v0.1.0

Added:
# CPR Roll Integration
✓ Migrated Breach to CPRInterfaceRoll
✓ Migrated QuickHack execution rolls to CPRInterfaceRoll
✓ Migrated Synapse Burnout to CPRDamageRoll
✓ Migrated Slow to CPRDamageRoll

# Native CPR Features
✓ Critical Success support
✓ Critical Failure support
✓ Critical Damage (+5) support
✓ Luck spending support
✓ Additional Modifier support
✓ Situational Modifier support
✓ CPR roll dialogs

# Roll Cards
✓ New expandable CPR-style roll cards
✓ Critical roll display
✓ Critical damage display
✓ Interface Rank display
✓ Luck breakdown display
✓ Modifier breakdown display
✓ Modifier tooltips
✓ Success / Failure indicators
✓ Shared support for Interface and Damage rolls

Improved:
# Breach
✓ Replaced custom roll logic with CPR roll framework
✓ Added Luck spending
✓ Added modifier support
✓ Added crit support
✓ Added Luck deduction

# QuickHack Execution
✓ Converted to CPR roll framework
✓ Added Luck spending
✓ Added modifier support
✓ Added crit support
✓ Added expandable roll breakdowns

# Dialogs
✓ Added target information to QuickHack dialog
✓ Improved Cyberware Malfunction dialog layout
✓ Improved Short Circuit dialog layout
✓ Improved Shard Ejection dialog layout
✓ Added Enter-to-submit support for Lure
✓ Added Enter-to-submit support for Puppet

# Internal
✓ Unified roll card infrastructure
✓ Shared support for CPR Interface and Damage rolls
✓ Increased CPR Core compatibility

# Known Issues
* CPR currently allows spending more Luck than available. This behavior exists in native CPR and remains unchanged for compatibility.

### v0.0.3

Added:
# CPR Roll Cards
✓ Added CPR-style d6 roll cards
✓ Added CPR-style d10 roll cards
✓ Added reusable dice roll card framework
✓ Added support for custom roll card descriptions

# Visual Feedback
✓ Added PREEM success image support
✓ Added FAIL failure image support
✓ Added centered result image rendering
✓ Added dice size scaling based on dice count

# Breach
✓ Added CPR-style Breach roll card
✓ Added Breach success/failure result images
✓ Added Breach result integration into roll cards

Changed: 
# Synapse Burnout
✓ Migrated from Foundry default dice messages to CPR roll cards
✓ Integrated damage results into roll card descriptions

# Slow
✓ Migrated from Foundry default dice messages to CPR roll cards
✓ Integrated MOVE penalty results into roll card descriptions

# Roll Card Polish
✓ Standardized d6 and d10 card layouts
✓ Standardized subtitles and descriptions
✓ Improved visual consistency across QuickHacks and Breach
✓ Reduced duplicate chat messages

Fixed: 
# System Reset
✓ Improved damage interrupt handling
✓ Added ownership tracking for unconscious status removal
✓ Prevented unintended unconscious cleanup outside System Reset effects

Module Updates: 
* Fixed release tag naming for Foundry package updates

Technical: 
✓ Added generic postRollCard() helper
✓ Added reusable dice roll card template system
✓ Refactored Breach, Slow, and Synapse Burnout to use shared roll card logic

### v0.0.2

Added: 
✓ Complete QuickHack suite implementation
✓ Sonic Shock automation
✓ Overheat automation
✓ Impair Movement automation
✓ Slow automation
✓ Short Circuit automation
✓ Cyberware Malfunction automation
✓ Lure automation
✓ Puppet automation
✓ System Reset automation
✓ Synapse Burnout automation
✓ Shard Ejection automation

Added:
✓ CPR-style QuickHack roll cards
✓ Effect duration and expiration system
✓ GM instruction whispers for Lure and Puppet
✓ Critical Injury integration
✓ System Reset damage interrupt

Changed:
✓ QuickHack result messages now use the attacking actor as speaker
✓ Improved cyberware filtering
✓ Improved cyberware selection dialogs

Known Future Improvements
* Merge QuickHack result cards into roll cards
* Protect unrelated unconscious statuses from System Reset cleanup
* Additional QuickHack visual polish

### v0.0.1

Start of Project.
Adds Cyberpunk Edgerunners Mission Kit Quickhacks.