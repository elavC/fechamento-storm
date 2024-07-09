'use strict'

const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}


const getLocalStorage = () => JSON.parse(localStorage.getItem('db_client')) ?? []
const setLocalStorage = (dbClient) => localStorage.setItem("db_client", JSON.stringify(dbClient))

// CRUD - create read update delete
const deleteClient = (index) => {
    const dbClient = readClient()
    dbClient.splice(index, 1)
    setLocalStorage(dbClient)
}

const updateClient = (index, client) => {
    const dbClient = readClient()
    dbClient[index] = client
    setLocalStorage(dbClient)
}

const readClient = () => getLocalStorage()

const createClient = (client) => {
    const dbClient = getLocalStorage()
    dbClient.push (client)
    setLocalStorage(dbClient)
}

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

//Interação com o layout

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
    document.getElementById('nome').dataset.index = 'new'
    document.querySelector(".modal-header>h2").textContent  = 'Novo Cliente'
}

const saveClient = () => {
    if (isValidFields()) {
        const client = {
            nome: document.getElementById('nome').value,
            produto: document.getElementById('produto').value,
            marca: document.getElementById('marca').value,
            armazenamento: document.getElementById('armazenamento').value,
            valorRecebido: document.getElementById('valorRecebido').value,
            custo: document.getElementById('custo').value,
            lucro: document.getElementById('lucro').value,
            vendedor: document.getElementById('vendedor').value,
            data: document.getElementById('data').value,
            origem: document.getElementById('origem').value,
        }
        const index = document.getElementById('nome').dataset.index
        if (index == 'new') {
            createClient(client)
            updateTable()
            closeModal()
        } else {
            updateClient(index, client)
            updateTable()
            closeModal()
        }
    }
};

function calcLucro() {
    let subValorRecebido = document.getElementById('valorRecebido').value;
    let subCusto = document.getElementById('custo').value;
    let subLucro = document.getElementById('lucro');

    subLucro.value = subValorRecebido-subCusto;

}

const createRow = (client, index) => {
    const allValueName = 'class="allValueName"';
    const allValueReceived = 'class="allValueReceived"';
    const allValueExpense = 'class="allValueExpense"';
    const allValueProfit = 'class="allValueProfit"';
    const allValueSeller = 'class="allValueSeller"';

    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td ${allValueName}>${client.nome}</td>
        <td>${client.produto}</td>
        <td>${client.marca}</td>
        <td>${client.armazenamento}</td>
        <td ${allValueReceived}>${client.valorRecebido}</td>
        <td ${allValueExpense}>${client.custo}</td>
        <td ${allValueProfit}>${client.lucro}</td>
        <td ${allValueSeller}>${client.vendedor}</td>
        <td>${client.data}</td>
        <td>${client.origem}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}" >Excluir</button>
        </td>
    `
    document.querySelector('#tableClient>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableClient>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbClient = readClient()
    clearTable()
    dbClient.forEach(createRow)
}

const fillFields = (client) => {
    document.getElementById('nome').value = client.nome
    document.getElementById('produto').value = client.produto
    document.getElementById('marca').value = client.marca
    document.getElementById('armazenamento').value = client.armazenamento
    document.getElementById('valorRecebido').value = client.valorRecebido
    document.getElementById('custo').value = client.custo
    document.getElementById('lucro').value = client.lucro
    document.getElementById('vendedor').value = client.vendedor
    document.getElementById('data').value = client.data
    document.getElementById('origem').value = client.origem
    document.getElementById('nome').dataset.index = client.index
}

const editClient = (index) => {
    const client = readClient()[index]
    client.index = index
    fillFields(client)
    document.querySelector(".modal-header>h2").textContent  = `Editando ${client.nome}`
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editClient(index)
        } else {
            const client = readClient()[index]
            const response = confirm(`Deseja realmente excluir o cliente ${client.nome}`)
            if (response) {
                deleteClient(index)
                updateTable()
            }
        }
    }
}

updateTable()

// Relatório

const valorTotalRecebido = document.getElementById('valorTotalRecebido');
const lucroDia = document.getElementById('lucroDia');
const totalSaida = document.getElementById('totalSaida');
const venRakel = document.getElementById('venRakel');
const venJackson = document.getElementById('venJackson');

function setReport() {
    const arrValueReceived = [];
    let sunAllValueReceived = document.querySelectorAll(".allValueReceived");
    
    sunAllValueReceived.forEach(function(Received, i) {
        arrValueReceived.push(Received.innerHTML);
    });

    const returnMap = arrValueReceived.map((valueReceived) =>{
        return parseFloat(valueReceived);
    })

    let soma = 0;
    for (let i = 0; i < returnMap.length; i++) {
      soma += returnMap[i];
    }

    valorTotalRecebido.value = `R$ ${soma}`;

};

function setProfit() {
    const arrValueProfit = [];
    let sunAllValueProfit = document.querySelectorAll(".allValueProfit");
    
    sunAllValueProfit.forEach(function(profit, i) {
        arrValueProfit.push(profit.innerHTML);
    });

    const returnMap = arrValueProfit.map((valueProfit) =>{
        return parseFloat(valueProfit);
    })

    let soma = 0;
    for (let i = 0; i < returnMap.length; i++) {    
      soma += returnMap[i];
    }

    lucroDia.value = `R$ ${soma}`;

};

function setSellerRakel() {
    const arrvalueSeller = [];
    let sunAllValueSeller = document.querySelectorAll('.allValueSeller');

    sunAllValueSeller.forEach(function(profit, i) {
        arrvalueSeller.push(profit.innerHTML);
    });

    let qtdRakel = 0;
    for (let i = 0; i < arrvalueSeller.length; i++) {
        if (arrvalueSeller[i] === "rakel") qtdRakel++;
    }

    venRakel.value = qtdRakel;
}

function setSellerJackson() {
    const arrvalueSeller = [];
    let sunAllValueSeller = document.querySelectorAll('.allValueSeller');

    sunAllValueSeller.forEach(function(profit, i) {
        arrvalueSeller.push(profit.innerHTML);
    });

    let qtdJackson = 0;
    for (let i = 0; i < arrvalueSeller.length; i++) {
        if (arrvalueSeller[i] === "jackson") qtdJackson++;
    }

    venJackson.value = qtdJackson;
}



// Eventos
document.getElementById('relatorioShow').addEventListener('click', setReport)
document.getElementById('relatorioShow').addEventListener('click', setProfit)
document.getElementById('relatorioShow').addEventListener('click', setSellerRakel)
document.getElementById('relatorioShow').addEventListener('click', setSellerJackson)


document.getElementById('cadastrarCliente').addEventListener('click', openModal)

document.getElementById('modalClose').addEventListener('click', closeModal)

document.getElementById('salvar').addEventListener('click', saveClient)

document.querySelector('#tableClient>tbody').addEventListener('click', editDelete)

document.getElementById('cancelar').addEventListener('click', closeModal)

document.getElementById('custo').addEventListener('focusout', calcLucro);

