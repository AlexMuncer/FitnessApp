/* ============================================================
   LOCAL STORAGE LAYER
   Single JSON blob under one key. Everything the user does
   (completions, logged weights, spin bookings, notes, moved
   sessions) lives here and survives closing the browser/PWA.
   ============================================================ */

const STORAGE_KEY = "fitnessapp_state_v1";

function defaultState() {
  return {
    logs: {},        // dateISO -> { status: 'completed'|'skipped'|'in_progress', exercises: {exId: {sets:[{weight,reps}], done}}, currentIndex, completedAt }
    spinBooked: {},   // dateISO -> true
    notes: {},        // dateISO -> string
    moves: {},         // dateISO (source) -> targetDateISO
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return { ...defaultState(), ...parsed };
  } catch (e) {
    console.warn("Failed to load saved progress, starting fresh.", e);
    return defaultState();
  }
}

let _state = loadState();

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(_state));
  } catch (e) {
    console.warn("Failed to save progress — your browser storage may be full or blocked.", e);
  }
}

function getState() {
  return _state;
}

/* ---------------- workout logging ---------------- */

function getLog(dateISO) {
  return _state.logs[dateISO] || null;
}

function ensureLog(dateISO) {
  if (!_state.logs[dateISO]) {
    _state.logs[dateISO] = { status: "in_progress", exercises: {}, completedAt: null };
  }
  return _state.logs[dateISO];
}

/** Reads back the per-set weight/reps for an exercise, padded/truncated to numSets rows.
    Also understands the legacy single {weight,reps} shape so older saved sessions still display. */
function getExerciseSets(dateISO, exerciseId, numSets) {
  const log = getLog(dateISO);
  const ex = log && log.exercises[exerciseId];
  const sets = [];
  for (let i = 0; i < numSets; i++) {
    if (ex && Array.isArray(ex.sets) && ex.sets[i]) {
      sets.push({ weight: ex.sets[i].weight || "", reps: ex.sets[i].reps || "" });
    } else if (i === 0 && ex && !Array.isArray(ex.sets) && (ex.weight || ex.reps)) {
      sets.push({ weight: ex.weight || "", reps: ex.reps || "" });
    } else {
      sets.push({ weight: "", reps: "" });
    }
  }
  return sets;
}

function setExerciseSets(dateISO, exerciseId, sets, done) {
  const log = ensureLog(dateISO);
  const prevDone = log.exercises[exerciseId] ? !!log.exercises[exerciseId].done : false;
  log.exercises[exerciseId] = { sets, done: typeof done === "boolean" ? done : prevDone };
  saveState();
  return log;
}

function setWorkoutCurrentIndex(dateISO, index) {
  const log = ensureLog(dateISO);
  log.currentIndex = index;
  saveState();
}

function markWorkoutCompleted(dateISO) {
  const log = ensureLog(dateISO);
  log.status = "completed";
  log.completedAt = new Date().toISOString();
  saveState();
  return log;
}

function markWorkoutSkipped(dateISO) {
  const log = ensureLog(dateISO);
  log.status = "skipped";
  saveState();
  return log;
}

function isWorkoutCompleted(dateISO) {
  const log = getLog(dateISO);
  return !!log && log.status === "completed";
}

function isWorkoutSkipped(dateISO) {
  const log = getLog(dateISO);
  return !!log && log.status === "skipped";
}

/* ---------------- spin booking ---------------- */

function isSpinBooked(dateISO) {
  return !!_state.spinBooked[dateISO];
}

function setSpinBooked(dateISO, booked) {
  if (booked) {
    _state.spinBooked[dateISO] = true;
  } else {
    delete _state.spinBooked[dateISO];
  }
  saveState();
}

/* ---------------- notes ---------------- */

function getNote(dateISO) {
  return _state.notes[dateISO] || "";
}

function setNote(dateISO, text) {
  if (text && text.trim()) {
    _state.notes[dateISO] = text.trim();
  } else {
    delete _state.notes[dateISO];
  }
  saveState();
}

/* ---------------- moving sessions ----------------
   Only allows moving a trainable session (strength/spin) onto a
   currently free day (rest/optional_cardio) within the SAME
   programme week, and never onto/from a holiday day — this keeps
   the schedule realistic instead of letting sessions stack up.
------------------------------------------------------------- */

function canMoveSession(fromDay, toDay) {
  if (!fromDay || !toDay) return false;
  if (fromDay.weekNumber !== toDay.weekNumber) return false;
  if (fromDay.type === "holiday" || toDay.type === "holiday") return false;
  if (!["strength", "spin"].includes(getEffectiveType(fromDay))) return false;
  if (!["rest", "optional_cardio"].includes(getEffectiveType(toDay))) return false;
  return true;
}

function moveSession(fromISO, toISO) {
  _state.moves[fromISO] = toISO;
  saveState();
}

function clearMove(fromISO) {
  delete _state.moves[fromISO];
  saveState();
}

function getMoveTarget(fromISO) {
  return _state.moves[fromISO] || null;
}

function getMoveSourceFor(dateISO) {
  return Object.keys(_state.moves).find((src) => _state.moves[src] === dateISO) || null;
}

/** Returns the day type after accounting for a move, without needing the full day list. */
function getEffectiveType(day) {
  if (_state.moves[day.date]) return "rest"; // moved away
  return day.type;
}

/* ---------------- progress helpers ---------------- */

function getExerciseHistory(exerciseId) {
  const rows = [];
  for (const [dateISO, log] of Object.entries(_state.logs)) {
    const ex = log.exercises[exerciseId];
    if (!ex) continue;
    let sets = [];
    if (Array.isArray(ex.sets)) {
      sets = ex.sets;
    } else if (ex.weight || ex.reps) {
      sets = [{ weight: ex.weight || "", reps: ex.reps || "" }];
    }
    if (sets.some((s) => s.weight || s.reps)) {
      rows.push({ date: dateISO, sets, done: !!ex.done });
    }
  }
  return rows.sort((a, b) => a.date.localeCompare(b.date));
}

function resetAllProgress() {
  _state = defaultState();
  saveState();
}
