import React, {useState} from 'react';
import {Lightbulb, Star, ArrowRight, RotateCcw, Layers, ListChecks, ClipboardList, Check, Repeat} from 'lucide-react';
import {Monkey} from './Characters.jsx';

// Подготовка к контрольной: обучающие карточки по теме и интерактивный тест.
// Правила: ошибка — это подсказка и вторая попытка, а не минус; подсказка — не стыдно.

const exam = {
  title: 'Контрольная по математике',
  subtitle: 'Сложение и вычитание до 100 · 2 класс',
  teacher: 'Обезьянка',
  topics: ['Десятки и единицы', 'Сложение и вычитание', 'Порядок действий', 'Проверка', 'Задачи', 'Сравнение чисел'],
};

const cards = [
  {topic: 'Десятки и единицы', front: 'Сколько десятков и единиц в числе 47?', back: '4 десятка и 7 единиц.', example: '47 = 40 + 7'},
  {topic: 'Сложение', front: 'Как удобно сложить 36 + 20?', back: 'Складываем десятки с десятками, а единицы оставляем.', example: '30 + 20 = 50, и ещё 6 → 56'},
  {topic: 'Сложение', front: 'Как решить 38 + 5?', back: 'Сначала дополняем до круглого числа, потом прибавляем остаток.', example: '38 + 2 = 40, ещё 3 → 43'},
  {topic: 'Вычитание', front: 'Как решить 52 − 7?', back: 'Сначала вычитаем до круглого числа, потом остаток.', example: '52 − 2 = 50, потом 50 − 5 = 45'},
  {topic: 'Порядок действий', front: 'Что делать первым в примере 20 − (8 + 2)?', back: 'Сначала — действие в скобках.', example: '8 + 2 = 10, потом 20 − 10 = 10'},
  {topic: 'Проверка', front: 'Как проверить, что 45 + 17 = 62?', back: 'Вычитанием: из суммы вычитаем одно слагаемое — получаем другое.', example: '62 − 17 = 45 — сошлось!'},
];

const questions = [
  {topic: 'Десятки и единицы', type: 'choice', text: 'Сколько десятков в числе 63?', options: ['3', '6', '63', '9'], answer: '6', hint: 'Десятки — это первая цифра числа.', explain: '63 = 60 + 3, значит, 6 десятков.'},
  {topic: 'Сложение', type: 'input', text: '34 + 20 = ?', answer: '54', hint: 'Сложи десятки: 30 + 20. А единицы не меняются.', explain: '30 + 20 = 50, и ещё 4 — получается 54.'},
  {topic: 'Сложение', type: 'choice', text: '38 + 5 = ?', options: ['33', '43', '42', '88'], answer: '43', hint: 'Сначала дополни 38 до 40. Сколько ещё останется прибавить?', explain: '38 + 2 = 40, и ещё 3 — получается 43.'},
  {topic: 'Вычитание', type: 'input', text: '52 − 7 = ?', answer: '45', hint: 'Вычти сначала 2, чтобы получилось ровно 50.', explain: '52 − 2 = 50, потом 50 − 5 = 45.'},
  {topic: 'Порядок действий', type: 'choice', text: 'Что делаем первым в примере 20 − (8 + 2)?', options: ['20 − 8', '8 + 2', 'Всё равно'], answer: '8 + 2', hint: 'Скобки — как дверь, в которую заходят первыми.', explain: 'Сначала скобки: 8 + 2 = 10, потом 20 − 10 = 10.'},
  {topic: 'Проверка', type: 'choice', text: 'Каким действием проверить, что 45 + 17 = 62?', options: ['62 + 17', '62 − 17', '45 − 17'], answer: '62 − 17', hint: 'Если из суммы убрать одно слагаемое, что останется?', explain: '62 − 17 = 45 — получили другое слагаемое, значит, сложили верно.'},
  {topic: 'Задачи', type: 'input', text: 'В классе 25 ребят. 8 ушли на кружок. Сколько ребят осталось в классе?', answer: '17', hint: 'Ребят стало меньше — значит, нужно вычитать.', explain: '25 − 8 = 17. В классе осталось 17 ребят.'},
  {topic: 'Сравнение чисел', type: 'choice', text: 'Какой знак поставить: 47 … 74', options: ['<', '>', '='], answer: '<', hint: 'Сначала сравни десятки: 4 и 7.', explain: '4 десятка меньше, чем 7 десятков, значит, 47 < 74.'},
];

function Header({progress, total, stars, label}) {
  return <div className="exam-head">
    <div className="exam-badge"><Star size={26} fill="currentColor"/></div>
    <div className="exam-title"><b>{exam.title}</b><span>{exam.subtitle}</span></div>
    {total > 0 && <div className="exam-progress">
      <div className="exam-progress-top"><span>{label}: {progress}/{total}</span><span><Star size={15} fill="currentColor"/> {stars}</span></div>
      <div className="bar"><i style={{width: `${(progress / total) * 100}%`}}/></div>
    </div>}
  </div>;
}

function Cards({onDone}) {
  const [deck, setDeck] = useState(cards.map((c, i) => i));
  const [known, setKnown] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = cards[deck[0]];

  const next = (isKnown) => {
    setFlipped(false);
    if (isKnown) {setKnown(k => k + 1); setDeck(d => d.slice(1));}
    else setDeck(d => [...d.slice(1), d[0]]);
  };

  return <>
    <Header progress={known} total={cards.length} stars={known} label="Изучено"/>
    {card ? <div className="flash-wrap">
      <span className="chip">{card.topic}</span>
      <button className={`flash ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped(f => !f)} aria-label={flipped ? 'Показать вопрос' : 'Перевернуть карточку'}>
        <div className="flash-inner">
          <div className="flash-face front"><p>{card.front}</p><small>Подумай — и нажми, чтобы перевернуть</small></div>
          <div className="flash-face back"><p>{card.back}</p><code>{card.example}</code></div>
        </div>
      </button>
      {flipped && <div className="flash-actions">
        <button className="soft" onClick={() => next(false)}><Repeat size={16}/> Ещё повторю</button>
        <button className="go" onClick={() => next(true)}><Check size={16}/> Понятно</button>
      </div>}
    </div> : <div className="exam-finish">
      <Monkey className="finish-hero"/>
      <h3>Все карточки пройдены!</h3>
      <p>Теперь можно проверить себя в тесте.</p>
      <button className="lj-btn" onClick={onDone}>Перейти к тесту <ArrowRight size={18}/></button>
    </div>}
  </>;
}

function Test({onCards}) {
  const [idx, setIdx] = useState(0);
  const [status, setStatus] = useState('idle'); // idle | wrong | right | shown
  const [tried, setTried] = useState([]);
  const [hint, setHint] = useState(false);
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);
  const [hintsUsed, setHintsUsed] = useState(0);
  const q = questions[idx];
  const done = idx >= questions.length;
  const stars = results.filter(r => r.firstTry).length;

  const check = (value) => {
    const v = String(value).trim();
    if (!v || status === 'right' || status === 'shown') return;
    if (v === q.answer) {
      setStatus('right');
      setResults(r => [...r, {topic: q.topic, firstTry: tried.length === 0}]);
    } else if (tried.length === 0) {
      setTried([v]); setStatus('wrong');
      if (!hint) {setHint(true); setHintsUsed(h => h + 1);}
    } else {
      setTried(t => [...t, v]); setStatus('shown');
      setResults(r => [...r, {topic: q.topic, firstTry: false}]);
    }
  };
  const next = () => {setIdx(i => i + 1); setStatus('idle'); setTried([]); setHint(false); setInput('');};
  const restart = () => {setIdx(0); setResults([]); setHintsUsed(0); setStatus('idle'); setTried([]); setHint(false); setInput('');};
  const finished = status === 'right' || status === 'shown';

  if (done) {
    const repeat = [...new Set(results.filter(r => !r.firstTry).map(r => r.topic))];
    return <>
      <Header progress={questions.length} total={questions.length} stars={stars} label="Вопросы"/>
      <div className="exam-finish">
        <Monkey className="finish-hero"/>
        <h3>{repeat.length ? 'Хорошая тренировка!' : 'Всё получилось с первого раза!'}</h3>
        <p>С первой попытки: <b>{stars} из {questions.length}</b> ⭐</p>
        {repeat.length > 0 && <div className="repeat-box"><b>Стоит повторить:</b> {repeat.join(', ')}</div>}
        <div className="report-card">
          <b><ClipboardList size={16}/> Отчёт для родителя</b>
          <ul>
            <li>{exam.subtitle}: {stars} из {questions.length} заданий с первой попытки.</li>
            <li>Подсказок понадобилось: {hintsUsed}.</li>
            <li>{repeat.length ? `Повторить перед контрольной: ${repeat.join(', ').toLowerCase()}.` : 'Тема усвоена — можно идти на контрольную спокойно.'}</li>
          </ul>
        </div>
        <div className="finish-actions">
          {repeat.length > 0 && <button className="lj-btn ghost" onClick={onCards}><Layers size={17}/> Повторить карточки</button>}
          <button className="lj-btn" onClick={restart}><RotateCcw size={17}/> Пройти ещё раз</button>
        </div>
      </div>
    </>;
  }

  const optionClass = (o) => finished && o === q.answer ? 'right' : tried.includes(o) ? 'wrong' : '';
  return <>
    <Header progress={idx + (finished ? 1 : 0)} total={questions.length} stars={stars} label="Вопросы"/>
    <div className="question">
      <div className="question-top">
        <span className="chip">{idx + 1}. {q.topic}</span>
        <button className="hint-btn" onClick={() => {if (!hint) setHintsUsed(h => h + 1); setHint(true);}} disabled={hint}><Lightbulb size={16}/> Подсказка</button>
      </div>
      {hint && <div className="hint-box"><Lightbulb size={16}/> {q.hint}</div>}
      <h3 className="question-text">{q.text}</h3>
      {q.type === 'choice'
        ? <div className="options">{q.options.map((o, i) => <button key={o} className={`option ${optionClass(o)}`} disabled={finished || tried.includes(o)} onClick={() => check(o)}>
            <span>{o}</span><em>{'АБВГ'[i]}</em>
          </button>)}</div>
        : <form className="answer-input" onSubmit={e => {e.preventDefault(); check(input); setInput('');}}>
            <input inputMode="numeric" value={input} onChange={e => setInput(e.target.value.replace(/[^\d]/g, ''))} placeholder="Твой ответ" disabled={finished} aria-label="Ответ"/>
            <button className="lj-btn" disabled={finished || !input}>Проверить</button>
          </form>}
      {status === 'wrong' && <div className="feedback try"><b>Почти! Попробуй ещё раз.</b><span>{q.type === 'input' ? `«${tried[0]}» — не совсем так. ` : ''}Посмотри на подсказку выше.</span></div>}
      {status === 'right' && <div className="feedback ok"><b>{tried.length ? 'Получилось! 💪' : 'Верно! 🎉'}</b><span>{q.explain}</span></div>}
      {status === 'shown' && <div className="feedback show"><b>Ничего страшного — разберём.</b><span>Правильный ответ: {q.answer}. {q.explain}</span></div>}
      {finished && <button className="lj-btn next-btn" onClick={next}>{idx + 1 < questions.length ? 'Следующий вопрос' : 'Результат'} <ArrowRight size={18}/></button>}
    </div>
  </>;
}

export default function ExamPrep() {
  const [mode, setMode] = useState('intro');
  return <div className="exam">
    {mode === 'intro' && <>
      <Header progress={0} total={0}/>
      <div className="exam-intro">
        <div className="intro-hero"><Monkey/><div className="speech-inline">Проверим, что ты уже знаешь? Ошибаться можно — я подскажу!</div></div>
        <div className="intro-topics"><b><Lightbulb size={16}/> В контрольной будут задания на:</b><ul>{exam.topics.map(t => <li key={t}>{t}</li>)}</ul></div>
        <p className="intro-note">Здесь нет оценок. Если ошибёшься — получишь подсказку и вторую попытку.</p>
        <div className="intro-actions">
          <button className="lj-btn ghost" onClick={() => setMode('cards')}><Layers size={18}/> Сначала карточки</button>
          <button className="lj-btn" onClick={() => setMode('test')}><ListChecks size={18}/> Начать тест</button>
        </div>
      </div>
    </>}
    {mode === 'cards' && <Cards onDone={() => setMode('test')}/>}
    {mode === 'test' && <Test onCards={() => setMode('cards')}/>}
    {mode !== 'intro' && <button className="exam-back" onClick={() => setMode('intro')}>← К началу подготовки</button>}
    <small className="tutor-note">Демонстрация · задания для примера · 2 класс</small>
  </div>;
}
