// Slider
let slideIndex = 0;
const slides = document.querySelectorAll('.slide');
const indicators = document.querySelectorAll('.indicator');
const prev = document.querySelector('.prev');
const next = document.querySelector('.next');

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (indicators[i]) indicators[i].classList.remove('active');
        if (i === index) {
            slide.classList.add('active');
            if (indicators[i]) indicators[i].classList.add('active');
        }
    });
}

function nextSlide() {
    slideIndex = (slideIndex + 1) % slides.length;
    showSlide(slideIndex);
}

function prevSlide() {
    slideIndex = (slideIndex - 1 + slides.length) % slides.length;
    showSlide(slideIndex);
}

if (prev && next) {
    next.addEventListener('click', nextSlide);
    prev.addEventListener('click', prevSlide);
}

if (indicators.length > 0) {
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            slideIndex = index;
            showSlide(slideIndex);
        });
    });
}

setInterval(nextSlide, 5000); // Muda o slide a cada 5 segundos

// Lightbox
function openLightbox() {
    document.getElementById('lightbox').style.display = 'block';
}

function closeLightbox() {
    document.getElementById('lightbox').style.display = 'none';
}

let currentSlideIndex = 1;

function currentSlide(n) {
    showLightboxSlide(currentSlideIndex = n);
}

function changeSlide(n) {
    showLightboxSlide(currentSlideIndex += n);
}

function showLightboxSlide(n) {
    const slides = document.querySelectorAll('.lightbox-slide');
    if (n > slides.length) { currentSlideIndex = 1 }
    if (n < 1) { currentSlideIndex = slides.length }
    slides.forEach(slide => slide.style.display = 'none');
    slides[currentSlideIndex - 1].style.display = 'block';
}

// Inicializa o lightbox
document.addEventListener('DOMContentLoaded', () => {
    showLightboxSlide(currentSlideIndex);
});

// Menu Hambúrguer Responsivo
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Filtro de Motos por Tipo
const filterButtons = document.querySelectorAll('.filter-btn');
const motoItems = document.querySelectorAll('.moto-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove a classe 'active' de todos os botões
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Adiciona a classe 'active' ao botão clicado
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');

        motoItems.forEach(item => {
            if (filterValue === 'all') {
                item.style.display = 'block';
            } else {
                if (item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            }
        });
    });
});

// Adicionar Funcionalidade para Adicionar e Remover Motos

// Selecionar elementos do DOM
const addMotoBtn = document.getElementById('add-moto-btn');
const modal = document.getElementById('modal');
const closeModal = document.querySelector('.close');
const addMotoForm = document.getElementById('add-moto-form');
const motosGrid = document.querySelector('.motos-grid');

// Abrir o Modal ao Clicar no Botão "Adicionar Moto"
addMotoBtn.addEventListener('click', () => {
    modal.style.display = 'block';
});

// Fechar o Modal ao Clicar no "X"
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Fechar o Modal ao Clicar Fora do Conteúdo do Modal
window.addEventListener('click', (event) => {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
});

// Função para Ler a Imagem Selecionada e Retornar uma URL Base64
function getImageURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            resolve(e.target.result);
        };
        reader.onerror = function() {
            reject('Erro ao ler o arquivo');
        };
        reader.readAsDataURL(file);
    });
}

// Manipulador de Envio do Formulário
addMotoForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Obter os valores do formulário
    const imgInput = document.getElementById('moto-img');
    const nomeInput = document.getElementById('moto-nome');
    const tipoInput = document.getElementById('moto-tipo');
    const legendaInput = document.getElementById('moto-legenda');

    const imgFile = imgInput.files[0];
    const nome = nomeInput.value.trim();
    const tipo = tipoInput.value;
    const legenda = legendaInput.value.trim();

    if (!imgFile || !nome || !tipo || !legenda) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    try {
        const imgURL = await getImageURL(imgFile);

        // Criar o elemento da nova moto
        const motoItem = document.createElement('div');
        motoItem.classList.add('moto-item');
        motoItem.setAttribute('data-category', tipo);

        // Estrutura da nova moto
        motoItem.innerHTML = `
            <img src="${imgURL}" alt="${nome}">
            <h3>${nome}</h3>
            <p>${legenda}</p>
            <button class="remove-btn">Remover</button>
        `;

        // Adicionar o novo item à grid
        motosGrid.appendChild(motoItem);

        // Atualizar a lista de motoItems
        motoItems.forEach(item => {}); // Esta linha pode ser removida

        // Re-adicionar o evento de remoção para o novo botão
        const removeBtn = motoItem.querySelector('.remove-btn');
        removeBtn.addEventListener('click', () => {
            motosGrid.removeChild(motoItem);
        });

        // Atualizar a lista de motoItems para incluir o novo item
        // (Não é necessário, pois estamos manipulando o DOM diretamente)

        // Resetar o formulário
        addMotoForm.reset();

        // Fechar o modal
        modal.style.display = 'none';

        // Reaplicar o filtro atual
        const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        filterMotoItems(activeFilter);

    } catch (error) {
        console.error(error);
        alert('Falha ao adicionar a moto. Tente novamente.');
    }
});

// Função para Filtrar Motos
function filterMotoItems(filterValue) {
    const currentFilter = filterValue || 'all';
    const activeFilterButton = document.querySelector(`.filter-btn[data-filter="${currentFilter}"]`);

    // Atualizar a classe 'active' nos botões
    filterButtons.forEach(btn => btn.classList.remove('active'));
    if (activeFilterButton) {
        activeFilterButton.classList.add('active');
    }

    // Mostrar ou ocultar motos com base no filtro
    const allMotoItems = document.querySelectorAll('.moto-item');
    allMotoItems.forEach(item => {
        if (currentFilter === 'all') {
            item.style.display = 'block';
        } else {
            if (item.getAttribute('data-category') === currentFilter) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        }
    });
}

// Adicionar Funcionalidade de Remoção para Motos Existentes
const existingRemoveBtns = document.querySelectorAll('.remove-btn');
existingRemoveBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const motoItem = btn.parentElement;
        motosGrid.removeChild(motoItem);
    });
});
