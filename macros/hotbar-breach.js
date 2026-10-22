const actor = canvas.tokens.controlled[0]?.actor ?? game.user.character; 

if (!actor) { 
    ui.notifications.warn( "Select your Netrunner token or assign a character to your user." );
    return;
} 

const target = [...game.user.targets][0]?.actor; 

if (!target) { 
    ui.notifications.warn( "Target a token first." );
    return;
} 

if (!window.cpredqh?.performBreach) { 
    ui.notifications.error("QuickHacks module API is not ready. Reload Foundry and try again.");
    return;
} 

await window.cpredqh.performBreach(actor, target);