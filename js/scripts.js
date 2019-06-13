// Countdown time
const countdownTime = launchDate => {
    const nextLaunchDate = new Date(launchDate).valueOf();
    const currentDate = Date.now();
    const timeToLaunch = nextLaunchDate - currentDate;

    const seconds = Math.floor(timeToLaunch / 1000);
    const minute = Math.floor(seconds / 60);
    const hour = Math.floor(minute / 60);

    let daysLeft = Math.floor(hour / 24);
    let minutesLeft = minute % 60;
    let hoursLeft = hour % 24;

    daysLeft = daysLeft === 1 ? daysLeft + " day" : daysLeft + " days";
    hoursLeft = hoursLeft === 1 ? hoursLeft + "hour" : hoursLeft + " hours";
    minutesLeft = minutesLeft === 1 ? minutesLeft + " minute" : minutesLeft + " minutes";

    document.getElementById("countdownTime").innerText = daysLeft + " " + hoursLeft + " " + minutesLeft;
};

const setCountdownTime = () => {
    fetch("https://api.spacexdata.com/v3/launches/next")
        .then(response => response.json())
        .then(data => {
            countdownTime(data.launch_date_utc);
        })
        .catch(e => console.log("Could not set countdownTime\nError: " + e));
};

setCountdownTime();

// Get rocket info
const renderRocketInfo = (data, rocketInfoWrapper) => {
    rocketInfoWrapper = !rocketInfoWrapper ? "rocketInfo" : rocketInfoWrapper;

    const {
        rocket_name,
        description,
        engines,
        company,
        country,
        first_flight,
        cost_per_launch,
        diameter,
        height,
        mass,
        wikipedia,
        flickr_images
    } = data;

    const formattedDate = new Date(first_flight).toLocaleDateString();

    let images = "";

    for(let i = 0; i < flickr_images.length; i++) {
        images += `<img alt="Rocket image" src="${flickr_images[i]}"/>`;
    }

    document.getElementById(rocketInfoWrapper).innerHTML = `
        <div class="launchRocketTypeLeft">
            <div class="launchRocketTypeImageGroup">
                ${images}
            </div>
        </div>
        <div class="launchRocketTypeRight">
            <h3>Rocket Type</h3>
            <h4>${rocket_name}</h4>
            <p>
                ${description}
            </p>
            <p><span>Engine type:</span> ${engines.type}</p>
            <p><span>Company:</span> ${company}</p>
            <p><span>Country:</span> ${country}</p>
            <p><span>First Flight:</span> ${formattedDate}</p>
            <p><span>Cost per Launch:</span> $${cost_per_launch}</p>
            <p><span>Diameter:</span> ${diameter.meters} meters / ${diameter.feet} feet</p>
            <p><span>Height:</span> ${height.meters} meters / ${height.feet} feet</p>
            <p><span>Mass:</span> ${mass.kg} kg / ${mass.lb} lb</p>
            <a href="${wikipedia}">Read more at Wikipedia</a>
        </div>
    `;
};

const getRocketInfo = (rocketId, rocketInfoWrapper) => {
    fetch(`https://api.spacexdata.com/v3/rockets/${rocketId}`)
        .then(response => response.json())
        .then(data => renderRocketInfo(data, rocketInfoWrapper))
        .catch(e => console.log("Could not get the rocket info\nError: " + e));
};


// Get launch pad info
const renderLaunchPadInfo = (data, launchPadInfoWrapper) => {
    launchPadInfoWrapper = !launchPadInfoWrapper ? "launchPadInfo" : launchPadInfoWrapper;

    const {
        site_name_long,
        details,
        location,
        vehicles_launched,
        attempted_launches,
        successful_launches,
        wikipedia
    } = data;

    document.getElementById(launchPadInfoWrapper).innerHTML = `
        <div class="launchLaunchPadLeft" data-latitude="${location.latitude}" data-longitude="${location.longitude}">
        </div>
        <div class="launchLaunchPadRight">
            <h3>Launch Pad</h3>
            <h4>${site_name_long}</h4>
            <p>
                ${details}
            </p>
            <p><span>Location:</span> ${location.name} (${location.region})</p>
            <p><span>Vehicles launched: </span> ${vehicles_launched.join(", ")}</p>
            <p><span>Attempted launches:</span> ${attempted_launches}</p>
            <p><span>Successful launches:</span> ${successful_launches}</p>
            <a href="${wikipedia}">Read more at Wikipedia</a>
        </div>
    `;
};

const getLaunchPadInfo = (siteId, launchPadInfoWrapper) => {
    fetch(`https://api.spacexdata.com/v3/launchpads/${siteId}`)
        .then(response => response.json())
        .then(data => renderLaunchPadInfo(data, launchPadInfoWrapper))
        .catch(e => console.log("Could not get the launch pad info\nError: " + e));
};

// Render google map
const renderMap = elm => {
    const latitude = elm.getAttribute("data-latitude");
    const longitude = elm.getAttribute("data-longitude");

    elm.innerHTML = `
        <iframe
            frameborder="0"
            src="https://www.google.com/maps/embed/v1/place?key=AIzaSyDHbQ18mziq_w3Y_VNjQnOEdp-s6RIEd-0&zoom=6&q=${latitude},${longitude}" 
            allowfullscreen
        >
    `;
};

// Toggle more launch information
document.querySelectorAll(".launchMoreInformation").forEach(elm => {
    elm.addEventListener("click", (e) => toggleMoreInformation(e), false);
});

const toggleMoreInformation = e => {
    if (e.target.nextElementSibling.children[1].children[0].childNodes.length === 1) {
        renderMap(e.target.nextElementSibling.children[1].children[0]);
    }

    e.target.innerText = e.target.innerText === "More Information" ? "Less Information" : "More Information";
    e.target.nextElementSibling.style.display = e.target.nextElementSibling.style.display === "flex" ? "none" : "flex";
};