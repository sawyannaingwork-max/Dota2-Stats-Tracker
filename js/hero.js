import heroes from "./../helpers/heroes.js";
import heroAbilities from "./../helpers/heroAbilities.js";
import abilities from "./../helpers/abilities.js";
import lores from "./../helpers/heroLores.js";
import itemIds from "./../helpers/itemsId.js";
import items from "./../helpers/items.js";
import { showLoading, hideLoading, showInViewPort, toggleMenu } from "./common.js";


// Selecting Dom
const heroInfo = document.querySelector(".hero-info");
const spellsBtn = document.querySelector(".spells");
const itemsBtn = document.querySelector(".items");
const matchesBtn = document.querySelector(".matches");
const matchUpsBtn = document.querySelector(".match-ups");
const spellContainer = document.querySelector(".spells-container");
const itemContainer = document.querySelector(".recommand-container");
const matchContainer = document.querySelector(".matches-container");
const matchupContainer = document.querySelector(".matchups-container");
const tab = document.querySelector(".tabs");
const menuBar = document.querySelector(".menu-bar");

// State Variable
let id;
let itemFetch = false;
let matchesFetch = false;
let matchUpFetch = false;

document.addEventListener("DOMContentLoaded", () => 
{
    showInViewPort(tab);
    // Getting url search param
    const params = new URLSearchParams(window.location.search);

    id = params.get("id");

    const hero = heroes[id];

    // Getting hero Data
    addHeroData(hero.localized_name, hero.img, hero.primary_attr, hero.roles, hero.attack_type);


    // Adding hero lore to dom
    addHeroLore(lores[hero.name.replace("npc_dota_hero_", "")]);

    // getting all the abilities of hero
    const spells = heroAbilities[hero.name].abilities;

    // Adding each spell to Dom
    for (const spell of spells)
    {
        if (abilities[spell].is_innate || abilities[spell].behavior === "Hidden")
        {
            continue;
        }
        // ADd hero spell to dom
        addHeroSpell(abilities[spell])
    }

    // Show First spell and hide other
    document.querySelector(".spell-img").classList.add("selected");
    document.querySelector(".spell-info").classList.add("selected");

})

// Adding Event on buttons
spellsBtn.addEventListener("click", function()
{
    loadView("spells");
})

menuBar.addEventListener("click", function()
{
    toggleMenu();
})

itemsBtn.addEventListener("click", function()
{
    loadView("items");

    if (itemFetch)
    {
        return;
    }

    getRecommandItems();
})

matchesBtn.addEventListener("click", function()
{
    loadView("matches");

    if (matchesFetch)
    {
        return;
    }
    getMatches()
})

matchUpsBtn.addEventListener("click", function()
{
    loadView("matchups");

    if (matchUpFetch)
    {
        return;
    }
    
    getMatchUps();
})

// Function for adding hero info to dom
function addHeroData(name, img, attribute, roles, type)
{
    // Creating a div
    const div = document.createElement("div");
    div.className = "hero-data";

    let attributeUrl;
    let attributeName;

    // Choosing attribute image
    switch (attribute)
    {
        case "agi":
            attributeUrl = "./../assets/agility.webp";
            attributeName = "Agility";
            break;

        case "int":
            attributeUrl = "./../assets/intel.webp";
            attributeName = "Intelligence";
            break;

        case "str":
            attributeUrl = "./../assets/strength.webp";
            attributeName = "Strength";
            break;

        case "all":
            attributeUrl = "./../assets/universal.webp";
            attributeName = "Universal";
            break;
    }

    div.innerHTML = `
        <img src="https://cdn.cloudflare.steamstatic.com/${img} alt="${name}" class="hero-img"/>
        <div class="hero-stat">
            <div>
                <h3>${attributeName}</h3>
                <img src="${attributeUrl}" alt="${attributeName}" />
            </div>
            <p class="hero-type">${type}</p>
            <p class="hero-roles">${roles.join(" ")}</p>
        </div>
    `
    heroInfo.append(div);

    // Showing into view port
    showInViewPort(div);
}

// Function for adding hero Lore
function addHeroLore(lore)
{
    // Creating a paragram
    const div = document.createElement("div");
    div.className = "hero-lore";

    div.innerHTML = `
        <h2>Lore</h2>
        <p>${lore}<p>
    `

    heroInfo.append(div);

    showInViewPort(div);
}

// Function for adding hero spell
function addHeroSpell(spell)
{
    // Create a div 
    const div = document.createElement("div");
    div.className = "hero-spell";

    div.innerHTML = `
        <img src="https://cdn.cloudflare.steamstatic.com${spell.img}" alt="${spell.dname}" class="spell-img"/>
    `

    // Create another div foro spell info
    const info = document.createElement("div");
    info.className = "spell-info";

    // For the descripting that swill sure include
    info.innerHTML = `
        <h5>${spell.dname}</h5>
        <p>${spell.behavior}</p>
        <p class="spell-desc">${spell.desc}</p>
    `

   // For the description that may or may not exists
   createSpellInfo(info, "Damage Type", spell.dmg_type);
   createSpellInfo(info, "Dispellable", spell.dispellable);
   createSpellInfo(info, "BKB Pierce", spell.bkkpierce);
   createSpellInfo(info, "Cool Down", spell.cd);
   createSpellInfo(info, "Mana Cost", spell.mc);

   // for the spell attribute
   createSpellAttribute(info, spell.attrib);

   div.append(info);
   spellContainer.append(div);

   showInViewPort(div);

   div.addEventListener("click", function()
    {
        // removing selected class from other spells
        const spellImgs = document.querySelectorAll(".spell-img");
        const spellInfos = document.querySelectorAll(".spell-info");

        spellImgs.forEach(img => img.classList.remove("selected"));
        spellInfos.forEach(info => info.classList.remove("selected"));

        // adding selected class to clicked spell
        this.querySelector(".spell-img").classList.add("selected");
        this.querySelector(".spell-info").classList.add("selected");
    })
   
   spellContainer.scrollIntoView({behavior : "smooth"})
}

// Function for loading different view
function loadView(type)
{
    switch(type)
    {
        case "spells":
            spellContainer.style.display = "grid";
            itemContainer.style.display = "none";
            matchContainer.style.display = "none";
            matchupContainer.style.display = "none";
            spellsBtn.classList.add("selected");
            itemsBtn.classList.remove("selected");
            matchesBtn.classList.remove("selected");
            matchUpsBtn.classList.remove("selected");
            break;

        case "items":
            spellContainer.style.display = "none";
            itemContainer.style.display = "grid";
            matchContainer.style.display = "none";
            matchupContainer.style.display = "none";
            spellsBtn.classList.remove("selected");
            itemsBtn.classList.add("selected");
            matchesBtn.classList.remove("selected");
            matchUpsBtn.classList.remove("selected");
            break;
        
        case "matches":
            spellContainer.style.display = "none";
            itemContainer.style.display = "none";
            matchContainer.style.display = "block";
            matchupContainer.style.display = "none";
            spellsBtn.classList.remove("selected");
            itemsBtn.classList.remove("selected");
            matchesBtn.classList.add("selected");
            matchUpsBtn.classList.remove("selected");
            break;
        
        case "matchups":
            spellContainer.style.display = "none";
            itemContainer.style.display = "none";
            matchContainer.style.display = "none";
            matchupContainer.style.display = "block";
            spellsBtn.classList.remove("selected");
            itemsBtn.classList.remove("selected");
            matchesBtn.classList.remove("selected");
            matchUpsBtn.classList.add("selected");
            break;
    }
}

// function for creating a div for spell info
function createSpellInfo(obj, text, value)
{
    if (!value)
    {
        return;
    }

    const div = document.createElement("div");
    div.innerHTML = `
        <span>${text}</span>
        <span>${Array.isArray(value)? value.join(" ") : value}</span>
    `
    obj.append(div);
}

// Function for creating spell attribute
function createSpellAttribute(obj, items)
{
    const attribute = document.createElement("div");
    attribute.className = "spell-attribute";

    // looping each item
    for (const item of items)
    {
        const div = document.createElement("div");
        div.innerHTML = `
            <span>${item.header}</span>
            <span>${Array.isArray(item.value)? item.value.join(" "): item.value}</span>
        `

        attribute.append(div);
    }

    obj.append(attribute);
}

// Function for getting recommand items
async function getRecommandItems()
{
    try 
    {
        // Show Loading animation
        showLoading(itemContainer);
        const response = await fetch(`https://api.opendota.com/api/heroes/${id}/itemPopularity`);

        if (response.ok)
        {
            itemFetch = true;

            const recommandItems = await response.json();

            // Hide Loading
            hideLoading(itemContainer);

            addRecommandItems(recommandItems.start_game_items, "Starting Items");
            addRecommandItems(recommandItems.early_game_items, "Early Items");
            addRecommandItems(recommandItems.mid_game_items, "Mid Game Items");
            addRecommandItems(recommandItems.late_game_items, "Late Game Items");

        }

        else 
        {
            // hide loading
            hideLoading(itemContainer);
            itemContainer.textContent = "Something Went wrong, try again later";
        }
    }

    catch(error)
    {
        // hide loading
        hideLoading(itemContainer);
        itemContainer.textContent = "Something Went wrong, try again later";
    }
}


// Function for adding RecommandItems
function addRecommandItems(recommandItems, text)
{
    // Create a div
    const div = document.createElement("div");
    div.className = "recommand-items"
    div.innerHTML = `
        <h2>${text}</h2>
    `

    // Create a continaer
    const container = document.createElement("container");
    container.className = "items-container"

    // Loop reommand items
    for (const id in recommandItems)
    {
        // Create an immg
        const img = document.createElement("img");
        img.src = `https://cdn.cloudflare.steamstatic.com${items[itemIds[id]].img}` 
        img.alt = itemIds[id];

        container.append(img);
    }

    div.append(container);

    itemContainer.append(div);
    itemContainer.scrollIntoView({behavior : "smooth"})
}

// Function for getting matches
async function getMatches()
{
    try 
    {
        // Show loading
        showLoading(matchContainer);
        const response = await fetch(`https://api.opendota.com/api/heroes/${id}/matches`)

        if (response.ok)
        {
            matchesFetch = true;
            const data = await response.json();

            // Hide Loading
            hideLoading(matchContainer);
            // Adding matches to DOM
            addMatches(data);
        }

        else 
        {
            hideLoading(matchContainer);
            matchContainer.textContent = "Something Went wrong, try again later";
        }
    }

    catch(error)
    {
        hideLoading(matchContainer);
        matchContainer.textContent = "Something Went wrong, try again later";
    }
}

// Function for adding matches
function addMatches(matches)
{
    for (let i = 0; i < 100; i++)
    {
        // Create a div
        const div = document.createElement("div");
        div.dataset.id = matches[i].match_id;
        div.className = "match";
        
        console.log(matches);
        let result;
        // Deciding Result
        if(((matches[i].player_slot >= 0 && matches[i].player_slot < 5) && matches[i].radiant_win) || ((matches[i].player_slot >= 128 && matches[i].player_slot < 132) && !matches[i].radiant_win))
        {
            result = "W";
        }

        else 
        {
            result = "L"
        }

        div.innerHTML = `
            <img src="https://cdn.cloudflare.steamstatic.com${heroes[id].img}" alt="${heroes[id].localized_name}" />
            <h3>${matches[i].league_name}</h3>
            <p>${matches[i].kills}/${matches[i].deaths}/${matches[i].assists}</p>
            <p class="${result}">${result}</p>
        `

        // Adding event on div
        // When the div is clicked go to another page
        div.addEventListener("click", function()
        {
            window.location.href = `match.html?id=${this.dataset.id}`
        })
        matchContainer.append(div);
        matchContainer.scrollIntoView({behavior : "smooth"})
    }

}

// Function for getting match ups
async function getMatchUps()
{
    try 
    {
        // show loading
        showLoading(matchupContainer);
        const response = await fetch(`https://api.opendota.com/api/heroes/${id}/matchups`)

        if (response.ok)
        {
            matchUpFetch = true;

            const data = await response.json();

            // hide loading
            hideLoading(matchupContainer);
            // Adding match ups to dom
            addMatchUps(data);
        }

        else 
        {
            hideLoading(matchupContainer);
            matchupContainer.textContent = "Something Went wrong, try again later";
        }
    }

    catch(error)
    {
        hideLoading(matchupContainer);
        matchupContainer.textContent = "Something Went wrong, try again later";
    }
}

function addMatchUps(data)
{
    // Create a ul
    const ul = document.createElement("ul");
    ul.className = "matchup-header";

    ul.innerHTML = `
        <li>Hero</li>
        <li>Total</li>
        <li>Win</li>
        <li>Win Rate</li>
    `

    matchupContainer.append(ul);

    // Creating another ul
    const container = document.createElement("ul");
    container.className = "matchups"

    matchupContainer.append(container);

    for (const item of data)
    {
        // Create a li
        const li = document.createElement("li");

        li.innerHTML = `
            <div>
                <img data-id=${item.hero_id} src="https://cdn.cloudflare.steamstatic.com${heroes[item.hero_id].img}" alt="${heroes[item.hero_id].localized_name}" />
            </div>
            <span>${item.games_played}</span>
            <span>${item.wins}</span>
            <span>${(item.wins / item.games_played * 100).toFixed(2) }%</span>
        `

        container.append(li);
    }

    matchupContainer.scrollIntoView({behavior : "smooth"})
}