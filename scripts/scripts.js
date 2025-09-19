   // Константа для пути к изображению по умолчанию
        const DEFAULT_IMAGE = 'default.png';

   document.addEventListener('DOMContentLoaded', function() {
            // Объект для хранения выбранных ролей для каждой плашки
            const selectedRoles = {};
            // Объект для хранения выбранных изображений для каждой плашки
            const selectedImages = {};
            // Объект для хранения изображений имен для каждой плашки
            const nameImages = {};
            
            // Переменные для отслеживания количества выбранных ролей
            let sheriffCount = 0;
            let donCount = 0;
            
            // Флаг для отслеживания выбора цвета для каждой плашки
            const hasColorSelected = {};

            // Соответствие имен и изображений
            const nameToImageMap = {
                "ITишник": "players/ITishnik.svg",
                "Джуна": "players/ITishnik.svg",
                "Апельсинчик": "players/ITishnik.svg",
                "мерзость": "players/ITishnik.svg",
                "Просто Игорь": "players/ITishnik.svg",
                "8 жизней": "players/ITishnik.svg",
                "Yahoo": "players/ITishnik.svg",
                "Дори": "players/ITishnik.svg",
                "Stonesour": "players/ITishnik.svg",
                "Феникс": "players/ITishnik.svg"
            };
            
            // Функция для инициализации плашек
            function initializeCards() {
                for (let i = 1; i <= 10; i++) {
                    const card = document.getElementById(`card-${i}`);
                    const imgElement = card.querySelector('.background-image');
                    const cardText = card.querySelector('.card-text');
                    
                    // Сохраняем исходный текст с номером
                    cardText.setAttribute('data-original', i);
                    cardText.textContent = i;
                    
                    // Установите путь к изображению по умолчанию
                    imgElement.src = DEFAULT_IMAGE;
                    imgElement.style.display = 'block';
                    selectedImages[i] = imgElement.src;
                    hasColorSelected[i] = false;
                    
                    // Создаем элемент для отображения имени
                    const nameElement = document.createElement('div');
                    nameElement.className = 'player-name';
                    card.parentNode.appendChild(nameElement);
                    nameImages[i] = nameElement;
                    
                    // Запускаем анимацию появления плашки
                    setTimeout(() => {
                        card.classList.add('animate');
                    }, i * 100);
                }
            }

            // Новая функция для анимации плашки
            function animateCard(cardId) {
                const card = document.getElementById(`card-${cardId}`);
                card.classList.remove('animate');
                setTimeout(() => {
                    card.classList.add('animate');
                }, 10);
}




            // Функция для проверки, можно ли назначить роль
            function canAssignRole(role, cardId) {
                const errorElement = document.getElementById('role-error');
                
                // Проверяем, не назначена ли уже эта роль другой плашке
                if (role === 'sheriff') {
                    if (sheriffCount > 0 && selectedRoles[cardId] !== 'sheriff') {
                        errorElement.textContent = 'Шериф уже выбран! Можно выбрать только одного шерифа.';
                        errorElement.style.display = 'block';
                        setTimeout(() => {
                            errorElement.style.display = 'none';
                        }, 3000);
                        return false;
                    }
                } else if (role === 'don') {
                    if (donCount > 0 && selectedRoles[cardId] !== 'don') {
                        errorElement.textContent = 'Дон уже выбран! Можно выбрать только одного дона.';
                        errorElement.style.display = 'block';
                        setTimeout(() => {
                            errorElement.style.display = 'none';
                        }, 3000);
                        return false;
                    }
                }
                
                errorElement.style.display = 'none';
                return true;
            }

            // Функция для обновления счетчиков ролей
            function updateRoleCounters() {
                sheriffCount = 0;
                donCount = 0;
                
                for (const cardId in selectedRoles) {
                    if (selectedRoles[cardId] === 'sheriff') {
                        sheriffCount++;
                    } else if (selectedRoles[cardId] === 'don') {
                        donCount++;
                    }
                }
            }

            // Функция для отображения роли на плашке
            function showRoleIcon(cardId, role) {
                const roleIcon = document.getElementById(`role-icon-${cardId}`);
                
                if (role === 'sheriff') {
                    roleIcon.className = 'role-icon sheriff-icon';
                } else if (role === 'don') {
                    roleIcon.className = 'role-icon don-icon';
                }
                
                roleIcon.style.display = 'block';
                roleIcon.classList.remove('animate');
                setTimeout(() => {
                    roleIcon.classList.add('animate');
                }, 10);
            }

            // Функция для сброса отдельной плашки
            function resetSingleCard(cardId) {
                const card = document.getElementById(`card-${cardId}`);
                const imgElement = card.querySelector('.background-image');
                const roleIcon = document.getElementById(`role-icon-${cardId}`);
                const statusIcon = document.getElementById(`status-icon-${cardId}`);
                const mafiaCard = card.querySelector('.mafia-card');
                const nameElement = nameImages[cardId];
                const nameSelect = document.querySelector(`.name-select[data-card="${cardId}"]`);

                // Сбрасываем изображение на значение по умолчанию
                imgElement.src = DEFAULT_IMAGE;
                imgElement.style.display = 'block';
                selectedImages[cardId] = DEFAULT_IMAGE;
                hasColorSelected[cardId] = false;


                // Сбрасываем состояние имени
                nameElement.classList.remove('voted', 'shot');

                // Сбрасываем имя
                if (nameSelect) {
                    nameSelect.selectedIndex = 0;
                }
                nameElement.textContent = '';
                nameElement.style.display = 'none';
                
                // Удаляем изображение имени, если оно было добавлено
                if (nameImages[cardId].imageElement) {
                    card.removeChild(nameImages[cardId].imageElement);
                    delete nameImages[cardId].imageElement;
                }
                
                // Сбрасываем роль
                if (selectedRoles[cardId]) {
                    const previousRole = selectedRoles[cardId];
                    if (previousRole === 'sheriff') {
                        sheriffCount--;
                    } else if (previousRole === 'don') {
                        donCount--;
                    }
                    delete selectedRoles[cardId];
                }
                roleIcon.style.display = 'none';
                roleIcon.classList.remove('animate');
                
                // Сбрасываем статус
                statusIcon.style.display = 'none';
                card.classList.remove('voted', 'shot');

                // Сбрасываем карточку мафии
                mafiaCard.style.display = 'none';
                mafiaCard.className = 'mafia-card';
                
                // Снимаем выделение со всех кнопок, связанных с этой плашкой
                const allButtonsForCard = document.querySelectorAll(`
                    .control-button[data-card="${cardId}"],
                    .role-button[data-card="${cardId}"],
                    .status-button[data-card="${cardId}"],
                    .card-button[data-card="${cardId}"]
                `);
                allButtonsForCard.forEach(button => button.classList.remove('selected'));
                
                // Запускаем анимацию сброса
                card.classList.remove('animate');
                setTimeout(() => {
                    card.classList.add('animate');
                }, 10);
            }

            // Инициализация плашек
            initializeCards();
            
            // Обработчики для выбора имен
            const nameSelects = document.querySelectorAll('.name-select');
            
            nameSelects.forEach(select => {
                select.addEventListener('change', function() {
                    const cardId = this.getAttribute('data-card');
                    const selectedName = this.value;
                    const card = document.getElementById(`card-${cardId}`);
                    const cardText = card.querySelector('.card-text');
                    const nameImageElement = nameImages[cardId];
                    
                    // Восстанавливаем исходный текст с номером
                    const originalText = cardText.getAttribute('data-original');
                    cardText.textContent = originalText;
                    
                    // Обновляем имя игрока
                    if (selectedName) {
                        nameImageElement.textContent = selectedName;
                        nameImageElement.style.display = 'block';
                        
                        // Автоматически устанавливаем изображение имени на основе выбора
                        if (nameToImageMap[selectedName]) {
                            // Удаляем старое изображение, если оно есть
                            if (nameImages[cardId].imageElement) {
                                card.removeChild(nameImages[cardId].imageElement);
                            }
                            
                            // Создаем временный элемент для изображения имени
                            const tempImg = document.createElement('img');
                            tempImg.src = nameToImageMap[selectedName];
                            tempImg.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1;';
                            
                            // Добавляем изображение имени поверх существующего
                            card.appendChild(tempImg);
                            
                            // Сохраняем ссылку на элемент изображения имени
                            nameImages[cardId].imageElement = tempImg;
                        }
                    } else {
                        nameImageElement.textContent = '';
                        nameImageElement.style.display = 'none';
                        
                        // Удаляем изображение имени, если оно было добавлено
                        if (nameImages[cardId].imageElement) {
                            card.removeChild(nameImages[cardId].imageElement);
                            delete nameImages[cardId].imageElement;
                        }
                    }
                    // Запускаем анимацию плашки при выборе имени
                    animateCard(cardId);
                    
                    // Анимируем имя игрока
                    if (selectedName) {
                        nameImageElement.classList.remove('animate');
                        setTimeout(() => {
                            nameImageElement.classList.add('animate');
                        }, 10);
                    }
                });
            });

            // Функция для одновременного отображения плашки и роли
            function showCardWithRole(cardId, imageUrl) {
                const card = document.getElementById(`card-${cardId}`);
                const imgElement = card.querySelector('.background-image');

                // Устанавливаем источник фонового изображения и показываем его
                imgElement.src = imageUrl;
                imgElement.style.display = 'block';
                selectedImages[cardId] = imageUrl; // Сохраняем выбранное изображение
                hasColorSelected[cardId] = true; // Отмечаем, что цвет выбран
                
                // Если для этой плашки есть выбранная роль, показываем ее
                if (selectedRoles[cardId]) {
                    showRoleIcon(cardId, selectedRoles[cardId]);
                }

            // Запускаем анимацию для всей плашки
                animateCard(cardId);
                
                // Анимируем имя игрока, если оно есть
                const nameElement = nameImages[cardId];
                if (nameElement.textContent) {
                    nameElement.classList.remove('animate');
                    setTimeout(() => {
                        nameElement.classList.add('animate');
                    }, 10);
                }
            }

            // Добавляем обработчики событий для всех кнопок выбора изображения
            const controlButtons = document.querySelectorAll('.control-button');
            
            controlButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const cardId = this.getAttribute('data-card');
                    const imageUrl = this.getAttribute('data-image');
                    
                    // Убираем выделение с всех кнопок для этой плашки
                    const allButtonsForCard = document.querySelectorAll(`.control-button[data-card="${cardId}"]`);
                    allButtonsForCard.forEach(btn => btn.classList.remove('selected'));
                    
                    // Добавляем выделение на clicked кнопку
                    this.classList.add('selected');
                    // Используем новую функцию для отображения
                    showCardWithRole(cardId, imageUrl);
                });
            });

            // Добавляем обработчики для кнопок выбора ролей
            const roleButtons = document.querySelectorAll('.role-button');
            
            roleButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const cardId = this.getAttribute('data-card');
                    const role = this.getAttribute('data-role');
                    
                    // Проверяем, можно ли назначить эту роль
                    if (!canAssignRole(role, cardId)) {
                        return;
                    }
                    
                    // Убираем выделение с всех кнопок ролей для этой плашки
                    const allRoleButtonsForCard = document.querySelectorAll(`.role-button[data-card="${cardId}"]`);
                    allRoleButtonsForCard.forEach(btn => btn.classList.remove('selected'));
                    
                    // Добавляем выделение на clicked кнопку
                    this.classList.add('selected');
                    
                    // Убираем предыдущую роль, если она была назначена этой плашке
                    if (selectedRoles[cardId]) {
                        const previousRole = selectedRoles[cardId];
                        if (previousRole === 'sheriff') {
                            sheriffCount--;
                        } else if (previousRole === 'don') {
                            donCount--;
                        }
                    }
                    
                    // Сохраняем выбранную роль
                    selectedRoles[cardId] = role;
                    
                    // Обновляем счетчики ролей
                    updateRoleCounters();
                    
                    // Если цвет уже выбран, показываем роль
                    if (hasColorSelected[cardId]) {
                        showRoleIcon(cardId, role);
                    }
                });
            });
            
            // Добавляем обработчики для кнопок статусов (заголосован/отстрел)
            const statusButtons = document.querySelectorAll('.status-button');
            
            statusButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const cardId = this.getAttribute('data-card');
                    const status = this.getAttribute('data-status');
                    const card = document.getElementById(`card-${cardId}`);
                    const statusIcon = document.getElementById(`status-icon-${cardId}`);
                    const nameElement = nameImages[cardId];
                    
                    // Убираем выделение с всех кнопок статусов для этой плашки
                    const allStatusButtonsForCard = document.querySelectorAll(`.status-button[data-card="${cardId}"]`);
                    allStatusButtonsForCard.forEach(btn => btn.classList.remove('selected'));
                    
                    // Добавляем выделение на clicked кнопку
                    this.classList.add('selected');
                    
                    // Устанавливаем статус плашки
                    if (status === 'voted') {
                        card.classList.remove('shot');
                        card.classList.add('voted');
                        statusIcon.className = 'status-icon voted-icon';
                    // Добавляем класс для имени
                    nameElement.classList.remove('shot');
                    nameElement.classList.add('voted');

                    } else if (status === 'shot') {
                        card.classList.remove('voted');
                        card.classList.add('shot');
                        statusIcon.className = 'status-icon shot-icon';
                         // Добавляем класс для имени
                        nameElement.classList.remove('voted');
                        nameElement.classList.add('shot');
                    }
                    
                    // Показываем значок статуса
                    statusIcon.style.display = 'block';
                    
                    // Запускаем анимацию опускания плашки
                    card.classList.remove('animate');
                    setTimeout(() => {
                        card.classList.add('voted');
                    }, 10);
                });
            });

            // Добавляем обработчики для кнопок карточек
            const cardButtons = document.querySelectorAll('.card-button');
            
            cardButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const cardId = this.getAttribute('data-card');
                    const cardType = this.getAttribute('data-card-type');
                    const card = document.getElementById(`card-${cardId}`);
                    const mafiaCard = card.querySelector('.mafia-card');
                    
                    // Убираем выделение с всех кнопок карточек для этой плашки
                    const allCardButtonsForCard = document.querySelectorAll(`.card-button[data-card="${cardId}"]`);
                    allCardButtonsForCard.forEach(btn => btn.classList.remove('selected'));
                    
                    // Добавляем выделение на clicked кнопку
                    this.classList.add('selected');
                    
                    // Устанавливаем класс карточки в зависимости от типа
                    mafiaCard.className = 'mafia-card';
                    if (cardType === 'red') {
                        mafiaCard.classList.add('red-card');
                    } else if (cardType === 'gray') {
                        mafiaCard.classList.add('gray-card');
                    } else if (cardType === 'yellow') {
                        mafiaCard.classList.add('yellow-card');
                    }
                    
                    // Показываем карточку
                    mafiaCard.style.display = 'block';
                    
                    // Запускаем анимацию выезда плашки
                    card.classList.remove('animate');
                    setTimeout(() => {
                        card.classList.add('animate');
                    }, 10);
                });
            });

            // Добавляем обработчики для кнопок сброса отдельных плашек
            const resetCardButtons = document.querySelectorAll('.reset-card-button');
            
            resetCardButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const cardId = this.getAttribute('data-card');
                    resetSingleCard(cardId);
                });
            });
            
            // Добавляем обработчик для кнопки сброса всех плашек
            document.getElementById('reset-button').addEventListener('click', function() {
                // Сбрасываем все плашки по одной
                for (let i = 1; i <= 10; i++) {
                    resetSingleCard(i);
                }
                
                // Скрываем сообщение об ошибке
                document.getElementById('role-error').style.display = 'none';
            });
        });