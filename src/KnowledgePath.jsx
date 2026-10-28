import React, {useState} from 'react';
import {Check, Lock, Star, Compass, Play, Flag} from 'lucide-react';
import {Sloth, Monkey} from './Characters.jsx';

// Путь знаний: короткие ежедневные уроки по программе класса, как в Duolingo.
// Путь ведёт Джул, уроки — герои. Демо: карта темы «Сложение и вычитание до 100».

const lessons = [
  {title: 'Числа до 100', teacher: 'Ленивец', minutes: 7, state: 'done'},
  {title: 'Десятки и единицы', teacher: 'Обезьянка', minutes: 8, state: 'done'},
  {title: 'Сложение без перехода', teacher: 'Обезьянка', minutes: 10, state: 'done'},
  {title: 'Сложение с переходом через десяток', teacher: 'Обезьянка', minutes: 10, state: 'current'},
  {title: 'Вычитание с переходом', teacher: 'Ленивец', minutes: 10, state: 'locked'},
  {title: 'Скобки и порядок действий', teacher: 'Ленивец', minutes: 8, state: 'locked'},
  {title: 'Задачи в два действия', teacher: 'Обезьянка', minutes: 12, state: 'locked'},
  {title: 'Подготовка к контрольной', teacher: 'Джул', minutes: 15, state: 'locked', final: true},
];

const offsets = [0, 70, 110, 70, 0, -70, -110, -70];
const week = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const doneDays = [0, 1, 3];

export default function KnowledgePath() {
  const [selected, setSelected] = useState(3);
  const [note, setNote] = useState(false);
  const lesson = lessons[selected];

  return <div className="path">
    <div className="path-head">
      <div className="path-jool"><Compass size={26}/></div>
      <div><b>Джул</b><p>Привет! Мы на острове «Сложение и вычитание до 100». Сегодня — новый урок с Обезьянкой, всего 10 минут.</p></div>
    </div>
    <div className="path-week" aria-label="Занятия на этой неделе">
      <span>На этой неделе:</span>
      {week.map((d, i) => <i key={d} className={doneDays.includes(i) ? 'on' : ''} title={d}>{d}</i>)}
      <em>цель — 4 занятия</em>
    </div>
    <div className="path-map">
      {lessons.map((l, i) => {
        const Icon = l.final ? Flag : l.state === 'done' ? Check : l.state === 'current' ? Star : Lock;
        return <div key={l.title} className="path-row" style={{'--x': `${offsets[i]}px`}}>
          <button className={`node ${l.state} ${selected === i ? 'sel' : ''} ${l.final ? 'final' : ''}`} onClick={() => {setSelected(i); setNote(false);}} aria-label={l.title}>
            <Icon size={l.state === 'current' ? 30 : 24} fill={l.state === 'current' ? 'currentColor' : 'none'}/>
          </button>
          {l.state === 'current' && <span className="node-flag">Сегодня</span>}
        </div>;
      })}
      <Monkey className="path-buddy b1"/>
      <Sloth className="path-buddy b2"/>
    </div>
    <div className={`path-panel ${lesson.state}`}>
      <div>
        <b>{lesson.title}</b>
        <span>{lesson.state === 'locked' ? 'Откроется после предыдущего урока' : `Урок ведёт ${lesson.teacher} · ${lesson.minutes} минут`}</span>
      </div>
      {lesson.state === 'current' && <button className="lj-btn small" onClick={() => setNote(true)}><Play size={16}/> Начать</button>}
      {lesson.state === 'done' && <span className="done-tag"><Check size={16}/> Пройдено</span>}
      {lesson.state === 'locked' && <Lock size={20}/>}
    </div>
    {note && <p className="path-note">В демо уроки пути пока не открываются. Загляните в «Подготовку к контрольной» — там уже есть карточки и тест.</p>}
    <small className="tutor-note">Демонстрация · карта темы для 2 класса</small>
  </div>;
}
