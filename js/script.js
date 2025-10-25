import heroes from "./../helpers/heroes.js";
import { showInViewPort, scrollAnimation, toggleMenu } from "./common.js";
// Selecting DOM
const agilityBtn = document.querySelector(".agility");
const intelBtn = document.querySelector(".intel");
const stregthBtn = document.querySelector(".strength");
const universalBtn = document.querySelector(".universal");
const input = document.querySelector("input");
const menuBar = document.querySelector(".menu-bar");

class Hero 
{
    // Constcutro
    constructor(id, name, image, roles, attribute)
    {
        this.id = id;
        this.name = name;
        this.image = image;
        this.roles = roles;
        this.attribute = attribute;
    }

    // Function for adding to DOM
    add()
    {
        // Create a div
        const div = document.createElement("div");
        div.className = "heroCard";

        // Creaing an image
        const image = document.createElement("img");
        image.className = "attribute";

        // Choosing attribute image
        switch (this.attribute)
        {
            case "agi":
                image.src = "./assets/agility.webp";
                break;
            
            case "int":
                image.src = "./assets/intel.webp";
                break;

            case "str":
                image.src = "./assets/strength.webp";
                break;
            
            case "all":
                image.src = "./assets/universal.webp";
                break;
        }

        div.innerHTML = `
            <img src="${`https://cdn.cloudflare.steamstatic.com/${this.image}`}" class="hero-img" alt="${this.name}"/>
            <h3>${this.name}</h3>
            <p>${this.roles.join(" ")}</p>
            <p class="hidden">${this.attribute}</p>
        `

        div.prepend(image);

        // Adding Event on div
        div.addEventListener("click", () => 
        {
            // Go to another page
            window.location.href = `./html/hero.html?id=${this.id}`;
        })

        document.querySelector(".hero-container").append(div);

        showInViewPort(div);
    }
    
}

// Adding Event
document.addEventListener("DOMContentLoaded", () => 
{
    // For Each hero add them to dom
    for (const index in heroes)
    {
        const data = heroes[index];

        // Create a hero object
        const hero = new Hero(data.id, data.localized_name, data.img, data.roles, data.primary_attr);

        hero.add();
    }
})  

document.addEventListener("scroll", function()
{
    // Selecting herocard
    const heroCards = document.querySelectorAll(".heroCard");

    scrollAnimation(heroCards);

    
})

menuBar.addEventListener("click", function()
{
    toggleMenu();
})

agilityBtn.addEventListener("click", function()
{

    // Remove all the active class from other button
    intelBtn.classList.remove("active");
    stregthBtn.classList.remove("active");
    universalBtn.classList.remove("active");

    if (this.classList.contains("active"))
    {
        this.classList.remove("active");
        filterName()

    }

    else 
    {
        this.classList.add("active");
        filterHero("agi");
    }
})


intelBtn.addEventListener("click", function()
{

    // Remove all the active class from other button
    agilityBtn.classList.remove("active");
    stregthBtn.classList.remove("active");
    universalBtn.classList.remove("active");

    if (this.classList.contains("active"))
    {
        this.classList.remove("active");
        filterName()

    }

    else 
    {
        this.classList.add("active");
        filterHero("int");
    }
})

stregthBtn.addEventListener("click", function()
{

    // Remove all the active class from other button
    agilityBtn.classList.remove("active");
    intelBtn.classList.remove("active");
    universalBtn.classList.remove("active");

    if (this.classList.contains("active"))
    {
        this.classList.remove("active");
        filterName()

    }

    else 
    {
        this.classList.add("active");
        filterHero("str");
    }
})

universalBtn.addEventListener("click", function()
{

    // Remove all the active class from other button
    agilityBtn.classList.remove("active");
    stregthBtn.classList.remove("active");
    intelBtn.classList.remove("active");

    if (this.classList.contains("active"))
    {
        this.classList.remove("active");
        filterName()

    }

    else 
    {
        this.classList.add("active");
        filterHero("all");
    }
})

input.addEventListener("keyup", function()
{
    // Get the elemtn that contain active class
    const activeFilter = document.querySelector(".active");

    if (activeFilter)
    {
        // Getting its textcontent
        const filterType = activeFilter.textContent;

        switch (filterType)
        {
            case "Agility":
                filterHero("agi");
                break;

            case "Intelligence":
                filterHero("int");
                break;

            case "Strength":
                filterHero("str");
                break;
            
            case "Universal":
                filterHero("all");
                break;
        }
    }

    else 
    {
        filterName();
    }
})

// Function for filtering out hero
function filterHero(type)
{
    // getting all hero Card
    const heroCards = document.querySelectorAll(".heroCard");

    // Getting filter name
    const filterValue = input.value.trim();

    if (!filterValue)
    {
        // For each heroCard, check their type
        for (const heroCard of heroCards)
        {
            // checking attribute
            if (type != heroCard.querySelector(".hidden").textContent)
            {
                heroCard.style.display = "none";
            }

            else 
            {
                heroCard.style.display = "block";

                showInViewPort(heroCard);
            }
        }
    }

    else 
    {
        for (const heroCard of heroCards)
        {
            const heroName = heroCard.querySelector("h3").textContent.toLowerCase();
            const heroType = heroCard.querySelector(".hidden").textContent;

            if (heroName.includes(filterValue.toLowerCase()) && heroType === type)
            {
                heroCard.style.display = "block";
            }

            else 
            {
                heroCard.style.display = "none";
            }
        }
    }
    
}

// Function for showing all hero
function showAllHero()
{
    // getting all hero Card
    const heroCards = document.querySelectorAll(".heroCard");

    for (const heroCard of heroCards)
    {
        heroCard.style.display = "block";
    }
}

// Function for filtering with name
function filterName()
{
    const filterValue = input.value.trim().toLowerCase();

    if (!filterValue)
    {
        showAllHero();
    }

    else 
    {
        const heroCards = document.querySelectorAll(".heroCard");

        for (const heroCard of heroCards)
        {
            if (heroCard.querySelector("h3").textContent.toLowerCase().includes(filterValue))
            {
                heroCard.style.display = "block";

                showInViewPort(heroCard);
            }

            else 
            {
                heroCard.style.display = "none";
            }
        }
    }
}

