import {CyberpunkRedCore} from "./CyberpunkRedCore.js";

Hooks.on("beavers-system-interface.init", async function(){
    beaversSystemInterface.register(new CyberpunkRedCore());
});

Hooks.on("beavers-system-interface.ready", async function(){
    import("./AbilityTest.js")
    import("./SkillTest.js")
});