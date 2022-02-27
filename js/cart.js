const cart = function () {
  const cartBtn = document.querySelector('.button-cart');//кнопка для активации модального окна
  const cart = document.getElementById('modal-cart');//модальное окно
  const closeBtn = cart.querySelector('.modal-close');//кнопка закрытия модального окна
  const goodsContainer = document.querySelector('.long-goods-list');//окно с товаром 
  const cartTable = document.querySelector('.cart-table__goods');//окно корзины
  const cartTableTotal = document.querySelector('.card-table__total');//сумма товаров корзины
  const modalForm = document.querySelector('.modal-form');//форма в модальном окне
  const inputName = modalForm.querySelector('.modal-input[name="nameCustomer"]');//input имени из формы в корзине
  const inputPhone = modalForm.querySelector('.modal-input[name="phoneCustomer"]');//input телефона из формы в корзине

  //функция удаления товара из корзины
  const deleteCartItem = (id) => {
    const cart = JSON.parse(localStorage.getItem('cart'));

    const newCart = cart.filter(good => {
      return good.id !== id;
    })

    localStorage.setItem('cart', JSON.stringify(newCart));
    renderCartGoods(JSON.parse(localStorage.getItem('cart')));
  }

  //функция увеличения товара в корзине
  const plusCartItem = (id) => {
    const cart = JSON.parse(localStorage.getItem('cart'));

    const newCart = cart.map(good => {
      if (good.id === id) {
        good.count++;
      }
      return good;
    })

    localStorage.setItem('cart', JSON.stringify(newCart));
    renderCartGoods(JSON.parse(localStorage.getItem('cart')));

  }

  //функция уменьшения товара в корзине
  const minusCartItem = (id) => {
    const cart = JSON.parse(localStorage.getItem('cart'));

    const newCart = cart.map(good => {
      if (good.id === id) {
        if (good.count > 0) {
          good.count--;
        }
      }
      return good;
    })

    localStorage.setItem('cart', JSON.stringify(newCart));
    renderCartGoods(JSON.parse(localStorage.getItem('cart')));
  }

  //сохраняем товар в LS
  const addToCart = (id) => {
    const goods = JSON.parse(localStorage.getItem('goods'));
    const clickedGood = goods.find(good => good.id === id);//id товара

    //LS корзины
    const cart = localStorage.getItem('cart') ?
      JSON.parse(localStorage.getItem('cart')) : [];

    //увеличить кол-во товара в корзине или добавить его туда
    if (cart.some(good => good.id === clickedGood.id)) {
      cart.map(good => {
        if (good.id === clickedGood.id) {
          good.count++;
          alert ('You add this product again');
        }
        return good;
      })
    } else {
      clickedGood.count = 1;
      cart.push(clickedGood);
      alert ('You add product to the cart!');
    }

    //готовая база товара в корзине
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  //отричовка товара в корзине
  const renderCartGoods = (goods) => {
    cartTable.innerHTML = '';

    goods.forEach(good => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
    <tr>
      <td>${good.name}</td>
      <td>${good.price}</td>
      <td><button class="cart-btn-minus">-</button></td>
      <td>${good.count}</td>
      <td><button class="cart-btn-plus">+</button></td>
      <td>${+good.price * +good.count}$</td>
      <td><button class="cart-btn-delete">x</button></td>
    </tr>
      `;

      cartTable.append(tr);
      //события на кнопки корзины
      tr.addEventListener('click', (e) => {

        if (e.target.classList.contains('cart-btn-minus')) {
          minusCartItem(good.id);
        } else if (e.target.classList.contains('cart-btn-plus')) {
          plusCartItem(good.id);
        } else if (e.target.classList.contains('cart-btn-delete')) {
          deleteCartItem(good.id);
        }
      })

    });

    renderTotalCost();
  }

  //функция подсчёта итоговой цены
  const renderTotalCost = () => {
    const cartArray = localStorage.getItem('cart') ?
      JSON.parse(localStorage.getItem('cart')) : [];

    const sum = cartArray.reduce((prev, good) => {
      return prev + (+good.price * good.count);
    }, 0);

    cartTableTotal.innerHTML = sum + '$';

    return sum;
  }

  const sendForm = () => {
    const cartArray = localStorage.getItem('cart') ?
      JSON.parse(localStorage.getItem('cart')) : [];

    fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: JSON.stringify({
        cart: cartArray,
        name: inputName.value,
        phone: inputPhone.value,
        totalCost: renderTotalCost()
      })
    }).then(() => {
      localStorage.removeItem('cart');
      inputName.value = '';
      inputPhone.value = '';
      cart.style.display = '';
    })
  }

  modalForm.addEventListener('submit', e => {
    e.preventDefault();
    sendForm();
  })

  cartBtn.addEventListener('click', function () {
    const cartArray = localStorage.getItem('cart') ?
      JSON.parse(localStorage.getItem('cart')) : [];

    renderCartGoods(cartArray);
    cart.style.display = 'flex';
  });

  closeBtn.addEventListener('click', function () {
    cart.style.display = '';
  });

  cart.addEventListener('click', (event) => {
    if (!event.target.closest('.modal') && event.target.classList.contains('overlay')) {
      cart.style.display = '';
    }
  })

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      cart.style.display = '';
    }
  })

  if (goodsContainer) {

    goodsContainer.addEventListener('click', (event) => {
      if (event.target.closest('.add-to-cart')) {
        const buttonToCart = event.target.closest('.add-to-cart');
        const goodId = buttonToCart.dataset.id;
        addToCart(goodId);
      }
    })
  }
}

cart();