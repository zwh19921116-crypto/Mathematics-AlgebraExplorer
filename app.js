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
        title: 'Step 1: Write the equation',
        visual: `<div style="background: rgba(10, 126, 164, 0.1); padding: 16px; border-radius: 8px; border-left: 4px solid var(--brand);">
          <span style="font-size: 1.3rem; font-weight: 700; color: var(--brand-deep);">${a}x ${signed(b)} = ${c}x ${signed(d)}</span>
        </div>`,
        explanation: `This is what we're solving. Goal: Get x by itself on one side.`
      },
      {
        title: `Step 2: Subtract ${c}x from BOTH sides`,
        visual: `<div style="background: rgba(255, 122, 89, 0.1); padding: 20px; border-radius: 8px; border-left: 4px solid var(--accent);">
          <div style="font-family: 'Courier New', monospace; font-size: 1.15rem; line-height: 2.4; color: var(--brand-deep); font-weight: 600; text-align: center;">
            <div style="margin-bottom: 12px; color: #666; font-size: 0.95rem;">Original:</div>
            <div style="margin-bottom: 24px;">${a}x ${signed(b)} = ${c}x ${signed(d)}</div>
            
            <div style="margin-bottom: 12px; color: #666; font-size: 0.95rem;">Subtract ${c}x from BOTH sides:</div>
            <div style="margin-bottom: 24px;">
              ${a}x ${signed(b)} <span style="color: #d94a4a; font-weight: 700; font-size: 1.2rem;"> − ${c}x </span>= ${c}x ${signed(d)} <span style="color: #d94a4a; font-weight: 700; font-size: 1.2rem;"> − ${c}x </span>
            </div>
            
            <div style="padding: 12px; background: rgba(31, 138, 72, 0.2); border-radius: 6px; border-left: 3px solid var(--success);">
              <div style="color: var(--success); font-weight: 700;">${leftCoeff}x ${signed(b)} = ${d}</div>
            </div>
          </div>
        </div>`,
        explanation: `We subtract ${c}x from both sides to move all x terms to the left.`
      },
      {
        title: `Step 3: Subtract ${b} from BOTH sides`,
        visual: `<div style="background: rgba(255, 122, 89, 0.1); padding: 20px; border-radius: 8px; border-left: 4px solid var(--accent);">
          <div style="font-family: 'Courier New', monospace; font-size: 1.15rem; line-height: 2.4; color: var(--brand-deep); font-weight: 600; text-align: center;">
            <div style="margin-bottom: 12px; color: #666; font-size: 0.95rem;">Previous step:</div>
            <div style="margin-bottom: 24px;">${leftCoeff}x ${signed(b)} = ${d}</div>
            
            <div style="margin-bottom: 12px; color: #666; font-size: 0.95rem;">Subtract ${b} from BOTH sides:</div>
            <div style="margin-bottom: 24px;">
              ${leftCoeff}x ${signed(b)} <span style="color: #d94a4a; font-weight: 700; font-size: 1.2rem;"> − ${b} </span>= ${d} <span style="color: #d94a4a; font-weight: 700; font-size: 1.2rem;"> − ${b} </span>
            </div>
            
            <div style="padding: 12px; background: rgba(31, 138, 72, 0.2); border-radius: 6px; border-left: 3px solid var(--success);">
              <div style="color: var(--success); font-weight: 700;">${leftCoeff}x = ${rightConst}</div>
            </div>
          </div>
        </div>`,
        explanation: `We subtract ${b} from both sides to move the constant to the right.`
      },
      {
        title: `Step 4: Divide BOTH sides by ${leftCoeff}`,
        visual: `<div style="background: rgba(31, 138, 72, 0.1); padding: 20px; border-radius: 8px; border-left: 4px solid var(--success);">
          <div style="font-family: 'Courier New', monospace; font-size: 1.15rem; line-height: 2.4; color: var(--brand-deep); font-weight: 600; text-align: center;">
            <div style="margin-bottom: 12px; color: #666; font-size: 0.95rem;">Previous step:</div>
            <div style="margin-bottom: 24px;">${leftCoeff}x = ${rightConst}</div>
            
            <div style="margin-bottom: 12px; color: #666; font-size: 0.95rem;">Divide BOTH sides by ${leftCoeff}:</div>
            <div style="margin-bottom: 24px;">
              ${leftCoeff}x <span style="color: #d94a4a; font-weight: 700; font-size: 1.2rem;"> ÷ ${leftCoeff} </span>= ${rightConst} <span style="color: #d94a4a; font-weight: 700; font-size: 1.2rem;"> ÷ ${leftCoeff} </span>
            </div>
            
            <div style="padding: 12px; background: rgba(31, 138, 72, 0.3); border-radius: 6px; border-left: 3px solid var(--success);">
              <div style="color: var(--success); font-weight: 700; font-size: 1.3rem;">x = ${fmt(x)}</div>
            </div>
          </div>
        </div>`,
        explanation: `Divide both sides by ${leftCoeff} to get x by itself.`
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
        title: 'Step 1: Identify the expression',
        visual: `<span style="font-size: 1.2rem; font-weight: 600; color: var(--brand-deep);">${example.display}</span>`,
        explanation: 'An expression contains variables (letters) and numbers.'
      },
      {
        title: 'Step 2: Find each term',
        visual: example.terms.map(t => `<span class="term-box x-term">${t}</span>`).join(''),
        explanation: `Terms are separated by + and -. This has ${example.terms.length} terms: ${example.terms.join(', ')}`
      },
      {
        title: 'Step 3: Identify parts of each term',
        visual: `<div style="text-align: left;">
          <p><strong>Coefficient</strong>: The number that multiplies the variable</p>
          <p><strong>Variable</strong>: The letter (x, y, a, etc.)</p>
          <p><strong>Exponent/Power</strong>: The small number (if any)</p>
          <p><strong>Constant</strong>: A term with no variable</p>
        </div>`,
        explanation: 'For example: In 3x², 3 is the coefficient, x is the variable, 2 is the exponent.'
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

    const steps = [
      {
        title: 'PEMDAS Reminder',
        visual: '<strong>P</strong>arentheses → <strong>E</strong>xponents → <strong>M</strong>ultiply/<strong>D</strong>ivide (left→right) → <strong>A</strong>dd/<strong>S</strong>ubtract (left→right)',
        explanation: 'Always follow this order!'
      },
      {
        title: 'Step 1: Look at the expression',
        visual: `<span style="font-size: 1.2rem; font-weight: 600;">${example.display}</span>`,
        explanation: 'Identify which operations need to be done first.'
      },
      {
        title: 'Step 2: Follow PEMDAS',
        visual: `<span style="font-size: 1.1rem;">Do multiplication and division first (left to right)</span>`,
        explanation: 'In this case, multiply or divide before adding or subtracting.'
      },
      {
        title: '✓ Final Answer',
        visual: `<span style="font-size: 1.4rem; font-weight: 700; color: var(--success);">${example.solution}</span>`,
        explanation: 'The answer after following the correct order of operations.'
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
    const steps = [
      {
        title: 'Step 1: Look at the numbers',
        visual: `<span style="font-size: 1.2rem; font-weight: 600;">${example.a} + ${example.b}</span>`,
        explanation: 'Identify positive and negative numbers.'
      },
      {
        title: 'Step 2: Combine them',
        visual: `<span style="font-size: 1.1rem;">Think of a number line</span>`,
        explanation: `Start at ${example.a}, move ${example.b > 0 ? example.b + ' right' : Math.abs(example.b) + ' left'}`
      },
      {
        title: '✓ Answer',
        visual: `<span style="font-size: 1.4rem; font-weight: 700; color: var(--success);">${result}</span>`,
        explanation: `${example.a} + ${example.b} = ${result}`
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
        title: `Step 2: What operation is being done to x?`,
        visual: `<div style="background: rgba(255, 122, 89, 0.1); padding: 16px; border-radius: 8px; border-left: 4px solid var(--accent);">
          <div style="font-size: 1.1rem; margin: 8px 0;"><strong>We're ${operation}ing ${operand}</strong></div>
          <div style="margin-top: 12px; font-weight: 600; color: var(--brand-deep);">${explanation1}</div>
        </div>`,
        explanation: `The inverse (opposite) operation is key! We do it to BOTH sides of the equation.`
      },
      {
        title: `Step 3: ${inverseOp.charAt(0).toUpperCase() + inverseOp.slice(1)} ${operand} from BOTH sides`,
        visual: `<div style="background: rgba(255, 122, 89, 0.1); padding: 20px; border-radius: 8px; border-left: 4px solid var(--accent);">
          <div style="font-family: 'Courier New', monospace; font-size: 1.15rem; line-height: 2.4; color: var(--brand-deep); font-weight: 600; text-align: center;">
            <div style="margin-bottom: 12px; color: #666; font-size: 0.95rem;">Original equation:</div>
            <div style="margin-bottom: 24px;">${example.display}</div>
            
            <div style="margin-bottom: 12px; color: #666; font-size: 0.95rem;">Apply ${inverseOp} ${operand} to BOTH sides:</div>
            <div style="margin-bottom: 24px;">
              ${example.display.split('=')[0].trim()} <span style="color: #d94a4a; font-weight: 700; font-size: 1.2rem;"> ${inverseSymbol} ${operand} </span>= ${example.display.split('=')[1].trim()} <span style="color: #d94a4a; font-weight: 700; font-size: 1.2rem;"> ${inverseSymbol} ${operand} </span>
            </div>
            
            <div style="padding: 12px; background: rgba(31, 138, 72, 0.2); border-radius: 6px; border-left: 3px solid var(--success);">
              <div style="color: var(--success); font-weight: 700; font-size: 1.3rem;">x = ${x}</div>
            </div>
          </div>
        </div>`,
        explanation: `We MUST do the same operation to both sides to keep the equation balanced. That's the golden rule of algebra!`
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

  function displayTwoStepSteps(example) {
    twoStepCustomInput.value = example.display;
    twoStepStepsContainer.innerHTML = '';

    const steps = [
      {
        title: 'Step 1: Identify the equation',
        visual: `<span style="font-size: 1.2rem; font-weight: 600;">${example.display}</span>`,
        explanation: 'We need two operations: undo addition/subtraction, then undo multiplication/division.'
      },
      {
        title: 'Step 2: Undo addition/subtraction first',
        visual: `<span style="font-size: 1.1rem;">Move the constant to the other side</span>`,
        explanation: 'This isolates the term with x.'
      },
      {
        title: 'Step 3: Undo multiplication/division',
        visual: `<span style="font-size: 1.1rem;">Divide by the coefficient</span>`,
        explanation: 'This isolates x completely.'
      },
      {
        title: '✓ Answer',
        visual: `<span style="font-size: 1.4rem; font-weight: 700; color: var(--success);">x = ${example.x}</span>`,
        explanation: `The value of x is ${example.x}`
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

  function displayMultiStepSteps(example) {
    multiStepCustomInput.value = example.display;
    multiStepStepsContainer.innerHTML = '';

    const steps = [
      {
        title: 'Step 1: Original equation',
        visual: `<span style="font-size: 1.2rem; font-weight: 600;">${example.display}</span>`,
        explanation: 'Combine like terms first, then solve like a two-step equation.'
      },
      {
        title: 'Step 2: Combine like terms on left side',
        visual: `<span style="font-size: 1.1rem;">Group all x terms together</span>`,
        explanation: 'Add or subtract the coefficients of x.'
      },
      {
        title: 'Step 3: Isolate the x term',
        visual: `<span style="font-size: 1.1rem;">Move constants to the right side</span>`,
        explanation: 'Use addition or subtraction.'
      },
      {
        title: 'Step 4: Solve for x',
        visual: `<span style="font-size: 1.1rem;">Divide by the coefficient</span>`,
        explanation: 'This gives us the final answer.'
      },
      {
        title: '✓ Answer',
        visual: `<span style="font-size: 1.4rem; font-weight: 700; color: var(--success);">x = ${fmt(example.x)}</span>`,
        explanation: `The value of x is ${fmt(example.x)}`
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
        title: 'Step 1: Look at the inequality',
        visual: `<span style="font-size: 1.2rem; font-weight: 600;">${example.display}</span>`,
        explanation: 'Inequalities show a range of values, not just one answer.'
      },
      {
        title: 'Step 2: Solve like an equation',
        visual: `<span style="font-size: 1.1rem;">Use the same steps as solving equations</span>`,
        explanation: 'Undo operations by doing the opposite on both sides.'
      },
      {
        title: '⚠️ Important Rule!',
        visual: `<span style="font-size: 1.1rem; font-weight: 700; color: var(--danger);">If you multiply or divide by a negative number, FLIP the inequality sign!</span>`,
        explanation: 'For example: -2x > 6 becomes x < -3 (sign flips when dividing by -2)'
      },
      {
        title: '✓ Answer',
        visual: `<span style="font-size: 1.4rem; font-weight: 700; color: var(--success);">${example.answer}</span>`,
        explanation: `Any value where ${example.answer} makes the inequality true.`
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

  function displayFactorSteps(example) {
    factorCustomInput.value = example.display;
    factorStepsContainer.innerHTML = '';

    const steps = [
      {
        title: 'Step 1: Look at the quadratic',
        visual: `<span style="font-size: 1.2rem; font-weight: 600;">${example.display}</span>`,
        explanation: 'Find two numbers that multiply to give the constant term and add to give the middle coefficient.'
      },
      {
        title: 'Step 2: Find the factor pairs',
        visual: `<span style="font-size: 1.1rem;">Look for patterns</span>`,
        explanation: 'For quadratics of form x² + bx + c, we need numbers that multiply to c and add to b.'
      },
      {
        title: 'Step 3: Write the factors',
        visual: `<span style="font-size: 1.1rem;">Use the pattern (x + m)(x + n)</span>`,
        explanation: 'where m and n are the numbers from Step 2.'
      },
      {
        title: '✓ Factored Form',
        visual: `<span style="font-size: 1.4rem; font-weight: 700; color: var(--success);">${example.factored}</span>`,
        explanation: `${example.display} = ${example.factored}`
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

  function displayQuadSteps(example) {
    quadCustomInput.value = example.display;
    quadStepsContainer.innerHTML = '';

    const steps = [
      {
        title: 'Step 1: Identify the quadratic',
        visual: `<span style="font-size: 1.2rem; font-weight: 600;">${example.display}</span>`,
        explanation: 'Quadratic equations have an x² term and equal zero.'
      },
      {
        title: 'Step 2: Method 1 - Factor if possible',
        visual: `<span style="font-size: 1.1rem;">Factor into (x + a)(x + b) = 0</span>`,
        explanation: 'If it factors nicely, solve each factor = 0'
      },
      {
        title: 'Step 3: Method 2 - Use the Quadratic Formula',
        visual: `<span style="font-size: 1rem;"><strong>x = [-b ± √(b² - 4ac)] / 2a</strong></span>`,
        explanation: 'This always works for any quadratic equation'
      },
      {
        title: 'Step 4: Solve for x',
        visual: `<span style="font-size: 1.1rem;">Perform the calculations</span>`,
        explanation: 'Quadratics typically have 2 solutions (roots)'
      },
      {
        title: '✓ Roots',
        visual: `<span style="font-size: 1.3rem; font-weight: 700; color: var(--success);">${example.roots}</span>`,
        explanation: `The solutions to the quadratic equation`
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
        title: 'Step 1: Identify the operation',
        visual: `<span style="font-size: 1.2rem; font-weight: 600;">${example.display}</span>`,
        explanation: `The rule is: ${example.rule}`
      },
      {
        title: 'Step 2: Apply the rule',
        visual: `<span style="font-size: 1.1rem;">Follow the exponent rule for this operation</span>`,
        explanation: 'Remember: the bases must be the same to use these rules!'
      },
      {
        title: '✓ Simplified Form',
        visual: `<span style="font-size: 1.4rem; font-weight: 700; color: var(--success);">${example.simplified}</span>`,
        explanation: `${example.display} = ${example.simplified}`
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
        title: 'Step 1: Look at the fraction',
        visual: `<span style="font-size: 1.2rem; font-weight: 600;">${example.display}</span>`,
        explanation: 'Find the greatest common divisor (GCD) of the numbers.'
      },
      {
        title: `Step 2: Find the GCD`,
        visual: `<span style="font-size: 1.1rem;">GCD = ${example.gcd}</span>`,
        explanation: `Divide both numerator and denominator by ${example.gcd}`
      },
      {
        title: 'Step 3: Cancel common factors',
        visual: `<span style="font-size: 1.1rem;">Also cancel common variables</span>`,
        explanation: 'Any variables that appear in both numerator and denominator cancel out.'
      },
      {
        title: '✓ Simplified Form',
        visual: `<span style="font-size: 1.4rem; font-weight: 700; color: var(--success);">${example.simplified}</span>`,
        explanation: `${example.display} = ${example.simplified}`
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

    const steps = [
      {
        title: 'Step 1: Look at the radical',
        visual: `<span style="font-size: 1.2rem; font-weight: 600;">${example.display}</span>`,
        explanation: 'Find perfect square factors of the number under the radical.'
      },
      {
        title: 'Step 2: Factor into perfect squares',
        visual: `<span style="font-size: 1.1rem;">${example.explanation}</span>`,
        explanation: 'Perfect squares: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100...'
      },
      {
        title: 'Step 3: Simplify',
        visual: `<span style="font-size: 1.1rem;">Take square root of perfect squares outside</span>`,
        explanation: 'Keep the rest under the radical.'
      },
      {
        title: '✓ Simplified Form',
        visual: `<span style="font-size: 1.4rem; font-weight: 700; color: var(--success);">${example.simplified}</span>`,
        explanation: `${example.display} = ${example.simplified}`
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
      radStepsContainer.appendChild(stepDiv);
    });

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

  function displayPolySteps(example) {
    polyCustomInput.value = example.display;
    polyStepsContainer.innerHTML = '';

    const steps = [
      {
        title: 'Step 1: Identify the polynomials',
        visual: `<span style="font-size: 1.2rem; font-weight: 600;">${example.display}</span>`,
        explanation: 'We need to multiply these two binomials together.'
      },
      {
        title: 'Step 2: Use FOIL method',
        visual: `<span style="font-size: 1.1rem;"><strong>F</strong>irst · <strong>O</strong>uter · <strong>I</strong>nner · <strong>L</strong>ast</span>`,
        explanation: 'Multiply each term in the first binomial by each term in the second.'
      },
      {
        title: 'Step 3: Multiply all pairs',
        visual: `<span style="font-size: 1.1rem;">Create four products, then combine like terms</span>`,
        explanation: 'This gives us the expanded form.'
      },
      {
        title: '✓ Expanded Form',
        visual: `<span style="font-size: 1.3rem; font-weight: 700; color: var(--success);">${example.expanded}</span>`,
        explanation: `${example.display} = ${example.expanded}`
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
