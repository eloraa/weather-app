const weatherDataBox = document.querySelector('.box')
const loc = document.querySelector('.title h3')
const codition = document.querySelector('.title h2')
const cloudyLogo = document.querySelector('.logo.cloudy')
const sunnyLogo = document.querySelector('.logo.sunny')
const temp = document.querySelector('.temp')
const pressure = document.querySelector('.pressure')
const humidity = document.querySelector('.humidity')
const searchBox = document.querySelector('.search-box')
const searchInput = document.querySelector('.search-box input')
const alertBox = document.querySelector('.alertMessage')

const WeatherURL = '//api.openweathermap.org/data/2.5/weather?appid=f736fc18b329087320ba64309d13a7e4'
const defCity = 'Dhaka, BD'

const tl = new gsap.timeline

const numAnimation = (data, name, dom, string) => {
    const count = {
        current: data[name].current,
        previous: data[name].previous
    }
    count.previous = 10;

    new gsap.timeline().to(data[name], 1.4, {
        previous: data[name].current,
        roundProps: "previous",
        onUpdate: () => {
            dom.innerHTML = data[name].previous + string
        },
        onComplete: () => {
            dom.innerHTML = data[name].current + string
        }
    });
}

const cloudyBGAnimation = () => {
    document.querySelector('.bg .sunny').style.opacity = 0
    document.querySelector('.bg .cloudy').style.opacity = 1
    
    sunnyLogo.style.opacity = 0
    cloudyLogo.style.opacity = 1

    if(!weatherDataBox.classList.contains('cloudy')) {
        tl
        .add('start')
        .fromTo('.bg', 1.4, {
        backgroundColor: '#fff'
        }, {
            backgroundColor: '#A8CECC',
            ease: Power3.easeOut
        }, 'start')
        .from('#hill', .7, {
            y: '100%',
            stagger: .3,
            ease: Power3.easeOut
        }, '-=0.4', 'start')
        .from('#clouds', .4, {
            scaleX: '0',
            opacity: '0',
            stagger: .2,
            ease: Power3.easeInOut
        })
        .from('#small_hill, #tree, #polar', .7, {
            y: '180%',
            stagger: .2,
            ease: Power3.easeOut
        })
    }
}
const sunnyBGAnimation = () => {
    document.querySelector('.bg .sunny').style.opacity = 1
    document.querySelector('.bg .cloudy').style.opacity = 0
    
    sunnyLogo.style.opacity = 1
    cloudyLogo.style.opacity = 0

    if(!weatherDataBox.classList.contains('sunny')) {
        tl
        .add('start')
        .fromTo('.bg', .7, {
        backgroundColor: '#fff'
        }, {
            backgroundColor: '#F7D793',
            ease: Power3.easeOut
        }, 'start')
        .from('#hill', .7, {
            y: '130%',
            stagger: .3,
            ease: Power3.easeOut
        }, '-=0.4', 'start')
        .from('#sun', .4, {
            scale: '0',
            transformOrigin: 'center',
            stagger: .3,
            ease: Power3.easeOut
        })
        .from('#camel', .2, {
            opacity: 0,
            stagger: .1,
            ease: Power3.easeOut
        })
    }
}

const setupPage = () => {
    navigator.geolocation.getCurrentPosition(o => {
        getWeather(null, o.coords)
    }, e => {
        getWeather(defCity)
    })
    
}

const setWeatherData = (weather) => {
    document.querySelector('.preloader').style.display = 'none'

    if(weather.weather[0].main == 'Sunny' || weather.weather[0].main == 'Clear') {
        sunnyBGAnimation()
        weatherDataBox.classList.remove('cloudy')
        weatherDataBox.classList.add('sunny')
    } else {
        cloudyBGAnimation()
        weatherDataBox.classList.remove('sunny')
        weatherDataBox.classList.add('cloudy')
    }
     const data = {
        location: {
            city: weather.name, 
            country: weather.sys.country
        },
        condition: weather.weather[0].main,
        temp: {
            current: (weather.main.temp - 273.15).toFixed(2),
            previous: 0
        },
        windSpeed: {
            current: (weather.wind.speed * 3.6).toFixed(1),
            previous: 0
        },
        humidity: {
            current: weather.main.humidity,
            previous: 0
        }
    }

    loc.innerHTML = `${data.location.city}, ${data.location.country}`
    codition.innerHTML = data.condition
    // temp.innerHTML = `${data.temp}°`
    numAnimation(data, 'temp', temp, '°')
    // // pressure.innerHTML = `${data.windSpeed}km/h`
    numAnimation(data,'windSpeed', pressure, 'km/h')
    // // humidity.innerHTML = `${data.humidity}%`
    numAnimation(data, 'humidity', humidity, '%')

    // data.temp.previous = data.temp.current
    // data.windSpeed.previous = data.windSpeed.current
    // data.humidity.previous = data.humidity.current
}

const getWeather =  (city, coords) => {
    fetch(`${WeatherURL}&${city ? 'q=' + city : 'lat=' + coords.latitude + '&lon=' + coords.longitude}`)
        .then(res => {
            if(!res.ok) throw new Error(`City ${res.statusText}`)
            return res.json()
        })
        .then(data => {
            setWeatherData(data)
        })
        .catch(err => {
            err.message == 'City Not Found' ? showAlert(err.message) : showAlert('Something went wrong') || console.error(err);
        })
}
const showAlert = (msg) => {
    alertBox.innerHTML = msg
    alertBox.style.opacity = '1'
    alertBox.style.top = '20px'
    setTimeout(() => {
        alertBox.style.opacity = '0'
        alertBox.style.top = '0px'
    }, 2000)
}
const toggleEnterIcon = () => {
    searchBox.classList.toggle('focus')
}
searchInput.addEventListener('focus', toggleEnterIcon)
searchInput.addEventListener('blur', toggleEnterIcon)

searchBox.querySelector('.enter-icon').addEventListener('click', () => {
    if(searchInput.value) {
        getWeather(searchInput.value)
    } else {
        showAlert('Enter valid city')
    }
    searchInput.value = ''
})

searchInput.addEventListener('keypress', e => {
    if(e.keyCode == 13) {
        if(searchInput.value) {
            getWeather(searchInput.value)
        } else {
            showAlert('Enter valid city')
        }
        searchInput.value = ''
    }
})


window.addEventListener('load', setupPage)
