import React, {useState} from 'react';
import {Gift, Flag, Check, Plus, X, Pencil, Trophy, Bell, PartyPopper, Lightbulb} from 'lucide-react';

// Цель-желание: большая цель со сроком пути, мини-цели на пути к ней и награды.
// Родитель задаёт цели в своём кабинете (система предлагает варианты, можно вписать свои),
// награду родитель и ребёнок выбирают вместе. Ребёнок видит цель у себя, Джул мягко напоминает о ней.
// Большую цель (например, пятёрку в четверти) отмечает родитель: платформа не ставит оценок.
// Мини-цели про старание платформа считает сама; если серия прервалась — не штраф, а новая попытка.

export const bigGoalIdeas = [
  'Пятёрка в четверти по математике',
  'Выучить таблицу умножения',
  'Читать без запинок',
  'Писать без ошибок в словарных словах',
  'Спокойно написать контрольную',
];
export const durations = [
  {weeks: 2, title: '2 недели'},
  {weeks: 4, title: '1 месяц'},
  {weeks: 9, title: 'четверть (около 2 месяцев)'},
  {weeks: 17, title: 'полугодие'},
];
// Мини-цели, которые система умеет считать сама.
export const miniIdeas = [
  {title: '7 дней занятий подряд', total: 7},
  {title: 'Все задания теста к контрольной — с первой попытки', total: 1},
  {title: 'Пройти 5 уроков на пути знаний', total: 5},
  {title: 'Работа над ошибками — всё решено', total: 1},
  {title: '4 недели заниматься по цели', total: 4},
  {title: 'Объяснить новую тему маме или папе своими словами', total: 1},
];
export const bigRewardIdeas = ['Велосипед', 'VR-шлем', 'Новый телефон', 'Поездка всей семьёй', 'Конструктор мечты'];
export const miniRewardIdeas = ['Поход в зоопарк', 'Любимый торт', 'Кино всей семьёй', 'Новая книга', 'Вечер настольных игр', 'Парк аттракционов'];
export const reminderModes = ['в начале каждого занятия', 'раз в неделю', 'не напоминать'];

const weeksText = (w) => durations.find(d => d.weeks === w)?.title || `${w} нед.`;

// Мягкое напоминание Джула: о ближайшей мини-цели или о большой цели.
export function goalReminder(goal) {
  if (!goal || goal.remind === 'не напоминать') return null;
  const next = goal.minis.filter(m => !m.done).sort((a, b) => (b.cur / b.total) - (a.cur / a.total))[0];
  if (next && next.total - next.cur > 0 && next.cur > 0) {
    const left = next.total - next.cur;
    return `Ещё ${left} — и мини-цель „${next.title}“ достигнута! А там — ${next.reward.toLowerCase()}.`;
  }
  return `Помнишь свою цель — „${goal.title}“? Каждое занятие — ещё один шаг к награде: ${goal.reward.toLowerCase()}.`;
}

function Progress({cur, total}) {
  return <div className="bar"><i style={{width: `${Math.min(cur / total, 1) * 100}%`}}/></div>;
}

// Цель в кабинете ребёнка.
export function GoalChild({goal}) {
  if (!goal) return null;
  const doneMinis = goal.minis.filter(m => m.done).length;
  return <div className="goal-card">
    <div className="goal-top">
      <span className="goal-icon"><Flag size={22}/></span>
      <div><small>Моя цель-желание</small><h4>{goal.title}</h4></div>
    </div>
    {goal.done ? <p className="goal-win"><PartyPopper size={18}/> Цель достигнута! Награда: <b>{goal.reward}</b></p> : <>
      <div className="goal-reward"><Gift size={18}/> Награда: <b>{goal.reward}</b></div>
      <div className="goal-time"><span>Путь: неделя {Math.min(goal.week + 1, goal.weeks)} из {goal.weeks}</span><Progress cur={goal.week} total={goal.weeks}/></div>
    </>}
    {goal.minis.length > 0 && <>
      <b className="goal-sub">Мини-цели на пути · {doneMinis} из {goal.minis.length}</b>
      <ul className="goal-minis">{goal.minis.map(m => <li key={m.id} className={m.done ? 'done' : ''}>
        <div className="gm-title">{m.done ? <Check size={15}/> : <span className="gm-dot"/>}<span>{m.title}</span></div>
        {!m.done && m.total > 1 && <div className="gm-progress"><Progress cur={m.cur} total={m.total}/><em>{m.cur} из {m.total}</em></div>}
        <small><Gift size={13}/> {m.done ? `Ура! ${m.reward}` : m.reward}</small>
      </li>)}</ul>
    </>}
  </div>;
}

function Chips({items, onPick}) {
  return <div className="goal-ideas">{items.map(i => <button type="button" key={i} onClick={() => onPick(i)}>{i}</button>)}</div>;
}

// Мастер в кабинете родителя: большая цель → срок → мини-цели → награды.
function GoalEditor({initial, onSave, onCancel}) {
  const [title, setTitle] = useState(initial?.title || '');
  const [weeks, setWeeks] = useState(initial?.weeks || 9);
  const [reward, setReward] = useState(initial?.reward || '');
  const [remind, setRemind] = useState(initial?.remind || reminderModes[0]);
  const [minis, setMinis] = useState(initial?.minis || []);
  const [own, setOwn] = useState('');
  const has = (t) => minis.some(m => m.title === t);
  const addMini = (t, total = 1) => !has(t) && setMinis(list => [...list, {id: Date.now() + list.length, title: t, total, cur: 0, done: false, reward: ''}]);
  const updMini = (id, patch) => setMinis(list => list.map(m => m.id === id ? {...m, ...patch} : m));
  const ready = title.trim() && reward.trim() && minis.every(m => m.reward.trim());

  return <form className="goal-editor" onSubmit={e => {e.preventDefault(); if (ready) onSave({title: title.trim(), weeks, reward: reward.trim(), remind, minis, week: initial?.week || 0, done: false});}}>
    <div className="ge-step">
      <span className="ge-num">1</span>
      <div><b>Большая цель-желание</b>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Своя цель или выберите ниже" aria-label="Большая цель"/>
        <Chips items={bigGoalIdeas} onPick={setTitle}/>
        <label className="ge-inline">Срок пути:
          <select value={weeks} onChange={e => setWeeks(+e.target.value)}>{durations.map(d => <option key={d.weeks} value={d.weeks}>{d.title}</option>)}</select>
        </label>
      </div>
    </div>

    <div className="ge-step">
      <span className="ge-num">2</span>
      <div><b>Мини-цели на пути</b>
        <small>Система предлагает цели, которые может посчитать сама. Можно добавить свою.</small>
        <div className="goal-ideas">{miniIdeas.map(i => <button type="button" key={i.title} className={has(i.title) ? 'on' : ''} disabled={has(i.title)} onClick={() => addMini(i.title, i.total)}>{has(i.title) ? <Check size={13}/> : <Plus size={13}/>} {i.title}</button>)}</div>
        <div className="ge-own">
          <input value={own} onChange={e => setOwn(e.target.value)} placeholder="Своя мини-цель" aria-label="Своя мини-цель"/>
          <button type="button" className="lj-btn ghost" disabled={!own.trim()} onClick={() => {addMini(own.trim()); setOwn('');}}><Plus size={15}/> Добавить</button>
        </div>
      </div>
    </div>

    <div className="ge-step">
      <span className="ge-num">3</span>
      <div><b>Награды — выберите вместе с ребёнком</b>
        <div className="ge-tip">
          <b><Lightbulb size={15}/> Подсказка: как наградам не перебить интерес к учёбе</b>
          <ul>
            <li>Награда — приятный бонус, а не «цена» за оценку. Иначе ребёнок начинает учиться ради подарка, а не ради «я понял».</li>
            <li>Лучше работают мини-цели про старание: занятия, работа над ошибками, «объясни сам», — их ребёнок может выполнить своими силами.</li>
            <li>Впечатления вместе — зоопарк, кино, торт с семьёй — часто ценнее вещей и укрепляют связь.</li>
            <li>Хвалите за усилия и путь: «ты не опускаешь руки», «у тебя получилось разобраться», — даже если большая цель пока не достигнута.</li>
          </ul>
        </div>
        <label className="ge-reward big"><span><Trophy size={16}/> За большую цель</span>
          <input value={reward} onChange={e => setReward(e.target.value)} placeholder="Например: велосипед" aria-label="Награда за большую цель"/>
        </label>
        <Chips items={bigRewardIdeas} onPick={setReward}/>
        {minis.map(m => <div key={m.id} className="ge-mini">
          <div className="ge-mini-top"><span>{m.title}</span><button type="button" aria-label="Убрать мини-цель" onClick={() => setMinis(list => list.filter(x => x.id !== m.id))}><X size={15}/></button></div>
          <input value={m.reward} onChange={e => updMini(m.id, {reward: e.target.value})} placeholder="Награда за мини-цель" aria-label={`Награда: ${m.title}`}/>
          <Chips items={miniRewardIdeas} onPick={r => updMini(m.id, {reward: r})}/>
        </div>)}
      </div>
    </div>

    <label className="ge-inline"><Bell size={15}/> Джул напоминает о цели:
      <select value={remind} onChange={e => setRemind(e.target.value)}>{reminderModes.map(r => <option key={r}>{r}</option>)}</select>
    </label>
    <div className="ge-actions">
      {onCancel && <button type="button" className="lj-btn ghost" onClick={onCancel}>Отмена</button>}
      <button className="lj-btn" disabled={!ready}><Flag size={16}/> Сохранить цель</button>
    </div>
    {!ready && <small className="ge-hint">Нужны большая цель и награды — за неё и за каждую мини-цель.</small>}
  </form>;
}

// Цель в кабинете родителя: просмотр, отметки «достигнуто», редактирование.
export function GoalParent({child, onGoal}) {
  const goal = child.goal;
  const [editing, setEditing] = useState(false);
  if (!goal || editing) return <div className="cab-block goal-block">
    <b><Flag size={16}/> Цель-желание · {child.name}</b>
    {!goal && <small>Большая цель со сроком, мини-цели на пути и награды. Ребёнок увидит цель у себя, а Джул будет мягко напоминать о ней.</small>}
    <GoalEditor initial={goal} onSave={g => {onGoal(child.id, g); setEditing(false);}} onCancel={goal ? () => setEditing(false) : null}/>
  </div>;

  const setMini = (id, done) => onGoal(child.id, {...goal, minis: goal.minis.map(m => m.id === id ? {...m, done, cur: done ? m.total : m.cur} : m)});
  return <div className="cab-block goal-block">
    <div className="goal-head"><b><Flag size={16}/> Цель-желание · {child.name}</b>
      <button className="goal-edit" onClick={() => setEditing(true)}><Pencil size={14}/> Изменить</button></div>
    <div className="goal-summary">
      <h4>{goal.title}</h4>
      <span><Gift size={15}/> {goal.reward}</span>
      <span>Срок: {weeksText(goal.weeks)} · неделя {Math.min(goal.week + 1, goal.weeks)} из {goal.weeks}</span>
      <span><Bell size={15}/> Напоминание: {goal.remind}</span>
    </div>
    <ul className="goal-minis parent">{goal.minis.map(m => <li key={m.id} className={m.done ? 'done' : ''}>
      <div className="gm-title">{m.done ? <Check size={15}/> : <span className="gm-dot"/>}<span>{m.title}</span>{m.total > 1 && !m.done && <em>{m.cur} из {m.total}</em>}</div>
      <small><Gift size={13}/> {m.reward}</small>
      <button className="goal-mark" onClick={() => setMini(m.id, !m.done)}>{m.done ? 'Отменить' : 'Отметить достигнутой'}</button>
    </li>)}</ul>
    <button className={`lj-btn ${goal.done ? 'ghost' : ''} goal-big-mark`} onClick={() => onGoal(child.id, {...goal, done: !goal.done})}>
      {goal.done ? 'Вернуть цель в работу' : <><Trophy size={16}/> Большая цель достигнута</>}
    </button>
    <small>Мини-цели про занятия система отмечает сама. Большую цель — например, оценку в четверти — отмечаете вы: платформа оценок не ставит.</small>
  </div>;
}
