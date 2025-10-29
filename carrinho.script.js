document.addEventListener('DOMContentLoaded', () => {
    // Array para armazenar os itens do carrinho
    let cart = [];
    
    const cartItemsList = document.getElementById('cart-items');
    const cartTotalSpan = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout-button');
    const productList = document.querySelector('.products-list');

    // 1. Função para renderizar o carrinho na interface
    function renderCart() {
        cartItemsList.innerHTML = ''; // Limpa a lista atual

        let total = 0;

        cart.forEach(item => {
            // Cria o elemento da lista (<li>) para o item
            const listItem = document.createElement('li');
            listItem.classList.add('cart-item');
            
            const itemPrice = parseFloat(item.price);
            const subtotal = itemPrice * item.quantity;
            total += subtotal;

            listItem.innerHTML = `
                <span>${item.name} (x${item.quantity}) - R$ ${subtotal.toFixed(2).replace('.', ',')}</span>
                <button class="remove-item" data-name="${item.name}">Remover</button>
            `;

            cartItemsList.appendChild(listItem);
        });

        // Atualiza o total do carrinho
        cartTotalSpan.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;

        // Adiciona ou remove a mensagem de carrinho vazio
        if (cart.length === 0) {
            cartItemsList.innerHTML = '<li style="text-align: center; color: #666;">O carrinho está vazio.</li>';
        }
    }

    // 2. Função para adicionar um item ao carrinho
    function addItemToCart(name, price) {
        // Verifica se o item já existe no carrinho
        const existingItem = cart.find(item => item.name === name);

        if (existingItem) {
            existingItem.quantity += 1; // Se existir, apenas aumenta a quantidade
        } else {
            // Se não existir, adiciona um novo item
            cart.push({ name: name, price: price, quantity: 1 });
        }

        renderCart(); // Atualiza a visualização
    }

    // 3. Função para remover um item do carrinho
    function removeItemFromCart(name) {
        // Filtra o array, mantendo apenas os itens que NÃO têm o nome fornecido
        cart = cart.filter(item => item.name !== name);
        renderCart(); // Atualiza a visualização
    }
    
    // 4. Lógica para os botões "Adicionar"
    productList.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-cart')) {
            // Pega o elemento pai (o produto)
            const productDiv = event.target.closest('.product');
            
            // Pega os dados do produto via atributos 'data-'
            const name = productDiv.getAttribute('data-name');
            const price = parseFloat(productDiv.getAttribute('data-price'));
            
            addItemToCart(name, price);
        }
    });

    // 5. Lógica para os botões "Remover" (usando delegação de eventos)
    cartItemsList.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-item')) {
            const nameToRemove = event.target.getAttribute('data-name');
            removeItemFromCart(nameToRemove);
        }
    });

    // 6. Lógica para o botão "Continuar Compra"
    checkoutButton.addEventListener('click', () => {
        if (cart.length > 0) {
            alert(`Compra continuada! Total a pagar: ${cartTotalSpan.textContent}`);
            // Aqui você adicionaria a lógica real de checkout (ex: redirecionar para uma página de pagamento)
            
            // Opcional: Esvaziar o carrinho após o "checkout"
            // cart = [];
            // renderCart();
        } else {
            alert('Seu carrinho está vazio. Adicione itens para continuar a compra!');
        }
    });

    // Inicializa o carrinho na tela
    renderCart(); 
});