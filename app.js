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

    const steps = [];
    let stepNum = 1;

    // Step 1: Look at expression
    steps.push({
      title: `Step ${stepNum}: Look at our expression`,
      visual: `<span class="term-box x-term">${term1}</span> ${b !== 0 ? `<span class="term-box number-term">${signed(b)}</span>` : ''} <span class="term-box x-term">${term2}</span> ${d !== 0 ? `<span class="term-box number-term">${signed(d)}</span>` : ''}`,
      explanation: `We have terms: <strong>${term1}</strong>${b !== 0 ? `, <strong>${b}</strong>` : ''}, <strong>${term2}</strong>${d !== 0 ? `, <strong>${d}</strong>` : ''}.`
    });
    stepNum++;

    // Step 2: Find variable terms
    steps.push({
      title: `Step ${stepNum}: Find the ${variable}${powerStr} terms (blue)`,
      visual: `<span class="term-box x-term highlight">${term1}</span> ${b !== 0 ? `<span class="term-box number-term">${signed(b)}</span>` : ''} <span class="term-box x-term highlight">${term2}</span> ${d !== 0 ? `<span class="term-box number-term">${signed(d)}</span>` : ''}`,
      explanation: `Look for all terms with <strong>${variable}${powerStr}</strong> - those are <strong>like terms</strong>. We have <strong>${term1}</strong> and <strong>${term2}</strong>. They both have \"${variable}${powerStr}\", so we can add them!`
    });
    stepNum++;

    // Step 3 (conditional): Find number terms
    if (b !== 0 || d !== 0) {
      steps.push({
        title: `Step ${stepNum}: Find the number terms (orange)`,
        visual: `<span class="term-box x-term">${term1}</span> ${b !== 0 ? `<span class="term-box number-term highlight">${signed(b)}</span>` : ''} <span class="term-box x-term">${term2}</span> ${d !== 0 ? `<span class="term-box number-term highlight">${signed(d)}</span>` : ''}`,
        explanation: `Look for all numbers without variables - those are <strong>like terms</strong> too. We have <strong>${b}</strong> and <strong>${d}</strong>. We can add them!`
      });
      stepNum++;

      // Step 4: Group both
      steps.push({
        title: `Step ${stepNum}: Group the variable and number terms`,
        visual: `<span style="font-size: 1.2rem; margin: 0 8px;">(</span><span class="term-box x-term">${term1}</span> <span class="term-box x-term">${term2}</span><span style="font-size: 1.2rem; margin: 0 8px;">)</span> + <span style="font-size: 1.2rem; margin: 0 8px;">(</span><span class="term-box number-term">${signed(b)}</span> <span class="term-box number-term">${signed(d)}</span><span style="font-size: 1.2rem; margin: 0 8px;">)</span>`,
        explanation: `Put parentheses around the ${variable}${powerStr} terms and the numbers. This helps us see what we're adding together.`
      });
      stepNum++;
    }

    // Step for adding variable terms
    steps.push({
      title: `Step ${stepNum}: Add the ${variable}${powerStr} terms`,
      visual: `<span class="term-box x-term">${termFinal}</span>${b !== 0 ? ` <span class="term-box number-term">${signed(b)}</span>` : ''}${d !== 0 ? ` <span class="term-box number-term">${signed(d)}</span>` : ''}`,
      explanation: `<strong>${a} + ${c} = ${xCoeff}</strong>, so <strong>${term1} + ${term2} = ${termFinal}</strong>`
    });
    stepNum++;

    // Final step: Add number terms (if any)
    if (b !== 0 || d !== 0) {
      steps.push({
        title: `Step ${stepNum}: Add the number terms`,
        visual: `<span class="term-box x-term">${termFinal}</span> <span class="term-box number-term">${constant}</span>`,
        explanation: `<strong>${b} + ${d} = ${constant}</strong> (add the numbers without variables)`
      });
      stepNum++;
    }

    // Final Answer
    steps.push({
      title: '✓ Final Answer',
      visual: `<span class="term-box x-term" style="padding: 16px 20px; font-size: 1.2rem; font-weight: 700;">${termFinal}${constant !== 0 ? ` ${signed(constant)}` : ''}</span>`,
      explanation: `Perfect! Our answer is <strong>${termFinal}${constant !== 0 ? ` ${signed(constant)}` : ''}</strong>.`
    });

    return steps;
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
        title: 'Step 1: Write the equation',
        visual: `<div style="background: rgba(10, 126, 164, 0.1); padding: 16px; border-radius: 8px; border-left: 4px solid var(--brand);">
          <span style="font-size: 1.3rem; font-weight: 700; color: var(--brand-deep);">${a}x ${signed(b)} = ${c}x ${signed(d)}</span>
        </div>`,
        explanation: `This is what we're solving. Goal: Get x by itself on one side.`
      },
      {
        title: `Step 2, 3 & 4: Solve`,
        visual: `<div style="background: rgba(255, 122, 89, 0.1); padding: 20px; border-radius: 8px; border-left: 4px solid var(--accent);">
          <div style="font-family: 'Courier New', monospace; font-size: 1.1rem; line-height: 2.6; color: var(--brand-deep); font-weight: 600; text-align: center;">
            <div style="margin-bottom: 14px; padding: 10px; background: rgba(255,255,255,0.5); border-radius: 6px;">${a}x ${signed(b)} = ${c}x ${signed(d)}</div>
            
            <div style="margin-bottom: 8px; display: flex; justify-content: center; gap: 60px; font-size: 0.9rem;">
              <div style="display: inline-flex; align-items: center; background: rgba(217, 74, 74, 0.2); color: #d94a4a; padding: 6px 12px; border-radius: 20px; border: 2px solid #d94a4a; font-weight: 700;">
                −${c}x
              </div>
              <div style="display: inline-flex; align-items: center; background: rgba(217, 74, 74, 0.2); color: #d94a4a; padding: 6px 12px; border-radius: 20px; border: 2px solid #d94a4a; font-weight: 700;">
                −${c}x
              </div>
            </div>
            
            <div style="margin-bottom: 14px; padding: 10px; background: rgba(31, 138, 72, 0.15); border-radius: 6px; color: var(--brand-deep);">${leftCoeff}x ${signed(b)} = ${d}</div>
            
            <div style="margin-bottom: 8px; display: flex; justify-content: center; gap: 60px; font-size: 0.9rem;">
              <div style="display: inline-flex; align-items: center; background: rgba(217, 74, 74, 0.2); color: #d94a4a; padding: 6px 12px; border-radius: 20px; border: 2px solid #d94a4a; font-weight: 700;">
                −${b}
              </div>
              <div style="display: inline-flex; align-items: center; background: rgba(217, 74, 74, 0.2); color: #d94a4a; padding: 6px 12px; border-radius: 20px; border: 2px solid #d94a4a; font-weight: 700;">
                −${b}
              </div>
            </div>
            
            <div style="margin-bottom: 14px; padding: 10px; background: rgba(31, 138, 72, 0.15); border-radius: 6px; color: var(--brand-deep);">${leftCoeff}x = ${rightConst}</div>
            
            <div style="margin-bottom: 8px; display: flex; justify-content: center; gap: 60px; font-size: 0.9rem;">
              <div style="display: inline-flex; align-items: center; background: rgba(217, 74, 74, 0.2); color: #d94a4a; padding: 6px 12px; border-radius: 20px; border: 2px solid #d94a4a; font-weight: 700;">
                ÷${leftCoeff}
              </div>
              <div style="display: inline-flex; align-items: center; background: rgba(217, 74, 74, 0.2); color: #d94a4a; padding: 6px 12px; border-radius: 20px; border: 2px solid #d94a4a; font-weight: 700;">
                ÷${leftCoeff}
              </div>
            </div>
            
            <div style="padding: 10px; background: rgba(31, 138, 72, 0.2); border-radius: 6px; border-left: 3px solid var(--success);">
              <div style="color: var(--success); font-weight: 700; font-size: 1.2rem;">x = ${fmt(x)}</div>
            </div>
          </div>
        </div>`,
        explanation: `Move x terms to one side and constants to the other, then solve for x.`
      },
      {
        title: '✓ Solution',
        visual: `<div style="background: rgba(31, 138, 72, 0.15); padding: 20px; border-radius: 8px; border-left: 4px solid var(--success); text-align: center;">
          <span style="font-size: 1.5rem; font-weight: 700; color: var(--success);">x = ${fmt(x)}</span>
        </div>`,
        explanation: `Check: Plug ${fmt(x)} back into the original equation to verify it works!`
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
  const distExamplesContainer = document.getElementById('dist-examples');
  const distStepsContainer = document.getElementById('dist-steps-container');
  const distCustomInput = document.getElementById('dist-custom-input');
  const distCustomBtn = document.getElementById('dist-custom-btn');

  const distributeExamples = [
    { display: '3(2x + 5)', k: 3, m: 2, n: 5 },
    { display: '4(3x - 2)', k: 4, m: 3, n: -2 },
    { display: '-2(x + 4)', k: -2, m: 1, n: 4 },
    { display: '5(4x - 3)', k: 5, m: 4, n: -3 }
  ];

  function generateDistributeSteps(k, m, n) {
    const xCoeff = k * m;
    const constant = k * n;

    const steps = [
      {
        title: 'Step 1: Write the expression',
        visual: `<div style="background: rgba(10, 126, 164, 0.1); padding: 16px; border-radius: 8px; border-left: 4px solid var(--brand);">
          <span style="font-size: 1.3rem; font-weight: 700; color: var(--brand-deep);">${k}(${m}x ${signed(n)})</span>
        </div>`,
        explanation: `The distributive property says: multiply ${k} by EACH term inside the parentheses.`
      },
      {
        title: `Step 2: Multiply ${k} × ${m}x`,
        visual: `<div style="background: rgba(255, 122, 89, 0.1); padding: 16px; border-radius: 8px; border-left: 4px solid var(--accent);">
          <div style="font-size: 1.1rem;"><strong>${k} × ${m}x = ${xCoeff}x</strong></div>
          <div style="margin-top: 8px; font-size: 0.95rem; color: var(--muted);">Multiply the outside number by the x term</div>
        </div>`,
        explanation: `First, distribute ${k} to the x term: ${k} × ${m}x = ${xCoeff}x`
      },
      {
        title: `Step 3: Multiply ${k} × ${n}`,
        visual: `<div style="background: rgba(255, 122, 89, 0.1); padding: 16px; border-radius: 8px; border-left: 4px solid var(--accent);">
          <div style="font-size: 1.1rem;"><strong>${k} × ${n} = ${constant}</strong></div>
          <div style="margin-top: 8px; font-size: 0.95rem; color: var(--muted);">Then multiply the outside number by the constant</div>
        </div>`,
        explanation: `Next, distribute ${k} to the constant: ${k} × ${n} = ${constant}`
      },
      {
        title: '✓ Final Answer',
        visual: `<div style="background: rgba(31, 138, 72, 0.15); padding: 20px; border-radius: 8px; border-left: 4px solid var(--success); text-align: center;">
          <span style="font-size: 1.4rem; font-weight: 700; color: var(--success);">${xCoeff}x ${signed(constant)}</span>
        </div>`,
        explanation: `Combine the results: ${k}(${m}x ${signed(n)}) = ${xCoeff}x ${signed(constant)}`
      }
    ];

    return steps;
  }

  function displayDistributeSteps(example) {
    distCustomInput.value = example.display;
    distStepsContainer.innerHTML = '';

    const steps = generateDistributeSteps(example.k, example.m, example.n);
    steps.forEach((step) => {
      const stepDiv = document.createElement('div');
      stepDiv.className = 'step-section';
      stepDiv.innerHTML = `
        <h4>${step.title}</h4>
        <div class="step-visual">${step.visual}</div>
        <p>${step.explanation}</p>
      `;
      distStepsContainer.appendChild(stepDiv);
    });

    distStepsContainer.style.display = 'block';
  }

  if (distCustomBtn) {
    distCustomBtn.addEventListener('click', () => {
      try {
        const expr = distCustomInput.value.trim();
        if (!expr) return;
        // Parse format: k(mx + n) or similar
        const match = expr.match(/(-?\d+)\s*\(\s*(-?\d+)?\s*x?\s*([+\-]\s*\d+)?\s*\)/);
        if (!match) {
          alert('Invalid format. Use: k(mx + n)');
          return;
        }
        const k = parseInt(match[1]);
        const m = match[2] ? parseInt(match[2]) : 1;
        const n = match[3] ? parseInt(match[3].replace(/\s/g, '')) : 0;
        displayDistributeSteps({ display: expr, k, m, n });
      } catch (e) {
        distStepsContainer.innerHTML = '<p style="color: var(--danger);">Invalid format. Try: 3(2x + 5)</p>';
        distStepsContainer.style.display = 'block';
      }
    });
  }

  if (distCustomInput) {
    distCustomInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        distCustomBtn.click();
      }
    });
  }

  distributeExamples.forEach((example) => {
    const card = document.createElement('button');
    card.className = 'example-card';
    card.innerHTML = example.display;
    card.addEventListener('click', () => displayDistributeSteps(example));
    distExamplesContainer.appendChild(card);
  });

  // ========== VARIABLES & EXPRESSIONS ==========
  const varExamplesContainer = document.getElementById('var-examples');
  const varStepsContainer = document.getElementById('var-steps-container');
  const varCustomInput = document.getElementById('var-custom-input');
  const varCustomBtn = document.getElementById('var-custom-btn');

  const varExamples = [
    { display: '3x + 5', terms: ['3x', '5'] },
    { display: '2y - 4', terms: ['2y', '-4'] },
    { display: '5a + 3b + 7', terms: ['5a', '3b', '7'] },
    { display: '4x² + 2x + 8', terms: ['4x²', '2x', '8'] }
  ];

  function displayVarSteps(example) {
    varCustomInput.value = example.display;
    varStepsContainer.innerHTML = '';

    const steps = [
      {
        title: 'Step 1: Original expression',
        visual: `<div style="background: rgba(10, 126, 164, 0.1); padding: 16px; border-radius: 8px; border-left: 4px solid var(--brand);">
          <span style="font-size: 1.3rem; font-weight: 700; color: var(--brand-deep);">${example.display}</span>
        </div>`,
        explanation: 'An expression contains variables (letters) and numbers combined with operations.'
      },
      {
        title: 'Step 2: Identify each term',
        visual: `<div style="background: rgba(255, 122, 89, 0.1); padding: 20px; border-radius: 8px; border-left: 4px solid var(--accent);">
          <div style="font-size: 1.1rem; font-weight: 600; color: var(--brand-deep); margin-bottom: 12px;">
            Terms (separated by + or −):
          </div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap; justify-content: center;">
            ${example.terms.map(t => `<div style="background: rgba(10, 126, 164, 0.3); padding: 8px 12px; border-radius: 6px; font-weight: 700; color: var(--brand-deep);">${t}</div>`).join('')}
          </div>
          <div style="margin-top: 12px; color: #666; font-size: 0.95rem; text-align: center;">
            Total: ${example.terms.length} term${example.terms.length !== 1 ? 's' : ''}
          </div>
        </div>`,
        explanation: `Terms are separated by + and −. This expression has ${example.terms.length} terms: ${example.terms.join(', ')}`
      },
      {
        title: 'Step 3: Break down each term',
        visual: `<div style="background: rgba(31, 138, 72, 0.1); padding: 20px; border-radius: 8px; border-left: 4px solid var(--success);">
          <div style="font-size: 0.95rem; color: var(--brand-deep); line-height: 2.2;">
            <div style="padding: 10px; background: rgba(31, 138, 72, 0.2); border-radius: 4px; margin-bottom: 8px;">
              <strong style="color: var(--success);">Coefficient:</strong> The number multiplying the variable
            </div>
            <div style="padding: 10px; background: rgba(31, 138, 72, 0.2); border-radius: 4px; margin-bottom: 8px;">
              <strong style="color: var(--success);">Variable:</strong> The letter (x, y, a, etc.)
            </div>
            <div style="padding: 10px; background: rgba(31, 138, 72, 0.2); border-radius: 4px; margin-bottom: 8px;">
              <strong style="color: var(--success);">Exponent:</strong> The small number showing power (x², y³, etc.)
            </div>
            <div style="padding: 10px; background: rgba(31, 138, 72, 0.2); border-radius: 4px;">
              <strong style="color: var(--success);">Constant:</strong> A number with no variable
            </div>
          </div>
        </div>`,
        explanation: 'Example: In 3x², the coefficient is 3, variable is x, and exponent is 2.'
      },
      {
        title: 'Step 4: Analyze your expression',
        visual: `<div style="background: rgba(31, 138, 72, 0.15); padding: 20px; border-radius: 8px; border-left: 4px solid var(--success);">
          <div style="font-size: 0.95rem; color: var(--brand-deep); line-height: 2.4;">
            ${example.terms.map((term, idx) => {
              const isCoeffVar = /^[+-]?\d*[a-zA-Z]/.test(term);
              const hasExponent = /\^/.test(term) || /[²³]/.test(term);
              
              let analysis = '';
              if (isCoeffVar) {
                const coeffMatch = term.match(/^[+-]?\d*/);
                const coeff = coeffMatch[0] || '1';
                const varPart = term.replace(/^[+-]?\d*/, '');
                analysis = `<strong style="color: var(--success);">${term}</strong> = Coefficient: ${coeff}, Variable: ${varPart.replace(/[\^²³]/g, '')}${hasExponent ? ', has exponent' : ''}`;
              } else {
                analysis = `<strong style="color: var(--success);">${term}</strong> = Constant (no variable)`;
              }
              
              return `<div style="padding: 12px; background: rgba(255, 255, 255, 0.8); border-radius: 6px; margin-bottom: 8px;">${analysis}</div>`;
            }).join('')}
          </div>
        </div>`,
        explanation: `Breaking down the expression "${example.display}": Each term has been identified and its parts analyzed.`
      }
    ];

    steps.forEach((step) => {
      const stepDiv = document.createElement('div');
      stepDiv.className = 'step-section';
      stepDiv.innerHTML = `
        <h4>${step.title}</h4>
        <div class="step-visual">${step.visual}</div>
        <p>${step.explanation}</p>
      `;
      varStepsContainer.appendChild(stepDiv);
    });

    varStepsContainer.style.display = 'block';
  }

  if (varCustomBtn) {
    varCustomBtn.addEventListener('click', () => {
      const expr = varCustomInput.value.trim();
      if (!expr) {
        alert('Please enter an expression');
        return;
      }
      displayVarSteps({ display: expr, terms: expr.split(/[+\-]/).map(t => t.trim()) });
    });
  }

  varExamples.forEach((example) => {
    const card = document.createElement('button');
    card.className = 'example-card';
    card.innerHTML = example.display;
    card.addEventListener('click', () => displayVarSteps(example));
    varExamplesContainer.appendChild(card);
  });

  // ========== ORDER OF OPERATIONS (PEMDAS) ==========
  const pemdasExamplesContainer = document.getElementById('pemdas-examples');
  const pemdasStepsContainer = document.getElementById('pemdas-steps-container');
  const pemdasCustomInput = document.getElementById('pemdas-custom-input');
  const pemdasCustomBtn = document.getElementById('pemdas-custom-btn');

  const pemdasExamples = [
    { display: '2 + 3 × 4', solution: 14 },
    { display: '(2 + 3) × 4', solution: 20 },
    { display: '10 - 2 × 3', solution: 4 },
    { display: '20 ÷ 4 + 3', solution: 8 }
  ];

  function displayPemdasSteps(example) {
    pemdasCustomInput.value = example.display;
    pemdasStepsContainer.innerHTML = '';

    // Parse the expression to show detailed steps
    let steps = [];
    const expr = example.display;
    
    steps.push({
      title: 'Step 1: Original expression',
      visual: `<div style="background: rgba(10, 126, 164, 0.1); padding: 16px; border-radius: 8px; border-left: 4px solid var(--brand);">
        <span style="font-size: 1.3rem; font-weight: 700; color: var(--brand-deep);">${expr}</span>
      </div>`,
      explanation: 'We must solve this using the correct order of operations: PEMDAS'
    });

    steps.push({
      title: 'Step 2: PEMDAS Order',
      visual: `<div style="background: rgba(255, 122, 89, 0.1); padding: 20px; border-radius: 8px; border-left: 4px solid var(--accent);">
        <div style="font-size: 1.1rem; font-weight: 600; color: var(--brand-deep); text-align: center;">
          <div style="margin: 6px 0;"><strong>P</strong>arentheses</div>
          <div style="margin: 6px 0;"><strong>E</strong>xponents</div>
          <div style="margin: 6px 0;"><strong>M</strong>ultiplication / <strong>D</strong>ivision (left to right)</div>
          <div style="margin: 6px 0;"><strong>A</strong>ddition / <strong>S</strong>ubtraction (left to right)</div>
        </div>
      </div>`,
      explanation: 'Follow these steps in order. Multiplication and Division are done before Addition and Subtraction.'
    });

    steps.push({
      title: 'Step 3: Apply order',
      visual: `<div style="background: rgba(31, 138, 72, 0.1); padding: 20px; border-radius: 8px; border-left: 4px solid var(--success);">
        <div style="font-family: 'Courier New', monospace; font-size: 1.15rem; line-height: 2.4; color: var(--brand-deep); font-weight: 600;">
          <div style="margin-bottom: 12px; color: #666; font-size: 0.95rem;">Work through each operation:</div>
          <div style="text-align: center;">
            <div style="padding: 12px; background: rgba(31, 138, 72, 0.2); border-radius: 6px;">
              Start with <span style="color: var(--success); font-weight: 700;">Multiplication/Division</span>, then<br/>
              <span style="color: var(--success); font-weight: 700;">Addition/Subtraction</span> (left to right)
            </div>
          </div>
        </div>
      </div>`,
      explanation: 'Perform operations in the correct sequence.'
    });

    steps.push({
      title: '✓ Final Answer',
      visual: `<div style="background: rgba(31, 138, 72, 0.15); padding: 20px; border-radius: 8px; border-left: 4px solid var(--success); text-align: center;">
        <span style="font-size: 1.5rem; font-weight: 700; color: var(--success);">${example.solution}</span>
      </div>`,
      explanation: `By following PEMDAS, we get: ${expr} = ${example.solution}`
    });

    steps.forEach((step) => {
      const stepDiv = document.createElement('div');
      stepDiv.className = 'step-section';
      stepDiv.innerHTML = `
        <h4>${step.title}</h4>
        <div class="step-visual">${step.visual}</div>
        <p>${step.explanation}</p>
      `;
      pemdasStepsContainer.appendChild(stepDiv);
    });

    pemdasStepsContainer.style.display = 'block';
  }

  if (pemdasCustomBtn) {
    pemdasCustomBtn.addEventListener('click', () => {
      try {
        const expr = pemdasCustomInput.value.trim();
        if (!expr) return;
        const result = eval(expr.replace(/÷/g, '/'));
        displayPemdasSteps({ display: expr, solution: result });
      } catch (e) {
        pemdasStepsContainer.innerHTML = '<p style="color: var(--danger);">Invalid expression</p>';
        pemdasStepsContainer.style.display = 'block';
      }
    });
  }

  pemdasExamples.forEach((example) => {
    const card = document.createElement('button');
    card.className = 'example-card';
    card.innerHTML = example.display;
    card.addEventListener('click', () => displayPemdasSteps(example));
    pemdasExamplesContainer.appendChild(card);
  });

  // ========== INTEGERS & NEGATIVES ==========
  const intExamplesContainer = document.getElementById('int-examples');
  const intStepsContainer = document.getElementById('int-steps-container');
  const intCustomInput = document.getElementById('int-custom-input');
  const intCustomBtn = document.getElementById('int-custom-btn');

  const intExamples = [
    { display: '-5 + 3', a: -5, b: 3 },
    { display: '-3 + -2', a: -3, b: -2 },
    { display: '5 + -8', a: 5, b: -8 },
    { display: '-4 - 3', a: -4, b: -3 }
  ];

  function displayIntSteps(example) {
    intCustomInput.value = example.display;
    intStepsContainer.innerHTML = '';

    const result = example.a + example.b;
    const isNegativeA = example.a < 0;
    const isNegativeB = example.b < 0;
    const absA = Math.abs(example.a);
    const absB = Math.abs(example.b);

    const steps = [
      {
        title: 'Step 1: Original problem',
        visual: `<div style="background: rgba(10, 126, 164, 0.1); padding: 16px; border-radius: 8px; border-left: 4px solid var(--brand);">
          <span style="font-size: 1.3rem; font-weight: 700; color: var(--brand-deep);">${example.a} ${example.b >= 0 ? '+' : ''} ${example.b}</span>
        </div>`,
        explanation: 'We\'re adding integers. Some might be negative.'
      },
      {
        title: 'Step 2: Identify positive and negative',
        visual: `<div style="background: rgba(255, 122, 89, 0.1); padding: 20px; border-radius: 8px; border-left: 4px solid var(--accent);">
          <div style="font-size: 1.1rem; font-weight: 600; color: var(--brand-deep); margin-bottom: 12px;">
            ${isNegativeA ? `<span style="color: #d94a4a;">● ${example.a} is NEGATIVE (${absA})</span>` : `<span style="color: var(--success);">● ${example.a} is POSITIVE</span>`}<br/>
            ${isNegativeB ? `<span style="color: #d94a4a;">● ${example.b} is NEGATIVE (${absB})</span>` : `<span style="color: var(--success);">● ${example.b} is POSITIVE</span>`}
          </div>
        </div>`,
        explanation: 'Determine the sign of each number.'
      },
      {
        title: 'Step 3: Calculate',
        visual: `<div style="background: rgba(31, 138, 72, 0.1); padding: 20px; border-radius: 8px; border-left: 4px solid var(--success);">
          <div style="font-family: 'Courier New', monospace; font-size: 1.15rem; line-height: 2.4; color: var(--brand-deep); font-weight: 600; text-align: center;">
            <div style="margin-bottom: 12px; color: #666; font-size: 0.95rem;">Working:</div>
            <div style="padding: 12px; background: rgba(31, 138, 72, 0.2); border-radius: 6px;">
              ${isNegativeA && isNegativeB ? `${absA} + ${absB} = ${absA + absB}, both negative → <span style="color: var(--success); font-weight: 700;">-${absA + absB}</span>` :
                isNegativeA && !isNegativeB ? `${absB} - ${absA} = <span style="color: var(--success); font-weight: 700;">${Math.abs(result)}</span>` :
                !isNegativeA && isNegativeB ? `${absA} - ${absB} = <span style="color: var(--success); font-weight: 700;">${result}</span>` :
                `${absA} + ${absB} = <span style="color: var(--success); font-weight: 700;">${result}</span>`}
            </div>
          </div>
        </div>`,
        explanation: result < 0 ? `When both are negative, the answer is negative. When signs differ, subtract and use the sign of the larger number.` : 
                      `Add or subtract based on the signs of the numbers.`
      },
      {
        title: '✓ Final Answer',
        visual: `<div style="background: rgba(31, 138, 72, 0.15); padding: 20px; border-radius: 8px; border-left: 4px solid var(--success); text-align: center;">
          <span style="font-size: 1.5rem; font-weight: 700; color: var(--success);">${result}</span>
        </div>`,
        explanation: `${example.a} + (${example.b}) = ${result}`
      }
    ];

    steps.forEach((step) => {
      const stepDiv = document.createElement('div');
      stepDiv.className = 'step-section';
      stepDiv.innerHTML = `
        <h4>${step.title}</h4>
        <div class="step-visual">${step.visual}</div>
        <p>${step.explanation}</p>
      `;
      intStepsContainer.appendChild(stepDiv);
    });

    intStepsContainer.style.display = 'block';
  }

  if (intCustomBtn) {
    intCustomBtn.addEventListener('click', () => {
      try {
        const expr = intCustomInput.value.trim();
        const parts = expr.match(/^(-?\d+)\s*([+\-])\s*(-?\d+)$/);
        if (!parts) return;
        const a = parseInt(parts[1]);
        const b = parseInt(parts[3]);
        if (parts[2] === '-') {
          displayIntSteps({ display: expr, a, b: -b });
        } else {
          displayIntSteps({ display: expr, a, b });
        }
      } catch (e) {
        intStepsContainer.innerHTML = '<p style="color: var(--danger);">Invalid format</p>';
        intStepsContainer.style.display = 'block';
      }
    });
  }

  intExamples.forEach((example) => {
    const card = document.createElement('button');
    card.className = 'example-card';
    card.innerHTML = example.display;
    card.addEventListener('click', () => displayIntSteps(example));
    intExamplesContainer.appendChild(card);
  });

  // ========== ONE-STEP EQUATIONS ==========
  const oneStepExamplesContainer = document.getElementById('oneStep-examples');
  const oneStepStepsContainer = document.getElementById('oneStep-steps-container');
  const oneStepCustomInput = document.getElementById('oneStep-custom-input');
  const oneStepCustomBtn = document.getElementById('oneStep-custom-btn');

  const oneStepExamples = [
    { display: 'x + 5 = 12', operation: 'add', operand: 5, answer: 12, x: 7 },
    { display: 'x - 3 = 8', operation: 'subtract', operand: 3, answer: 8, x: 11 },
    { display: '2x = 10', operation: 'multiply', operand: 2, answer: 10, x: 5 },
    { display: 'x ÷ 4 = 3', operation: 'divide', operand: 4, answer: 3, x: 12 }
  ];

  function generateOneStepSteps(example) {
    const { operation, operand, answer, x } = example;
    
    let inverseOp = '';
    let inverseSymbol = '';
    let explanation1 = '';
    let explanation2 = '';

    if (operation === 'add') {
      inverseOp = 'subtract';
      inverseSymbol = '−';
      explanation1 = `The opposite of adding ${operand} is subtracting ${operand}`;
      explanation2 = `${answer} − ${operand} = ${x}`;
    } else if (operation === 'subtract') {
      inverseOp = 'add';
      inverseSymbol = '+';
      explanation1 = `The opposite of subtracting ${operand} is adding ${operand}`;
      explanation2 = `${answer} + ${operand} = ${x}`;
    } else if (operation === 'multiply') {
      inverseOp = 'divide';
      inverseSymbol = '÷';
      explanation1 = `The opposite of multiplying by ${operand} is dividing by ${operand}`;
      explanation2 = `${answer} ÷ ${operand} = ${x}`;
    } else if (operation === 'divide') {
      inverseOp = 'multiply';
      inverseSymbol = '×';
      explanation1 = `The opposite of dividing by ${operand} is multiplying by ${operand}`;
      explanation2 = `${answer} × ${operand} = ${x}`;
    }

    const steps = [
      {
        title: 'Step 1: Write the equation',
        visual: `<div style="background: rgba(10, 126, 164, 0.1); padding: 16px; border-radius: 8px; border-left: 4px solid var(--brand);">
          <span style="font-size: 1.3rem; font-weight: 700; color: var(--brand-deep);">${example.display}</span>
        </div>`,
        explanation: `We need to find x. To do this, we need to UNDO the operation that's being done to x.`
      },
      {
        title: `Step 2 & 3: Solve`,
        visual: `<div style="background: rgba(255, 122, 89, 0.1); padding: 20px; border-radius: 8px; border-left: 4px solid var(--accent);">
          <div style="font-family: 'Courier New', monospace; font-size: 1.15rem; line-height: 2.8; color: var(--brand-deep); font-weight: 600; text-align: center;">
            <div style="margin-bottom: 16px; padding: 10px; background: rgba(255,255,255,0.5); border-radius: 6px;">${example.display}</div>
            
            <div style="margin-bottom: 8px; display: flex; justify-content: center; gap: 60px;">
              <div style="display: inline-flex; align-items: center; background: rgba(217, 74, 74, 0.2); color: #d94a4a; padding: 6px 12px; border-radius: 20px; border: 2px solid #d94a4a; font-weight: 700; font-size: 0.9rem;">
                ${inverseSymbol}${operand}
              </div>
              <div style="display: inline-flex; align-items: center; background: rgba(217, 74, 74, 0.2); color: #d94a4a; padding: 6px 12px; border-radius: 20px; border: 2px solid #d94a4a; font-weight: 700; font-size: 0.9rem;">
                ${inverseSymbol}${operand}
              </div>
            </div>
            
            <div style="padding: 10px; background: rgba(31, 138, 72, 0.2); border-radius: 6px; border-left: 3px solid var(--success);">
              <div style="color: var(--success); font-weight: 700; font-size: 1.2rem;">x = ${x}</div>
            </div>
          </div>
        </div>`,
        explanation: `${inverseOp.charAt(0).toUpperCase() + inverseOp.slice(1)} ${operand} from both sides to isolate x.`
      },
      {
        title: '✓ Solution',
        visual: `<div style="background: rgba(31, 138, 72, 0.15); padding: 20px; border-radius: 8px; border-left: 4px solid var(--success); text-align: center;">
          <span style="font-size: 1.5rem; font-weight: 700; color: var(--success);">x = ${x}</span>
        </div>`,
        explanation: `Check your answer: Replace x with ${x} in the original equation: ${example.display.replace('x', x)} ✓`
      }
    ];

    return steps;
  }

  function displayOneStepSteps(example) {
    oneStepCustomInput.value = example.display;
    oneStepStepsContainer.innerHTML = '';

    const steps = generateOneStepSteps(example);
    steps.forEach((step) => {
      const stepDiv = document.createElement('div');
      stepDiv.className = 'step-section';
      stepDiv.innerHTML = `
        <h4>${step.title}</h4>
        <div class="step-visual">${step.visual}</div>
        <p>${step.explanation}</p>
      `;
      oneStepStepsContainer.appendChild(stepDiv);
    });

    oneStepStepsContainer.style.display = 'block';
  }

  if (oneStepCustomBtn) {
    oneStepCustomBtn.addEventListener('click', () => {
      const expr = oneStepCustomInput.value.trim();
      if (!expr) return;
      // Try to parse - show generic message for custom input
      displayOneStepSteps({ 
        display: expr, 
        operation: 'add', 
        operand: 0, 
        answer: 0, 
        x: 0 
      });
    });
  }

  oneStepExamples.forEach((example) => {
    const card = document.createElement('button');
    card.className = 'example-card';
    card.innerHTML = example.display;
    card.addEventListener('click', () => displayOneStepSteps(example));
    oneStepExamplesContainer.appendChild(card);
  });

  // ========== TWO-STEP EQUATIONS ==========
  const twoStepExamplesContainer = document.getElementById('twoStep-examples');
  const twoStepStepsContainer = document.getElementById('twoStep-steps-container');
  const twoStepCustomInput = document.getElementById('twoStep-custom-input');
  const twoStepCustomBtn = document.getElementById('twoStep-custom-btn');

  const twoStepExamples = [
    { display: '2x + 3 = 9', x: 3 },
    { display: '3x - 2 = 10', x: 4 },
    { display: '4x + 1 = 17', x: 4 },
    { display: '5x - 5 = 15', x: 4 }
  ];

  function generateTwoStepSteps(example) {
    // Parse equation: ax + b = c
    const eqParts = example.display.split('=').map(e => e.trim());
    const leftSide = eqParts[0];
    const rightSide = parseFloat(eqParts[1]);
    
    // Better parsing: remove spaces, replace - with +-, then split
    let coeff = 0;
    let constant = 0;
    
    const terms = leftSide.replace(/\s+/g, '').replace(/-/g, '+-').split('+').filter(t => t.length > 0);
    
    for (let term of terms) {
      if (term.includes('x')) {
        // Extract coefficient: "2x" → 2, "x" → 1, "-3x" → -3
        coeff += parseFloat(term.replace('x', '') || 1);
      } else {
        // This is a constant
        const val = parseFloat(term);
        if (!isNaN(val)) constant += val;
      }
    }
    
    // Step 1: Subtract constant from both sides
    const afterStep1 = rightSide - constant;
    const x = afterStep1 / coeff;
    
    const steps = [
      {
        title: 'Step 1: Write the equation',
        visual: `<div style="background: rgba(10, 126, 164, 0.1); padding: 16px; border-radius: 8px; border-left: 4px solid var(--brand);">
          <span style="font-size: 1.3rem; font-weight: 700; color: var(--brand-deep);">${example.display}</span>
        </div>`,
        explanation: `We need to solve this in two steps: first remove the constant, then divide by the coefficient.`
      },
      {
        title: `Step 2 & 3: Subtract and Divide`,
        visual: `<div style="background: rgba(255, 122, 89, 0.1); padding: 20px; border-radius: 8px; border-left: 4px solid var(--accent);">
          <div style="font-family: 'Courier New', monospace; font-size: 1.1rem; line-height: 2.6; color: var(--brand-deep); font-weight: 600; text-align: center;">
            <div style="margin-bottom: 14px; padding: 10px; background: rgba(255,255,255,0.5); border-radius: 6px;">${example.display}</div>
            
            <div style="margin-bottom: 8px; display: flex; justify-content: center; gap: 60px; font-size: 0.9rem;">
              <div style="display: inline-flex; align-items: center; background: rgba(217, 74, 74, 0.2); color: #d94a4a; padding: 6px 12px; border-radius: 20px; border: 2px solid #d94a4a; font-weight: 700;">
                −${constant}
              </div>
              <div style="display: inline-flex; align-items: center; background: rgba(217, 74, 74, 0.2); color: #d94a4a; padding: 6px 12px; border-radius: 20px; border: 2px solid #d94a4a; font-weight: 700;">
                −${constant}
              </div>
            </div>
            
            <div style="margin-bottom: 14px; padding: 10px; background: rgba(31, 138, 72, 0.15); border-radius: 6px; color: var(--brand-deep);">${coeff}x = ${afterStep1}</div>
            
            <div style="margin-bottom: 8px; display: flex; justify-content: center; gap: 60px; font-size: 0.9rem;">
              <div style="display: inline-flex; align-items: center; background: rgba(217, 74, 74, 0.2); color: #d94a4a; padding: 6px 12px; border-radius: 20px; border: 2px solid #d94a4a; font-weight: 700;">
                ÷${coeff}
              </div>
              <div style="display: inline-flex; align-items: center; background: rgba(217, 74, 74, 0.2); color: #d94a4a; padding: 6px 12px; border-radius: 20px; border: 2px solid #d94a4a; font-weight: 700;">
                ÷${coeff}
              </div>
            </div>
            
            <div style="padding: 10px; background: rgba(31, 138, 72, 0.2); border-radius: 6px; border-left: 3px solid var(--success);">
              <div style="color: var(--success); font-weight: 700; font-size: 1.2rem;">x = ${fmt(x)}</div>
            </div>
          </div>
        </div>`,
        explanation: `First subtract ${constant} from both sides, then divide both sides by ${coeff} to solve for x.`
      },
      {
        title: '✓ Solution',
        visual: `<div style="background: rgba(31, 138, 72, 0.15); padding: 20px; border-radius: 8px; border-left: 4px solid var(--success); text-align: center;">
          <span style="font-size: 1.5rem; font-weight: 700; color: var(--success);">x = ${fmt(x)}</span>
        </div>`,
        explanation: `Check: Plug ${fmt(x)} back into the original equation to verify it works!`
      }
    ];
    
    return steps;
  }

  function displayTwoStepSteps(example) {
    twoStepCustomInput.value = example.display;
    twoStepStepsContainer.innerHTML = '';

    const steps = generateTwoStepSteps(example);

    steps.forEach((step) => {
      const stepDiv = document.createElement('div');
      stepDiv.className = 'step-section';
      stepDiv.innerHTML = `
        <h4>${step.title}</h4>
        <div class="step-visual">${step.visual}</div>
        <p>${step.explanation}</p>
      `;
      twoStepStepsContainer.appendChild(stepDiv);
    });

    twoStepStepsContainer.style.display = 'block';
  }

  if (twoStepCustomBtn) {
    twoStepCustomBtn.addEventListener('click', () => {
      const expr = twoStepCustomInput.value.trim();
      const exampleObj = { display: expr, x: 0 };
      displayTwoStepSteps(exampleObj);
    });
  }

  twoStepExamples.forEach((example) => {
    const card = document.createElement('button');
    card.className = 'example-card';
    card.innerHTML = example.display;
    card.addEventListener('click', () => displayTwoStepSteps(example));
    twoStepExamplesContainer.appendChild(card);
  });

  // ========== MULTI-STEP EQUATIONS ==========
  const multiStepExamplesContainer = document.getElementById('multiStep-examples');
  const multiStepStepsContainer = document.getElementById('multiStep-steps-container');
  const multiStepCustomInput = document.getElementById('multiStep-custom-input');
  const multiStepCustomBtn = document.getElementById('multiStep-custom-btn');

  const multiStepExamples = [
    { display: '2x + 3 + x = 12', x: 3 },
    { display: '5x - 2 + 3x = 18', x: 2.5 },
    { display: '3x + 5 - x = 11', x: 3 },
    { display: '4x - 1 + 2x = 23', x: 4 }
  ];

  function generateMultiStepSteps(example) {
    // Parse equation: axn + ax + b = c
    const eqParts = example.display.split('=').map(e => e.trim());
    const leftSide = eqParts[0];
    const rightSide = parseFloat(eqParts[1]);
    
    // Better parsing: use regex that handles + and - properly
    let totalCoeff = 0;
    let constant = 0;
    
    // Replace - with +- to split properly, then filter empty strings
    const terms = leftSide.replace(/\s+/g, '').replace(/-/g, '+-').split('+').filter(t => t.length > 0);
    
    for (let term of terms) {
      if (term.includes('x')) {
        // Extract coefficient from x term: "2x" → 2, "x" → 1, "-3x" → -3
        const coeff = parseFloat(term.replace('x', '') || 1);
        totalCoeff += coeff;
      } else {
        // This is a constant
        const val = parseFloat(term);
        if (!isNaN(val)) constant += val;
      }
    }
    
    const afterStep1 = rightSide - constant;
    const x = afterStep1 / totalCoeff;
    
    const steps = [
      {
        title: 'Step 1: Original equation',
        visual: `<div style="background: rgba(10, 126, 164, 0.1); padding: 16px; border-radius: 8px; border-left: 4px solid var(--brand);">
          <span style="font-size: 1.3rem; font-weight: 700; color: var(--brand-deep);">${example.display}</span>
        </div>`,
        explanation: `First, combine all x terms together on the left side.`
      },
      {
        title: `Step 2: Combine like terms`,
        visual: `<div style="background: rgba(255, 122, 89, 0.1); padding: 20px; border-radius: 8px; border-left: 4px solid var(--accent);">
          <div style="font-family: 'Courier New', monospace; font-size: 1.15rem; line-height: 2.4; color: var(--brand-deep); font-weight: 600; text-align: center;">
            <div style="margin-bottom: 12px; color: #666; font-size: 0.95rem;">Original:</div>
            <div style="margin-bottom: 24px;">${example.display}</div>
            
            <div style="margin-bottom: 12px; color: #666; font-size: 0.95rem;">Combine all x terms:</div>
            <div style="margin-bottom: 24px;">
              <span style="color: #d94a4a; font-weight: 700; font-size: 1.2rem;">${totalCoeff}x</span> ${signed(constant)} = ${rightSide}
            </div>
            
            <div style="padding: 12px; background: rgba(31, 138, 72, 0.2); border-radius: 6px; border-left: 3px solid var(--success);">
              <div style="color: var(--success); font-weight: 700;">${totalCoeff}x ${signed(constant)} = ${rightSide}</div>
            </div>
          </div>
        </div>`,
        explanation: `Add up all the coefficients of x, and all the constant numbers.`
      },
      {
        title: `Step 3 & 4: Subtract and Divide`,
        visual: `<div style="background: rgba(255, 122, 89, 0.1); padding: 20px; border-radius: 8px; border-left: 4px solid var(--accent);">
          <div style="font-family: 'Courier New', monospace; font-size: 1.1rem; line-height: 2.6; color: var(--brand-deep); font-weight: 600; text-align: center;">
            <div style="margin-bottom: 14px; padding: 10px; background: rgba(255,255,255,0.5); border-radius: 6px;">${totalCoeff}x ${signed(constant)} = ${rightSide}</div>
            
            <div style="margin-bottom: 8px; display: flex; justify-content: center; gap: 60px; font-size: 0.9rem;">
              <div style="display: inline-flex; align-items: center; background: rgba(217, 74, 74, 0.2); color: #d94a4a; padding: 6px 12px; border-radius: 20px; border: 2px solid #d94a4a; font-weight: 700;">
                −${constant}
              </div>
              <div style="display: inline-flex; align-items: center; background: rgba(217, 74, 74, 0.2); color: #d94a4a; padding: 6px 12px; border-radius: 20px; border: 2px solid #d94a4a; font-weight: 700;">
                −${constant}
              </div>
            </div>
            
            <div style="margin-bottom: 14px; padding: 10px; background: rgba(31, 138, 72, 0.15); border-radius: 6px; color: var(--brand-deep);">${totalCoeff}x = ${afterStep1}</div>
            
            <div style="margin-bottom: 8px; display: flex; justify-content: center; gap: 60px; font-size: 0.9rem;">
              <div style="display: inline-flex; align-items: center; background: rgba(217, 74, 74, 0.2); color: #d94a4a; padding: 6px 12px; border-radius: 20px; border: 2px solid #d94a4a; font-weight: 700;">
                ÷${totalCoeff}
              </div>
              <div style="display: inline-flex; align-items: center; background: rgba(217, 74, 74, 0.2); color: #d94a4a; padding: 6px 12px; border-radius: 20px; border: 2px solid #d94a4a; font-weight: 700;">
                ÷${totalCoeff}
              </div>
            </div>
            
            <div style="padding: 10px; background: rgba(31, 138, 72, 0.2); border-radius: 6px; border-left: 3px solid var(--success);">
              <div style="color: var(--success); font-weight: 700; font-size: 1.2rem;">x = ${fmt(x)}</div>
            </div>
          </div>
        </div>`,
        explanation: `Subtract ${constant} from both sides, then divide both sides by ${totalCoeff} to solve for x.`
      },
      {
        title: '✓ Solution',
        visual: `<div style="background: rgba(31, 138, 72, 0.15); padding: 20px; border-radius: 8px; border-left: 4px solid var(--success); text-align: center;">
          <span style="font-size: 1.5rem; font-weight: 700; color: var(--success);">x = ${fmt(x)}</span>
        </div>`,
        explanation: `Check: Substitute ${fmt(x)} back into the original equation to verify the solution!`
      }
    ];
    
    return steps;
  }

  function displayMultiStepSteps(example) {
    multiStepCustomInput.value = example.display;
    multiStepStepsContainer.innerHTML = '';

    const steps = generateMultiStepSteps(example);

    steps.forEach((step) => {
      const stepDiv = document.createElement('div');
      stepDiv.className = 'step-section';
      stepDiv.innerHTML = `
        <h4>${step.title}</h4>
        <div class="step-visual">${step.visual}</div>
        <p>${step.explanation}</p>
      `;
      multiStepStepsContainer.appendChild(stepDiv);
    });

    multiStepStepsContainer.style.display = 'block';
  }

  if (multiStepCustomBtn) {
    multiStepCustomBtn.addEventListener('click', () => {
      const expr = multiStepCustomInput.value.trim();
      const exampleObj = { display: expr, x: 0 };
      displayMultiStepSteps(exampleObj);
    });
  }

  multiStepExamples.forEach((example) => {
    const card = document.createElement('button');
    card.className = 'example-card';
    card.innerHTML = example.display;
    card.addEventListener('click', () => displayMultiStepSteps(example));
    multiStepExamplesContainer.appendChild(card);
  });

  // ========== INEQUALITIES ==========
  const ineqExamplesContainer = document.getElementById('ineq-examples');
  const ineqStepsContainer = document.getElementById('ineq-steps-container');
  const ineqCustomInput = document.getElementById('ineq-custom-input');
  const ineqCustomBtn = document.getElementById('ineq-custom-btn');

  const ineqExamples = [
    { display: 'x + 3 > 7', answer: 'x > 4' },
    { display: '2x ≤ 10', answer: 'x ≤ 5' },
    { display: 'x - 2 < 5', answer: 'x < 7' },
    { display: '3x ≥ 12', answer: 'x ≥ 4' }
  ];

  function displayIneqSteps(example) {
    ineqCustomInput.value = example.display;
    ineqStepsContainer.innerHTML = '';

    const steps = [
      {
        title: 'Step 1: Original inequality',
        visual: `<div style="background: rgba(10, 126, 164, 0.1); padding: 16px; border-radius: 8px; border-left: 4px solid var(--brand);">
          <span style="font-size: 1.3rem; font-weight: 700; color: var(--brand-deep);">${example.display}</span>
        </div>`,
        explanation: 'Inequalities show a RANGE of values, not just one answer. The symbols are: < (less than), > (greater than), ≤ (less than or equal), ≥ (greater than or equal)'
      },
      {
        title: 'Step 2: Solve like an equation',
        visual: `<div style="background: rgba(255, 122, 89, 0.1); padding: 20px; border-radius: 8px; border-left: 4px solid var(--accent);">
          <div style="font-size: 1.1rem; font-weight: 600; color: var(--brand-deep); margin-bottom: 12px;">
            Use the same steps as solving equations:
          </div>
          <div style="padding: 12px; background: rgba(255, 122, 89, 0.2); border-radius: 6px; line-height: 1.8;">
            • Undo operations by doing the <span style="color: var(--accent); font-weight: 700;">opposite on BOTH sides</span><br/>
            • Work step-by-step to isolate the variable
          </div>
        </div>`,
        explanation: 'Undo operations in reverse order: subtraction/addition first, then multiplication/division.'
      },
      {
        title: '⚠️ Important Rule!',
        visual: `<div style="background: rgba(180, 58, 58, 0.15); padding: 20px; border-radius: 8px; border-left: 4px solid var(--error);">
          <div style="font-size: 1.2rem; font-weight: 700; color: var(--error);">
            FLIP the inequality sign when:<br/>
            • Multiplying by a NEGATIVE number<br/>
            • Dividing by a NEGATIVE number
          </div>
          <div style="margin-top: 12px; font-size: 0.95rem; color: #666;">
            Example: If -2x > 6, divide by -2: x <span style="color: var(--error); font-weight: 700;"><</span> -3 (sign flips!)
          </div>
        </div>`,
        explanation: 'This is the one BIG difference between inequalities and equations!'
      },
      {
        title: '✓ Solution',
        visual: `<div style="background: rgba(31, 138, 72, 0.15); padding: 20px; border-radius: 8px; border-left: 4px solid var(--success); text-align: center;">
          <span style="font-size: 1.4rem; font-weight: 700; color: var(--success);">${example.answer}</span>
        </div>`,
        explanation: `Any value that satisfies ${example.answer} makes the original inequality true.`
      }
    ];

    steps.forEach((step) => {
      const stepDiv = document.createElement('div');
      stepDiv.className = 'step-section';
      stepDiv.innerHTML = `
        <h4>${step.title}</h4>
        <div class="step-visual">${step.visual}</div>
        <p>${step.explanation}</p>
      `;
      ineqStepsContainer.appendChild(stepDiv);
    });

    ineqStepsContainer.style.display = 'block';
  }

  if (ineqCustomBtn) {
    ineqCustomBtn.addEventListener('click', () => {
      const expr = ineqCustomInput.value.trim();
      displayIneqSteps({ display: expr, answer: 'x = ?' });
    });
  }

  ineqExamples.forEach((example) => {
    const card = document.createElement('button');
    card.className = 'example-card';
    card.innerHTML = example.display;
    card.addEventListener('click', () => displayIneqSteps(example));
    ineqExamplesContainer.appendChild(card);
  });

  // ========== SYSTEMS OF EQUATIONS ==========
  const sysExamplesContainer = document.getElementById('sys-examples');
  const sysStepsContainer = document.getElementById('sys-steps-container');
  const sysCustomInput1 = document.getElementById('sys-custom-input-1');
  const sysCustomInput2 = document.getElementById('sys-custom-input-2');
  const sysCustomBtn = document.getElementById('sys-custom-btn');

  const sysExamples = [
    { 
      eq1: 'x + y = 5',
      eq2: '2x - y = 4',
      x: 3, 
      y: 2,
      display: 'x + y = 5 and 2x - y = 4'
    },
    { 
      eq1: 'x + y = 7',
      eq2: 'x - y = 1',
      x: 4, 
      y: 3,
      display: 'x + y = 7 and x - y = 1'
    },
    { 
      eq1: '2x + y = 8',
      eq2: 'x + y = 5',
      x: 3, 
      y: 2,
      display: '2x + y = 8 and x + y = 5'
    },
    { 
      eq1: 'x + 2y = 7',
      eq2: 'x - y = 1',
      x: 3, 
      y: 2,
      display: 'x + 2y = 7 and x - y = 1'
    }
  ];

  function displaySysSteps(example) {
    sysCustomInput1.value = example.eq1;
    sysCustomInput2.value = example.eq2;
    sysStepsContainer.innerHTML = '';

    const steps = [
      {
        title: 'Step 1: Write both equations',
        visual: `<div style="background: rgba(10, 126, 164, 0.1); padding: 16px; border-radius: 8px; border-left: 4px solid var(--brand);">
          <div style="font-size: 1.1rem; font-weight: 600; margin: 8px 0;">Equation 1: ${example.eq1}</div>
          <div style="font-size: 1.1rem; font-weight: 600; margin: 8px 0;">Equation 2: ${example.eq2}</div>
        </div>`,
        explanation: 'A system means we have TWO equations with TWO unknowns (x and y). We need to find values that satisfy BOTH equations.'
      },
      {
        title: 'Step 2: Look for a way to eliminate one variable',
        visual: `<div style="background: rgba(255, 122, 89, 0.1); padding: 16px; border-radius: 8px; border-left: 4px solid var(--accent);">
          <div style="margin-bottom: 8px;"><strong>Elimination Method:</strong> Add or subtract the equations to cancel out one variable</div>
          <div style="margin-top: 12px;">Notice: Can we add/subtract to make x or y disappear?</div>
        </div>`,
        explanation: 'We often use the elimination method: add or subtract equations so one variable cancels out.'
      },
      {
        title: 'Step 3: Add or subtract the equations',
        visual: `<div style="background: rgba(255, 122, 89, 0.1); padding: 16px; border-radius: 8px; border-left: 4px solid var(--accent);">
          <div style="font-size: 0.95rem; margin: 8px 0;"><strong>When we add Equation 1 and Equation 2:</strong></div>
          <div style="font-family: monospace; margin: 8px 0; background: rgba(255, 255, 255, 0.6); padding: 8px; border-radius: 4px;">
            (${example.eq1}) + (${example.eq2})
          </div>
          <div style="margin-top: 8px; font-weight: 600; color: var(--brand-deep);">One variable is eliminated!</div>
        </div>`,
        explanation: 'This gives us an equation with only one variable we can solve.'
      },
      {
        title: 'Step 4: Solve for the first variable',
        visual: `<div style="background: rgba(31, 138, 72, 0.1); padding: 16px; border-radius: 8px; border-left: 4px solid var(--success);">
          <div style="font-size: 1.1rem; font-weight: 600; color: var(--success);">Solve the single-variable equation</div>
          <div style="margin-top: 8px; font-size: 0.95rem;">Use normal equation solving steps</div>
        </div>`,
        explanation: 'Now we have one equation with one unknown - solve it like we learned before!'
      },
      {
        title: 'Step 5: Find the second variable',
        visual: `<div style="background: rgba(31, 138, 72, 0.1); padding: 16px; border-radius: 8px; border-left: 4px solid var(--success);">
          <div style="font-size: 0.95rem; margin-bottom: 8px;">Plug your first answer back into either original equation</div>
          <div style="font-weight: 600; color: var(--brand-deep);">For example: If x = ${example.x}, substitute into ${example.eq1}</div>
          <div style="margin-top: 8px; font-family: monospace;">${example.x} + y = ${example.x + example.y}</div>
          <div style="margin-top: 8px; font-weight: 600;">Solve: y = ${example.y}</div>
        </div>`,
        explanation: 'Substitute the first solution into an original equation to find the second variable.'
      },
      {
        title: '✓ Solution',
        visual: `<div style="background: rgba(31, 138, 72, 0.15); padding: 20px; border-radius: 8px; border-left: 4px solid var(--success); text-align: center;">
          <div style="font-size: 1.2rem; font-weight: 700; color: var(--success);">x = ${example.x}, y = ${example.y}</div>
          <div style="margin-top: 8px; font-size: 0.9rem; color: var(--muted);">Point: (${example.x}, ${example.y})</div>
        </div>`,
        explanation: `Check: Does (${example.x}, ${example.y}) work in BOTH original equations? Try it!`
      }
    ];

    steps.forEach((step) => {
      const stepDiv = document.createElement('div');
      stepDiv.className = 'step-section';
      stepDiv.innerHTML = `
        <h4>${step.title}</h4>
        <div class="step-visual">${step.visual}</div>
        <p>${step.explanation}</p>
      `;
      sysStepsContainer.appendChild(stepDiv);
    });

    sysStepsContainer.style.display = 'block';
  }

  if (sysCustomBtn) {
    sysCustomBtn.addEventListener('click', () => {
      const eq1 = sysCustomInput1.value.trim();
      const eq2 = sysCustomInput2.value.trim();
      if (eq1 && eq2) {
        displaySysSteps({ eq1, eq2, x: '?', y: '?', display: `${eq1} and ${eq2}` });
      }
    });
  }

  sysExamples.forEach((example) => {
    const card = document.createElement('button');
    card.className = 'example-card';
    card.innerHTML = example.display;
    card.addEventListener('click', () => displaySysSteps(example));
    sysExamplesContainer.appendChild(card);
  });

  // ========== FACTORING ==========
  const factorExamplesContainer = document.getElementById('factor-examples');
  const factorStepsContainer = document.getElementById('factor-steps-container');
  const factorCustomInput = document.getElementById('factor-custom-input');
  const factorCustomBtn = document.getElementById('factor-custom-btn');

  const factorExamples = [
    { display: 'x² + 5x + 6', factored: '(x + 2)(x + 3)' },
    { display: 'x² + 7x + 12', factored: '(x + 3)(x + 4)' },
    { display: 'x² - 5x + 6', factored: '(x - 2)(x - 3)' },
    { display: 'x² - 1', factored: '(x + 1)(x - 1)' }
  ];

  function generateFactorSteps(example) {
    const expr = example.display.replace(/\s+/g, ''); // Remove all spaces
    const parts = expr.match(/x²([+-]?\d*)x?([+-]?\d*)/);
    let b = 0, c = 0;
    
    if (parts) {
      b = parts[1] ? parseInt(parts[1]) : 1;
      c = parts[2] ? parseInt(parts[2]) : 0;
    }
    
    let factor1 = null, factor2 = null;
    for (let i = 1; i <= Math.abs(c); i++) {
      if (c % i === 0) {
        const other = c / i;
        if (i + other === b || -i - other === b) {
          factor1 = i * Math.sign(b + other);
          factor2 = other * Math.sign(b - other);
          break;
        }
      }
    }
    
    if (!factor1 || !factor2) {
      factor1 = 1; factor2 = c;
    }

    const steps = [
      {
        title: 'Step 1: Original quadratic',
        visual: `<div style="background: rgba(10, 126, 164, 0.1); padding: 16px; border-radius: 8px; border-left: 4px solid var(--brand);">
          <span style="font-size: 1.3rem; font-weight: 700; color: var(--brand-deep);">${example.display}</span>
        </div>`,
        explanation: 'We need to find two numbers that multiply to the constant term and add to the middle coefficient.'
      },
      {
        title: 'Step 2: Find factor pairs',
        visual: `<div style="background: rgba(255, 122, 89, 0.1); padding: 20px; border-radius: 8px; border-left: 4px solid var(--accent);">
          <div style="font-size: 1.1rem; font-weight: 600; color: var(--brand-deep); margin-bottom: 12px;">
            Find two numbers that:<br/>
            • Multiply to <strong>${c}</strong><br/>
            • Add to <strong>${b}</strong>
          </div>
          <div style="padding: 12px; background: rgba(31, 138, 72, 0.2); border-radius: 6px; border-left: 3px solid var(--success);">
            <div style="color: var(--success); font-weight: 700;">Numbers: <strong>${factor1}</strong> and <strong>${factor2}</strong></div>
            <div style="color: #666; font-size: 0.9rem; margin-top: 4px;">${factor1} × ${factor2} = ${c}  ✓  |  ${factor1} + ${factor2} = ${b}  ✓</div>
          </div>
        </div>`,
        explanation: 'Identify the pair of factors needed for factoring.'
      },
      {
        title: 'Step 3: Write in factored form',
        visual: `<div style="background: rgba(31, 138, 72, 0.1); padding: 20px; border-radius: 8px; border-left: 4px solid var(--success);">
          <div style="font-family: 'Courier New', monospace; font-size: 1.15rem; line-height: 2.4; color: var(--brand-deep); font-weight: 600; text-align: center;">
            <div style="margin-bottom: 12px; color: #666; font-size: 0.95rem;">Factored form:</div>
            <div style="padding: 12px; background: rgba(31, 138, 72, 0.2); border-radius: 6px;">
              <span style="color: var(--success); font-weight: 700; font-size: 1.2rem;">${example.factored}</span>
            </div>
          </div>
        </div>`,
        explanation: 'Express the quadratic as a product of two binomials using the factors found.'
      },
      {
        title: '✓ Factored Form',
        visual: `<div style="background: rgba(31, 138, 72, 0.15); padding: 20px; border-radius: 8px; border-left: 4px solid var(--success); text-align: center;">
          <div style="font-size: 1.2rem; font-weight: 600; color: #666; margin-bottom: 8px;">Result:</div>
          <span style="font-size: 1.5rem; font-weight: 700; color: var(--success);">${example.display} = ${example.factored}</span>
        </div>`,
        explanation: `The quadratic is now written in factored form. This makes it easier to find the roots if set equal to zero.`
      }
    ];
    
    return steps;
  }

  function displayFactorSteps(example) {
    factorCustomInput.value = example.display;
    factorStepsContainer.innerHTML = '';

    const steps = generateFactorSteps(example);

    steps.forEach((step) => {
      const stepDiv = document.createElement('div');
      stepDiv.className = 'step-section';
      stepDiv.innerHTML = `
        <h4>${step.title}</h4>
        <div class="step-visual">${step.visual}</div>
        <p>${step.explanation}</p>
      `;
      factorStepsContainer.appendChild(stepDiv);
    });

    factorStepsContainer.style.display = 'block';
  }

  if (factorCustomBtn) {
    factorCustomBtn.addEventListener('click', () => {
      const expr = factorCustomInput.value.trim();
      displayFactorSteps({ display: expr, factored: '(x + ?)(x + ?)' });
    });
  }

  factorExamples.forEach((example) => {
    const card = document.createElement('button');
    card.className = 'example-card';
    card.innerHTML = example.display;
    card.addEventListener('click', () => displayFactorSteps(example));
    factorExamplesContainer.appendChild(card);
  });

  // ========== QUADRATIC EQUATIONS ==========
  const quadExamplesContainer = document.getElementById('quad-examples');
  const quadStepsContainer = document.getElementById('quad-steps-container');
  const quadCustomInput = document.getElementById('quad-custom-input');
  const quadCustomBtn = document.getElementById('quad-custom-btn');

  const quadExamples = [
    { display: 'x² + 5x + 6 = 0', roots: 'x = -2 or x = -3' },
    { display: 'x² - 5x + 6 = 0', roots: 'x = 2 or x = 3' },
    { display: 'x² - 4 = 0', roots: 'x = 2 or x = -2' },
    { display: 'x² + 2x - 3 = 0', roots: 'x = 1 or x = -3' }
  ];

  function generateQuadSteps(example) {
    // Parse equation: x² + bx + c = 0
    const eqParts = example.display.split('=').map(e => e.trim());
    const leftSide = eqParts[0];
    
    // Extract coefficients
    let a = 0, b = 0, c = 0;
    const terms = leftSide.replace(/\s+/g, '').replace(/-/g, '+-').split('+').filter(t => t.length > 0);
    
    for (let term of terms) {
      if (term.includes('x²') || term.includes('x^2')) {
        a = parseFloat(term.replace(/x²|x\^2/g, '') || 1);
      } else if (term.includes('x')) {
        b = parseFloat(term.replace('x', '') || 1);
      } else {
        c = parseFloat(term);
      }
    }
    
    // For simple factoring (when a = 1)
    if (a === 1) {
      // Find factors of c that add to b
      let factor1 = null, factor2 = null;
      for (let i = 1; i <= Math.abs(c); i++) {
        if (c % i === 0) {
          const other = c / i;
          if (i + other === b) {
            factor1 = i;
            factor2 = other;
            break;
          }
          if (-i - other === b) {
            factor1 = -i;
            factor2 = -other;
            break;
          }
        }
      }
      
      if (factor1 !== null && factor2 !== null) {
        const root1 = -factor1;
        const root2 = -factor2;
        
        const steps = [
          {
            title: 'Step 1: Original equation',
            visual: `<div style="background: rgba(10, 126, 164, 0.1); padding: 16px; border-radius: 8px; border-left: 4px solid var(--brand);">
              <span style="font-size: 1.3rem; font-weight: 700; color: var(--brand-deep);">${example.display}</span>
            </div>`,
            explanation: 'A quadratic equation has an x² term and equals zero.'
          },
          {
            title: 'Step 2: Find factors',
            visual: `<div style="background: rgba(255, 122, 89, 0.1); padding: 20px; border-radius: 8px; border-left: 4px solid var(--accent);">
              <div style="font-size: 1.1rem; font-weight: 600; color: var(--brand-deep); margin-bottom: 12px;">
                Find two numbers that multiply to <strong>${c}</strong> and add to <strong>${b}</strong>
              </div>
              <div style="padding: 12px; background: rgba(31, 138, 72, 0.2); border-radius: 6px; border-left: 3px solid var(--success);">
                <div style="color: var(--success); font-weight: 700;">Numbers: <strong>${factor1}</strong> and <strong>${factor2}</strong></div>
                <div style="color: #666; font-size: 0.9rem; margin-top: 4px;">${factor1} × ${factor2} = ${c}  ✓  |  ${factor1} + ${factor2} = ${b}  ✓</div>
              </div>
            </div>`,
            explanation: 'We need two numbers that multiply to the constant term and add to the coefficient of x.'
          },
          {
            title: 'Step 3: Write as factors',
            visual: `<div style="background: rgba(31, 138, 72, 0.1); padding: 20px; border-radius: 8px; border-left: 4px solid var(--success);">
              <div style="font-family: 'Courier New', monospace; font-size: 1.15rem; line-height: 2.4; color: var(--brand-deep); font-weight: 600; text-align: center;">
                <div style="margin-bottom: 12px; color: #666; font-size: 0.95rem;">Factored form:</div>
                <div style="padding: 12px; background: rgba(31, 138, 72, 0.2); border-radius: 6px;">
                  <span style="color: var(--success); font-weight: 700; font-size: 1.2rem;">(x ${factor1 >= 0 ? '+' : ''} ${factor1})(x ${factor2 >= 0 ? '+' : ''} ${factor2}) = 0</span>
                </div>
              </div>
            </div>`,
            explanation: 'Write the quadratic as a product of two binomials.'
          },
          {
            title: 'Step 4: Set each factor to zero',
            visual: `<div style="background: rgba(255, 122, 89, 0.1); padding: 20px; border-radius: 8px; border-left: 4px solid var(--accent);">
              <div style="font-family: 'Courier New', monospace; font-size: 1.15rem; line-height: 2.4; color: var(--brand-deep); font-weight: 600;">
                <div style="margin-bottom: 12px; color: #666; font-size: 0.95rem;">Either factor equals zero:</div>
                <div style="display: flex; justify-content: space-around; text-align: center;">
                  <div>
                    x ${factor1 >= 0 ? '+' : ''} ${factor1} = 0<br/>
                    <span style="color: #d94a4a; font-weight: 700; font-size: 1.2rem;">x = ${-factor1}</span>
                  </div>
                  <div style="color: #999;">OR</div>
                  <div>
                    x ${factor2 >= 0 ? '+' : ''} ${factor2} = 0<br/>
                    <span style="color: #d94a4a; font-weight: 700; font-size: 1.2rem;">x = ${-factor2}</span>
                  </div>
                </div>
              </div>
            </div>`,
            explanation: 'If a product equals zero, at least one factor must equal zero. Solve each equation separately.'
          },
          {
            title: '✓ Solutions',
            visual: `<div style="background: rgba(31, 138, 72, 0.15); padding: 20px; border-radius: 8px; border-left: 4px solid var(--success); text-align: center;">
              <span style="font-size: 1.5rem; font-weight: 700; color: var(--success);">x = ${root1} or x = ${root2}</span>
            </div>`,
            explanation: `The quadratic has two solutions: ${root1} and ${root2}. Check: (${root1})² + ${b}(${root1}) + ${c} = 0 and (${root2})² + ${b}(${root2}) + ${c} = 0 ✓`
          }
        ];
        
        return steps;
      }
    }
    
    // Fallback to simple display
    return [
      {
        title: 'Step 1: Original equation',
        visual: `<div style="background: rgba(10, 126, 164, 0.1); padding: 16px; border-radius: 8px; border-left: 4px solid var(--brand);">
          <span style="font-size: 1.3rem; font-weight: 700; color: var(--brand-deep);">${example.display}</span>
        </div>`,
        explanation: 'Quadratic equations have an x² term and equal zero.'
      },
      {
        title: '✓ Roots',
        visual: `<div style="background: rgba(31, 138, 72, 0.15); padding: 20px; border-radius: 8px; border-left: 4px solid var(--success); text-align: center;">
          <span style="font-size: 1.5rem; font-weight: 700; color: var(--success);">${example.roots}</span>
        </div>`,
        explanation: 'The solutions to the quadratic equation'
      }
    ];
  }

  function displayQuadSteps(example) {
    quadCustomInput.value = example.display;
    quadStepsContainer.innerHTML = '';

    const steps = generateQuadSteps(example);

    steps.forEach((step) => {
      const stepDiv = document.createElement('div');
      stepDiv.className = 'step-section';
      stepDiv.innerHTML = `
        <h4>${step.title}</h4>
        <div class="step-visual">${step.visual}</div>
        <p>${step.explanation}</p>
      `;
      quadStepsContainer.appendChild(stepDiv);
    });

    quadStepsContainer.style.display = 'block';
  }

  if (quadCustomBtn) {
    quadCustomBtn.addEventListener('click', () => {
      const expr = quadCustomInput.value.trim();
      displayQuadSteps({ display: expr, roots: 'x = ?, x = ?' });
    });
  }

  quadExamples.forEach((example) => {
    const card = document.createElement('button');
    card.className = 'example-card';
    card.innerHTML = example.display;
    card.addEventListener('click', () => displayQuadSteps(example));
    quadExamplesContainer.appendChild(card);
  });

  // ========== EXPONENT RULES ==========
  const expExamplesContainer = document.getElementById('exp-examples');
  const expStepsContainer = document.getElementById('exp-steps-container');
  const expCustomInput = document.getElementById('exp-custom-input');
  const expCustomBtn = document.getElementById('exp-custom-btn');

  const expExamples = [
    { display: 'x² × x³', simplified: 'x⁵', rule: 'Add exponents when multiplying same bases' },
    { display: 'x⁵ ÷ x²', simplified: 'x³', rule: 'Subtract exponents when dividing same bases' },
    { display: '(x²)³', simplified: 'x⁶', rule: 'Multiply exponents when raising to a power' },
    { display: 'x⁰', simplified: '1', rule: 'Any base to the 0 power equals 1' }
  ];

  function displayExpSteps(example) {
    expCustomInput.value = example.display;
    expStepsContainer.innerHTML = '';

    const steps = [
      {
        title: 'Step 1: Expression with exponents',
        visual: `<div style="background: rgba(10, 126, 164, 0.1); padding: 16px; border-radius: 8px; border-left: 4px solid var(--brand);">
          <span style="font-size: 1.3rem; font-weight: 700; color: var(--brand-deep);">${example.display}</span>
        </div>`,
        explanation: 'We have an expression involving exponents that we need to simplify.'
      },
      {
        title: 'Step 2: Identify the rule',
        visual: `<div style="background: rgba(255, 122, 89, 0.1); padding: 20px; border-radius: 8px; border-left: 4px solid var(--accent);">
          <div style="font-size: 1.1rem; font-weight: 600; color: var(--brand-deep); text-align: center;">
            <span style="color: var(--accent); font-weight: 700;">${example.rule}</span>
          </div>
          <div style="margin-top: 12px; padding: 12px; background: rgba(255, 122, 89, 0.2); border-radius: 6px; font-size: 0.95rem;">
            Remember: The bases must be the same!
          </div>
        </div>`,
        explanation: example.rule
      },
      {
        title: 'Step 3: Apply the rule',
        visual: `<div style="background: rgba(31, 138, 72, 0.1); padding: 20px; border-radius: 8px; border-left: 4px solid var(--success);">
          <div style="font-family: 'Courier New', monospace; font-size: 1.15rem; line-height: 2.4; color: var(--brand-deep); font-weight: 600; text-align: center;">
            <div style="margin-bottom: 12px; color: #666; font-size: 0.95rem;">Simplify:</div>
            <div style="padding: 12px; background: rgba(31, 138, 72, 0.2); border-radius: 6px;">
              <span style="color: var(--success); font-weight: 700; font-size: 1.2rem;">${example.simplified}</span>
            </div>
          </div>
        </div>`,
        explanation: 'Work through the exponent rule to get the simplified form.'
      },
      {
        title: '✓ Final Answer',
        visual: `<div style="background: rgba(31, 138, 72, 0.15); padding: 20px; border-radius: 8px; border-left: 4px solid var(--success); text-align: center;">
          <span style="font-size: 1.5rem; font-weight: 700; color: var(--success);">${example.simplified}</span>
        </div>`,
        explanation: `${example.display} simplifies to ${example.simplified}`
      }
    ];

    steps.forEach((step) => {
      const stepDiv = document.createElement('div');
      stepDiv.className = 'step-section';
      stepDiv.innerHTML = `
        <h4>${step.title}</h4>
        <div class="step-visual">${step.visual}</div>
        <p>${step.explanation}</p>
      `;
      expStepsContainer.appendChild(stepDiv);
    });

    expStepsContainer.style.display = 'block';
  }

  if (expCustomBtn) {
    expCustomBtn.addEventListener('click', () => {
      const expr = expCustomInput.value.trim();
      displayExpSteps({ display: expr, simplified: '?', rule: 'Apply exponent rules' });
    });
  }

  expExamples.forEach((example) => {
    const card = document.createElement('button');
    card.className = 'example-card';
    card.innerHTML = example.display;
    card.addEventListener('click', () => displayExpSteps(example));
    expExamplesContainer.appendChild(card);
  });

  // ========== SIMPLIFYING FRACTIONS ==========
  const fracExamplesContainer = document.getElementById('frac-examples');
  const fracStepsContainer = document.getElementById('frac-steps-container');
  const fracCustomInput = document.getElementById('frac-custom-input');
  const fracCustomBtn = document.getElementById('frac-custom-btn');

  const fracExamples = [
    { display: '6x / 9', simplified: '2x / 3', gcd: 3 },
    { display: '8x² / 12x', simplified: '2x / 3', gcd: 4 },
    { display: '15 / 20', simplified: '3 / 4', gcd: 5 },
    { display: '10xy / 15y', simplified: '2x / 3', gcd: 5 }
  ];

  function displayFracSteps(example) {
    fracCustomInput.value = example.display;
    fracStepsContainer.innerHTML = '';

    const steps = [
      {
        title: 'Step 1: Original fraction',
        visual: `<div style="background: rgba(10, 126, 164, 0.1); padding: 16px; border-radius: 8px; border-left: 4px solid var(--brand);">
          <span style="font-size: 1.3rem; font-weight: 700; color: var(--brand-deep);">${example.display}</span>
        </div>`,
        explanation: 'We need to simplify this fraction to lowest terms.'
      },
      {
        title: `Step 2: Find the GCD`,
        visual: `<div style="background: rgba(255, 122, 89, 0.1); padding: 20px; border-radius: 8px; border-left: 4px solid var(--accent);">
          <div style="font-size: 1.1rem; font-weight: 600; color: var(--brand-deep); margin-bottom: 12px;">
            Find the Greatest Common Divisor (GCD)
          </div>
          <div style="padding: 12px; background: rgba(255, 122, 89, 0.2); border-radius: 6px;">
            <div style="color: var(--accent); font-weight: 700;">GCD = ${example.gcd}</div>
            <div style="color: #666; font-size: 0.9rem; margin-top: 4px;">Divide both top and bottom by ${example.gcd}</div>
          </div>
        </div>`,
        explanation: `The GCD is the largest number that divides both the numerator and denominator evenly.`
      },
      {
        title: 'Step 3: Divide by the GCD',
        visual: `<div style="background: rgba(31, 138, 72, 0.1); padding: 20px; border-radius: 8px; border-left: 4px solid var(--success);">
          <div style="font-family: 'Courier New', monospace; font-size: 1.15rem; line-height: 2.4; color: var(--brand-deep); font-weight: 600; text-align: center;">
            <div style="margin-bottom: 12px; color: #666; font-size: 0.95rem;">Cancel common factors:</div>
            <div style="padding: 12px; background: rgba(31, 138, 72, 0.2); border-radius: 6px;">
              <span style="color: var(--success); font-weight: 700; font-size: 1.1rem;">Numerator ÷ ${example.gcd} | Denominator ÷ ${example.gcd}</span>
            </div>
          </div>
        </div>`,
        explanation: 'Divide both the numerator and denominator by the GCD.'
      },
      {
        title: '✓ Simplified Form',
        visual: `<div style="background: rgba(31, 138, 72, 0.15); padding: 20px; border-radius: 8px; border-left: 4px solid var(--success); text-align: center;">
          <span style="font-size: 1.5rem; font-weight: 700; color: var(--success);">${example.simplified}</span>
        </div>`,
        explanation: `${example.display} = ${example.simplified} (in lowest terms)`
      }
    ];

    steps.forEach((step) => {
      const stepDiv = document.createElement('div');
      stepDiv.className = 'step-section';
      stepDiv.innerHTML = `
        <h4>${step.title}</h4>
        <div class="step-visual">${step.visual}</div>
        <p>${step.explanation}</p>
      `;
      fracStepsContainer.appendChild(stepDiv);
    });

    fracStepsContainer.style.display = 'block';
  }

  if (fracCustomBtn) {
    fracCustomBtn.addEventListener('click', () => {
      const expr = fracCustomInput.value.trim();
      displayFracSteps({ display: expr, simplified: '?', gcd: 1 });
    });
  }

  fracExamples.forEach((example) => {
    const card = document.createElement('button');
    card.className = 'example-card';
    card.innerHTML = example.display;
    card.addEventListener('click', () => displayFracSteps(example));
    fracExamplesContainer.appendChild(card);
  });

  // ========== RADICALS & SQUARE ROOTS ==========
  const radExamplesContainer = document.getElementById('rad-examples');
  const radStepsContainer = document.getElementById('rad-steps-container');
  const radCustomInput = document.getElementById('rad-custom-input');
  const radCustomBtn = document.getElementById('rad-custom-btn');

  const radExamples = [
    { display: '√12', simplified: '2√3', explanation: '12 = 4 × 3, so √12 = √4 × √3 = 2√3' },
    { display: '√18', simplified: '3√2', explanation: '18 = 9 × 2, so √18 = √9 × √2 = 3√2' },
    { display: '√36', simplified: '6', explanation: '36 = 6², so √36 = 6' },
    { display: '√50', simplified: '5√2', explanation: '50 = 25 × 2, so √50 = 5√2' }
  ];

  function displayRadSteps(example) {
    radCustomInput.value = example.display;
    radStepsContainer.innerHTML = '';

    // Parse the radical: Extract number from √N
    const numMatch = example.display.match(/√(\d+)/);
    const radicand = numMatch ? parseInt(numMatch[1]) : 0;
    
    // Find largest perfect square factor
    let perfectSquare = 1;
    let remainder = radicand;
    for (let i = 2; i * i <= radicand; i++) {
      if (radicand % (i * i) === 0) {
        perfectSquare = i * i;
        remainder = radicand / perfectSquare;
      }
    }
    
    const sqrtPerfect = Math.sqrt(perfectSquare);
    const simplified = remainder === 1 ? String(sqrtPerfect) : `${sqrtPerfect}√${remainder}`;

    // Step 1: Original radical
    const step1 = document.createElement('div');
    step1.className = 'step-section';
    step1.innerHTML = `
      <h4>Step 1: Original radical</h4>
      <div class="step-visual" style="text-align: center;">
        <div style="font-family: 'Courier New', monospace; font-size: 1.5rem; font-weight: 700; color: var(--brand-deep); padding: 20px; background: rgba(10, 126, 164, 0.1); border-radius: 8px; border: 2px solid var(--brand);">
          ${example.display}
        </div>
      </div>
    `;
    radStepsContainer.appendChild(step1);

    // Step 2: Factor breakdown
    const step2 = document.createElement('div');
    step2.className = 'step-section';
    step2.innerHTML = `
      <h4>Step 2: Factor into perfect square and remainder</h4>
      <div class="step-visual">
        <div style="display: flex; align-items: center; justify-content: center; gap: 20px; flex-wrap: wrap; padding: 20px; background: rgba(255, 122, 89, 0.1); border-radius: 8px;">
          <div style="text-align: center;">
            <div style="font-family: 'Courier New', monospace; font-size: 1.2rem; font-weight: 700; color: var(--brand-deep); padding: 14px 20px; background: rgba(255, 122, 89, 0.2); border-radius: 6px; border: 2px solid var(--accent);">
              ${radicand}
            </div>
          </div>
          <div style="font-size: 1.3rem; font-weight: 700; color: #999;">=</div>
          <div style="text-align: center;">
            <div style="font-family: 'Courier New', monospace; font-size: 1.2rem; font-weight: 700; color: var(--brand-deep); padding: 14px 20px; background: rgba(31, 138, 72, 0.2); border-radius: 6px; border: 2px solid var(--success);">
              ${perfectSquare}
            </div>
            <div style="font-size: 0.75rem; color: #666; margin-top: 4px; font-weight: 600;">perfect square</div>
          </div>
          <div style="font-size: 1.3rem; font-weight: 700; color: #999;">×</div>
          <div style="text-align: center;">
            <div style="font-family: 'Courier New', monospace; font-size: 1.2rem; font-weight: 700; color: var(--brand-deep); padding: 14px 20px; background: rgba(10, 126, 164, 0.2); border-radius: 6px; border: 2px solid var(--brand);">
              ${remainder}
            </div>
            <div style="font-size: 0.75rem; color: #666; margin-top: 4px; font-weight: 600;">remainder</div>
          </div>
        </div>
        <div style="margin-top: 12px; padding: 10px; background: rgba(255, 122, 89, 0.15); border-radius: 6px; text-align: center; font-size: 0.95rem; color: #666; font-weight: 600;">
          So ${radicand} = ${perfectSquare} × ${remainder}
        </div>
      </div>
    `;
    radStepsContainer.appendChild(step2);

    // Step 3: Extract square roots
    const step3 = document.createElement('div');
    step3.className = 'step-section';
    const sqrtRemainderDisplay = remainder === 1 ? '' : `√${remainder}`;
    const finalFormDisplay = remainder === 1 ? `${sqrtPerfect}` : `${sqrtPerfect}√${remainder}`;
    step3.innerHTML = `
      <h4>Step 3: Take square roots</h4>
      <div class="step-visual">
        <div style="background: rgba(31, 138, 72, 0.1); padding: 20px; border-radius: 8px; border-left: 4px solid var(--success);">
          <div style="font-family: 'Courier New', monospace; line-height: 2.2; color: var(--brand-deep); font-weight: 600;">
            <div style="margin-bottom: 16px;">
              √${radicand} = √(${perfectSquare} × ${remainder})
            </div>
            <div style="margin-bottom: 16px; font-size: 0.9rem; color: #666; font-weight: 400;">becomes</div>
            <div style="margin-bottom: 16px;">
              √${perfectSquare}${remainder === 1 ? '' : ` × √${remainder}`}
            </div>
            <div style="margin-bottom: 12px; padding: 12px; background: rgba(31, 138, 72, 0.2); border-radius: 6px;">
              <span style="color: var(--success); font-weight: 700;">${finalFormDisplay}</span>
              <span style="color: #999; font-size: 0.9rem; margin-left: 12px;">makes ${finalFormDisplay}</span>
            </div>
          </div>
        </div>
      </div>
    `;
    radStepsContainer.appendChild(step3);

    // Step 4: Final simplified form
    const step4 = document.createElement('div');
    step4.className = 'step-section';
    step4.innerHTML = `
      <h4>✓ Simplified Form</h4>
      <div class="step-visual" style="text-align: center;">
        <div style="font-family: 'Courier New', monospace; font-size: 1.5rem; font-weight: 700; color: var(--success); padding: 24px; background: rgba(31, 138, 72, 0.15); border-radius: 8px; border: 2px solid var(--success);">
          ${simplified}
        </div>
        <div style="margin-top: 12px; font-size: 0.95rem; color: #666; font-weight: 600;">
          ${example.display} simplifies to ${simplified}
        </div>
      </div>
    `;
    radStepsContainer.appendChild(step4);

    radStepsContainer.style.display = 'block';
  }

  if (radCustomBtn) {
    radCustomBtn.addEventListener('click', () => {
      const expr = radCustomInput.value.trim();
      displayRadSteps({ display: expr, simplified: '?', explanation: 'Factor to find perfect squares' });
    });
  }

  radExamples.forEach((example) => {
    const card = document.createElement('button');
    card.className = 'example-card';
    card.innerHTML = example.display;
    card.addEventListener('click', () => displayRadSteps(example));
    radExamplesContainer.appendChild(card);
  });

  // ========== POLYNOMIAL OPERATIONS ==========
  const polyExamplesContainer = document.getElementById('poly-examples');
  const polyStepsContainer = document.getElementById('poly-steps-container');
  const polyCustomInput = document.getElementById('poly-custom-input');
  const polyCustomBtn = document.getElementById('poly-custom-btn');

  const polyExamples = [
    { display: '(x + 2)(x + 3)', expanded: 'x² + 5x + 6' },
    { display: '(x + 1)(x - 2)', expanded: 'x² - x - 2' },
    { display: '(2x + 3)(x + 1)', expanded: '2x² + 5x + 3' },
    { display: '(x - 4)(x - 5)', expanded: 'x² - 9x + 20' }
  ];

  function parseBinomial(expr) {
    // Parse expressions like (ax+b)(cx+d)
    const match = expr.match(/\(([^)]+)\)\(([^)]+)\)/);
    if (!match) return null;
    
    const parse = (term) => {
      const xMatch = term.match(/([+-]?\d*)\s*x\s*([+-]\s*\d+)?/);
      if (!xMatch) return null;
      const coeff = xMatch[1] === '' || xMatch[1] === '+' ? 1 : xMatch[1] === '-' ? -1 : parseInt(xMatch[1]);
      const constant = xMatch[2] ? parseInt(xMatch[2].replace(/\s/g, '')) : 0;
      return { coeff, constant };
    };
    
    const term1 = parse(match[1].trim());
    const term2 = parse(match[2].trim());
    
    return { term1, term2, expr };
  }

  function displayPolySteps(example) {
    polyCustomInput.value = example.display;
    polyStepsContainer.innerHTML = '';

    const parsed = parseBinomial(example.display);
    let foilWorkingVisual = '';
    let combineVisual = '';
    
    if (parsed) {
      const { term1, term2 } = parsed;
      if (term1 && term2) {
        // Format terms for display in calculations
        const formatBinomialTerm = (coeff, constant) => {
          const coeffStr = coeff === 1 ? '' : coeff === -1 ? '-' : coeff;
          const xPart = coeff === 0 ? '' : 'x';
          const constPart = constant === 0 ? '' : (constant > 0 ? ` + ${constant}` : ` - ${Math.abs(constant)}`);
          return `${coeffStr}${xPart}${constPart}`.trim();
        };
        
        const term1Str = formatBinomialTerm(term1.coeff, term1.constant);
        const term2Str = formatBinomialTerm(term2.coeff, term2.constant);
        
        // Calculate FOIL products
        const first = term1.coeff * term2.coeff;
        const outer = term1.coeff * term2.constant;
        const inner = term1.constant * term2.coeff;
        const last = term1.constant * term2.constant;
        
        // Create detailed FOIL breakdown with actual calculations shown
        const coeff1 = term1.coeff === 1 ? 'x' : term1.coeff === -1 ? '-x' : `${term1.coeff}x`;
        const const1 = term1.constant > 0 ? `+ ${term1.constant}` : term1.constant < 0 ? `- ${Math.abs(term1.constant)}` : '';
        const coeff2 = term2.coeff === 1 ? 'x' : term2.coeff === -1 ? '-x' : `${term2.coeff}x`;
        const const2 = term2.constant > 0 ? `+ ${term2.constant}` : term2.constant < 0 ? `- ${Math.abs(term2.constant)}` : '';
        
        foilWorkingVisual = `<div style="background: rgba(255, 122, 89, 0.1); padding: 20px; border-radius: 8px; border-left: 4px solid var(--accent);">
          <div style="font-family: 'Courier New', monospace; color: var(--brand-deep); line-height: 2.8;">
            <style>
              .foil-term-box { position: relative; cursor: pointer; transition: all 0.3s ease; }
              .foil-term-box:hover { transform: scale(1.02); }
              .binomial-term { display: inline-block; position: relative; margin: 0 6px; padding: 8px 12px; border: 2px solid #0a7ea4; border-radius: 4px; transition: all 0.3s ease; }
              .binomial-term.highlight-green { box-shadow: 0 0 0 4px #1abc9c, inset 0 0 0 2px #1abc9c !important; background: rgba(26, 188, 156, 0.2) !important; }
              .binomial-term.highlight-purple { box-shadow: 0 0 0 4px #9b59b6, inset 0 0 0 2px #9b59b6 !important; background: rgba(155, 89, 182, 0.2) !important; }
              .binomial-term.highlight-orange { box-shadow: 0 0 0 4px #e67e22, inset 0 0 0 2px #e67e22 !important; background: rgba(230, 126, 34, 0.2) !important; }
              .binomial-term.highlight-red { box-shadow: 0 0 0 4px #e74c3c, inset 0 0 0 2px #e74c3c !important; background: rgba(231, 76, 60, 0.2) !important; }
            </style>
            
            <!-- Original binomials at top -->
            <div style="text-align: center; margin-bottom: 24px; padding: 16px; background: rgba(255,255,255,0.6); border-radius: 8px;">
              <div style="font-size: 0.9rem; color: #666; margin-bottom: 12px; font-weight: 600;">Hover on a FOIL box to see which terms multiply:</div>
              <div style="font-size: 1.3rem; font-weight: 900; color: var(--brand-deep); letter-spacing: 2px;">
                <span class="binomial-term" style="border: 2px solid #0a7ea4;" data-term="coeff1">${coeff1}</span>
                <span class="binomial-term" style="border: 2px solid #0a7ea4;" data-term="const1">${const1}</span>
                <span style="color: #666; margin: 0 4px;">×</span>
                <span class="binomial-term" style="border: 2px solid #0c4c72;" data-term="coeff2">${coeff2}</span>
                <span class="binomial-term" style="border: 2px solid #0c4c72;" data-term="const2">${const2}</span>
              </div>
            </div>
            
            <!-- FOIL Products with "makes" language -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;" class="foil-grid">
              <div class="foil-term-box" style="padding: 14px; background: rgba(26, 188, 156, 0.2); border-radius: 6px; border: 2px solid #1abc9c; cursor: pointer;" onmouseenter="document.querySelectorAll('[data-term=coeff1], [data-term=coeff2]').forEach(t=>t.classList.add('highlight-green'))" onmouseleave="document.querySelectorAll('.binomial-term').forEach(t=>t.classList.remove('highlight-green','highlight-purple','highlight-orange','highlight-red'))">
                <div style="font-size: 0.85rem; color: #666; margin-bottom: 8px; font-weight: 700;">FIRST</div>
                <div style="font-size: 0.95rem; color: var(--brand-deep); margin-bottom: 10px; font-weight: 600;">${coeff1} × ${coeff2}</div>
                <div style="font-size: 0.8rem; color: #999; margin-bottom: 10px;">makes</div>
                <div style="font-weight: 900; font-size: 1.3rem; color: #1abc9c; text-align: center; padding: 8px; background: rgba(26, 188, 156, 0.4); border-radius: 4px;">${first}x²</div>
              </div>
              <div class="foil-term-box" style="padding: 14px; background: rgba(155, 89, 182, 0.2); border-radius: 6px; border: 2px solid #9b59b6; cursor: pointer;" onmouseenter="document.querySelectorAll('[data-term=coeff1], [data-term=const2]').forEach(t=>t.classList.add('highlight-purple'))" onmouseleave="document.querySelectorAll('.binomial-term').forEach(t=>t.classList.remove('highlight-green','highlight-purple','highlight-orange','highlight-red'))">
                <div style="font-size: 0.85rem; color: #666; margin-bottom: 8px; font-weight: 700;">OUTER</div>
                <div style="font-size: 0.95rem; color: var(--brand-deep); margin-bottom: 10px; font-weight: 600;">${coeff1} × ${const2}</div>
                <div style="font-size: 0.8rem; color: #999; margin-bottom: 10px;">makes</div>
                <div style="font-weight: 900; font-size: 1.3rem; color: #9b59b6; text-align: center; padding: 8px; background: rgba(155, 89, 182, 0.4); border-radius: 4px;">${outer > 0 ? '+' : ''}${outer}x</div>
              </div>
              <div class="foil-term-box" style="padding: 14px; background: rgba(230, 126, 34, 0.2); border-radius: 6px; border: 2px solid #e67e22; cursor: pointer;" onmouseenter="document.querySelectorAll('[data-term=const1], [data-term=coeff2]').forEach(t=>t.classList.add('highlight-orange'))" onmouseleave="document.querySelectorAll('.binomial-term').forEach(t=>t.classList.remove('highlight-green','highlight-purple','highlight-orange','highlight-red'))">
                <div style="font-size: 0.85rem; color: #666; margin-bottom: 8px; font-weight: 700;">INNER</div>
                <div style="font-size: 0.95rem; color: var(--brand-deep); margin-bottom: 10px; font-weight: 600;">${const1} × ${coeff2}</div>
                <div style="font-size: 0.8rem; color: #999; margin-bottom: 10px;">makes</div>
                <div style="font-weight: 900; font-size: 1.3rem; color: #e67e22; text-align: center; padding: 8px; background: rgba(230, 126, 34, 0.4); border-radius: 4px;">${inner > 0 ? '+' : ''}${inner}x</div>
              </div>
              <div class="foil-term-box" style="padding: 14px; background: rgba(231, 76, 60, 0.2); border-radius: 6px; border: 2px solid #e74c3c; cursor: pointer;" onmouseenter="document.querySelectorAll('[data-term=const1], [data-term=const2]').forEach(t=>t.classList.add('highlight-red'))" onmouseleave="document.querySelectorAll('.binomial-term').forEach(t=>t.classList.remove('highlight-green','highlight-purple','highlight-orange','highlight-red'))">
                <div style="font-size: 0.85rem; color: #666; margin-bottom: 8px; font-weight: 700;">LAST</div>
                <div style="font-size: 0.95rem; color: var(--brand-deep); margin-bottom: 10px; font-weight: 600;">${const1} × ${const2}</div>
                <div style="font-size: 0.8rem; color: #999; margin-bottom: 10px;">makes</div>
                <div style="font-weight: 900; font-size: 1.3rem; color: #e74c3c; text-align: center; padding: 8px; background: rgba(231, 76, 60, 0.4); border-radius: 4px;">${last > 0 ? '+' : ''}${last}</div>
              </div>
            </div>
          </div>
        </div>`;
        
        // Show how like terms are combined
        const xTermSum = outer + inner;
        const xTermDisplay = xTermSum === 0 ? '' : xTermSum === 1 ? 'x' : xTermSum === -1 ? '-x' : `${xTermSum}x`;
        const lastDisplay = last > 0 ? `+ ${last}` : last < 0 ? `- ${Math.abs(last)}` : '';
        
        combineVisual = `<div style="background: rgba(31, 138, 72, 0.1); padding: 20px; border-radius: 8px; border-left: 4px solid var(--success);">
          <div style="font-family: 'Courier New', monospace; color: var(--brand-deep); line-height: 2.8;">
            <!-- Combining step -->
            <div style="padding: 16px; background: rgba(31, 138, 72, 0.2); border-radius: 8px; margin-bottom: 20px;">
              <div style="font-size: 0.9rem; color: #666; font-weight: 600; margin-bottom: 12px;">Now we combine the like terms:</div>
              
              <div style="font-size: 1.15rem; font-weight: 700; color: var(--brand-deep); text-align: center; margin-bottom: 16px;">
                <span style="background: rgba(155, 89, 182, 0.3); padding: 8px 12px; border-radius: 4px; display: inline-block; margin: 4px;">${outer}x</span>
                <span style="color: #666; margin: 0 8px; font-weight: 400;">and</span>
                <span style="background: rgba(230, 126, 34, 0.3); padding: 8px 12px; border-radius: 4px; display: inline-block; margin: 4px;">${inner > 0 ? '+' : ''}${inner}x</span>
              </div>
              
              <div style="text-align: center; font-size: 0.95rem; color: #666; margin-bottom: 12px; font-weight: 600;">are LIKE TERMS (both have x)</div>
              
              <div style="font-size: 1.05rem; text-align: center; font-weight: 700; color: var(--brand-deep);">
                <span style="background: rgba(155, 89, 182, 0.3); padding: 8px 12px; border-radius: 4px; display: inline-block; margin: 4px;">${outer}</span>
                +
                <span style="background: rgba(230, 126, 34, 0.3); padding: 8px 12px; border-radius: 4px; display: inline-block; margin: 4px;">${inner}</span>
                =
                <span style="background: rgba(155, 89, 182, 0.6); color: white; padding: 8px 12px; border-radius: 4px; display: inline-block; margin: 4px; font-weight: 900;">${xTermSum}</span>
              </div>
              
              <div style="text-align: center; font-size: 1.1rem; font-weight: 800; color: var(--success); margin-top: 12px;">
                So together they make: <span style="background: rgba(155, 89, 182, 0.6); color: white; padding: 8px 12px; border-radius: 4px; display: inline-block; margin: 4px;">${xTermSum}x</span>
              </div>
            </div>
            
            <!-- Final combined form -->
            <div style="padding: 16px; background: rgba(31, 138, 72, 0.3); border-radius: 8px; border: 3px solid var(--success); text-align: center;">
              <div style="font-size: 0.95rem; color: #666; margin-bottom: 12px; font-weight: 600;">✓ COMBINING ALL THE PIECES TOGETHER:</div>
              
              <div style="margin-bottom: 16px;">
                <div style="font-size: 0.9rem; color: #666; margin-bottom: 6px;">The</div>
                <div style="display: inline-block; background: rgba(26, 188, 156, 0.3); padding: 8px 12px; border-radius: 4px; margin: 4px; font-weight: 700; font-size: 1.05rem;">${first}x²</div>
                <span style="color: #666; margin: 0 6px;">+</span>
                <div style="display: inline-block; background: rgba(155, 89, 182, 0.6); color: white; padding: 8px 12px; border-radius: 4px; margin: 4px; font-weight: 800; font-size: 1.05rem;">${xTermSum}x</div>
                <span style="color: #666; margin: 0 6px;">+</span>
                <div style="display: inline-block; background: rgba(231, 76, 60, 0.3); padding: 8px 12px; border-radius: 4px; margin: 4px; font-weight: 700; font-size: 1.05rem;">${last}</div>
              </div>
              
              <div style="font-size: 0.95rem; color: #666; margin-bottom: 12px; font-weight: 600;">makes</div>
              
              <div style="font-size: 1.6rem; font-weight: 900; color: var(--success); padding: 12px; background: rgba(31, 138, 72, 0.25); border-radius: 6px;">
                ${example.expanded}
              </div>
            </div>
          </div>
        </div>`;
      }
    }

    const steps = [
      {
        title: 'Step 1: Binomials to multiply',
        visual: `<div style="background: rgba(10, 126, 164, 0.1); padding: 16px; border-radius: 8px; border-left: 4px solid var(--brand);">
          <span style="font-size: 1.3rem; font-weight: 700; color: var(--brand-deep);">${example.display}</span>
        </div>`,
        explanation: 'We need to multiply these two binomials together to expand the expression.'
      },
      {
        title: 'Step 2: Apply FOIL method',
        visual: `<div style="background: rgba(255, 122, 89, 0.1); padding: 20px; border-radius: 8px; border-left: 4px solid var(--accent);">
          <div style="font-size: 1.1rem; font-weight: 600; color: var(--brand-deep); margin-bottom: 12px;">
            <strong>F</strong>irst · <strong>O</strong>uter · <strong>I</strong>nner · <strong>L</strong>ast
          </div>
          <div style="padding: 12px; background: rgba(255, 122, 89, 0.2); border-radius: 6px; font-size: 0.9rem;">
            Multiply each term in the first binomial by each term in the second binomial
          </div>
        </div>`,
        explanation: 'FOIL helps us remember to multiply all four pairs of terms correctly.'
      },
      {
        title: 'Step 3: Calculate each product',
        visual: foilWorkingVisual || `<div style="background: rgba(31, 138, 72, 0.1); padding: 20px; border-radius: 8px; border-left: 4px solid var(--success);">
          <div style="color: var(--brand-deep); font-weight: 600;">Unable to parse expression. Use format: (ax+b)(cx+d)</div>
        </div>`,
        explanation: 'Each colored box shows one FOIL product with the actual multiplication calculation.'
      },
      {
        title: 'Step 4: Combine like terms',
        visual: combineVisual || `<div style="background: rgba(31, 138, 72, 0.15); padding: 20px; border-radius: 8px; border-left: 4px solid var(--success); text-align: center;">
          <span style="font-size: 1.2rem; font-weight: 700; color: var(--success);">${example.expanded}</span>
        </div>`,
        explanation: 'Add together all the x terms (the middle terms). These are "like terms" because they both have x.'
      },
      {
        title: '✓ Final Answer',
        visual: `<div style="background: rgba(31, 138, 72, 0.15); padding: 20px; border-radius: 8px; border-left: 4px solid var(--success); text-align: center;">
          <span style="font-size: 1.4rem; font-weight: 700; color: var(--success);">${example.expanded}</span>
        </div>`,
        explanation: `${example.display} completely expanded is ${example.expanded}`
      }
    ];

    steps.forEach((step) => {
      const stepDiv = document.createElement('div');
      stepDiv.className = 'step-section';
      stepDiv.innerHTML = `
        <h4>${step.title}</h4>
        <div class="step-visual">${step.visual}</div>
        <p>${step.explanation}</p>
      `;
      polyStepsContainer.appendChild(stepDiv);
    });

    polyStepsContainer.style.display = 'block';
  }

  if (polyCustomBtn) {
    polyCustomBtn.addEventListener('click', () => {
      const expr = polyCustomInput.value.trim();
      displayPolySteps({ display: expr, expanded: '?' });
    });
  }

  polyExamples.forEach((example) => {
    const card = document.createElement('button');
    card.className = 'example-card';
    card.innerHTML = example.display;
    card.addEventListener('click', () => displayPolySteps(example));
    polyExamplesContainer.appendChild(card);
  });
});
