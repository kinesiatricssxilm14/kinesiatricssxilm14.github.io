/**
 * Academic homepage interactions.
 */

document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        
        const spans = hamburger.querySelectorAll('span');
        spans.forEach(span => {
            span.classList.toggle('active');
        });
    });
    
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('active');
                
                const spans = hamburger.querySelectorAll('span');
                spans.forEach(span => {
                    span.classList.remove('active');
                });
            }
        });
    });
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                window.scrollTo({
                    top: targetElement.offsetTop - headerHeight - 20,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navLinks.classList.remove('active');
            
            const spans = hamburger.querySelectorAll('span');
            spans.forEach(span => {
                span.classList.remove('active');
            });
        }
    });

    sortPublicationsByDate();
    
    document.querySelectorAll('[data-expand-group]').forEach(button => {
        button.addEventListener('click', function() {
            const group = this.dataset.expandGroup;
            const items = document.querySelectorAll(`[data-publication-group="${group}"]`);
            const expanded = this.getAttribute('aria-expanded') === 'true';

            items.forEach(item => item.classList.toggle('is-visible', !expanded));
            this.setAttribute('aria-expanded', String(!expanded));
            this.textContent = expanded
                ? `View all ${group === 'first-author' ? 'first-author' : 'collaborative'} papers`
                : 'Show fewer papers';
        });
    });

    const honorsButton = document.querySelector('[data-expand-honors]');
    if (honorsButton) {
        honorsButton.addEventListener('click', function() {
            const expanded = this.getAttribute('aria-expanded') === 'true';
            document.querySelectorAll('.honor-extra').forEach(item => {
                item.classList.toggle('is-visible', !expanded);
            });
            this.setAttribute('aria-expanded', String(!expanded));
            this.textContent = expanded ? 'View all honors and awards' : 'Show fewer honors';
        });
    }

    document.querySelectorAll('.education-card, .activity-item, .experience-item, .honor-item').forEach(card => {
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');

        const openDetails = () => openInfoModal(card);
        card.addEventListener('click', openDetails);
        card.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openDetails();
            }
        });
    });
});

const publicationDates = {
    'tui-testing': '2026-08-05',
    'cli-tool-bench': '2026-04-09',
    'swd-bench': '2026-04-09',
    'vuleval': '2026-02-23',
    'repo2run': '2025-12-02',
    'codevisionary': '2025-11-16',
    'repomastereval': '2025-11-16',
    'sr-eval': '2025-09-24',
    'coderepoqa': '2025-07-13',
    'trae-agent': '2025-07-31',
    'contextcrbench': '2026-07-05',
    'aegis': '2025-06-23',
    'faun-eval': '2024-11-27',
    'reposvul': '2024-04-14',
    'pyconf': '2024-04-14'
};

function sortPublicationsByDate() {
    document.querySelectorAll('.publication-category').forEach((heading, categoryIndex) => {
        const group = categoryIndex === 0 ? 'first-author' : 'collaborative';
        const lists = [];
        let sibling = heading.nextElementSibling;

        while (sibling && !sibling.matches('[data-expand-group]')) {
            if (sibling.classList.contains('publications-list')) {
                lists.push(sibling);
            }
            sibling = sibling.nextElementSibling;
        }

        if (!lists.length) return;

        lists[0].classList.add(`publications-list-${group}`);
        const cards = lists.flatMap(list => [...list.querySelectorAll('.publication-card')]);
        const getId = card => card.getAttribute('onclick')?.match(/'([^']+)'/)?.[1] || '';

        cards.forEach(card => {
            const date = publicationDates[getId(card)];
            const title = card.querySelector('.publication-title');
            if (!date || !title || card.querySelector('.publication-date')) return;

            const time = document.createElement('time');
            time.className = 'publication-date';
            time.dateTime = date;
            time.textContent = date.slice(0, 7).replace('-', '.');
            time.title = card.querySelector('.preprint')
                ? 'arXiv submission date'
                : 'Official publication or conference date';
            title.before(time);
        });

        cards.sort((first, second) => {
            return (publicationDates[getId(second)] || '').localeCompare(publicationDates[getId(first)] || '');
        });

        cards.forEach((card, index) => {
            const isExtra = index >= 2;
            card.classList.toggle('publication-extra', isExtra);

            if (isExtra) {
                card.dataset.publicationGroup = group;
            } else {
                delete card.dataset.publicationGroup;
            }

            lists[0].appendChild(card);
        });

        lists.slice(1).forEach(list => list.remove());
    });
}

function openInfoModal(card) {
    const modalContent = document.getElementById('modalContent');
    const modalPanel = modalContent.closest('.modal-content');
    const image = card.querySelector('.education-emblem, .activity-logo, .conference-logo');
    let title = '';
    let details = [];

    if (card.classList.contains('education-card')) {
        modalPanel.dataset.modalType = 'education';
        title = card.querySelector('.education-degree')?.textContent || 'Education';
        details = [...card.querySelectorAll('p')].map(item => item.textContent);
    } else if (card.classList.contains('activity-item')) {
        modalPanel.dataset.modalType = 'activity';
        title = card.querySelector('.activity-title')?.textContent || 'Activity';
        details = [...card.querySelectorAll('.activity-period, .activity-description')].map(item => item.textContent);
    } else if (card.classList.contains('experience-item')) {
        modalPanel.dataset.modalType = 'experience';
        title = card.querySelector('.experience-title')?.textContent || 'Experience';
        details = [...card.querySelectorAll('.experience-location, .experience-period')].map(item => item.textContent);
    } else {
        modalPanel.dataset.modalType = 'honor';
        title = card.querySelector('.honor-title')?.textContent || 'Honor';
        details = [card.querySelector('.honor-details')?.textContent].filter(Boolean);
    }

    modalContent.innerHTML = '';
    const isEducation = card.classList.contains('education-card');
    const usesSideLogo = Boolean(image) && (
        isEducation ||
        card.classList.contains('activity-item') ||
        card.classList.contains('experience-item')
    );
    const textContainer = document.createElement('div');
    let modalImage = null;

    if (image) {
        modalImage = document.createElement('img');
        modalImage.src = image.src;
        modalImage.alt = image.alt;
        modalImage.className = 'modal-image info-modal-image';
        if (usesSideLogo) {
            modalImage.classList.add('info-side-logo');
        }
        if (image.classList.contains('education-emblem')) {
            modalImage.classList.add('education-modal-emblem');
        }
        if (image.dataset.crop === 'left') {
            modalImage.classList.add('education-modal-emblem-crop-left');
        }
        if (!usesSideLogo) {
            modalContent.appendChild(modalImage);
        }
    }

    const heading = document.createElement('h2');
    heading.textContent = title;
    textContainer.appendChild(heading);

    details.forEach(detail => {
        const paragraph = document.createElement('p');
        paragraph.textContent = detail;
        textContainer.appendChild(paragraph);
    });

    if (usesSideLogo) {
        const layout = document.createElement('div');
        layout.className = 'info-modal-layout';
        textContainer.className = 'info-modal-copy';
        layout.appendChild(textContainer);
        if (modalImage) layout.appendChild(modalImage);
        modalContent.appendChild(layout);
    } else {
        modalContent.appendChild(textContainer);
    }

    document.getElementById('paperModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Publication details
const paperDetails = {
    'tui-testing': {
        title: 'Can LLMs Test Terminal User Interfaces?',
        authors: 'Chao Peng#, Ruida Hu#, Ajitha Rajan, Tegawendé F. Bissyandé, Jacques Klein, Cuiyun Gao',
        venue: 'arXiv preprint, 2026',
        abstract: 'Terminal User Interfaces (TUIs) combine the stateful, screen-oriented behaviour of GUIs with terminal deployment and are now common in developer tools. Yet they lack a dedicated testing methodology. We survey 197 real-world TUI applications: only 12% of test code exercises the interface, and 45% of those tests never send input, checking a static frame instead. We turn these applications into a headless benchmark spanning ratatui/Rust, bubbletea/Go, textual/Python, and ink/TypeScript, packaging each as an instrumented Docker image. We record line and widget coverage where reliable, rendered terminal states, and crashes. Under equal wall-clock budgets, we compare four frontier LLMs with random exploration. No model dominates. Random is a strong time-budgeted baseline, but its crash advantage comes from higher throughput: per interaction, LLM guidance is more efficient and uniquely reaches input-gated faults. Automatically deriving launch inputs yields the largest practical gain, enabling applications that otherwise never start. Line coverage poorly predicts crash discovery, weakening it as a proxy for test effectiveness. Automated TUI testing is feasible but far from solved, and honest baselines matter more than model choice.',
        image: 'paper_image/tui-testing.png',
        links: [
            { text: 'PDF', url: 'https://arxiv.org/pdf/2608.03743' }
        ]
    },
    'cli-tool-bench': {
        title: 'Evaluating LLM-Based 0-to-1 Software Generation in End-to-End CLI Tool Scenarios',
        authors: 'Ruida Hu, Xinchen Wang, Chao Peng, Cuiyun Gao*, David Lo',
        venue: 'arXiv preprint, 2026',
        abstract: 'The evolution of Large Language Models (LLMs) has catalyzed a paradigm shift towards intent-driven software development, where autonomous agents are expected to design and deliver complete, runnable software systems from scratch. However, existing benchmarks fail to adequately assess this 0-to-1 generation capability because they rely on predefined structural scaffolds and rigid white-box unit testing. We introduce CLI-Tool-Bench, a structure-agnostic benchmark for ground-up generation of command-line tools. Powered by an automated black-box differential testing framework, it comprises 94 high-quality, real-world repositories spanning diverse programming languages and complexity levels. Extensive evaluation of seven state-of-the-art LLMs shows that top-tier models achieve a maximum overall success rate of only 43.8%, highlighting that 0-to-1 software generation remains highly challenging.',
        image: 'paper_image/cli-tool-bench.png',
        links: [
            { text: 'PDF', url: 'https://arxiv.org/pdf/2604.06742' }
        ]
    },
    'faun-eval': {
        title: 'A Real-World Benchmark for Evaluating Fine-Grained Issue Solving Capabilities of Large Language Models',
        authors: 'Ruida Hu, Chao Peng*, Jingyi Ren, Bo Jiang, Xiangxin Meng, Qinyun Wu, Pengfei Gao, Xinchen Wang, Cuiyun Gao*',
        venue: 'arXiv preprint, 2024',
        abstract: 'Automatically resolving software issues is crucial for software development in practice. Existing benchmarks either focus on small, self-contained problems or evaluate issue solving only end to end. We introduce FAUN-Eval, a benchmark designed to evaluate fine-grained issue-solving capabilities across question answering, fault localization, and code editing. The benchmark contains 300 entries curated from 30 well-known GitHub repositories and uses both LLM and manual checks to ensure data quality. Evaluation of ten LLMs reveals that the top-performing model differs across tasks, issue features can lead models to generate incorrect information, and models vary in their proficiency with texts of different lengths.',
        image: 'paper_image/faun-eval.png',
        links: [
            { text: 'PDF', url: 'https://arxiv.org/pdf/2411.18019' }
        ]
    },
    'swd-bench': {
        title: 'Evaluating Repository-level Software Documentation via Question Answering and Feature-Driven Development',
        authors: 'Xinchen Wang, Ruida Hu, Cuiyun Gao, Pengfei Gao, Chao Peng',
        venue: 'arXiv preprint, 2026',
        abstract: 'Software documentation is crucial for repository comprehension, yet existing benchmarks lack repository-level analysis and rely on unreliable evaluation strategies. We propose SWD-Bench, a benchmark that evaluates repository-level software documentation by treating LLMs as repository developers and measuring their ability to understand and implement functionality. SWD-Bench introduces three interconnected tasks: functionality detection, functionality localization, and functionality completion. Its construction pipeline yields 4,170 entries across the three tasks. Experiments highlight limitations in current repository-level documentation generation methods and show that documentation generated by the best-performing method improves SWE-Agent issue-solving performance by 20.00%.',
        image: 'paper_image/swd-bench.png',
        links: [
            { text: 'PDF', url: 'https://arxiv.org/pdf/2604.06793' }
        ]
    },
    'sr-eval': {
        title: 'SR-Eval: Evaluating LLMs on Code Generation under Stepwise Requirement Refinement',
        authors: 'Zexun Zhan, Shuzheng Gao, Ruida Hu, Cuiyun Gao',
        venue: 'arXiv preprint, 2025',
        abstract: 'Large language models have made remarkable progress in code generation, but existing benchmarks primarily treat the task as a static, single-turn problem. We present SR-Eval, a benchmark for iterative code generation under stepwise requirement refinement. It spans function- and repository-level tasks in Python and Java and contains 443 multi-turn tasks with 1,857 questions. Evaluation of 11 representative LLMs shows that this scenario remains highly challenging: the best model achieves only a 22.67% completion rate on function-level tasks and 20.00% on repository-level tasks. Prompting strategies also substantially influence performance.',
        image: 'paper_image/sr-eval.png',
        links: [
            { text: 'PDF', url: 'https://arxiv.org/pdf/2509.18808' }
        ]
    },
    'trae-agent': {
        title: 'Trae Agent: An LLM-based Agent for Software Engineering with Test-time Scaling',
        authors: 'Pengfei Gao, Zhao Tian, Xiangxin Meng, Xinchen Wang, Ruida Hu, Yuanan Xiao, Yizhou Liu, Zhao Zhang, Junjie Chen, Cuiyun Gao, Yun Lin, Yingfei Xiong, Chao Peng, Xia Liu, Trae Research Team',
        venue: 'Arxiv July, 2025',
        abstract: 'Software issue resolution is a critical challenge in software engineering and has garnered increasing attention in recent years. With the rapid advancement of large language models (LLMs), substantial progress has been made in addressing real-world software engineering tasks. Recent studies have introduced ensemble reasoning techniques to enhance the performance of LLM-based issue resolution. However, existing prompting-based methods still face limitations in effectively exploring large ensemble spaces and lack the capacity for repository-level understanding, both of which constrain their overall effectiveness. In this paper, we propose Trae Agent, the first agent-based ensemble reasoning approach for repository-level issue resolution. Trae Agent formulates our goal as an optimal solution search problem and addresses two key challenges, i.e., large ensemble spaces and repository-level understanding, through modular agents for generation, pruning, and selection. We conduct extensive experiments using three leading LLMs on the widely-adopted SWE-bench benchmark, comparing Trae Agent against four state-of-the-art ensemble reasoning techniques. Experimental results demonstrate that Trae Agent consistently achieves superior performance, with an average improvement of 10.22% over all baselines in terms of Pass@1. Trae Agent has achieved first place on the SWE-bench Verified leaderboard, with a notable Pass@1 score of 75.20%. We are pleased to release Trae Agent as an open-source project to support the research community, with all resources available at https://github.com/bytedance/trae-agent.',
        image: 'paper_image/trae_agent.png',
        links: [
            { text: 'PDF', url: 'https://arxiv.org/pdf/2507.23370?' },
            { text: 'Code', url: 'https://github.com/bytedance/trae-agent' }
        ]
    },
    'repo2run': {
        title: 'Repo2Run: Automated Building Executable Environment for Code Repository at Scale',
        authors: 'Ruida Hu, Chao Peng*, Xinchen Wang, Junjielong Xu, Cuiyun Gao*',
        venue: '29th Annual Conference on Neural Information Processing Systems (NeurIPS 2025)',
        abstract: 'Scaling up executable code data is significant for improving language models\' software engineering capability. The intricate nature of the process makes it labor-intensive, time-consuming and expert-knowledge-dependent to build a large number of executable code repositories, limiting the scalability of existing work based on running tests. The primary bottleneck lies in the automated building of test environments for different repositories, which is an essential yet underexplored task. To mitigate the gap, we introduce Repo2Run, the first LLM-based agent aiming at automating the building of executable test environments for any repositories at scale. Specifically, given a code repository, Repo2Run iteratively builds the Docker image, runs unit tests based on the feedback of the building, and synthesizes the Dockerfile until the entire pipeline is executed successfully. The resulting Dockerfile can then be used to create Docker container environments for running code and tests. We created a benchmark containing 420 Python repositories with unit tests for evaluation. The results illustrate that Repo2Run achieves an 86.0% success rate, outperforming SWE-agent by 77.0%. The resources of Repo2Run are available at https://github.com/bytedance/Repo2Run.',
        image: 'paper_image/repo2run.png',
        links: [
            { text: 'PDF', url: 'https://arxiv.org/pdf/2502.13681' },
            { text: 'Code', url: 'https://github.com/bytedance/Repo2Run' }
        ]
    },
    'coderepoqa': {
        title: 'Understanding Large Language Model Performance in Software Engineering: A Large-scale Question Answering Benchmark',
        authors: 'Ruida Hu, Chao Peng, Jingyi Ren, Bo Jiang, Xiangxin Meng, Qinyun Wu, Pengfei Gao, Xinchen Wang, Cuiyun Gao*',
        venue: '48th International ACM SIGIR Conference on Research and Development in Information Retrieval (SIGIR 2025 short paper)',
        abstract: 'In this work, we introduce CodeRepoQA, a large-scale benchmark specifically designed for evaluating repository-level questionanswering capabilities in the field of software engineering. CodeRepoQA encompasses five programming languages and covers a wide range of scenarios, enabling comprehensive evaluation of languagemodels. To construct this dataset, we crawl data from 30 well-known repositories in GitHub, the largest platform for hosting and collaborating on code, and carefully filter the raw data. In total, CodeRepoQA is a multi-turn question-answering benchmark with 585,687 entries. It covers a diverse array of software engineering scenarios, with an average of 6.62 dialogue turns per entry. We evaluate ten popular large language models on our dataset and provide in-depth analysis. We find that LLMs still have limitations in question-answering capabilities in the field of software engineering, and medium-length contexts are more conducive to their performance. The entire benchmark and details are publicly available at https://github.com/kinesiatricssxilm14/CodeRepoQA.',
        image: 'paper_image/coderepoqa.png',
        links: [
            { text: 'PDF', url: 'https://dl.acm.org/doi/pdf/10.1145/3726302.3730262' },
            { text: 'Code', url: 'https://github.com/kinesiatricssxilm14/CodeRepoQA' }
        ]
    },
    'reposvul': {
        title: 'Reposvul: A repository-level high-quality vulnerability dataset',
        authors: 'Xinchen Wang#, Ruida Hu#, Cuiyun Gao*, Xin-Cheng Wen, Yujia Chen, Qing Liao',
        venue: '46th International Conference on Software Engineering: Companion Proceedings (ICSE 2024 Industry Challenge Track)',
        abstract: 'Open-Source Software (OSS) vulnerabilities bring great challenges to the software security and pose potential risks to our society. Enormous efforts have been devoted into automated vulnerability detection, among which deep learning (DL)-based approaches have proven to be the most effective. However, the current labeled data present the following limitations: (1) Tangled Patches: Developers may submit code changes unrelated to vulnerability fixes within patches, leading to tangled patches. (2) Lacking Inter-procedural Vulnerabilities: The existing vulnerability datasets typically contain function-level and file-level vulnerabilities, ignoring the relations between functions, thus rendering the approaches unable to detect the inter-procedural vulnerabilities. (3) Outdated Patches: The existing datasets usually contain outdated patches, which may bias the model during training.\nTo address the above limitations, in this paper, we propose an automated data collection framework and construct the first repository-level high-quality vulnerability dataset named ReposVul. The proposed framework mainly contains three modules: (1) A vulnerability untangling module, aiming at distinguishing vulnerability-fixing related code changes from tangled patches, in which the Large Language Models (LLMs) and static analysis tools are jointly employed. (2) A multi-granularity dependency extraction module, aiming at capturing the inter-procedural call relationships of vulnerabilities, in which we construct multiple-granularity information for each vulnerability patch, including repository-level, file-level, function-level, and line-level. (3) A trace-based filtering module, aiming at filtering the outdated patches, which leverages the file path trace-based filter and commit time trace-based filter to construct an up-to-date dataset.',
        image: 'paper_image/reposvul.png',
        links: [
            { text: 'PDF', url: 'https://arxiv.org/pdf/2401.13169' },
            { text: 'Code', url: 'https://github.com/Eshe0922/ReposVul' }
        ]
    },
    'codevisionary': {
        title: 'An Agent-based Evaluation Framework for Complex Code Generation',
        authors: 'Xinchen Wang, Ruida Hu, Pengfei Gao, Chao Peng, Cuiyun Gao',
        venue: '40th IEEE/ACM International Conference on Automated Software Engineering (ASE 2025)',
        abstract: 'Large language models (LLMs) have demonstrated strong capabilities in code generation, underscoring the critical need for rigorous and comprehensive evaluation. Existing evaluation approaches fall into three categories, including human-centered, metric-based, and LLM-based. Considering that human-centered approaches are labour-intensive and metric-based ones overly rely on reference answers, LLM-based approaches are gaining increasing attention due to their stronger contextual understanding capabilities and superior efficiency. However, the performance of LLM-based approaches remains limited due to: (1) lack of multisource domain knowledge, and (2) insufficient comprehension of complex code.\nTo mitigate the limitations, we propose CodeVisionary, the first LLM-based agent framework for evaluating LLMs in code generation. CodeVisionary consists of two stages: (1) Multiscore knowledge analysis stage, which aims to gather multisource and comprehensive domain knowledge by formulating and executing a stepwise evaluation plan. (2) Negotiation-based scoring stage, which involves multiple judges engaging in discussions to better comprehend the complex code and reach a consensus on the evaluation score. Extensive experiments demonstrate that CodeVisionary achieves the best performance for evaluating LLMs in code generation, outperforming the best baseline methods with average improvements of 0.202, 0.139, and 0.117 in Pearson, Spearman, and Kendall-Tau coefficients, respectively. Besides, CodeVisionary provides detailed evaluation reports, which assist developers in identifying shortcomings and making improvements. The resources of CodeVisionary are available at https://anonymous.4open.science/r/CodeVisionary.',
        image: 'paper_image/codevisionary.png',
        links: [
            { text: 'PDF', url: 'https://arxiv.org/pdf/2504.13472' },
            { text: 'Code', url: 'https://anonymous.4open.science/r/CodeVisionary' }
        ]
    },
    'repomastereval': {
        title: 'Repomastereval: Evaluating code completion via real-world repositories',
        authors: 'Qinyun Wu, Chao Peng, Pengfei Gao, Ruida Hu, Haoyu Gan, Bo Jiang, Jinhe Tang, Zhiwen Deng, Zhanming Guan, Cuiyun Gao, Xia Liu, Ping Yang',
        venue: '40th IEEE/ACM International Conference on Automated Software Engineering (ASE 2025 Industry Showcase)',
        abstract: 'With the growing reliance on automated code completion tools in software development, the need for robust evaluation benchmarks has become critical. However, existing benchmarks focus more on code generation tasks in function and class level and provide rich text description to prompt the model. By contrast, such descriptive prompt is commonly unavailable in real development and code completion can occur in wider range of situations such as in the middle of a function or a code block. These limitations makes the evaluation poorly align with the practical scenarios of code completion tools. In this paper, we propose RepoMasterEval, a novel benchmark for evaluating code completion models constructed from real-world Python and TypeScript repositories. Each benchmark datum is generated by masking a code snippet (ground truth) from one source code file with existing test suites. To improve test accuracy of model generated code, we employ mutation testing to measure the effectiveness of the test cases and we manually crafted new test cases for those test suites with low mutation score. Our empirical evaluation on 6 state-of-the-art models shows that test argumentation is critical in improving the accuracy of the benchmark and RepoMasterEval is able to report difference in model performance in real-world scenarios. The deployment of RepoMasterEval in a collaborated company for one month also revealed that the benchmark is useful to give accurate feedback during model training and the score is in high correlation with the model\'s performance in practice. Based on our findings, we call for the software engineering community to build more LLM benchmarks tailored for code generation tools taking the practical and complex development environment into consideration.',
        image: 'paper_image/repomastereval.png',
        links: [
            { text: 'PDF', url: 'https://arxiv.org/pdf/2408.03519?' }
        ]
    },
    'aegis': {
        title: 'AEGIS: An agent-based framework for general bug reproduction from issue descriptions',
        authors: 'Xinchen Wang, Pengfei Gao, Xiangxin Meng, Chao Peng, Ruida Hu, Yun Lin, Cuiyun Gao',
        venue: '33rd ACM International Conference on the Foundations of Software Engineering (FSE 2025 Industry Track)',
        abstract: 'In software maintenance, bug reproduction is essential for effective fault localization and repair. Manually writing reproduction scripts is a time-consuming task with high requirements for developers. Hence, automation of bug reproduction has increasingly attracted attention from researchers and practitioners. However, the existing studies on bug reproduction are generally limited to specific bug types such as program crashes, and hard to be applied to general bug reproduction. In this paper, considering the superior performance of agent-based methods in code intelligence tasks, we focus on designing an agent-based framework for the task. Directly employing agents would lead to limited bug reproduction performance, due to entangled subtasks, lengthy retrieved context, and unregulated actions. To mitigate the challenges, we propose an Automated gEneral buG reproductIon Scripts generation framework, named AEGIS, which is the first agent-based framework for the task. AEGIS mainly contains two modules: (1) A concise context construction module, which aims to guide the code agent in extracting structured information from issue descriptions, identifying issue-related code with detailed explanations, and integrating these elements to construct the concise context; (2) A FSM-based multi-feedback optimization module to further regulate the behavior of the code agent within the finite state machine (FSM), ensuring a controlled and efficient script generation process based on multi-dimensional feedback. Extensive experiments on the public benchmark dataset show that AEGIS outperforms the state-of-the-art baseline by 23.0% in F->P metric. In addition, the bug reproduction scripts generated by AEGIS can improve the relative resolved rate of Agentless by 12.5%.',
        image: 'paper_image/aegis.png',
        links: [
            { text: 'PDF', url: 'https://dl.acm.org/doi/pdf/10.1145/3696630.3728557' }
        ]
    },
    'vuleval': {
        title: 'From Function to Repository: Towards Repository-Level Evaluation of Software Vulnerability Detection',
        authors: 'Xin-Cheng Wen, Xinchen Wang, Yujia Chen, Ruida Hu, David Lo, Cuiyun Gao',
        venue: 'TSE 2026',
        abstract: 'Deep Learning (DL)-based methods have proven to be effective for software vulnerability detection, with a potential for substantial productivity enhancements for detecting vulnerabilities. Current methods mainly focus on detecting single functions (i.e., intra-procedural vulnerabilities), ignoring the more complex inter-procedural vulnerability detection scenarios in practice. For example, developers routinely engage with program analysis to detect vulnerabilities that span multiple functions within repositories. In addition, the widely-used benchmark datasets generally contain only intra-procedural vulnerabilities, leaving the assessment of inter-procedural vulnerability detection capabilities unexplored.\nTo mitigate the issues, we propose a repository-level evaluation system, named \textbf{VulEval}, aiming at evaluating the detection performance of inter- and intra-procedural vulnerabilities simultaneously. Specifically, VulEval consists of three interconnected evaluation tasks: \textbf{(1) Function-Level Vulnerability Detection}, aiming at detecting intra-procedural vulnerability given a code snippet; \textbf{(2) Vulnerability-Related Dependency Prediction}, aiming at retrieving the most relevant dependencies from call graphs for providing developers with explanations about the vulnerabilities; and \textbf{(3) Repository-Level Vulnerability Detection}, aiming at detecting inter-procedural vulnerabilities by combining with the dependencies identified in the second task. VulEval also consists of a large-scale dataset, with a total of 4,196 CVE entries, 232,239 functions, and corresponding 4,699 repository-level source code in C/C++ programming languages. Our analysis highlights the current progress and future directions for software vulnerability detection.',
        image: 'paper_image/vuleval.png',
        links: [
            { text: 'PDF', url: 'https://arxiv.org/pdf/2404.15596' }
        ]
    },
    'contextcrbench': {
        title: 'Benchmarking LLMs for Fine-Grained Code Review with Enriched Context in Practice',
        authors: 'Ruida Hu, Xinchen Wang, Xin-Cheng Wen, Zhao Zhang, Bo Jiang, Pengfei Gao, Chao Peng*, Cuiyun Gao*',
        venue: '34th ACM International Conference on the Foundations of Software Engineering (FSE 2026 Industry Track)',
        abstract: 'Code review is a critical practice for ensuring software quality in modern software development, and the recent advancements in Large Language Models (LLMs) have demonstrated efficacy in facilitating automated code review processes. However, existing benchmarks for code review have the following limitations. (1) They lack the rich semantic context. Current benchmarks often provide code changes and fail to incorporate key textual information such as issue descriptions, which are essential for understanding the intent behind a code change. (2) They frequently exhibit data quality issues due to the absence of rigorous validation mechanisms during the curation process. This negligence results in the incorporation of noisy entries, such as reviews on outdated code, ultimately resulting in unreliable model evaluation. (3) Most existing benchmarks operate at a file or commit level, failing to evaluate the fine-grained, line-level analysis essential for precise code understanding. To address the limitations of existing datasets, we present ContextCRBench, a high-quality, context-rich benchmark designed for fine-grained evaluation of LLMs in code review tasks. Our construction pipeline consists of three main modules. First, the Raw Data Crawling module collects over 153.7k issues and PRs from selected top-tier repositories. Next, the Comprehensive Context Extraction module establishes rich context by rigorously linking issue-PR pairs for textual context and extracting the full surrounding function or class for code context. Finally, our Multistage Data Filtering module applies a series of checks to remove entries that are outdated, improperly formatted, or identified as low-value by an LLM-based classifier. This rigorous process yields the final benchmark of 67,910 entries. Each entry in our benchmark is enriched with both textual context and code context. We design our benchmark to support three core evaluation scenarios aligned with the code review lifecycle: (1) hunk-level quality assessment, assessing if a given diff hunk needs further review; (2) line-level defect localization, identifying the specific lines within the diff hunk needed to comment; and (3) line-level review comment generation, generating an actionable comment for an identified code line. Leveraging ContextCRBench, we conduct a comprehensive evaluation of eight popular LLMs, including four leading closedsource and four open-source models. We find that current LLMs still exhibit great limitations in code review, and the textual context often yields greater performance improvements than providing only the surrounding code context. In an industrial application at ByteDance, ContextCRBench serves as the core reward signal for a self-evolving code review tool, guiding it to a 61.98% relative performance improvement. This validates the practical utility and effectiveness of our benchmark in industrial applications.',
        image: 'paper_image/contextcrbench.png',
        links: [
            { text: 'PDF', url: 'https://arxiv.org/pdf/2511.07017' },
            { text: 'Code', url: 'https://github.com/kinesiatricssxilm14/ContextCRBench' }
        ]
    },
    'pyconf': {
        title: 'Less is more? an empirical study on configuration issues in python pypi ecosystem',
        authors: 'Yun Peng, Ruida Hu, Ruoke Wang, Cuiyun Gao, Shuqing Li, Michael R Lyu',
        venue: '46th international conference on software engineering (ICSE 2024)',
        abstract: 'Python is widely used in the open-source community, largely owing to the extensive support from diverse third-party libraries within the PyPI ecosystem. Nevertheless, the utilization of third-party libraries can potentially lead to conflicts in dependencies, prompting researchers to develop dependency conflict detectors. Moreover, endeavors have been made to automatically infer dependencies. These approaches focus on version-level checks and inference, based on the assumption that configurations of libraries in the PyPI ecosystem are correct. However, our study reveals that this assumption is not universally valid, and relying solely on version-level checks proves inadequate in ensuring compatible run-time environments. In this paper, we conduct an empirical study to comprehensively study the configuration issues in the PyPI ecosystem. Specifically, we propose PyConf, a source-level detector, for detecting potential configuration issues. PyConf employs three distinct checks, targeting the setup, packing, and usage stages of libraries, respectively. To evaluate the effectiveness of the current automatic dependency inference approaches, we build a benchmark called VLibs, comprising library releases that pass all three checks of PyConf. We identify 15 kinds of configuration issues and find that 183,864 library releases suffer from potential configuration issues. Remarkably, 68% of these issues can only be detected via the source-level check. Our experiment results show that the most advanced automatic dependency inference approach, PyEGo, can successfully infer dependencies for only 65% of library releases. The primary failures stem from dependency conflicts and the absence of required libraries in the generated configurations. Based on the empirical results, we derive six findings and draw two implications for open-source developers and future research in automatic dependency inference.',
        image: 'paper_image/pyconf.png',
        links: [
            { text: 'PDF', url: 'https://arxiv.org/pdf/2310.12598' },
            { text: 'Code', url: 'https://github.com/JohnnyPeng18/PyConf' }
        ]
    }
    // Add more publication details here.
};

// Open publication details modal.
function openPaperModal(paperId) {
    const paper = paperDetails[paperId];
    if (!paper) return;
    
    const modalContent = document.getElementById('modalContent');
    modalContent.closest('.modal-content').dataset.modalType = 'publication';
    const formattedAuthors = paper.authors.replace(
        /Ruida Hu/g,
        '<strong class="modal-author-highlight">Ruida Hu</strong>'
    );
    modalContent.innerHTML = `
        <img src="${paper.image}" alt="${paper.title}" class="modal-image">
        <h2 style="color: var(--primary-color); margin-bottom: 15px;">${paper.title}</h2>
        <p style="font-style: italic; color: #666; margin-bottom: 10px;"><strong>Authors:</strong> ${formattedAuthors}</p>
        <p style="font-weight: 500; color: #555; margin-bottom: 20px;"><strong>Venue:</strong> ${paper.venue}</p>
        <h3 style="color: var(--primary-color); margin-bottom: 10px;">Abstract</h3>
        <p style="line-height: 1.6; margin-bottom: 20px;">${paper.abstract}</p>
        <div style="display: flex; gap: 10px;">
            ${paper.links.map(link => `<a href="${link.url}" class="btn btn-small" target="_blank">${link.text}</a>`).join('')}
        </div>
    `;
    
    document.getElementById('paperModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close publication details modal.
function closePaperModal() {
    document.getElementById('paperModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close the modal when its backdrop is clicked.
window.onclick = function(event) {
    const modal = document.getElementById('paperModal');
    if (event.target === modal) {
        closePaperModal();
    }
}

// ===== End of script =====