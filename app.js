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

  function generateStepsForExample(a, b, c, d, variable, power) {
    const xCoeff = a + c;
    const constant = b + d;
    
    const powerStr = power === 1 ? '' : `<sup>${power}</sup>`;
    const termFormat = `${variable}${powerStr}`;
    const term1 = `${a}${termFormat}`;
    const term2 = `${c}${termFormat}`;
    const termFinal = `${xCoeff}${termFormat}`;

    return [
      {
        title: 'Step 1: Look at our expression',
        visual: `<span class="term-box x-term">${term1}</span> ${b !== 0 ? `<span class="term-box number-term">${signed(b)}</span>` : ''} <span class="term-box x-term">${term2}</span> ${d !== 0 ? `<span class="term-box number-term">${signed(d)}</span>` : ''}`,
        explanation: `We have terms: <strong>${term1}</strong>${b !== 0 ? `, <strong>${b}</strong>` : ''}, <strong>${term2}</strong>${d !== 0 ? `, <strong>${d}</strong>` : ''}.`
      },
      {
        title: `Step 2: Find the ${variable}${powerStr} terms (blue)`,
        visual: `<span class="term-box x-term highlight">${term1}</span> ${b !== 0 ? `<span class="term-box number-term">${signed(b)}</span>` : ''} <span class="term-box x-term highlight">${term2}</span> ${d !== 0 ? `<span class="term-box number-term">${signed(d)}</span>` : ''}`,
        explanation: `Look for all terms with <strong>${variable}${powerStr}</strong> - those are <strong>like terms</strong>. We have <strong>${term1}</strong> and <strong>${term2}</strong>. They both have "${variable}${powerStr}", so we can add them!`
      },
      ...(b !== 0 || d !== 0 ? [{
        title: 'Step 3: Find the number terms (orange)',
        visual: `<span class="term-box x-term">${term1}</span> ${b !== 0 ? `<span class="term-box number-term highlight">${signed(b)}</span>` : ''} <span class="term-box x-term">${term2}</span> ${d !== 0 ? `<span class="term-box number-term highlight">${signed(d)}</span>` : ''}`,
        explanation: `Look for all numbers without variables - those are <strong>like terms</strong> too. We have <strong>${b}</strong> and <strong>${d}</strong>. We can add them!`
      }] : []),
      {
        title: `Step 4: Group the ${variable}${powerStr} terms together`,
        visual: `<span style="font-size: 1.2rem; margin: 0 8px;">(</span><span class="term-box x-term">${term1}</span> <span class="term-box x-term">${term2}</span><span style="font-size: 1.2rem; margin: 0 8px;">)</span>${b !== 0 || d !== 0 ? ` + <span style="font-size: 1.2rem; margin: 0 8px;">(</span><span class="term-box number-term">${signed(b)}</span> <span class="term-box number-term">${signed(d)}</span><span style="font-size: 1.2rem; margin: 0 8px;">)</span>` : ''}`,
        explanation: `Put parentheses around the ${variable}${powerStr} terms${b !== 0 || d !== 0 ? ' and the numbers' : ''}. This helps us see what we're adding together.`
      },
      {
        title: `Step 5: Add the ${variable}${powerStr} terms`,
        visual: `<span class="term-box x-term">${termFinal}</span>${b !== 0 ? ` <span class="term-box number-term">${signed(b)}</span>` : ''}${d !== 0 ? ` <span class="term-box number-term">${signed(d)}</span>` : ''}`,
        explanation: `<strong>${a} + ${c} = ${xCoeff}</strong>, so <strong>${term1} + ${term2} = ${termFinal}</strong>`
      },
      ...(b !== 0 || d !== 0 ? [{
        title: 'Step 6: Add the number terms',
        visual: `<span class="term-box x-term">${termFinal}</span> <span class="term-box number-term">${constant}</span>`,
        explanation: `<strong>${b} + ${d} = ${constant}</strong> (add the numbers without variables)`
      }] : []),
      {
        title: '✓ Final Answer',
        visual: `<span class="term-box x-term" style="padding: 16px 20px; font-size: 1.2rem; font-weight: 700;">${termFinal}${constant !== 0 ? ` ${signed(constant)}` : ''}</span>`,
        explanation: `Perfect! Our answer is <strong>${termFinal}${constant !== 0 ? ` ${signed(constant)}` : ''}</strong>.`
      }
    ];
  }

  function showResult(containerId, title, steps, answerText) {
    const container = document.getElementById(containerId);
    container.innerHTML = `
      <h4>${title}</h4>
      <ol>${steps.map((step) => `<li>${step}</li>`).join('')}</ol>
      <p><strong>Answer:</strong> ${answerText}</p>
    `;
  }

  // Combine Like Terms - Preset Examples + Custom Input
  const ltExamplesContainer = document.getElementById('lt-examples');
  const ltStepsContainer = document.getElementById('lt-steps-container');
  const ltCustomInput = document.getElementById('lt-custom-input');
  const ltCustomBtn = document.getElementById('lt-custom-btn');
  const ltPow2Btn = document.getElementById('lt-pow2-btn');
  const ltPow3Btn = document.getElementById('lt-pow3-btn');

  const likeTermsExamples = [
    { display: '3x + 2x', a: 3, b: 0, c: 2, d: 0, var: 'x', pow: 1, label: 'x terms' },
    { display: '4y + 3y', a: 4, b: 0, c: 3, d: 0, var: 'y', pow: 1, label: 'y terms' },
    { display: '2y² + 5y²', a: 2, b: 0, c: 5, d: 0, var: 'y', pow: 2, label: 'y² terms' },
    { display: '3x + 5 + 2x - 1', a: 3, b: 5, c: 2, d: -1, var: 'x', pow: 1, label: 'mixed' }
  ];

  // Helper buttons for powers
  if (ltPow2Btn) {
    ltPow2Btn.addEventListener('click', () => {
      ltCustomInput.value += '^2';
      ltCustomInput.focus();
    });
  }

  if (ltPow3Btn) {
    ltPow3Btn.addEventListener('click', () => {
      ltCustomInput.value += '^3';
      ltCustomInput.focus();
    });
  }

  function parseCustomEquation(equation) {
    // Parse format like "3x + 2x + 5" or "3y^2 + 2y^2 + 5"
    const terms = [];
    // Split by + and - while keeping the operators
    const termStrings = equation.match(/[+-]?[^+-]+/g) || [];
    
    termStrings.forEach((termStr) => {
      termStr = termStr.trim();
      if (!termStr) return;
      
      // Match pattern: optional sign, coefficient, variable, optional power
      const match = termStr.match(/^([+-]?\s*\d*\.?\d+)?\s*([a-z]?)(\^(\d+))?/i);
      
      if (match) {
        let coefficient = match[1] ? parseFloat(match[1].replace(/\s/g, '')) : (match[2] ? 1 : 0);
        const variable = match[2] || '';
        const power = match[4] ? parseInt(match[4]) : (variable ? 1 : 0);
        
        if (variable === '' && !match[1]) return; // Skip if no valid term
        
        terms.push({ coef: coefficient, var: variable, pow: power });
      }
    });

    return terms;
  }

  function groupAndCombineTerms(terms) {
    const grouped = {};
    const constantTerms = [];

    terms.forEach((term) => {
      const key = term.var ? `${term.var}^${term.pow}` : 'constant';
      if (term.var) {
        grouped[key] = (grouped[key] || 0) + term.coef;
      } else {
        constantTerms.push(term.coef);
      }
    });

    return { grouped, constantSum: constantTerms.reduce((a, b) => a + b, 0) };
  }

  function displayStepsForCustom(equation) {
    try {
      const terms = parseCustomEquation(equation);
      if (terms.length === 0) {
        ltStepsContainer.innerHTML = '<p style="color: var(--danger); font-weight: 600;">No valid terms found. Try: 3x + 2x</p>';
        ltStepsContainer.style.display = 'block';
        return;
      }

      const { grouped, constantSum } = groupAndCombineTerms(terms);
      
      // Display steps
      ltStepsContainer.innerHTML = '';

      // Step 1: Show original terms
      const step1Div = document.createElement('div');
      step1Div.className = 'step-section';
      const termsDisplay = terms.map(t => {
        const powerStr = t.pow && t.pow > 1 ? `<sup>${t.pow}</sup>` : '';
        const term = t.var ? `${t.coef}${t.var}${powerStr}` : `${t.coef}`;
        return `<span class="term-box ${t.var ? 'x-term' : 'number-term'}">${term}</span>`;
      }).join(' ');

      step1Div.innerHTML = `
        <h4>Step 1: Look at all the terms</h4>
        <div class="step-visual">${termsDisplay}</div>
        <p>We need to combine terms that are exactly the same (same variable and same power).</p>
      `;
      ltStepsContainer.appendChild(step1Div);

      // Step 2+: Show each group
      Object.entries(grouped).forEach(([key, total]) => {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'step-section';
        const relatedTerms = terms.filter(t => (t.var ? `${t.var}^${t.pow}` : 'constant') === key);
        const displayTerms = relatedTerms.map(t => {
          const powerStr = t.pow && t.pow > 1 ? `<sup>${t.pow}</sup>` : '';
          return `<span class="term-box x-term">${t.coef}${t.var}${powerStr}</span>`;
        }).join(' ');

        stepDiv.innerHTML = `
          <h4>Combine ${key}:</h4>
          <div class="step-visual">${displayTerms}</div>
          <p>${relatedTerms.map(t => t.coef).join(' + ')} = <strong>${total}</strong></p>
        `;
        ltStepsContainer.appendChild(stepDiv);
      });

      // Final step
      const finalDiv = document.createElement('div');
      finalDiv.className = 'step-section';
      const finalTerms = Object.entries(grouped).map(([key, total]) => {
        return `<span class="term-box x-term" style="padding: 16px 20px; font-size: 1.1rem; font-weight: 700;">${total}${key.split('^')[0]}</span>`;
      }).join('');

      finalDiv.innerHTML = `
        <h4>✓ Final Answer:</h4>
        <div class="step-visual">${finalTerms}</div>
      `;
      ltStepsContainer.appendChild(finalDiv);
      ltStepsContainer.style.display = 'block';

    } catch (e) {
      ltStepsContainer.innerHTML = '<p style="color: var(--danger); font-weight: 600;">Error parsing equation. Try: 3x + 2x</p>';
      ltStepsContainer.style.display = 'block';
    }
  }

  function displaySteps(example) {
    // Convert display format to input format (² to ^2, ³ to ^3, etc.)
    let inputFormat = example.display
      .replace(/²/g, '^2')
      .replace(/³/g, '^3')
      .replace(/⁴/g, '^4')
      .replace(/⁵/g, '^5');
    
    // Populate the custom input field
    ltCustomInput.value = inputFormat;
    
    // Show the steps
    const steps = generateStepsForExample(example.a, example.b, example.c, example.d, example.var, example.pow);
    
    ltStepsContainer.innerHTML = '';
    steps.forEach((step) => {
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
    
    // Update active card
    document.querySelectorAll('.example-card').forEach(card => card.classList.remove('active'));
  }

  // Custom equation handler
  if (ltCustomBtn) {
    ltCustomBtn.addEventListener('click', () => {
      const equation = ltCustomInput.value.trim();
      if (!equation) {
        alert('Please enter an equation like: 3x + 2x');
        return;
      }
      displayStepsForCustom(equation);
      document.querySelectorAll('.example-card').forEach(card => card.classList.remove('active'));
    });
  }

  // Allow Enter key
  if (ltCustomInput) {
    ltCustomInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        ltCustomBtn.click();
      }
    });
  }

  // Create example cards
  likeTermsExamples.forEach((example) => {
    const card = document.createElement('button');
    card.className = 'example-card';
    card.innerHTML = example.display;
    card.addEventListener('click', () => displaySteps(example));
    ltExamplesContainer.appendChild(card);
  });

  // Solve Linear Equation - Preset Examples + Custom Input
  const seExamplesContainer = document.getElementById('se-examples');
  const seStepsContainer = document.getElementById('se-steps-container');
  const seCustomInput = document.getElementById('se-custom-input');
  const seCustomBtn = document.getElementById('se-custom-btn');

  const solveEqExamples = [
    { display: '5x + 3 = 2x + 15', a: 5, b: 3, c: 2, d: 15 },
    { display: '3x + 2 = x + 8', a: 3, b: 2, c: 1, d: 8 },
    { display: '2x - 4 = x + 1', a: 2, b: -4, c: 1, d: 1 },
    { display: '4x + 5 = 3x + 9', a: 4, b: 5, c: 3, d: 9 }
  ];

  function generateSolveEqSteps(a, b, c, d) {
    const leftCoeff = a - c;
    const rightConst = d - b;
    const x = rightConst / leftCoeff;

    const steps = [
      {
        title: 'Step 1: Look at the equation',
        visual: `<span style="font-size: 1.2rem; font-weight: 600; color: var(--brand-deep);">${a}x ${signed(b)} = ${c}x ${signed(d)}</span>`,
        explanation: `We need to get all x terms on one side and all numbers on the other side.`
      },
      {
        title: `Step 2: Move x terms to the left`,
        visual: `<span style="font-size: 1.2rem; font-weight: 600; color: var(--brand-deep);">${a}x ${signed(b)} - ${c}x = ${d}</span>`,
        explanation: `Subtract ${c}x from both sides: ${a}x - ${c}x = ${leftCoeff}x`
      },
      {
        title: `Step 3: Simplify left side`,
        visual: `<span style="font-size: 1.2rem; font-weight: 600; color: var(--brand-deep);">${leftCoeff}x ${signed(b)} = ${d}</span>`,
        explanation: `We now have ${leftCoeff}x ${signed(b)} on the left.`
      },
      {
        title: `Step 4: Move constants to the right`,
        visual: `<span style="font-size: 1.2rem; font-weight: 600; color: var(--brand-deep);">${leftCoeff}x = ${d} ${signed(-b)}</span>`,
        explanation: `Subtract ${b} from both sides.`
      },
      {
        title: `Step 5: Simplify right side`,
        visual: `<span style="font-size: 1.2rem; font-weight: 600; color: var(--brand-deep);">${leftCoeff}x = ${rightConst}</span>`,
        explanation: `${d} ${signed(-b)} = ${rightConst}`
      },
      {
        title: `Step 6: Divide to isolate x`,
        visual: `<span style="font-size: 1.2rem; font-weight: 600; color: var(--brand-deep);">x = ${rightConst} ÷ ${leftCoeff}</span>`,
        explanation: `Divide both sides by ${leftCoeff} to isolate x.`
      },
      {
        title: '✓ Final Answer',
        visual: `<span style="font-size: 1.4rem; font-weight: 700; color: var(--brand-deep); background: rgba(10, 126, 164, 0.1); padding: 16px 24px; border-radius: 10px;">x = ${fmt(x)}</span>`,
        explanation: `The solution is <strong>x = ${fmt(x)}</strong>`
      }
    ];

    return steps;
  }

  function displaySolveEqSteps(example) {
    // Populate the custom input field
    seCustomInput.value = example.display;
    
    // Show the steps
    const steps = generateSolveEqSteps(example.a, example.b, example.c, example.d);
    
    seStepsContainer.innerHTML = '';
    steps.forEach((step) => {
      const stepDiv = document.createElement('div');
      stepDiv.className = 'step-section';
      stepDiv.innerHTML = `
        <h4>${step.title}</h4>
        <div class="step-visual">${step.visual}</div>
        <p>${step.explanation}</p>
      `;
      seStepsContainer.appendChild(stepDiv);
    });

    seStepsContainer.style.display = 'block';
  }

  function parseSolveEqCustom(equation) {
    // Parse format: "5x + 3 = 2x + 15"
    const [left, right] = equation.split('=');
    if (!left || !right) return null;

    const parseExpression = (expr) => {
      expr = expr.trim();
      // Match: coefficient*x + constant
      const xMatch = expr.match(/([+-]?\s*\d*\.?\d*)\s*x/i);
      const constMatch = expr.match(/([+-]?\s*\d+\.?\d*)\s*$/) || expr.match(/([+-]\s*\d+\.?\d*)/);
      
      const coef = xMatch ? parseFloat(xMatch[1].replace(/\s/g, '') || 1) : 0;
      const constant = constMatch ? parseFloat(constMatch[1].replace(/\s/g, '') || 0) : 0;
      
      return { coef, constant };
    };

    const leftParts = parseExpression(left);
    const rightParts = parseExpression(right);
    
    if (!leftParts || !rightParts) return null;
    
    return {
      a: leftParts.coef,
      b: leftParts.constant,
      c: rightParts.coef,
      d: rightParts.constant
    };
  }

  // Custom equation handler
  if (seCustomBtn) {
    seCustomBtn.addEventListener('click', () => {
      const equation = seCustomInput.value.trim();
      if (!equation) {
        alert('Please enter an equation like: 5x + 3 = 2x + 15');
        return;
      }
      
      const parsed = parseSolveEqCustom(equation);
      if (!parsed) {
        alert('Invalid format. Use: ax + b = cx + d');
        return;
      }

      const steps = generateSolveEqSteps(parsed.a, parsed.b, parsed.c, parsed.d);
      
      seStepsContainer.innerHTML = '';
      steps.forEach((step) => {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'step-section';
        stepDiv.innerHTML = `
          <h4>${step.title}</h4>
          <div class="step-visual">${step.visual}</div>
          <p>${step.explanation}</p>
        `;
        seStepsContainer.appendChild(stepDiv);
      });

      seStepsContainer.style.display = 'block';
    });
  }

  // Allow Enter key
  if (seCustomInput) {
    seCustomInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        seCustomBtn.click();
      }
    });
  }

  // Create example cards
  solveEqExamples.forEach((example) => {
    const card = document.createElement('button');
    card.className = 'example-card';
    card.innerHTML = example.display;
    card.addEventListener('click', () => displaySolveEqSteps(example));
    seExamplesContainer.appendChild(card);
  });

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
});
