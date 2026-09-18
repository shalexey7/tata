/* =========================================================
   TATA — вся «начинка» сайта в одном файле.

   Что здесь правится руками:
   1) CONFIG  — название магазина и контакты (подставляются в раздел «Контакты»
                и в кнопку «Заказать»);
   2) PRODUCTS — товары. Добавить товар = дописать объект в массив.
   Ничего больше трогать не нужно — карточки, фильтры и окно товара
   собираются автоматически.
   ========================================================= */

const CONFIG = {
  shop:     'TATA',
  telegram: 'tata_shop',            // логин без @; пусто '' — блок не покажется
  whatsapp: '79990000000',          // только цифры, начиная с 7
  phone:    '+7 999 000-00-00',
  email:    'hello@example.com',
  city:     'Москва',
  currency: '₽',
};

/* ---------------------------------------------------------
   ТОВАРЫ
   id       — латиницей, без пробелов (используется в ссылке);
   category — по этим значениям строятся кнопки-фильтры;
   badge    — подпись на картинке ('' — без подписи);
   inStock  — false покажет «Под заказ» и сменит кнопку;
   props    — строки таблицы характеристик в окне товара.
   --------------------------------------------------------- */
const PRODUCTS = [
  {
    id: 'krovat-roadster',
    title: 'Кровать «Родстер»',
    category: 'Кроватки',
    price: 32900,
    badge: 'хит',
    inStock: true,
    image: 'images/product-1.svg',
    desc: 'Открытый кузов с дугами вместо крыши: ребёнку легко забираться, взрослому — менять бельё.',
    props: [
      ['Спальное место', '160 × 80 см'],
      ['Материал', 'берёзовая фанера ФК, 18 мм'],
      ['Габариты', '196 × 96 × 74 см'],
      ['Основание', 'реечное, в комплекте'],
      ['Возраст', 'от 3 лет'],
    ],
  },
  {
    id: 'krovat-coupe',
    title: 'Кровать «Купе»',
    category: 'Кроватки',
    price: 34900,
    badge: '',
    inStock: true,
    image: 'images/product-2.svg',
    desc: 'Силуэт классического купе с крышей и хромированной решёткой. Самая «взрослая» модель линейки.',
    props: [
      ['Спальное место', '160 × 80 см'],
      ['Материал', 'берёзовая фанера ФК, 18 мм'],
      ['Габариты', '198 × 96 × 86 см'],
      ['Основание', 'реечное, в комплекте'],
      ['Возраст', 'от 3 лет'],
    ],
  },
  {
    id: 'krovat-mini',
    title: 'Кровать «Малыш»',
    category: 'Кроватки',
    price: 27900,
    badge: 'для первой кровати',
    inStock: true,
    image: 'images/product-3.svg',
    desc: 'Компактная модель с низкой посадкой и бортиками по бокам — для перехода из кроватки с решёткой.',
    props: [
      ['Спальное место', '140 × 70 см'],
      ['Материал', 'берёзовая фанера ФК, 18 мм'],
      ['Габариты', '172 × 86 × 62 см'],
      ['Высота посадки', '26 см'],
      ['Возраст', 'от 2 лет'],
    ],
  },
  {
    id: 'tolokar-kapibara',
    title: 'Толокар «Капибара»',
    category: 'Толокары',
    price: 8900,
    badge: 'новинка',
    inStock: true,
    image: 'images/product-4.svg',
    desc: 'Каталка-толокар со спокойной мордой и мягким рифлёным боком. Колёса не царапают ламинат.',
    props: [
      ['Размер', '56 × 26 × 42 см'],
      ['Материал', 'фанера, шпон, хлопковый шнур'],
      ['Колёса', 'поворотные, прорезиненные'],
      ['Нагрузка', 'до 30 кг'],
      ['Возраст', '1–3 года'],
    ],
  },
  {
    id: 'tolokar-mishka',
    title: 'Толокар «Мишка»',
    category: 'Толокары',
    price: 7900,
    badge: '',
    inStock: true,
    image: 'images/product-5.svg',
    desc: 'Та же база, другой характер: круглые уши и широкая улыбка. Внутри — отсек для игрушек.',
    props: [
      ['Размер', '54 × 26 × 40 см'],
      ['Материал', 'фанера, шпон'],
      ['Колёса', 'поворотные, прорезиненные'],
      ['Нагрузка', 'до 30 кг'],
      ['Возраст', '1–3 года'],
    ],
  },
  {
    id: 'matras-160-80',
    title: 'Матрас 160 × 80',
    category: 'Дополнительно',
    price: 6500,
    badge: '',
    inStock: false,
    image: 'images/product-6.svg',
    desc: 'Беспружинный матрас из кокоса и пены, съёмный чехол. Подходит ко всем кроватям линейки.',
    props: [
      ['Размер', '160 × 80 × 12 см'],
      ['Наполнение', 'кокос + пена'],
      ['Чехол', 'съёмный, на молнии'],
      ['Жёсткость', 'средняя'],
    ],
  },
];

/* ========================= Дальше — механика ========================= */

const $  = (sel) => document.querySelector(sel);
const rub = (n) => n.toLocaleString('ru-RU') + ' ' + CONFIG.currency;

/** Экранирование: тексты товаров попадают в разметку через innerHTML. */
const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/** Ссылка «Заказать» — открывает мессенджер с уже набранным сообщением. */
function orderLink(product) {
  const text = `Здравствуйте! Хочу заказать: ${product.title} (${rub(product.price)})`;
  if (CONFIG.telegram) return `https://t.me/${CONFIG.telegram}?text=${encodeURIComponent(text)}`;
  if (CONFIG.whatsapp) return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
  return `mailto:${CONFIG.email}?subject=${encodeURIComponent('Заказ: ' + product.title)}`;
}

/* ------------------------- Каталог ------------------------- */

let activeCategory = 'Все';

function renderFilters() {
  const categories = ['Все', ...new Set(PRODUCTS.map((p) => p.category))];
  $('#filters').innerHTML = categories
    .map((c) => `<button class="chip${c === activeCategory ? ' is-active' : ''}" data-cat="${esc(c)}">${esc(c)}</button>`)
    .join('');
}

function renderCatalog() {
  const items = activeCategory === 'Все'
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === activeCategory);

  $('#catalog-empty').hidden = items.length > 0;
  $('#catalog-grid').innerHTML = items.map((p) => `
    <article class="card" data-id="${esc(p.id)}">
      <div class="card__media">
        <img src="${esc(p.image)}" alt="${esc(p.title)}" loading="lazy">
        ${!p.inStock
          ? '<span class="card__badge card__badge--out">под заказ</span>'
          : p.badge ? `<span class="card__badge">${esc(p.badge)}</span>` : ''}
      </div>
      <div class="card__body">
        <h3 class="card__title">${esc(p.title)}</h3>
        <p class="card__desc">${esc(p.desc)}</p>
        <div class="card__foot">
          <span class="card__price">${rub(p.price)}</span>
          <span class="card__more">Подробнее →</span>
        </div>
      </div>
    </article>`).join('');
}

/* ------------------------- Окно товара ------------------------- */

function openModal(id) {
  const p = PRODUCTS.find((x) => x.id === id);
  if (!p) return;

  $('#modal-body').innerHTML = `
    <div class="modal__media"><img src="${esc(p.image)}" alt="${esc(p.title)}"></div>
    <div class="modal__info">
      <h2 id="modal-title">${esc(p.title)}</h2>
      <p class="modal__price">${rub(p.price)}</p>
      <p>${esc(p.desc)}</p>
      <ul class="modal__props">
        ${p.props.map(([k, v]) => `<li><span>${esc(k)}</span><span>${esc(v)}</span></li>`).join('')}
      </ul>
      ${p.inStock
        ? `<a class="btn btn--primary btn--wide" href="${orderLink(p)}" target="_blank" rel="noopener">Заказать</a>`
        : `<a class="btn btn--ghost btn--wide" href="${orderLink(p)}" target="_blank" rel="noopener">Уточнить срок</a>`}
    </div>`;

  $('#modal').hidden = false;
  document.body.classList.add('no-scroll');
  location.hash = 'product-' + p.id;
}

function closeModal() {
  $('#modal').hidden = true;
  document.body.classList.remove('no-scroll');
  if (location.hash.startsWith('#product-')) {
    history.replaceState(null, '', location.pathname + location.search);
  }
}

/* ------------------------- Контакты ------------------------- */

function renderContacts() {
  const rows = [];
  if (CONFIG.telegram) rows.push(['✈', 'Telegram', '@' + CONFIG.telegram, 'https://t.me/' + CONFIG.telegram]);
  if (CONFIG.whatsapp) rows.push(['✆', 'WhatsApp', CONFIG.phone, 'https://wa.me/' + CONFIG.whatsapp]);
  if (CONFIG.email)    rows.push(['✉', 'Почта', CONFIG.email, 'mailto:' + CONFIG.email]);
  if (CONFIG.city)     rows.push(['⌖', 'Город', CONFIG.city, '']);

  $('#contacts-links').innerHTML = rows.map(([icon, label, value, href]) => {
    const inner = `<span class="contact__icon">${icon}</span>
      <span><span class="contact__label">${esc(label)}</span>
      <span class="contact__value">${esc(value)}</span></span>`;
    return href
      ? `<a class="contact" href="${href}" target="_blank" rel="noopener">${inner}</a>`
      : `<div class="contact">${inner}</div>`;
  }).join('');
}

/* ------------------------- Запуск ------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  renderFilters();
  renderCatalog();
  renderContacts();
  $('#year').textContent = new Date().getFullYear();

  // Фильтры каталога
  $('#filters').addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    activeCategory = chip.dataset.cat;
    renderFilters();
    renderCatalog();
  });

  // Клик по карточке — окно товара
  $('#catalog-grid').addEventListener('click', (e) => {
    const card = e.target.closest('.card');
    if (card) openModal(card.dataset.id);
  });

  // Закрытие окна: крестик, фон, Escape
  $('#modal').addEventListener('click', (e) => { if (e.target.closest('[data-close]')) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !$('#modal').hidden) closeModal(); });

  // Бургер-меню
  const burger = $('#burger'), nav = $('#nav');
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      nav.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });

  // Прямая ссылка вида #product-<id> открывает товар сразу
  if (location.hash.startsWith('#product-')) openModal(location.hash.replace('#product-', ''));
});
