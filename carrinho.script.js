// Seleção dos elementos do DOM
const carrinhoLateral = document.getElementById('carrinhoLateral');
const abrirCarrinhoBtn = document.getElementById('abrirCarrinho');
const fecharCarrinhoBtn = document.getElementById('fecharCarrinho');
const listaItensDiv = document.getElementById('listaItens');
const totalCarrinhoSpan = document.getElementById('totalCarrinho');
const contadorItensSpan = document.getElementById('contadorItens');
const carrinhoVazioMsg = document.getElementById('carrinhoVazioMsg');

// Array para armazenar os itens do carrinho
let itensCarrinho = [];

// Funções para abrir e fechar a aba lateral
function abrirCarrinho() {
    carrinhoLateral.classList.add('carrinho-aberto');
}

function fecharCarrinho() {
    carrinhoLateral.classList.remove('carrinho-aberto');
}

// Event Listeners
abrirCarrinhoBtn.addEventListener('click', abrirCarrinho);
fecharCarrinhoBtn.addEventListener('click', fecharCarrinho);

// Função para atualizar a visualização do carrinho e o total
function atualizarCarrinhoVisual() {
    listaItensDiv.innerHTML = '';
    let total = 0;
    let contador = 0;

    if (itensCarrinho.length === 0) {
        carrinhoVazioMsg.style.display = 'block';
    } else {
        carrinhoVazioMsg.style.display = 'none';
    }

    itensCarrinho.forEach(item => {
        // Cria a div para cada item
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('carrinho-item');
        itemDiv.innerHTML = `
            <span>${item.nome} (x${item.quantidade})</span>
            <span>R$ ${(item.preco * item.quantidade).toFixed(2)}</span>
        `;
        listaItensDiv.appendChild(itemDiv);

        total += item.preco * item.quantidade;
        contador += item.quantidade;
    });

    totalCarrinhoSpan.textContent = total.toFixed(2);
    contadorItensSpan.textContent = contador;
}

// Função para adicionar um item ao carrinho
window.adicionarAoCarrinho = function(nome, preco) {
    const itemExistente = itensCarrinho.find(item => item.nome === nome);

    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        itensCarrinho.push({ nome: nome, preco: preco, quantidade: 1 });
    }

    atualizarCarrinhoVisual();
    // Opcional: abre o carrinho automaticamente ao adicionar o primeiro item
    if (!carrinhoLateral.classList.contains('carrinho-aberto')) {
        abrirCarrinho();
    }
}

// Inicializa a visualização do carrinho
atualizarCarrinhoVisual();
