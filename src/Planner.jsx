import React, {useState} from 'react';
import {Smartphone, BookOpen, Palette, Dumbbell, Droplets, Home, Check, Plus, X, Pencil, Lightbulb, Compass, Sparkles, Heart, Hourglass, RotateCcw, ListChecks} from 'lucide-react';

// Планер дел: обязанности ребёнка по сферам, за которые он сам зарабатывает минуты игры в телефоне.
// Планер родитель составляет вместе с ребёнком: система лишь предлагает сферы и примеры дел.
// За каждое дело — свои минуты, но больше 2 часов в день заработать нельзя.
// Бонус «без напоминания» поощряет самостоятельность; по желанию родитель подтверждает дела.
// Минуты — на один день: завтра новый день и новый планер.

export const MAX_MINUTES = 120;
export const BONUS = 5;

export const spheres = [
  {id: 'study', title: 'Обучение', icon: BookOpen, ideas: [
    ['Пройти 2 урока на пути знаний', 20], ['Сделать домашнее задание', 20], ['Почитать книгу 20 минут', 15],
    ['Повторить карточки к контрольной', 10], ['Выучить стихотворение', 15]]},
  {id: 'creative', title: 'Творчество', icon: Palette, ideas: [
    ['Слепить фигурку из глины', 15], ['Порисовать', 10], ['Попеть любимые песни', 10],
    ['Поиграть на барабанах', 15], ['Собрать конструктор по своей идее', 10]]},
  {id: 'sport', title: 'Физическое развитие', icon: Dumbbell, ideas: [
    ['Утренняя зарядка', 10], ['Тренировка', 20], ['Прогулка и подвижные игры', 15], ['Растяжка перед сном', 5]]},
  {id: 'hygiene', title: 'Личная гигиена', icon: Droplets, ideas: [
    ['Почистить зубы утром', 5], ['Почистить зубы вечером', 5], ['Сходить в туалет «по-большому»', 5],
    ['Помыться в ванной', 5], ['Помыть руки перед едой', 5]]},
  {id: 'family', title: 'Семейные дела', icon: Home, ideas: [
    ['Помыть посуду', 15], ['Вынести мусор', 5], ['Застелить кровать', 5], ['Убрать игрушки', 10],
    ['Покормить питомца', 5], ['Помочь накрыть на стол', 5]]},
];
const minuteSteps = [5, 10, 15, 20, 30, 40];
const capSteps = [30, 45, 60, 90, 120];

let seq = 0;
export const task = (sphere, title, min, patch = {}) => ({id: `t${++seq}`, sphere, title, min, done: false, self: false, ok: false, ...patch});

export const demoPlanner = () => ({cap: MAX_MINUTES, bonus: true, confirm: false, tasks: [
  task('study', 'Пройти 2 урока на пути знаний', 20, {done: true}),
  task('study', 'Сделать домашнее задание', 20, {done: true, self: true}),
  task('creative', 'Поиграть на барабанах', 15, {done: true}),
  task('sport', 'Утренняя зарядка', 10, {done: true, self: true}),
  task('hygiene', 'Почистить зубы утром', 5, {done: true}),
  task('hygiene', 'Почистить зубы вечером', 5),
  task('hygiene', 'Помыться в ванной', 5),
  task('family', 'Помыть посуду', 15),
  task('family', 'Вынести мусор', 5),
]});

export const newPlanner = () => ({cap: 60, bonus: true, confirm: false, tasks: [
  task('study', 'Сделать домашнее задание', 20),
  task('sport', 'Утренняя зарядка', 10),
  task('hygiene', 'Почистить зубы утром', 5),
  task('family', 'Застелить кровать', 5),
]});

export const fmt = (m) => m >= 60 ? `${Math.floor(m / 60)} ч${m % 60 ? ` ${m % 60} мин` : ''}` : `${m} мин`;
const worth = (p, t) => t.min + (p.bonus && t.self ? BONUS : 0);
const counts = (p, t) => t.done && (!p.confirm || t.ok);

// Сколько минут заработано сегодня (не больше дневного максимума) и сколько ждёт подтверждения.
export function earned(p) {
  const raw = p.tasks.filter(t => counts(p, t)).reduce((s, t) => s + worth(p, t), 0);
  const pending = p.tasks.filter(t => t.done && !counts(p, t)).reduce((s, t) => s + worth(p, t), 0);
  const cap = Math.min(p.cap, MAX_MINUTES);
  return {minutes: Math.min(raw, cap), cap, pending, full: raw >= cap};
}

function PhoneMeter({p}) {
  const e = earned(p);
  return <div className="pl-meter">
    <span className="pl-phone"><Smartphone size={26}/></span>
    <div>
      <small>Заработано минут в телефоне</small>
      <b>{fmt(e.minutes)} <em>из {fmt(e.cap)}</em></b>
      <div className="bar"><i style={{width: `${e.minutes / e.cap * 100}%`}}/></div>
      {e.pending > 0 && <small className="pl-pending"><Hourglass size={13}/> Ещё {fmt(e.pending)} — ждут, пока родитель подтвердит</small>}
    </div>
  </div>;
}

function joolSays(p) {
  const e = earned(p);
  const left = p.tasks.filter(t => !t.done).length;
  if (!p.tasks.some(t => t.done)) return 'Начнём с самого простого дела? Каждое дело — шаг к самостоятельности.';
  if (e.full) return `Сегодняшний максимум — ${fmt(e.cap)} — набран! ${left ? 'Остальные дела — для себя и семьи: они тоже делают тебя сильнее.' : 'И все дела сделаны — вот это день!'}`;
  if (!left) return 'Все дела на сегодня сделаны — можно гордиться собой!';
  return `Здорово получается! Осталось ${left} ${left === 1 ? 'дело' : left < 5 ? 'дела' : 'дел'}.`;
}

// Планер в кабинете ребёнка: отмечает сделанное сам.
export function PlannerChild({p, onChange}) {
  const set = (id, patch) => onChange({...p, tasks: p.tasks.map(t => t.id === id ? {...t, ...patch} : t)});
  const toggle = (t) => set(t.id, t.done ? {done: false, self: false, ok: false} : {done: true});
  return <div className="planner">
    <div className="pl-head"><ListChecks size={18}/><b>Мой планер на сегодня</b></div>
    <PhoneMeter p={p}/>
    <p className="cab-jool"><Compass size={16}/> Джул: «{joolSays(p)}»</p>
    {spheres.filter(s => p.tasks.some(t => t.sphere === s.id)).map(({id, title, icon: Icon}) => <div key={id} className={`pl-sphere ${id}`}>
      <span className="pl-sphere-title"><Icon size={16}/> {title}</span>
      <ul>{p.tasks.filter(t => t.sphere === id).map(t => <li key={t.id} className={t.done ? 'done' : ''}>
        <button className="pl-check" aria-pressed={t.done} onClick={() => toggle(t)}>
          <span className="pl-box">{t.done && <Check size={15}/>}</span>
          <span className="pl-title">{t.title}</span>
          <em>+{worth(p, t)} мин</em>
        </button>
        {t.done && <div className="pl-after">
          {p.bonus && <button className={`pl-self ${t.self ? 'on' : ''}`} aria-pressed={t.self} disabled={p.confirm && t.ok} onClick={() => set(t.id, {self: !t.self})}>
            <Sparkles size={13}/> Без напоминания{t.self ? '' : ` · +${BONUS} мин`}
          </button>}
          {p.confirm && <span className="pl-wait">{t.ok ? <><Check size={13}/> подтверждено</> : <><Hourglass size={13}/> ждёт подтверждения</>}</span>}
        </div>}
      </li>)}</ul>
    </div>)}
    <small className="pl-foot"><Heart size={14}/> Планер ты составляешь вместе с родителем, и родитель его видит. Минуты — на сегодня: завтра новый день и новый планер.</small>
  </div>;
}

// Мастер родителя: дела по сферам → правила.
function PlannerEditor({initial, onSave, onCancel}) {
  const [tasks, setTasks] = useState(initial.tasks);
  const [cap, setCap] = useState(Math.min(initial.cap, MAX_MINUTES));
  const [bonus, setBonus] = useState(initial.bonus);
  const [confirm, setConfirm] = useState(initial.confirm);
  const [own, setOwn] = useState({title: '', sphere: 'study', min: 10});
  const has = (sphere, title) => tasks.some(t => t.sphere === sphere && t.title === title);
  const add = (sphere, title, min) => !has(sphere, title) && setTasks(list => [...list, task(sphere, title, min)]);
  const upd = (id, patch) => setTasks(list => list.map(t => t.id === id ? {...t, ...patch} : t));
  const total = tasks.reduce((s, t) => s + t.min, 0);

  return <form className="goal-editor" onSubmit={e => {e.preventDefault(); if (tasks.length) onSave({cap, bonus, confirm, tasks});}}>
    <div className="ge-step">
      <span className="ge-num">1</span>
      <div><b>Дела по сферам — и сколько минут за каждое</b>
        <small>Составьте планер вместе с ребёнком. Система предлагает примеры — можно вписать свои дела.</small>
        {spheres.map(({id, title, icon: Icon, ideas}) => <div key={id} className={`pl-edit-sphere ${id}`}>
          <span className="pl-sphere-title"><Icon size={16}/> {title}</span>
          {tasks.filter(t => t.sphere === id).map(t => <div key={t.id} className="pl-edit-task">
            <span>{t.title}</span>
            <select value={t.min} onChange={e => upd(t.id, {min: +e.target.value})} aria-label={`Минуты за дело: ${t.title}`}>{minuteSteps.map(m => <option key={m} value={m}>{m} мин</option>)}</select>
            <button type="button" aria-label={`Убрать дело: ${t.title}`} onClick={() => setTasks(list => list.filter(x => x.id !== t.id))}><X size={15}/></button>
          </div>)}
          <div className="goal-ideas">{ideas.map(([i, m]) => <button type="button" key={i} className={has(id, i) ? 'on' : ''} disabled={has(id, i)} onClick={() => add(id, i, m)}>{has(id, i) ? <Check size={13}/> : <Plus size={13}/>} {i}</button>)}</div>
        </div>)}
        <div className="ge-own pl-own">
          <input value={own.title} onChange={e => setOwn({...own, title: e.target.value})} placeholder="Своё дело" aria-label="Своё дело"/>
          <select value={own.sphere} onChange={e => setOwn({...own, sphere: e.target.value})} aria-label="Сфера">{spheres.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}</select>
          <select value={own.min} onChange={e => setOwn({...own, min: +e.target.value})} aria-label="Минуты">{minuteSteps.map(m => <option key={m} value={m}>{m} мин</option>)}</select>
          <button type="button" className="lj-btn ghost" disabled={!own.title.trim()} onClick={() => {add(own.sphere, own.title.trim(), own.min); setOwn({...own, title: ''});}}><Plus size={15}/> Добавить</button>
        </div>
        <small>Всего в планере — {fmt(total)}{total > cap ? `: больше дневного максимума, и это нормально — заработать можно не больше ${fmt(cap)}.` : '.'}</small>
      </div>
    </div>

    <div className="ge-step">
      <span className="ge-num">2</span>
      <div><b>Правила</b>
        <label className="ge-inline"><Smartphone size={15}/> Максимум в день:
          <select value={cap} onChange={e => setCap(+e.target.value)}>{capSteps.map(m => <option key={m} value={m}>{fmt(m)}</option>)}</select>
        </label>
        <small>Больше 2 часов в день заработать нельзя — даже если дел много.</small>
        <label className="pl-toggle"><input type="checkbox" checked={bonus} onChange={e => setBonus(e.target.checked)}/> Бонус +{BONUS} мин за дело, сделанное без напоминания</label>
        <label className="pl-toggle"><input type="checkbox" checked={confirm} onChange={e => setConfirm(e.target.checked)}/> Минуты начисляются после моего подтверждения</label>
        <div className="ge-tip">
          <b><Lightbulb size={15}/> Подсказка: как планеру растить самостоятельность</b>
          <ul>
            <li>Договоритесь о правилах вместе и запишите их: ребёнок охотнее выполняет то, что выбрал сам.</li>
            <li>Начните с 3–5 дел и добавляйте новые постепенно — лучше маленький планер, который получается, чем большой, который пугает.</li>
            <li>Бонус «без напоминания» ценит главное — когда ребёнок вспомнил и сделал сам.</li>
            <li>Если дело не сделано — это не штраф, просто минуты не заработаны. Завтра новая попытка.</li>
            <li>Хвалите за дело, а не за минуты: «ты сам помыл посуду — спасибо, мне так помогло!»</li>
          </ul>
        </div>
      </div>
    </div>

    <div className="ge-actions">
      {onCancel && <button type="button" className="lj-btn ghost" onClick={onCancel}>Отмена</button>}
      <button className="lj-btn" disabled={!tasks.length}><ListChecks size={16}/> Сохранить планер</button>
    </div>
  </form>;
}

// Планер в кабинете родителя: что сделано сегодня, подтверждение дел, редактирование.
export function PlannerParent({name, p, onChange}) {
  const [editing, setEditing] = useState(false);
  if (editing) return <div className="cab-block pl-block">
    <b><ListChecks size={16}/> Планер дел · {name}</b>
    <PlannerEditor initial={p} onSave={np => {onChange(np); setEditing(false);}} onCancel={() => setEditing(false)}/>
  </div>;

  const e = earned(p);
  const done = p.tasks.filter(t => t.done);
  const approve = (id) => onChange({...p, tasks: p.tasks.map(t => t.id === id ? {...t, ok: !t.ok} : t)});
  return <div className="cab-block pl-block">
    <div className="goal-head"><b><ListChecks size={16}/> Планер дел · {name}</b>
      <button className="goal-edit" onClick={() => setEditing(true)}><Pencil size={14}/> Изменить</button></div>
    <div className="cab-stats">
      <div><b>{done.length} из {p.tasks.length}</b><span>дел сделано</span></div>
      <div><b>{fmt(e.minutes)}</b><span>заработано из {fmt(e.cap)}</span></div>
      {p.bonus && <div><b>{done.filter(t => t.self).length}</b><span>без напоминания</span></div>}
    </div>
    {done.length ? <ul className="goal-minis parent">{done.map(t => {
      const s = spheres.find(x => x.id === t.sphere);
      return <li key={t.id} className={!p.confirm || t.ok ? 'done' : ''}>
        <div className="gm-title"><s.icon size={15}/><span>{t.title}</span></div>
        <small>+{worth(p, t)} мин{t.self && p.bonus ? ' · без напоминания' : ''}</small>
        {p.confirm && <button className="goal-mark" onClick={() => approve(t.id)}>{t.ok ? 'Отменить' : 'Подтвердить'}</button>}
      </li>;
    })}</ul> : <small>Сегодня дела ещё не отмечены.</small>}
    {e.full && <small><Smartphone size={13}/> Дневной максимум набран: больше минут сегодня не начисляется.</small>}
    <small>Правила: максимум {fmt(e.cap)} в день{p.bonus ? `, бонус +${BONUS} мин без напоминания` : ''}, {p.confirm ? 'минуты — после вашего подтверждения' : 'минуты начисляются сразу'}. Телефоном система не управляет: время выдаёте вы.</small>
    <button className="lj-btn ghost pl-reset" onClick={() => onChange({...p, tasks: p.tasks.map(t => ({...t, done: false, self: false, ok: false}))})}><RotateCcw size={15}/> Начать новый день</button>
  </div>;
}

// Демо для главной страницы: тот же планер глазами ребёнка и родителя.
export default function PlannerDemo() {
  const [p, setP] = useState(demoPlanner);
  const [who, setWho] = useState('child');
  return <div className="cabinet">
    <div className="exam-tabs" role="tablist" aria-label="Чей взгляд">
      {[['child', 'Ребёнок'], ['parent', 'Родитель']].map(([id, t]) => <button key={id} role="tab" aria-selected={who === id} className={who === id ? 'on' : ''} onClick={() => setWho(id)}>{t}</button>)}
    </div>
    {who === 'child' ? <PlannerChild p={p} onChange={setP}/> : <PlannerParent name="Миша" p={p} onChange={setP}/>}
    <small className="tutor-note">Демонстрация · данные для примера</small>
  </div>;
}
