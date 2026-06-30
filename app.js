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

  // Combine Like Terms - Interactive Step-by-Step
  const runLikeTerms = document.getElementById('run-likeTerms');
  const ltStepsContainer = document.getElementById('lt-steps-container');

  if (runLikeTerms) {
    runLikeTerms.addEventListener('click', () => {
      const a = Number(document.getElementById('lt-a').value);
      const b = Number(document.getElementById('lt-b').value);
      const c = Number(document.getElementById('lt-c').value);
      const d = Number(document.getElementById('lt-d').value);
      const variable = document.getElementById('lt-var1').value || 'x';
      const power = Number(document.getElementById('lt-pow1').value) || 1;

      const xCoeff = a + c;
      const constant = b + d;
      
      const powerStr = power === 1 ? '' : `<sup>${power}</sup>`;
      const termFormat = `${variable}${powerStr}`;
      const term1 = `${a}${termFormat}`;
      const term2 = `${c}${termFormat}`;
      const termFinal = `${xCoeff}${termFormat}`;

      const steps = [
        {
          title: 'Step 1: Look at our expression',
          visual: `<span class="term-box x-term">${term1}</span> <span class="term-box number-term">${signed(b)}</span> <span class="term-box x-term">${term2}</span> <span class="term-box number-term">${signed(d)}</span>`,
          explanation: `We have 4 terms: <strong>${term1}</strong>, <strong>${b}</strong>, <strong>${term2}</strong>, and <strong>${d}</strong>.`
        },
        {
          title: `Step 2: Find the ${variable}${powerStr} terms (blue)`,
          visual: `<span class="term-box x-term highlight">${term1}</span> <span class="term-box number-term">${signed(b)}</span> <span class="term-box x-term highlight">${term2}</span> <span class="term-box number-term">${signed(d)}</span>`,
          explanation: `Look for all terms with <strong>${variable}${powerStr}</strong> - those are <strong>like terms</strong>. We have <strong>${term1}</strong> and <strong>${term2}</strong>. They both have "${variable}${powerStr}", so we can add them!`
        },
        {
          title: 'Step 3: Find the number terms (orange)',
          visual: `<span class="term-box x-term">${term1}</span> <span class="term-box number-term highlight">${signed(b)}</span> <span class="term-box x-term">${term2}</span> <span class="term-box number-term highlight">${signed(d)}</span>`,
          explanation: `Look for all numbers without variables - those are <strong>like terms</strong> too. We have <strong>${b}</strong> and <strong>${d}</strong>. We can add them!`
        },
        {
          title: `Step 4: Group the ${variable}${powerStr} terms together`,
          visual: `<span style="font-size: 1.2rem; margin: 0 8px;">(</span><span class="term-box x-term">${term1}</span> <span class="term-box x-term">${term2}</span><span style="font-size: 1.2rem; margin: 0 8px;">)</span> + <span style="font-size: 1.2rem; margin: 0 8px;">(</span><span class="term-box number-term">${signed(b)}</span> <span class="term-box number-term">${signed(d)}</span><span style="font-size: 1.2rem; margin: 0 8px;">)</span>`,
          explanation: `Put parentheses around the ${variable}${powerStr} terms and the numbers. This helps us see what we're adding together.`
        },
        {
          title: `Step 5: Add the ${variable}${powerStr} terms`,
          visual: `<span class="term-box x-term">${termFinal}</span> <span class="term-box number-term">${signed(b)}</span> <span class="term-box number-term">${signed(d)}</span>`,
          explanation: `<strong>${a} + ${c} = ${xCoeff}</strong>, so <strong>${term1} + ${term2} = ${termFinal}</strong>`
        },
        {
          title: 'Step 6: Add the number terms',
          visual: `<span class="term-box x-term">${termFinal}</span> <span class="term-box number-term">${constant}</span>`,
          explanation: `<strong>${b} + ${d} = ${constant}</strong> (add the numbers without variables)`
        },
        {
          title: '✓ Final Answer',
          visual: `<span class="term-box x-term" style="padding: 16px 20px; font-size: 1.2rem; font-weight: 700;">${termFinal} ${signed(constant)}</span>`,
          explanation: `Perfect! We combined like terms to simplify the expression. Our answer is <strong>${termFinal} ${signed(constant)}</strong>.`
        }
      ];

      // Clear and rebuild steps container
      ltStepsContainer.innerHTML = '';
      steps.forEach((step, index) => {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'step-section';
        stepDiv.innerHTML = `
          <h4>${step.title}</h4>
          <div class="step-visual">${step.visual}</div>
          <p>${step.explanation}</p>
        `;
        ltStepsContainer.appendChild(stepDiv);
      });

      ltStepsContainer.style.display = 'block';
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
