//  Cyberpunk RED Quickhack Imports
import { removeQuickhackEffect, removeAllQuickhackEffects, gmDebugLog } from "./gm-utilities.js";
import { executeQuickhackSocket } from "./quickhack-effects.js";

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
  socket.register( "removeQuickhackEffect", removeQuickhackEffect );
  socket.register( "removeAllQuickhackEffects", removeAllQuickhackEffects );
  socket.register( "gmDebugLog", gmDebugLog );
  // Quickhacks
  socket.register( "executeQuickhack", executeQuickhackSocket );
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