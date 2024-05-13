import { fetchBreeds, fetchCatByBreed } from './cat-api';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

//DOM
const breedSelection = document.querySelector('.breed-select');
const catInfo = document.querySelector('.cat-info');
const loader = document.querySelector('.loader');
const errorStatus = document.querySelector('.error');

//Slim Select
const slimSelect = new SlimSelect({
  select: breedSelection,
});

function chooseBreed(data) {
  fetchBreeds(data)
    .then(data => {
      //   console.log(data);
      loader.classList.replace('loader', 'is-hidden');

      let optionsMarkup = data.map(({ name, id }) => {
        return `<option value ='${id}'>${name}</option>`;
      });

      breedSelection.insertAdjacentHTML('beforeend', optionsMarkup);
      slimSelect.setData(Array.from(breedSelection.options));
      breedSelection.classList.remove('is-hidden');
    })
    .catch(onError);
}

chooseBreed();

function createMarkup(event) {
  // Loader while getting the data from API
  loader.classList.replace('is-hidden', 'loader');

  breedSelection.classList.add('is-hidden');
  catInfo.classList.add('is-hidden');

  const breedId = event.target.value;

  fetchCatByBreed(breedId)
    .then(data => {
      loader.classList.replace('loader', 'is-hidden');
      breedSelection.classList.remove('is-hidden');

      const { url, breeds } = data[0];
      //Deconstruct
      const { name, description, temperament } = breeds[0];

      catInfo.innerHTML = `
      <img src="${url}" alt="${name}" width="400"/>
      <div class="box">
        <h2>${name}</h2>
        <p>${description}</p>
        <p><strong>Temperament:</strong> ${temperament}</p>
      </div>
      `;
      catInfo.classList.remove('is-hidden');
    })
    .catch(onError);
}

breedSelection.addEventListener('change', createMarkup);

function onError() {
  // errorStatus.classList.remove('is-hidden');
  Notify.failure('Oops! Something went wrong! Try reloading the page!');
  breedSelection.classList.add('is-hidden');
}
