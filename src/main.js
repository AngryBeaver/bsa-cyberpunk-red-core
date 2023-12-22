import {CyberpunkRedCore} from "./CyberpunkRedCore.js";

Hooks.on("beavers-system-interface.init", async function(){
    beaversSystemInterface.register(new CyberpunkRedCore());
});
