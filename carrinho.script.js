document.addEventListener('DOMContentLoaded', () => {
    let cart = []; // Array para armazenar os itens do carrinho
    
    const cartItemsList = document.getElementById('cart-items');
    const subtotalSpan = document.getElementById('subtotal');
    const cartTotalSpan = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout-button');
    const productList = document.querySelector('.products-list-mock');

    // Função auxiliar para formatar preço (R$ 0,00)
    function formatPrice(price) {
        return `R$ ${price.toFixed(2).replace('.', ',')}`;
    }

    // 1. Função para renderizar o carrinho na interface
    function renderCart() {
        cartItemsList.innerHTML = '';
        let total = 0;

        // Se o carrinho estiver vazio, mostra uma mensagem e zera o total.
        if (cart.length === 0) {
            cartItemsList.innerHTML = '<p class="empty-cart-message" style="text-align: center; padding: 30px; color: #666;">Seu carrinho está vazio.</p>';
        }

        cart.forEach(item => {
            const listItem = document.createElement('li');
            listItem.classList.add('cart-item');
            
            const itemPrice = parseFloat(item.price);
            const subtotalItem = itemPrice * item.quantity;
            total += subtotalItem;

            listItem.innerHTML = `
                <div class="item-details">
                    <div class="item-info">
                        <span class="item-name">${item.name}</span>
                        <span class="item-price-unit">${formatPrice(itemPrice)} / un.</span>
                    </div>
                </div>

                <div class="item-actions">
                    <input type="number" 
                           class="item-quantity" 
                           value="${item.quantity}" 
                           min="1" 
                           data-name="${item.name}">
                    
                    <strong>${formatPrice(subtotalItem)}</strong>

                    <button class="remove-item" data-name="${item.name}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;

            cartItemsList.appendChild(listItem);
        });

        // Atualiza o resumo
        subtotalSpan.textContent = formatPrice(total);
        // Assumindo frete grátis (0.00) para manter simples.
        cartTotalSpan.textContent = formatPrice(total); 
    }

    // 2. Adicionar um item ao carrinho
    function addItemToCart(name, price) {
        const existingItem = cart.find(item => item.name === name);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ name: name, price: price, quantity: 1 });
        }

        renderCart();
    }

    // 3. Remover um item do carrinho
    function removeItemFromCart(name) {
        cart = cart.filter(item => item.name !== name);
        renderCart();
    }
    
    // 4. Alterar a quantidade do item
    function changeItemQuantity(name, newQuantity) {
        const item = cart.find(i => i.name === name);
        const quantity = parseInt(newQuantity);

        if (item && quantity > 0) {
            item.quantity = quantity;
        } else if (item && quantity <= 0) {
            removeItemFromCart(name);
        }
        renderCart();
    }

    // --- Listeners de Eventos ---

    // 5. Adicionar: Captura cliques nos botões "Adicionar"
    productList.addEventListener('click', (event) => {
        if (event.target.closest('.add-to-cart')) {
            const productDiv = event.target.closest('.product');
            const name = productDiv.getAttribute('data-name');
            const price = parseFloat(productDiv.getAttribute('data-price'));
            
            addItemToCart(name, price);
        }
    });

    // 6. Remover e Alterar Quantidade: Delegação de eventos no contêiner do carrinho
    cartItemsList.addEventListener('click', (event) => {
        // Lógica de Remover
        if (event.target.closest('.remove-item')) {
            const button = event.target.closest('.remove-item');
            const nameToRemove = button.getAttribute('data-name');
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

    // 7. Botão "Continuar Compra"
    checkoutButton.addEventListener('click', () => {
        if (cart.length > 0) {
            alert(`✅ Redirecionando para o Checkout!\nTotal: ${cartTotalSpan.textContent}`);
        } else {
            alert('❌ Seu carrinho está vazio. Adicione itens para continuar a compra!');
        }
    });

    // Inicializa o carrinho na tela
    renderCart(); 
});