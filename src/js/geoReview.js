import InteractiveMap from './interactiveMap';

let storage = localStorage; 

export default class GeoReview {
  constructor() {
    this.formTemplate = document.querySelector('#addFormTemplate').innerHTML;
    this.map = new InteractiveMap('map', this.onClick.bind(this));
    this.map.init().then(this.onInit.bind(this));
  }

  async onInit() {
    const coords = await Object.values(JSON.parse(storage.getItem('review')) || {});
    console.log(coords);
    for (const item of coords) {
        console.log(this);
        console.log(coords);
        console.log(this.coords);
        this.map.createPlacemark(item.coords);
    }
    function onDocumentClick(e) {
      if (e.target.dataset.role === 'review-add') {
        const nameInput = document.querySelector('[data-role=review-name]'); 
        const placeInput = document.querySelector('[data-role=review-place]'); 
        const textInput = document.querySelector('[data-role=review-text]'); 
        const formError = document.querySelector('.form-error');

        if (nameInput.value != '' && placeInput.value !='' && textInput.value != ''){
          debugger
          const reviewForm = document.querySelector('[data-role=review-form]');
          coords.push(JSON.parse(reviewForm.dataset.coords));
          let reviewData = JSON.parse(storage.getItem('review') || '[]');
          reviewData.push({
            name: document.querySelector('[data-role=review-name]').value,
            place: document.querySelector('[data-role=review-place]').value,
            text: document.querySelector('[data-role=review-text]').value,
            coords: reviewForm.dataset.coords,
          });
            // storage.setItem('coords', JSON.stringify(coords));
            storage.setItem('review',  JSON.stringify(reviewData));
            console.log(coords);
            this.map.createPlacemark(reviewForm.dataset.coords);
            this.map.closeBalloon();
        }else{
          formError.innerText = 'Заполните каждое поле';
        }
      }
    }
    document.body.addEventListener('click', onDocumentClick.bind(this));
  }

  createForm(coords, reviews) {
    debugger
    const root = document.createElement('div');
    root.innerHTML = this.formTemplate;
    const reviewList = root.querySelector('.review-list');
    reviewList.style.height = '140px';
    reviewList.style.overflow = 'scroll';
    const reviewForm = root.querySelector('[data-role=review-form]');
    reviewForm.dataset.coords = JSON.stringify(coords);

    for (const item of reviews) {
      const div = document.createElement('div');
      div.classList.add('review-item');
      div.style.color = '#8F8F8F'
      div.innerHTML = `
    <div>
      <b style = "color: black">${item.name}</b> ${item.place}
    </div>
    <div>${item.text}</div>
    `;
      reviewList.appendChild(div);
    }
    
    return root;
  }

  async onClick(coords) {
    this.map.openBalloon(coords);
    const list = await JSON.parse(storage.getItem('review')||'[]');
    const form = this.createForm(coords, list);
    this.map.setBalloonContent(form.innerHTML);
  }

  
}

