// Bad translation examples from existing benchmarks
const badTranslationExamples = [
    {
    id: "bad-mmlu",
    title: "MMLU (Translation Errors)",
    description: "Semantic drift and incorrect terminology in existing translations",
    content: `
        <div class="bad-example-table">
            <table class="mmlu-issues-table">
                <thead>
                    <tr>
                        <th>Issue Type</th>
                        <th>Example</th>
                        <th>Impact</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><center><span class="issue-badge semantic">Semantic Drift</span></center></td>
                        <td>
                            <strong>Original:</strong> "relatively long lifespan"<br>
                            <strong>Translated as:</strong> "життєвий цикл" (life cycle)<br>
                            <strong>Should be:</strong> "тривалість життя" (lifespan)
                        </td>
                        <td>Changes the question meaning; "life cycle" refers to developmental stages, not longevity</td>
                    </tr>
                    <tr>
                        <td><center><span class="issue-badge terminology">Wrong Terminology</span></center></td>
                        <td>
                            <strong>Original:</strong> "aquatic organism"<br>
                            <strong>Translated as:</strong> "водяний організм"<br>
                            <strong>Should be:</strong> "водний організм"
                        </td>
                        <td>"водяний" means "watery" (like soup), while "водний" is the correct scientific term for aquatic</td>
                    </tr>
                    <tr>
                        <td><center><span class="issue-badge grammar">Grammar Errors</span></center></td>
                        <td>
                            <strong>Original:</strong> "parental care for offspring"<br>
                            <strong>Translated as:</strong> "турботи за потомством"<br>
                            <strong>Should be:</strong> "турботи про потомство"
                        </td>
                        <td>Incorrect preposition usage creates unnatural phrasing that may confuse native speakers</td>
                    </tr>
                    <tr>
                        <td><center><span class="issue-badge literal">Literal Translation</span></center></td>
                        <td>
                            <strong>Original:</strong> "Only I"<br>
                            <strong>Translated as:</strong> "Тільки я"<br>
                            <strong>Should be:</strong> "Тільки I"
                        </td>
                        <td>Latin number I is sometimes treated by translation model as a letter, causing incorrect translation - it should be "I" in Latin script instead of "Я" in Cyrillic script.</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="bad-example-section solution">
            <h4><i class="fas fa-chart-line"></i> Quality Impact</h4>
            <div class="example-text">
                These issues persist across the benchmark: our LLM-as-a-Judge evaluation shows that <strong>62% of our translations are preferred</strong> over existing Global-MMLU translations, with only <strong>14% rated worse</strong>. The remaining 24% are rated equal quality.
            </div>
        </div>
    `
    },
    {
        id: "bad-winogrande",
        title: "Winogrande (Answer Leakage)",
        description: "Grammatical gender agreement in Ukrainian reveals the correct answer",
        content: `
            <div class="bad-example-section">
                <h4>Original English</h4>
                <div class="example-text">
                    They were worried that the wine would spoil the bed and the blanket, but the _ was not spoiled.<br><br>
                    <strong>Option A:</strong> blanket<br>
                    <strong>Option B:</strong> bed<br>
                    <strong>Answer:</strong> bed
                </div>
            </div>
            <div class="bad-example-section problem">
                <h4><i class="fas fa-exclamation-triangle"></i> Problem: Answer Leakage</h4>
                <div class="example-text">
                    <strong>Existing Translation (MUBench-Winogrande):</strong><br>
                    Вони хвилювалися, що вино зіпсує ліжко та ковдру, але _ не <span class="highlight-bad">було</span> зіпсовано.<br><br>
                    <strong>Issue:</strong> The verb ending "було" ("was", neuter gender) directly reveals the answer is "ліжко" (bed, neuter) rather than "ковдра" (blanket, feminine). A native speaker can identify the correct answer without any reasoning.
                </div>
            </div>
            <div class="bad-example-section solution">
                <h4><i class="fas fa-check-circle"></i> Our Solution: Morphology Masking</h4>
                <div class="example-text">
                    <strong>Our Translation:</strong><br>
                    Вони хвилювалися, що вино зіпсує ліжко та ковдру, але _ не <span class="highlight-good">бу(-в/-ла/-ло/-ли)</span> зіпсовано.<br><br>
                    <strong>Fix:</strong> We mask the verb morphology with all possible endings to preserve the ambiguity of the original English task, ensuring the benchmark tests reasoning ability rather than language proficiency.
                </div>
            </div>
            <div class="bad-example-section solution">
                <h4><i class="fas fa-chart-line"></i> Quality Impact: Highest Improvement</h4>
                <div class="example-text">
                    Winogrande shows the <strong>largest accuracy improvement</strong> among all benchmarks we translated, with an average gain of <strong>+3.42%</strong> across all evaluated models. This is significantly higher than ARC-Challenge (+2.35%), Hellaswag (+1.63%), and MMLU (+0.94%).<br><br>
                    The substantial improvement is directly attributed to eliminating answer leakage or misguidance through grammatical gender markers and ensuring consistent morphological masking across all sentence completion tasks. By preserving the original task's ambiguity, our translations enable fair evaluation of commonsense reasoning rather than linguistic pattern matching.
                </div>
            </div>
        `
    },
    {
        id: "bad-hellaswag",
        title: "Hellaswag (Context Loss)",
        description: "Loss of contextual nuances affecting commonsense reasoning",
        content: `
            <div class="bad-example-section">
                <h4>Original English</h4>
                <div class="example-text">
                We see an opening title screen. We see a girl run and perform a high jump and make it over the bar.<br><br>
                    <em>Which ending makes the most sense?</em><br>
                <strong>A)</strong> see about 30 girls jump.<br>
                <strong>B)</strong> see her finish over the bar and retrieve the routine.<br>
                <strong>C)</strong> then see a replay and and slow motion replay.<br>
                <strong>D)</strong> see a girl throw a white ball and it flies straight across the field.<br>
                <strong>Answer</strong>: C
                </div>
            </div>
            <div class="bad-example-section problem">
                <h4><i class="fas fa-exclamation-triangle"></i> Problem: Low Translation Quality and Disconnection between Question and Answers</h4>
                <div class="example-text">
                    <strong>Literal Translation:</strong><br>
                    Ми бачимо початковий екран заголовка. Ми бачимо <span class="highlight-bad">дівчинку біжать</span> та робить високий стрибок, <span class="highlight-bad">пройшовши через перекладину</span>. Ми<br><br>
                    <em>Яке закінчення має найбільший сенс?</em><br>
                    <strong>A)</strong> бачимо близько 30 дівчат стрибають.<br>
                    <strong>B)</strong> бачимо, як вона закінчує перекладину та виконує рутину.<br>
                    <strong>C)</strong> <span class="highlight-bad">потім ми бачимо</span> повтор і повільний повтор.<br>
                    <strong>D)</strong> бачимо, як дівчина кидає білий м'яч, і він летить прямо по полю.<br>
                    <br><br>
                    <strong>Issue:</strong> The translation is generally bad due to unnatural phrasing, grammatical errors and loss of connection between question and answer options. For example, "дівчинку біжать" incorrectly mixes singular and plural forms, and "пройшовши через перекладину" is an awkward way to express "making it over the bar". The overall flow is disrupted, making it hard to follow the context, so it is clear that question and answers were translated separately without regard for coherence. Correct answer option C in particular has lost the connection with "We" from the context, starting with "then we see", which can confuse the model.
                </div>
            </div>
            <div class="bad-example-section solution">
                <h4><i class="fas fa-check-circle"></i> Our Solution: Natural Phrasing</h4>
                <div class="example-text">
                    <strong>Our Translation:</strong><br>
                    	
                    Ми бачимо титульний екран. Ми бачимо, як <span class="highlight-good">дівчина біжить</span>, виконує стрибок у висоту і <span class="highlight-good">перелазить через планку</span>. Ми<br><br>
                    <em>Яке закінчення має найбільший сенс?</em><br>
                    <strong>A)</strong> бачимо, як близько 30 дівчат стрибають.<br>
                    <strong>B)</strong> бачимо, як вона закінчує стрибок над планкою і забирає свою рутину.<br>
                    <strong>C)</strong> <span class="highlight-good">потім бачимо</span> повтор і уповільнений повтор.<br>
                    <strong>D)</strong> бачимо, як дівчина кидає білий м'яч, і він летить прямо через поле.<br>
                    <br><br>
                    <strong>Improvement:</strong> We use "перелазить через" (makes it over), which naturally conveys the temporal sequence without awkward circumlocution. Additionally, "дівчина" (girl) is more appropriate than "дівчинка" (little girl) for this context. We also fix grammatical errors and maintain the connection between the question and answer options, ensuring clarity and coherence throughout.
                </div>
            </div>
        `
    }
];

const exampleTraces = [
    {
        id: "example1",
        title: "MMLU (Ukrainian)",
        originalText: "Question: You observe a species that gives birth to only one offspring at a time and has a relatively long lifespan for its body size. Which of the following is also likely to be true for this organism?\n\nAnswers:\n1. It lives in a newly colonized environment.\n2. It is an aquatic organism.\n3. It requires relatively high parental care for its offspring.\n4. The age at which offspring can themselves give birth is relatively young.",
        candidates: `<strong>Candidate 1:</strong>
Question: Ви спостерігаєте вид, який народжує лише одне потомство за раз і має відносно тривалий життєвий цикл для свого розміру тіла. Що з наступного, ймовірно, також вірно для цього організму?
Answers:
1. Він живе в новозаселеному середовищі.
2. Це водний організм.
3. Він потребує відносно високої батьківської турботи про потомство.
4. Вік, в якому потомство саме може народжувати, є відносно молодим.

<strong>Candidate 2:</strong>
Question: Ви спостерігаєте вид, який народжує лише одне потомство за раз і має відносно тривалий термін життя для свого розміру. Що з наведеного, ймовірно, також вірно для цього організму?
Answers:
1. Він живе в новозаселеному середовищі.
2. Це водний організм.
3. Він потребує відносно великої батьківської турботи про потомство.
4. Вік, в якому потомство саме може народжувати, є відносно молодим.

<strong>Candidate 3:</strong>
Question: Ви спостерігаєте вид, який народжує лише одне потомство за раз і має відносно тривалий термін життя для свого розміру. Що з наведеного, ймовірно, також вірно для цього організму?
Answers:
1. Він живе в нещодавно колонізованому середовищі.
2. Це водний організм.
3. Він потребує відносно великої батьківської опіки за потомством.
4. Вік, в якому потомство може самостійно народжувати, відносно молодий.`,
        reasoning: `The final selected translation is generally accurate and conveys the original meaning well. However, there are minor improvements needed in terms of word choice and grammatical structure.

<strong>Issues identified:</strong>
• The phrase 'відносно тривалий термін життя' could be simplified to 'відносно довгий термін життя' for better clarity.
• The phrase 'батьківської опіки за потомством' should be improved to 'батьківської опіки над потомством' for grammatical correctness.

<strong>Ranking:</strong>
1st: Candidate 3 (best overall structure and terminology)
2nd: Candidate 2 (good but less natural phrasing)
3rd: Candidate 1 (uses less common terms like "життєвий цикл")

Overall, the translation is good but requires minor adjustments for optimal clarity and correctness.`,
        finalTranslation: `<strong>Question:</strong> Ви спостерігаєте вид, який народжує лише одне потомство за раз і має відносно довгий термін життя для свого розміру. Що з наведеного, ймовірно, також вірно для цього організму?

<strong>Answers:</strong>
1. Він живе в нещодавно колонізованому середовищі.
2. Це водний організм.
3. Він потребує відносно великої батьківської опіки над потомством.
4. Вік, в якому потомство може самостійно народжувати, відносно молодий.`
    },
    {
        id: "example2",
        title: "Hellaswag (Bulgarian)",
        originalText: "A young boy and girl are standing over a sink with their mother talking. The mother instructs them on how to brush their teeth while laughing. the boy\n\nWhich ending makes the most sense?\nA) puts a shirt on and rubs his mouth.\nB) helps his younger sister brush his teeth.\nC) He then takes off the equipment and runs into a gym.\nD) He falls off the mountain and the video ends abruptly.",
        candidates: `<strong>Candidate 1:</strong>
Question: Момче и момиче стоят над мивката, докато майка им говори. Майката им дава инструкции как да си мият зъбите, докато се смее. Момчето
Answers: 
A) си слага риза и си търка устата.
B) помага на по-малката си сестра да си мие зъбите.
C) върви с празна чашка за уста на пода на мивката.
D) и момичето след това започват да тренират.

<strong>Candidate 2:</strong>
Question: Момче и момиче стоят над мивката с майка си, която им говори. Майката им обяснява как да си мият зъбите, докато се смее. Момчето
Answers: 
A) слага риза и си търка устата.
B) помага на по-малката си сестра да си мие зъбите.
C) върви с празна чаша за уста на пода на мивката.
D) и момичето след това започват да тренират.

<strong>Candidate 3:</strong>
Question: Момче и момиче стоят над мивката, докато майка им говори с тях. Майката им обяснява как да си мият зъбите, докато се смее. Момчето
Answers: 
A) слага си риза и си търка устата.
B) помага на по-малката си сестра да си измие зъбите.
C) ходи с празна чаша за уста на пода на мивката.
D) и момичето след това започват да тренират.

<strong>Candidate 4:</strong>
Question: Момче и момиче стоят над мивката, докато майка им говори. Майката им дава инструкции как да си мият зъбите, докато се смее. Момчето
Answers: 
A) облича риза и си търка устата.
B) помага на по-малката си сестра да си мие зъбите.
C) върви с празна чаша за уста на пода на мивката.
D) и момичето след това започват да тренират.
`,
        reasoning:  'Skipped in USI method',
        finalTranslation: `<strong>Question:</strong> Момче и момиче стоят над мивката, докато майка им говори. Майката им дава инструкции как да си мият зъбите, докато се смее. Момчето

<strong>Кой край има най-голям смисъл?</strong>
A) си слага риза и си търка устата.
B) помага на по-малката си сестра да си мие зъбите.
C) върви с празна чаша за уста на пода на мивката.
D) и момичето след това започват да тренират.`
    },
    {
        id: "example3",
        title: "Winogrande (Slovak)",
        originalText: "The cat of Sarah has some mouth problems, so she takes it to see Maria. _ is a responsible cat owner.\n\nComplete the sentence:\nA) Sarah.\nB) Maria.",
        candidates: `<strong>Candidate 1:</strong>
Question: Mačka Sarah má problémy s ústami, takže ju berie k Márii. _ je zodpovedn(-ý/-á/-é/-í) majiteľ(-ka/-ľ) mačky.
Answers: 
A) Sarah.
B) Maria.

<strong>Candidate 2:</strong>
Question: Mačka Sarah má nejaké problémy s ústami, a tak ju berie k Márii. _ je zodpovedn(-ý/-á/-é/-í) majiteľ(-ka) mačky.
Answers: 
A) Sarah.
B) Maria.
<strong>Candidate 3:</strong>
Question: Mačka Sarah má problémy s ústami, takže ju berie k Márii. _ je zodpovedn(-ý/-á/-é/-í) majiteľ(-ka/-ľ) mačky.
Answers:    
A) Sarah.
B) Maria.
`,
        reasoning:  'Skipped in USI method',
        finalTranslation: `<strong>Question:</strong> Mačka Sarah má problémy s ústami, takže ju berie k Márii. _ je zodpovedn(-ý/-á/-é/-í) majiteľ(-ka/-ľ) mačky.

<strong>Dokončite vetu:</strong>
A) Sarah.
B) Maria.`
    }
];
