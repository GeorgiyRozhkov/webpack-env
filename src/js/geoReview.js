
import InteractiveMap from './interactiveMap';

let storage = localStorage; 

export default class GeoReview {
  constructor() {
    this.formTemplate = document.querySelector('#addFormTemplate').innerHTML;
    this.map = new InteractiveMap('map', this.onClick.bind(this));
    this.map.init().then(this.onInit.bind(this));
  }

  async onInit() {
    const coords = await Object.values(JSON.parse(storage.getItem('coords')) || {});
    console.log(coords);
    for (const item of coords) {
      for (let i = 0; i < item.total; i++) {
        console.log(this);
        console.log(coords);
        console.log(this.coords);
        this.map.createPlacemark(item.coords);
      }
    }
    function onDocumentClick(e) {
      if (e.target.dataset.role === 'review-add') {
        debugger;
        const reviewForm = document.querySelector('[data-role=review-form]');
        const coords = [];
        coords.push(JSON.parse(reviewForm.dataset.coords));
        const reviewData = {
          name: document.querySelector('[data-role=review-name]').value,
          place: document.querySelector('[data-role=review-place]').value,
          text: document.querySelector('[data-role=review-text]').value
        };
  
        try {
         storage.setItem('coords', JSON.stringify(coords));
         storage.setItem('review',  JSON.stringify(reviewData));
          console.log(coords);
          this.map.createPlacemark(coords);
          this.map.closeBalloon();
        } catch (e) {
          const formError = document.querySelector('.form-error');
          formError.innerText = e.message;
          console.error(e.message);
        }
      }
    }
    document.body.addEventListener('click', this.onDocumentClick().bind(this));
  }

  createForm(coords, reviews) {
    const root = document.createElement('div');
    root.innerHTML = this.formTemplate;
    const reviewList = root.querySelector('.review-list');
    const reviewForm = root.querySelector('[data-role=review-form]');
    reviewForm.dataset.coords = JSON.stringify(coords);

    const div = document.createElement('div');
    div.classList.add('review-item');
    div.innerHTML = `
    <div>
      <b>${reviews.name}</b> [${reviews.place}]
    </div>
    <div>${reviews.text}</div>
    `;
      reviewList.appendChild(div);

    return root;
  }

  async onClick(coords) {
    console.log(coords);
    this.map.openBalloon(coords);
    const list = await JSON.parse(storage.getItem('review')||'[]');
    console.log(list);
    console.log(coords);
    const form = this.createForm(coords, list);
    console.log(form);
    this.map.setBalloonContent(form.innerHTML);
  }

  
}

