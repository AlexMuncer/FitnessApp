/* ============================================================
   APP — view state, rendering, interactions
   ============================================================ */

const state = {
  view: "plan",
  selectedWeek: null,
  progressWeek: null,
  sheet: null, // {type:'note'|'move'|'actions', day}
};

function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

function formatShortDate(day) {
  return `${day.dayName} ${day.dayNum} ${day.monthShort}`;
}

function getActualCurrentWeekNumber() {
  const today = getTodayISO();
  if (today < PROGRAMME_META.start) return 1;
  if (today > PROGRAMME_META.end) return 8;
  const d = getDayByDate(today);
  return d ? d.weekNumber : 1;
}

function weekLabel(weekNumber) {
  const actual = getActualCurrentWeekNumber();
  if (weekNumber === actual) return "This Week";
  if (weekNumber === actual + 1) return "Next Week";
  return `Week ${weekNumber}`;
}

/* ---------------- effective day (moves overlay) ---------------- */

function getEffectiveWeekDays(weekNumber) {
  const days = getWeekDays(weekNumber);
  const st = getState();
  return days.map((day) => {
    const moveTarget = st.moves[day.date];
    if (moveTarget) {
      const targetDay = days.find((d) => d.date === moveTarget);
      return {
        ...day,
        displayType: "rest",
        movedAwayNote: targetDay ? `Moved to ${formatShortDate(targetDay)}` : null,
      };
    }
    const movedSource = days.find((d) => st.moves[d.date] === day.date);
    if (movedSource) {
      return {
        ...day,
        displayType: movedSource.type,
        sessionId: movedSource.sessionId,
        spinId: movedSource.spinId,
        movedInNote: `Moved from ${formatShortDate(movedSource)}`,
      };
    }
    return { ...day, displayType: day.type };
  });
}

/* ---------------- spin booking reminder ---------------- */

function getSpinReminder() {
  const today = getTodayISO();
  const todayDay = getDayByDate(today);
  if (!todayDay || (todayDay.dayName !== "Tue" && todayDay.dayName !== "Thu")) return null;

  for (let i = 1; i <= 7; i++) {
    const future = PROGRAMME_DAYS.find((d) => {
      const diffDays = (parseISODate(d.date) - parseISODate(today)) / 86400000;
      return Math.round(diffDays) === i;
    });
    if (!future) continue;
    const eff = getEffectiveWeekDays(future.weekNumber).find((d) => d.date === future.date);
    if (eff.displayType === "spin" && !isSpinBooked(eff.date)) {
      return eff;
    }
  }
  return null;
}

/* ---------------- render: PLAN VIEW ---------------- */

function renderPlanView(root) {
  const actualWeek = getActualCurrentWeekNumber();
  if (!state.selectedWeek) state.selectedWeek = actualWeek;

  const wrap = el(`<div></div>`);

  // Week selector
  const selector = el(`<div class="week-selector"></div>`);
  for (let w = 1; w <= 8; w++) {
    const pill = el(`<button class="week-pill ${w === state.selectedWeek ? "active" : ""}">${weekLabel(w)}</button>`);
    pill.addEventListener("click", () => {
      state.selectedWeek = w;
      render();
    });
    selector.appendChild(pill);
  }
  wrap.appendChild(selector);

  // Reminder banner
  const reminder = getSpinReminder();
  if (reminder) {
    const rLabel = weekLabel(reminder.weekNumber);
    const banner = el(`
      <div class="reminder-banner">
        <div class="reminder-icon">🔔</div>
        <div class="reminder-text">
          <b>BOOK SPIN</b>
          Don't forget to book ${formatShortDate(reminder)}'s class (${rLabel}).
        </div>
        <button>Booked ✓</button>
      </div>
    `);
    banner.querySelector("button").addEventListener("click", () => {
      setSpinBooked(reminder.date, true);
      toast("Marked as booked");
      render();
    });
    wrap.appendChild(banner);
  }

  // Phase banner for selected week
  const template = WEEK_TEMPLATES[state.selectedWeek - 1];
  wrap.appendChild(el(`<div class="phase-banner"><b>${template.phase}.</b> ${template.coachNote}</div>`));

  const days = getEffectiveWeekDays(state.selectedWeek);
  const today = getTodayISO();
  const isViewingCurrentWeek = state.selectedWeek === actualWeek;

  if (isViewingCurrentWeek) {
    const todayObj = days.find((d) => d.date === today);
    if (todayObj) {
      const heroWrap = el(`<div class="today-hero"><div class="today-hero-label">Today</div></div>`);
      heroWrap.appendChild(renderDayCard(todayObj, true));
      wrap.appendChild(heroWrap);
      wrap.appendChild(el(`<div class="section-title">This Week</div>`));
    }
  }

  const list = el(`<div class="day-list"></div>`);
  days.forEach((day) => {
    if (isViewingCurrentWeek && day.date === today) return; // already shown in hero
    list.appendChild(renderDayCard(day, false));
  });
  wrap.appendChild(list);

  root.appendChild(wrap);
}

function dayVisuals(displayType) {
  switch (displayType) {
    case "strength": return { emoji: "💪" };
    case "spin": return { emoji: "🚴" };
    case "walk": return { emoji: "🌳" };
    case "optional_cardio": return { emoji: "🚶" };
    case "holiday": return { emoji: "✈️" };
    default: return { emoji: "😴" };
  }
}

function renderDayCard(day, isHero) {
  const today = getTodayISO();
  const isToday = day.date === today;
  const isPast = day.date < today;
  const displayType = day.displayType || day.type;
  const { emoji } = dayVisuals(displayType);

  const card = el(`<div class="day-card ${isToday ? "is-today" : ""} ${displayType === "holiday" ? "is-holiday" : ""}"></div>`);

  const head = el(`<div class="day-card-head"></div>`);
  const dateEl = el(`<div class="day-card-date">${day.dayName} ${day.dayNum} ${day.monthShort}${isToday ? '<span class="today-chip">Today</span>' : ""}</div>`);
  head.appendChild(dateEl);

  // status chip
  if (displayType === "strength" || displayType === "spin") {
    if (isWorkoutCompleted(day.date) || (displayType === "spin" && isSpinBooked(day.date) && isPast)) {
      head.appendChild(el(`<span class="status-chip done">Done ✓</span>`));
    } else if (isWorkoutSkipped(day.date)) {
      head.appendChild(el(`<span class="status-chip skipped">Skipped</span>`));
    } else if (displayType === "spin" && isSpinBooked(day.date) && !isPast) {
      head.appendChild(el(`<span class="status-chip booked">Booked ✓</span>`));
    }
  }
  card.appendChild(head);

  const body = el(`<div class="day-card-body"></div>`);
  body.appendChild(el(`<div class="day-card-emoji">${emoji}</div>`));
  const info = el(`<div class="day-card-info"></div>`);

  if (displayType === "strength") {
    const session = STRENGTH_SESSIONS[day.sessionId];
    info.appendChild(el(`<p class="day-card-title">${session.label}</p>`));
    info.appendChild(el(`<div class="day-card-meta">${session.exercises.length} exercises · ~40–50 min</div>`));
  } else if (displayType === "spin") {
    const spin = SPIN_SESSIONS[day.spinId] || SPIN_SESSIONS.normal;
    info.appendChild(el(`<p class="day-card-title">${spin.label}</p>`));
    info.appendChild(el(`<div class="day-card-meta">${spin.duration} · ${spin.guidance}</div>`));
  } else if (displayType === "walk") {
    info.appendChild(el(`<p class="day-card-title">Walk</p>`));
    info.appendChild(el(`<div class="day-card-meta">${day.note || ""}</div>`));
  } else if (displayType === "optional_cardio") {
    info.appendChild(el(`<p class="day-card-title">Optional Activity</p>`));
    info.appendChild(el(`<div class="day-card-meta">${day.note || "Totally optional — only if you feel like it."}</div>`));
  } else if (displayType === "holiday") {
    info.appendChild(el(`<p class="day-card-title">Away</p>`));
    info.appendChild(el(`<div class="day-card-meta">${day.note || "No training scheduled."}</div>`));
  } else {
    info.appendChild(el(`<p class="day-card-title">Rest / Recovery</p>`));
    info.appendChild(el(`<div class="day-card-meta">${day.note || "Nothing scheduled — recover."}</div>`));
  }
  body.appendChild(info);

  if (displayType !== "holiday") {
    const menuBtn = el(`<button class="day-card-menu-btn">⋯</button>`);
    menuBtn.addEventListener("click", () => openActionsSheet(day, displayType));
    body.appendChild(menuBtn);
  }

  card.appendChild(body);

  // notes
  const existingNote = getNote(day.date);
  if (existingNote) card.appendChild(el(`<div class="day-card-note">📝 ${existingNote}</div>`));
  if (day.movedAwayNote) card.appendChild(el(`<div class="day-card-note">↔️ ${day.movedAwayNote}</div>`));
  if (day.movedInNote) card.appendChild(el(`<div class="day-card-note">↔️ ${day.movedInNote}</div>`));

  // actions
  if (displayType === "strength") {
    const actions = el(`<div class="day-card-actions"></div>`);
    const log = getLog(day.date);
    let label = "Start Workout";
    let cls = "btn-primary";
    if (log && log.status === "completed") { label = "Completed ✓"; cls = "btn-done"; }
    else if (log && log.status === "in_progress") { label = "Continue Workout"; }
    const btn = el(`<button class="btn ${cls}">${label}</button>`);
    btn.addEventListener("click", () => openWorkout(day.date));
    actions.appendChild(btn);
    card.appendChild(actions);
  } else if (displayType === "spin") {
    const actions = el(`<div class="day-card-actions"></div>`);
    const booked = isSpinBooked(day.date);
    const label = isPast ? (booked ? "Attended ✓" : "Mark Attended") : (booked ? "Booked ✓" : "Book Class");
    const btn = el(`<button class="btn ${booked ? "btn-done" : "btn-primary"}">${label}</button>`);
    btn.addEventListener("click", () => {
      setSpinBooked(day.date, !booked);
      render();
    });
    actions.appendChild(btn);
    card.appendChild(actions);
  }

  return card;
}

/* ---------------- action sheet (move / skip / note) ---------------- */

function openActionsSheet(day, displayType) {
  const items = [];
  items.push({ label: "📝 Add / Edit Note", action: () => openNoteSheet(day) });

  if (displayType === "strength" || displayType === "spin") {
    const candidates = getWeekDays(day.weekNumber).filter((d) => {
      if (d.date === day.date) return false;
      if (d.type !== "rest" && d.type !== "optional_cardio") return false;
      const st = getState();
      if (st.moves[d.date]) return false;
      if (Object.values(st.moves).includes(d.date)) return false;
      return true;
    });
    if (candidates.length > 0 && !getState().moves[day.date]) {
      items.push({ label: "↔️ Move This Session", action: () => openMoveSheet(day, candidates) });
    }
    if (getState().moves[day.date]) {
      items.push({ label: "↩️ Undo Move", action: () => { clearMove(day.date); toast("Move undone"); render(); } });
    }
    const skipped = isWorkoutSkipped(day.date);
    items.push({
      label: skipped ? "↩️ Undo Skip" : "⏭ Mark as Skipped",
      action: () => {
        if (skipped) { getLog(day.date).status = "in_progress"; saveState(); }
        else markWorkoutSkipped(day.date);
        toast(skipped ? "Skip undone" : "Marked as skipped");
        render();
      },
    });
  }

  const backdrop = el(`<div class="sheet-backdrop"></div>`);
  const sheet = el(`<div class="sheet"><h3>${formatShortDate(day)}</h3><div class="sheet-move-list"></div></div>`);
  const list = sheet.querySelector(".sheet-move-list");
  items.forEach((item) => {
    const b = el(`<button class="sheet-move-option">${item.label}</button>`);
    b.addEventListener("click", () => { closeSheet(); item.action(); });
    list.appendChild(b);
  });
  const cancel = el(`<button class="btn btn-ghost" style="width:100%;margin-top:4px;">Cancel</button>`);
  cancel.addEventListener("click", closeSheet);
  sheet.appendChild(cancel);

  backdrop.appendChild(sheet);
  backdrop.addEventListener("click", (e) => { if (e.target === backdrop) closeSheet(); });
  document.body.appendChild(backdrop);
  state.sheet = backdrop;
}

function openMoveSheet(day, candidates) {
  const backdrop = el(`<div class="sheet-backdrop"></div>`);
  const sheet = el(`<div class="sheet"><h3>Move ${formatShortDate(day)} to…</h3><div class="sheet-move-list"></div></div>`);
  const list = sheet.querySelector(".sheet-move-list");
  candidates.forEach((c) => {
    const b = el(`<button class="sheet-move-option">${formatShortDate(c)}</button>`);
    b.addEventListener("click", () => {
      moveSession(day.date, c.date);
      closeSheet();
      toast(`Moved to ${formatShortDate(c)}`);
      render();
    });
    list.appendChild(b);
  });
  const cancel = el(`<button class="btn btn-ghost" style="width:100%;margin-top:4px;">Cancel</button>`);
  cancel.addEventListener("click", closeSheet);
  sheet.appendChild(cancel);
  backdrop.appendChild(sheet);
  backdrop.addEventListener("click", (e) => { if (e.target === backdrop) closeSheet(); });
  document.body.appendChild(backdrop);
  state.sheet = backdrop;
}

function openNoteSheet(day) {
  const backdrop = el(`<div class="sheet-backdrop"></div>`);
  const sheet = el(`
    <div class="sheet">
      <h3>Note — ${formatShortDate(day)}</h3>
      <textarea placeholder="e.g. felt tired, knee twinged on lunges…">${getNote(day.date)}</textarea>
      <div class="sheet-actions">
        <button class="btn btn-ghost" style="flex:1;">Cancel</button>
        <button class="btn btn-primary" style="flex:1;">Save</button>
      </div>
    </div>
  `);
  const textarea = sheet.querySelector("textarea");
  sheet.querySelectorAll("button")[0].addEventListener("click", closeSheet);
  sheet.querySelectorAll("button")[1].addEventListener("click", () => {
    setNote(day.date, textarea.value);
    closeSheet();
    toast("Note saved");
    render();
  });
  backdrop.appendChild(sheet);
  backdrop.addEventListener("click", (e) => { if (e.target === backdrop) closeSheet(); });
  document.body.appendChild(backdrop);
  state.sheet = backdrop;
}

function closeSheet() {
  if (state.sheet) { state.sheet.remove(); state.sheet = null; }
}

/* ---------------- WORKOUT MODE ---------------- */

let workoutState = null;

function openWorkout(dateISO) {
  const day = getDayByDate(dateISO);
  const eff = getEffectiveWeekDays(day.weekNumber).find((d) => d.date === dateISO);
  const session = STRENGTH_SESSIONS[eff.sessionId];
  const log = getLog(dateISO);
  let index = 0;
  if (log && log.status === "in_progress" && typeof log.currentIndex === "number") {
    index = Math.max(0, Math.min(log.currentIndex, session.exercises.length - 1));
  }
  workoutState = { dateISO, session, index, finished: false };
  renderWorkout();
}

/** Reads the currently-visible per-set inputs off the DOM for the exercise on screen. */
function captureCurrentExerciseInputs() {
  const { session, index } = workoutState;
  const ex = session.exercises[index];
  const sets = [];
  for (let s = 0; s < ex.sets; s++) {
    const w = document.getElementById(`log-weight-${s}`);
    const r = document.getElementById(`log-reps-${s}`);
    sets.push({ weight: w ? w.value : "", reps: r ? r.value : "" });
  }
  return { ex, sets };
}

function closeWorkout() {
  if (workoutState && !workoutState.finished) {
    const { ex, sets } = captureCurrentExerciseInputs();
    setExerciseSets(workoutState.dateISO, ex.id, sets);
    setWorkoutCurrentIndex(workoutState.dateISO, workoutState.index);
  }
  workoutState = null;
  document.getElementById("workout-overlay").classList.add("hidden");
  render();
}

function renderWorkout() {
  const overlay = document.getElementById("workout-overlay");
  overlay.classList.remove("hidden");
  overlay.innerHTML = "";

  if (workoutState.finished) {
    renderWorkoutComplete(overlay);
    return;
  }

  const { session, index, dateISO } = workoutState;
  const total = session.exercises.length;
  const ex = session.exercises[index];
  const existingSets = getExerciseSets(dateISO, ex.id, ex.sets);

  const header = el(`
    <div class="workout-header">
      <button class="workout-close">✕</button>
      <span class="workout-progress-label">Exercise ${index + 1} of ${total}</span>
      <span style="width:36px"></span>
    </div>
  `);
  header.querySelector(".workout-close").addEventListener("click", closeWorkout);
  overlay.appendChild(header);

  const barWrap = el(`<div class="workout-progress-bar"><div class="workout-progress-fill" style="width:${((index + 1) / total) * 100}%"></div></div>`);
  overlay.appendChild(barWrap);

  const body = el(`<div class="workout-body"></div>`);

  if (index === 0) {
    body.appendChild(el(`<div class="phase-banner">${session.phaseNote}</div>`));
    const warm = el(`<div class="workout-block"><div class="workout-block-title">Warm-up</div><ul class="workout-cue-list"></ul></div>`);
    session.warmup.forEach((w) => warm.querySelector("ul").appendChild(el(`<li>${w}</li>`)));
    body.appendChild(warm);
  }

  body.appendChild(el(`<h2 class="workout-exercise-name">${ex.name}</h2>`));
  body.appendChild(el(`<div class="workout-exercise-muscles">${ex.muscles}</div>`));

  const specRow = el(`<div class="workout-spec-row"></div>`);
  specRow.appendChild(el(`<div class="workout-spec"><div class="workout-spec-value">${ex.sets}</div><div class="workout-spec-label">Sets</div></div>`));
  specRow.appendChild(el(`<div class="workout-spec"><div class="workout-spec-value">${ex.reps}</div><div class="workout-spec-label">Reps</div></div>`));
  specRow.appendChild(el(`<div class="workout-spec"><div class="workout-spec-value">${ex.rpe}</div><div class="workout-spec-label">RPE</div></div>`));
  specRow.appendChild(el(`<div class="workout-spec"><div class="workout-spec-value">${ex.rest}</div><div class="workout-spec-label">Rest</div></div>`));
  if (ex.tempo) specRow.appendChild(el(`<div class="workout-spec"><div class="workout-spec-value">${ex.tempo.split(" ")[0]}</div><div class="workout-spec-label">Tempo</div></div>`));
  body.appendChild(specRow);

  const cueBlock = el(`<div class="workout-block"><div class="workout-block-title">How To</div><ul class="workout-cue-list"></ul></div>`);
  ex.cues.forEach((c) => cueBlock.querySelector("ul").appendChild(el(`<li>${c}</li>`)));
  body.appendChild(cueBlock);

  const altBox = el(`
    <div class="workout-alt-box">
      <div class="workout-alt-title">Can't do this? Try instead</div>
      <div class="workout-alt-name">${ex.alt.name}</div>
      <ul class="workout-cue-list"></ul>
    </div>
  `);
  ex.alt.cues.forEach((c) => altBox.querySelector("ul").appendChild(el(`<li>${c}</li>`)));
  body.appendChild(altBox);

  const logForm = el(`<div class="log-form-sets"></div>`);
  for (let s = 0; s < ex.sets; s++) {
    const setRow = el(`
      <div class="log-set-row">
        <span class="log-set-label">Set ${s + 1}</span>
        <div class="log-field"><label>Weight (kg)</label><input type="number" inputmode="decimal" id="log-weight-${s}" value="${existingSets[s].weight}" placeholder="e.g. 14" /></div>
        <div class="log-field"><label>Reps done</label><input type="number" inputmode="numeric" id="log-reps-${s}" value="${existingSets[s].reps}" placeholder="e.g. 10" /></div>
      </div>
    `);
    logForm.appendChild(setRow);
  }
  body.appendChild(logForm);

  if (index === total - 1) {
    const cool = el(`<div class="workout-block"><div class="workout-block-title">Cool-down (after this exercise)</div><ul class="workout-cue-list"></ul></div>`);
    session.cooldown.forEach((c) => cool.querySelector("ul").appendChild(el(`<li>${c}</li>`)));
    body.appendChild(cool);
  }

  overlay.appendChild(body);

  const footer = el(`<div class="workout-footer"></div>`);
  if (index > 0) {
    const back = el(`<button class="btn btn-ghost">Back</button>`);
    back.addEventListener("click", () => {
      const { ex: curEx, sets } = captureCurrentExerciseInputs();
      setExerciseSets(dateISO, curEx.id, sets);
      workoutState.index--;
      setWorkoutCurrentIndex(dateISO, workoutState.index);
      renderWorkout();
    });
    footer.appendChild(back);
  }
  const nextLabel = index === total - 1 ? "Completed ✓ — Finish" : "Completed ✓ — Next";
  const next = el(`<button class="btn btn-primary" style="flex:1;">${nextLabel}</button>`);
  next.addEventListener("click", () => {
    const { ex: curEx, sets } = captureCurrentExerciseInputs();
    setExerciseSets(dateISO, curEx.id, sets, true);
    if (index === total - 1) {
      workoutState.finished = true;
    } else {
      workoutState.index++;
      setWorkoutCurrentIndex(dateISO, workoutState.index);
    }
    renderWorkout();
  });
  footer.appendChild(next);
  overlay.appendChild(footer);
}

function renderWorkoutComplete(overlay) {
  const header = el(`
    <div class="workout-header">
      <button class="workout-close">✕</button>
      <span class="workout-progress-label">Workout Complete</span>
      <span style="width:36px"></span>
    </div>
  `);
  header.querySelector(".workout-close").addEventListener("click", closeWorkout);
  overlay.appendChild(header);

  const screen = el(`
    <div class="workout-complete-screen">
      <div class="workout-complete-emoji">🎉</div>
      <h2 class="workout-complete-title">Workout complete</h2>
      <p class="workout-complete-sub">Nice work. Logged and saved — you'll see it reflected in Progress.</p>
    </div>
  `);
  const btn = el(`<button class="btn btn-primary" style="width:100%;">Back to Plan</button>`);
  btn.addEventListener("click", () => {
    markWorkoutCompleted(workoutState.dateISO);
    toast("Workout saved 🎉");
    closeWorkout();
  });
  screen.appendChild(btn);
  overlay.appendChild(screen);
}

/* ---------------- PROGRESS VIEW ---------------- */

function getExerciseNameMap() {
  const map = {};
  Object.values(STRENGTH_SESSIONS).forEach((s) => {
    s.exercises.forEach((ex) => { if (!map[ex.id]) map[ex.id] = ex.name; });
  });
  return map;
}

function renderProgressView(root) {
  // Count sessions in every week up to and including the current programme week
  // (not just calendar days already in the past) — a week's sessions all count
  // toward the total as soon as that week has started, whether or not each one
  // has been done yet, so early completions and the current week's tally don't
  // get hidden just because "today" hasn't caught up with them.
  const actualWeek = getActualCurrentWeekNumber();

  let strengthTotal = 0, strengthDone = 0, spinTotal = 0, spinDone = 0;
  const weekStats = {};

  for (let w = 1; w <= 8; w++) {
    let total = 0, done = 0;
    if (w <= actualWeek) {
      getEffectiveWeekDays(w).forEach((d) => {
        if (d.displayType === "strength") {
          strengthTotal++; total++;
          if (isWorkoutCompleted(d.date)) { strengthDone++; done++; }
        } else if (d.displayType === "spin") {
          spinTotal++; total++;
          if (isSpinBooked(d.date)) { spinDone++; done++; }
        }
      });
    }
    weekStats[w] = { total, done };
  }

  const totalSessions = strengthTotal + spinTotal;
  const totalDone = strengthDone + spinDone;
  const consistency = totalSessions ? Math.round((totalDone / totalSessions) * 100) : 0;

  const wrap = el(`<div></div>`);
  wrap.appendChild(el(`<div class="section-title">Overview</div>`));

  const grid = el(`<div class="stat-grid"></div>`);
  grid.appendChild(el(`<div class="stat-card"><div class="stat-value">${strengthDone}/${strengthTotal}</div><div class="stat-label">Strength Sessions</div></div>`));
  grid.appendChild(el(`<div class="stat-card"><div class="stat-value">${spinDone}/${spinTotal}</div><div class="stat-label">Spin / Cardio</div></div>`));
  grid.appendChild(el(`<div class="stat-card"><div class="stat-value">${totalDone}/${totalSessions}</div><div class="stat-label">Total Completed</div></div>`));
  grid.appendChild(el(`<div class="stat-card" title="Sessions completed ÷ sessions scheduled so far, this programme"><div class="stat-value">${consistency}%</div><div class="stat-label">Consistency</div></div>`));
  wrap.appendChild(grid);

  wrap.appendChild(el(`<div class="section-title">Weekly Completion</div>`));
  const weekRow = el(`<div class="week-progress-row"></div>`);
  for (let w = 1; w <= 8; w++) {
    const ws = weekStats[w];
    let cls = "";
    if (ws.total > 0 && ws.done === ws.total) cls = "complete";
    else if (ws.done > 0) cls = "partial";
    weekRow.appendChild(el(`<div class="week-progress-dot ${cls}">W${w}</div>`));
  }
  wrap.appendChild(weekRow);

  wrap.appendChild(el(`<div class="section-title">Strength Progression</div>`));

  if (!state.progressWeek) state.progressWeek = actualWeek;
  const weekTabs = el(`<div class="week-selector"></div>`);
  for (let w = 1; w <= 8; w++) {
    const pill = el(`<button class="week-pill ${w === state.progressWeek ? "active" : ""}">W${w}</button>`);
    pill.addEventListener("click", () => {
      state.progressWeek = w;
      render();
    });
    weekTabs.appendChild(pill);
  }
  wrap.appendChild(weekTabs);

  const nameMap = getExerciseNameMap();
  const weekDates = new Set(getEffectiveWeekDays(state.progressWeek).map((d) => d.date));
  const idsWithHistory = Object.keys(nameMap).filter((id) =>
    getExerciseHistory(id).some((h) => weekDates.has(h.date))
  );

  if (idsWithHistory.length === 0) {
    wrap.appendChild(el(`<div class="empty-state">No strength data logged for Week ${state.progressWeek} yet — complete a session that week and your logged sets will show up here.</div>`));
  } else {
    idsWithHistory.forEach((id) => {
      const history = getExerciseHistory(id).filter((h) => weekDates.has(h.date));
      const card = el(`<div class="exercise-history-card"><div class="exercise-history-name">${nameMap[id]}</div><div class="exercise-history-list"></div></div>`);
      const list = card.querySelector(".exercise-history-list");
      history.forEach((h) => {
        const d = getDayByDate(h.date);
        const label = d ? formatShortDate(d) : h.date;
        const dayRow = el(`<div class="exercise-history-day"><div class="exercise-history-date">${label}</div><div class="exercise-history-sets"></div></div>`);
        const setsWrap = dayRow.querySelector(".exercise-history-sets");
        h.sets.forEach((s, i) => {
          setsWrap.appendChild(el(`<div class="exercise-history-set"><span>Set ${i + 1}</span><b>${s.weight || "–"}kg × ${s.reps || "–"}</b></div>`));
        });
        list.appendChild(dayRow);
      });
      wrap.appendChild(card);
    });
  }

  root.appendChild(wrap);
}

/* ---------------- toast ---------------- */

let toastTimer = null;
function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.remove("hidden");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.add("hidden"), 2200);
}

/* ---------------- root render / nav ---------------- */

function render() {
  const root = document.getElementById("view-root");
  root.innerHTML = "";
  document.querySelectorAll(".nav-btn").forEach((b) => b.classList.toggle("active", b.dataset.view === state.view));
  document.getElementById("header-subtitle").textContent =
    state.view === "plan" ? weekLabel(state.selectedWeek || getActualCurrentWeekNumber()) : "Your progress";

  if (state.view === "plan") renderPlanView(root);
  else renderProgressView(root);
}

document.querySelectorAll(".nav-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    state.view = btn.dataset.view;
    render();
  });
});

render();

/* ---------------- service worker registration ---------------- */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
