const getGoods = () => {

  const links = document.querySelectorAll('.navigation-link'); //сслылки навигац.меню
  const more = document.querySelector('.more');// кнопка viewAll

  const renderGoods = (goods) => {

    const goodsContainer = document.querySelector('.long-goods-list');//контейнер для карточек
    goodsContainer.innerHTML = '';//очищаем содержимое контейнера

    //макет карточки
    goods.forEach(good => {
      const goodBlock = document.createElement('div');//блок карточки
      goodBlock.classList.add('col-lg-3');
      goodBlock.classList.add('col-sm-6');

      //содержимое карточки
      goodBlock.innerHTML = `
      <div class="goods-card">
        <span class="label ${good.label ? null : 'd-none'}">${good.label}</span>
       <img src="db/${good.img}" alt="${good.name}" class="goods-image">
        <h3 class="goods-title">${good.name}</h3>
        <p class="goods-description">${good.description}</p>
        <button class="button goods-card-btn add-to-cart" data-id="${good.id}">
          <span class="button-price">$${good.price}</span>
        </button>
      </div>

      `;
      goodsContainer.append(goodBlock)
    })
  }

  const getData = (value, categoty) => {
    fetch('https://getgoods-8a30d-default-rtdb.firebaseio.com/db.json')
      .then((res) => res.json())
      .then((data) => {
        const array = categoty ? data.filter((item) => item[categoty] === value) : data;

        localStorage.setItem('goods', JSON.stringify(array));

        if (window.location.pathname !== "/goods.html") {
          window.location.href = '/goods.html';
        } else {
          renderGoods(array);
        }
      })
  }

  
  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const linkValue = link.textContent;
      const categoty = link.dataset.field;
      getData(linkValue, categoty);
    })
  })

  if (localStorage.getItem('goods') && window.location.pathname === "/goods.html") {
    renderGoods(JSON.parse(localStorage.getItem('goods')))
  }

  if (more) {
    more.addEventListener('click', (event) => {
      event.preventDefault();
      getData();
    })
  }

}

getGoods();