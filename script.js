// Constantes da API e elementos do DOM
const API_KEY = "307e2b29887ad37cbbbc745558cc4411";
const BASE_URL = "https://api.openweathermap.org/data/2.5/";
const GEO_URL = "https://api.openweathermap.org/geo/1.0/direct";

const searchInput = document.getElementById("searchInput");
const searchForm = document.querySelector(".busca");

searchForm.addEventListener("submit", (event) => {
    event.preventDefault(); 
    const query = searchInput.value.trim();
    if (query) {
        dadosMeteoros(query);
    } else {
        clearInfo(); 
    }
});

/**
 * Função principal para obter os dados de clima.
 * @param {string} query - O nome da cidade a ser pesquisada.
 */
const dadosMeteoros = async (query) => {
    clearInfo();
    showWarning("Carregando...");

    try {
        const geoUrl = `${GEO_URL}?q=${encodeURI(query)}&limit=1&appid=${API_KEY}`;
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        if (!geoData || geoData.length === 0) {
            showWarning("Não encontramos essa localização. Tente novamente.");
            return;
        }

        const { name, lat, lon, country } = geoData[0];

        const currentWeatherUrl = `${BASE_URL}weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=pt_br`;
        const forecastUrl = `${BASE_URL}forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=pt_br`;

        const [currentWeatherResponse, forecastResponse] = await Promise.all([
            fetch(currentWeatherUrl),
            fetch(forecastUrl),
        ]);

        const currentWeatherData = await currentWeatherResponse.json();
        const forecastData = await forecastResponse.json();

        showInfo({
            name,
            country,
            temp: currentWeatherData.main.temp,
            tempIcon: currentWeatherData.weather[0].icon,
            windSpeed: currentWeatherData.wind.speed,
            descri: currentWeatherData.weather[0].description,
        });

        if (forecastData.cod === "200") {
            const dailyForecast = dadosPrevisao(forecastData.list);
            showDailyForecast(dailyForecast);
        }

    } catch (error) {
        console.error("Erro ao buscar dados do clima:", error);
        showWarning("Ocorreu um erro ao buscar os dados. Verifique sua conexão.");
    }
};

/**
 * Processa a lista de previsão para agrupar por dia.
 * @param {Array} dataList - A lista de previsões da API.
 * @returns {Array} Uma lista com a previsão diária.
 */
function dadosPrevisao(dataList) {
    const dailyData = {};
    dataList.forEach((item) => {
        const day = new Date(item.dt * 1000).toISOString().split("T")[0];
        if (!dailyData[day]) {
            dailyData[day] = {
                temp_min: item.main.temp_min,
                temp_max: item.main.temp_max,
                icon: item.weather[0].icon,
            };
        } else {
            dailyData[day].temp_min = Math.min(dailyData[day].temp_min, item.main.temp_min);
            dailyData[day].temp_max = Math.max(dailyData[day].temp_max, item.main.temp_max);
        }
    });
    return Object.values(dailyData);
}

/**
 * Exibe as informações do clima atual na página.
 * @param {object} data - Objeto com os dados do clima.
 */
function showInfo(data) {
    showWarning("");
    document.querySelector(".resultado").style.display = "block";

    const locationText = `${data.name}, ${data.country}`;

    document.querySelector(".titulo").innerHTML = locationText;
    document.querySelector(".temperatura").innerHTML = `${data.temp.toFixed(1)} <sup>ºC</sup>`;
    document.querySelector(".ventoInfo").innerHTML = `${data.windSpeed.toFixed(1)} <span>km/h</span>`;
    document.querySelector(".tempInfo").innerHTML = data.descri;
    document.querySelector(".informacoes img").setAttribute("src", `https://openweathermap.org/img/wn/${data.tempIcon}@2x.png`);
}

/**
 * Exibe a previsão para os próximos dias.
 * @param {Array} forecastList - Lista com a previsão diária.
 */
function showDailyForecast(forecastList) {
    const forecastContainer = document.getElementById("forecast-container");
    forecastContainer.innerHTML = "";
    document.querySelector(".previsao-7-dias").style.display = "block";
    const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const today = new Date();

    forecastList.slice(0, 5).forEach((dayData, index) => { // Limita a 5 dias
        const date = new Date(today);
        date.setDate(today.getDate() + index);
        const dayName = index === 0 ? "Hoje" : daysOfWeek[date.getDay()];
        const dayTempMin = dayData.temp_min.toFixed(0);
        const dayTempMax = dayData.temp_max.toFixed(0);

        const dayDiv = document.createElement("div");
        dayDiv.className = "day-forecast"; 
        dayDiv.innerHTML = `
            <div class="font-bold w-1/4">${dayName}</div>
            <img src="https://openweathermap.org/img/wn/${dayData.icon}@2x.png" alt="Ícone do tempo" class="w-1/4">
            <div class="w-1/4 text-center">
                <span class="font-bold">${dayTempMax}º</span>
                <span class="opacity-70">${dayTempMin}º</span>
            </div>
        `;
        forecastContainer.appendChild(dayDiv);
    });
}

/**
 * Exibe uma mensagem de aviso/status para o usuário.
 * @param {string} msg - A mensagem a ser exibida.
 */
function showWarning(msg) {
    document.querySelector(".aviso").innerHTML = msg;
}


function clearInfo() {
    showWarning("");
    document.querySelector(".resultado").style.display = "none";
    document.querySelector(".previsao-7-dias").style.display = "none";
}