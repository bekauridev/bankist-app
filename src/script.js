'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-07-26T17:01:17.194Z',
    '2020-07-28T23:36:17.929Z',
    '2020-08-01T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [4000, 3420, -250, -890, -1210, 1000, 7500, -10],

  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};
const account3 = {
  owner: 'Giorgi Beqauri',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],

  interestRate: 1.4,
  pin: 3333,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2, account3];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const tooltipIcon = document.querySelector('.tooltip-icon--login');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

// promise
const delay = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // make tooltipIcon green
  tooltipIcon.style.backgroundColor = `#4caf50`;

  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }

    // Decrease 1s
    time--;
  };

  // Set time to 5 minutes
  let time = 120;

  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

let currentError = null;
// ===================
// DISPLAY ERROR
const displayError = function (message, success = false) {
  // Remove the current error if it exists
  if (currentError) currentError.remove();

  // Generate a unique id
  const errorId = `error-${Date.now()}`;

  // Create the HTML
  const html = `<div id="${errorId}" class="error">
    <div class="tooltip-icon tooltip-icon--err">!</div>
    <div class="error__title">${message}</div>
      <button class="error__close">X</button>
    </div>`;

  // Insert the HTML
  document.body.insertAdjacentHTML('afterbegin', html);

  // Change Message color based on argument
  const tooltipIconErrMsg = document.querySelector('.tooltip-icon--err');
  const errorMessage = document.querySelector('.error');
  const closeErrMessage = document.querySelector('.error__close');
  const ErrMessageTittle = document.querySelector('.error__title');

  // Set the currentError to the newly created error
  currentError = document.getElementById(errorId);
  if (success) {
    tooltipIconErrMsg.style.backgroundColor = `#5bef67`;
    errorMessage.style.backgroundColor = `#f2fff1`;
    errorMessage.style.border = `#5bef67`;
    ErrMessageTittle.style.color = `#197120`;
    closeErrMessage.style.color = `#197120`;
  }

  // Add an event listener to the close button

  closeErrMessage.addEventListener('click', function () {
    // Remove the clicked error
    currentError.remove();
    currentError = null;
  });

  // Automatically remove the error
  delay(5000).then(() => {
    if (currentError) {
      currentError.remove();
      currentError = null;
    }
  });
};

///////////////////////////////////////
// Event handlers

let currentAccount, timer;

// ============
// LOGIN
btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  try {
    currentAccount = accounts.find(
      acc => acc.username === inputLoginUsername.value
    );
    // Check if inputs is filled
    if (
      inputLoginUsername.value.length === 0 ||
      inputLoginUsername.value.length === 0
    )
      throw new Error('All fields must be filled in ! ');

    // Check if user  exist
    if (currentAccount === undefined) throw new Error('User not exist !');

    // Check if pin exist
    if (currentAccount?.pin !== +inputLoginPin.value)
      throw new Error('PIN is not correct !');

    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Create current date and time
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'long',
    };
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    // Update UI
    updateUI(currentAccount);
  } catch (err) {
    displayError(err);
    tooltipIcon.style.backgroundColor = `#ff585f`;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginUsername.focus();
  }
});

// ============
// TRNASFER
btnTransfer.addEventListener('click', function (e) {
  try {
    e.preventDefault();

    const amount = +inputTransferAmount.value;
    if (amount <= 0) throw new Error('Please enter an amount greater than 0.');

    const receiverAcc = accounts.find(
      acc => acc.username === inputTransferTo.value
    );

    if (receiverAcc === undefined)
      throw new Error(
        'Recipient not found. Please check the recipient information and try again.'
      );

    if (inputTransferTo.value === currentAccount.username)
      throw new Error('User Should not be yours !');

    if (currentAccount.balance < amount)
      throw new Error('There is not enough money in your account !');

    inputTransferAmount.value = inputTransferTo.value = '';

    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    // Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  } catch (err) {
    displayError(err);
  }
});

// ============
// LOAN
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  try {
    const amount = Math.floor(inputLoanAmount.value);

    if (!amount > 0) throw new Error('Please enter an amount greater than 0.');
    // if (currentAccount.movements.some((mov) => { mov <= amount * 0.1 }))
    if (!currentAccount.movements.some(mov => mov >= amount * 0.1))
      throw new Error('Your loan request is rejected');
    // if (currentAccount.movements.some((mov) => mov >= amount * 0.1)) {
    delay(2500).then(() => {
      // Add movement
      currentAccount.movements.push(amount);

      // Add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);

      // Reset timer
      clearInterval(timer);
      timer = startLogOutTimer();
    });
    inputLoanAmount.value = '';
    displayError(`Your loan request is approved`, true);
  } catch (err) {
    displayError(err);
    inputLoanAmount.value = '';
    inputLoanAmount.disabled = true;

    delay(4000).then(() => {
      inputLoanAmount.disabled = false;
      inputLoanAmount.focus();
    });
  }
});

// ============
// Delete Acc
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  try {
    if (inputCloseUsername.value !== currentAccount.username)
      throw new Error('User Should be yours !');
    if (+inputClosePin.value !== currentAccount.pin)
      throw new Error('PIN is not correct !');

    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;

    inputCloseUsername.value = inputClosePin.value = '';
    displayError(`Account closed successfully`, true);
  } catch (err) {
    displayError(err);
  }
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
