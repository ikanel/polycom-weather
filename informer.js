const http = require('http');
const https = require('https');
const hostname = '0.0.0.0';
const port = 88;

const server = http.createServer(async (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    let lat = 56.0098;
    let lon = 38.3787
    let options = {

        hostname: "api.weather.yandex.ru",
        port: 443,
        path: `/v1/informers/?lat=${lat}&lon=${lon}`,
        method: 'GET',
        headers: {
            "X-Yandex-API-Key": "YOUR-API-KEY-HERE"
        }
    };

    console.log(options);
    https.get(options, (resp) => {
        let data = '';
        let weatherJson;
        let weather;
        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            weatherJson = JSON.parse(data);
            res.end(formatWeatherOutput(weatherJson));
            //     console.log(weatherJson);
        });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

function capitalize(str) {
    return str[0].toUpperCase() + str.slice(1);
}

function formatWeatherOutput(j) {
    var output = "<html><body>"
    var ccond = capitalize(j.fact.condition);
    var ctemp = j.fact.temp;
    var cwind = j.fact.wind_dir.toUpperCase() + j.fact.wind_speed + "m/s";

    output += `${ccond} ${ctemp}&deg;C ${cwind}<br/>`;
    parts = j.forecast.parts;
    console.log(parts.length);

    for (var i = 0; i < parts.length; i++) {
        var fpart = capitalize(parts[i].part_name);
        var fcond = parts[i].condition;
        var ftemp = parts[i].temp_avg;
        var fwind = parts[i].wind_dir + j.fact.wind_speed + "m/s";
        var fpercp = parts[i].prec_prob;
        output += `${fpart}: ${ccond} ${ctemp}&deg;C ${cwind} R:${fpercp}%<br/>`;
    }
    output += `Sunrise ${j.forecast.sunrise} Sunset ${j.forecast.sunset}`;
    output += "</body></html>"
    return output;
}
