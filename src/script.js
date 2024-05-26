import app from './firebase-init';

document.addEventListener('DOMContentLoaded', function() {
    const cardsPerPage = 12;
    let currentPage = 1;

    const createButtons = document.querySelectorAll('.create-button');
    const contentBox = document.querySelector('.content-box');
    const cardContainer = document.createElement('div');
    cardContainer.classList.add('card-container');

    const cardsData = []; // Array para armazenar os dados dos cards

    createButtons.forEach(function(createButton) {
        createButton.addEventListener('click', function() {
            const modal = document.getElementById('modal');
            modal.style.display = 'block';

            const nomeInput = document.getElementById('nome');
            const tagInput = document.getElementById('tag');
            nomeInput.value = "";
            tagInput.value = "";
        });
    });

    const closeButton = document.querySelector('.close-button');
    closeButton.addEventListener('click', closeModal);

    const saveButton = document.querySelector('.save-button');

    saveButton.addEventListener('click', function() {
        const nomeInput = document.getElementById('nome');
        const tagInput = document.getElementById('tag');
        const nomeValue = nomeInput.value;
        const tagValue = tagInput.value;

        if (nomeValue === "" || tagValue === "") {
            alert("Por favor, preencha todos os campos.");
            return; // Impede a criação do card se algum campo estiver vazio
        }

        const modal = document.getElementById('modal');
        modal.style.display = 'none';

        const newCard = document.createElement('div');
        newCard.classList.add('card');
        newCard.innerHTML = `
            <h2>${nomeValue}</h2>
            <p>${tagValue}</p>
            <button class="delete-button">X</button>
            <button class="start-button" disabled>Começar</button> 
            <button class="edit-button">Editar</button>
        `;

        const cardData = {
            name: nomeValue,
            tag: tagValue,
            flashcards: [] // Array para armazenar os dados dos flashcards deste conjunto
        };
        
        // Remover o card excluído dos dados
        const deleteButton = newCard.querySelector('.delete-button');
        deleteButton.addEventListener('click', function() {
            newCard.remove();
            // Remover o card excluído dos dados
            const index = cardsData.indexOf(cardData);
            if (index !== -1) {
                cardsData.splice(index, 1);
            }
        });

        const editButton = newCard.querySelector('.edit-button');
        editButton.addEventListener('click', function() {
            const editModal = document.createElement('div');
            editModal.classList.add('edit-modal');
            editModal.id = 'edit-modal';
            editModal.innerHTML = `
                <div class="modal-content">
                    <button class="close-button" onclick="closeEditModal()">X</button>
                    <h2>Editar Card</h2>
                    <form>
                        <div class="form-group">
                            <label for="edit-nome">Nome</label>
                            <input type="text" id="edit-nome" name="edit-nome" placeholder="Digite o nome">
                        </div>
                        <div class="form-group">
                            <label for="edit-tag">Descrição</label>
                            <input type="text" id="edit-tag" name="edit-tag" placeholder="Digite a descrição">
                        </div>
                    </form>
                    <div class="flashcards-section">
                        <h3>Flashcards</h3>
                        <button class="add-flashcard">Adicionar Flashcard</button>
                    </div>
                    <div class="flashcards-container"></div>
                    <button class="save-edit-button">Salvar</button>
                </div>
            `;

            const nomeEditInput = editModal.querySelector('#edit-nome');
            const tagEditInput = editModal.querySelector('#edit-tag');
            nomeEditInput.value = nomeValue;
            tagEditInput.value = tagValue;

            const flashcardsContainer = editModal.querySelector('.flashcards-container');

            // Mostrar flashcards adicionados
            cardData.flashcards.forEach(flashcardData => {
                const newFlashcard = createFlashcardElement(flashcardData.question, flashcardData.answer);
                flashcardsContainer.appendChild(newFlashcard);
            });

            const closeButton = editModal.querySelector('.close-button');
            closeButton.addEventListener('click', function() {
                editModal.remove();
            });

            const addFlashcardButton = editModal.querySelector('.add-flashcard');
            addFlashcardButton.addEventListener('click', function() {
                const addModal = document.createElement('div');
                addModal.classList.add('add-modal');
                addModal.id = 'add-modal';
                addModal.innerHTML = `
                    <div class="modal-content">
                        <button class="close-button" onclick="closeAddModal()">X</button>
                        <h2>Adicionar Novo Flashcard</h2>
                        <form>
                            <div class="form-group">
                                <label for="add-question">Pergunta</label>
                                <input type="text" id="add-question" name="add-question" placeholder="Digite a pergunta">
                            </div>
                            <div class="form-group">
                                <label for="add-answer">Resposta</label>
                                <input type="text" id="add-answer" name="add-answer" placeholder="Digite a resposta">
                            </div>
                        </form>
                        <button class="save-add-button">Salvar</button>
                    </div>
                `;

                const saveAddButton = addModal.querySelector('.save-add-button');
                saveAddButton.addEventListener('click', function() {
                    const questionInput = addModal.querySelector('#add-question');
                    const answerInput = addModal.querySelector('#add-answer');
                    const questionValue = questionInput.value.trim();
                    const answerValue = answerInput.value.trim();

                    if (questionValue && answerValue) {
                        const newFlashcard = createFlashcardElement(questionValue, answerValue);
                        flashcardsContainer.appendChild(newFlashcard);
                        // Adicionar flashcard aos dados do card
                        cardData.flashcards.push({ question: questionValue, answer: answerValue });
                        addModal.remove();
                        if(cardData.flashcards.length >= 2){
                            startButton.disabled = false;
                        }
                    } else {
                        alert('Por favor, insira uma pergunta e uma resposta.');
                    }
                });

                const closeButtonAddModal = addModal.querySelector('.close-button');
                closeButtonAddModal.addEventListener('click', function() {
                    addModal.remove();
                });

                document.body.appendChild(addModal);
            });

            const saveEditButton = editModal.querySelector('.save-edit-button');
            saveEditButton.addEventListener('click', function() {
                const editedNomeValue = nomeEditInput.value;
                const editedTagValue = tagEditInput.value;

                newCard.querySelector('h2').textContent = editedNomeValue;
                newCard.querySelector('p').textContent = editedTagValue;

                cardData.name = editedNomeValue;
                cardData.tag = editedTagValue;

                // Atualizar os dados dos flashcards
                cardData.flashcards.length = 0; // Limpar os dados existentes
                nomeInput.value = "";
                tagInput.value = "";
                
                flashcardsContainer.querySelectorAll('.flashcard').forEach(flashcard => {
                    const question = flashcard.querySelector('.question').textContent;
                    const answer = flashcard.querySelector('.answer').textContent;
                    cardData.flashcards.push({ question: question, answer: answer });
                });

                editModal.remove();
            });

            document.body.appendChild(editModal);
        });

        const startButton = newCard.querySelector('.start-button');
        startButton.addEventListener('click', function() {
            let currentFlashcardIndex = 0;
            let correctCount = 0;
            let incorrectCount = 0;
            let answeredFlashcards = new Set(); // Conjunto para armazenar os flashcards respondidos

            const startModal = document.createElement('div');
            startModal.classList.add('start-modal');
            startModal.id = 'start-modal';
            startModal.innerHTML = `
                <div class="modal-content">
                    <button class="close-button" onclick="closeStartModal()">X</button>
                    <h2>FLASHCARD</h2>
                    <div class="rectangle" id="flashcard">
                        <div class="front">
                            <h2>Pergunta</h2>
                            <p>${cardData.flashcards.length > 0 ? cardData.flashcards[0].question : 'No flashcards added yet'}</p>
                        </div>
                        <div class="back">
                            <h2>Resposta</h2>
                            <p>${cardData.flashcards.length > 0 ? cardData.flashcards[0].answer : 'No flashcards added yet'}</p>
                        </div>
                    </div>
                    <button class="arrow-button">▶</button>
                    <button id="flip-button">Virar</button>
                    <button id="random-button">Sortear Flashcard</button>
                    <div class="button-container">
                        <button class="correct-button">Correto</button>
                        <button class="incorrect-button">Errado</button>
                    </div>
                    <p id="score-display">Corretos: 0 | Errados: 0</p>
                </div>
            `;

            const flipButton = startModal.querySelector('#flip-button');
            const flashcard = startModal.querySelector('#flashcard');
            const scoreDisplay = startModal.querySelector('#score-display');

            flipButton.addEventListener('click', () => {
                flashcard.classList.toggle('flipped');
            });

            const randomButton = startModal.querySelector('#random-button');
            randomButton.addEventListener('click', function() {
                if (cardData.flashcards.length > 0) {
                    const randomIndex = Math.floor(Math.random() * cardData.flashcards.length);
                    const randomFlashcard = cardData.flashcards[randomIndex];
                    
                    const frontSide = startModal.querySelector('.front');
                    const backSide = startModal.querySelector('.back');
                    
                    frontSide.querySelector('p').textContent = randomFlashcard.question;
                    backSide.querySelector('p').textContent = randomFlashcard.answer;
                    
                    flashcard.classList.remove('flipped');
                } else {
                    alert('No flashcards available to shuffle.');
                }
            });

            const arrowButton = startModal.querySelector('.arrow-button');
            arrowButton.addEventListener('click', function() {
                if (currentFlashcardIndex < cardData.flashcards.length - 1) {
                    currentFlashcardIndex++;
                } else {
                    currentFlashcardIndex = 0;
                }
                const nextFlashcard = cardData.flashcards[currentFlashcardIndex];
                const frontSide = startModal.querySelector('.front');
                const backSide = startModal.querySelector('.back');
                frontSide.querySelector('p').textContent = nextFlashcard.question;
                backSide.querySelector('p').textContent = nextFlashcard.answer;
                flashcard.classList.remove('flipped');
            });

            const correctButton = startModal.querySelector('.correct-button');
            correctButton.addEventListener('click', function() {
                correctCount++;
                updateScoreDisplay();
                markFlashcardAsAnswered(currentFlashcardIndex);
                moveToNextFlashcard();
            });

            const incorrectButton = startModal.querySelector('.incorrect-button');
            incorrectButton.addEventListener('click', function() {
                incorrectCount++;
                updateScoreDisplay();
                markFlashcardAsAnswered(currentFlashcardIndex);
                moveToNextFlashcard();
            });

            function updateScoreDisplay() {
                scoreDisplay.textContent = `Corretos: ${correctCount} | Errados: ${incorrectCount}`;
            }

            function markFlashcardAsAnswered(index) {
                answeredFlashcards.add(index);
            }

            function moveToNextFlashcard() {
                if (answeredFlashcards.size === cardData.flashcards.length) {
                    alert('Você respondeu todos os flashcards!');
                    startModal.remove();
                    return;
                }

                do {
                    if (currentFlashcardIndex < cardData.flashcards.length - 1) {
                        currentFlashcardIndex++;
                    } else {
                        currentFlashcardIndex = 0;
                    }
                } while (answeredFlashcards.has(currentFlashcardIndex));

                const nextFlashcard = cardData.flashcards[currentFlashcardIndex];
                const frontSide = startModal.querySelector('.front');
                const backSide = startModal.querySelector('.back');
                frontSide.querySelector('p').textContent = nextFlashcard.question;
                backSide.querySelector('p').textContent = nextFlashcard.answer;
                flashcard.classList.remove('flipped');
            }

            const closeButton = startModal.querySelector('.close-button');
            closeButton.addEventListener('click', function() {
                startModal.remove();
            });

            document.body.appendChild(startModal);
        });

        cardContainer.appendChild(newCard);

        nomeInput.value = "";
        tagInput.value = "";

        const totalCards = cardContainer.children.length;
        if (totalCards % cardsPerPage === 0) {
            currentPage++;
            renderPage(currentPage);
        }

    });

    function closeModal() {
        const modal = document.getElementById('modal');
        modal.style.display = 'none';
    }

    function createFlashcardElement(question, answer) {
        const newFlashcard = document.createElement('div');
        newFlashcard.classList.add('flashcard');
        newFlashcard.innerHTML = `
            <span class="question">${question}</span>
            <span class="answer">${answer}</span>
            <button class="delete-flashcard-button">X</button>
        `;
        newFlashcard.querySelector('.delete-flashcard-button').addEventListener('click', function() {
            newFlashcard.remove();
            // Remover o flashcard excluído dos dados do card
            const index = cardData.flashcards.indexOf({ question: question, answer: answer });
            if (index !== -1) {
                cardData.flashcards.splice(index, 1);
            }
        });
        return newFlashcard;
    }

    contentBox.appendChild(cardContainer);

    const prevPageButton = document.getElementById('prev-page');
    const nextPageButton = document.getElementById('next-page');

    // Adiciona event listener para o botão de página anterior
    prevPageButton.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            renderPage(currentPage);
        }
    });

    // Adiciona event listener para o botão de próxima página
    nextPageButton.addEventListener('click', function() {
        const totalPages = Math.ceil(cardContainer.children.length / cardsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderPage(currentPage);
        }
    });

    function renderPage(page) {
        const startIndex = (page - 1) * cardsPerPage;
        const endIndex = page * cardsPerPage;
        const cards = cardContainer.children;
        for (let i = 0; i < cards.length; i++) {
            if (i >= startIndex && i < endIndex) {
                cards[i].style.display = 'block';
            } else {
                cards[i].style.display = 'none';
            }
        }
    }

    renderPage(currentPage);
});
