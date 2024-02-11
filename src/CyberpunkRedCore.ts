// @ts-ignore
import CPRChat from "../../../systems/cyberpunk-red-core/modules/chat/cpr-chat.js?12";

export class CyberpunkRedCore implements SystemApi {

    skillList:SkillConfig[] = [];
    _currencyComponent:Component;

    get version() {
        return 2;
    }

    get id() {
        return "cyberpunk-red-core";
    }


    async actorRollSkill(actor, skillId){
        const pack = game["packs"].get("cyberpunk-red-core.internal_skills");
        const item = await pack.getDocument(skillId);
        if(!item){
            ui.notifications?.warn("I do not know skill "+skillId);
            return null;
        }
        const x = item.createRoll("skill",actor);
        const doRoll = await x.handleRollDialog({},actor,item);
        if(doRoll){
            await x.roll();
            // @ts-ignore
            await CPRChat.RenderRollCard(x);
            x._roll._total = x.resultTotal;
            return x._roll;
        }
        return null
    }

    async actorRollAbility(actor, abilityId){
        const x = actor.createRoll("stat",abilityId);
        const doRoll = await x.handleRollDialog({},actor,null);
        if(doRoll){
            await x.roll();
            // @ts-ignore
            await CPRChat.RenderRollCard(x);
            x._roll._total = x.resultTotal;
            return x._roll;
        }
        return null
    }

    actorCurrenciesGet(actor):Currencies {
        return {"wealth":actor["system"].wealth.value};
    }

    async actorCurrenciesStore(actor, currencies: Currencies): Promise<void> {
        await actor.update({system: {wealth:{value:currencies.wealth}}});
    }

    actorSheetAddTab(sheet, html, actor, tabData:{ id: string, label: string, html: string }, tabBody:string):void {
        const tabs = $(html).find('nav.navtabs-right[data-group="primary"]');
        const tabItem = $('<div class="tab-pink-underlay"><a class="tab-label text-semi tab-indent" data-tab="' + tabData.id + '" title="' + tabData.label + '">'+tabData.label+'</a></div>');
        tabs.append(tabItem);
        const body = $(html).find(".right-content-section");
        const tabContent = $('<div class="tab flexcol" style="width:inherit" data-group="primary" data-tab="' + tabData.id + '"></div>');
        body.append(tabContent);
        tabContent.append(tabBody);
    }

    itemSheetReplaceContent(app, html, element):void {
        let value = html.find('.item-details-name').text().trim();
        html.find('.item-details-name').html(`<input name="name" type="text" value='${value}'>`);
        html.find('.item-bottom-tabs-section').remove();
        const sheetBody = html.find('.item-bottom-content-section');
        sheetBody.addClass("flexrow");
        sheetBody.empty();
        sheetBody.append(element);
    }

    get configSkills():SkillConfig[] {
        if(this.skillList.length === 0){
            this.skillList = game["packs"].get("cyberpunk-red-core.internal_skills").index.map(skill=>{
                return {id:skill._id,label:skill.name}
            })
        }
        return this.skillList;
    }

    get configAbilities():AbilityConfig[] {
        return Object.entries(game["i18n"].translations.CPR.global.stats).map(stat=>{
            return {
                id: stat[0],
                label: stat[1] as string
            }
        })
    }

    get currencyComponent():Component{
        if(!this._currencyComponent){
            this._currencyComponent = beaversSystemInterface.componentCreate(
                {
                    type:"Currency",
                    name:"Eurobucks",
                    img:'modules/bsa-cyberpunk-red-core/icons/money-stack.svg'
                });
        }
        return this._currencyComponent;
    }

    get configCurrencies():CurrencyConfig[] {
        return [
            {
                id: "wealth",
                factor: 1,
                label: "Eurobucks",
                component:this.currencyComponent,
            }
        ]
    }

    get configCanRollAbility():boolean {
        return true;
    }
    get configLootItemType(): string {
        return "gear";
    }

    get itemPriceAttribute(): string {
        return "system.price";
    }

    get itemQuantityAttribute(): string {
        return "system.amount";
    }


}