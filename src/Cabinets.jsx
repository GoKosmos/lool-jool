import React, {useState} from 'react';
import {Lock, Compass, ArrowLeft, Plus, Star, ShieldCheck, Settings, ClipboardList, ThumbsUp, Target, Heart, CalendarCheck, Clock, Lightbulb, Sparkles, Send, Check, BookOpen} from 'lucide-react';
import {Sloth, Monkey} from './Characters.jsx';
import {GoalChild, GoalParent, goalReminder} from './Goals.jsx';
import {PlannerChild, PlannerParent, demoPlanner, newPlanner, task} from './Planner.jsx';

// Личные кабинеты (демо на заготовленных данных).
// Один аккаунт на семью — почта родителя, общий вход во всю Вселенную (Lool & Jool, Лаборатория Счастья).
// Внутри — несколько профилей детей. Ребёнок входит, выбрав свой профиль; кабинет родителя — по PIN.
// Ребёнок знает, что родитель видит его занятия, но сам отчёт родителя не видит.

const DEMO_PIN = '1234';

// Предметы начальной школы по ФОП НОО; в 1 классе — 8, во 2–3 — 9, в 4 — 10 (добавляется ОРКСЭ).
const subjects = [
  {id: 'russian', title: 'Русский язык', from: 1},
  {id: 'reading', title: 'Литературное чтение', from: 1},
  {id: 'foreign', title: 'Иностранный язык', from: 2},
  {id: 'math', title: 'Математика', from: 1},
  {id: 'world', title: 'Окружающий мир', from: 1},
  {id: 'orkse', title: 'ОРКСЭ', from: 4, note: 'основы религиозных культур и светской этики'},
  {id: 'art', title: 'Изобразительное искусство', from: 1},
  {id: 'music', title: 'Музыка', from: 1},
  {id: 'tech', title: 'Труд (технология)', from: 1},
  {id: 'pe', title: 'Физическая культура', from: 1},
];
// Развивающие курсы помимо школьной программы (soft skills).
const extras = [
  {id: 'eq', title: 'Эмоциональный интеллект', text: 'понимать свои чувства и чувства других'},
  {id: 'biz', title: 'Юный предприниматель', text: 'деньги, идеи и первый проект'},
  {id: 'logic', title: 'Логика и мышление', text: 'головоломки, закономерности, рассуждения'},
  {id: 'talk', title: 'Общение и дружба', text: 'договариваться, слушать, решать споры'},
  {id: 'creative', title: 'Креативность', text: 'придумывать, сочинять, изобретать'},
  {id: 'focus', title: 'Внимание и память', text: 'игры на сосредоточенность'},
];
const gradeSubjects = (grade) => subjects.filter(x => x.from <= grade);
const title = (id) => (subjects.find(x => x.id === id) || extras.find(x => x.id === id)).title;
const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const demoChildren = [
  {id: 'misha', name: 'Миша', grade: 2, hero: 'monkey',
    path: {title: 'Сложение и вычитание до 100', done: 3, total: 8},
    skills: ['Считаю десятками до 100', 'Знаю, что делать первым в примере со скобками', 'Проверяю сложение вычитанием'],
    stickers: 7,
    today: {minutes: 22, hints: 3, sessions: [
      {time: '16:10', format: 'Путь знаний', topic: 'Сложение с переходом через десяток', note: 'урок пройден, 10 минут'},
      {time: '16:25', format: 'Подготовка к контрольной', topic: 'Сложение и вычитание до 100', note: 'тест: верно 6 из 8, работа над ошибками — 3 из 3'},
    ], summary: 'Миша прошёл урок о сложении с переходом через десяток и тест к контрольной. Вычитание с переходом сначала давалось трудно, но после подсказки «дойди до круглого числа» Миша решил похожие задания сам.'},
    plan: {days: 4, subjects: ['math', 'russian', 'reading', 'world'], extras: ['eq']},
    planner: demoPlanner(),
    goal: {title: 'Пятёрка в четверти по математике', weeks: 9, week: 3, reward: 'Велосипед', remind: 'в начале каждого занятия', done: false, minis: [
      {id: 1, title: '7 дней занятий подряд', total: 7, cur: 5, done: false, reward: 'Поход в зоопарк'},
      {id: 2, title: 'Все задания теста к контрольной — с первой попытки', total: 1, cur: 0, done: false, reward: 'Любимый торт'},
      {id: 3, title: 'Пройти 5 уроков на пути знаний', total: 5, cur: 5, done: true, reward: 'Кино всей семьёй'}]},
    week: {minutes: [12, 15, 0, 18, 22, 0, 0],
      good: ['Десятки и единицы', 'Порядок действий', 'Задачи в одно действие'],
      work: ['Вычитание с переходом через десяток', 'Сравнение чисел'],
      tests: [{title: 'Тест к контрольной: сложение и вычитание до 100', score: 'верно 6 из 8', fix: 'работа над ошибками — 3 из 3'}],
      summary: 'На этой неделе — 4 занятия. Миша увереннее работает с десятками и скобками. Вычитание с переходом пока требует подсказок, но к концу недели их нужно меньше.',
      tip: 'Поиграйте в магазин: «У тебя 52 рубля, мороженое стоит 7. Сколько останется?» — это закрепит вычитание с переходом.'},
    month: {topics: [
      ['Числа до 100', 'done'], ['Десятки и единицы', 'done'], ['Сложение без перехода', 'done'], ['Сложение с переходом', 'done'],
      ['Вычитание с переходом', 'progress'], ['Сравнение чисел', 'progress'], ['Скобки и порядок действий', 'done'],
      ['Задачи в два действия', 'todo'], ['Длина: см и дм', 'todo'], ['Таблица умножения на 2', 'todo']],
      growth: ['Сложение с переходом: в начале месяца — с подсказками, сейчас — с первой попытки', 'Скобки: раньше путал порядок, теперь объясняет сам'],
      lessons: 14, minutes: 196,
      summary: 'За месяц Миша прошёл 14 занятий. Освоено 5 тем из 10 по программе. Лучше всего идут задачи со скобками, больше всего внимания нужно вычитанию с переходом.'}},
  {id: 'anya', name: 'Аня', grade: 4, hero: 'sloth',
    path: {title: 'Части речи', done: 5, total: 9},
    plan: {days: 3, subjects: ['russian', 'reading', 'math', 'foreign'], extras: ['biz', 'logic']},
    planner: {cap: 90, bonus: true, confirm: true, tasks: [
      task('study', 'Сделать домашнее задание', 20, {done: true, self: true, ok: true}),
      task('study', 'Почитать книгу 20 минут', 15),
      task('creative', 'Порисовать', 10, {done: true}),
      task('sport', 'Тренировка', 20),
      task('hygiene', 'Почистить зубы вечером', 5),
      task('family', 'Покормить питомца', 5, {done: true, self: true})]},
    skills: ['Нахожу имя прилагательное', 'Различаю род и число существительных', 'Подбираю проверочные слова'],
    stickers: 12,
    today: {minutes: 0, hints: 0, sessions: [], summary: ''},
    week: {minutes: [15, 0, 20, 0, 15, 10, 0],
      good: ['Имя прилагательное', 'Безударные гласные в корне'],
      work: ['Спряжение глаголов'],
      tests: [],
      summary: 'Аня занималась 4 раза. Хорошо справляется с прилагательными, а со спряжением глаголов просит подсказку почти в каждом задании.',
      tip: 'Попросите Аню придумать 3 глагола про ваш вечер и определить спряжение — она любит объяснять.'},
    month: {topics: [['Имя существительное', 'done'], ['Имя прилагательное', 'done'], ['Местоимение', 'done'], ['Безударные гласные', 'done'], ['Спряжение глаголов', 'progress'], ['Наречие', 'todo']],
      growth: ['Безударные гласные: стала сама подбирать проверочные слова'],
      lessons: 11, minutes: 165,
      summary: 'За месяц Аня прошла 11 занятий, освоено 4 темы из 6. Растёт самостоятельность: подсказок стало вдвое меньше.'}},
];

const Avatar = ({hero, className = ''}) => hero === 'sloth' ? <Sloth className={className}/> : <Monkey className={className}/>;
const plural = (n, one, few, many) => n % 10 === 1 && n % 100 !== 11 ? one : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? few : many;
const daysText = (n) => `${n} ${plural(n, 'день', 'дня', 'дней')} в неделю`;

function Picker({children, onChild, onParent}) {
  return <div className="cab-picker">
    <h3>Кто сегодня учится?</h3>
    <div className="cab-profiles">
      {children.map(c => <button key={c.id} className="cab-profile" onClick={() => onChild(c.id)}>
        <span className={`cab-ava ${c.hero}`}><Avatar hero={c.hero}/></span><b>{c.name}</b><small>{c.grade} класс</small>
      </button>)}
      <button className="cab-profile parent" onClick={onParent}>
        <span className="cab-ava lock"><Lock size={34}/></span><b>Родитель</b><small>по PIN-коду</small>
      </button>
    </div>
    <p className="cab-note">Вход — по почте родителя. Один вход во всю Вселенную: Lool & Jool и Лаборатория Счастья.</p>
  </div>;
}

function ChildRoom({child, tasks, onPlanner, onBack}) {
  const mine = tasks.filter(t => t.child === child.id);
  return <div className="cab-room">
    <button className="cab-back" onClick={onBack}><ArrowLeft size={16}/> Сменить профиль</button>
    <div className="cab-hello">
      <span className={`cab-ava ${child.hero}`}><Avatar hero={child.hero}/></span>
      <div><h3>Привет, {child.name}!</h3>
        <p className="cab-jool"><Compass size={16}/> Джул: «{goalReminder(child.goal) || 'Продолжим путь? Сегодня — короткий урок, всего 10 минут'}»</p></div>
    </div>

    <PlannerChild p={child.planner} onChange={p => onPlanner(child.id, p)}/>

    <GoalChild goal={child.goal}/>

    {mine.length > 0 && <div className="cab-block tasks">
      <b><Send size={16}/> {mine.length > 1 ? 'Задания от родителя' : 'Задание от родителя'}</b>
      <ul>{mine.map(t => <li key={t.id}><span>{t.text}</span>{t.due && <em>до {t.due}</em>}</li>)}</ul>
    </div>}

    <div className="cab-block">
      <b><Compass size={16}/> Мой путь: {child.path.title}</b>
      <div className="bar"><i style={{width: `${child.path.done / child.path.total * 100}%`}}/></div>
      <small>Пройдено {child.path.done} из {child.path.total} уроков</small>
    </div>

    <div className="cab-block">
      <b><BookOpen size={16}/> Мои предметы · {daysText(child.plan.days)}</b>
      <div className="subj-chips">
        {child.plan.subjects.map(id => <span key={id} className="subj on">{title(id)}</span>)}
        {child.plan.extras.map(id => <span key={id} className="subj extra on"><Sparkles size={13}/> {title(id)}</span>)}
      </div>
    </div>

    <div className="cab-grid">
      <div className="cab-block">
        <b><Sparkles size={16}/> Моя коллекция</b>
        <div className="stickers">{Array.from({length: 12}, (_, i) => <span key={i} className={i < child.stickers ? 'on' : ''}>{i < child.stickers ? ['⭐', '🍌', '🌈', '🚀', '🐢', '🎈', '🍀', '🦋', '🌻', '🎨', '🐠', '🍓'][i] : '?'}</span>)}</div>
        <small>Наклейки — за старание: за урок, за работу над ошибками, за возвращение к трудной теме.</small>
      </div>
      <div className="cab-block">
        <b><Star size={16}/> Что я уже умею</b>
        <ul>{child.skills.map(s => <li key={s}>{s}</li>)}</ul>
      </div>
    </div>

    <p className="cab-transparent"><Heart size={16}/> Мама и папа видят, чем ты занимаешься и что у тебя получается, — чтобы радоваться вместе.</p>
  </div>;
}

function PinGate({onOk, onBack}) {
  const [pin, setPin] = useState('');
  const [wrong, setWrong] = useState(false);
  const press = (d) => {
    const next = (pin + d).slice(0, 4);
    setWrong(false); setPin(next);
    if (next.length === 4) {if (next === DEMO_PIN) onOk(); else {setWrong(true); setPin('');}}
  };
  return <div className="cab-pin">
    <button className="cab-back" onClick={onBack}><ArrowLeft size={16}/> Назад</button>
    <Lock size={30}/>
    <h3>Кабинет родителя</h3>
    <div className="pin-dots" aria-label={`Введено цифр: ${pin.length}`}>{[0, 1, 2, 3].map(i => <i key={i} className={i < pin.length ? 'on' : ''}/>)}</div>
    {wrong && <p className="pin-wrong">Неверный PIN, попробуйте ещё раз</p>}
    <div className="pin-pad">{[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(d => <button key={d} onClick={() => press(String(d))}>{d}</button>)}</div>
    <small>PIN для демо: {DEMO_PIN}</small>
  </div>;
}

function WeekChart({minutes}) {
  const max = Math.max(...minutes, 1);
  return <div className="week-chart" role="img" aria-label={`Минуты занятий по дням: ${days.map((d, i) => `${d} — ${minutes[i]}`).join(', ')}`}>
    {minutes.map((m, i) => <div key={i} className="wc-col" title={`${days[i]}: ${m ? `${m} мин` : 'нет занятий'}`}>
      <span className="wc-val">{m || ''}</span>
      <div className="wc-track"><i style={{height: `${m / max * 100}%`}}/></div>
      <span className="wc-day">{days[i]}</span>
    </div>)}
  </div>;
}

function Today({c}) {
  const t = c.today;
  if (!t.sessions.length) return <p className="cab-empty">Сегодня занятий ещё не было. Отчёт появится после первого занятия.</p>;
  return <>
    <div className="cab-stats">
      <div><b>{t.minutes}</b><span>минут</span></div>
      <div><b>{t.sessions.length}</b><span>{plural(t.sessions.length, 'занятие', 'занятия', 'занятий')}</span></div>
      <div><b>{t.hints}</b><span>{plural(t.hints, 'подсказка', 'подсказки', 'подсказок')}</span></div>
    </div>
    <ul className="cab-sessions">{t.sessions.map(s => <li key={s.time}><em>{s.time}</em><div><b>{s.format}</b> · {s.topic}<small>{s.note}</small></div></li>)}</ul>
    <div className="report-card"><b><ClipboardList size={16}/> Резюме дня</b><p>{t.summary}</p></div>
  </>;
}

function Week({c}) {
  const w = c.week;
  const sessions = w.minutes.filter(Boolean).length;
  const goal = c.plan.days;
  const total = w.minutes.reduce((a, b) => a + b, 0);
  return <>
    <div className="cab-stats">
      <div><b>{total}</b><span>минут за неделю</span></div>
      <div><b>{Math.min(sessions, goal)} из {goal}</b><span>{sessions >= goal ? 'цель недели выполнена' : 'дней по цели'}</span></div>
    </div>
    <div className="cab-block"><b><CalendarCheck size={16}/> Минуты занятий по дням</b><WeekChart minutes={w.minutes}/></div>
    <div className="cab-grid">
      <div className="cab-block good"><b><ThumbsUp size={16}/> Что получается</b><ul>{w.good.map(g => <li key={g}>{g}</li>)}</ul></div>
      <div className="cab-block work"><b><Target size={16}/> Над чем поработать</b><ul>{w.work.map(g => <li key={g}>{g}</li>)}</ul></div>
    </div>
    {w.tests.length > 0 && <div className="cab-block"><b><Check size={16}/> Подготовка к контрольной</b>
      <ul>{w.tests.map(t => <li key={t.title}>{t.title}: <b>{t.score}</b>; {t.fix}</li>)}</ul></div>}
    <div className="report-card"><b><ClipboardList size={16}/> Резюме недели</b><p>{w.summary}</p><p className="cab-tip"><Lightbulb size={15}/> {w.tip}</p></div>
  </>;
}

function Month({c}) {
  const m = c.month;
  const label = {done: 'освоено', progress: 'в процессе', todo: 'впереди'};
  const count = (s) => m.topics.filter(t => t[1] === s).length;
  return <>
    <div className="cab-stats">
      <div><b>{m.lessons}</b><span>занятий</span></div>
      <div><b>{m.minutes}</b><span>минут</span></div>
      <div><b>{count('done')} из {m.topics.length}</b><span>тем освоено</span></div>
    </div>
    <div className="cab-block"><b><Compass size={16}/> Карта программы · {c.path.title.startsWith('Части') ? 'русский язык' : 'математика'}, {c.grade} класс</b>
      <div className="topic-map">{m.topics.map(([t, s]) => <span key={t} className={`topic ${s}`}>{t}<em>{label[s]}</em></span>)}</div>
      <div className="topic-legend"><span className="done">освоено — {count('done')}</span><span className="progress">в процессе — {count('progress')}</span><span className="todo">впереди — {count('todo')}</span></div>
    </div>
    <div className="cab-block good"><b><Sparkles size={16}/> Было трудно — стало получаться</b><ul>{m.growth.map(g => <li key={g}>{g}</li>)}</ul></div>
    <div className="report-card"><b><ClipboardList size={16}/> Резюме месяца</b><p>{m.summary}</p></div>
  </>;
}

function AssignTask({child, onAdd}) {
  const [text, setText] = useState('');
  const [due, setDue] = useState('пятницы');
  return <form className="cab-assign" onSubmit={e => {e.preventDefault(); if (text.trim()) {onAdd({child: child.id, text: text.trim(), due}); setText('');}}}>
    <input value={text} onChange={e => setText(e.target.value)} placeholder="Новое задание" aria-label="Текст задания"/>
    <select value={due} onChange={e => setDue(e.target.value)} aria-label="Срок">
      {['завтра', 'среды', 'пятницы', 'воскресенья'].map(d => <option key={d} value={d}>до {d}</option>)}
    </select>
    <button className="lj-btn" disabled={!text.trim()}><Plus size={16}/> Дать задание</button>
  </form>;
}

function LoadSettings({c, onPlan}) {
  const {days, subjects: chosen, extras: chosenExtras} = c.plan;
  const list = gradeSubjects(c.grade);
  const set = (patch) => onPlan(c.id, {...c.plan, ...patch});
  const toggle = (id) => chosen.includes(id) ? chosen.length > 1 && set({subjects: chosen.filter(x => x !== id)}) : set({subjects: [...chosen, id]});
  const toggleExtra = (id) => set({extras: chosenExtras.includes(id) ? chosenExtras.filter(x => x !== id) : [...chosenExtras, id]});
  return <div className="cab-block load">
    <b><CalendarCheck size={16}/> Нагрузка · {c.name}</b>

    <div className="load-row">
      <span className="load-label">Сколько дней в неделю заниматься</span>
      <div className="day-pick" role="radiogroup" aria-label="Дней в неделю">
        {[1, 2, 3, 4, 5, 6, 7].map(n => <button key={n} role="radio" aria-checked={days === n} className={days === n ? 'on' : ''} onClick={() => set({days: n})}>{n}</button>)}
      </div>
      <small>{daysText(days)}. {days >= 6 ? 'Оставьте ребёнку день-два отдыха — без штрафов за пропуски.' : 'Это цель недели, без штрафов за пропуски.'}</small>
    </div>

    <div className="load-row">
      <span className="load-label">Школьные предметы · выбрано {chosen.filter(id => list.some(x => x.id === id)).length} из {list.length} ({c.grade} класс)</span>
      <div className="subj-chips">
        {list.map(x => <button key={x.id} className={`subj ${chosen.includes(x.id) ? 'on' : ''}`} aria-pressed={chosen.includes(x.id)} title={x.note} onClick={() => toggle(x.id)}>{chosen.includes(x.id) && <Check size={13}/>} {x.title}</button>)}
      </div>
      <div className="load-quick">
        <button onClick={() => set({subjects: list.map(x => x.id)})}>Все предметы</button>
        <button onClick={() => set({subjects: [chosen.find(id => list.some(x => x.id === id)) || 'math']})}>Только один</button>
      </div>
    </div>

    <div className="load-row">
      <span className="load-label"><Sparkles size={14}/> Развивающие курсы — по желанию</span>
      <div className="extra-list">
        {extras.map(x => <button key={x.id} className={`extra-item ${chosenExtras.includes(x.id) ? 'on' : ''}`} aria-pressed={chosenExtras.includes(x.id)} onClick={() => toggleExtra(x.id)}>
          <b>{chosenExtras.includes(x.id) ? <Check size={14}/> : <Plus size={14}/>} {x.title}</b><small>{x.text}</small>
        </button>)}
      </div>
    </div>
  </div>;
}

function ParentRoom({children, tasks, onAddTask, onAddChild, onPlan, onGoal, onPlanner, onBack}) {
  const [cid, setCid] = useState(children[0].id);
  const [period, setPeriod] = useState('today');
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [grade, setGrade] = useState(1);
  const c = children.find(x => x.id === cid);
  const mine = tasks.filter(t => t.child === c.id);
  const fresh = !c.month;

  return <div className="cab-room">
    <button className="cab-back" onClick={onBack}><ArrowLeft size={16}/> Выйти из кабинета родителя</button>
    <div className="cab-kids" role="tablist" aria-label="Дети">
      {children.map(k => <button key={k.id} role="tab" aria-selected={k.id === cid} className={k.id === cid ? 'on' : ''} onClick={() => {setCid(k.id); setAdding(false);}}>
        <span className={`cab-ava mini ${k.hero}`}><Avatar hero={k.hero}/></span>{k.name}, {k.grade} кл.
      </button>)}
      <button className="add" onClick={() => setAdding(a => !a)}><Plus size={16}/> Добавить ребёнка</button>
    </div>

    {adding && <form className="cab-add" onSubmit={e => {e.preventDefault(); if (name.trim()) {const id = onAddChild(name.trim(), grade); setCid(id); setAdding(false); setName('');}}}>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Имя или прозвище" aria-label="Имя ребёнка"/>
      <select value={grade} onChange={e => setGrade(+e.target.value)} aria-label="Класс">{[1, 2, 3, 4].map(g => <option key={g} value={g}>{g} класс</option>)}</select>
      <button className="lj-btn">Добавить</button>
      <small>Без фамилии, школы и фото — только имя и класс. Согласие на обработку данных ребёнка даёт родитель.</small>
    </form>}

    {fresh ? <p className="cab-empty">Профиль «{c.name}» создан. Отчёты появятся после первых занятий — а пока можно дать первое задание.</p> : <>
      <div className="exam-tabs" role="tablist" aria-label="Период">
        {[['today', 'Сегодня'], ['week', 'Неделя'], ['month', 'Месяц']].map(([id, t]) => <button key={id} role="tab" aria-selected={period === id} className={period === id ? 'on' : ''} onClick={() => setPeriod(id)}>{t}</button>)}
      </div>
      {period === 'today' ? <Today c={c}/> : period === 'week' ? <Week c={c}/> : <Month c={c}/>}
    </>}

    <div className="cab-block tasks">
      <b><Send size={16}/> Задания · {c.name}</b>
      {mine.length ? <ul>{mine.map(t => <li key={t.id}><span>{t.text}</span>{t.due && <em>до {t.due}</em>}</li>)}</ul> : <small>Пока заданий нет.</small>}
      <AssignTask child={c} onAdd={onAddTask}/>
      <small>Задание появится в кабинете ребёнка.</small>
    </div>

    <PlannerParent key={`pl-${c.id}`} name={c.name} p={c.planner} onChange={p => onPlanner(c.id, p)}/>

    <GoalParent key={c.id} child={c} onGoal={onGoal}/>

    <LoadSettings c={c} onPlan={onPlan}/>

    <div className="cab-grid">
      <div className="cab-block safe"><b><ShieldCheck size={16}/> Безопасность</b><small>Сигналов нет. Если ребёнок напишет, что ему страшно или больно, вы сразу получите уведомление.</small></div>
      <div className="cab-block"><b><Settings size={16}/> Настройки</b>
        <ul className="cab-settings"><li><Clock size={14}/> Занятие — до 20 минут</li><li><Send size={14}/> Резюме на почту — раз в неделю</li></ul></div>
    </div>
    <p className="cab-note">Ребёнок знает, что вы видите его занятия и успехи, но сам этот отчёт не видит.</p>
  </div>;
}

export default function Cabinets() {
  const [children, setChildren] = useState(demoChildren);
  const [tasks, setTasks] = useState([{id: 1, child: 'misha', text: 'Подготовиться к контрольной по сложению и вычитанию', due: 'пятницы'}]);
  const [view, setView] = useState({mode: 'pick'});
  const setGoal = (id, goal) => setChildren(list => list.map(c => c.id === id ? {...c, goal} : c));
  const setPlan = (id, plan) => setChildren(list => list.map(c => c.id === id ? {...c, plan} : c));
  const setPlanner = (id, planner) => setChildren(list => list.map(c => c.id === id ? {...c, planner} : c));
  const addTask = (t) => setTasks(list => [...list, {...t, id: Date.now()}]);
  const addChild = (name, grade) => {
    const id = `kid-${Date.now()}`;
    setChildren(list => [...list, {id, name, grade, hero: list.length % 2 ? 'monkey' : 'sloth',
      path: {title: 'Первый остров', done: 0, total: 8}, plan: {days: 3, subjects: ['math', 'russian', 'reading', 'world'], extras: []}, planner: newPlanner(), skills: ['Скоро здесь появятся первые умения!'], stickers: 0,
      today: {minutes: 0, hints: 0, sessions: [], summary: ''}}]);
    return id;
  };

  return <div className="cabinet">
    {view.mode === 'pick' && <Picker children={children} onChild={id => setView({mode: 'child', id})} onParent={() => setView({mode: 'pin'})}/>}
    {view.mode === 'child' && <ChildRoom child={children.find(c => c.id === view.id)} tasks={tasks} onPlanner={setPlanner} onBack={() => setView({mode: 'pick'})}/>}
    {view.mode === 'pin' && <PinGate onOk={() => setView({mode: 'parent'})} onBack={() => setView({mode: 'pick'})}/>}
    {view.mode === 'parent' && <ParentRoom children={children} tasks={tasks} onAddTask={addTask} onAddChild={addChild} onPlan={setPlan} onGoal={setGoal} onPlanner={setPlanner} onBack={() => setView({mode: 'pick'})}/>}
    <small className="tutor-note">Демонстрация · данные для примера</small>
  </div>;
}
