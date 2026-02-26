$(document).ready(function() {
    // Theme toggle
    function applyThemeAssets(theme) {
        document.querySelectorAll('[data-light-src][data-dark-src]').forEach(function(img) {
            img.src = theme === 'dark' ? img.dataset.darkSrc : img.dataset.lightSrc;
        });
    }

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        themeToggle.textContent = current === 'dark' ? '☀️' : '🌙';
        applyThemeAssets(current);

        themeToggle.addEventListener('click', function() {
            const theme = document.documentElement.getAttribute('data-theme');
            const next = theme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
            themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
            applyThemeAssets(next);
        });
    }

    // Sticky Nav functionality
    const navbar = $('#sticky-navbar');
    const buttonGroup = $('#button-group-original');

    if (buttonGroup.length) {
      const stickyPoint = buttonGroup.offset().top + buttonGroup.outerHeight();
      $(window).scroll(function() {
        if ($(window).scrollTop() > stickyPoint) {
          navbar.addClass('visible');
        } else {
          navbar.removeClass('visible');
        }
      });
    }

    // Hamburger menu functionality
    $('#hamburger-menu').on('click', function() {
      $('#nav-links').toggleClass('active');
    });
});

document.addEventListener("DOMContentLoaded", function() {

    // Data from the translation paper
    const projectData = {
        // Table 1: COMET scores for WMT24++ (GPT-4o-mini)
        "wmt_comet": {
            "Baseline": 0.827,
            "SC (with check)": 0.821,
            "Best-of-N (n=5)": 0.843,
            "USI (n=5)": 0.843,
            "T-RANK (p=5)": 0.845
        },
        // Table 1: COMET scores for FLORES (GPT-4o-mini)
        "flores_comet": {
            "Baseline": 0.937,
            "SC (with check)": 0.937,
            "Best-of-N (n=5)": 0.943,
            "USI (n=5)": 0.945,
            "T-RANK (p=5)": 0.940
        },
        // Tables 2, 16, 17: LLM-as-a-Judge comparison per language (Ours vs Global-MMLU)
        "llm_judge_by_language": {
            "Ukrainian": { wins: 8750, draws: 3276, losses: 2016 },   // Table 2
            "Romanian": { wins: 8376, draws: 3020, losses: 2646 },    // Table 16
            "Lithuanian": { wins: 7382, draws: 3181, losses: 3478 }   // Table 17
        },
        // Table 3: Average improvement per benchmark
        "avg_improvement_benchmark": {
            "ARC-Challenge": 2.35,
            "Hellaswag": 1.63,
            "MMLU": 0.94,
            "Winogrande": 3.42
        },
        // Table 4: Average improvement per language
        "avg_improvement_language": {
            "Greek": 3.89,
            "Ukrainian": 2.7,
            "Turkish": 2.65,
            "Lithuanian": 2.6,
            "Romanian": 2.09,
            "Slovak": 1.66,
            "Estonian": 1.63,
            "Bulgarian": 1.37
        },
        // Benchmark distribution (Table 5)
        "benchmark_samples": {
            "MMLU": 15858,
            "Hellaswag": 10042,
            "ARC-Challenge": 2291,
            "Winogrande": 1267
        },
        // Table 7: Ukrainian results (Ours vs Other)
        "ukrainian_results": {
            "Gemma-3-12B": { ours: [0.687, 0.580, 0.517, 0.614], other: [0.625, 0.619, 0.470, 0.603] },
            "Llama-3.1-8B": { ours: [0.570, 0.549, 0.431, 0.497], other: [0.540, 0.495, 0.416, 0.489] },
            "Gemma-3-4B": { ours: [0.578, 0.540, 0.453, 0.453], other: [0.528, 0.501, 0.417, 0.444] },
            "Qwen3-8B": { ours: [0.540, 0.569, 0.448, 0.619], other: [0.520, 0.546, 0.404, 0.599] }
        },
        // Table 8: Romanian results (Ours vs Other)
        "romanian_results": {
            "Gemma-3-12B": { ours: [0.678, 0.661, 0.486, 0.628], other: [0.681, 0.589, 0.454, 0.614] },
            "Gemma-3-4B": { ours: [0.567, 0.575, 0.412, 0.479], other: [0.567, 0.531, 0.394, 0.473] },
            "Llama-3.1-8B": { ours: [0.576, 0.616, 0.358, 0.529], other: [0.581, 0.521, 0.357, 0.519] },
            "Qwen3-8B": { ours: [0.538, 0.588, 0.368, 0.650], other: [0.537, 0.566, 0.359, 0.632] }
        },
        // WMT COMET scores across languages - with ref-based and QE (reference-free) scores
        // GPT-4o-mini results
        "wmt_by_language_gpt": {
            "UK": { "Baseline": {ref: 0.827, qe: 0.726}, "SC": {ref: 0.821, qe: 0.708}, "Best-of-N": {ref: 0.844, qe: 0.743}, "USI": {ref: 0.849, qe: 0.755}, "T-RANK": {ref: 0.845, qe: 0.742} },
            "SK": { "Baseline": {ref: 0.822, qe: 0.741}, "SC": {ref: 0.817, qe: 0.725}, "Best-of-N": {ref: 0.837, qe: 0.756}, "USI": {ref: 0.847, qe: 0.764}, "T-RANK": {ref: 0.841, qe: 0.756} },
            "RO": { "Baseline": {ref: 0.873, qe: 0.882}, "SC": {ref: 0.869, qe: 0.869}, "Best-of-N": {ref: 0.884, qe: 0.895}, "USI": {ref: 0.891, qe: 0.898}, "T-RANK": {ref: 0.887, qe: 0.883} },
            "LT": { "Baseline": {ref: 0.788, qe: 0.741}, "SC": {ref: 0.790, qe: 0.735}, "Best-of-N": {ref: 0.805, qe: 0.767}, "USI": {ref: 0.817, qe: 0.771}, "T-RANK": {ref: 0.812, qe: 0.753} },
            "ET": { "Baseline": {ref: 0.821, qe: 0.788}, "SC": {ref: 0.822, qe: 0.788}, "Best-of-N": {ref: 0.838, qe: 0.809}, "USI": {ref: 0.848, qe: 0.809}, "T-RANK": {ref: 0.843, qe: 0.797} },
            "BG": { "Baseline": {ref: 0.834, qe: 0.751}, "SC": {ref: 0.834, qe: 0.749}, "Best-of-N": {ref: 0.852, qe: 0.788}, "USI": {ref: 0.862, qe: 0.793}, "T-RANK": {ref: 0.862, qe: 0.778} },
            "TR": { "Baseline": {ref: 0.776, qe: 0.718}, "SC": {ref: 0.734, qe: 0.715}, "Best-of-N": {ref: 0.791, qe: 0.736}, "USI": {ref: 0.803, qe: 0.736}, "T-RANK": {ref: 0.798, qe: 0.726} },
            "EL": { "Baseline": {ref: 0.820, qe: 0.731}, "SC": {ref: 0.816, qe: 0.727}, "Best-of-N": {ref: 0.836, qe: 0.746}, "USI": {ref: 0.844, qe: 0.755}, "T-RANK": {ref: 0.841, qe: 0.752} }
        },
        // Gemini-2.0 results for WMT
        "wmt_by_language_gemini": {
            "UK": { "Baseline": {ref: 0.828, qe: 0.688}, "SC": {ref: 0.826, qe: 0.687}, "Best-of-N": {ref: 0.828, qe: 0.687}, "USI": {ref: 0.841, qe: 0.698}, "T-RANK": {ref: 0.841, qe: 0.697} },
            "SK": { "Baseline": {ref: 0.829, qe: 0.703}, "SC": {ref: 0.834, qe: 0.706}, "Best-of-N": {ref: 0.836, qe: 0.707}, "USI": {ref: 0.843, qe: 0.716}, "T-RANK": {ref: 0.849, qe: 0.713} },
            "RO": { "Baseline": {ref: 0.867, qe: 0.777}, "SC": {ref: 0.868, qe: 0.777}, "Best-of-N": {ref: 0.870, qe: 0.780}, "USI": {ref: 0.881, qe: 0.785}, "T-RANK": {ref: 0.882, qe: 0.781} },
            "LT": { "Baseline": {ref: 0.805, qe: 0.704}, "SC": {ref: 0.808, qe: 0.706}, "Best-of-N": {ref: 0.814, qe: 0.710}, "USI": {ref: 0.826, qe: 0.718}, "T-RANK": {ref: 0.827, qe: 0.716} },
            "ET": { "Baseline": {ref: 0.847, qe: 0.737}, "SC": {ref: 0.845, qe: 0.736}, "Best-of-N": {ref: 0.852, qe: 0.743}, "USI": {ref: 0.862, qe: 0.753}, "T-RANK": {ref: 0.861, qe: 0.749} },
            "BG": { "Baseline": {ref: 0.840, qe: 0.708}, "SC": {ref: 0.841, qe: 0.709}, "Best-of-N": {ref: 0.843, qe: 0.713}, "USI": {ref: 0.856, qe: 0.721}, "T-RANK": {ref: 0.859, qe: 0.718} },
            "TR": { "Baseline": {ref: 0.778, qe: 0.683}, "SC": {ref: 0.779, qe: 0.685}, "Best-of-N": {ref: 0.785, qe: 0.689}, "USI": {ref: 0.797, qe: 0.697}, "T-RANK": {ref: 0.800, qe: 0.695} },
            "EL": { "Baseline": {ref: 0.821, qe: 0.719}, "SC": {ref: 0.824, qe: 0.722}, "Best-of-N": {ref: 0.823, qe: 0.723}, "USI": {ref: 0.836, qe: 0.731}, "T-RANK": {ref: 0.838, qe: 0.726} }
        },
        // FLORES COMET scores across languages - with ref-based and QE (reference-free) scores
        "flores_by_language": {
            "UK": { "Baseline": {ref: 0.937, qe: 0.904}, "SC": {ref: 0.937, qe: 0.902}, "Best-of-N": {ref: 0.943, qe: 0.910}, "USI": {ref: 0.947, qe: 0.919}, "T-RANK": {ref: 0.940, qe: 0.905} },
            "SK": { "Baseline": {ref: 0.938, qe: 0.906}, "SC": {ref: 0.937, qe: 0.908}, "Best-of-N": {ref: 0.945, qe: 0.917}, "USI": {ref: 0.946, qe: 0.921}, "T-RANK": {ref: 0.943, qe: 0.912} },
            "RO": { "Baseline": {ref: 0.939, qe: 0.947}, "SC": {ref: 0.936, qe: 0.950}, "Best-of-N": {ref: 0.945, qe: 0.956}, "USI": {ref: 0.949, qe: 0.961}, "T-RANK": {ref: 0.944, qe: 0.954} },
            "LT": { "Baseline": {ref: 0.906, qe: 0.906}, "SC": {ref: 0.911, qe: 0.911}, "Best-of-N": {ref: 0.917, qe: 0.921}, "USI": {ref: 0.928, qe: 0.932}, "T-RANK": {ref: 0.915, qe: 0.912} },
            "ET": { "Baseline": {ref: 0.894, qe: 0.927}, "SC": {ref: 0.902, qe: 0.935}, "Best-of-N": {ref: 0.918, qe: 0.947}, "USI": {ref: 0.918, qe: 0.948}, "T-RANK": {ref: 0.907, qe: 0.935} },
            "BG": { "Baseline": {ref: 0.943, qe: 0.903}, "SC": {ref: 0.940, qe: 0.902}, "Best-of-N": {ref: 0.951, qe: 0.916}, "USI": {ref: 0.952, qe: 0.922}, "T-RANK": {ref: 0.950, qe: 0.912} },
            "TR": { "Baseline": {ref: 0.920, qe: 0.904}, "SC": {ref: 0.916, qe: 0.903}, "Best-of-N": {ref: 0.927, qe: 0.912}, "USI": {ref: 0.931, qe: 0.918}, "T-RANK": {ref: 0.925, qe: 0.908} },
            "EL": { "Baseline": {ref: 0.920, qe: 0.896}, "SC": {ref: 0.923, qe: 0.896}, "Best-of-N": {ref: 0.931, qe: 0.911}, "USI": {ref: 0.934, qe: 0.912}, "T-RANK": {ref: 0.932, qe: 0.904} }
        }
    };

    // --- Color Palette ---
    const colors = {
        red: 'rgba(214, 64, 69, 0.7)',       // Main red #D64045
        lightRed: 'rgba(214, 64, 69, 0.5)',  // Lighter red
        orange: 'rgba(255, 159, 64, 0.7)',
        green: 'rgba(34, 139, 34, 0.7)',     // Forest green
        purple: 'rgba(153, 102, 255, 0.7)',
        yellow: 'rgba(255, 206, 86, 0.7)',
        coral: 'rgba(255, 127, 80, 0.7)',    // Coral for variety
    };

    // --- Section 3: WMT COMET Scores Bar Chart ---
    function createPerTypeChart() {
        const ctx = document.getElementById('perTypeChart');
        if (!ctx) return;

        const data = projectData.wmt_comet;
        const labels = Object.keys(data);
        const values = Object.values(data);

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'COMET Score',
                    data: values,
                    backgroundColor: [colors.red, colors.orange, colors.green, colors.purple, colors.coral],
                }]
            },
            options: {
                plugins: { title: { display: true, text: 'WMT24++ COMET Scores (EN→UK)' } },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 0.8,
                        max: 0.86,
                        ticks: { callback: value => value.toFixed(2) }
                    }
                }
            }
        });
    }

    // --- Section 4: FLORES COMET Scores Bar Chart ---
    function createDifficultyChart() {
        const ctx = document.getElementById('difficultyChart');
        if (!ctx) return;

        const data = projectData.flores_comet;
        const labels = Object.keys(data);
        const values = Object.values(data);

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'COMET Score',
                    data: values,
                    backgroundColor: [colors.red, colors.orange, colors.green, colors.purple, colors.coral],
                }]
            },
            options: {
                plugins: { title: { display: true, text: 'FLORES COMET Scores (EN→UK)' } },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 0.92,
                        max: 0.95,
                        ticks: { callback: value => value.toFixed(2) }
                    }
                }
            }
        });
    }

    // --- Section 5: LLM-as-Judge Comparison (Horizontal Stacked Bar) ---
    function createSelfSycophancyChart() {
        const ctx = document.getElementById('selfSycophancyChart');
        if (!ctx) return;

        const data = projectData.llm_judge_by_language;
        const languages = Object.keys(data);
        const wins = languages.map(lang => data[lang].wins);
        const draws = languages.map(lang => data[lang].draws);
        const losses = languages.map(lang => data[lang].losses);

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: languages,
                datasets: [
                    {
                        label: 'Wins (Ours Better)',
                        data: wins,
                        backgroundColor: colors.green
                    },
                    {
                        label: 'Draws',
                        data: draws,
                        backgroundColor: colors.yellow
                    },
                    {
                        label: 'Losses (Existing Better)',
                        data: losses,
                        backgroundColor: colors.red
                    }
                ]
            },
            options: {
                indexAxis: 'y',
                plugins: {
                    title: { display: true, text: 'LLM-as-Judge: T-RANK vs Existing Translations' },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = wins[context.dataIndex] + draws[context.dataIndex] + losses[context.dataIndex];
                                const percentage = ((context.raw / total) * 100).toFixed(1);
                                return `${context.dataset.label}: ${context.raw.toLocaleString()} (${percentage}%)`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        stacked: true,
                        beginAtZero: true,
                        max: Math.max(...languages.map((_, i) => wins[i] + draws[i] + losses[i])),
                        grace: 0,
                        ticks: {
                            callback: value => value.toLocaleString(),
                            maxTicksLimit: 5
                        }
                    },
                    y: {
                        stacked: true
                    }
                }
            }
        });
    }

    // --- Section 6: Average Improvement per Benchmark Chart ---
    function createAgenticChart() {
        const ctx = document.getElementById('agenticChart');
        if (!ctx) return;

        const data = projectData.avg_improvement_benchmark;
        // Sort by value in descending order
        const sorted = Object.entries(data).sort((a, b) => b[1] - a[1]);
        const labels = sorted.map(item => item[0]);
        const values = sorted.map(item => item[1]);

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Average Improvement (%)',
                    data: values,
                    backgroundColor: 'rgba(214, 64, 69, 0.6)',
                }]
            },
            options: {
                plugins: {
                    title: { display: true, text: 'Average Improvement per Benchmark' },
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 4,
                        ticks: { callback: value => '+' + value + '%' }
                    }
                }
            }
        });
    }

    // --- Section 6b: Average Improvement per Language Chart ---
    function createLanguageImprovementChart() {
        const ctx = document.getElementById('languageChart');
        if (!ctx) return;

        const data = projectData.avg_improvement_language;
        const labels = Object.keys(data);
        const values = Object.values(data);

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Average Improvement (%)',
                    data: values,
                    backgroundColor: 'rgba(214, 64, 69, 0.6)',
                }]
            },
            options: {
                plugins: {
                    title: { display: true, text: 'Average Improvement per Language' },
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 4.5,
                        ticks: { callback: value => '+' + value + '%' }
                    }
                }
            }
        });
    }

    // --- Section 7: Ukrainian Performance Comparison ---
    function createPromptOptimisationChart() {
        const ctx = document.getElementById('promptOptimisationChart');
        if (!ctx) return;

        const data = projectData.ukrainian_results;
        const models = Object.keys(data);
        const benchmarks = ['Hellaswag', 'Winogrande', 'ARC', 'MMLU'];

        // Calculate average improvement for each model
        const improvements = models.map(model => {
            const ours = data[model].ours;
            const other = data[model].other;
            const avgImprovement = ours.reduce((sum, val, i) => sum + (val - other[i]), 0) / ours.length * 100;
            return avgImprovement;
        });

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: models,
                datasets: [{
                    label: 'Avg. Improvement (%)',
                    data: improvements,
                    backgroundColor: improvements.map(v => v >= 0 ? colors.green : colors.red),
                }]
            },
            options: {
                plugins: { title: { display: true, text: 'Ukrainian: Average Improvement (Ours vs Existing)' } },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { callback: value => value.toFixed(1) + '%' }
                    }
                }
            }
        });
    }

    // --- Section 8: Romanian Performance Comparison ---
    function createSelfConfidenceChart() {
        const ctx = document.getElementById('selfConfidenceChart');
        if (!ctx) return;

        const data = projectData.romanian_results;
        const models = Object.keys(data);

        // Calculate average improvement for each model
        const improvements = models.map(model => {
            const ours = data[model].ours;
            const other = data[model].other;
            const avgImprovement = ours.reduce((sum, val, i) => sum + (val - other[i]), 0) / ours.length * 100;
            return avgImprovement;
        });

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: models,
                datasets: [{
                    label: 'Avg. Improvement (%)',
                    data: improvements,
                    backgroundColor: improvements.map(v => v >= 0 ? colors.green : colors.red),
                }]
            },
            options: {
                plugins: { title: { display: true, text: 'Romanian: Average Improvement (Ours vs Existing)' } },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { callback: value => value.toFixed(1) + '%' }
                    }
                }
            }
        });
    }

    // --- Section 9: Method Comparison Tables with Tabs ---
    let currentWmtModel = 'gpt'; // Track current model selection

    function renderMethodComparisonTables() {
        const wmtContainer = document.getElementById('wmt-table-container');
        const floresContainer = document.getElementById('flores-table-container');
        const modelToggle = document.getElementById('model-toggle');
        if (!wmtContainer || !floresContainer) return;

        // Get current WMT data based on model selection
        const getWmtData = () => currentWmtModel === 'gpt'
            ? projectData.wmt_by_language_gpt
            : projectData.wmt_by_language_gemini;

        // Render initial tables
        renderTable(wmtContainer, getWmtData(), 'UK');
        renderTable(floresContainer, projectData.flores_by_language, 'UK');

        // Get FLORES panel element
        const floresPanel = floresContainer.closest('.table-panel');

        // Model toggle event listener
        if (modelToggle) {
            modelToggle.addEventListener('click', (e) => {
                if (e.target.matches('.model-btn')) {
                    document.querySelectorAll('.model-btn').forEach(btn => btn.classList.remove('active'));
                    e.target.classList.add('active');
                    currentWmtModel = e.target.dataset.model;

                    // Re-render WMT table with current language
                    const activeWmtTab = document.querySelector('#wmt-tabs .lang-tab.active');
                    const currentLang = activeWmtTab ? activeWmtTab.dataset.lang : 'UK';
                    renderTable(wmtContainer, getWmtData(), currentLang);

                    // Show/hide FLORES panel based on model (no FLORES data for Gemini)
                    if (floresPanel) {
                        floresPanel.style.display = currentWmtModel === 'gemini' ? 'none' : 'block';
                    }
                }
            });
        }

        // Add tab event listeners for WMT
        document.getElementById('wmt-tabs').addEventListener('click', (e) => {
            if (e.target.matches('.lang-tab')) {
                document.querySelectorAll('#wmt-tabs .lang-tab').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                renderTable(wmtContainer, getWmtData(), e.target.dataset.lang);
            }
        });

        // Add tab event listeners for FLORES
        document.getElementById('flores-tabs').addEventListener('click', (e) => {
            if (e.target.matches('.lang-tab')) {
                document.querySelectorAll('#flores-tabs .lang-tab').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                renderTable(floresContainer, projectData.flores_by_language, e.target.dataset.lang);
            }
        });
    }

    function renderTable(container, data, lang) {
        const langData = data[lang];
        const methods = Object.keys(langData);

        // Find max values for each column
        const refValues = methods.map(m => langData[m].ref);
        const qeValues = methods.map(m => langData[m].qe);
        const maxRef = Math.max(...refValues);
        const maxQe = Math.max(...qeValues);

        let tableHTML = `<table>
            <thead><tr><th>Method</th><th>Ref-Based</th><th>QE (Ref-Free)</th></tr></thead>
            <tbody>`;

        methods.forEach(method => {
            const scores = langData[method];
            const isBestRef = scores.ref === maxRef;
            const isBestQe = scores.qe === maxQe;
            tableHTML += `<tr>
                <td>${method}</td>
                <td class="${isBestRef ? 'best-score' : ''}">${scores.ref.toFixed(3)}</td>
                <td class="${isBestQe ? 'best-score' : ''}">${scores.qe.toFixed(3)}</td>
            </tr>`;
        });

        tableHTML += '</tbody></table>';
        container.innerHTML = tableHTML;
    }

    // --- Render Bad Translation Examples ---
    function renderBadExamples() {
        const container = document.getElementById('bad-examples-container');
        if (!container || typeof badTranslationExamples === 'undefined' || badTranslationExamples.length === 0) return;

        const tabButtons = document.createElement('div');
        tabButtons.className = 'tabs';
        const tabContents = document.createElement('div');

        badTranslationExamples.forEach((example, index) => {
            const button = document.createElement('button');
            button.className = 'tab-button';
            button.innerHTML = `<span class="tab-title">${example.title}</span>`;
            button.dataset.target = example.id;
            tabButtons.appendChild(button);

            const content = document.createElement('div');
            content.id = example.id;
            content.className = 'tab-content bad-example-content';
            content.innerHTML = example.content;
            tabContents.appendChild(content);

            if (index === 0) {
                button.classList.add('active');
                content.classList.add('active');
            }
        });

        container.appendChild(tabButtons);
        container.appendChild(tabContents);

        tabButtons.addEventListener('click', (e) => {
            const button = e.target.closest('.tab-button');
            if (button) {
                container.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
                container.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
                const targetId = button.dataset.target;
                button.classList.add('active');
                document.getElementById(targetId).classList.add('active');
            }
        });
    }

    function renderExampleTraces() {
        const container = document.getElementById('example-traces-container');
        if (!container || typeof exampleTraces === 'undefined' || exampleTraces.length === 0) return;

        const tabButtons = document.createElement('div');
        tabButtons.className = 'tabs';
        const tabContents = document.createElement('div');

        exampleTraces.forEach((trace, index) => {
            const button = document.createElement('button');
            button.className = 'tab-button';
            button.textContent = trace.title;
            button.dataset.target = trace.id;
            tabButtons.appendChild(button);

            const content = document.createElement('div');
            content.id = trace.id;
            content.className = 'tab-content';
            content.innerHTML = `
                <div class="trace-box original-problem"><h4>Original Text (English)</h4><p>${trace.originalText}</p></div>
                <div class="trace-box sycophantic-problem"><h4>Translation Candidates</h4><p>${trace.candidates}</p></div>
                <div class="trace-box model-solution"><h4>Reasoning</h4><p>${trace.reasoning}</p></div>
                <div class="trace-box judgement"><h4>Final Translation</h4><p>${trace.finalTranslation}</p></div>
            `;
            tabContents.appendChild(content);

            if (index === 0) {
                button.classList.add('active');
                content.classList.add('active');
            }
        });

        container.appendChild(tabButtons);
        container.appendChild(tabContents);

        tabButtons.addEventListener('click', (e) => {
            if (e.target.matches('.tab-button')) {
                container.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
                container.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
                const targetId = e.target.dataset.target;
                e.target.classList.add('active');
                document.getElementById(targetId).classList.add('active');
            }
        });
    }

    // --- Interactive Pipeline Animation ---
    const pipelineState = {};

    function initPipeline(pipelineId) {
        const pipeline = document.getElementById(pipelineId);
        if (!pipeline) return;

        const steps = pipeline.querySelectorAll('.pipeline-step');
        const arrows = pipeline.querySelectorAll('.pipeline-arrow');
        const descriptions = pipeline.querySelectorAll('.pipeline-description span');

        pipelineState[pipelineId] = {
            steps: steps,
            arrows: arrows,
            descriptions: descriptions,
            currentStep: 0,
            totalSteps: steps.length,
            isAnimating: false,
            hasPlayed: false
        };

        // Set up intersection observer for auto-play
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !pipelineState[pipelineId].hasPlayed) {
                    pipelineState[pipelineId].hasPlayed = true;
                    setTimeout(() => animatePipeline(pipelineId), 300);
                }
            });
        }, { threshold: 0.3 });

        observer.observe(pipeline);
    }

    function animatePipeline(pipelineId) {
        const state = pipelineState[pipelineId];
        if (!state || state.isAnimating) return;

        state.isAnimating = true;
        state.currentStep = 0;

        // Reset all elements
        state.steps.forEach(step => {
            step.classList.remove('visible', 'active');
        });
        state.arrows.forEach(arrow => {
            arrow.classList.remove('visible');
        });
        state.descriptions.forEach(desc => {
            desc.classList.remove('visible');
        });

        // Animate each step
        function showStep(stepIndex) {
            if (stepIndex >= state.totalSteps) {
                state.isAnimating = false;
                return;
            }

            const step = state.steps[stepIndex];
            step.classList.add('visible', 'active');

            // Remove active from previous step
            if (stepIndex > 0) {
                state.steps[stepIndex - 1].classList.remove('active');
            }

            // Show corresponding arrow (after current step)
            if (stepIndex < state.arrows.length) {
                setTimeout(() => {
                    state.arrows[stepIndex].classList.add('visible');
                }, 200);
            }

            // Show corresponding description
            state.descriptions.forEach(desc => desc.classList.remove('visible'));
            const desc = state.descriptions[stepIndex];
            if (desc) {
                desc.classList.add('visible');
            }

            // Schedule next step
            setTimeout(() => showStep(stepIndex + 1), 600);
        }

        showStep(0);
    }

    window.replayPipeline = function(pipelineId) {
        const fullId = pipelineId + '-pipeline';
        const state = pipelineState[fullId];
        if (state) {
            state.isAnimating = false;
            animatePipeline(fullId);
        }
    };

    function initAllPipelines() {
        initPipeline('trank-pipeline');
        initPipeline('usi-pipeline');
    }

    // --- Initialize all visualizations ---
    createPerTypeChart();
    createDifficultyChart();
    createSelfSycophancyChart();
    createAgenticChart();
    createLanguageImprovementChart();
    createPromptOptimisationChart();
    createSelfConfidenceChart();
    renderMethodComparisonTables();
    renderBadExamples();
    renderExampleTraces();
    initAllPipelines();
});
