(() => {
    // Object to hold current state
    const state = {
        pastLaunches: true,
        currentOffset: 0,
        currentWrapperId: 1,
        wrapperClass: "launchWrapperLight"
    };

    // Event listeners to toggle past/upcoming launches
    document.getElementById("pastLaunches").addEventListener("click", () => {
        state.pastLaunches = true;
        state.currentOffset = 0;
        document.getElementById("pastLaunches").classList.add("active");
        document.getElementById("upcomingLaunches").classList.remove("active");

        document.getElementById("launches").innerHTML = "";
        getPastLaunches(0);
    }, false);

    document.getElementById("upcomingLaunches").addEventListener("click", () => {
        state.pastLaunches = false;
        state.currentOffset = 0;
        document.getElementById("pastLaunches").classList.remove("active");
        document.getElementById("upcomingLaunches").classList.add("active");

        document.getElementById("launches").innerHTML = "";
        getUpcomingLaunches(0);
    }, false);

    // Event listener to load more launches
    const addEventLoadMore = () => {
        document.getElementById("launchesLoadMore").addEventListener("click", () => {
            state.currentOffset = state.currentOffset + 5;

            document.getElementById("launchesLoadMore").parentNode.removeChild(document.getElementById("launchesLoadMore"));

            if (state.pastLaunches) {
                getPastLaunches(state.currentOffset);
            } else {
                getUpcomingLaunches(state.currentOffset);
            }

        }, false);
    };

    // Get upcoming/past launches
    const renderLaunches = (data, rocketImages) => {
        for (let i = 0; i < data.length; i++) {
            const formattedDate = new Date(data[i].launch_date_utc).toLocaleString();

            const details = data[i].details ? data[i].details : "No details available.";

            const wrapper = document.createElement("div");
            wrapper.className = state.wrapperClass;
            wrapper.innerHTML = `
            <div class="${state.wrapperClass}">
                <div class="launchDetailsWrapper marginTop">
                    <img id="launchImage${state.currentWrapperId}" alt="Mission image" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAACWBAMAAADauvIwAAAAG1BMVEXMzMyWlpacnJyqqqrFxcWxsbGjo6O3t7e+vr6He3KoAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAC/ElEQVR4nO2ZS2+bQBCAB8zryFKMc8SJreQIkapeseO2V9xGydVUbt0jRJXPkEpRf3ZndsHGSioRaVW10nwSu2YW9vM+kQCAYRiGYRiGYRiGYRiGYRiGYRiGYRiGYV6DXcwxvQtygIUQoj4t9A/Rh6DUZEyF2MBIiAigeWY0/S7qCjHRI/SC+nECzZU3LaH6sVqdFFopGlXUnLiBHuPoDLwI0hqaDayz0zJrKtCook1CF+mA+i2AKYARQ9rGqhgc6kJLkFFF6T/leowxoO9cqq8hkzFnDE18+D8qWmSw2GgxWhlYAeBALWL4tg5kM7wgK+qDUUVVL2hiNKY0zWEqZyz9vle5NKroueoOPaQz0gYZiNuPQi66RRAejSoaqBMtLNGF0xK19zhpNhSyRXI0qqjGNrpii2kVZfLMkLV6ojwaVVTjOFYTqT1ROLgN9Y2YaZyrU3Itpfa2a0fzZXIwtlFcj1WixWjLibqmVeHiT1Xr9FdwNKqovj3HCVe4bRaYZJYoXZGROoIi74xtVN++auKTQdCaww1tLYRssXkGTdgZ26i+Z4chjUIa3SKSE2iNj683B2Mb1fd8ZBiGYRiGYRiGYRiGYRjm38Fvj//eaIiLbJDRoDN6JWrE9LXFkEHrOirBKqLsFd8mDLj508vvF4yUGt/BLVrj8tZLMHk/g6iG/VCjFY/OE5hBacXw6QJgPJXZ9ZwqGGPRDi/pG/fgVK3xbZt8hskGdsONd6uv8M7y3cTe3uQQZZTZ2w9UQYRFjzDK+0azfjRa46xNluBfefHwXp3hHT/ty1FtZtiaECjDgyoIscgpl6Bebiuju9l1Rr9NDPD3TjnQiDOHKjLNJ5Nq9akhND+6cTTAi99Bv41wGb/QRvNh4MQ25C3YkL3zhI2T1VLWayPM41PjOjeejaNvj19hpHG0L905uFsrwfso640jVOWpkQ6VHufq8MVLd9Jc9UIrpA8MNd1H2XGuwkN3Yd8oe95Ku/Wod7vYaatpIG78t43YxQzDaOE3ShJ0F5mMFyoAAAAASUVORK5CYII="/>
                    <div class="launchDetailMain">
                        <div class="launchDetailTop">
                            <div class="launchDetailTopLeft">
                                <h3>Mission #${data[i].flight_number}</h3>
                                <h4>${data[i].mission_name}</h4>
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
                </div>
                <a class="launchMoreInformation buttonDark marginBottom marginTop">More Information</a>
                <div class="launchMoreDetailsWrapper">
                    <div id="rocketInfo${state.currentWrapperId}" class="launchRocketType">
                        ${getRocketInfo(data[i].rocket.rocket_id, "rocketInfo" + state.currentWrapperId)}
                    </div>
                    <div id="launchPadInfo${state.currentWrapperId}" class="launchLaunchPad">
                        ${getLaunchPadInfo(data[i].launch_site.site_id, "launchPadInfo" + state.currentWrapperId)}
                    </div>
                </div>
                ${i === 4 ? "<button id='launchesLoadMore' class='buttonLight marginBottom'>Load more</button>" : ""}
            </div>
        `;

            wrapper.querySelector(".launchMoreInformation").addEventListener("click", (e) => toggleMoreInformation(e), false);
            document.getElementById("launches").appendChild(wrapper);

            if (data[i].links.flickr_images[0]) {
                document.getElementById("launchImage" + state.currentWrapperId).src = data[i].links.flickr_images[0];
            } else {
                const images = rocketImages.filter(rocket => rocket.rocket_id === data[i].rocket.rocket_id);
                const randomImageNumber = Math.floor(Math.random() * images[0].flickr_images.length);

                document.getElementById("launchImage" + state.currentWrapperId).src = images[0].flickr_images[randomImageNumber];
            }

            state.currentWrapperId++;
            state.wrapperClass = state.wrapperClass === "launchWrapperLight" ? "launchWrapperDark" : "launchWrapperLight";

            if (i === 4) {
                addEventLoadMore();
            }
        }
    };

    const getRocketImages = data => {
        fetch(`https://api.spacexdata.com/v3/rockets`)
            .then(response => response.json())
            .then(rocketImages => renderLaunches(data, rocketImages))
            .catch(e => console.log("Could not get the rocket image\nError: " + e));
    };

    const getUpcomingLaunches = offset => {
        fetch("https://api.spacexdata.com/v3/launches/upcoming?limit=5&offset=" + offset)
            .then(response => response.json())
            .then(data => getRocketImages(data))
            .catch(e => console.log("Could not get the upcoming launches\nError: " + e));
    };

    const getPastLaunches = offset => {
        fetch("https://api.spacexdata.com/v3/launches/past?order=desc&limit=5&offset=" + offset)
            .then(response => response.json())
            .then(data => getRocketImages(data))
            .catch(e => console.log("Could not get the past launches\nError: " + e));
    };

    getPastLaunches(0);
})();