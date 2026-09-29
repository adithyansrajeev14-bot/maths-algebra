'use client';

import React, { useState } from 'react';

// Section navigation data
const NAV_ITEMS = [
  { href: '#sys', label: 'Systems AX=B', color: 'var(--t1)' },
  { href: '#cramer', label: "Cramer's rule", color: 'var(--t5)' },
  { href: '#space', label: 'Vector spaces', color: 'var(--t2)' },
  { href: '#lu', label: 'LU', color: 'var(--t3)' },
  { href: '#eig', label: 'Eigen', color: 'var(--t4)' },
  { href: '#quad', label: 'Quadratic forms', color: 'var(--t6)' },
  { href: '#prac', label: 'Practice', color: 'var(--ink)' },
];

const listeners = new Set<() => void>();
function notify() {
  listeners.forEach((l) => l());
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', listener);
  }
  return () => {
    listeners.delete(listener);
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', listener);
    }
  };
}

let cachedDoneRaw: string | null = null;
let cachedDoneObj: Record<string, boolean> = {};
function getDoneSnapshot(): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem('la-done-v1');
    if (raw !== cachedDoneRaw) {
      cachedDoneRaw = raw;
      cachedDoneObj = raw ? JSON.parse(raw) : {};
    }
    return cachedDoneObj;
  } catch {
    return cachedDoneObj;
  }
}
const serverEmptyObj: Record<string, boolean> = {};
function getServerDoneSnapshot(): Record<string, boolean> {
  return serverEmptyObj;
}

let cachedPracRaw: string | null = null;
let cachedPracObj: Record<number, boolean> = {};
function getPracSnapshot(): Record<number, boolean> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem('la-prac-v1');
    if (raw !== cachedPracRaw) {
      cachedPracRaw = raw;
      cachedPracObj = raw ? JSON.parse(raw) : {};
    }
    return cachedPracObj;
  } catch {
    return cachedPracObj;
  }
}
const serverEmptyPracObj: Record<number, boolean> = {};
function getServerPracSnapshot(): Record<number, boolean> {
  return serverEmptyPracObj;
}

function getThemeSnapshot(): 'auto' | 'light' | 'dark' {
  if (typeof window === 'undefined') return 'auto';
  try {
    const raw = localStorage.getItem('la-theme-v1');
    if (raw === 'light' || raw === 'dark' || raw === 'auto') return raw;
  } catch {}
  return 'auto';
}
function getServerThemeSnapshot(): 'auto' | 'light' | 'dark' {
  return 'auto';
}

export default function RevisionSheet() {
  const doneMap = React.useSyncExternalStore(
    subscribe,
    getDoneSnapshot,
    getServerDoneSnapshot
  );
  const practiceDone = React.useSyncExternalStore(
    subscribe,
    getPracSnapshot,
    getServerPracSnapshot
  );
  const theme = React.useSyncExternalStore(
    subscribe,
    getThemeSnapshot,
    getServerThemeSnapshot
  );
  const [allExpanded, setAllExpanded] = useState<boolean | null>(null);

  const toggleTheme = () => {
    const next = theme === 'auto' ? 'dark' : theme === 'dark' ? 'light' : 'auto';
    if (next === 'auto') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', next);
    }
    try {
      localStorage.setItem('la-theme-v1', next);
    } catch {}
    notify();
  };

  const toggleDone = (id: string, e: React.MouseEvent | React.ChangeEvent) => {
    e.stopPropagation();
    const curr = getDoneSnapshot();
    const next = { ...curr };
    if (next[id]) {
      delete next[id];
    } else {
      next[id] = true;
    }
    try {
      localStorage.setItem('la-done-v1', JSON.stringify(next));
    } catch {}
    notify();
  };

  const togglePracticeItem = (idx: number) => {
    const curr = getPracSnapshot();
    const next = { ...curr, [idx]: !curr[idx] };
    try {
      localStorage.setItem('la-prac-v1', JSON.stringify(next));
    } catch {}
    notify();
  };

  const resetAllTicks = () => {
    if (window.confirm('Clear all question ticks and checklist items?')) {
      try {
        localStorage.removeItem('la-done-v1');
        localStorage.removeItem('la-prac-v1');
      } catch {}
      notify();
    }
  };

  const toggleAllAccordions = () => {
    const nextState = !allExpanded;
    setAllExpanded(nextState);
    const details = document.querySelectorAll<HTMLDetailsElement>('details.qa');
    details.forEach((d) => {
      d.open = nextState;
    });
  };

  // Section item counts for real-time section headers
  const sectionQuestions: Record<string, string[]> = {
    sys: [
      'sys-p-1', 'sys-p-2', 'sys-p-3', 'sys-p-4', 'sys-p-5',
      'sys-t-1', 'sys-t-2', 'sys-t-3', 'sys-t-16', 'sys-t-17', 'sys-t-18', 'sys-t-19',
      'sys-t-20', 'sys-t-21', 'sys-t-22', 'sys-t-23', 'sys-t-24', 'sys-t-25', 'sys-t-26', 'sys-t-27', 'sys-t-28'
    ],
    cramer: [
      'cramer-p-1', 'cramer-p-2', 'cramer-p-3', 'cramer-p-4', 'cramer-p-5',
      'cramer-t-29', 'cramer-t-30'
    ],
    space: [
      'space-p-1', 'space-p-2', 'space-p-3', 'space-p-4', 'space-p-5',
      'space-t-4', 'space-t-5', 'space-t-31', 'space-t-32', 'space-t-33', 'space-t-34', 'space-t-35'
    ],
    lu: [
      'lu-p-1', 'lu-p-2', 'lu-p-3', 'lu-p-4', 'lu-p-5',
      'lu-t-29', 'lu-t-33'
    ],
    eig: [
      'eig-p-1', 'eig-p-2', 'eig-p-3', 'eig-p-4', 'eig-p-5',
      'eig-t-1', 'eig-t-2', 'eig-t-3', 'eig-t-16', 'eig-t-17', 'eig-t-18', 'eig-t-19',
      'eig-t-20', 'eig-t-21', 'eig-t-22', 'eig-t-27', 'eig-t-32', 'eig-t-34'
    ],
    quad: [
      'quad-p-1', 'quad-p-2', 'quad-p-3', 'quad-p-4', 'quad-p-5',
      'quad-t-4', 'quad-t-5', 'quad-t-23', 'quad-t-24', 'quad-t-25', 'quad-t-26',
      'quad-t-28', 'quad-t-30', 'quad-t-31', 'quad-t-35'
    ],
  };

  const allQuestionIds = Object.values(sectionQuestions).flat();
  const totalCount = allQuestionIds.length;
  const doneCount = allQuestionIds.filter((id) => doneMap[id]).length;
  const progressPercent = totalCount > 0 ? (doneCount / totalCount) * 100 : 0;

  const renderSectionBadge = (secKey: string) => {
    const ids = sectionQuestions[secKey] || [];
    const secDone = ids.filter((id) => doneMap[id]).length;
    return <span className="sp">{secDone}/{ids.length}</span>;
  };

  const renderDoneCheckbox = (id: string) => {
    const isChecked = !!doneMap[id];
    return (
      <label
        className="done"
        title="Mark as done"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="checkbox"
          checked={isChecked}
          onChange={(e) => toggleDone(id, e)}
          onClick={(e) => e.stopPropagation()}
        />
        <span>Done</span>
      </label>
    );
  };

  return (
    <div className="relative min-h-screen">
      <header>
        <h1>
          Linear Algebra,<br />one page at a time
        </h1>
        <p>
          Everything from your notes: solving systems, vector spaces, LU, eigenvalues and quadratic forms. Read a card, then test yourself at the end of each card: five practice questions plus your tutorial questions, each with a Done tick.
        </p>
        <div id="prog">
          <span id="pt">{doneCount} of {totalCount} done</span>
          <div className="bar">
            <i id="pb" style={{ width: `${progressPercent}%` }}></i>
          </div>
          <button id="rs" type="button" onClick={resetAllTicks}>
            Reset ticks
          </button>
          <button
            type="button"
            className="theme-btn"
            onClick={toggleAllAccordions}
            title="Expand or collapse all answers"
          >
            {allExpanded ? 'Collapse answers' : 'Expand all'}
          </button>
          <button
            type="button"
            className="theme-btn"
            onClick={toggleTheme}
            title="Switch theme"
          >
            Theme: {theme === 'auto' ? 'Auto' : theme === 'dark' ? 'Dark' : 'Light'}
          </button>
        </div>
      </header>

      <nav>
        <div className="nav-inner">
          <div className="nav-links">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="nav-item"
                style={{ ['--c' as string]: item.color }}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <main>
        {/* SECTION 1: SYSTEMS AX = B */}
        <section id="sys" style={{ ['--c' as string]: 'var(--t1)' }}>
          <h2>
            <span>Solving AX = B</span>
            {renderSectionBadge('sys')}
          </h2>
          <p className="tag">Ask two questions: is it consistent, and is the solution unique?</p>
          <div className="grid2">
            <div className="box yes">
              <h4>Homogeneous: AX = 0</h4>
              <p>Always consistent (X = 0 works).</p>
              <p><b>rank A = n</b> → only the trivial solution (unique)</p>
              <p><b>rank A &lt; n</b> → infinitely many solutions</p>
            </div>
            <div className="box">
              <h4>Non-homogeneous: AX = B</h4>
              <p>Consistent only if <b>rank[A|B] = rank A</b>, otherwise inconsistent.</p>
              <p>If consistent: <b>rank A = n</b> → unique; <b>rank A &lt; n</b> → infinitely many.</p>
            </div>
          </div>
          <div className="rem">
            <b>Remember:</b> n = number of unknowns. Reduce [A|B] to echelon form, compare ranks, then back-substitute from the last row up.
          </div>

          <div className="pq">
            <h3>Practice: 5 questions (tap to reveal the answer)</h3>

            <details className={`qa ${doneMap['sys-p-1'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('sys-p-1')}
                <span className="qtx">Test consistency: x + y = 3, x − y = 1, 2x + y = 5.</span>
              </summary>
              <div className="a">
                rank A = rank[A|B] = 2 = n → consistent and unique. <span className="ans">x = 2, y = 1</span>
              </div>
            </details>

            <details className={`qa ${doneMap['sys-p-2'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('sys-p-2')}
                <span className="qtx">Test consistency: x + 2y = 3, 2x + 4y = 7.</span>
              </summary>
              <div className="a">
                rank A = 1 but rank[A|B] = 2 (R₂ − 2R₁ gives 0 = 1). <span className="ans">Inconsistent, no solution</span>
              </div>
            </details>

            <details className={`qa ${doneMap['sys-p-3'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('sys-p-3')}
                <span className="qtx">Solve: x + 2y = 3, 2x + 4y = 6.</span>
              </summary>
              <div className="a">
                rank A = rank[A|B] = 1 &lt; 2 → infinitely many. Let y = t: <span className="ans">x = 3 − 2t, y = t</span>
              </div>
            </details>

            <details className={`qa ${doneMap['sys-p-4'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('sys-p-4')}
                <span className="qtx">Solve the homogeneous system x + y + z = 0, x − y + z = 0, 3x + y + 3z = 0.</span>
              </summary>
              <div className="a">
                Row 3 = 2·Row 1 + Row 2, so rank = 2 &lt; 3 → infinite solutions. R₁ − R₂ gives y = 0, then x + z = 0. <span className="ans">(x, y, z) = (−t, 0, t)</span>
              </div>
            </details>

            <details className={`qa ${doneMap['sys-p-5'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('sys-p-5')}
                <span className="qtx">For what k is x + y = 2, 2x + 2y = k consistent?</span>
              </summary>
              <div className="a">
                rank A = 1. Need rank[A|B] = 1, so k = 4. <span className="ans">k = 4: infinitely many solutions; k ≠ 4: inconsistent</span>
              </div>
            </details>
          </div>

          <div className="pq tut">
            <h3>Tutorial questions (T1 = linear systems sheet, T2 = eigenvalues sheet)</h3>

            <details className={`qa t ${doneMap['sys-t-1'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('sys-t-1')}
                <b className="qn">T1·Q1</b>
                <span className="qtx">Find the rank: (a) rows (0,3,5),(3,5,0),(5,0,10). (b) rows (2,4,8,16),(16,8,4,2),(4,8,16,2),(2,16,8,4). (c) rows (5,−2,1,0),(−2,0,−4,1),(1,−4,−11,2),(0,1,2,0). (d) rows (2,3,−1,1),(1,−1,−2,−4),(3,1,3,−2),(6,3,0,−7). (e) rows (0,1,−3,−1),(1,0,1,1),(3,1,0,2),(1,1,−2,0).</span>
              </summary>
              <div className="a">
                (a) |A| = 0 − 3(30) + 5(−25) = −215 ≠ 0 → <span className="ans">rank 3</span><br />
                (b) halve every row, then eliminate: pivots 1, 6, −30, −15 → <span className="ans">rank 4</span><br />
                (c) use R₃ as pivot; the remaining 3×3 has determinant 0 but two independent rows → <span className="ans">rank 3</span><br />
                (d) as printed, the 3×3 left after elimination has determinant −66 ≠ 0 → <span className="ans">rank 4</span> (if the first row ends in −1 instead of 1 it drops to rank 3, so check the printed entry)<br />
                (e) R₃ = R₁ + 3R₂ and R₄ = R₁ + R₂ → <span className="ans">rank 2</span>
              </div>
            </details>

            <details className={`qa t ${doneMap['sys-t-2'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('sys-t-2')}
                <b className="qn">T1·Q2</b>
                <span className="qtx">Find k for which x + y + z = 1, 2x + y + 4z = k, 4x + y + 10z = k² is consistent.</span>
              </summary>
              <div className="a">
                R₂ − 2R₁ → (0,−1,2 | k−2); R₃ − 4R₁ → (0,−3,6 | k²−4). R₃ − 3R₂ → (0,0,0 | k² − 3k + 2). Need (k−1)(k−2) = 0 → <span className="ans">k = 1 or k = 2</span> (rank 2 &lt; 3, so infinitely many solutions).
              </div>
            </details>

            <details className={`qa t ${doneMap['sys-t-3'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('sys-t-3')}
                <b className="qn">T1·Q3</b>
                <span className="qtx">y + z − 2w = 0, 2x − 3y − 3z + 6w = 2, 4x + y + z − 2w = 4. (a) Write AX = B. (b) Solve.</span>
              </summary>
              <div className="a">
                (a) A = rows (0,1,1,−2),(2,−3,−3,6),(4,1,1,−2); X = (x,y,z,w)ᵀ; B = (0,2,4)ᵀ.<br />
                (b) R₂ + 3R₁ gives 2x = 2 → x = 1. R₃ = 2(R₂ + 3R₁) + R₁, so eq. 3 adds nothing. rank A = rank[A|B] = 2 &lt; 4 → 2 free variables, with y + z = 2w. Let y = s, z = t: <span className="ans">(x, y, z, w) = (1, s, t, (s+t)/2)</span>
              </div>
            </details>

            <details className={`qa t ${doneMap['sys-t-16'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('sys-t-16')}
                <b className="qn">T1·Q16</b>
                <span className="qtx">Solve the system with augmented matrix rows (1,2,−1 | 3), (3,−1,2 | 1), (2,−2,3 | 2), (1,−1,1 | −1).</span>
              </summary>
              <div className="a">
                Eq. 4: x = y − z − 1. Into eq. 1: 3y − 2z = 4; into eq. 2: 2y − z = 4. So z = 2y − 4, giving y = 4, z = 4, x = −1. Eq. 3: −2 − 8 + 12 = 2 ✓. rank A = rank[A|B] = 3 = n → <span className="ans">x = −1, y = 4, z = 4</span>
              </div>
            </details>

            <details className={`qa t ${doneMap['sys-t-17'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('sys-t-17')}
                <b className="qn">T1·Q17</b>
                <span className="qtx">Find the rank of rows (4,3,2,5), (1,5,9,10), (8,1,2,7).</span>
              </summary>
              <div className="a">
                R₁ − 4R₂ = (0,−17,−34,−35); R₃ − 8R₂ = (0,−39,−70,−73). Not proportional (17/39 ≠ 34/70) → <span className="ans">rank 3</span>
              </div>
            </details>

            <details className={`qa t ${doneMap['sys-t-18'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('sys-t-18')}
                <b className="qn">T1·Q18</b>
                <span className="qtx">Find the RREF and rank: (i) rows (1,2,1,3),(2,3,2,5),(3,−5,5,2),(3,9,−1,4). (ii) rows (−1,2,3,−2),(2,−5,1,2),(3,−8,5,2),(5,−12,−1,6).</span>
              </summary>
              <div className="a">
                (i) RREF = (1,0,0,−1), (0,1,0,1), (0,0,1,2), (0,0,0,0) → <span className="ans">rank 3</span><br />
                (ii) RREF = (1,0,−17,6), (0,1,−7,2), (0,0,0,0), (0,0,0,0) → <span className="ans">rank 2</span>
              </div>
            </details>

            <details className={`qa t ${doneMap['sys-t-19'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('sys-t-19')}
                <b className="qn">T1·Q19</b>
                <span className="qtx">Show that for λ ≠ 1, 3 the system x + y − z = 1, x + 2y + 3z = λ, x + 5y + 15z = λ² has no solution.</span>
              </summary>
              <div className="a">
                R₂ − R₁ → (0,1,4 | λ−1); R₃ − R₁ → (0,4,16 | λ²−1). R₃ − 4R₂ → (0,0,0 | λ² − 4λ + 3) = (λ−1)(λ−3). If λ ≠ 1, 3 this reads 0 = non-zero, so rank A = 2 &lt; rank[A|B] = 3 → <span className="ans">no solution</span>
              </div>
            </details>

            <details className={`qa t ${doneMap['sys-t-20'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('sys-t-20')}
                <b className="qn">T1·Q20</b>
                <span className="qtx">For what λ, μ does x + y + z = 6, x + 2y + 3z = 10, x + 2y + λz = μ have (i) no solution (ii) a unique solution (iii) more than one solution?</span>
              </summary>
              <div className="a">
                R₂ − R₁ → (0,1,2 | 4); R₃ − R₂ → (0,0,λ−3 | μ−10).<br />
                (i) <span className="ans">λ = 3, μ ≠ 10</span> (ii) <span className="ans">λ ≠ 3, any μ</span> (iii) <span className="ans">λ = 3, μ = 10</span>
              </div>
            </details>

            <details className={`qa t ${doneMap['sys-t-21'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('sys-t-21')}
                <b className="qn">T1·Q21</b>
                <span className="qtx">Find the rank of A, Aᵀ, AAᵀ where A = rows (1,0,2,1),(0,1,−2,1),(1,−1,4,0),(−2,2,8,0).</span>
              </summary>
              <div className="a">
                R₃ − R₁ + R₂ = 0, and R₄ + 2R₁ − 2R₂ = (0,0,16,0). Independent rows: R₁, R₂, and that one → rank A = 3. rank Aᵀ = rank A, and rank(AAᵀ) = rank A for a real matrix → <span className="ans">all three have rank 3</span>
              </div>
            </details>

            <details className={`qa t ${doneMap['sys-t-22'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('sys-t-22')}
                <b className="qn">T1·Q22</b>
                <span className="qtx">Test consistency and solve: 2x + 3y + 4z = 11, x + 5y + 7z = 15, 3x + 11y + 13z = 25, 2x + y + z = 5.</span>
              </summary>
              <div className="a">
                Pivot on eq. 2: R₁ − 2R₂ → −7y − 10z = −19; R₃ − 3R₂ → −4y − 8z = −20, i.e. y + 2z = 5; R₄ − 2R₂ → −9y − 13z = −25. Then 4z = 16 → z = 4, y = −3, x = 2. All four equations check. rank = 3 = n → consistent, <span className="ans">x = 2, y = −3, z = 4</span>
              </div>
            </details>

            <details className={`qa t ${doneMap['sys-t-23'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('sys-t-23')}
                <b className="qn">T1·Q23</b>
                <span className="qtx">Find b so that 2x + y + 2z = 0, x + y + 3z = 0, 4x + 3y + bz = 0 has trivial / non-trivial solutions.</span>
              </summary>
              <div className="a">
                |A| = 2(b−9) − 1(b−12) + 2(3−4) = b − 8.<br />
                <span className="ans">b ≠ 8: only the trivial solution</span> &nbsp; <span className="ans">b = 8: non-trivial solutions</span>
              </div>
            </details>

            <details className={`qa t ${doneMap['sys-t-24'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('sys-t-24')}
                <b className="qn">T1·Q24</b>
                <span className="qtx">Solve 4x + 2y + z + 3w = 0, 6x + 3y + 4z + 7w = 0, 2x + y + w = 0.</span>
              </summary>
              <div className="a">
                R₁ − 2R₃ → z + w = 0; R₂ − 3R₃ → 4z + 4w = 0 (same). rank 2 with 4 unknowns → 2 free. z = −w, y = −2x − w. Let x = s, w = t: <span className="ans">(x, y, z, w) = (s, −2s − t, −t, t)</span>
              </div>
            </details>

            <details className={`qa t ${doneMap['sys-t-25'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('sys-t-25')}
                <b className="qn">T1·Q25</b>
                <span className="qtx">Investigate consistency and solve: 4x − 2y + 6z = 8, x + y − 3z = −1, 15x − 3y + 9z = 21.</span>
              </summary>
              <div className="a">
                Eq. 1 ÷ 2: 2x − y + 3z = 4. Eq. 3 ÷ 3: 5x − y + 3z = 7. Subtract: x = 1. Then y − 3z = −2, which is eq. 2. rank A = rank[A|B] = 2 &lt; 3 → consistent, infinitely many: <span className="ans">(x, y, z) = (1, 3t − 2, t)</span> (Q29 prints the middle equation as x + y − 2z, which gives a unique solution instead, so one of the two is probably a typo.)
              </div>
            </details>

            <details className={`qa t ${doneMap['sys-t-26'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('sys-t-26')}
                <b className="qn">T1·Q26</b>
                <span className="qtx">Show x + 2y − z = 3, 3x − y + 2z = 1, 2x − 2y + 3z = 2, x − y + z = −1 are consistent and solve.</span>
              </summary>
              <div className="a">
                Same system as Q16: rank A = rank[A|B] = 3 = n, so consistent with a unique solution <span className="ans">x = −1, y = 4, z = 4</span>
              </div>
            </details>

            <details className={`qa t ${doneMap['sys-t-27'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('sys-t-27')}
                <b className="qn">T1·Q27</b>
                <span className="qtx">Test consistency and solve x + y − z = 0, 2x − y + z = 3, 4x + 2y − 2z = 2.</span>
              </summary>
              <div className="a">
                2·eq.1 − eq.3: −2x = −2 → x = 1. Then y − z = −1, and eq. 2 gives −y + z = 1 (same). rank A = rank[A|B] = 2 &lt; 3 → consistent, infinite: <span className="ans">(x, y, z) = (1, t − 1, t)</span>
              </div>
            </details>

            <details className={`qa t ${doneMap['sys-t-28'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('sys-t-28')}
                <b className="qn">T1·Q28</b>
                <span className="qtx">Show that for λ ≠ −5 the system x + 2y − 3z = −2, 6x + 5y + λz = −3, 3x − y + 4z = 3 has a unique solution; if λ = −5 show it is consistent.</span>
              </summary>
              <div className="a">
                |A| = 1(20+λ) − 2(24−3λ) − 3(−6−15) = 7λ + 35 = 7(λ+5), which is ≠ 0 for λ ≠ −5 → unique solution.<br />
                λ = −5: R₂ − 6R₁ = (0,−7,13 | 9) and R₃ − 3R₁ = (0,−7,13 | 9) are identical → rank A = rank[A|B] = 2 → <span className="ans">consistent (infinitely many solutions)</span>
              </div>
            </details>
          </div>
        </section>

        {/* SECTION 2: CRAMER'S RULE */}
        <section id="cramer" style={{ ['--c' as string]: 'var(--t5)' }}>
          <h2>
            <span>Cramer&apos;s rule</span>
            {renderSectionBadge('cramer')}
          </h2>
          <p className="tag">Works only when |A| ≠ 0 (square system).</p>

          <div className="fm">
            <b>x</b> = |A<sub>x</sub>| / |A| &nbsp; <b>y</b> = |A<sub>y</sub>| / |A| &nbsp; <b>z</b> = |A<sub>z</sub>| / |A|<br />
            <small>A<sub>x</sub> = A with column 1 replaced by B (same idea for y: column 2, z: column 3)</small>
          </div>

          <div className="ex">
            <p><strong>Worked example from your notes:</strong> x − 3y + z = 0, 3x + y + z = 6, 5x + y + 3z = 3</p>
            <p>|A| = 1(3−1) + 3(9−5) + 1(3−5) = <b>12</b></p>
            <p>|A<sub>x</sub>| = 48 → x = 4 &nbsp;|&nbsp; |A<sub>y</sub>| = −6 → y = −1/2 &nbsp;|&nbsp; |A<sub>z</sub>| = −66 → z = −11/2</p>
            <p><span className="ans">x = 4, y = −1/2, z = −11/2</span> &nbsp; Check: 4 + 1.5 − 5.5 = 0 ✓</p>
          </div>

          <div className="rem">
            <b>Exam tip:</b> expand each determinant along a row with a 0 to save time, and always substitute back to verify.
          </div>

          <div className="pq">
            <h3>Practice: 5 questions (tap to reveal the answer)</h3>

            <details className={`qa ${doneMap['cramer-p-1'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('cramer-p-1')}
                <span className="qtx">Solve by Cramer&apos;s rule: 2x + y = 5, x − y = 1.</span>
              </summary>
              <div className="a">
                |A| = −3, |Aₓ| = −6, |A_y| = −3. <span className="ans">x = 2, y = 1</span>
              </div>
            </details>

            <details className={`qa ${doneMap['cramer-p-2'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('cramer-p-2')}
                <span className="qtx">Solve: x + y + z = 6, x − y + z = 2, 2x + y − z = 1.</span>
              </summary>
              <div className="a">
                |A| = 6, |Aₓ| = 6, |A_y| = 12, |A_z| = 18. <span className="ans">x = 1, y = 2, z = 3</span>
              </div>
            </details>

            <details className={`qa ${doneMap['cramer-p-3'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('cramer-p-3')}
                <span className="qtx">What do you do if |A| = 0 in a Cramer&apos;s-rule problem?</span>
              </summary>
              <div className="a">
                The rule cannot be used (division by 0). Compare rank A and rank[A|B] instead: <span className="ans">no unique solution</span> (none or infinitely many).
              </div>
            </details>

            <details className={`qa ${doneMap['cramer-p-4'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('cramer-p-4')}
                <span className="qtx">Solve: x + 2y = 4, 3x − y = 5.</span>
              </summary>
              <div className="a">
                |A| = −7, |Aₓ| = −14, |A_y| = −7. <span className="ans">x = 2, y = 1</span>
              </div>
            </details>

            <details className={`qa ${doneMap['cramer-p-5'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('cramer-p-5')}
                <span className="qtx">Find only y: 2x + y = 4, x + 3y = 7.</span>
              </summary>
              <div className="a">
                |A| = 5, |A_y| = 2·7 − 4·1 = 10. <span className="ans">y = 2</span> (and x = 1)
              </div>
            </details>
          </div>

          <div className="pq tut">
            <h3>Tutorial questions (T1 = linear systems sheet, T2 = eigenvalues sheet)</h3>

            <details className={`qa t ${doneMap['cramer-t-29'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('cramer-t-29')}
                <b className="qn">T1·Q29</b>
                <span className="qtx">Using Cramer&apos;s rule solve 4x − 2y + 6z = 8, x + y − 2z = −1, 15x − 3y + 9z = 21.</span>
              </summary>
              <div className="a">
                |A| = 4(9−6) + 2(9+30) + 6(−3−15) = −18 ≠ 0.<br />
                |Aₓ| = 8(9−6) + 2(−9+42) + 6(3−21) = −18 → x = 1<br />
                |A_y| = 4(−9+42) − 8(9+30) + 6(21+15) = 36 → y = −2<br />
                |A_z| = 4(21−3) + 2(21+15) + 8(−3−15) = 0 → z = 0<br />
                <span className="ans">x = 1, y = −2, z = 0</span> (check: 4 + 4 = 8 ✓, 1 − 2 = −1 ✓, 15 + 6 = 21 ✓)
              </div>
            </details>

            <details className={`qa t ${doneMap['cramer-t-30'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('cramer-t-30')}
                <b className="qn">T1·Q30</b>
                <span className="qtx">Using Cramer&apos;s rule find x, y, z: 2x + y + z = 9, x + 3y + 2z = 13, 3x + 2y + 4z = 20.</span>
              </summary>
              <div className="a">
                |A| = 2(12−4) − 1(4−6) + 1(2−9) = 11. |Aₓ| = 26, |A_y| = 23, |A_z| = 24. <span className="ans">x = 26/11, y = 23/11, z = 24/11</span> (check: eq. 1 gives 99/11 = 9 ✓)
              </div>
            </details>
          </div>
        </section>

        {/* SECTION 3: VECTOR SPACES */}
        <section id="space" style={{ ['--c' as string]: 'var(--t2)' }}>
          <h2>
            <span>Vectors and vector spaces</span>
            {renderSectionBadge('space')}
          </h2>
          <p className="tag">Definitions you must be able to state in one line each.</p>

          <div className="grid2">
            <div className="box">
              <h4>Vector</h4>
              <p>A matrix with one row or one column. Entries are its <b>components</b>.</p>
            </div>
            <div className="box">
              <h4>Vector space V</h4>
              <p>Non-empty set of same-size vectors, closed under addition and scalar multiplication (every linear combination stays in V).</p>
            </div>
            <div className="box">
              <h4>Basis</h4>
              <p>Linearly independent set whose linear combinations give every vector in V.</p>
            </div>
            <div className="box">
              <h4>Dimension</h4>
              <p>Number of vectors in a basis of V.</p>
            </div>
            <div className="box">
              <h4>Subspace S of V</h4>
              <p>Non-empty subset that is itself a vector space. Test: for all a, b ∈ S and scalars α, β: <b>αa + βb ∈ S</b>.</p>
            </div>
            <div className="box">
              <h4>Row space / column space</h4>
              <p>All linear combinations of the rows / columns of A. Both have dimension <b>rank A</b>.</p>
            </div>
          </div>

          <h3>Null space and rank-nullity</h3>
          <div className="fm">
            <b>Null space</b> = solution set of AX = 0. Its dimension is the <b>nullity</b>.<br />
            <b>Rank A + Nullity A = number of columns of A</b>
          </div>

          <div className="scroll">
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>Solution</th>
                  <th>Columns / vectors</th>
                  <th>Determinant</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><b>rank A = n</b></td>
                  <td>Unique</td>
                  <td>Independent</td>
                  <td>|A| ≠ 0</td>
                </tr>
                <tr>
                  <td><b>rank A &lt; n</b></td>
                  <td>Infinitely many</td>
                  <td>Dependent</td>
                  <td>|A| = 0</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="ex">
            <p><strong>Q. Are (1,2,1), (2,1,4), (4,5,6) linearly independent?</strong></p>
            <p>Put them as rows of A and reduce (R₂ → R₂ − 2R₁ gives 0, −3, 2, and so on). Shortcut for 3 vectors in 3 dimensions: compute |A|.</p>
            <p>|A| = 1(6−20) − 2(12−16) + 1(10−4) = −14 + 8 + 6 = 0 → <span className="ans">Dependent</span> (rank &lt; 3)</p>
          </div>

          <div className="pq">
            <h3>Practice: 5 questions (tap to reveal the answer)</h3>

            <details className={`qa ${doneMap['space-p-1'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('space-p-1')}
                <span className="qtx">Are (1,0,0), (0,1,0), (0,0,1) independent? Do they form a basis of ℝ³?</span>
              </summary>
              <div className="a">
                |A| = 1 ≠ 0 → independent, and they span ℝ³. <span className="ans">Yes, basis, dimension 3</span>
              </div>
            </details>

            <details className={`qa ${doneMap['space-p-2'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('space-p-2')}
                <span className="qtx">Are (1,2,3) and (2,4,6) independent?</span>
              </summary>
              <div className="a">
                (2,4,6) = 2·(1,2,3). <span className="ans">Dependent</span>
              </div>
            </details>

            <details className={`qa ${doneMap['space-p-3'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('space-p-3')}
                <span className="qtx">A = rows (1,2,3), (2,4,6), (1,1,1). Find rank and nullity.</span>
              </summary>
              <div className="a">
                R₂ = 2R₁, so only two independent rows. Rank = 2, nullity = 3 − 2 = <span className="ans">1</span>
              </div>
            </details>

            <details className={`qa ${doneMap['space-p-4'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('space-p-4')}
                <span className="qtx">Is S = &#123;(x, y) : x + y = 0&#125; a subspace of ℝ²? Give a basis.</span>
              </summary>
              <div className="a">
                Non-empty ((0,0) ∈ S). For a = (a₁, −a₁), b = (b₁, −b₁): αa + βb = (αa₁ + βb₁, −(αa₁ + βb₁)) ∈ S. <span className="ans">Subspace, basis &#123;(1, −1)&#125;, dimension 1</span>
              </div>
            </details>

            <details className={`qa ${doneMap['space-p-5'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('space-p-5')}
                <span className="qtx">Is S = &#123;(x, y) : x + y = 1&#125; a subspace of ℝ²?</span>
              </summary>
              <div className="a">
                (0,0) ∉ S (0 + 0 ≠ 1). <span className="ans">Not a subspace</span>
              </div>
            </details>
          </div>

          <div className="pq tut">
            <h3>Tutorial questions (T1 = linear systems sheet, T2 = eigenvalues sheet)</h3>

            <details className={`qa t ${doneMap['space-t-4'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('space-t-4')}
                <b className="qn">T1·Q4</b>
                <span className="qtx">Find the nullity of A = rows (1,2,1,5),(2,4,−3,0),(1,2,−1,1) and interpret it as lost input signals.</span>
              </summary>
              <div className="a">
                R₂ − 2R₁ = (0,0,−5,−10); R₃ − R₁ = (0,0,−2,−4), which is (2/5) of the first. rank = 2. Nullity = 4 − 2 = <span className="ans">2</span>. Meaning: a 2-dimensional set of input signals is mapped to zero, so 2 independent input directions are lost in transmission.
              </div>
            </details>

            <details className={`qa t ${doneMap['space-t-5'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('space-t-5')}
                <b className="qn">T1·Q5</b>
                <span className="qtx">Are S₁ = &#123;(x,y,z) ∈ ℝ³ : x + y + z = 0&#125; and S₂ = &#123;(x,y,z) ∈ ℝ³ : xy = 0&#125; subspaces of ℝ³?</span>
              </summary>
              <div className="a">
                S₁: contains (0,0,0); if a, b satisfy the equation, so does αa + βb (the sum of coordinates is α·0 + β·0 = 0) → <span className="ans">S₁ is a subspace (a plane, dimension 2)</span><br />
                S₂: (1,0,0) and (0,1,0) are in S₂ but their sum (1,1,0) has xy = 1 ≠ 0 → <span className="ans">S₂ is not a subspace</span>
              </div>
            </details>

            <details className={`qa t ${doneMap['space-t-31'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('space-t-31')}
                <b className="qn">T1·Q31</b>
                <span className="qtx">A = rows (1,2,3,4,5),(2,4,6,8,10),(1,1,1,1,1). Verify the Rank-Nullity theorem.</span>
              </summary>
              <div className="a">
                R₂ = 2R₁, and R₁, R₃ are independent → rank = 2. Columns = 5, so nullity = 3. Check: <span className="ans">2 + 3 = 5 ✓</span>
              </div>
            </details>

            <details className={`qa t ${doneMap['space-t-32'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('space-t-32')}
                <b className="qn">T1·Q32</b>
                <span className="qtx">A = rows (1,0,2,1),(0,1,3,2),(1,1,5,3),(2,1,7,4). Verify the Rank-Nullity theorem.</span>
              </summary>
              <div className="a">
                R₃ = R₁ + R₂ and R₄ = 2R₁ + R₂, so rank = 2. Solve AX = 0: x = −2z − w, y = −3z − 2w, with z, w free → nullity 2. Check: <span className="ans">2 + 2 = 4 ✓</span>
              </div>
            </details>

            <details className={`qa t ${doneMap['space-t-33'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('space-t-33')}
                <b className="qn">T1·Q33</b>
                <span className="qtx">Are v₁ = (1,2,3,4), v₂ = (2,4,6,8), v₃ = (1,1,0,1), v₄ = (0,1,2,3) linearly independent?</span>
              </summary>
              <div className="a">
                v₂ = 2v₁, so the four vectors are <span className="ans">linearly dependent</span> (the rank of the 4×4 matrix is less than 4).
              </div>
            </details>

            <details className={`qa t ${doneMap['space-t-34'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('space-t-34')}
                <b className="qn">T1·Q34</b>
                <span className="qtx">Are v₁ = (1,0,1,2), v₂ = (0,1,2,3), v₃ = (1,1,3,5), v₄ = (2,1,4,7) linearly independent?</span>
              </summary>
              <div className="a">
                v₃ = v₁ + v₂ and v₄ = 2v₁ + v₂, so rank = 2 &lt; 4 → <span className="ans">linearly dependent</span>
              </div>
            </details>

            <details className={`qa t ${doneMap['space-t-35'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('space-t-35')}
                <b className="qn">T1·Q35</b>
                <span className="qtx">Is W = &#123;(x,y,z) ∈ ℝ³ : xyz = 1&#125; a vector space?</span>
              </summary>
              <div className="a">
                (0,0,0) ∉ W since 0 ≠ 1. Also (1,1,1) ∈ W but (1,1,1) + (1,1,1) = (2,2,2) has product 8 ≠ 1, so W is not closed under addition. <span className="ans">Not a vector space</span>
              </div>
            </details>
          </div>
        </section>

        {/* SECTION 4: LU DECOMPOSITION */}
        <section id="lu" style={{ ['--c' as string]: 'var(--t3)' }}>
          <h2>
            <span>LU decomposition</span>
            {renderSectionBadge('lu')}
          </h2>
          <p className="tag">Module 2. Write A = L · U, with U upper triangular and L lower triangular.</p>

          <ol className="steps">
            <li>Row-reduce A to an upper triangular matrix. That is <b>U</b>.</li>
            <li>For each operation R<sub>i</sub> → R<sub>i</sub> − m·R<sub>j</sub>, put <b>m</b> in position (i, j) of L. So R₂ − 2R₁ gives +2, and R₃ + 3R₁ gives <b>−3</b>.</li>
            <li>Make the main diagonal of L all 1s and the entries above it 0.</li>
          </ol>

          <div className="ex">
            <p>
              <strong>Example:</strong> A ={' '}
              <span className="mx" style={{ ['--n' as string]: '3' }}>
                <span>2</span><span>−1</span><span>3</span>
                <span>4</span><span>2</span><span>1</span>
                <span>−6</span><span>−1</span><span>2</span>
              </span>
            </p>
            <p>R₂ → R₂ − 2R₁ (m = 2), R₃ → R₃ + 3R₁ (m = −3), R₃ → R₃ + R₂ (m = −1)</p>
            <p>
              U ={' '}
              <span className="mx" style={{ ['--n' as string]: '3' }}>
                <span>2</span><span>−1</span><span>3</span>
                <span>0</span><span>4</span><span>−5</span>
                <span>0</span><span>0</span><span>6</span>
              </span>
              &nbsp; L ={' '}
              <span className="mx" style={{ ['--n' as string]: '3' }}>
                <span>1</span><span>0</span><span>0</span>
                <span>2</span><span>1</span><span>0</span>
                <span>−3</span><span>−1</span><span>1</span>
              </span>
            </p>
          </div>

          <div className="rem">
            <b>Watch the sign:</b> if the operation <i>adds</i> a multiple (R₃ + 3R₁), the entry in L is the <i>negative</i> (−3). Quick check: multiply L·U and you must get A back.
          </div>

          <div className="pq">
            <h3>Practice: 5 questions (tap to reveal the answer)</h3>

            <details className={`qa ${doneMap['lu-p-1'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('lu-p-1')}
                <span className="qtx">Find L and U for A = [[1,2],[3,4]].</span>
              </summary>
              <div className="a">
                R₂ → R₂ − 3R₁. <span className="ans">U = [[1,2],[0,−2]], L = [[1,0],[3,1]]</span>
              </div>
            </details>

            <details className={`qa ${doneMap['lu-p-2'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('lu-p-2')}
                <span className="qtx">Find L and U for A = [[2,1],[4,5]].</span>
              </summary>
              <div className="a">
                R₂ → R₂ − 2R₁. <span className="ans">U = [[2,1],[0,3]], L = [[1,0],[2,1]]</span>
              </div>
            </details>

            <details className={`qa ${doneMap['lu-p-3'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('lu-p-3')}
                <span className="qtx">Find L and U for A = [[1,1,1],[2,3,4],[3,4,6]].</span>
              </summary>
              <div className="a">
                R₂ − 2R₁, R₃ − 3R₁, then R₃ − R₂. <span className="ans">U = [[1,1,1],[0,1,2],[0,0,1]], L = [[1,0,0],[2,1,0],[3,1,1]]</span>
              </div>
            </details>

            <details className={`qa ${doneMap['lu-p-4'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('lu-p-4')}
                <span className="qtx">Find L and U for A = [[4,3],[6,3]].</span>
              </summary>
              <div className="a">
                R₂ → R₂ − (3/2)R₁. <span className="ans">U = [[4,3],[0,−3/2]], L = [[1,0],[3/2,1]]</span>
              </div>
            </details>

            <details className={`qa ${doneMap['lu-p-5'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('lu-p-5')}
                <span className="qtx">Using Q1&apos;s L and U, solve AX = (5, 11)ᵀ.</span>
              </summary>
              <div className="a">
                Solve LY = B: y₁ = 5, 3·5 + y₂ = 11 → y₂ = −4. Then UX = Y: −2y = −4 → y = 2, x + 4 = 5. <span className="ans">x = 1, y = 2</span>
              </div>
            </details>
          </div>

          <div className="pq tut">
            <h3>Tutorial questions (T1 = linear systems sheet, T2 = eigenvalues sheet)</h3>

            <details className={`qa t ${doneMap['lu-t-29'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('lu-t-29')}
                <b className="qn">T2·Q29</b>
                <span className="qtx">Decompose A = rows (2,1,0),(0,1,−1),(0,2,4) into L and U, and use it to solve a related system.</span>
              </summary>
              <div className="a">
                Only one operation needed: R₃ → R₃ − 2R₂ (multiplier 2). U = rows (2,1,0),(0,1,−1),(0,0,6); L = rows (1,0,0),(0,1,0),(0,2,1). Check: row 3 of LU = 2(0,1,−1) + (0,0,6) = (0,2,4) ✓.<br />
                The question gives no right-hand side, so take B = (3,1,2)ᵀ: LY = B → y₁ = 3, y₂ = 1, y₃ = 2 − 2 = 0. UX = Y → z = 0, y = 1, x = 1. <span className="ans">X = (1, 1, 0)</span>
              </div>
            </details>

            <details className={`qa t ${doneMap['lu-t-33'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('lu-t-33')}
                <b className="qn">T2·Q33</b>
                <span className="qtx">Use LU decomposition to solve 4x + 2y + 14z = 14, 2x + 17y − 5z = −101, 14x − 5y + 83z = 155.</span>
              </summary>
              <div className="a">
                Multipliers: 1/2, 7/2, then −3/4. U = rows (4,2,14),(0,16,−12),(0,0,25); L = rows (1,0,0),(1/2,1,0),(7/2,−3/4,1).<br />
                LY = B: y₁ = 14, y₂ = −101 − 7 = −108, y₃ = 155 − 49 − 81 = 25. UX = Y: 25z = 25 → z = 1; 16y − 12 = −108 → y = −6; 4x − 12 + 14 = 14 → x = 3. <span className="ans">x = 3, y = −6, z = 1</span>
              </div>
            </details>
          </div>
        </section>

        {/* SECTION 5: EIGENVALUES AND EIGENVECTORS */}
        <section id="eig" style={{ ['--c' as string]: 'var(--t4)' }}>
          <h2>
            <span>Eigenvalues and eigenvectors</span>
            {renderSectionBadge('eig')}
          </h2>
          <p className="tag">For an n × n matrix A.</p>

          <div className="fm">
            <b>AX = λX</b> with X ≠ 0. λ is the eigenvalue, X the eigenvector.<br />
            Characteristic equation: <b>|A − λI| = 0</b>
          </div>

          <ol className="steps">
            <li>Form A − λI and expand |A − λI| = 0 to get the characteristic polynomial.</li>
            <li>Solve for λ.</li>
            <li>For each λ, solve (A − λI)X = 0. Let a free variable be t.</li>
          </ol>

          <div className="ex">
            <p>
              <strong>Q. Eigenvalues and eigenvectors of</strong> A ={' '}
              <span className="mx" style={{ ['--n' as string]: '2' }}>
                <span>−5</span><span>2</span>
                <span>2</span><span>−2</span>
              </span>
            </p>
            <p>|A − λI| = (−5−λ)(−2−λ) − 4 = λ² + 7λ + 6 = 0 → <span className="ans">λ = −1, −6</span></p>
            <p><b>λ = −1:</b> rows [−4 2], [2 −1] give 2x = y → X₁ = (t, 2t)</p>
            <p><b>λ = −6:</b> rows [1 2], [2 4] give x + 2y = 0. Take y = t, so x = −2t → X₂ = (−2t, t)</p>
          </div>

          <h3>Two shortcut properties</h3>
          <div className="grid2">
            <div className="box">
              <h4>Sum of eigenvalues</h4>
              <p>= trace of A (sum of the diagonal)</p>
            </div>
            <div className="box">
              <h4>Product of eigenvalues</h4>
              <p>= |A|</p>
            </div>
          </div>

          <div className="rem">
            <b>Missing eigenvalue trick:</b> if a question gives the product of two eigenvalues (p) and asks for all three without the characteristic equation: third = |A| ÷ p. Then the other two satisfy λ₁ + λ₂ = trace − third and λ₁λ₂ = p, so solve a quadratic.
          </div>

          <div className="pq">
            <h3>Practice: 5 questions (tap to reveal the answer)</h3>

            <details className={`qa ${doneMap['eig-p-1'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('eig-p-1')}
                <span className="qtx">Eigenvalues of A = [[2,0],[0,3]]?</span>
              </summary>
              <div className="a">
                Triangular/diagonal matrix, so the eigenvalues are the diagonal entries: <span className="ans">2 and 3</span>
              </div>
            </details>

            <details className={`qa ${doneMap['eig-p-2'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('eig-p-2')}
                <span className="qtx">Find eigenvalues and eigenvectors of A = [[4,1],[2,3]].</span>
              </summary>
              <div className="a">
                λ² − 7λ + 10 = 0 → <span className="ans">λ = 5, 2</span>. λ = 5: x = y → (t, t). λ = 2: 2x + y = 0 → (t, −2t).
              </div>
            </details>

            <details className={`qa ${doneMap['eig-p-3'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('eig-p-3')}
                <span className="qtx">Find eigenvalues and eigenvectors of A = [[1,2],[3,2]].</span>
              </summary>
              <div className="a">
                λ² − 3λ − 4 = 0 → <span className="ans">λ = 4, −1</span>. λ = 4: 3x = 2y → (2t, 3t). λ = −1: x + y = 0 → (t, −t).
              </div>
            </details>

            <details className={`qa ${doneMap['eig-p-4'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('eig-p-4')}
                <span className="qtx">Eigenvalues of a 3×3 matrix are 1, 2, 4. Find trace and |A|.</span>
              </summary>
              <div className="a">
                Trace = sum = 7, |A| = product = <span className="ans">trace 7, |A| = 8</span>
              </div>
            </details>

            <details className={`qa ${doneMap['eig-p-5'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('eig-p-5')}
                <span className="qtx">A 3×3 matrix has trace 9 and two eigenvalues 2 and 3. Find the third eigenvalue and |A|.</span>
              </summary>
              <div className="a">
                Third = 9 − 2 − 3 = 4. |A| = 2·3·4 = <span className="ans">λ₃ = 4, |A| = 24</span>
              </div>
            </details>
          </div>

          <div className="pq tut">
            <h3>Tutorial questions (T1 = linear systems sheet, T2 = eigenvalues sheet)</h3>

            <details className={`qa t ${doneMap['eig-t-1'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('eig-t-1')}
                <b className="qn">T2·Q1</b>
                <span className="qtx">A = rows (2,1,−1),(1,1,−2),(−1,−2,1). Find the sum and product of the eigenvalues and interpret.</span>
              </summary>
              <div className="a">
                Sum = trace = 2 + 1 + 1 = <span className="ans">4</span>. Product = |A| = 2(1−4) − 1(1−2) − 1(−2+1) = <span className="ans">−4</span>. (Eigenvalues are 4, 1, −1.) Interpretation: total response 4; the negative product means an odd number of negative eigenvalues (here one), i.e. one mode reverses sign, so the overall gain flips.
              </div>
            </details>

            <details className={`qa t ${doneMap['eig-t-2'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('eig-t-2')}
                <b className="qn">T2·Q2</b>
                <span className="qtx">Eigenvalues and eigenvectors of A₁ = rows (1,1,−2),(−1,2,1),(0,1,−1) and A₂ = rows (−3,−7,−5),(2,4,3),(1,2,2). Dominant eigenvalue and vector of each.</span>
              </summary>
              <div className="a">
                A₁: λ³ − 2λ² − λ + 2 = (λ−2)(λ²−1) → λ = 2, 1, −1. Vectors: λ=2: (1,3,1); λ=1: (3,2,1); λ=−1: (1,0,1). <span className="ans">Dominant: λ = 2, (1,3,1)</span><br />
                A₂: λ³ − 3λ² + 3λ − 1 = (λ−1)³ → λ = 1 (three times). A₂ − I has rank 2, so only one eigenvector: (−3,1,1). <span className="ans">Dominant: λ = 1, (−3,1,1)</span> (A₂ is not diagonalizable).
              </div>
            </details>

            <details className={`qa t ${doneMap['eig-t-3'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('eig-t-3')}
                <b className="qn">T2·Q3</b>
                <span className="qtx">Diagonalize A = rows (2,1,−1),(1,1,−2),(−1,−2,1) as A = PDP⁻¹ and explain how it gives uncorrelated features.</span>
              </summary>
              <div className="a">
                λ = 4, 1, −1 with eigenvectors (1,1,−1), (2,−1,1), (0,1,1) (they are mutually orthogonal). P = these as columns, <span className="ans">D = diag(4, 1, −1)</span>, A = PDP⁻¹. In the new coordinates Y = P⁻¹X the matrix is diagonal, so there are no cross terms: the new features are uncorrelated, and each diagonal entry says how much its feature contributes.
              </div>
            </details>

            <details className={`qa t ${doneMap['eig-t-16'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('eig-t-16')}
                <b className="qn">T2·Q16</b>
                <span className="qtx">A = rows (3,−1,1),(−1,5,−1),(1,−1,3). Find the eigenvalues and eigenvectors and the dominant mode.</span>
              </summary>
              <div className="a">
                Characteristic equation: λ³ − 11λ² + 36λ − 36 = 0 → <span className="ans">λ = 2, 3, 6</span>. Eigenvectors: λ=2: (1,0,−1); λ=3: (1,1,1); λ=6: (1,−2,1). Dominant mode: <span className="ans">λ = 6, (1,−2,1)</span>
              </div>
            </details>

            <details className={`qa t ${doneMap['eig-t-17'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('eig-t-17')}
                <b className="qn">T2·Q17</b>
                <span className="qtx">A = rows (1,−3,3),(0,−5,6),(0,−3,4). Find the characteristic roots and vectors and comment on stability.</span>
              </summary>
              <div className="a">
                λ³ − 3λ + 2 = (λ−1)²(λ+2) → <span className="ans">λ = 1, 1, −2</span>. λ=1: (1,0,0) and (0,1,1). λ=−2: (1,2,1). Stability (continuous-time): the λ = −2 mode decays, but the λ = 1 modes grow, so the system as a whole is unstable.
              </div>
            </details>

            <details className={`qa t ${doneMap['eig-t-18'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('eig-t-18')}
                <b className="qn">T2·Q18</b>
                <span className="qtx">A = rows (3,1,−1),(−2,1,2),(0,1,2). Find eigenvalues and eigenvectors and say which modes amplify or damp.</span>
              </summary>
              <div className="a">
                λ³ − 6λ² + 11λ − 6 = 0 → <span className="ans">λ = 1, 2, 3</span>. λ=1: (1,−1,1); λ=2: (1,0,1); λ=3: (0,1,1). Modes with λ = 2 and 3 are amplified, λ = 1 is neutral (no growth or decay), and none is damped.
              </div>
            </details>

            <details className={`qa t ${doneMap['eig-t-19'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('eig-t-19')}
                <b className="qn">T2·Q19</b>
                <span className="qtx">A = rows (6,0,0),(0,2,−2),(0,−2,5). Find P and D with P⁻¹AP = D.</span>
              </summary>
              <div className="a">
                The block rows (2,−2),(−2,5) has λ² − 7λ + 6 = 0, so eigenvalues are <span className="ans">6, 6, 1</span>. λ=1: (0,2,1). λ=6: (1,0,0) and (0,1,−2). P = columns (1,0,0), (0,1,−2), (0,2,1); <span className="ans">D = diag(6, 6, 1)</span>.
              </div>
            </details>

            <details className={`qa t ${doneMap['eig-t-20'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('eig-t-20')}
                <b className="qn">T2·Q20</b>
                <span className="qtx">Diagonalize the covariance matrix A = rows (3,−1,1),(−1,5,−1),(1,−1,3) and express the risk interactions in uncorrelated components.</span>
              </summary>
              <div className="a">
                Same matrix as Q16: eigenvalues 2, 3, 6 with orthogonal eigenvectors. Normalize: P = columns (1,0,−1)/√2, (1,1,1)/√3, (1,−2,1)/√6, so P⁻¹ = Pᵀ and <span className="ans">PᵀAP = D = diag(2, 3, 6)</span>. With Y = PᵀX the components are uncorrelated with variances 2, 3, 6. The λ = 6 component carries 6/11 ≈ 55% of the total.
              </div>
            </details>

            <details className={`qa t ${doneMap['eig-t-21'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('eig-t-21')}
                <b className="qn">T2·Q21</b>
                <span className="qtx">A = rows (6,−2,2),(−2,3,−1),(2,−1,3). Find the eigenvalues and eigenvectors and the most critical resonance mode.</span>
              </summary>
              <div className="a">
                λ³ − 12λ² + 36λ − 32 = (λ−2)²(λ−8) → <span className="ans">λ = 2, 2, 8</span>. λ=8: (2,−1,1). λ=2: (0,1,1) and (1,1,−1) (any two independent solutions of 2x − y + z = 0). Most critical mode: <span className="ans">λ = 8, (2,−1,1)</span>
              </div>
            </details>

            <details className={`qa t ${doneMap['eig-t-22'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('eig-t-22')}
                <b className="qn">T2·Q22</b>
                <span className="qtx">Find the eigenvalues of A = rows (8,6,2),(−6,7,−4),(2,−1,3) (principal stresses) and decide whether the material yields.</span>
              </summary>
              <div className="a">
                As printed, the characteristic equation is λ³ − 18λ² + 129λ − 180 = 0, which has no clean roots, so it is almost certainly the standard symmetric matrix rows (8,−6,2),(−6,7,−4),(2,−4,3). For that one: trace 18, sum of minors 45, |A| = 0, so λ³ − 18λ² + 45λ = 0 → <span className="ans">λ = 0, 3, 15</span>. All are ≥ 0 (no compressive principal stress). The largest, 15, is what you compare with the yield limit: the material yields if 15 exceeds it.
              </div>
            </details>

            <details className={`qa t ${doneMap['eig-t-27'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('eig-t-27')}
                <b className="qn">T2·Q27</b>
                <span className="qtx">A = rows (1,2,3),(0,−4,2),(0,0,7). Find eigenvalues and eigenvectors and comment on stability.</span>
              </summary>
              <div className="a">
                Triangular, so <span className="ans">λ = 1, −4, 7</span>. λ=1: (1,0,0). λ=−4: (2,−5,0). λ=7: (37,12,66). Stability: for x′ = Ax, λ = 1 and 7 are positive → unstable. For x(k+1) = Ax(k), |λ| &gt; 1 for −4 and 7 → also unstable.
              </div>
            </details>

            <details className={`qa t ${doneMap['eig-t-32'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('eig-t-32')}
                <b className="qn">T2·Q32</b>
                <span className="qtx">Diagonalize A = rows (5,−4,4),(12,−11,12),(4,−4,5) so that A = PDP⁻¹.</span>
              </summary>
              <div className="a">
                λ³ + λ² − 5λ + 3 = (λ−1)²(λ+3) → <span className="ans">λ = 1, 1, −3</span>. λ=1: A − I has rank 1, giving two independent vectors (1,1,0) and (0,1,1). λ=−3: (1,3,1). P = columns (1,1,0), (0,1,1), (1,3,1); <span className="ans">D = diag(1, 1, −3)</span>. Then Aⁿ = PDⁿP⁻¹ with Dⁿ = diag(1, 1, (−3)ⁿ).
              </div>
            </details>

            <details className={`qa t ${doneMap['eig-t-34'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('eig-t-34')}
                <b className="qn">T2·Q34</b>
                <span className="qtx">Eigenvalues and eigenvectors of A = rows (0,1),(−1,0).</span>
              </summary>
              <div className="a">
                λ² + 1 = 0 → <span className="ans">λ = i, −i</span>. λ = i: −ix + y = 0 → (1, i). λ = −i: (1, −i). (A is a 90° rotation, so it has no real eigenvectors.)
              </div>
            </details>
          </div>
        </section>

        {/* SECTION 6: QUADRATIC FORMS */}
        <section id="quad" style={{ ['--c' as string]: 'var(--t6)' }}>
          <h2>
            <span>Quadratic forms</span>
            {renderSectionBadge('quad')}
          </h2>
          <p className="tag">A homogeneous polynomial of degree 2, for example x₁² + 5x₁x₂ + 2x₂².</p>

          <div className="fm">
            Matrix form: <b>Q = XᵀAX</b> = Σᵢ Σⱼ aᵢⱼ xᵢ xⱼ, where A is <b>symmetric</b>.
          </div>

          <h3>Writing the matrix A</h3>
          <ul>
            <li>Diagonal entry aᵢᵢ = coefficient of xᵢ².</li>
            <li>Off-diagonal aᵢⱼ = aⱼᵢ = <b>half</b> the coefficient of xᵢxⱼ.</li>
          </ul>

          <p>
            Example: x₁² + 5x₁x₂ + 2x₂² → A ={' '}
            <span className="mx" style={{ ['--n' as string]: '2' }}>
              <span>1</span><span>5/2</span>
              <span>5/2</span><span>2</span>
            </span>
          </p>
          <p><b>Canonical form</b> = written only as a sum or difference of squares (no cross terms).</p>

          <h3>Reduction to canonical form by orthogonal transformation</h3>
          <ol className="steps">
            <li>Write Q = XᵀAX and find the symmetric matrix A.</li>
            <li>Find the eigenvalues and eigenvectors of A.</li>
            <li>Modal matrix P = [X₁ X₂ X₃] (eigenvectors as columns).</li>
            <li>Normalize each column: Xᵢ / ‖Xᵢ‖, where ‖X‖ = √(x₁² + x₂² + x₃²). Now P is orthogonal.</li>
            <li>Since D = P⁻¹AP, we get A = PDPᵀ (as P⁻¹ = Pᵀ). Put Y = P⁻¹X.</li>
          </ol>

          <div className="fm">
            Q = XᵀAX = Xᵀ(PDPᵀ)X = YᵀDY = <b>λ₁y₁² + λ₂y₂² + … + λₙyₙ²</b>
          </div>

          <div className="rem">
            <b>Remember:</b> the canonical form is just the eigenvalues of A sitting in front of y₁², y₂², … So finding the eigenvalues alone gives you the final answer&apos;s coefficients.
          </div>

          <div className="pq">
            <h3>Practice: 5 questions (tap to reveal the answer)</h3>

            <details className={`qa ${doneMap['quad-p-1'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('quad-p-1')}
                <span className="qtx">Write the matrix of Q = x² + 4xy + 3y².</span>
              </summary>
              <div className="a">
                Halve the cross coefficient: <span className="ans">A = [[1,2],[2,3]]</span>
              </div>
            </details>

            <details className={`qa ${doneMap['quad-p-2'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('quad-p-2')}
                <span className="qtx">Write the matrix of Q = 2x² + 6xy − y².</span>
              </summary>
              <div className="a">
                <span className="ans">A = [[2,3],[3,−1]]</span>
              </div>
            </details>

            <details className={`qa ${doneMap['quad-p-3'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('quad-p-3')}
                <span className="qtx">Write the matrix of Q = x² + 2y² + 3z² + 4xy − 2yz + 6xz.</span>
              </summary>
              <div className="a">
                Halves: xy → 2, yz → −1, xz → 3. <span className="ans">A = [[1,2,3],[2,2,−1],[3,−1,3]]</span>
              </div>
            </details>

            <details className={`qa ${doneMap['quad-p-4'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('quad-p-4')}
                <span className="qtx">Write A = [[1,3],[3,2]] as a quadratic form in x, y.</span>
              </summary>
              <div className="a">
                XᵀAX = <span className="ans">x² + 6xy + 2y²</span> (cross terms 3xy + 3yx)
              </div>
            </details>

            <details className={`qa ${doneMap['quad-p-5'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('quad-p-5')}
                <span className="qtx">Reduce Q = 3x² + 2xy + 3y² to canonical form.</span>
              </summary>
              <div className="a">
                A = [[3,1],[1,3]]: λ² − 6λ + 8 = 0 → λ = 4, 2 (eigenvectors (1,1)/√2 and (1,−1)/√2). <span className="ans">Q = 4y₁² + 2y₂²</span>
              </div>
            </details>
          </div>

          <div className="pq tut">
            <h3>Tutorial questions (T1 = linear systems sheet, T2 = eigenvalues sheet)</h3>

            <details className={`qa t ${doneMap['quad-t-4'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('quad-t-4')}
                <b className="qn">T2·Q4</b>
                <span className="qtx">Is A = (1/9)·rows (−8,4,1),(1,4,−8),(4,7,4) orthogonal?</span>
              </summary>
              <div className="a">
                Rows: 64 + 16 + 1 = 81, 1 + 16 + 64 = 81, 16 + 49 + 16 = 81, so each has length 1. Dot products: R₁·R₂ = −8 + 16 − 8 = 0, R₁·R₃ = −32 + 28 + 4 = 0, R₂·R₃ = 4 + 28 − 32 = 0. So AAᵀ = I → <span className="ans">A is orthogonal</span>
              </div>
            </details>

            <details className={`qa t ${doneMap['quad-t-5'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('quad-t-5')}
                <b className="qn">T2·Q5</b>
                <span className="qtx">Reduce 3x² + 2xy + 3y² = 9 to canonical form. Is it an ellipse?</span>
              </summary>
              <div className="a">
                A = rows (3,1),(1,3), λ = 4, 2. Canonical: 4y₁² + 2y₂² = 9, i.e. y₁²/(9/4) + y₂²/(9/2) = 1. Both coefficients positive → <span className="ans">ellipse, semi-axes 3/2 and 3/√2</span>
              </div>
            </details>

            <details className={`qa t ${doneMap['quad-t-23'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('quad-t-23')}
                <b className="qn">T2·Q23</b>
                <span className="qtx">Q = 2x² + 2y² + 3z² + 2xy − 4yz − 4xz. Reduce to canonical form and count the significant components.</span>
              </summary>
              <div className="a">
                A = rows (2,1,−2),(1,2,−2),(−2,−2,3). λ³ − 7λ² + 7λ − 1 = (λ−1)(λ² − 6λ + 1) → λ = 1, 3 ± 2√2. <span className="ans">Q = y₁² + (3+2√2)y₂² + (3−2√2)y₃²</span> All three coefficients are positive (positive definite), so all 3 components are present; the smallest, 3 − 2√2 ≈ 0.17, is much weaker than the others.
              </div>
            </details>

            <details className={`qa t ${doneMap['quad-t-24'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('quad-t-24')}
                <b className="qn">T2·Q24</b>
                <span className="qtx">Q = 3x² + 5y² + 3z² − 2xy − 2yz + 2xz. Reduce to canonical form by an orthogonal transformation.</span>
              </summary>
              <div className="a">
                A = rows (3,−1,1),(−1,5,−1),(1,−1,3), the same matrix as Q16: λ = 2, 3, 6 with orthonormal eigenvectors (1,0,−1)/√2, (1,1,1)/√3, (1,−2,1)/√6. With X = PY: <span className="ans">Q = 2y₁² + 3y₂² + 6y₃²</span> Three independent modes, all positive.
              </div>
            </details>

            <details className={`qa t ${doneMap['quad-t-25'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('quad-t-25')}
                <b className="qn">T2·Q25</b>
                <span className="qtx">A = rows (2,4,5),(4,3,1),(5,1,1). Write the quadratic form and reduce to canonical form.</span>
              </summary>
              <div className="a">
                Q = 2x² + 3y² + z² + 8xy + 10xz + 2yz. Characteristic equation λ³ − 6λ² − 31λ + 47 = 0, with roots ≈ 8.89, 1.27, −4.16. So <span className="ans">Q ≈ 8.89y₁² + 1.27y₂² − 4.16y₃²</span> Mixed signs → indefinite (the energy can take both signs).
              </div>
            </details>

            <details className={`qa t ${doneMap['quad-t-26'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('quad-t-26')}
                <b className="qn">T2·Q26</b>
                <span className="qtx">What conic is 3x₁² + 22x₁x₂ + 3x₂² = 0? Transform to principal axes.</span>
              </summary>
              <div className="a">
                A = rows (3,11),(11,3), λ = 14, −8 with eigenvectors (1,1)/√2 and (1,−1)/√2. Put x₁ = (y₁+y₂)/√2, x₂ = (y₁−y₂)/√2: 14y₁² − 8y₂² = 0. Because the right side is 0 this is a hyperbola in degenerate form: <span className="ans">a pair of intersecting straight lines, y₂ = ±(√7/2)y₁</span>
              </div>
            </details>

            <details className={`qa t ${doneMap['quad-t-28'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('quad-t-28')}
                <b className="qn">T2·Q28</b>
                <span className="qtx">x² − 12xy + y² = 70. Find the modal matrix, canonical form and shape.</span>
              </summary>
              <div className="a">
                A = rows (1,−6),(−6,1), λ = 7, −5. Eigenvectors: λ=7: (1,−1); λ=−5: (1,1). Modal matrix P = (1/√2)·rows (1,1),(−1,1). Canonical: 7y₁² − 5y₂² = 70, i.e. y₁²/10 − y₂²/14 = 1 → <span className="ans">hyperbola</span>
              </div>
            </details>

            <details className={`qa t ${doneMap['quad-t-30'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('quad-t-30')}
                <b className="qn">T2·Q30</b>
                <span className="qtx">Is A = rows (1/√2, 0, −1/√2), (0, −1/√2, 1/√2), (−1/√2, 1/√2, 0) orthogonal?</span>
              </summary>
              <div className="a">
                Each row has length √(1/2 + 1/2) = 1, but R₁·R₂ = 0 + 0 − 1/2 = −1/2 ≠ 0. So AAᵀ ≠ I → <span className="ans">not orthogonal</span>
              </div>
            </details>

            <details className={`qa t ${doneMap['quad-t-31'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('quad-t-31')}
                <b className="qn">T2·Q31</b>
                <span className="qtx">7x² + 6xy + 7y² = 200. Find the principal-axes form, the type of conic and the semi-axes.</span>
              </summary>
              <div className="a">
                A = rows (7,3),(3,7), λ = 10, 4, eigenvectors (1,1)/√2 and (1,−1)/√2. Canonical: 10y₁² + 4y₂² = 200 → y₁²/20 + y₂²/50 = 1 → <span className="ans">ellipse</span>, semi-axes <span className="ans">√20 = 2√5 ≈ 4.47</span> (along (1,1)) and <span className="ans">√50 = 5√2 ≈ 7.07</span> (along (1,−1)).
              </div>
            </details>

            <details className={`qa t ${doneMap['quad-t-35'] ? 'isdone' : ''}`}>
              <summary>
                {renderDoneCheckbox('quad-t-35')}
                <b className="qn">T2·Q35</b>
                <span className="qtx">Find the orthogonal transformation that reduces 6x² + 3y² + 3z² − 4xy − 2yz + 4xz to canonical form.</span>
              </summary>
              <div className="a">
                A = rows (6,−2,2),(−2,3,−1),(2,−1,3), the same matrix as Q21: λ = 2, 2, 8. Orthonormal eigenvectors: (0,1,1)/√2, (1,1,−1)/√3 (for 2) and (2,−1,1)/√6 (for 8). Take these as the columns of P and X = PY: <span className="ans">Q = 2y₁² + 2y₂² + 8y₃²</span>
              </div>
            </details>
          </div>
        </section>

        {/* SECTION 7: PRACTICE CHECKLIST */}
        <section id="prac" style={{ ['--c' as string]: 'var(--ink)' }}>
          <h2>
            <span>Now practise</span>
            <span className="sp">
              {Object.values(practiceDone).filter(Boolean).length}/10
            </span>
          </h2>
          <p className="tag">Tick each question type once you can do it without looking. One full question per type, then move on.</p>
          <div className="chk">
            {[
              {
                title: 'Consistency check:',
                desc: 'reduce [A|B], compare rank A and rank[A|B] with n, then say unique, infinite or none.',
              },
              {
                title: "Cramer's rule:",
                desc: '3 × 3 system, verify by substituting back.',
              },
              {
                title: 'Independence test:',
                desc: 'stack vectors, find rank or |A|, decide independent or dependent.',
              },
              {
                title: 'Basis, dimension, nullity:',
                desc: 'find rank, then use nullity = columns − rank.',
              },
              {
                title: 'Subspace test:',
                desc: 'check non-empty and αa + βb ∈ S.',
              },
              {
                title: 'LU decomposition:',
                desc: 'get U, read L from multipliers (mind the sign), check L·U = A.',
              },
              {
                title: 'Eigenvalues and eigenvectors:',
                desc: '2 × 2 first, then 3 × 3.',
              },
              {
                title: 'Eigenvalue properties:',
                desc: 'use trace and determinant to find a missing eigenvalue.',
              },
              {
                title: 'Quadratic form to matrix:',
                desc: 'write A, remember the half on the cross terms.',
              },
              {
                title: 'Canonical form:',
                desc: 'eigenvalues, eigenvectors, normalize, P, then Q = λ₁y₁² + λ₂y₂² + …',
              },
            ].map((item, idx) => (
              <label key={idx}>
                <input
                  type="checkbox"
                  checked={!!practiceDone[idx]}
                  onChange={() => togglePracticeItem(idx)}
                />
                <span>
                  <b>{item.title}</b> {item.desc}
                </span>
              </label>
            ))}
          </div>
        </section>
      </main>

      <footer>
        Made from your handwritten notes. Worked answers for Cramer&apos;s z, the independence test and the eigenvectors were completed from the unfinished steps in the notes.
      </footer>
    </div>
  );
}
