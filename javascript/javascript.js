jQuery(document).ready(function () {
    (function () {
        var getList = $('#getList'),
            listAnswers = $('.formed-answers'),
            enabledShowAnswer = false,
            timeForAppearPanel = 800,
            test = new Tester();

        $('#check-test').fadeOut(1);

        function Tester() {
            var questions = new Array(),
                answer = new Array(),
                userAnswer = new Array(),
                currentQuestion = 0,
                countQuestions = 12;

            var checkUserString = function (string) {
                var temp = parseFloat(string).toFixed(2) - string;
                if (string <= 0 || string == "" || temp != 0)
                    return false;
                else
                    return true;
            }

            this.startTest = false;
            this.endTest = false;

            this.getRandomInt = function (min, max) {
                return Math.floor(Math.random() * (max - min)) + min;
            }

            var divider = function (digitFirst, digitSecond) {
                while ((digitFirst % digitSecond) != 0) {
                    digitFirst++;
                }
                return digitFirst;
            }

            this.formedQuestions = function (elementsChecked) {
                var lengthArguments = elementsChecked.length,
                    countOperations = countQuestions / lengthArguments,
                    operation,
                    intervalFrom = 4,
                    intervalTo = 20,
                    intervalMax = intervalTo * 4,
                    randomArray = new Array(3);

                for (var j = 0; j < countQuestions; j++) {
                    operation = Math.floor(j / countOperations);
                    randomArray[0] = this.getRandomInt(intervalTo, intervalMax);
                    randomArray[1] = this.getRandomInt(intervalFrom, intervalTo);
                    randomArray[0] = divider(randomArray[0], randomArray[1]);
                    questions[j] = [randomArray[0], randomArray[1], elementsChecked.get(operation).name];
                }
            }

            this.formedAnswers = function () {
                for (var j = 0; j < countQuestions; j++) {
                    switch (questions[j][2]) {
                        case 'plus' :
                            answer[j] = questions[j][0] + questions[j][1];
                            break;
                        case 'sub' :
                            answer[j] = questions[j][0] - questions[j][1];
                            break;
                        case 'multiply' :
                            answer[j] = questions[j][0] * questions[j][1];
                            break;
                        case 'div' :
                            answer[j] = questions[j][0] / questions[j][1];
                            break;
                    }
                }
            }

            this.checkAction = function (check) {
                switch (check) {
                    case 'plus' :
                        return 'Прибавить';
                        break;
                    case 'sub' :
                        return 'Вычесть';
                        break;
                    case 'multiply' :
                        return 'Умножить';
                        break;
                    case 'div' :
                        return 'Разделить';
                        break;
                }
            }

            this.formedString = function (currentQuestion) {
                var numberQuestion = parseInt(currentQuestion) + 1,
                    formedString = "Вопрос №" + numberQuestion + "  " + questions[currentQuestion][0] + " " + this.checkAction(questions[currentQuestion][2]) + " " + questions[currentQuestion][1];
                return formedString;
            }

            this.start = function (elementOutput) {
                if (currentQuestion != countQuestions && this.startTest == false) {
                    elementOutput.text(this.formedString(currentQuestion));
                    this.startTest = true;
                }
                else return;
            }

            this.outputQuestions = function (elementOutput) {
                var valueAnswer = $('#enter-user').val();
                if (currentQuestion == countQuestions - 1) {
                    this.endTest = true;
                    $('.end').remove();
                    $('#enter-user').after('<p class="end">Тест закончен перейдите на вкладку провека</p>');
                }
                if (currentQuestion == countQuestions) return;
                else {
                    if (checkUserString(valueAnswer)) {
                        $('.empty-message').remove();
                        userAnswer[currentQuestion] = valueAnswer;
                        setTimeout(function (self) {
                            if (currentQuestion == 12) return;
                            elementOutput.text(self.formedString(currentQuestion));
                        }, 400, this);
                        currentQuestion++;
                        elementOutput.fadeOut(400).fadeIn(400);

                    }
                    else {
                        $('.empty-message').remove();
                        $('#enter-user').after('<p class="empty-message">Введите натуральное число (Пустым ответ не может быть)</p>');
                    }
                }
            }


            this.displayListAnswers = function () {
                var finalAnswers = new Array(),
                    delay = 0,
                    intervalDelay = 500,
                    timeForHeight = 300,
                    appearAnswer = 800,
                    output = $('.display-answers');

                output.append("<ul class='answers-list'>");

                for (var key in answer) {
                    finalAnswers[key] = [answer[key] == userAnswer[key] ? true : false];
                    finalAnswers[key][1] = this.formedString(key);

                    output.find('ul').append('<li>');
                    output.find('ul li:last').append('<p class="title-answer">' + finalAnswers[key][1] + '</p>');
                    if (finalAnswers[key][0] == true) {
                        output.find('ul li:last').append('<p class="answer-valid custom"></p>');
                    } else {
                        output.find('ul li:last').append('<p class="answer-invalid custom"></p>');
                    }
                }

                $('.answers-list li').slideUp(0);
                $('#check-test').animate({'height': '443px'}, timeForHeight);
                $('.answers-list').children('li').each(function () {
                    delay += intervalDelay;
                    $(this).delay(delay).fadeIn(appearAnswer);
                });

            }
        }

        getList.click(function () {
            if (test.startTest == false) {
                var checkbox = $('input:checked'),
                    output = $('.output');

                if (!checkbox.length) {
                    $('.empty-message').remove();
                    $('#enter-user').after('<p class="empty-message">Выберите типы вопросов</p>');
                }
                else {
                    $('.empty-message').remove();
                    test.formedQuestions(checkbox);
                    test.formedAnswers();
                    test.start(output);

                    $('.next').bind('click', function () {
                        test.outputQuestions(output);
                    });
                }
            }
        });

        listAnswers.click(function () {
            if (enabledShowAnswer == false && test.startTest == true && test.endTest == true) {
                test.displayListAnswers();
                enabledShowAnswer = true;
            } else {
                return;
            }
        });

        $('.menu li:first-child a').click(function (e) {
            e.preventDefault();
            $('#set-test').fadeOut(timeForAppearPanel);
            $('#check-test').fadeIn(timeForAppearPanel);
            $(this).addClass("active");
            $('.menu li:last-child a').removeClass("active");
        });

        $('.menu li:last-child a').click(function (e) {
            e.preventDefault();
            $('#set-test').fadeIn(timeForAppearPanel);
            $('#check-test').fadeOut(timeForAppearPanel);
            $(this).addClass("active");
            $('.menu li:first-child a').removeClass("active");
        });
    }).call(this);
});