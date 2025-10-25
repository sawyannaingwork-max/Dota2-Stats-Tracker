import { showInViewPort, scrollAnimation, showLoading, hideLoading, toggleMenu } from "./common.js";

// DOM
const container = document.querySelector(".team-container");
const input = document.querySelector("input");
const menuBar = document.querySelector(".menu-bar");

// Class
class Team 
{
    constructor(id, logo, name)
    {
        this.id = id;
        this.logo = logo;
        this.name = name;
    }

    add()
    {
        const div = document.createElement("div");
        div.className = "team";
        div.dataset.id = this.id; 

        if (this.logo)
        {
            div.innerHTML = `
            <img src="${this.logo}" alt="${this.name}" />
            <h3>${this.name}</h3>
        `
        }

        else 
        {
            div.innerHTML = `
                <h3>${this.name}</h3>
            `
        }
        
        container.append(div);

        showInViewPort(div);

        div.addEventListener("click", function()
        {
            window.location.href = `teamInfo.html?id=${this.dataset.id}`
        })
    }
}

// EVent
document.addEventListener("DOMContentLoaded", async function()
{
    // Fetching Data
    try 
    {

        showLoading(container);
        const response = await fetch("https://api.opendota.com/api/teams");

        if (response.ok)
        {
            const data = await response.json();

            hideLoading(container);

            for (const teamData of data)
            {
                const team = new Team(teamData.team_id, teamData.logo_url, teamData.name);

                team.add();
            }
        }

        else 
        {
            hideLoading(container);
            container.textContent = "Something Went wrong, please try again later";
        }
    }

    catch(error)
    {
        hideLoading(container);
        container.textContent = "Something Went wrong, please try again later";
    }
})

menuBar.addEventListener("click", toggleMenu);

document.addEventListener("scroll", function()
{
    const teams = document.querySelectorAll(".team");

    scrollAnimation(teams);
})

input.addEventListener("keyup", function()
{
    // Getting search value
    const search = this.value.toLocaleLowerCase().trim();

    const teams = document.querySelectorAll(".team");

    if (!search)
    {
        // show All team
        teams.forEach(function(team)
        {
            team.style.display = "flex";

            showInViewPort(team);
        })
    }

    else 
    {
        teams.forEach(function(team)
        {
            if (team.querySelector("h3").textContent.toLocaleLowerCase().includes(search))
            {
                team.style.display = "flex";
                showInViewPort(team);
            }

            else 
            {
                team.style.display = "none";
            }
        })
    }
})