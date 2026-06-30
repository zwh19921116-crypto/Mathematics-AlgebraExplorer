// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Navigation
  const menuLinks = document.querySelectorAll('.menu-link');
  const topics = document.querySelectorAll('.topic');

  function setActiveMenu(section) {
    menuLinks.forEach((link) => {
      if (link.dataset.section === section) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  function showTopic(sectionId) {
    topics.forEach((topic) => {
      topic.classList.remove('active');
    });
    const topic = document.getElementById(sectionId);
    if (topic) {
      topic.classList.add('active');
    }
  }

  menuLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = link.dataset.section;
      setActiveMenu(section);
      showTopic(section);
    });
  });

  // Initialize - show first topic on page load
  if (topics.length > 0) {
    const firstSection = topics[0].id;
    setActiveMenu(firstSection);
    showTopic(firstSection);
  }

  // Utility functions
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
      <p><strong>Answer:</strong> ${answerText}</p>
    `;
  }

  // Combine Like Terms
  const runLikeTerms = document.getElementById('run-likeTerms');
  if (runLikeTerms) {
    runLikeTerms.addEventListener('click', () => {
      const a = Number(document.getElementById('lt-a').value);
      const b = Number(document.getElementById('lt-b').value);
      const c = Number(document.getElementById('lt-c').value);
      const d = Number(document.getElementById('lt-d').value);

      const xCoeff = a + c;
      const constant = b + d;

      const steps = [
        `<strong>Expression:</strong> ${a}x ${signed(b)} ${c}x ${signed(d)}`,
        `<strong>Identify like terms:</strong> "${a}x" and "${c}x" both have the variable x (they're like terms). "${b}" and "${d}" are both constants (like terms).`,
        `<strong>Group by type:</strong> (${a}x ${signed(c)}x) ${signed(b)} ${signed(d)}`,
        `<strong>Add the x terms:</strong> ${a}x ${signed(c)}x = ${xCoeff}x (we can add them because they have the same variable)`,
        `<strong>Add the constants:</strong> ${b} ${signed(d)} = ${constant} (we can add them because they're both just numbers)`,
        `<strong>Final answer:</strong> ${xCoeff}x ${signed(constant)}`
      ];

      const answer = `${xCoeff}x ${signed(constant)}`;
      showResult('result-likeTerms', 'Solution', steps, answer);
    });
  }

  // Solve Linear Equation
  const runSolveEq = document.getElementById('run-solveEq');
  if (runSolveEq) {
    runSolveEq.addEventListener('click', () => {
      const a = Number(document.getElementById('se-a').value);
      const b = Number(document.getElementById('se-b').value);
      const c = Number(document.getElementById('se-c').value);
      const d = Number(document.getElementById('se-d').value);

      // Update equation display
      document.getElementById('eq-display').textContent = `${a}x ${signed(b)} = ${c}x ${signed(d)}`;

      const leftCoeff = a - c;
      const rightConst = d - b;

      if (leftCoeff === 0) {
        const msg = rightConst === 0
          ? 'All values work (infinite solutions)'
          : 'No solution exists';
        showResult('result-solveEq', 'Solution', [
          `Start: ${a}x ${signed(b)} = ${c}x ${signed(d)}`,
          `Subtract ${c}x: ${leftCoeff}x ${signed(b)} = ${d}`,
          `Result: 0x = ${rightConst}`
        ], msg);
        return;
      }

      const x = rightConst / leftCoeff;

      const steps = [
        `Start: ${a}x ${signed(b)} = ${c}x ${signed(d)}`,
        `Move x terms: ${leftCoeff}x ${signed(b)} = ${d}`,
        `Move constants: ${leftCoeff}x = ${rightConst}`,
        `Divide: x = ${fmt(x)}`
      ];

      showResult('result-solveEq', 'Solution', steps, `x = ${fmt(x)}`);
    });
  }

  // Distributive Property
  const runDistribute = document.getElementById('run-distribute');
  if (runDistribute) {
    runDistribute.addEventListener('click', () => {
      const k = Number(document.getElementById('dp-k').value);
      const m = Number(document.getElementById('dp-m').value);
      const n = Number(document.getElementById('dp-n').value);

      // Update equation display
      document.getElementById('dist-display').textContent = `${k}(${m}x ${signed(n)})`;

      const xCoeff = k * m;
      const constant = k * n;

      const steps = [
        `Start: ${k}(${m}x ${signed(n)})`,
        `Multiply ${k} × ${m}x = ${xCoeff}x`,
        `Multiply ${k} × ${n} = ${constant}`,
        `Result: ${xCoeff}x ${signed(constant)}`
      ];

      showResult('result-distribute', 'Solution', steps, `${xCoeff}x ${signed(constant)}`);
    });
  }

  // Practice Challenge
  let currentChallenge = null;

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const generateChallenge = document.getElementById('generate-challenge');
  if (generateChallenge) {
    generateChallenge.addEventListener('click', () => {
      let a = randomInt(2, 9);
      let c = randomInt(1, 6);
      while (a === c) {
        c = randomInt(1, 6);
      }

      const xValue = randomInt(-6, 9);
      const b = randomInt(-12, 12);
      const d = a * xValue + b - c * xValue;

      currentChallenge = { a, b, c, d, x: xValue };

      document.getElementById('challenge-question').textContent = `${a}x ${signed(b)} = ${c}x ${signed(d)}`;
      document.getElementById('challenge-answer').value = '';
      document.getElementById('challenge-feedback').textContent = '';
      document.getElementById('challenge-feedback').className = 'feedback';
    });
  }

  const checkChallenge = document.getElementById('check-challenge');
  if (checkChallenge) {
    checkChallenge.addEventListener('click', () => {
      const feedback = document.getElementById('challenge-feedback');

      if (!currentChallenge) {
        feedback.textContent = 'Generate a problem first';
        feedback.className = 'feedback bad';
        return;
      }

      const userAnswer = Number(document.getElementById('challenge-answer').value);
      if (Number.isNaN(userAnswer)) {
        feedback.textContent = 'Enter a number';
        feedback.className = 'feedback bad';
        return;
      }

      if (Math.abs(userAnswer - currentChallenge.x) < 1e-9) {
        feedback.textContent = `✓ Correct! x = ${currentChallenge.x}`;
        feedback.className = 'feedback ok';
      } else {
        feedback.textContent = `✗ Try again. Answer: x = ${currentChallenge.x}`;
        feedback.className = 'feedback bad';
      }
    });
  }
});
