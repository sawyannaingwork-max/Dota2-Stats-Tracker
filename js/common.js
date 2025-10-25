// Function for showing element to viewport
export function showInViewPort(element)
{
    const top = element.getBoundingClientRect().top;

    if (window.innerHeight - top > 0)
    {
        element.style.opacity = 1;
        element.style.top = "0px";
    }
}

// Function for scrolling animation
export function scrollAnimation(elements)
{
    elements.forEach(function(element)
    {
        // Calculate its is visible or not
        const top = element.getBoundingClientRect().top;

        if (top < -156)
        {
            element.style.top = "-20px";
            element.style.opacity = 0;
        }

        else 
        {
            if (window.innerHeight - top > 0)
            {
                element.style.top = "0px";
                element.style.opacity = 1;
            }

            else 
            {
                element.style.top = "20px";
                element.style.opacity = 0;
            }

        }
    })
}

// Show Loading
export function showLoading(obj)
{
    // Show Animation
    obj.querySelector(".animation").style.display = "flex";
}

// Hide loading
export function hideLoading(obj)
{
    // Show Animation
    obj.querySelector(".animation").style.display = "none";
}

// Toggle menu Content
export function toggleMenu()
{
    const menuBar = document.querySelector(".menu-bar");
    const menuContent = document.querySelector(".menu-content");

    if (getComputedStyle(menuContent).height === "0px")
    {
        menuBar.style.transform = "rotate(90deg)";
        menuContent.style.height = "90px";
    }

    else 
    {
        menuBar.style.transform = "rotate(0deg)";
        menuContent.style.height = "0px";
    }
}