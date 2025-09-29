/**
 * 学术主页 JavaScript 功能
 * 主要实现移动端导航菜单的展开和收起
 */

document.addEventListener('DOMContentLoaded', function() {
    // 获取汉堡菜单按钮和导航链接元素
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    // 点击汉堡菜单按钮时切换导航菜单的显示状态
    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        
        // 汉堡菜单按钮动画效果
        const spans = hamburger.querySelectorAll('span');
        spans.forEach(span => {
            span.classList.toggle('active');
        });
    });
    
    // 点击导航链接后关闭菜单（移动端）
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('active');
                
                // 恢复汉堡菜单按钮状态
                const spans = hamburger.querySelectorAll('span');
                spans.forEach(span => {
                    span.classList.remove('active');
                });
            }
        });
    });
    
    // 添加平滑滚动效果
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                window.scrollTo({
                    top: targetElement.offsetTop - headerHeight - 20, // 减去导航栏高度和额外间距
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 监听窗口大小变化，在大屏幕下重置导航菜单状态
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navLinks.classList.remove('active');
            
            // 恢复汉堡菜单按钮状态
            const spans = hamburger.querySelectorAll('span');
            spans.forEach(span => {
                span.classList.remove('active');
            });
        }
    });
    
    // 创建动态装饰背景
    createFloatingDecorations();
    
    // 添加鼠标交互效果
    addMouseInteraction();
});

// 创建浮动装饰效果
function createFloatingDecorations() {
    const decorationsContainer = document.createElement('div');
    decorationsContainer.className = 'floating-decorations';
    document.body.appendChild(decorationsContainer);
    
    // 装饰元素类型
    const elementTypes = ['circle', 'triangle', 'diamond', 'star'];
    
    // 创建多个装饰元素
    for (let i = 0; i < 12; i++) {
        createFloatingElement(decorationsContainer, elementTypes);
    }
    
    // 定期创建新的装饰元素
    setInterval(() => {
        if (Math.random() < 0.4) { // 40%概率创建新元素
            createFloatingElement(decorationsContainer, elementTypes);
        }
    }, 3000);
}

function createFloatingElement(container, types) {
    const element = document.createElement('div');
    const randomType = types[Math.floor(Math.random() * types.length)];
    element.className = `floating-element ${randomType}`;
    
    // 随机位置和动画时长
    const leftPosition = Math.random() * 100;
    const animationDuration = 8 + Math.random() * 12; // 8-20秒
    const animationDelay = Math.random() * 3; // 0-3秒延迟
    
    element.style.left = leftPosition + '%';
    element.style.animationDuration = animationDuration + 's';
    element.style.animationDelay = animationDelay + 's';
    
    container.appendChild(element);
    
    // 添加点击效果
    element.addEventListener('click', () => {
        element.style.transform += ' scale(1.5)';
        element.style.filter = 'brightness(1.5) saturate(1.5)';
        setTimeout(() => {
            element.style.transform = element.style.transform.replace(' scale(1.5)', '');
            element.style.filter = '';
        }, 300);
    });
    
    // 动画结束后移除元素
    setTimeout(() => {
        if (element.parentNode) {
            element.parentNode.removeChild(element);
        }
    }, (animationDuration + animationDelay) * 1000);
}

// 添加鼠标交互效果
function addMouseInteraction() {
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // 获取所有装饰元素
        const elements = document.querySelectorAll('.floating-element');
        elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const elementX = rect.left + rect.width / 2;
            const elementY = rect.top + rect.height / 2;
            
            // 计算鼠标与装饰元素的距离
            const distance = Math.sqrt(
                Math.pow(mouseX - elementX, 2) + Math.pow(mouseY - elementY, 2)
            );
            
            // 如果距离小于120px，产生吸引效果
            if (distance < 120) {
                const angle = Math.atan2(mouseY - elementY, mouseX - elementX);
                const force = (120 - distance) / 120; // 力度与距离成反比
                const attractX = Math.cos(angle) * force * 30;
                const attractY = Math.sin(angle) * force * 30;
                
                element.classList.add('mouse-attract');
                element.style.transform = `translate(${attractX}px, ${attractY}px) rotate(${force * 90}deg) scale(${1 + force * 0.3})`;
            } else {
                element.classList.remove('mouse-attract');
                element.style.transform = '';
            }
        });
     });
}

// 论文详情数据
const paperDetails = {
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
        title: 'CodeVisionary: An Agent-based Framework for Evaluating Large Language Models in Code Generation',
        authors: 'Xinchen Wang, Pengfei Gao, Chao Peng, Ruida Hu, Cuiyun Gao',
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
        title: 'Vuleval: Towards repository-level evaluation of software vulnerability detection',
        authors: 'Xin-Cheng Wen, Xinchen Wang, Yujia Chen, Ruida Hu, David Lo, Cuiyun Gao',
        venue: 'Arxiv April, 2024',
        abstract: 'Deep Learning (DL)-based methods have proven to be effective for software vulnerability detection, with a potential for substantial productivity enhancements for detecting vulnerabilities. Current methods mainly focus on detecting single functions (i.e., intra-procedural vulnerabilities), ignoring the more complex inter-procedural vulnerability detection scenarios in practice. For example, developers routinely engage with program analysis to detect vulnerabilities that span multiple functions within repositories. In addition, the widely-used benchmark datasets generally contain only intra-procedural vulnerabilities, leaving the assessment of inter-procedural vulnerability detection capabilities unexplored.\nTo mitigate the issues, we propose a repository-level evaluation system, named \textbf{VulEval}, aiming at evaluating the detection performance of inter- and intra-procedural vulnerabilities simultaneously. Specifically, VulEval consists of three interconnected evaluation tasks: \textbf{(1) Function-Level Vulnerability Detection}, aiming at detecting intra-procedural vulnerability given a code snippet; \textbf{(2) Vulnerability-Related Dependency Prediction}, aiming at retrieving the most relevant dependencies from call graphs for providing developers with explanations about the vulnerabilities; and \textbf{(3) Repository-Level Vulnerability Detection}, aiming at detecting inter-procedural vulnerabilities by combining with the dependencies identified in the second task. VulEval also consists of a large-scale dataset, with a total of 4,196 CVE entries, 232,239 functions, and corresponding 4,699 repository-level source code in C/C++ programming languages. Our analysis highlights the current progress and future directions for software vulnerability detection.',
        image: 'paper_image/vuleval.png',
        links: [
            { text: 'PDF', url: 'https://arxiv.org/pdf/2404.15596' }
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
    // 可以在这里添加更多论文的详情
};

// 打开论文详情模态框
function openPaperModal(paperId) {
    const paper = paperDetails[paperId];
    if (!paper) return;
    
    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = `
        <img src="${paper.image}" alt="${paper.title}" class="modal-image">
        <h2 style="color: var(--primary-color); margin-bottom: 15px;">${paper.title}</h2>
        <p style="font-style: italic; color: #666; margin-bottom: 10px;"><strong>Authors:</strong> ${paper.authors}</p>
        <p style="font-weight: 500; color: #555; margin-bottom: 20px;"><strong>Venue:</strong> ${paper.venue}</p>
        <h3 style="color: var(--primary-color); margin-bottom: 10px;">Abstract</h3>
        <p style="line-height: 1.6; margin-bottom: 20px;">${paper.abstract}</p>
        <div style="display: flex; gap: 10px;">
            ${paper.links.map(link => `<a href="${link.url}" class="btn btn-small" target="_blank">${link.text}</a>`).join('')}
        </div>
    `;
    
    document.getElementById('paperModal').style.display = 'block';
    document.body.style.overflow = 'hidden'; // 防止背景滚动
}

// 关闭论文详情模态框
function closePaperModal() {
    document.getElementById('paperModal').style.display = 'none';
    document.body.style.overflow = 'auto'; // 恢复滚动
}

// 点击模态框外部关闭
window.onclick = function(event) {
    const modal = document.getElementById('paperModal');
    if (event.target === modal) {
        closePaperModal();
    }
}

// ===== 访问统计功能 =====

// 访问统计数据存储
const visitStats = {
    totalVisits: 0,
    todayVisits: 0,
    locations: {},
    currentLocation: '获取中...',
    lastVisitDate: null
};

// 全球访问统计配置 - 使用免费的访问统计服务
const GLOBAL_STATS_CONFIG = {
    // 使用 visitorbadge.io 作为主要服务
    services: {
        primary: 'https://visitor-badge-reloaded.herokuapp.com/badge',
        fallback: 'https://api.countapi.xyz'
    },
    siteId: 'kinesiatrics-homepage', // 网站唯一标识
    fallbackToLocal: true
};

// 初始化访问统计
function initVisitStats() {
    console.log('🚀 初始化全球访问统计系统...');
    
    // 获取用户位置信息
    getUserLocation();
    
    // 使用真正的全球统计服务
    initGlobalVisitStats();
}

// 初始化全球访问统计时也要加载地区数据
async function initGlobalVisitStats() {
    console.log('📊 连接全球访问统计服务...');
    
    try {
        // 记录总访问量
        await recordGlobalVisit();
        
        // 记录今日访问量
        await recordDailyVisit();
        
        // 获取并显示统计数据
        await loadGlobalStats();
        
        // 加载地区统计数据
        await loadGlobalLocationStats();
        
        // 更新显示
        updateStatsDisplay();
        
    } catch (error) {
        console.error('❌ 全球统计服务连接失败，使用本地模式:', error);
        // 降级到本地统计
        initLocalFallbackStats();
    }
}

// 记录全球访问
async function recordGlobalVisit() {
    try {
        // 使用免费的计数API服务
        const response = await fetch(`https://api.countapi.xyz/hit/${GLOBAL_STATS_CONFIG.siteId}/total-visits`, {
            method: 'GET',
            mode: 'cors'
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ 全球访问计数成功:', data.value);
            visitStats.totalVisits = data.value;
            return data.value;
        } else {
            throw new Error('API响应失败');
        }
    } catch (error) {
        console.error('❌ 记录全球访问失败:', error);
        // 尝试备用服务
        return await recordVisitFallback('total');
    }
}

// 记录今日访问
async function recordDailyVisit() {
    try {
        const today = new Date().toISOString().split('T')[0];
        const dailyKey = `daily-${today}`;
        
        const response = await fetch(`https://api.countapi.xyz/hit/${GLOBAL_STATS_CONFIG.siteId}/${dailyKey}`, {
            method: 'GET',
            mode: 'cors'
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ 今日访问计数成功:', data.value);
            visitStats.todayVisits = data.value;
            return data.value;
        } else {
            throw new Error('API响应失败');
        }
    } catch (error) {
        console.error('❌ 记录今日访问失败:', error);
        return await recordVisitFallback('daily');
    }
}

// 备用访问记录方法
async function recordVisitFallback(type) {
    console.log(`🔄 使用备用方法记录${type}访问...`);
    
    // 使用本地存储作为备用
    const key = type === 'total' ? 'global-total-visits' : `daily-visits-${new Date().toISOString().split('T')[0]}`;
    let count = parseInt(localStorage.getItem(key) || '0');
    
    // 检查是否是新的访问（简单的重复访问检测）
    const sessionKey = `session-${type}-recorded`;
    if (!sessionStorage.getItem(sessionKey)) {
        count++;
        localStorage.setItem(key, count.toString());
        sessionStorage.setItem(sessionKey, 'true');
    }
    
    if (type === 'total') {
        visitStats.totalVisits = count;
    } else {
        visitStats.todayVisits = count;
    }
    
    return count;
}

// 加载全球统计数据
async function loadGlobalStats() {
    try {
        // 获取总访问量
        const totalResponse = await fetch(`https://api.countapi.xyz/get/${GLOBAL_STATS_CONFIG.siteId}/total-visits`, {
            method: 'GET',
            mode: 'cors'
        });
        
        if (totalResponse.ok) {
            const totalData = await totalResponse.json();
            visitStats.totalVisits = totalData.value || 0;
        }
        
        // 获取今日访问量
        const today = new Date().toISOString().split('T')[0];
        const dailyResponse = await fetch(`https://api.countapi.xyz/get/${GLOBAL_STATS_CONFIG.siteId}/daily-${today}`, {
            method: 'GET',
            mode: 'cors'
        });
        
        if (dailyResponse.ok) {
            const dailyData = await dailyResponse.json();
            visitStats.todayVisits = dailyData.value || 0;
        }
        
        console.log('📈 全球统计数据加载完成:', {
            total: visitStats.totalVisits,
            today: visitStats.todayVisits
        });
        
    } catch (error) {
        console.error('❌ 加载全球统计数据失败:', error);
        // 使用本地数据作为备用
        loadLocalFallbackStats();
    }
}

// 本地备用统计
function initLocalFallbackStats() {
    console.log('📱 启用本地备用统计模式...');
    
    // 从本地存储加载数据
    loadLocalVisitData();
    
    // 生成唯一的访问ID
    const visitId = generateVisitId();
    
    // 使用本地存储 + 时间戳的方式模拟全球统计
    const globalKey = 'global-visit-stats';
    const todayKey = 'today-visit-stats-' + new Date().toISOString().split('T')[0];
    
    // 获取或初始化全球统计
    let globalStats = JSON.parse(localStorage.getItem(globalKey) || '{"total": 0, "visitors": []}');
    let todayStats = JSON.parse(localStorage.getItem(todayKey) || '{"count": 0, "visitors": []}');
    
    // 检查是否是新访问者（基于浏览器指纹）
    if (!globalStats.visitors.includes(visitId)) {
        globalStats.total++;
        globalStats.visitors.push(visitId);
        localStorage.setItem(globalKey, JSON.stringify(globalStats));
    }
    
    if (!todayStats.visitors.includes(visitId)) {
        todayStats.count++;
        todayStats.visitors.push(visitId);
        localStorage.setItem(todayKey, JSON.stringify(todayStats));
    }
    
    // 更新显示数据
    visitStats.totalVisits = globalStats.total;
    visitStats.todayVisits = todayStats.count;
    
    console.log('✅ 本地统计数据更新完成:', {
        total: visitStats.totalVisits,
        today: visitStats.todayVisits
    });
    
    updateStatsDisplay();
}

// 生成访问者唯一ID（基于浏览器指纹）
function generateVisitId() {
    // 使用浏览器特征生成相对唯一的ID
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Browser fingerprint', 2, 2);
    
    const fingerprint = [
        navigator.userAgent,
        navigator.language,
        screen.width + 'x' + screen.height,
        new Date().getTimezoneOffset(),
        canvas.toDataURL()
    ].join('|');
    
    // 简单哈希
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
        const char = fingerprint.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // 转换为32位整数
    }
    
    return 'visitor_' + Math.abs(hash).toString(36);
}

// 纯本地模式
function useLocalOnlyMode() {
    console.log('📱 使用纯本地统计模式...');
    
    const today = new Date().toDateString();
    
    // 检查是否是今天第一次访问
    if (visitStats.lastVisitDate !== today) {
        visitStats.todayVisits = 1;
        visitStats.lastVisitDate = today;
    } else {
        visitStats.todayVisits++;
    }
    
    // 总访问量增加
    visitStats.totalVisits++;
    
    // 保存到本地存储
    saveLocalVisitData();
    updateStatsDisplay();
}

// 更新地区访问统计（全球版本）
async function updateLocationVisitCount(location) {
    if (!location) return;
    
    console.log('🌏 更新地区统计 (全球模式):', location);
    
    try {
        // 使用全球统计API记录地区访问
        const locationKey = `location-${location.replace(/\s+/g, '-').toLowerCase()}`;
        const response = await fetch(`https://api.countapi.xyz/hit/${GLOBAL_STATS_CONFIG.siteId}/${locationKey}`, {
            method: 'GET',
            mode: 'cors'
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log(`✅ 地区 ${location} 访问计数成功:`, data.value);
            visitStats.locations[location] = data.value;
        } else {
            throw new Error('地区统计API响应失败');
        }
    } catch (error) {
        console.error('❌ 记录地区访问失败，使用本地模式:', error);
        // 降级到本地统计
        updateLocationVisitCountLocal(location);
    }
    
    // 保存已知地区
    saveKnownLocation(location);
    
    // 更新显示
    updateLocationList();
}

// 本地地区统计备用方法
function updateLocationVisitCountLocal(location) {
    console.log('📱 使用本地地区统计:', location);
    
    // 使用本地存储统计地区访问
    visitStats.locations[location] = (visitStats.locations[location] || 0) + 1;
    
    // 保存到本地存储
    saveLocalVisitData();
}

// 加载全球地区统计数据
async function loadGlobalLocationStats() {
    try {
        const knownLocations = getKnownLocations();
        console.log('📍 加载已知地区的全球统计:', knownLocations);
        
        for (const location of knownLocations) {
            const locationKey = `location-${location.replace(/\s+/g, '-').toLowerCase()}`;
            
            try {
                const response = await fetch(`https://api.countapi.xyz/get/${GLOBAL_STATS_CONFIG.siteId}/${locationKey}`, {
                    method: 'GET',
                    mode: 'cors'
                });
                
                if (response.ok) {
                    const data = await response.json();
                    visitStats.locations[location] = data.value || 0;
                }
            } catch (error) {
                console.error(`❌ 加载地区 ${location} 统计失败:`, error);
                // 保持现有的本地数据
            }
        }
        
        console.log('📈 地区统计数据加载完成:', visitStats.locations);
        updateLocationList();
        
    } catch (error) {
        console.error('❌ 加载全球地区统计失败:', error);
        // 使用本地数据
        loadLocalLocationData();
    }
}

// 获取已知地区列表
function getKnownLocations() {
    const saved = localStorage.getItem('knownLocations');
    return saved ? JSON.parse(saved) : [];
}

// 保存已知地区
function saveKnownLocation(location) {
    const known = getKnownLocations();
    if (!known.includes(location)) {
        known.push(location);
        localStorage.setItem('knownLocations', JSON.stringify(known));
    }
}

// 从本地存储加载访问数据
function loadLocalVisitData() {
    const savedData = localStorage.getItem('visitStatsData');
    if (savedData) {
        const data = JSON.parse(savedData);
        visitStats.totalVisits = data.totalVisits || 0;
        visitStats.todayVisits = data.todayVisits || 0;
        visitStats.locations = data.locations || {};
        visitStats.lastVisitDate = data.lastVisitDate;
    }
}

// 加载本地地区数据
function loadLocalLocationData() {
    const savedData = localStorage.getItem('locationStatsData');
    if (savedData) {
        visitStats.locations = JSON.parse(savedData);
        updateLocationList();
    }
}

// 保存本地访问数据
function saveLocalVisitData() {
    localStorage.setItem('visitStatsData', JSON.stringify(visitStats));
}

// 保存本地地区数据
function saveLocalLocationData() {
    localStorage.setItem('locationStatsData', JSON.stringify(visitStats.locations));
}

// 获取用户位置信息
function getUserLocation() {
    // 使用免费的IP地理位置API
    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
            if (data.city && data.country_name) {
                const location = `${data.city}, ${data.country_name}`;
                visitStats.currentLocation = location;
                
                // 保存已知地区
                saveKnownLocation(location);
                
                // 更新地区访问统计（使用全球API）
                updateLocationVisitCount(location);
                
                // 更新显示
                updateStatsDisplay();
            }
        })
        .catch(error => {
            console.log('获取位置信息失败:', error);
            visitStats.currentLocation = '未知位置';
            updateStatsDisplay();
        });
}

// 更新统计显示
function updateStatsDisplay() {
    // 更新总访问量
    const totalElement = document.getElementById('totalVisits');
    if (totalElement) {
        totalElement.textContent = visitStats.totalVisits.toLocaleString();
    }
    
    // 更新今日访问
    const todayElement = document.getElementById('todayVisits');
    if (todayElement) {
        todayElement.textContent = visitStats.todayVisits.toLocaleString();
    }
    
    // 更新当前位置
    const locationElement = document.getElementById('currentLocation');
    if (locationElement) {
        locationElement.textContent = visitStats.currentLocation;
    }
    
    // 更新访问地区列表
    updateLocationList();
}

// 更新地区列表显示
function updateLocationList() {
    const locationListElement = document.getElementById('locationList');
    if (!locationListElement) return;
    
    // 按访问次数排序
    const sortedLocations = Object.entries(visitStats.locations)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5); // 只显示前5个地区
    
    if (sortedLocations.length === 0) {
        locationListElement.innerHTML = '<div class="loading">暂无数据</div>';
        return;
    }
    
    const locationHTML = sortedLocations.map(([location, count]) => `
        <div class="location-item">
            <span class="location-name">${location}</span>
            <span class="location-count">${count}</span>
        </div>
    `).join('');
    
    locationListElement.innerHTML = locationHTML;
}

// 切换访问统计面板显示
function toggleVisitStats() {
    const panel = document.getElementById('visitStatsPanel');
    if (panel) {
        panel.classList.toggle('active');
    }
}

// 检查是否为管理员（简单的密码验证）
function isAdmin() {
    const adminPassword = localStorage.getItem('adminPassword');
    return adminPassword === 'admin123'; // 简单的密码验证
}

// 管理员登录
function adminLogin() {
    const password = prompt('请输入管理员密码:');
    if (password === 'admin123') {
        localStorage.setItem('adminPassword', password);
        alert('管理员登录成功！');
        updateStatsVisibility();
        return true;
    } else if (password !== null) {
        alert('密码错误！');
    }
    return false;
}

// 管理员登出
function adminLogout() {
    localStorage.removeItem('adminPassword');
    updateStatsVisibility();
    alert('已退出管理员模式');
}

// 更新统计组件的可见性
function updateStatsVisibility() {
    const statsContainer = document.getElementById('visitStats');
    if (!statsContainer) return;
    
    if (isAdmin()) {
        statsContainer.style.display = 'block';
    } else {
        statsContainer.style.display = 'none';
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 延迟初始化访问统计，避免影响页面加载速度
    setTimeout(() => {
        initVisitStats();
        updateStatsVisibility();
    }, 1000);
    
    // 添加管理员快捷键 (多种兼容方式)
    document.addEventListener('keydown', function(e) {
        // 方式1: Ctrl+Shift+A
        if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.keyCode === 65)) {
            e.preventDefault();
            if (isAdmin()) {
                adminLogout();
            } else {
                adminLogin();
            }
        }
        // 方式2: Ctrl+Alt+S (备用快捷键)
        else if (e.ctrlKey && e.altKey && (e.key === 'S' || e.keyCode === 83)) {
            e.preventDefault();
            if (isAdmin()) {
                adminLogout();
            } else {
                adminLogin();
            }
        }
    });
    
    // 添加隐藏的管理员入口 - 连续点击页脚5次
    let footerClickCount = 0;
    let footerClickTimer = null;
    const footer = document.querySelector('footer');
    if (footer) {
        footer.addEventListener('click', function() {
            footerClickCount++;
            
            // 清除之前的计时器
            if (footerClickTimer) {
                clearTimeout(footerClickTimer);
            }
            
            // 如果5秒内点击5次，触发管理员登录
            if (footerClickCount >= 5) {
                footerClickCount = 0;
                if (isAdmin()) {
                    adminLogout();
                } else {
                    adminLogin();
                }
            } else {
                // 5秒后重置计数
                footerClickTimer = setTimeout(() => {
                    footerClickCount = 0;
                }, 5000);
            }
        });
    }
});