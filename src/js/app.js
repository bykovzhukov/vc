import data from '../test.js';
import likely from 'ilyabirman-likely';

const shuffleArray = arr => (
  arr
    .map(a => [Math.random(), a])
    .sort((a, b) => a[0] - b[0])
    .map(a => a[1])
);

class Tester {
  constructor(selector, data) {

    this.container = document.querySelector(selector);
    this.data = data;

    if (!this.container) { return }

    this.startBtn = this.container.querySelector('#test-start');

    this.init();
  }

  createElements() {
    this.el = {};
    this.el.content = document.createElement('div'),
    this.el.header = document.createElement('div'),
    this.el.question = document.createElement('div'),
    this.el.options = document.createElement('div');
    this.el.msg = document.createElement('div');
    this.el.bottom = document.createElement('div');
    this.el.nextLink = document.createElement('div');
    this.el.toResultLink = document.createElement('div');
    this.el.restartLink = document.createElement('div');
    this.el.resultTitle = document.createElement('div');
    this.el.resultImg = document.createElement('img');
    this.el.share = document.createElement('div');
    this.el.likely = document.createElement('div');
    this.el.fb = document.createElement('div');
    this.el.vk = document.createElement('div');
    this.el.tw = document.createElement('div');

    this.el.content.classList.add('test__content');
    this.el.header.classList.add('test__header');
    this.el.question.classList.add('test__question');
    this.el.options.classList.add('test__options');
    this.el.msg.classList.add('test__msg');
    this.el.bottom.classList.add('test__bottom');
    this.el.nextLink.classList.add('test__next');
    this.el.toResultLink.classList.add('test__next');
    this.el.restartLink.classList.add('test__next');
    this.el.restartLink.classList.add('test__next--restart');
    this.el.resultTitle.classList.add('test__result-title');
    this.el.resultImg.classList.add('test__result-img');
    this.el.share.classList.add('test__share');
    this.el.likely.classList.add('likely');
    this.el.fb.classList.add('facebook');
    this.el.vk.classList.add('vkontakte');
    this.el.tw.classList.add('twitter');

    this.el.nextLink.innerText = 'Продолжить';
    this.el.toResultLink.innerText = 'Результат';
    this.el.restartLink.innerText = 'Пройти еще раз';

    this.el.likely.dataset.title = this.data.title;
    this.el.fb.innerText = 'Поделиться';

    this.el.content.appendChild(this.el.header);
    this.el.content.appendChild(this.el.question);
    this.el.content.appendChild(this.el.options);

    this.el.bottom.appendChild(this.el.nextLink);

    this.el.share.appendChild(this.el.likely);
    this.el.likely.appendChild(this.el.fb);
    this.el.likely.appendChild(this.el.vk);
    this.el.likely.appendChild(this.el.tw);

    this.el.options.addEventListener('click', e => {
      if (e.target.classList.contains('test__option')) { this.checkAnswer(e) }
    });

    this.el.nextLink.addEventListener('click', this.makeNextQuestion.bind(this));
    this.el.toResultLink.addEventListener('click', this.showResult.bind(this));
    this.el.restartLink.addEventListener('click', this.restart.bind(this));
  }

  makeQuestion() {

    this.el.header.innerText = (this.activeIndex + 1) + '/' + this.data.questions.length;

    this.el.question.innerText = this.currentQuestion.text;

    while (this.el.options.hasChildNodes()) {
      this.el.options.removeChild(this.el.options.lastChild);
    }

    shuffleArray(this.currentQuestion.options).forEach(item => {
      let op = document.createElement('div');
      op.classList.add('test__option');
      op.dataset.id = item.id;
      op.innerText = item.text;
      this.el.options.appendChild(op);
    });
  }

  checkAnswer(e) {
    let index = e.target.dataset.id;

    if (this.currentQuestion.options[index].isCorrect) {
      e.target.classList.add('is-success');
      this.correctAnswers++;
    } else {
      e.target.classList.add('is-error');
    }

    this.el.options.querySelectorAll('.test__option').forEach(item => {
      item !== e.target && this.el.options.removeChild(item);
    });

    this.el.msg.innerHTML = this.currentQuestion.options[index].msg;
    this.el.content.appendChild(this.el.msg);
    this.el.content.appendChild(this.el.bottom);

    if ((this.activeIndex + 1) === this.data.questions.length) {
      this.el.bottom.removeChild(this.el.nextLink);
      this.el.bottom.appendChild(this.el.toResultLink);
    }
  }

  makeNextQuestion() {
    this.el.content.removeChild(this.el.msg);
    this.el.content.removeChild(this.el.bottom);

    this.activeIndex++;
    this.currentQuestion = this.data.questions[this.activeIndex];

    this.makeQuestion();
  }

  showResult() {
    this.el.header.innerText = this.correctAnswers + ' из ' + this.data.questions.length + ' правильных ответов';

    this.el.content.removeChild(this.el.question);
    this.el.content.removeChild(this.el.options);
    this.el.content.removeChild(this.el.msg);

    this.el.content.appendChild(this.el.resultTitle);
    this.el.content.appendChild(this.el.share);
    this.container.appendChild(this.el.resultImg);

    this.el.bottom.removeChild(this.el.toResultLink);
    this.el.bottom.appendChild(this.el.restartLink);

    this.data.results.some((item, index) => {
      if (item.range[0] <= this.correctAnswers && item.range[1] >= this.correctAnswers) {
        this.el.resultTitle.innerHTML = item.text;

        this.el.resultImg.className = '';
        this.el.resultImg.classList.add('test__result-img');
        this.el.resultImg.classList.add('test__result-img--' + (index+1));
        this.el.resultImg.src = item.img;

        return true;
      }
    });

    likely.initiate();

  }

  resetParams() {
    this.activeIndex = 0;
    this.currentQuestion = this.data.questions[this.activeIndex];
    this.correctAnswers = 0;
  }

  restart() {
    this.container.removeChild(this.el.resultImg);
    this.el.content.removeChild(this.el.resultTitle);
    this.el.content.removeChild(this.el.share);
    this.el.content.removeChild(this.el.bottom);
    this.el.bottom.removeChild(this.el.restartLink);

    this.el.content.appendChild(this.el.question);
    this.el.content.appendChild(this.el.options);
    this.el.bottom.appendChild(this.el.nextLink);

    this.resetParams();

    this.makeQuestion();
  }

  start() {
    this.container.innerHTML = '';
    this.container.appendChild(this.el.content);

    this.makeQuestion();
  }

  init() {
    this.resetParams();
    this.createElements();

    if (this.startBtn) { this.startBtn.addEventListener('click', this.start.bind(this)) }

  }
}

new Tester('#test', data);

const switchBtn = document.querySelector('.js-switch');
switchBtn.addEventListener('change', e => {
  document.body.classList.toggle('is-feed');
});