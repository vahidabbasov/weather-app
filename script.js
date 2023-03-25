let link =
  "http://api.weatherstack.com/current?access_key=96a01186f8594a9ab787a838a3c7451b";

const root = document.getElementById("root");
const popup = document.getElementById('popup')
const close = document.getElementById('close')
const textInput = document.getElementById("text-input")
const form = document.getElementById("form")


let store = {
  city: "Baku",
  temperature: 0,

  observation_time: "00:00 AM",
  isDay: "yes",
  description: "",

  properties: {
    cloudcover: {},
    humidity: {},
    windSpeed: {},
    visibility: {},
    pressure: {},
    uvIndex: {},
  },
};

let fetchData = async () => {
 try {

    const query = localStorage.getItem('query') || store.city
    const result = await fetch(`${link}&query=${query}`);

    const data = await result.json();
    console.log(data);
  
    const {
      current: {
        cloudcover,
        temperature,
        humidity,
        observation_time: observationTime,
        pressure,
        uv_index: uvIndex,
        visibility,
        is_day: isDay,
        weather_descriptions: description,
        wind_speed: windSpeed,
      },
      location:{
        name
      }
    } = data;
  
    store = {
      ...store,
      isDay,
      city:name,
      temperature,
      observationTime,
      description: description[0],
      properties: {
          cloudcover: {
              title:'Cloudcover',
             value: `${cloudcover}%`,
             icon:"cloud.png"
          },
          humidity:{
              title:'humidity',
              value: `${humidity}%`,
              icon:"humidity.png"
           },
          windSpeed: {
              title:'wind speed',
              value: `${windSpeed}%`,
              icon:"wind.png"
           },
          pressure: {
              title:'pressure',
              value: `${pressure}%`,
              icon:"gauge.png"
           },
          uvIndex: {
              title:'uv index',
              value: `${uvIndex}%`,
              icon:"uv-index.png"
           },
          visibility: {
              title:'visibility',
              value: `${visibility}%`,
              icon:"visibility.png"
           },
        },
    };
  
    renderComponent();
    
 } catch (error) {
    console.log(error);
 }

};

let getImage = (description) => {
  let value = description.toLowerCase();
  switch (value) {
    case "partly cloudy":
      return "partly.png";
    case "cloud":
      return "cloud.png";
    case "fog":
      return "fog.png";
    case "sunny":
      return "sunny.png";
    case "clear":
      return "clear.png";
    case "overcast":
      return "clear.png";

    default:
      return "the.png";
  }
};


let renderProperty = (properties) =>
   Object.values(properties)
    .map(
      ({ icon, value, title }) => `
        <div class="property">
          <div class="property-icon">
            <img src="./img/icons/${icon}" alt="">
          </div>
          <div class="property-info">
            <div class="property-info__value">${value}</div>
            <div class="property-info__description">${title}</div>
          </div>
        </div>
  `
    )
    .join("");



let markup = () => {
  const { city, description, observationTime, temperature, isDay, properties } = store;

 let containerClass = isDay ==='yes' ? 'is-day':''
   
  return `<div class="container ${containerClass}">
    <div class="top">
      <div class="city">
        <div class="city-subtitle">Weather Today in</div>
        <div class="city-title" id="city">
          <span>${city}</span>
        </div>
      </div>
      <div class="city-info">
        <div class="top-left">
          <img class="icon" src="./img/${getImage(description)}" alt="" />
          <div class="description">${description}</div>
        </div>
      
        <div class="top-right">
          <div class="city-info__title">${temperature}°</div>
        </div>
      </div>
    </div>
    <div id="properties">${renderProperty(properties)}</div>
  </div>`;
};



let toggleClass=()=>{
    popup.classList.toggle("active")
}

const renderComponent = () => {
  root.innerHTML = markup();
const city = document.getElementById('city')
city.addEventListener("click", toggleClass)
};

const handleInput=(e)=>{
    store={
        ...store,
        city:e.target.value
    }
}


const handleSubmit=(e)=>{
    e.preventDefault()
    const value = store.city
    if(!value ) return null
    

    fetchData()
    toggleClass()
}

const handleClose=()=>{
    toggleClass()
}
form.addEventListener("submit", handleSubmit)
textInput.addEventListener('input', handleInput)
close.addEventListener('click', handleClose)

fetchData();
