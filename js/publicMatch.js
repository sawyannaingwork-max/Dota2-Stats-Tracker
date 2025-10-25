import heroes from "./../helpers/heroes.js";
import abilities from "./../helpers/abilities.js";
import abilityIds from "./../helpers/ability_ids.js"
import items from "./../helpers/items.js";
import itemIds from "./../helpers/itemsId.js";
import heroIds from "./../helpers/heroIds.js";
import { showLoading, hideLoading, toggleMenu } from "./common.js";

// DOM
const vsInfo = document.querySelector(".vs-info");
const main = document.querySelector("main");
const radiantBtn = document.querySelector(".radiant-btn");
const direBtn = document.querySelector(".dire-btn");
const matchPage = document.querySelector(".match-page");
const buttonList = document.querySelector(".button-list");
const menuBar = document.querySelector(".menu-bar");

document.addEventListener("DOMContentLoaded", function()
{
    buttonList.style.display = "none";

    // Getting search params
    const searchParams = new URLSearchParams(window.location.search);

    // Getting search id 
    const id = searchParams.get("id");

    // Fetch Data for the match
    getMatchData(id);
})

radiantBtn.addEventListener("click", function()
{
    document.querySelector(".radiant").style.display = "block";
    document.querySelector(".dire").style.display = "none";
    this.classList.add("active");
    direBtn.classList.remove("active")
})

direBtn.addEventListener("click", function()
{
    document.querySelector(".radiant").style.display = "none";
    document.querySelector(".dire").style.display = "block";
    this.classList.add("active");
    radiantBtn.classList.remove("active")
})

menuBar.addEventListener("click", function()
{
    toggleMenu();
})

// For Getting match data
async function getMatchData(id)
{
    try 
    {
        showLoading(matchPage);
        const response = await fetch(`https://api.opendota.com/api/matches/${id}`);

        if (response.ok)
        {
            const data = await response.json();

            hideLoading(matchPage);
            buttonList.style.display = "flex";

            // Modify button
            radiantBtn.innerHTML = `
                <div>
                    <h3>Radiant</h3>
                </div>
                <span>${data.radiant_score}</span>
            `;

            direBtn.innerHTML = `
                <div>
                    <h3>Dire</h3>
                </div>
                <span>${data.dire_score}</span>
            `;

            // Add Basic Match Info(result and duration) ot dom
            addMatchInfo(data.duration, data.radiant_win)

            // Add Radiant heros
            addHeroIcons(data.players.slice(0, 5));

            // Adding Versu
            addVs();

            // Add Dire heroes
            addHeroIcons(data.players.slice(5, 10));

            // Add Radiant team info to dom
            addTeamInfo("radiant", data.players.slice(0, 5))

            // Add Dire team info to dom
            addTeamInfo("dire", data.players.slice(5, 10))
        }

        else 
        {
            hideLoading(matchPage);
            matchPage.textContent = "Something Went wrong, try again later";
        }
    }

    catch(error)
    {
        hideLoading(matchPage);
        matchPage.textContent = "Something Went wrong, try again later";
    }
}


// Function for adding match info to dom
function addMatchInfo(duration, isRadiantWin)
{
    // Coverte duration from second to hour:min
    const time = convertTime(duration);

    document.querySelector(".match-info").innerHTML = `
        <h2>${isRadiantWin? "Radiant Win" : "Dire Win"}</h2>
        <span>${time}</span>
    `
}

// Functoion for converting duration
function convertTime(duration)
{
     // Converting to minutes
     const minutes = Math.floor(duration / 60);
     const seconds = duration % 60;

     return `${minutes}:${seconds}`
}

// Function for Addting team info
function addTeamInfo(className, players)
{
    // Create a div 
    const div = document.createElement("div");
    div.className = className;

    // Getting an element that contains the basic info(exp, gold, kda)
    const basicInfo = getBasicInfo(players);

    div.append(basicInfo);

    const mark = className === "radiant"? "r" : "d";

    // Getting a list of hero images
    const heroList = getHeroList(players, mark);

    div.append(heroList);

    // Adding Damage Info
    const damageInfo = getDamageInfo(players);

    div.append(damageInfo);

    // Getting Item Slots
    const itemSlots = getItemSlots(players);

    div.append(itemSlots);

    // Getting Spell Order 
    const spellOrders = getSpellOrders(players);

    div.append(spellOrders);


    main.append(div);
}

// Function for adding hero icons
function addHeroIcons(players)
{
    // create a div
    const div = document.createElement("div");
    div.className = "heroes-icon-container"

    // Loop each player and add heor icon
    for (const player of players)
    {
        // Create an image 
        const heroIcon = document.createElement("img");
        heroIcon.className = "hero-icon";
        heroIcon.src = `https://cdn.cloudflare.steamstatic.com${heroes[player.hero_id].icon}`

        div.append(heroIcon);
    }

    vsInfo.append(div);
}

// function addVs
function addVs()
{
    const span = document.createElement("span");
    span.textContent = "VS";

    vsInfo.append(span);
}

// Function for getting basic info
function getBasicInfo(players)
{
    // Create a div
    const div = document.createElement("div");
    div.className = "basic-info";

    for (const player of players)
    {
        // Create another div
        const element = document.createElement("div");
        element.className = "player";

        element.innerHTML = `
            <div>
                <img src=${`https://cdn.cloudflare.steamstatic.com${heroes[player.hero_id].img}`} alt="${heroes[player.hero_id].localized_name}" />

                <div>
                    <h3 class="player-name">${player.name? player.name : "Anyonymous"}</h3>
                    <p>GPM: ${player.gold_per_min}, XPM ${player.xp_per_min}</p>
                </div>
            </div>

            <h3>${player.kills}/${player.deaths}/${player.assists}</h3>
        `

        div.append(element);
    }
    return div;
}

// Function for getting hero Lists
function getHeroList(players, mark)
{
    // Create a div
    const div = document.createElement("div");
    div.className = `hero-lists ${mark}`;

    for (const player of players)
    {
        // Create an image
        const image = document.createElement("img");
        image.src = `https://cdn.cloudflare.steamstatic.com${heroes[player.hero_id].img}`
        image.alt = heroes[player.hero_id].localized_name;
        image.dataset.number = player.player_slot

        div.append(image);
    }

    div.firstChild.classList.add("selected");

    div.addEventListener("click", function(event)
    {
        removeSelected(div);

        // Add selected to trigger element
        event.target.classList.add("selected");

        if (div.classList.contains("r"))
        {
            // Remove all selected
            removeSelected(document.querySelectorAll(".spell-orders-container")[0]);
            removeSelected(document.querySelectorAll(".damage-container")[0]);
            removeSelected(document.querySelectorAll(".item-slots-container")[0]);
            
        }

        else 
        {
            // Remove all selected
            removeSelected(document.querySelectorAll(".spell-orders-container")[1]);
            removeSelected(document.querySelectorAll(".damage-container")[1]);
            removeSelected(document.querySelectorAll(".item-slots-container")[1]);
           
        }
        

        // Get the player slot
        const playerSlot = event.target.dataset.number;

        // Selecting all elements that has number
        const elements = document.querySelectorAll(`.player${playerSlot}`);

        elements.forEach(function(element)
        {
            element.classList.add("selected");
        })
    })

    return div;
}

// Function for getting Spelling learning orders
function getSpellOrders(players)
{
    const div = document.createElement("div");
    div.className = "spell-orders-container";

    div.innerHTML = `
        <h2>Spell Learning Order</h2>
    `
    for (const player of players)
    {
        const container = document.createElement("div");
        container.className = `spell-orders player${player.player_slot}`;

        // loopping ability upgrade
        for (const ability of player.ability_upgrades_arr)
        {
            
            if (!abilityIds[ability].startsWith("special"))
            {
                const image = document.createElement("img");
                image.src = `https://cdn.cloudflare.steamstatic.com${abilities[abilityIds[ability]].img}`

                container.append(image);
            }
            
        }

        div.append(container);
    }

    div.children[1].classList.add("selected");

    return div;
}

// Function for removing selected
function removeSelected(obj)
{
    [...obj.children].forEach(function(element)
    {
        element.classList.remove("selected")
    })
}

// Function for getting damage info
function getDamageInfo(players)
{
    console.log(players[0])
    // Create a div
    const div = document.createElement("div");
    div.className = "damage-container";

    div.innerHTML = `
        <h2>Damage Info</h2>
    `

    for (const player of players)
    {
        // Create a div
        const container = document.createElement("div");
        container.className = `damage-info player${player.player_slot}`
        container.innerHTML = `
            <div>
                <h3>Hero Damage</h3>
                <span>${player.hero_damage}</span>
            </div>

            <div>
                <h3>Tower Damage</h3>
                <span>${player.tower_damage}</span>
            </div>

            <div>
                <h3>Healing</h3>
                <span>${player.hero_healing}</span>
            </div>
        `

        div.append(container);
    }

    div.children[1].classList.add("selected");
    return div;
}


// Function for getting itemSlots
function getItemSlots(players)
{
    // Create a div
    const div = document.createElement("div");
    div.className = "item-slots-container";

    div.innerHTML = `
        <h2>Item Slots</h2>
    `

    for (const player of players)
    {
        // Create a div
        const container = document.createElement("div");
        container.className = `item-slots player${player.player_slot}`;

        // looping item slot
        for (let i = 0; i < 6; i++)
        {
            const img = getImage(player[`item_${i}`]);

            if (img)
            {
                container.append(img);
            }
        }

        // looping backback slot
        for (let i = 0; i < 3; i++)
        {
            const img = getImage(player[`backpack_${i}`]);

            if (img)
            {
                img.className = "backpack";
                container.append(img);
            }
            
        }

        div.append(container);

    }

    div.children[1].classList.add("selected");

    return div;
}

// Function for getting image for player slot item
function getImage(id)
{
    if (id)
    {
        const img = document.createElement("img");
        img.src = `https://cdn.cloudflare.steamstatic.com${items[itemIds[id]].img}`
        return img;
    }

    return;
}
