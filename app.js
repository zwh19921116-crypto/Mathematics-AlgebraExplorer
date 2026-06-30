// Navigation
const navLinks = document.querySelectorAll('.nav-link');

function setActiveLink(section) {
  navLinks.forEach((link) => {
    if (link.dataset.section === section) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

navLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const section = link.dataset.section;
    setActiveLink(section);

    const target = document.getElementById(section);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Update active link on scroll
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('[id^="intro"], [id^="topic-"]');
  let current = '';

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (window.pageYOffset >= sectionTop - 100) {
      current = section.getAttribute('id');
    }
  });

  if (current) {
    setActiveLink(current);
  }
});

const fmt = (value) => {
  if (Number.isInteger(value)) {
    return String(value);
  }
  return value.toFixed(2).replace(/\.00$/, '');
};

const signed = (n) => (n < 0 ? `- ${Math.abs(n)}` : `+ ${n}`);

function showResult(containerId, title, steps, answerText) {
  const container = document.getElementById(containerId);
  container.innerHTML = `
    <h4>${title}</h4>
    <ol>${steps.map((step) => `<li>${step}</li>`).join('')}</ol>
    <p><strong>Final answer:</strong> ${answerText}</p>
  `;
}

document.getElementById('run-likeTerms').addEventListener('click', () => {
  const a = Number(document.getElementById('lt-a').value);
  const b = Number(document.getElementById('lt-b').value);
  const c = Number(document.getElementById('lt-c').value);
  const d = Number(document.getElementById('lt-d').value);

  const xCoeff = a + c;
  const constant = b + d;

  const steps = [
    `Write the expression: ${a}x ${signed(b)} ${c}x ${signed(d)}.`,
    `Group like terms: (${a}x + ${c}x) + (${b} ${signed(d)}).`,
    `Add x terms: ${a}x + ${c}x = ${xCoeff}x.`,
    `Add constants: ${b} ${signed(d)} = ${constant}.`
  ];

  const answer = `${xCoeff}x ${signed(constant)}`;
  showResult('result-likeTerms', 'How to combine like terms', steps, answer);
});

document.getElementById('run-solveEq').addEventListener('click', () => {
  const a = Number(document.getElementById('se-a').value);
  const b = Number(document.getElementById('se-b').value);
  const c = Number(document.getElementById('se-c').value);
  const d = Number(document.getElementById('se-d').value);

  const leftCoeff = a - c;
  const rightConst = d - b;

  if (leftCoeff === 0) {
    const msg = rightConst === 0
      ? 'Infinitely many solutions (both sides are identical).'
      : 'No solution (variable terms cancel, but constants are different).';
    showResult('result-solveEq', 'How to solve the equation', [
      `Start with ${a}x ${signed(b)} = ${c}x ${signed(d)}.`,
      `Move variable terms to one side and constants to the other.`,
      `You get 0x = ${rightConst}.`
    ], msg);
    return;
  }

  const x = rightConst / leftCoeff;

  const steps = [
    `Start with ${a}x ${signed(b)} = ${c}x ${signed(d)}.`,
    `Subtract ${c}x from both sides: ${leftCoeff}x ${signed(b)} = ${d}.`,
    `Subtract ${b} from both sides: ${leftCoeff}x = ${rightConst}.`,
    `Divide both sides by ${leftCoeff}: x = ${fmt(x)}.`
  ];

  showResult('result-solveEq', 'How to solve a linear equation', steps, `x = ${fmt(x)}`);
});

document.getElementById('run-distribute').addEventListener('click', () => {
  const k = Number(document.getElementById('dp-k').value);
  const m = Number(document.getElementById('dp-m').value);
  const n = Number(document.getElementById('dp-n').value);

  const xCoeff = k * m;
  const constant = k * n;

  const steps = [
    `Start with ${k}(${m}x ${signed(n)}).`,
    `Multiply ${k} by ${m}x to get ${xCoeff}x.`,
    `Multiply ${k} by ${n} to get ${constant}.`,
    `Put the terms together: ${xCoeff}x ${signed(constant)}.`
  ];

  showResult('result-distribute', 'How to distribute', steps, `${xCoeff}x ${signed(constant)}`);
});

let currentChallenge = null;

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

document.getElementById('generate-challenge').addEventListener('click', () => {
  let a = randomInt(2, 9);
  let c = randomInt(1, 6);
  while (a === c) {
    c = randomInt(1, 6);
  }

  const xValue = randomInt(-6, 9);
  const b = randomInt(-12, 12);
  const d = a * xValue + b - c * xValue;

  currentChallenge = { a, b, c, d, x: xValue };

  document.getElementById('challenge-question').textContent = `${a}x ${signed(b)} = ${c}x ${signed(d)}. Solve for x.`;
  document.getElementById('challenge-feedback').textContent = '';
  document.getElementById('challenge-feedback').className = 'feedback';
  document.getElementById('challenge-answer').value = '';
});

document.getElementById('check-challenge').addEventListener('click', () => {
  const feedback = document.getElementById('challenge-feedback');

  if (!currentChallenge) {
    feedback.textContent = 'Generate a challenge first.';
    feedback.className = 'feedback bad';
    return;
  }

  const userAnswer = Number(document.getElementById('challenge-answer').value);
  if (Number.isNaN(userAnswer)) {
    feedback.textContent = 'Enter a number for x.';
    feedback.className = 'feedback bad';
    return;
  }

  if (Math.abs(userAnswer - currentChallenge.x) < 1e-9) {
    feedback.textContent = `Correct. Nice work. x = ${currentChallenge.x}.`;
    feedback.className = 'feedback ok';
  } else {
    feedback.textContent = `Not quite. The correct answer is x = ${currentChallenge.x}.`;
    feedback.className = 'feedback bad';
  }
});
