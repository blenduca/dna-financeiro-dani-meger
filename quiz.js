// =====================================================================
// DANI MEGER — QUIZ DE PERSONALIDADE FINANCEIRA
// Big Five + Eneagrama · Vanilla JS
// =====================================================================

// ===== PERGUNTAS =====
const questions = [
  // Big Five - Abertura (Openness)
  { id: 1, text: "Tenho uma imaginação vívida e gosto de explorar novas ideias.", category: "openness" },
  { id: 2, text: "Gosto de experimentar coisas novas, mesmo que fujam da minha rotina.", category: "openness" },
  // Big Five - Conscienciosidade (Conscientiousness)
  { id: 3, text: "Sou organizado(a) e gosto de planejar com antecedência.", category: "conscientiousness" },
  { id: 4, text: "Sigo minhas obrigações financeiras com disciplina e responsabilidade.", category: "conscientiousness" },
  // Big Five - Extroversão (Extraversion)
  { id: 5, text: "Me sinto energizado(a) quando estou cercado(a) de pessoas.", category: "extraversion" },
  // Big Five - Amabilidade (Agreeableness)
  { id: 6, text: "Costumo colocar as necessidades dos outros antes das minhas.", category: "agreeableness" },
  { id: 7, text: "Evito conflitos e busco sempre a harmonia nos relacionamentos.", category: "agreeableness" },
  // Big Five - Neuroticismo (Emotional Stability)
  { id: 8, text: "Frequentemente me preocupo com questões financeiras, mesmo quando está tudo bem.", category: "neuroticism" },
  { id: 9, text: "Fico ansioso(a) facilmente em situações de incerteza.", category: "neuroticism" },
  // Eneagrama
  { id: 10, text: "É importante para mim alcançar o sucesso e ser reconhecido(a) por minhas conquistas.", category: "eneagram" },
  { id: 11, text: "Busco segurança e tendo a antecipar possíveis problemas ou perigos.", category: "eneagram" },
  { id: 12, text: "Valorizo a paz interior e prefiro evitar confrontos e complicações.", category: "eneagram" },
];

const LIKERT_OPTIONS = [
  { value: 1, label: "Discordo totalmente" },
  { value: 2, label: "Discordo" },
  { value: 3, label: "Neutro" },
  { value: 4, label: "Concordo" },
  { value: 5, label: "Concordo totalmente" },
];

// ===== ESTADO GLOBAL =====
let currentQuestion = 0;
let answers = {};
let userData = { name: "", email: "", phone: "", profession: "", monthlyIncome: "", financialChallenge: "" };
let currentScreen = "form"; // form | intro | quiz | results

// ===== CÁLCULO DOS SCORES =====
function calculateScores() {
  const scores = { openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: 0, neuroticism: 0, eneagram: 0 };
  const counts = { openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: 0, neuroticism: 0, eneagram: 0 };

  questions.forEach((q) => {
    if (answers[q.id]) {
      scores[q.category] += answers[q.id];
      counts[q.category]++;
    }
  });

  return {
    openness:           counts.openness           > 0 ? (scores.openness           / counts.openness           / 5) * 100 : 0,
    conscientiousness:  counts.conscientiousness  > 0 ? (scores.conscientiousness  / counts.conscientiousness  / 5) * 100 : 0,
    extraversion:       counts.extraversion       > 0 ? (scores.extraversion       / counts.extraversion       / 5) * 100 : 0,
    agreeableness:      counts.agreeableness      > 0 ? (scores.agreeableness      / counts.agreeableness      / 5) * 100 : 0,
    neuroticism:        counts.neuroticism        > 0 ? (scores.neuroticism        / counts.neuroticism        / 5) * 100 : 0,
    eneagram:           counts.eneagram           > 0 ? (scores.eneagram           / counts.eneagram           / 5) * 100 : 0,
  };
}

// ===== NAVEGAÇÃO ENTRE TELAS =====
function showScreen(name) {
  document.querySelectorAll(".quiz-screen").forEach((s) => s.classList.remove("active"));
  const target = document.getElementById("screen-" + name);
  if (target) {
    target.classList.add("active");
  }
  currentScreen = name;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ===== TELA: FORMULÁRIO =====

function setFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  field.classList.add("field-error");

  // Remove mensagem de erro anterior, se houver
  const existing = field.parentElement.querySelector(".error-message");
  if (existing) existing.remove();

  const err = document.createElement("span");
  err.className = "error-message";
  err.textContent = message;
  field.parentElement.appendChild(err);
}

function clearFieldError(fieldId) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  field.classList.remove("field-error");
  const existing = field.parentElement.querySelector(".error-message");
  if (existing) existing.remove();
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function initFormScreen() {
  const form = document.getElementById("quiz-form");
  if (!form) return;

  // Limpa o erro ao usuário começar a digitar
  ["qf-name", "qf-email", "qf-phone", "qf-profession", "qf-income", "qf-challenge"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("input", () => clearFieldError(id));
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name             = document.getElementById("qf-name").value.trim();
    const email            = document.getElementById("qf-email").value.trim();
    const phone            = document.getElementById("qf-phone").value.trim();
    const profession       = document.getElementById("qf-profession").value.trim();
    const monthlyIncome    = document.getElementById("qf-income").value.trim();
    const financialChallenge = document.getElementById("qf-challenge").value.trim();

    // Limpa todos os erros anteriores
    ["qf-name", "qf-email", "qf-phone", "qf-profession", "qf-income", "qf-challenge"].forEach(clearFieldError);

    let firstErrorId = null;
    let hasError = false;

    if (!name) {
      setFieldError("qf-name", "Por favor, informe seu nome completo.");
      if (!firstErrorId) firstErrorId = "qf-name";
      hasError = true;
    }

    if (!email) {
      setFieldError("qf-email", "Por favor, informe seu e-mail.");
      if (!firstErrorId) firstErrorId = "qf-email";
      hasError = true;
    } else if (!validateEmail(email)) {
      setFieldError("qf-email", "Por favor, informe um e-mail válido.");
      if (!firstErrorId) firstErrorId = "qf-email";
      hasError = true;
    }

    if (!phone) {
      setFieldError("qf-phone", "Por favor, informe seu WhatsApp.");
      if (!firstErrorId) firstErrorId = "qf-phone";
      hasError = true;
    }

    if (!profession) {
      setFieldError("qf-profession", "Por favor, informe sua profissão.");
      if (!firstErrorId) firstErrorId = "qf-profession";
      hasError = true;
    }

    if (!monthlyIncome) {
      setFieldError("qf-income", "Por favor, informe sua renda mensal.");
      if (!firstErrorId) firstErrorId = "qf-income";
      hasError = true;
    }

    if (!financialChallenge) {
      setFieldError("qf-challenge", "Por favor, descreva seu maior desafio financeiro.");
      if (!firstErrorId) firstErrorId = "qf-challenge";
      hasError = true;
    }

    if (hasError) {
      // Foca no primeiro campo com erro
      const firstErrorEl = document.getElementById(firstErrorId);
      if (firstErrorEl) {
        firstErrorEl.scrollIntoView({ behavior: "smooth", block: "center" });
        firstErrorEl.focus();
      }
      return;
    }

    // Todos os campos válidos — salva e avança
    userData.name               = name;
    userData.email              = email;
    userData.phone              = phone;
    userData.profession         = profession;
    userData.monthlyIncome      = monthlyIncome;
    userData.financialChallenge = financialChallenge;

    // Popula saudação na tela de introdução
    const firstName = name.split(" ")[0];
    const introName = document.getElementById("intro-name");
    if (introName) introName.textContent = firstName;

    showScreen("intro");
  });
}

// ===== TELA: INTRODUÇÃO =====
function initIntroScreen() {
  const btn = document.getElementById("btn-start-test");
  if (btn) {
    btn.addEventListener("click", () => {
      currentQuestion = 0;
      answers = {};
      showScreen("quiz");
      renderQuestion();
    });
  }
}

// ===== TELA: QUIZ =====
function renderQuestion() {
  const q = questions[currentQuestion];
  const total = questions.length;
  // Progresso baseado na questão atual (não em respostas)
  const progressPct = (currentQuestion / total) * 100;

  // Progress bar
  const progressFill = document.getElementById("quiz-progress-fill");
  const progressLabel = document.getElementById("quiz-progress-label");
  const progressPctEl = document.getElementById("quiz-progress-pct");
  if (progressFill) progressFill.style.width = progressPct + "%";
  if (progressLabel) progressLabel.textContent = `Questão ${currentQuestion + 1} de ${total}`;
  if (progressPctEl) progressPctEl.textContent = Math.round(progressPct) + "%";

  // Texto da pergunta
  const questionText = document.getElementById("question-text");
  if (questionText) questionText.textContent = q.text;

  // Renderiza opções Likert
  const optionsContainer = document.getElementById("likert-options");
  if (!optionsContainer) return;
  optionsContainer.innerHTML = "";

  LIKERT_OPTIONS.forEach((opt) => {
    const isSelected = answers[q.id] === opt.value;
    const div = document.createElement("div");
    div.className = "likert-option" + (isSelected ? " selected" : "");
    div.dataset.value = opt.value;
    div.innerHTML = `
      <span class="likert-indicator"></span>
      <span class="likert-label">${opt.label}</span>
    `;
    div.addEventListener("click", () => selectAnswer(opt.value));
    optionsContainer.appendChild(div);
  });

  // Botões de navegação
  const btnPrev = document.getElementById("btn-prev");
  const btnNext = document.getElementById("btn-next");
  const btnFinish = document.getElementById("btn-finish");

  if (btnPrev) btnPrev.disabled = (currentQuestion === 0);

  const isLast = currentQuestion === total - 1;
  if (btnNext) btnNext.style.display = isLast ? "none" : "inline-flex";
  if (btnFinish) btnFinish.style.display = isLast ? "inline-flex" : "none";

  if (btnNext) btnNext.disabled = !answers[q.id];
  if (btnFinish) btnFinish.disabled = !answers[q.id];
}

function selectAnswer(value) {
  const q = questions[currentQuestion];
  answers[q.id] = value;

  // Atualiza visual das opções
  document.querySelectorAll(".likert-option").forEach((opt) => {
    if (parseInt(opt.dataset.value) === value) {
      opt.classList.add("selected");
    } else {
      opt.classList.remove("selected");
    }
  });

  // Habilita botões de avanço
  const btnNext = document.getElementById("btn-next");
  const btnFinish = document.getElementById("btn-finish");
  if (btnNext) btnNext.disabled = false;
  if (btnFinish) btnFinish.disabled = false;

  // Avança automaticamente após breve delay
  const isLast = currentQuestion === questions.length - 1;
  if (!isLast) {
    setTimeout(() => {
      currentQuestion++;
      renderQuestion();
    }, 380);
  }
}

function initQuizScreen() {
  const btnPrev = document.getElementById("btn-prev");
  const btnNext = document.getElementById("btn-next");
  const btnFinish = document.getElementById("btn-finish");

  if (btnPrev) {
    btnPrev.addEventListener("click", () => {
      if (currentQuestion > 0) {
        currentQuestion--;
        renderQuestion();
      }
    });
  }

  if (btnNext) {
    btnNext.addEventListener("click", () => {
      if (answers[questions[currentQuestion].id] && currentQuestion < questions.length - 1) {
        currentQuestion++;
        renderQuestion();
      }
    });
  }

  if (btnFinish) {
    btnFinish.addEventListener("click", () => {
      if (answers[questions[currentQuestion].id]) {
        finishTest();
      }
    });
  }
}

// ===== FINALIZAR TESTE + WEBHOOK =====
async function finishTest() {
  const btnFinish = document.getElementById("btn-finish");
  if (btnFinish) {
    btnFinish.disabled = true;
    btnFinish.textContent = "Enviando...";
  }

  const scores = calculateScores();

  const testData = {
    userData: {
      name:               userData.name,
      email:              userData.email,
      phone:              userData.phone,
      profession:         userData.profession,
      monthlyIncome:      userData.monthlyIncome,
      financialChallenge: userData.financialChallenge,
    },
    answers: answers,
    scores: {
      abertura:              Math.round(scores.openness),
      conscienciosidade:     Math.round(scores.conscientiousness),
      extroversao:           Math.round(scores.extraversion),
      amabilidade:           Math.round(scores.agreeableness),
      estabilidadeEmocional: Math.round(100 - scores.neuroticism),
      eneagrama:             Math.round(scores.eneagram),
    },
    submittedAt: new Date().toISOString(),
  };

  // Captura UTMs da URL
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.forEach((value, key) => {
    if (key.startsWith("utm_")) testData[key] = value;
  });

  try {
    const response = await fetch("https://automacao.bagents.cloud/webhook/057cca5f-4d9d-4949-9a86-19f7c97cb599", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testData),
    });
    if (!response.ok) console.error("Webhook error:", response.statusText);
  } catch (err) {
    console.error("Erro ao enviar dados:", err);
  }

  renderResults(scores);
  showScreen("results");
}

// ===== TELA: RESULTADOS =====
function renderResults(scores) {
  const firstName = userData.name.split(" ")[0];
  const resultName = document.getElementById("result-name");
  if (resultName) resultName.textContent = firstName;

  const resultEmail = document.getElementById("result-email");
  if (resultEmail) resultEmail.textContent = userData.email;

  const dimensions = [
    { id: "bar-openness",        label: "Abertura a Experiências",  value: Math.round(scores.openness),            desc: "Sua disposição para novas ideias e experiências financeiras" },
    { id: "bar-conscientiousness", label: "Conscienciosidade",       value: Math.round(scores.conscientiousness),   desc: "Seu nível de organização e disciplina financeira" },
    { id: "bar-extraversion",    label: "Extroversão",               value: Math.round(scores.extraversion),        desc: "Como você se relaciona com o dinheiro em contextos sociais" },
    { id: "bar-agreeableness",   label: "Amabilidade",               value: Math.round(scores.agreeableness),       desc: "Sua tendência a priorizar outros nas decisões financeiras" },
    { id: "bar-stability",       label: "Estabilidade Emocional",    value: Math.round(100 - scores.neuroticism),   desc: "Seu equilíbrio emocional em situações financeiras" },
  ];

  dimensions.forEach((dim) => {
    const fill = document.getElementById(dim.id + "-fill");
    const pct  = document.getElementById(dim.id + "-pct");
    const desc = document.getElementById(dim.id + "-desc");
    if (fill) fill.setAttribute("data-width", dim.value);
    if (pct)  pct.textContent = dim.value + "%";
    if (desc) desc.textContent = dim.desc;
  });

  // Insights
  const insightStyle = document.getElementById("insight-style");
  if (insightStyle) {
    insightStyle.textContent = scores.conscientiousness > 60
      ? "Você tende a ser organizado e planejador com suas finanças, o que é uma grande vantagem."
      : "Você pode se beneficiar de mais estrutura e planejamento nas suas decisões financeiras.";
  }

  const insightDecision = document.getElementById("insight-decision");
  if (insightDecision) {
    insightDecision.textContent = scores.neuroticism > 60
      ? "Você pode experimentar ansiedade em decisões financeiras. Trabalhar sua segurança emocional pode ajudar muito."
      : "Você demonstra estabilidade emocional nas suas decisões financeiras, o que favorece escolhas conscientes.";
  }

  const insightGrowth = document.getElementById("insight-growth");
  if (insightGrowth) {
    insightGrowth.textContent = scores.openness > 60
      ? "Sua abertura para novas experiências indica disposição para aprender estratégias financeiras inovadoras."
      : "Você pode se beneficiar explorando gradualmente novas abordagens para suas finanças.";
  }

  const insightRelation = document.getElementById("insight-relation");
  if (insightRelation) {
    insightRelation.textContent = scores.agreeableness > 60
      ? "Sua generosidade é admirável, mas é importante também cuidar das suas próprias necessidades financeiras."
      : "Você equilibra bem as necessidades dos outros com suas próprias prioridades financeiras.";
  }

  // Anima barras ao entrar na tela
  setTimeout(() => {
    const fills = document.querySelectorAll(".result-bar-fill[data-width]");
    const barObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.width = entry.target.getAttribute("data-width") + "%";
          barObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    fills.forEach((fill) => barObserver.observe(fill));
    // Força animação imediata caso já esteja visível
    fills.forEach((fill) => {
      fill.style.width = fill.getAttribute("data-width") + "%";
    });
  }, 300);
}

// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
  initFormScreen();
  initIntroScreen();
  initQuizScreen();

  // Partículas (reutiliza função da landing)
  const container = document.getElementById("quiz-particles");
  if (container) {
    for (let i = 0; i < 10; i++) {
      const p = document.createElement("div");
      p.className = "particle";
      const size = Math.random() * 2.5 + 0.8;
      p.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}%;
        animation-duration: ${Math.random() * 14 + 12}s;
        animation-delay: ${Math.random() * 10}s;
      `;
      container.appendChild(p);
    }
  }
});
