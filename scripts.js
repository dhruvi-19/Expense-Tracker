let balance = 0.00;
let totalIncome = 0.00;
let totalExpense = 0.00;

document.getElementById('balance').innerText = `$${balance.toFixed(2)}`;
document.getElementById('totalIncome').innerText = `$${totalIncome.toFixed(2)}`;
document.getElementById('totalExpense').innerText = `$${totalExpense.toFixed(2)}`;

document.getElementById('addIncome').addEventListener('click', function() {
    const incomeAmount = parseFloat(document.getElementById('incomeAmount').value);
    if (!isNaN(incomeAmount) && incomeAmount > 0) {
        totalIncome += incomeAmount;
        balance += incomeAmount;
        updateDisplay();
        document.getElementById('incomeAmount').value = '';
    } else {
        alert('Please enter a valid income amount');
    }
});

document.getElementById('addTransaction').addEventListener('click', function() {
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);

    if(balance < amount){
        alert('Your balance is insufficient');
    }
    else if (description !== '' && !isNaN(amount) && amount > 0) {
        totalExpense += amount;
        balance -= amount;
        addTransaction(description, amount, 'expense');
        updateDisplay();
        document.getElementById('description').value = '';
        document.getElementById('amount').value = '';
    } else {
        alert('Please enter a valid description and amount');
    }
});

function deleteTransaction(index) {
    const transactionList = JSON.parse(localStorage.getItem('transactions')) || [];

    if (index >= 0 && index < transactionList.length) {
        const deletedTransaction = transactionList.splice(index, 1)[0];

        if (deletedTransaction.type === 'income') {
            totalIncome -= deletedTransaction.amount;
            balance -= deletedTransaction.amount;
        } else if (deletedTransaction.type === 'expense') {
            totalExpense -= deletedTransaction.amount;
            balance += deletedTransaction.amount;
        }

        localStorage.setItem('transactions', JSON.stringify(transactionList));
        updateDisplay();

        const transactionItems = document.querySelectorAll('#transactionList li');
        transactionItems[index].remove();

        const remainingItems = document.querySelectorAll('#transactionList .delete-btn');
        remainingItems.forEach((button, idx) => {
            button.dataset.index = idx;
        });
    }
}

function addTransaction(description, amount, type) {
    const transactionList = JSON.parse(localStorage.getItem('transactions')) || [];
    const transaction = { description, amount, type };
    transactionList.push(transaction);

    localStorage.setItem('transactions', JSON.stringify(transactionList));
    updateDisplay();

    const transactionItem = document.createElement('li');
    transactionItem.className = type === 'income' ? 'income' : 'expense';
    transactionItem.innerHTML = `
        ${description}: $${amount.toFixed(2)}
        <button class="delete-btn" data-index="${transactionList.length - 1}">Delete</button>
    `;
    document.getElementById('transactionList').appendChild(transactionItem);
}

function updateDisplay() {
    document.getElementById('balance').innerText = `$${balance.toFixed(2)}`;
    document.getElementById('totalIncome').innerText = `$${totalIncome.toFixed(2)}`;
    document.getElementById('totalExpense').innerText = `$${totalExpense.toFixed(2)}`;
}

document.getElementById('transactionList').addEventListener('click', function(event) {
    if (event.target.classList.contains('delete-btn')) {
        const index = parseInt(event.target.dataset.index);
        deleteTransaction(index);
    }
});

window.onload = function() {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions.forEach((transaction, index) => {
        const { description, amount, type } = transaction;
        if (type === 'income') {
            totalIncome += amount;
            balance += amount;
        } else if (type === 'expense') {
            totalExpense += amount;
            balance -= amount;
        }
        const transactionItem = document.createElement('li');
        transactionItem.className = type === 'income' ? 'income' : 'expense';
        transactionItem.innerHTML = `
            ${description}: $${amount.toFixed(2)}
            <button class="delete-btn" data-index="${index}">Delete</button>
        `;
        document.getElementById('transactionList').appendChild(transactionItem);
    });
    updateDisplay();
};
