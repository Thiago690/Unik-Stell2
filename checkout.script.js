<script>
    // ... (todo o seu código de cor/tamanho) ...

    function goToCheckout() {
        const selectedSize = window.getSelectedSize();

        if (selectedSize === 'Nenhum selecionado') {
            alert('Por favor, selecione um tamanho antes de comprar.');
            return;
        }

        // REDIRECIONA PARA O ARQUIVO DO CHECKOUT
        window.location.href = "checkout.html";
    }
</script>