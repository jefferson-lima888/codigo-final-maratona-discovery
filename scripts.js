const Modal = {
    open() {
        // abrir modal
        // adicionar a class active ao modal
        document.querySelector(".modal-overlay").classList.add("active")
    },
    close() {
        // fechar modal
        // remover a class active do modal
        document.querySelector(".modal-overlay").classList.remove("active")
    }
}

const Storage = {
    get() {
        // console.log(localStorage)
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },
    set(transactions) {
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
    }
}

// Storage.set('alouuu')
// Storage.get()

// const transactions = [
//     {
//         description: 'Luz',
//         amount: -50000,
//         date: '23/01/2021',
//     },
//     {
//         description: 'Criação de Website',
//         amount: 500000,
//         date: '23/01/2021',
//     },
//     {
//         description: 'Internet',
//         amount: -20000,
//         date: '23/01/2021',
//     },
// ]

// Eu preciso somar as entradas
// depois eu preciso somas as saídas e
// remover das entradas o valor da saídas
// assim eu terei o valor total

const Transaction = {
    all: Storage.get(),

    // [
    //     {
    //         description: 'Luz',
    //         amount: -50000,
    //         date: '23/01/2021',
    //     },
    //     {
    //         description: 'Criação de Website',
    //         amount: 500000,
    //         date: '23/01/2021',
    //     },
    //     {
    //         description: 'Internet',
    //         amount: -20000,
    //         date: '23/01/2021',
    //     },
    // ],

    add(transaction) {
        Transaction.all.push(transaction)

        console.log(Transaction.all);
        App.reload()
    },

    remove(index) {
        Transaction.all.splice(index, 1)

        App.reload()
    },

    incomes() {
        // somar as entradas
        let income = 0

        // pegar todas as transações
        // para cada transação
        Transaction.all.forEach(transaction => {
            // se ela for maor que zero
            if(transaction.amount > 0) {
                // somar uma variavel e retornar a variavel
                // income = income + transaction.amount;
                income += transaction.amount;
            }
        })
        return income;
    },
    expenses() {
        // somar as saídas
        let income = 0
        Transaction.all.forEach(transaction => {
            if(transaction.amount < 0) {
                // income = income + transaction.amount;
                income += transaction.amount;
            }
        })
        return income;
    },
    total() {
        // total => entradas - saídas
        return Transaction.incomes() + Transaction.expenses();
    },
}

const DOM = {
    // vai pegar da tabela os tbody que tem os tr
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        // console.log(transaction)
        const tr = document.createElement('tr')   //cria o tr do innerHTMLTransaction
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        // console.log(tr.innerHTML)
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction, index) {
        const Cssclass = transaction.amount > 0 ? 'income' : 'expense' 

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
         <td class="description">${transaction.description}</td>
         <td class="${Cssclass}">${amount}</td>
         <td class="date">${transaction.date}</td>
         <td>
             <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação">
         </td>
        `
        return html
    },

    updateBalance() {
        document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(Transaction.incomes())
        document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(Transaction.expenses())
        document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }
}

const Utils = {
    formatAmount(value) {
        value = Number(value.replace(/\,\./g, "")) * 100
        
        // console.log(value)
        return value
    },

    formatDate(date) {
        const splittedDate = date.split('-')
        // console.log(splittedDate)
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency(value) {
        const signal = Number(value) < 0 ? '-' : ''

        value = String(value).replace(/\D/g, '')

        value  = Number(value) / 100

        value = value.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})

        // console.log(signal + value)

        return signal + value
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value,
        }
    },

    validateFields() {
        const { description, amount, date } = Form.getValues()

        // console.log(Form.getValues())
        // console.log(description, amount, date)

        if(description.trim() === "" || amount.trim() === "" || date.trim() === "") {
            throw new Error("Por favor, preencha todos os campos")
        }
    },

    formatValues() {
        let { description, amount, date } = Form.getValues()

        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)
        // console.log(date)

        return {
            description,
            amount,
            date
        }
    },

    // saveTransaction(transaction) {
    //     Transaction.add(transaction)
    // },

    clearFields() {
        Form.description.value = ''
        Form.amount.value = ''
        Form.date.value = ''
    },

    submit(event) {
        event.preventDefault()

        // console.log(event)

        try {
            //verificar se todas as informações foram preenchidas
        Form.validateFields()

        // formatar os dados para salvar
        const transaction = Form.formatValues()

        // salvar
        // Form.saveTransaction(transaction)
        Transaction.add(transaction)

        //apagar os dados do formulario
        Form.clearFields()

        //modal feche
        Modal.close()

        // atualizar a aplicação

        } catch (error) {
            alert(error.message)
        }
    }
}

const App = {
    init() {
        // DOM.addTransaction(transactions[1])

        Transaction.all.forEach((transaction, index) => {
            DOM.addTransaction(transaction, index)
        })

        // chama a função do updateBalance
        DOM.updateBalance()

        Storage.set(Transaction.all)
    },

    reload() {
        DOM.clearTransactions()
        App.init()
    }
}

App.init()

// verifica se foi adicionando novo produto
// Transaction.add({
//     description: 'Alo',
//     amount: 20000,
//     date: '23/01/2021'
// })

// verifica se foi excluido o produto pelo array
// Transaction.remove(0)