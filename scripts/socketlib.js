//  Cyberpunk RED QuickHack Imports
import { removeQuickHackEffect, removeAllQuickHackEffects, gmDebugLog } from "./gm-utilities.js";
import { executeQuickHackSocket } from "./quickhack-effects.js";

//  Quickhacks
import { applyBreach } from "./breach.js";
import { applyLureEffect } from "./quickhack-effects.js";
import { applyPuppetEffect } from "./quickhack-effects.js";
import { applyCyberwareMalfunctionEffect } from "./quickhack-effects.js";
import { applyShardEjectionEffect } from "./quickhack-effects.js";
import { applyShortCircuitEffect } from "./quickhack-effects.js";

let socket;

export function registerSocketLib() {
  // Socket Registration
  socket = socketlib.registerModule("cyberpunk-red-quickhacks");
  // Macrco's & GM Tools
  socket.register( "removeQuickHackEffect", removeQuickHackEffect );
  socket.register( "removeAllQuickHackEffects", removeAllQuickHackEffects );
  socket.register( "gmDebugLog", gmDebugLog );
  // Quickhacks
  socket.register( "executeQuickHack", executeQuickHackSocket );
  socket.register( "applyLureEffect", applyLureEffect );
  socket.register( "applyPuppetEffect", applyPuppetEffect );
  socket.register( "applyCyberwareMalfunctionEffect", applyCyberwareMalfunctionEffect );
  socket.register( "applyShardEjectionEffect", applyShardEjectionEffect );
  socket.register( "applyShortCircuitEffect", applyShortCircuitEffect );
  // Breach
  socket.register( "applyBreach", applyBreach );
}

export function getSocket() {
  return socket;
}