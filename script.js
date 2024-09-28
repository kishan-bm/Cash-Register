// Global variables
let price = 3.26;
let cid = [
  ['PENNY', 1.01],
  ['NICKEL', 2.05],
  ['DIME', 3.1],
  ['QUARTER', 4.25],
  ['ONE', 90],
  ['FIVE', 55],
  ['TEN', 20],
  ['TWENTY', 60],
  ['ONE HUNDRED', 100]
];

const displayChangeDue = document.getElementById('change-due');
const cash = document.getElementById('cash');
const purchaseBtn = document.getElementById('purchase-btn');
const priceScreen = document.getElementById('price-screen');
const cashDrawerDisplay = document.getElementById('cash-drawer-display');

// Helper function to format and display the results
const formatResults = (status, change) => {
  let resultHTML = `<p>Status: ${status}</p>`;
  change.forEach(money => {
    resultHTML += `<p>${money[0]}: $${money[1]}</p>`;
  });
  displayChangeDue.innerHTML = resultHTML;
};

// Main function to check the cash register and return change
const checkCashRegister = () => {
  const cashValue = Number(cash.value);

  if (cashValue < price) {
    alert('Customer does not have enough money to purchase the item');
    cash.value = '';
    return;
  }

  if (cashValue === price) {
    displayChangeDue.innerHTML = '<p>No change due - customer paid with exact cash</p>';
    cash.value = '';
    return;
  }

  let changeDue = cashValue - price;
  let totalCID = cid.reduce((acc, curr) => acc + curr[1], 0);
  let reversedCid = [...cid].reverse();
  let result = { status: 'OPEN', change: [] };

  if (totalCID < changeDue) {
    displayChangeDue.innerHTML = '<p>Status: INSUFFICIENT_FUNDS</p>';
    return;
  }

  if (totalCID === changeDue) {
    result.status = 'CLOSED';
  }

  const denominations = [
    ['ONE HUNDRED', 100],
    ['TWENTY', 20],
    ['TEN', 10],
    ['FIVE', 5],
    ['ONE', 1],
    ['QUARTER', 0.25],
    ['DIME', 0.1],
    ['NICKEL', 0.05],
    ['PENNY', 0.01]
  ];

  denominations.forEach(([name, value]) => {
    let count = 0;
    while (changeDue >= value && reversedCid.some(([n, v]) => n === name && v > 0)) {
      changeDue = parseFloat((changeDue - value).toFixed(2));
      count += value;
      reversedCid.find(([n]) => n === name)[1] -= value;
    }
    if (count > 0) {
      result.change.push([name, count]);
    }
  });

  if (changeDue > 0) {
    displayChangeDue.innerHTML = '<p>Status: INSUFFICIENT_FUNDS</p>';
  } else {
    formatResults(result.status, result.change);
  }

  updateUI(result.change);
};

// Function to update the user interface
const updateUI = () => {
  const currencyNameMap = {
    PENNY: 'Pennies',
    NICKEL: 'Nickels',
    DIME: 'Dimes',
    QUARTER: 'Quarters',
    ONE: 'Ones',
    FIVE: 'Fives',
    TEN: 'Tens',
    TWENTY: 'Twenties',
    'ONE HUNDRED': 'Hundreds'
  };

  cash.value = '';
  priceScreen.textContent = `Total: $${price}`;
  cashDrawerDisplay.innerHTML = `<p><strong>Change in drawer:</strong></p>
    ${cid.map(([name, amount]) => `<p>${currencyNameMap[name]}: $${amount.toFixed(2)}</p>`).join('')}`;
};

purchaseBtn.addEventListener('click', checkCashRegister);
cash.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    checkCashRegister();
  }
});

updateUI();
