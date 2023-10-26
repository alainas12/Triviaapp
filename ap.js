
    document.addEventListener('DOMContentLoaded', function () {
        fetch('https://opentdb.com/api_category.php')
            .then(response => response.json())
            .then(data => {
                const categorySelect = document.getElementById('category');
                data.trivia_categories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.id;
                    option.text = category.name;
                    categorySelect.appendChild(option);
                });
            });
    });

    let currentQuestionIndex = 0;
    let score = 0;

    function startTrivia() {
        currentQuestionIndex = 0;
        score = 0;
        displayNextQuestion();
    }

    function displayNextQuestion() {
        const category = document.getElementById('category').value;
        const difficulty = document.getElementById('difficulty').value;

        fetch(`https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}`)
            .then(response => response.json())
            .then(data => {
                const quizContainer = document.getElementById('quiz');
                const resultContainer = document.getElementById('result');
                const scoreContainer = document.getElementById('score');

                quizContainer.innerHTML = ''; // Clear previous questions
                resultContainer.innerHTML = ''; // Clear previous results
                scoreContainer.textContent = `Score: ${score}`;

                if (currentQuestionIndex < data.results.length) {
                    const question = data.results[currentQuestionIndex];
                    const questionElement = document.createElement('div');
                    questionElement.classList.add('question');
                    questionElement.textContent = `${currentQuestionIndex + 1}. ${question.question}`;
                    quizContainer.appendChild(questionElement);

                    const optionsContainer = document.createElement('div');
                    optionsContainer.classList.add('options');

                    question.incorrect_answers.forEach(incorrectAnswer => {
                        const option = createOption(incorrectAnswer, question.correct_answer);
                        optionsContainer.appendChild(option);
                    });

                    const correctOption = createOption(question.correct_answer, question.correct_answer);
                    optionsContainer.appendChild(correctOption);

                    quizContainer.appendChild(optionsContainer);

                    const answerButtons = document.querySelectorAll('.option');
                    answerButtons.forEach(button => {
                        button.addEventListener('click', () => {
                            const correct = button.dataset.correct === 'true';
                            showResult(correct);
                            disableOptions(answerButtons);
                            if (correct) {
                                score += 100;
                                scoreContainer.textContent = `Score: ${score}`;
                            }
                            currentQuestionIndex++;
                            setTimeout(displayNextQuestion, 2000); // Delay for 2 seconds before showing the next question
                        });
                    });
                } else {
                    quizContainer.innerHTML = '<p class="font-weight-bold">Trivia Completed!</p>';
                    resultContainer.innerHTML = `<p class="font-weight-bold">Final Score: ${score}</p>`;
                }
            });
    }

    function createOption(text, correctAnswer) {
        const option = document.createElement('button');
        option.classList.add('option', 'btn', 'btn-outline-primary');
        option.textContent = text;
        option.dataset.correct = (text === correctAnswer).toString();
        return option;
    }

    function disableOptions(buttons) {
        buttons.forEach(button => {
            button.disabled = true;
        });
    }

    function showResult(correct) {
        const resultContainer = document.getElementById('result');
        const resultElement = document.createElement('p');
        resultElement.classList.add('font-weight-bold');
        resultElement.textContent = correct ? 'Correct!' : 'Incorrect!';
        resultContainer.appendChild(resultElement);
    }

