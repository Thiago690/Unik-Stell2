let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("carousel-slide");
    if (n > slides.length) {
        slideIndex = 1
    }
    if (n < 1) {
        slideIndex = slides.length
    }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[slideIndex - 1].style.display = "block";
}

// Auto-play the carousel
let myIndex = 0;
carousel();

function carousel() {
    let i;
    let x = document.getElementsByClassName("carousel-slide");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    myIndex++;
    if (myIndex > x.length) {
        myIndex = 1
    }
    x[myIndex - 1].style.display = "block";
    setTimeout(carousel, 3000); // Change image every 3 seconds
}


/


// Variável para rastrear o índice do slide atual
let slideIndex = 1;

// Chama a função para exibir o primeiro slide ao carregar a página
showSlides(slideIndex);

// Função para avançar ou retroceder o slide
function plusSlides(n) {
    showSlides(slideIndex += n);
}

// Função para ir para um slide específico usando os pontos de navegação
function currentSlide(n) {
    showSlides(slideIndex = n);
}

// Função principal que controla a exibição dos slides e dos pontos ativos
function showSlides(n) {
    let i;
    // Pega todos os elementos com a classe "carousel-slide" (as imagens)
    let slides = document.getElementsByClassName("carousel-slide");
    // Pega todos os elementos com a classe "dot" (os indicadores)
    let dots = document.getElementsByClassName("dot");
    
    // Lógica de loop infinito (se passar do último, volta para o primeiro)
    if (n > slides.length) {
        slideIndex = 1;
    }    
    // (se tentar ir antes do primeiro, vai para o último)
    if (n < 1) {
        slideIndex = slides.length;
    }
    
    // 1. Oculta todos os slides
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";  
    }
    
    // 2. Remove a classe 'active' (cor escura) de todos os pontos
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    
    // 3. Exibe o slide atual (slideIndex - 1 porque o array começa em 0)
    slides[slideIndex - 1].style.display = "block";  
    
    // 4. Ativa o ponto correspondente
    dots[slideIndex - 1].className += " active";
}