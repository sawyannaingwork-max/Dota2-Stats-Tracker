import gameModes from "./../helpers/game_mode.js";
import lobbyTypes from "./../helpers/lobby_type.js";
import heroes from "./../helpers/heroes.js";

import { showInViewPort, scrollAnimation, showLoading, hideLoading, toggleMenu } from "./common.js";

// Selecting Dom
const matchContainer = document.querySelector(".public-match-container");
const menuBar = document.querySelector(".menu-bar");

// Class
class Match 
{
    // Constructor
    constructor(id,radiant, dire, duration, time, radiantWin, mode, lobby)
    {
        this.id = id;
        this.radiant = radiant;
        this.dire = dire;
        this.duration = duration;
        this.time = time;
        this.radiantWin = radiantWin;
        this.mode = mode;
        this.lobby = lobby;
    }

    // Addint to dom
    add()
    {
        // Create a div
        const div = document.createElement("div");
        div.dataset.id = this.id;
        div.className = "public-match";

        // Event Listener 
        div.addEventListener("click", function()
        {
            window.location.href = `publicMatch.html?id=${this.dataset.id}`
        })
        // Getting result
        const result = this.radiantWin? "Radiant Win" : "Dire Win";

        // Calculation duration
        const minutes = Math.floor(this.duration / 60)
        const seconds = this.duration % 60;

        // Calculate playing date
        const playedDate = new Date(this.time * 1000);

        div.innerHTML = `
            <div class="public-match-info">
                <div>
                    <h3>${result}</h3>
                    <p>${minutes}:${seconds}</p>
                </div>
                <p>${playedDate.getDate()}/${playedDate.getMonth() + 1}/${playedDate.getFullYear()} ${playedDate.getHours()}:${playedDate.getMinutes()}</p>
            </div>
            <p>${lobbyTypes[this.lobby].name.replace("lobby_type", "").replace("_", " ")} ${gameModes[this.mode].name.replace("game_mode_", "").replace("_", " ")}</p>
        `

        matchContainer.append(div);

        // Create container 
        const container = document.createElement("div");
        container.className = "hero-container";

        div.append(container);
        // Creating radiant team
        const radiantTeam = document.createElement("div");

        for (const hero of this.radiant)
        {
            const image = document.createElement("img");
            image.src = `https://cdn.cloudflare.steamstatic.com${heroes[hero].icon}`;
            image.alt = `${heroes[hero].localized_name}`

            radiantTeam.append(image);
        }

        container.append(radiantTeam);

        // Versus
        const vs = document.createElement("p");
        vs.textContent = "VS";

        container.append(vs);

        const direTeam = document.createElement("div");
        for (const hero of this.dire)
        {
            const image = document.createElement("img");
            image.src = `https://cdn.cloudflare.steamstatic.com${heroes[hero].icon}`;
            image.alt = `${heroes[hero].localized_name}`

            direTeam.append(image);
        }

        container.append(direTeam);

        showInViewPort(div);

    }
}

document.addEventListener("DOMContentLoaded", async function()
{
    // Get list of public matches
    try 
    {
        showLoading(matchContainer);

        const response = await fetch("https://api.opendota.com/api/publicMatches");

        if (response.ok)
        {
            const data = await response.json();

            // hide loading
            hideLoading(matchContainer);

            for (const matchData of data)
            {
                // Create instance of match
                const match = new Match(matchData.match_id, matchData.radiant_team, matchData.dire_team, matchData.duration, matchData.start_time, matchData.radiant_win, matchData.game_mode, matchData.lobby_type);

                match.add();
            }
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
})

document.addEventListener("scroll", function()
{
    const matches = document.querySelectorAll(".public-match");
    scrollAnimation(matches);
})

menuBar.addEventListener("click", function()
{
    toggleMenu();
})