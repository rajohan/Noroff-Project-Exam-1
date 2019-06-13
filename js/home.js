(() => {
    //ISS Location
    const renderIssPosition = (lat, long) => {
        document.getElementById("issMap").innerHTML = `
        <iframe
            frameborder="0"
            src="https://www.google.com/maps/embed/v1/place?key=AIzaSyDHbQ18mziq_w3Y_VNjQnOEdp-s6RIEd-0&zoom=6&q=${lat},${long}" 
            allowfullscreen
        >
        </iframe>
    `;
    };

    const getIssPosition = () => {
        fetch("https://cors-anywhere.herokuapp.com/http://api.open-notify.org/iss-now.json")
            .then(response => response.json())
            .then(data => renderIssPosition(data.iss_position.latitude, data.iss_position.longitude))
            .catch(e => console.log("Could not fetch ISS position\nError: " + e));
    };

    getIssPosition();

    // People in space
    const renderPeopleInSpace = (number, people) => {
        let peopleList = "";
        people.forEach(people => peopleList += `<p>${people.name}</p>`);

        document.getElementById("astronauts").innerHTML = `
        <img src="images/astronaut.png" alt="Astronaut">
        <h2>There are currently ${number} astronauts in space</h2>
        <div class="contentBox">
            ${peopleList}
        </div>
    `;
    };

    const getPeopleInSpace = () => {
        fetch("https://cors-anywhere.herokuapp.com/http://api.open-notify.org/astros.json")
            .then(response => response.json())
            .then(data => renderPeopleInSpace(data.number, data.people))
            .catch(e => console.log("Could not fetch information about people in space\nError: " + e));
    };

    getPeopleInSpace();

    // Get APOD
    const renderApod = (url, title, copyright) => {
        document.getElementById("apod").innerHTML = `
        <h3>${title}</h3>
        ${copyright ? "<h4>Copyrighted to" + copyright + "</h4>" : "<h4></h4>"}
        <img class="bigImage marginTopSmall" alt="Astronomy picture of the day" src="${url}"/>
    `;
    };

    const getApod = () => {
        fetch("https://api.nasa.gov/planetary/apod?api_key=HJ7qAq0zdwuMNKIgE0tzzo6zxxl3QtUNSv9NNCAK")
            .then(response => response.json())
            .then(data => renderApod(data.url, data.title, data.copyright))
            .catch(e => console.log("Could not get the APOD\nError: " + e));
    };

    getApod();

    // Next Launch
    const renderNextLaunch = (data, rocketImage) => {
        const {flight_number, mission_name, details, launch_date_utc} = data;

        const formattedDate = new Date(launch_date_utc).toLocaleString();
        let image;

        if (data.links.flickr_images[0]) {
            image = data.links.flickr_images[0];
        } else {
            const randomImageNumber = Math.floor(Math.random() * rocketImage.flickr_images.length);
            image = rocketImage.flickr_images[randomImageNumber];
        }

        document.getElementById("nextLaunch").innerHTML = `
        <img alt="Mission image" src="${image}"/>
        <div class="launchDetailMain">
            <div class="launchDetailTop">
                <div class="launchDetailTopLeft">
                    <h3>Mission #${flight_number}</h3>
                    <h4>${mission_name}</h4>
                </div>
                <div class="launchDetailTopRight">
                    <h3>Launch Date</h3>
                    <h4>${formattedDate}</h4>
                </div>
            </div>
            <p>
                ${details}
            </p>
        </div>
    `;
    };

    const getRocketImage = (data) => {
        fetch(`https://api.spacexdata.com/v3/rockets/${data.rocket.rocket_id}`)
            .then(response => response.json())
            .then(rocketImage => {
                renderNextLaunch(data, rocketImage);
                getRocketInfo(data.rocket.rocket_id);
                getLaunchPadInfo(data.launch_site.site_id);
            })
            .catch(e => console.log("Could not get the rocket image\nError: " + e));
    };

    const getNextLaunch = () => {
        fetch("https://api.spacexdata.com/v3/launches/next")
            .then(response => response.json())
            .then(data => {
                countdownTime(data.launch_date_utc);
                getRocketImage(data)
            })
            .catch(e => console.log("Could not get the next launch\nError: " + e));
    };

    getNextLaunch();

    // Validate newsletter email
    const validateNewsletter = () => {
        const email = document.getElementById("email");
        const emailError = document.getElementById("emailError");
        const emailRegex = new RegExp(/^[A-Za-z0-9][a-zA-Z0-9._-]{1,}@[a-zA-Z0-9-]{2,}\.[a-zA-Z0-9.-]{2,}$/);

        if (!emailRegex.test(email.value)) {
            emailError.style.display = "block";
        } else {
            emailError.style.display = "none";
            email.value = "";
            document.getElementById("newsletterConfirmMessage").style.display = "flex";
        }
    };

    // Setup event listener for the contactSubmit button
    document.getElementById("newsletterConfirm").addEventListener("click", validateNewsletter, false);

    // Event listener for modal confirm button
    document.getElementById("newsletterConfirmMessageConfirm").addEventListener("click", () => {
        document.getElementById("newsletterConfirmMessage").style.display = "none";
    }, false);
})();