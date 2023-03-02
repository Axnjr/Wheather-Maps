window.addEventListener("load", () => {
    axios.get('https://ipapi.co/json/')
        .then((response) => {
            console.log("Location detected from Ip address : latitude -", response.data.latitude, "longitude -", response.data.longitude)
            after(response.data.latitude, response.data.longitude)
        })
        .catch(err => {
            console.log("Unable to get your loaction assuming random spot !!")
            after(Math.random() * 180, Math.random() * 360)
        })
});

function after(lati, long) {

    var aqi, tem, dewp, pre, sno, winds, prci, status;
    var map = L.map('map').setView([lati, long], 10);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 10,
        minZoom: 3,
        attribution: '@ <a href="https://axn.vercel.app/">Yakshit Chhipa</a> '
    }).addTo(map);
    var popup = L.popup();

    function onMapClick(e) {

        fetch(`https://api.weatherbit.io/v2.0/current/airquality?lat=` + e.latlng.lat + `&lon=` + e.latlng.lng + `&days=1&key=0b9083d7a0fd425292ee4664b9f9491a`)
            .then(res => res.json())
            .then(dat => { aqi = dat.data[0].aqi })
            .catch(err => {
                throw console.log("API TRIAL HAS EXPIRED , SORRY FOR INCONVINCE 😌😓");
            })

        fetch(`https://api.weatherbit.io/v2.0/forecast/daily?lat=` + e.latlng.lat + `&lon=` + e.latlng.lng + `&key=0b9083d7a0fd425292ee4664b9f9491a`)//
            .then(res => res.json()).then(dat => {
                tem = dat.data[0].temp;
                dewp = dat.data[0].dewpt;
                pre = dat.data[0].pres;
                winds = dat.data[0].wind_spd;
                prci = dat.data[0].precip;
                sno = dat.data[0].snow;
                map.flyTo([e.latlng.lat, e.latlng.lng], 10)
                if (aqi < 30) { status = "Great 🥳" }
                if (aqi < 50) { status = "Good 😊" }
                if (aqi > 50 && aqi <= 100) { status = "Satisfactory 😌" }
                if (aqi > 100 && aqi <= 200) { status = "Moderatly Polluted 🙁" }
                if (aqi > 200 && aqi <= 300) { status = "Poor 😥" }
                if (aqi > 300 && aqi <= 400) { status = "Very Poor ☠️" }
                if (aqi > 400 && aqi <= 500) { status = "Severe 💀" }
                if (aqi === undefined) { status = "Can not get precise air quality 😓" }
                popup
                    .setLatLng(e.latlng)
                    .setContent(`<h1 style="color:red;font-weight: bolder;font-size: 1.2rem;">Co-ordinates :<br/> (Latitude:${e.latlng.lat})(Longitude:${e.latlng.lng})</h1>` + `<br/>
                    <h1 style="font-weight: bolder;font-size: large;" >AQI : ${aqi} <br/> ${status}</h1><br/>
                    <h1 style="font-weight: bolder;font-size: large;">Precipitation : ${prci} mm/hr </h1><br/>
                    <h1 style="font-weight: bolder;font-size: large;">Wind Speed : ${winds} m/s</h1><br/>
                    <h1 style="font-weight: bolder;font-size: large;">Tempreture : ${tem} °C </h1><br/>
                    <h1 style="font-weight: bolder;font-size: large;">Snow : ${sno} % </h1><br/>
                    <h1 style="font-weight: bolder;font-size: large;">Dew Point : ${dewp} °C </h1><br/>
                    <h1 style="font-weight: bolder;font-size: large;">Pressure : ${pre} mb </h1>`)
                    .openOn(map);
            })
            .catch(err => {
                map.flyTo([e.latlng.lat, e.latlng.lng], 10)
                popup
                    .setLatLng(e.latlng)
                    .setContent(`<h1 style="color:red;font-weight: bolder;font-size: 1.2rem;">Co-ordinates :<br/> (Latitude:${e.latlng.lat})(Longitude:${e.latlng.lng})</h1>` + `<br/>
                    <h1 style="font-weight: bolder;font-size: large;" >AQI : Api trial Expired </h1><br/>
                    <h1 style="font-weight: bolder;font-size: large;">Precipitation : Api trial Expired </h1><br/>
                    <h1 style="font-weight: bolder;font-size: large;">Wind Speed : Api trial Expired</h1><br/>
                    <h1 style="font-weight: bolder;font-size: large;">Tempreture : Api trial Expired</h1><br/>
                    <h1 style="font-weight: bolder;font-size: large;">Snow : Api trial Expired </h1><br/>
                    <h1 style="font-weight: bolder;font-size: large;">Dew Point : Api trial Expired </h1><br/>
                    <h1 style="font-weight: bolder;font-size: large;">Pressure : Api trial Expired </h1>`)
                    .openOn(map);
            })
    }

    map.on('click', onMapClick);

}
