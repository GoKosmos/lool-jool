import React, {useState} from 'react';
import {Lightbulb, Star, ArrowRight, RotateCcw, Layers, ListChecks, ClipboardList, Check, Repeat, BookOpen, ThumbsUp, Target, Wrench} from 'lucide-react';
import {Monkey} from './Characters.jsx';

// Подготовка к контрольной: тест, обучающие карточки и памятка по теме.
// Правила: ошибка — это подсказка и вторая попытка, а не минус; подсказка — не стыдно.
// В итоге теста показываем счёт: сколько верно с первой попытки, со второй и что не получилось.
// «Работа над ошибками» — повторный круг только по заданиям, которые не получились с первой попытки.

const exam = {
  title: 'Контрольная по математике',
  subtitle: 'Сложение и вычитание до 100 · 2 класс',
  grade: '2 класса',
  teacher: 'Обезьянка',
};

// Памятка: одно короткое правило с примером на каждую тему теста.
const memo = [
  {topic: 'Десятки и единицы', rule: 'Первая цифра — десятки, вторая — единицы.', example: '47 = 40 + 7'},
  {topic: 'Сложение', rule: 'Десятки складываем с десятками. Если удобно — дополняем до круглого числа.', example: '38 + 5 = 38 + 2 + 3 = 43'},
  {topic: 'Вычитание', rule: 'Сначала вычитаем до круглого числа, потом остаток.', example: '52 − 7 = 52 − 2 − 5 = 45'},
  {topic: 'Порядок действий', rule: 'Сначала действие в скобках, потом всё остальное слева направо.', example: '20 − (8 + 2) = 20 − 10 = 10'},
  {topic: 'Проверка', rule: 'Сложение проверяем вычитанием: из суммы убираем одно слагаемое — получаем другое.', example: '45 + 17 = 62 → 62 − 17 = 45'},
  {topic: 'Задачи', rule: 'Стало больше — складываем. Стало меньше — вычитаем.', example: 'Было 25, ушли 8: 25 − 8 = 17'},
  {topic: 'Сравнение чисел', rule: 'Сначала сравниваем десятки. Если они равны — единицы.', example: '47 < 74, потому что 4 < 7'},
];

const cards = [
  {topic: 'Десятки и единицы', front: 'Сколько десятков и единиц в числе 47?', back: '4 десятка и 7 единиц.', example: '47 = 40 + 7'},
  {topic: 'Сложение', front: 'Как удобно сложить 36 + 20?', back: 'Складываем десятки с десятками, а единицы оставляем.', example: '30 + 20 = 50, и ещё 6 → 56'},
  {topic: 'Сложение', front: 'Как решить 38 + 5?', back: 'Сначала дополняем до круглого числа, потом прибавляем остаток.', example: '38 + 2 = 40, ещё 3 → 43'},
  {topic: 'Вычитание', front: 'Как решить 52 − 7?', back: 'Сначала вычитаем до круглого числа, потом остаток.', example: '52 − 2 = 50, потом 50 − 5 = 45'},
  {topic: 'Порядок действий', front: 'Что делать первым в примере 20 − (8 + 2)?', back: 'Сначала — действие в скобках.', example: '8 + 2 = 10, потом 20 − 10 = 10'},
  {topic: 'Проверка', front: 'Как проверить, что 45 + 17 = 62?', back: 'Вычитанием: из суммы вычитаем одно слагаемое — получаем другое.', example: '62 − 17 = 45 — сошлось!'},
  {topic: 'Задачи', front: 'Было 30 конфет, 6 съели. Каким действием узнать, сколько осталось?', back: 'Конфет стало меньше — значит, вычитаем.', example: '30 − 6 = 24'},
  {topic: 'Сравнение чисел', front: 'Какое число больше: 58 или 85?', back: 'Сравниваем десятки: 8 десятков больше, чем 5.', example: '85 > 58'},
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

const testTopics = [...new Set(questions.map(q => q.topic))];
const lower = (list) => list.join(', ').toLowerCase();

function Header({progress, total, stars, label}) {
  return <div className="exam-head">
    <div className="exam-badge"><Star size={26} fill="currentColor"/></div>
    <div className="exam-title"><b>{exam.title}</b><span>{exam.subtitle}</span></div>
    {total > 0 && <div className="exam-progress">
      <div className="exam-progress-top"><span>{label}: {progress}/{total}</span>{stars !== undefined && <span className="exam-stars"><Star size={15} fill="currentColor"/> {stars}</span>}</div>
      <div className="bar"><i style={{width: `${(progress / total) * 100}%`}}/></div>
    </div>}
  </div>;
}

// Полукруглая шкала: зелёный — с первой попытки, жёлтый — со второй, розовый — не получилось.
function ScoreGauge({first, second, missed, total}) {
  const parts = [['first', first], ['second', second], ['missed', missed]];
  let start = 0;
  return <div className="gauge" role="img" aria-label={`Верно ${first + second} из ${total}`}>
    <svg viewBox="0 0 120 68">
      <path className="gauge-track" d="M10 60 A50 50 0 0 1 110 60" pathLength="100"/>
      {parts.map(([cls, n]) => {
        const len = (n / total) * 100;
        const el = n > 0 && <path key={cls} className={`gauge-${cls}`} d="M10 60 A50 50 0 0 1 110 60" pathLength="100" strokeDasharray={`${len} 100`} strokeDashoffset={-start}/>;
        start += len;
        return el;
      })}
    </svg>
    <div className="gauge-label"><b>{first + second}/{total}</b><span>верно</span></div>
  </div>;
}

function Cards({focus, onTest}) {
  const pool = focus.length ? cards.filter(c => focus.includes(c.topic)) : cards;
  const [deck, setDeck] = useState(pool.map((c, i) => i));
  const [known, setKnown] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = pool[deck[0]];

  const next = (isKnown) => {
    setFlipped(false);
    if (isKnown) {setKnown(k => k + 1); setDeck(d => d.slice(1));}
    else setDeck(d => [...d.slice(1), d[0]]);
  };

  return <>
    <Header progress={known} total={pool.length} label="Изучено"/>
    {focus.length > 0 && <div className="focus-note"><Target size={16}/> Только трудные темы: {lower(focus)}</div>}
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
      <button className="lj-btn" onClick={onTest}>Перейти к тесту <ArrowRight size={18}/></button>
    </div>}
  </>;
}

function Memo({onTest}) {
  return <>
    <Header progress={0} total={0}/>
    <div className="memo">
      <div className="intro-hero"><Monkey/><div className="speech-inline">Это шпаргалка перед контрольной. Всё главное — на одном экране!</div></div>
      <ul className="memo-list">{memo.map(m => <li key={m.topic}>
        <b>{m.topic}</b><p>{m.rule}</p><code>{m.example}</code>
      </li>)}</ul>
      <button className="lj-btn memo-go" onClick={onTest}><ListChecks size={18}/> Проверить себя в тесте</button>
    </div>
  </>;
}

function Result({results, hintsUsed, fixing, onRestart, onFix, onCards, onMemo}) {
  const total = results.length;
  const count = (s) => results.filter(r => r.status === s).length;
  const first = count('first'), second = count('second'), missed = count('missed');
  const topics = testTopics.filter(t => results.some(r => r.topic === t));
  const hard = topics.filter(t => results.some(r => r.topic === t && r.status !== 'first'));
  const easy = topics.filter(t => !hard.includes(t));
  const mistakes = results.filter(r => r.status !== 'first').map(r => r.qi);
  const headline = fixing && first === total ? 'Все ошибки исправлены!'
    : first === total ? 'Всё получилось с первого раза!'
    : first + second === total ? 'Всё решено!'
    : first + second >= total * .75 ? 'Почти всё получилось!'
    : first + second >= total / 2 ? 'Отличное начало!' : 'Хорошая тренировка — давай разберёмся!';
  const missedTasks = results.filter(r => r.status === 'missed');

  return <>
    <Header progress={total} total={total} stars={first} label={fixing ? 'Работа над ошибками' : 'Вопросы'}/>
    <div className="exam-finish">
      {fixing && <span className="chip">Работа над ошибками</span>}
      <ScoreGauge first={first} second={second} missed={missed} total={total}/>
      <ul className="score-legend">
        <li className="first">С первой попытки: <b>{first}</b></li>
        <li className="second">Со второй попытки: <b>{second}</b></li>
        <li className="missed">Не получилось: <b>{missed}</b></li>
      </ul>
      <h3>{headline}</h3>

      <div className="result-blocks">
        {easy.length > 0 && <div className="result-block good">
          <b><ThumbsUp size={16}/> Что получается</b>
          <ul>{easy.map(t => <li key={t}>{t}</li>)}</ul>
        </div>}
        {hard.length > 0 && <div className="result-block work">
          <b><Target size={16}/> Над чем поработать</b>
          <ul>{hard.map(t => <li key={t}><b>{t}.</b> {memo.find(m => m.topic === t).rule} <code>{memo.find(m => m.topic === t).example}</code></li>)}</ul>
          {missedTasks.length > 0 && <p className="missed-tasks">Разобрали вместе: {missedTasks.map(r => r.text).join(' · ')}</p>}
        </div>}
      </div>

      <div className="report-card">
        <b><ClipboardList size={16}/> Отчёт для родителя</b>
        <ul>
          <li>{fixing ? 'Работа над ошибками' : exam.subtitle}: верно {first + second} из {total} — с первой попытки {first}, со второй {second}, не получилось {missed}.</li>
          <li>Подсказок понадобилось: {hintsUsed}.</li>
          {easy.length > 0 && <li>Уверенно: {lower(easy)}.</li>}
          <li>{hard.length ? `Повторить перед контрольной: ${lower(hard)}.` : 'Тема усвоена — можно идти на контрольную спокойно.'}</li>
        </ul>
      </div>

      <div className="finish-actions">
        {mistakes.length > 0 && <button className="lj-btn" onClick={() => onFix(mistakes)}><Wrench size={17}/> Работа над ошибками ({mistakes.length})</button>}
        {hard.length > 0 && <button className="lj-btn ghost" onClick={() => onCards(hard)}><Layers size={17}/> Карточки по трудным темам</button>}
        <button className="lj-btn ghost" onClick={onMemo}><BookOpen size={17}/> Памятка</button>
        <button className={`lj-btn ${mistakes.length ? 'ghost' : ''}`} onClick={onRestart}><RotateCcw size={17}/> {fixing ? 'Пройти весь тест' : 'Пройти ещё раз'}</button>
      </div>
    </div>
  </>;
}

function Test({onCards, onMemo}) {
  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [status, setStatus] = useState('idle'); // idle | wrong | right | shown
  const [tried, setTried] = useState([]);
  const [hint, setHint] = useState(false);
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]); // {qi, topic, text, status: first | second | missed}
  const [hintsUsed, setHintsUsed] = useState(0);
  const [round, setRound] = useState(questions.map((_, i) => i)); // номера заданий текущего круга
  const fixing = round.length < questions.length;
  const qi = round[idx];
  const q = questions[qi];
  const stars = results.filter(r => r.status === 'first').length;

  const check = (value) => {
    const v = String(value).trim();
    if (!v || status === 'right' || status === 'shown') return;
    if (v === q.answer) {
      setStatus('right');
      setResults(r => [...r, {qi, topic: q.topic, text: q.text, status: tried.length === 0 ? 'first' : 'second'}]);
    } else if (tried.length === 0) {
      setTried([v]); setStatus('wrong');
      if (!hint) {setHint(true); setHintsUsed(h => h + 1);}
    } else {
      setTried(t => [...t, v]); setStatus('shown');
      setResults(r => [...r, {qi, topic: q.topic, text: q.text, status: 'missed'}]);
    }
  };
  const next = () => {setIdx(i => i + 1); setStatus('idle'); setTried([]); setHint(false); setInput('');};
  const restart = (list = questions.map((_, i) => i)) => {setRound(list); setIdx(0); setResults([]); setHintsUsed(0); setStatus('idle'); setTried([]); setHint(false); setInput('');};
  const finished = status === 'right' || status === 'shown';

  if (!started) return <>
    <Header progress={0} total={0}/>
    <div className="exam-intro">
      <div className="intro-hero"><Monkey/><div className="speech-inline">Проверим, что ты уже знаешь? Ошибаться можно — я подскажу!</div></div>
      <div className="intro-topics">
        <b><ListChecks size={16}/> Итоговый тест: {questions.length} заданий</b>
        <p>По программе {exam.grade}: {lower(testTopics)}.</p>
      </div>
      <p className="intro-note">Если ошибёшься — получишь подсказку и вторую попытку. В конце будет видно, что уже получается, а что стоит повторить.</p>
      <div className="intro-actions"><button className="lj-btn" onClick={() => setStarted(true)}>Начать тест <ArrowRight size={18}/></button></div>
    </div>
  </>;

  if (idx >= round.length) return <Result results={results} hintsUsed={hintsUsed} fixing={fixing} onRestart={() => restart()} onFix={restart} onCards={onCards} onMemo={onMemo}/>;

  const optionClass = (o) => finished && o === q.answer ? 'right' : tried.includes(o) ? 'wrong' : '';
  return <>
    <Header progress={idx + (finished ? 1 : 0)} total={round.length} stars={stars} label={fixing ? 'Работа над ошибками' : 'Вопросы'}/>
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
      {finished && <button className="lj-btn next-btn" onClick={next}>{idx + 1 < round.length ? 'Следующий вопрос' : 'Результат'} <ArrowRight size={18}/></button>}
    </div>
  </>;
}

const tabs = [
  {id: 'test', icon: ListChecks, title: 'Тест'},
  {id: 'cards', icon: Layers, title: 'Карточки'},
  {id: 'memo', icon: BookOpen, title: 'Памятка'},
];

export default function ExamPrep() {
  const [tab, setTab] = useState('test');
  const [focus, setFocus] = useState([]);
  const [cardsRun, setCardsRun] = useState(0);
  const openCards = (topics = []) => {setFocus(topics); setCardsRun(n => n + 1); setTab('cards');};

  // Все вкладки остаются смонтированными, чтобы прогресс теста не терялся при переключении.
  return <div className="exam">
    <div className="exam-tabs" role="tablist" aria-label="Подготовка к контрольной">
      {tabs.map(({id, icon: Icon, title}) => <button key={id} role="tab" aria-selected={tab === id} className={tab === id ? 'on' : ''}
        onClick={() => id === 'cards' && tab !== 'cards' ? openCards() : setTab(id)}><Icon size={16}/> {title}</button>)}
    </div>
    <div hidden={tab !== 'test'} className="exam-panel"><Test onCards={openCards} onMemo={() => setTab('memo')}/></div>
    <div hidden={tab !== 'cards'} className="exam-panel"><Cards key={cardsRun} focus={focus} onTest={() => setTab('test')}/></div>
    <div hidden={tab !== 'memo'} className="exam-panel"><Memo onTest={() => setTab('test')}/></div>
    <small className="tutor-note">Демонстрация · задания для примера · 2 класс</small>
  </div>;
}
