document.addEventListener('DOMContentLoaded', () => {
    let cart = [];
    
    const cartItemsList = document.getElementById('cart-items');
    const cartTotalSpan = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout-button');
    const productList = document.querySelector('.products-list');

    // 1. Função para renderizar o carrinho na interface (MODIFICADA)
    function renderCart() {
        cartItemsList.innerHTML = ''; // Limpa a lista atual

        let total = 0;

        cart.forEach(item => {
            const listItem = document.createElement('li');
            listItem.classList.add('cart-item');
            
            const itemPrice = parseFloat(item.price);
            const subtotal = itemPrice * item.quantity;
            total += subtotal;

            listItem.innerHTML = `
                <div class="item-details">
                    <span>${item.name} - R$ ${itemPrice.toFixed(2).replace('.', ',')}</span>
                    <input type="number" 
                           class="item-quantity" 
                           value="${item.quantity}" 
                           min="1" 
                           data-name="${item.name}">
                    <span>Subtotal: R$ ${subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
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
        const existingItem = cart.find(item => item.name === name);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ name: name, price: price, quantity: 1 });
        }

        renderCart();
    }

    // 3. Função para remover um item do carrinho
    function removeItemFromCart(name) {
        cart = cart.filter(item => item.name !== name);
        renderCart();
    }
    
    // NOVO: Função para alterar a quantidade do item
    function changeItemQuantity(name, newQuantity) {
        const item = cart.find(i => i.name === name);

        if (item) {
            const quantity = parseInt(newQuantity);
            
            if (quantity > 0) {
                item.quantity = quantity;
            } else {
                // Se a quantidade for 0 ou menos, remove o item
                removeItemFromCart(name);
                return;
            }
        }
        renderCart();
    }

    // 4. Lógica para os botões "Adicionar"
    productList.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-cart')) {
            const productDiv = event.target.closest('.product');
            const name = productDiv.getAttribute('data-name');
            const price = parseFloat(productDiv.getAttribute('data-price'));
            
            addItemToCart(name, price);
        }
    });

    // 5. Lógica para os botões "Remover" e o campo de "Quantidade" (DELEGAÇÃO)
    cartItemsList.addEventListener('click', (event) => {
        // Lógica de Remover
        if (event.target.classList.contains('remove-item')) {
            const nameToRemove = event.target.getAttribute('data-name');
            removeItemFromCart(nameToRemove);
        }
    });

    cartItemsList.addEventListener('change', (event) => {
        // Lógica de Alterar Quantidade (usando o evento 'change' no input)
        if (event.target.classList.contains('item-quantity')) {
            const nameToUpdate = event.target.getAttribute('data-name');
            const newQuantity = event.target.value;
            
            changeItemQuantity(nameToUpdate, newQuantity);
        }
    });

    // 6. Lógica para o botão "Continuar Compra"
    checkoutButton.addEventListener('click', () => {
        if (cart.length > 0) {
            alert(`Compra continuada! Total a pagar: ${cartTotalSpan.textContent}`);
        } else {
            alert('Seu carrinho está vazio. Adicione itens para continuar a compra!');
        }
    });

    // Inicializa o carrinho na tela
    renderCart(); 
});