// Variables
let select = document.querySelector("select");
let themeBtn = document.querySelector(".btn");
let container = document.querySelector(".container");
let searchInputs = document.querySelector(".search-input");
let inpIcon = document.querySelector(".icon");
let allCountry = [];

// Create Back Button
let backBtn = document.createElement("button");
backBtn.textContent = "← Back";
backBtn.classList.add("back-btn");
backBtn.style.display = "none";
document.body.insertBefore(backBtn, container);

// Back Button Logic
backBtn.addEventListener("click", function () {
    getCountry(allCountry);
    searchInputs.style.display = "inline-block";
    select.style.display = "inline-block";
    backBtn.style.display = "none";
});

// Toggle Theme
themeBtn.addEventListener("click", function (e) {
    e.preventDefault();
    document.body.classList.toggle("dark-Mode");
});

// Fetch Data
async function getData() {
    try {
        let res = await fetch("data.json");
        let data = await res.json();
        allCountry = data;
        getCountry(data);
        getRegion(data);
    } catch (err) {
        console.log(err);
    }
}

// Display Country Cards
function getCountry(data) {
    container.innerHTML = "";
    inpIcon.style.display = "inline";
    container.style.display = "grid";
    data.forEach(country => {
        let card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
            <div class="card-image">
                <img src="${country.flags.png}" alt="${country.name}">
            </div>
            <div class="content">
                <h3>${country.name}</h3>
                <p><b>Population:</b> <span class="para">${country.population}</span></p>
                <p><b>Region:</b> <span class="para">${country.region}</span></p>
                <p><b>Capital:</b> <span class="para">${country.capital}</span></p>
            </div>
        `;

        // Full-page view on click
        card.addEventListener("click", function () {
            showFullView(country);
        });

        container.appendChild(card);
    });
}

// Function to display full view of a country
function showFullView(country) {
    container.innerHTML = "";
    searchInputs.style.display = "none";
    select.style.display = "none";
    inpIcon.style.display = "none";
    backBtn.style.display = "inline-block";
    container.style.display = "inline";

    let fullView = document.createElement("div");
    fullView.classList.add("full-view");

    fullView.innerHTML = `
        <div class="flag-box">
            <img src="${country.flags.png}" alt="${country.name}">
        </div>
        <div class="info-box">
            <h2>${country.name}</h2>
            <div class="info-columns">
                <div>
                    <p><b>Native Name:</b> ${country.nativeName}</p>
                    <p><b>Population:</b> ${country.population.toLocaleString()}</p>
                    <p><b>Region:</b> ${country.region}</p>
                    <p><b>Sub Region:</b> ${country.subregion}</p>
                    <p><b>Capital:</b> ${country.capital}</p>
                </div>
                <div>
                    <p><b>Top Level Domain:</b> ${country.topLevelDomain.join(", ")}</p>
                    <p><b>Currencies:</b> ${country.currencies?.map(c => c.name).join(", ")}</p>
                    <p><b>Languages:</b> ${country.languages?.map(l => l.name).join(", ")}</p>
                </div>
            </div>
            <div class="borders">
                <b>Border Countries:</b> ${
                    country.borders
                        ? country.borders.map(code => {
                            let borderCountry = allCountry.find(c => c.alpha3Code === code);
                            return borderCountry
                                ? `<button class="border-btn" data-code="${code}">${borderCountry.name}</button>`
                                : "";
                        }).join("")
                        : "None"
                }
            </div>
        </div>
    `;

    container.appendChild(fullView);

    // Add click event to border buttons
    document.querySelectorAll(".border-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            let code = btn.getAttribute("data-code");
            let borderCountry = allCountry.find(c => c.alpha3Code === code);
            if (borderCountry) {
                showFullView(borderCountry);
            }
        });
    });
}

// Get Region Options
function getRegion(data) {
    let region = new Set();

    data.forEach(country => {
        region.add(country.region);
    });

    let defaultOption = document.createElement("option");
    defaultOption.innerText = "All Regions";
    defaultOption.value = "";
    select.appendChild(defaultOption);

    region.forEach(regionName => {
        let newOpt = document.createElement("option");
        newOpt.innerText = regionName;
        newOpt.value = regionName.toLowerCase();
        select.appendChild(newOpt);
    });
}

// Search Input Logic
searchInputs.addEventListener("input", function () {
    let value = searchInputs.value.toLowerCase().trim();
    let filtered = allCountry.filter(country => {
        return country.name.toLowerCase().includes(value);
    });
    getCountry(filtered);
});

// Select Region Filter
select.addEventListener("change", function () {
    let selectedValue = select.value.toLowerCase();

    if (selectedValue === "") {
        getCountry(allCountry);
    } else {
        let filtered = allCountry.filter(country => {
            return country.region.toLowerCase() === selectedValue;
        });
        getCountry(filtered);
    }
});

// Start App
getData();
