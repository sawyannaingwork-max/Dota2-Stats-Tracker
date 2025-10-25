import heroes from "./../helpers/heroes.js";
import { showLoading, hideLoading, toggleMenu } from "./common.js";
// Dom Selection
const teamInfo = document.querySelector(".team-info");
const currentTable = document.querySelector(".current-table");
const previousTable = document.querySelector(".previous-table");
const teamHeroTable = document.querySelector(".team-hero-table");
const teamHeroBtn = document.querySelector(".team-hero-btn");
const teamMatchesBtn = document.querySelector(".team-matches-btn");
const teamMatchesList = document.querySelector(".team-matches-list");
const heroTable = document.querySelector(".heroes-table");
const previous = document.querySelector(".previous-player");
const current = document.querySelector(".current-player");
const buttonList = document.querySelector(".team-info-buttonList");
const teamHeroList = document.querySelector(".team-heroes-list");
const menuBar = document.querySelector(".menu-bar");

// State Variable
let fetchedMatches = false;


class Team 
{
    constructor(id, name, rating, wins, loses, logo, lastMatch)
    {
        this.id = id;
        this.name = name;
        this.rating = rating;
        this.wins = wins;
        this.loses = loses;
        this.logo = logo;
        this.total = this.wins + this.loses;
        this.winRate = (this.wins / this.total * 100).toFixed(2);

        const dateTime = new Date(lastMatch * 1000);
        this.lastMatch = `${dateTime.getDate()}/${dateTime.getMonth() + 1}/${dateTime.getFullYear()} ${dateTime.getHours()}:${dateTime.getMinutes()}`;
    }

    // For Adding Team Logo
    addLogo()
    {
        // Create a div
        const div = document.createElement("div");
        div.className = "team-banner"

        if (this.logo)
        {
            div.innerHTML = `
                <img src="${this.logo}" alt="${this.name}" />
                <h3>${this.name}</h3>
            `
        }

        else 
        {
            div.innerHTML = `<h3>${this.name}</h3>`;
        }

        teamInfo.append(div);
    }

    // For Addint Team Stats 
    addStats()
    {
        // Create a div
        const div = document.createElement("div");
        div.className = "team-stats";
        
        div.innerHTML = `
            <div>
                <h4>Rating</h4>
                <span>${this.rating}</span>
            </div>

            <div>
                <h4>Total Games</h4>
                <span>${this.total}</span>
            </div>

            <div>
                <h4>Wins</h4>
                <span>${this.wins}</span>
            </div>

            <div>
                <h4>Losses</h4>
                <span>${this.loses}</span>
            </div>

            <div>
                <h4>Win Rate</h4>
                <span>${this.winRate}%</span>
            </div>
        `

        teamInfo.append(div);
    }

    // For Addint Team Players
    async addPlayers()
    {   
        // Try to fetch team players data of id
        try 
        {
            showLoading(previous);
            showLoading(current);
            

            const response = await fetch(`https://api.opendota.com/api/teams/${this.id}/players`);

            if (response.ok)
            {
                const data = await response.json();

                hideLoading(previous);
                hideLoading(current);

                previous.querySelector(".players").style.display = "table";
                current.querySelector(".players").style.display = "table";
                previous.querySelector("h2").style.display = "block";
                current.querySelector("h2").style.display = "block";

                // Get Current Player
                const currentPlayers = data.filter(function(player)
                {
                    return player.is_current_team_member;
                })

                // Adding CurrentPlayers to dom
                addToTable(currentPlayers, currentTable)

                // Get Previous Player
                const previousPlayers = data.filter(function(player)
                {
                    return !player.is_current_team_member;
                })

                // Adding to previous table
                addToTable(previousPlayers, previousTable);
            }

            else 
            {
                hideLoading(previous);
                hideLoading(current);
                previous.textContent = "Something Went wrong, try again later";
                current.textContent = "Something Went wrong, try again later";
            }
        }

        catch(error)
        {
            hideLoading(previous);
            hideLoading(current);
            previous.textContent = "Something Went wrong, try again later";
            current.textContent = "Something Went wrong, try again later";
        }
    }

    // Adding team Heroes
    async addHeroes()
    {
        // Try to fetch hero related to team of id
        try 
        {
            showLoading(teamHeroList);
            buttonList.style.display = "flex";
            heroTable.style.display = "table";
            const response = await fetch(`https://api.opendota.com/api/teams/${this.id}/heroes`);

            if (response.ok)
            {
                const data = await response.json();

                hideLoading(teamHeroList);

                // Lopping data and adding to dom
                data.forEach(function(hero)
                {
                    // Create a div
                    const tr = document.createElement("tr");
                    tr.innerHTML = `
                        <td>
                            <img src="${`https://cdn.cloudflare.steamstatic.com${heroes[hero.hero_id].img}`}" alt="${hero.localized_name}" />
                        </td>
                        <td>
                            ${hero.games_played}
                        </td>
                        <td>
                            ${hero.wins}
                        </td>
                        <td>
                            ${(hero.wins / hero.games_played * 100).toFixed(2)}%
                        </td>
                    `

                    // Adding tr to dom
                    teamHeroTable.append(tr);
                })
            }

            else 
            {
                hideLoading(teamHeroList);
                teamHeroList.textContent = "Something Went wrong, try again later";
            }
        }

        catch(error)
        {
            hideLoading(teamHeroList);
            teamHeroList.textContent = "Something Went wrong, try again later";
        }
    }

    // Addint team matches
    async addMatches()
    {
        // Try to Fetch matches related to team of id
        try 
        {
            showLoading(teamMatchesList);
            const response = await fetch(`https://api.opendota.com/api/teams/${this.id}/matches`);

            if (response.ok)
            {
                const data = await response.json();

                hideLoading(teamMatchesList);

                data.forEach((match) =>
                {
                    // Creat a div
                    const div = document.createElement("div");
                    div.dataset.id = match.match_id;
                    div.className = "team-hero-match";

                    div.addEventListener("click", function()
                    {
                        window.location.href = `match.html?id=${this.dataset.id}`
                    })

                    // Calculate result
                    let result 
                    
                    if ((match.radiant && match.radiant_win) || (!match.radiant && !match.radiant_win))
                    {
                        result = "Won";
                    }

                    else 
                    {
                        result = "Lost";
                    }

                    // Calculate date and time 
                    const dateTime = new Date(match.start_time * 1000);

                    const playedDate = `${dateTime.getDate()}/${dateTime.getMonth() + 1}/${dateTime.getFullYear()} ${dateTime.getHours()}:${dateTime.getMinutes()}`;

                    // Calculate duration
                    const minutes = Math.floor(match.duration / 60);
                    const seconds = match.duration % 60;

                    div.innerHTML = `
                        <div class="result">
                            <p>${result}</p>
                            <p>${minutes}:${seconds}</p>
                        </div>

                        <div class="info">
                            <p>${match.league_name}</p>
                            <p>${playedDate}</p>
                        </div>

                        <div class="vs-team-info">
                            <div>
                                <div class="team-banner">
                                    <img src="${this.logo}" alt="${this.name}" />
                                    <h3>${this.name}</h3>
                                </div>

                                <p>
                                    ${match.radiant? match.radiant_score : match.dire_score}
                                </p>
                            </div>

                            <p>
                                VS
                            </p>

                            <div>
                                <p>
                                    ${match.radiant? match.dire_score : match.radiant_score}
                                </p>
                                <div class="team-banner">
                                    <img src="${match.opposing_team_logo}" alt="${match.opposing_team_name}"/>
                                    <h3>${match.opposing_team_name}</h3>
                                </div>

                            </div>
                        </div>


                    `

                    teamMatchesList.append(div);

                    teamMatchesBtn.scrollIntoView({behavior : "smooth"})
                })
            }

            else 
            {
                hideLoading(teamMatchesList);
                teamMatchesList.textContent = "Something went wrong, try again later";
            }
        }

        catch(error)
        {
            hideLoading(teamMatchesList);
            teamMatchesList.textContent = "Something went wrong, try again later";
        }

    }
}
// Event 
document.addEventListener("DOMContentLoaded", async function()
{
    previous.querySelector(".players").style.display = "none";
    current.querySelector(".players").style.display = "none";
    previous.querySelector("h2").style.display = "none";
    current.querySelector("h2").style.display = "none";
    heroTable.style.display = "none";
    buttonList.style.display = "none";

    // Getting the id of url
    const searchParams = new URLSearchParams(window.location.search);

    const id = searchParams.get("id");

    // Fetch the team data of id 
    try 
    {
        showLoading(teamInfo);

        const response = await fetch(`https://api.opendota.com/api/teams/${id}`);

        if (response.ok)
        {
            // Converting to json type
            const data = await response.json();

            hideLoading(teamInfo);

            // Create an instance of team
            const team = new Team(data.team_id, data.name, data.rating, data.wins, data.losses, data.logo_url, data.last_match_time);

            // Adding team logo to dom
            team.addLogo();

            // Addint team status
            team.addStats();

            // Adding team players
            team.addPlayers();

            // Addting team heroes
            team.addHeroes();

            teamMatchesBtn.addEventListener("click", function()
            {
                this.classList.add("selected");
                teamHeroBtn.classList.remove("selected");

                document.querySelector(".team-heroes-list").style.display = "none";
                document.querySelector(".team-matches-list").style.display = "block";

                if (fetchedMatches)
                {
                    return;
                }

                // Add Matches to dom
                team.addMatches()
            })
        }

        else 
        {
            hideLoading(teamInfo);
            teamInfo.textContent = "Something Went wrong, try again later";
        }
    }

    catch(error)
    {
        hideLoading(teamInfo);
        teamInfo.textContent = "Something Went wrong, try again later";
    }
    
})

teamHeroBtn.addEventListener("click", function()
{
    this.classList.add("selected");
    teamMatchesBtn.classList.remove("selected");

    document.querySelector(".team-heroes-list").style.display = "block";
    document.querySelector(".team-matches-list").style.display = "none";
})

menuBar.addEventListener("click", toggleMenu);

// Function for Adding players to table
function addToTable(players, obj)
{
    players.forEach(function(player)
    {
        // Create a table row
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>
                ${player.name? player.name : "Anonymous"}
            </td>
            <td>
                ${player.games_played}
            </td>
            <td>
                ${player.wins}
            </td>
            <td>
                ${(player.wins / player.games_played * 100).toFixed(2)}%
            </td>

        `

        obj.append(tr);
    })
}
