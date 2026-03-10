/* ============================================================
   Ahmed Elashry — Portfolio  |  VS Code Theme Script
   Vanilla JS  |  No frameworks
   ============================================================ */

(function () {
    'use strict';

    // ─── Configuration ───────────────────────────────────────
    const TAB_MAP = [
        { tab: 'README.md',        section: 'readme',   icon: 'md',  folder: null },
        { tab: 'about.tsx',        section: 'about',    icon: 'tsx', folder: 'src' },
        { tab: 'stack.json',       section: 'stack',    icon: 'json',folder: 'src' },
        { tab: 'projects.ts',      section: 'projects', icon: 'ts',  folder: 'src' },
        { tab: 'certifications.md',section: 'certs',    icon: 'md',  folder: 'docs' },
        { tab: '.env',             section: 'contact',  icon: 'env', folder: null }
    ];

    const TYPING_TEXTS = [
        'Senior Flutter Developer',
        'Full-Stack Engineer',
        'IT Infrastructure Specialist',
        '38+ Apps in Production',
        '100K+ Active Users'
    ];

    const LOADER_LINES = [
        'Starting VS Code...',
        'Loading extensions...',
        'Opening workspace: portfolio/',
        'Ready.'
    ];

    // ─── Utility helpers ─────────────────────────────────────
    function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
    function qsa(sel, ctx) { return (ctx || document).querySelectorAll(sel); }
    function el(tag, attrs, children) {
        const e = document.createElement(tag);
        if (attrs) Object.entries(attrs).forEach(([k, v]) => {
            if (k === 'class') e.className = v;
            else if (k === 'text') e.textContent = v;
            else if (k === 'html') e.innerHTML = v;
            else if (k.startsWith('data-')) e.setAttribute(k, v);
            else e[k] = v;
        });
        if (children) children.forEach(c => { if (c) e.appendChild(c); });
        return e;
    }

    // ═══════════════════════════════════════════════════════════
    //  1.  VS CODE LOADER / SPLASH
    // ═══════════════════════════════════════════════════════════
    function initLoader() {
        const loader = qs('#loader');
        if (!loader) return;

        let idx = 0;
        function showLine() {
            if (idx < LOADER_LINES.length) {
                const p = qs('#loader-line' + (idx + 1));
                if (p) {
                    p.textContent = LOADER_LINES[idx];
                    p.classList.add('show');
                }
                idx++;
                setTimeout(showLine, 500);
            } else {
                setTimeout(() => {
                    loader.classList.add('hide');
                    // After fade-out, start typing effect
                    setTimeout(startTyping, 500);
                }, 600);
            }
        }
        setTimeout(showLine, 300);
    }

    // ═══════════════════════════════════════════════════════════
    //  2.  INJECT VS CODE UI SHELL
    // ═══════════════════════════════════════════════════════════
    //  We wrap the existing page content inside VS Code chrome:
    //  activity-bar | sidebar | editor (tabs + breadcrumb + content + terminal)
    //  + status bar at bottom

    let sidebarEl, tabsBar, breadcrumbEl, editorContent, terminalPanel, statusFile, statusLine, statusBranch;
    let activeTabName = TAB_MAP[0].tab;

    function buildVSCodeShell() {
        const body = document.body;

        // Collect existing children (skip loader, lightbox, scanline, script)
        const skipIds = ['loader', 'lightbox'];
        const skipClasses = ['scanline'];
        const existingNodes = [];
        Array.from(body.children).forEach(node => {
            if (node.tagName === 'SCRIPT') return;
            if (node.id && skipIds.includes(node.id)) return;
            if (skipClasses.some(c => node.classList && node.classList.contains(c))) return;
            existingNodes.push(node);
        });

        // --- Title bar ---
        const titleBar = el('div', { class: 'vsc-titlebar' }, [
            el('div', { class: 'vsc-titlebar-left' }, [
                el('span', { class: 'vsc-titlebar-dots' }, [
                    el('span', { class: 'dot red' }),
                    el('span', { class: 'dot yellow' }),
                    el('span', { class: 'dot green' })
                ])
            ]),
            el('div', { class: 'vsc-titlebar-center', text: 'Ahmed Elashry \u2014 portfolio \u2014 VS Code' }),
            el('div', { class: 'vsc-titlebar-right' })
        ]);

        // --- Activity bar ---
        const activityBar = el('div', { class: 'vsc-activity-bar' }, [
            buildActivityIcon('explorer', '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 0h-9L7 1.5V6H2.5L1 7.5v13.7l.7.8h12.1l.7-.7V17H20l.5-.5V4.7L17.5 0zm0 2.12l2.38 2.38H17.5V2.12zM14 20.5H2V8h5v8.5l.5.5h6.5v3.5zm5.5-4H8V2h8v4.5l.5.5H20l-.5 0v10z"/></svg>', true),
            buildActivityIcon('search', '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.25 0a8.25 8.25 0 0 0-6.18 13.72L1 21.79l1.42 1.42 8.07-8.07A8.25 8.25 0 1 0 15.25.01V0zm0 14.5a6.25 6.25 0 1 1 0-12.5 6.25 6.25 0 0 1 0 12.5z"/></svg>'),
            buildActivityIcon('git', '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.007 8.222A3.738 3.738 0 0 0 15.045 5.2a3.737 3.737 0 0 0 1.156 6.583 2.988 2.988 0 0 1-2.668 1.67h-2.99a4.456 4.456 0 0 0-2.989 1.165V7.559a3.738 3.738 0 1 0-1.494 0v8.886a3.738 3.738 0 1 0 1.553.044 2.993 2.993 0 0 1 2.932-2.482h2.989a4.46 4.46 0 0 0 4.238-3.065 3.738 3.738 0 0 0 3.235-2.72zM7.56 2.25a2.244 2.244 0 1 1 0 4.488 2.244 2.244 0 0 1 0-4.488zm0 19.5a2.244 2.244 0 1 1 0-4.488 2.244 2.244 0 0 1 0 4.488zm9.735-9.75a2.244 2.244 0 1 1 0-4.488 2.244 2.244 0 0 1 0 4.488z"/></svg>'),
            buildActivityIcon('extensions', '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 1.5L15 0h7.5L24 1.5V9l-1.5 1.5H15L13.5 9V1.5zm1.5 0V9h7.5V1.5H15zM0 15l1.5-1.5H9L10.5 15v7.5L9 24H1.5L0 22.5V15zm1.5 0v7.5H9V15H1.5zm0-13.5L0 3v7.5L1.5 12H9l1.5-1.5V3L9 1.5H1.5zm0 1.5H9v7.5H1.5V3zm14.652 7.752l.848-.848 5.296 5.296-.848.848-5.296-5.296z"/></svg>')
        ]);

        // --- Sidebar ---
        sidebarEl = el('div', { class: 'vsc-sidebar open' });
        const sidebarTitle = el('div', { class: 'vsc-sidebar-title', text: 'EXPLORER' });
        const sidebarContent = el('div', { class: 'vsc-sidebar-content' });
        buildFileTree(sidebarContent);
        sidebarEl.appendChild(sidebarTitle);
        sidebarEl.appendChild(sidebarContent);

        // --- Resize handle ---
        const resizeHandle = el('div', { class: 'vsc-resize-handle' });

        // --- Tabs bar ---
        tabsBar = el('div', { class: 'vsc-tabs-bar' });
        TAB_MAP.forEach(t => {
            const tab = el('div', { class: 'vsc-tab', 'data-tab': t.tab, 'data-section': t.section }, [
                el('span', { class: 'vsc-tab-icon ' + t.icon }),
                el('span', { class: 'vsc-tab-name', text: t.tab }),
                el('span', { class: 'vsc-tab-close', html: '&times;' })
            ]);
            tabsBar.appendChild(tab);
        });

        // --- Breadcrumb ---
        breadcrumbEl = el('div', { class: 'vsc-breadcrumb' });
        updateBreadcrumb(TAB_MAP[0]);

        // --- Editor area (wraps existing content) ---
        editorContent = el('div', { class: 'vsc-editor-content' });

        // Add line-number gutters to each section
        existingNodes.forEach(node => {
            // Hero gets treated as readme section
            if (node.id === 'hero' || (node.classList && node.classList.contains('hero'))) {
                node.id = node.id || 'hero';
                if (!node.dataset.file) node.dataset.file = 'README.md';
            }
            const sectionId = node.id;
            const mapping = TAB_MAP.find(m => m.section === sectionId);
            if (mapping) {
                node.dataset.file = mapping.tab;
            }
            // Wrap in a line-numbered container
            const wrapper = el('div', { class: 'vsc-line-section', 'data-section': sectionId || '' });
            const gutter = el('div', { class: 'vsc-line-gutter' });
            const lineCount = Math.floor(Math.random() * 40) + 20;
            for (let i = 1; i <= lineCount; i++) {
                gutter.appendChild(el('span', { class: 'vsc-line-num', text: String(i) }));
            }
            wrapper.appendChild(gutter);
            const content = el('div', { class: 'vsc-line-content' });
            content.appendChild(node);
            wrapper.appendChild(content);
            editorContent.appendChild(wrapper);
        });

        // --- Terminal panel ---
        terminalPanel = buildTerminalPanel();

        // --- Editor column ---
        const editorCol = el('div', { class: 'vsc-editor-col' }, [
            tabsBar,
            breadcrumbEl,
            editorContent,
            terminalPanel
        ]);

        // --- Main layout ---
        const mainLayout = el('div', { class: 'vsc-main' }, [
            activityBar,
            sidebarEl,
            resizeHandle,
            editorCol
        ]);

        // --- Status bar ---
        const statusBar = buildStatusBar();

        // --- App wrapper ---
        const app = el('div', { class: 'vsc-app' }, [
            titleBar,
            mainLayout,
            statusBar
        ]);

        // Remove existing nodes from body, insert VS Code shell
        existingNodes.forEach(n => {
            if (n.parentNode === body) {
                // Already moved into editorContent
            }
        });
        // Clear body of those nodes and insert app
        const keep = [];
        Array.from(body.children).forEach(child => {
            if (child.tagName === 'SCRIPT') keep.push(child);
            if (child.id === 'loader' || child.id === 'lightbox') keep.push(child);
            if (child.classList && child.classList.contains('scanline')) keep.push(child);
        });
        body.innerHTML = '';
        keep.forEach(k => body.appendChild(k));
        body.appendChild(app);

        // Bring lightbox to top
        const lbEl = qs('#lightbox');
        if (lbEl) body.appendChild(lbEl);

        initSidebarResize(resizeHandle);
    }

    function buildActivityIcon(name, svgHtml, active) {
        const icon = el('div', {
            class: 'vsc-activity-icon' + (active ? ' active' : ''),
            'data-action': name,
            html: svgHtml
        });
        return icon;
    }

    function buildFileTree(container) {
        const tree = el('div', { class: 'vsc-file-tree' });

        // portfolio/ root
        const rootLabel = el('div', { class: 'vsc-tree-label root open', html: '<span class="vsc-tree-arrow">&#9662;</span> <strong>portfolio</strong>' });
        tree.appendChild(rootLabel);

        const rootChildren = el('div', { class: 'vsc-tree-children' });

        // README.md (root level)
        rootChildren.appendChild(buildFileItem('README.md', 'md', 'readme'));

        // src/ folder
        const srcFolder = buildFolder('src', [
            buildFileItem('about.tsx', 'tsx', 'about'),
            buildFileItem('stack.json', 'json', 'stack'),
            buildFileItem('projects.ts', 'ts', 'projects')
        ]);
        rootChildren.appendChild(srcFolder);

        // docs/ folder
        const docsFolder = buildFolder('docs', [
            buildFileItem('certifications.md', 'md', 'certs')
        ]);
        rootChildren.appendChild(docsFolder);

        // .env (root level)
        rootChildren.appendChild(buildFileItem('.env', 'env', 'contact'));

        tree.appendChild(rootChildren);
        container.appendChild(tree);
    }

    function buildFolder(name, children) {
        const folder = el('div', { class: 'vsc-tree-folder open' });
        const label = el('div', {
            class: 'vsc-tree-label folder',
            html: '<span class="vsc-tree-arrow">&#9662;</span> <span class="vsc-folder-icon"></span> ' + name
        });
        const childrenWrap = el('div', { class: 'vsc-tree-children' });
        children.forEach(c => childrenWrap.appendChild(c));
        folder.appendChild(label);
        folder.appendChild(childrenWrap);

        label.addEventListener('click', () => {
            folder.classList.toggle('open');
            const arrow = qs('.vsc-tree-arrow', label);
            if (arrow) arrow.innerHTML = folder.classList.contains('open') ? '&#9662;' : '&#9656;';
        });

        return folder;
    }

    function buildFileItem(name, ext, sectionId) {
        const item = el('div', {
            class: 'vsc-tree-file',
            'data-section': sectionId,
            'data-tab': name
        }, [
            el('span', { class: 'vsc-file-icon ' + ext }),
            el('span', { text: name })
        ]);

        item.addEventListener('click', () => {
            activateTab(name);
            scrollToSection(sectionId);
        });

        return item;
    }

    function buildTerminalPanel() {
        const panel = el('div', { class: 'vsc-terminal-panel' });

        // Header with tabs
        const header = el('div', { class: 'vsc-terminal-header' }, [
            el('div', { class: 'vsc-terminal-tabs' }, [
                el('span', { class: 'vsc-terminal-tab active', text: 'TERMINAL' }),
                el('span', { class: 'vsc-terminal-tab', text: 'PROBLEMS' }),
                el('span', { class: 'vsc-terminal-tab', text: 'OUTPUT' })
            ]),
            el('div', { class: 'vsc-terminal-actions' }, [
                el('span', { class: 'vsc-terminal-toggle', html: '&#9660;' })
            ])
        ]);

        // Body
        const body = el('div', { class: 'vsc-terminal-body' }, [
            el('div', { class: 'vsc-terminal-line' }, [
                el('span', { class: 'vsc-terminal-prompt', text: 'ahmed@portfolio:~$' }),
                el('span', { class: 'vsc-terminal-cursor', id: 'termTypingText' }),
                el('span', { class: 'vsc-terminal-blink', text: '\u2588' })
            ])
        ]);

        panel.appendChild(header);
        panel.appendChild(body);

        return panel;
    }

    function buildStatusBar() {
        const bar = el('div', { class: 'vsc-statusbar' });

        const left = el('div', { class: 'vsc-statusbar-left' }, [
            el('span', { class: 'vsc-status-branch', html: '<span class="vsc-branch-icon"></span> master' }),
            el('span', { class: 'vsc-status-sync', html: '&#x21bb;' })
        ]);
        statusBranch = qs('.vsc-status-branch', left);

        const right = el('div', { class: 'vsc-statusbar-right' }, [
            el('span', { class: 'vsc-status-file', text: 'README.md' }),
            el('span', { class: 'vsc-status-line', text: 'Ln 1, Col 1' }),
            el('span', { class: 'vsc-status-encoding', text: 'UTF-8' }),
            el('span', { class: 'vsc-status-lang', text: 'Markdown' })
        ]);
        statusFile = qs('.vsc-status-file', right);
        statusLine = qs('.vsc-status-line', right);

        bar.appendChild(left);
        bar.appendChild(right);

        return bar;
    }

    // ═══════════════════════════════════════════════════════════
    //  3.  TAB SYSTEM
    // ═══════════════════════════════════════════════════════════
    function initTabs() {
        // Click tab name => scroll to section
        tabsBar.addEventListener('click', (e) => {
            const tab = e.target.closest('.vsc-tab');
            if (!tab) return;

            // Close button
            if (e.target.classList.contains('vsc-tab-close')) {
                e.stopPropagation();
                tab.classList.add('hidden');
                // If this was active, activate next visible tab
                if (tab.classList.contains('active')) {
                    const visible = qsa('.vsc-tab:not(.hidden)', tabsBar);
                    if (visible.length) {
                        const next = visible[0];
                        activateTab(next.dataset.tab);
                        scrollToSection(next.dataset.section);
                    }
                }
                return;
            }

            // Show if hidden
            tab.classList.remove('hidden');
            activateTab(tab.dataset.tab);
            scrollToSection(tab.dataset.section);
        });

        // Set first tab active
        activateTab(TAB_MAP[0].tab);
    }

    function activateTab(tabName) {
        activeTabName = tabName;
        qsa('.vsc-tab', tabsBar).forEach(t => t.classList.toggle('active', t.dataset.tab === tabName));

        // Highlight sidebar file
        qsa('.vsc-tree-file', sidebarEl).forEach(f => f.classList.toggle('active', f.dataset.tab === tabName));

        // Update breadcrumb
        const mapping = TAB_MAP.find(m => m.tab === tabName);
        if (mapping) updateBreadcrumb(mapping);

        // Update status bar
        updateStatusBar(mapping);

        // Highlight line numbers
        updateActiveLineNumbers(mapping);
    }

    function scrollToSection(sectionId) {
        // The hero section doubles as "readme"
        let target;
        if (sectionId === 'readme') {
            target = qs('#hero') || qs('[data-file="README.md"]');
        } else {
            target = qs('#' + sectionId);
        }
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // ═══════════════════════════════════════════════════════════
    //  4.  INTERSECTION OBSERVER — ACTIVE TAB ON SCROLL
    // ═══════════════════════════════════════════════════════════
    function initScrollTabSync() {
        const sectionEls = [];
        TAB_MAP.forEach(m => {
            let target;
            if (m.section === 'readme') {
                target = qs('#hero');
            } else {
                target = qs('#' + m.section);
            }
            if (target) sectionEls.push({ el: target, mapping: m });
        });

        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const info = sectionEls.find(s => s.el === entry.target);
                    if (info) {
                        activateTab(info.mapping.tab);
                    }
                }
            });
        }, { threshold: 0.15, rootMargin: '-80px 0px -40% 0px' });

        sectionEls.forEach(s => obs.observe(s.el));
    }

    // ═══════════════════════════════════════════════════════════
    //  5.  BREADCRUMB
    // ═══════════════════════════════════════════════════════════
    function updateBreadcrumb(mapping) {
        if (!breadcrumbEl) return;
        let path = 'portfolio';
        if (mapping.folder) path += ' > ' + mapping.folder;
        path += ' > ' + mapping.tab;
        breadcrumbEl.textContent = path;
    }

    // ═══════════════════════════════════════════════════════════
    //  6.  STATUS BAR
    // ═══════════════════════════════════════════════════════════
    function updateStatusBar(mapping) {
        if (!mapping) return;
        if (statusFile) statusFile.textContent = mapping.tab;
        if (statusLine) {
            const ln = Math.floor(Math.random() * 50) + 1;
            statusLine.textContent = 'Ln ' + ln + ', Col 1';
        }

        // Update language display
        const langMap = { md: 'Markdown', tsx: 'TypeScript React', json: 'JSON', ts: 'TypeScript', env: 'Environment' };
        const langEl = qs('.vsc-status-lang');
        if (langEl && mapping.icon) langEl.textContent = langMap[mapping.icon] || mapping.icon;
    }

    // ═══════════════════════════════════════════════════════════
    //  7.  ACTIVE LINE NUMBERS
    // ═══════════════════════════════════════════════════════════
    function updateActiveLineNumbers(mapping) {
        if (!mapping) return;
        qsa('.vsc-line-section').forEach(sec => {
            const isActive = sec.dataset.section === mapping.section ||
                             (mapping.section === 'readme' && (sec.dataset.section === 'hero' || sec.dataset.section === 'readme'));
            sec.classList.toggle('active-section', isActive);
        });
    }

    // ═══════════════════════════════════════════════════════════
    //  8.  SIDEBAR TOGGLE
    // ═══════════════════════════════════════════════════════════
    function initSidebar() {
        const explorerBtn = qs('[data-action="explorer"]');
        if (explorerBtn) {
            explorerBtn.addEventListener('click', () => {
                sidebarEl.classList.toggle('open');
                explorerBtn.classList.toggle('active');
            });
        }
    }

    // ═══════════════════════════════════════════════════════════
    //  9.  SIDEBAR RESIZE
    // ═══════════════════════════════════════════════════════════
    function initSidebarResize(handle) {
        let isResizing = false;
        let startX, startWidth;

        handle.addEventListener('mousedown', (e) => {
            isResizing = true;
            startX = e.clientX;
            startWidth = sidebarEl.offsetWidth;
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;
            const diff = e.clientX - startX;
            const newWidth = Math.max(180, Math.min(500, startWidth + diff));
            sidebarEl.style.width = newWidth + 'px';
        });

        document.addEventListener('mouseup', () => {
            if (isResizing) {
                isResizing = false;
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
            }
        });
    }

    // ═══════════════════════════════════════════════════════════
    //  10. TERMINAL PANEL TOGGLE
    // ═══════════════════════════════════════════════════════════
    function initTerminal() {
        if (!terminalPanel) return;
        const header = qs('.vsc-terminal-header', terminalPanel);
        const toggleBtn = qs('.vsc-terminal-toggle', terminalPanel);

        if (header) {
            header.addEventListener('click', () => {
                terminalPanel.classList.toggle('collapsed');
                if (toggleBtn) {
                    toggleBtn.innerHTML = terminalPanel.classList.contains('collapsed') ? '&#9650;' : '&#9660;';
                }
            });
        }
    }

    // ═══════════════════════════════════════════════════════════
    //  11. TYPING EFFECT — TERMINAL
    // ═══════════════════════════════════════════════════════════
    let typeTxtIdx = 0, typeCharIdx = 0, typeDeleting = false;

    function startTyping() {
        terminalType();
    }

    function terminalType() {
        const el = qs('#termTypingText');
        if (!el) return;
        const current = TYPING_TEXTS[typeTxtIdx];
        if (!typeDeleting) {
            el.textContent = current.substring(0, typeCharIdx + 1);
            typeCharIdx++;
            if (typeCharIdx === current.length) {
                typeDeleting = true;
                setTimeout(terminalType, 2000);
                return;
            }
            setTimeout(terminalType, 80);
        } else {
            el.textContent = current.substring(0, typeCharIdx - 1);
            typeCharIdx--;
            if (typeCharIdx === 0) {
                typeDeleting = false;
                typeTxtIdx = (typeTxtIdx + 1) % TYPING_TEXTS.length;
            }
            setTimeout(terminalType, 40);
        }
    }

    // Also do the hero typing effect if the element exists
    function initHeroTyping() {
        const heroEl = qs('#typingText');
        if (!heroEl) return;
        let tIdx = 0, cIdx = 0, del = false;
        function heroType() {
            const cur = TYPING_TEXTS[tIdx];
            if (!del) {
                heroEl.textContent = cur.substring(0, cIdx + 1);
                cIdx++;
                if (cIdx === cur.length) { del = true; setTimeout(heroType, 2000); return; }
                setTimeout(heroType, 80);
            } else {
                heroEl.textContent = cur.substring(0, cIdx - 1);
                cIdx--;
                if (cIdx === 0) { del = false; tIdx = (tIdx + 1) % TYPING_TEXTS.length; }
                setTimeout(heroType, 40);
            }
        }
        setTimeout(heroType, 2500);
    }

    // ═══════════════════════════════════════════════════════════
    //  12. COUNTER ANIMATION
    // ═══════════════════════════════════════════════════════════
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;
        countersAnimated = true;
        qsa('.stat-num').forEach(el => {
            const target = parseInt(el.dataset.count, 10);
            if (isNaN(target)) return;
            const duration = 2000;
            const start = performance.now();
            function update(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.floor(eased * target);
                if (progress < 1) requestAnimationFrame(update);
            }
            requestAnimationFrame(update);
        });
    }

    // ═══════════════════════════════════════════════════════════
    //  13. SCROLL ANIMATIONS  (fade-up)
    // ═══════════════════════════════════════════════════════════
    function initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Trigger counter animation when stats come into view
                    if (entry.target.querySelector('.stat-num') || entry.target.classList.contains('hero-stats')) {
                        animateCounters();
                    }
                }
            });
        }, { threshold: 0.1 });

        qsa('.section, .hero-stats, .project-card, .cert-card, .cert-detail-card, .stack-category').forEach(el => {
            el.classList.add('fade-up');
            observer.observe(el);
        });
    }

    // ═══════════════════════════════════════════════════════════
    //  14. PROJECT FILTER
    // ═══════════════════════════════════════════════════════════
    function initProjectFilter() {
        const filterBtns = qsa('.filter-btn');
        const cards = qsa('.project-card');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.dataset.filter;

                cards.forEach(card => {
                    const cats = card.dataset.category || '';
                    if (filter === 'all' || cats.includes(filter)) {
                        card.style.display = '';
                        requestAnimationFrame(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        });
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => { card.style.display = 'none'; }, 300);
                    }
                });
            });
        });
    }

    // ═══════════════════════════════════════════════════════════
    //  15. LIGHTBOX
    // ═══════════════════════════════════════════════════════════
    let lbImages = [];
    let lbIndex = 0;

    // Make these global so onclick="" attributes in HTML work
    window.openLightbox = function (images, index, title) {
        // Handle string that might come from HTML entities
        if (typeof images === 'string') {
            try { images = JSON.parse(images); } catch (e) { images = [images]; }
        }
        const lightbox = qs('#lightbox');
        const lbImg = qs('#lbImg');
        const lbCaption = qs('#lbCaption');
        const lbCounter = qs('#lbCounter');
        if (!lightbox || !lbImg) return;

        lbImages = images;
        lbIndex = index || 0;
        lbImg.src = lbImages[lbIndex];
        if (lbCaption) lbCaption.textContent = title || '';
        if (lbCounter) lbCounter.textContent = (lbIndex + 1) + ' / ' + lbImages.length;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    };

    window.closeLightbox = function () {
        const lightbox = qs('#lightbox');
        if (lightbox) lightbox.classList.remove('open');
        document.body.style.overflow = '';
    };

    window.navigateLb = function (dir) {
        const lbImg = qs('#lbImg');
        const lbCounter = qs('#lbCounter');
        if (!lbImg || !lbImages.length) return;
        lbIndex = (lbIndex + dir + lbImages.length) % lbImages.length;
        lbImg.src = lbImages[lbIndex];
        if (lbCounter) lbCounter.textContent = (lbIndex + 1) + ' / ' + lbImages.length;
    };

    function initLightbox() {
        const lightbox = qs('#lightbox');
        if (!lightbox) return;

        const lbClose = qs('#lbClose');
        const lbPrev = qs('#lbPrev');
        const lbNext = qs('#lbNext');

        if (lbClose) lbClose.addEventListener('click', closeLightbox);
        if (lbPrev) lbPrev.addEventListener('click', () => navigateLb(-1));
        if (lbNext) lbNext.addEventListener('click', () => navigateLb(1));

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('open')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') navigateLb(-1);
            if (e.key === 'ArrowRight') navigateLb(1);
        });

        // Attach gallery click to project screenshot thumbnails
        qsa('.project-screenshots img').forEach(img => {
            img.addEventListener('click', (e) => {
                e.stopPropagation();
                const card = img.closest('.project-card');
                if (!card) return;
                const gallery = safeParseJSON(card.dataset.gallery);
                const title = card.dataset.title || '';
                const idx = Array.from(qsa('.project-screenshots img', card)).indexOf(img);
                openLightbox(gallery, idx, title);
            });
        });

        // Main project image click
        qsa('.project-card[data-gallery] > .project-img > img, .project-card[data-gallery] .project-img > img:first-child').forEach(img => {
            if (img.closest('.project-screenshots')) return;
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => {
                const card = img.closest('.project-card');
                if (!card) return;
                const gallery = safeParseJSON(card.dataset.gallery);
                const title = card.dataset.title || '';
                openLightbox(gallery, 0, title);
            });
        });
    }

    function safeParseJSON(str) {
        if (!str) return [];
        try { return JSON.parse(str); } catch (e) { return []; }
    }

    // ═══════════════════════════════════════════════════════════
    //  16. MOBILE MENU
    // ═══════════════════════════════════════════════════════════
    function initMobileMenu() {
        // Create a mobile hamburger that opens a file-list dropdown
        const mobileBtn = el('button', { class: 'vsc-mobile-hamburger', id: 'vscMobileBtn' }, [
            el('span'), el('span'), el('span')
        ]);

        const mobileDropdown = el('div', { class: 'vsc-mobile-dropdown', id: 'vscMobileDropdown' });
        TAB_MAP.forEach(m => {
            const item = el('div', {
                class: 'vsc-mobile-item',
                'data-tab': m.tab,
                'data-section': m.section
            }, [
                el('span', { class: 'vsc-file-icon ' + m.icon }),
                el('span', { text: m.tab })
            ]);
            item.addEventListener('click', () => {
                activateTab(m.tab);
                scrollToSection(m.section);
                mobileDropdown.classList.remove('open');
                mobileBtn.classList.remove('open');
            });
            mobileDropdown.appendChild(item);
        });

        // Insert into titlebar on mobile
        const titlebar = qs('.vsc-titlebar');
        if (titlebar) {
            const leftArea = qs('.vsc-titlebar-left', titlebar);
            if (leftArea) {
                leftArea.appendChild(mobileBtn);
            }
            titlebar.appendChild(mobileDropdown);
        }

        mobileBtn.addEventListener('click', () => {
            mobileDropdown.classList.toggle('open');
            mobileBtn.classList.toggle('open');
        });

        // Also handle existing nav toggle if still present
        const navToggle = qs('#navToggle');
        const mobileMenu = qs('#mobileMenu');
        if (navToggle && mobileMenu) {
            navToggle.addEventListener('click', () => mobileMenu.classList.toggle('open'));
            qsa('a', mobileMenu).forEach(a => {
                a.addEventListener('click', () => mobileMenu.classList.remove('open'));
            });
        }
    }

    // ═══════════════════════════════════════════════════════════
    //  17. COMMAND PALETTE  (Ctrl+P)
    // ═══════════════════════════════════════════════════════════
    function initCommandPalette() {
        // Create palette element
        const palette = el('div', { class: 'vsc-command-palette', id: 'vscPalette' });
        const input = el('input', { class: 'vsc-palette-input', type: 'text', placeholder: '> Type a command or file name...' });
        const results = el('div', { class: 'vsc-palette-results' });

        TAB_MAP.forEach(m => {
            const item = el('div', { class: 'vsc-palette-item', 'data-tab': m.tab, 'data-section': m.section }, [
                el('span', { class: 'vsc-file-icon ' + m.icon }),
                el('span', { text: m.tab }),
                el('span', { class: 'vsc-palette-path', text: m.folder ? m.folder + '/' : '' })
            ]);
            item.addEventListener('click', () => {
                activateTab(m.tab);
                scrollToSection(m.section);
                closePalette();
            });
            results.appendChild(item);
        });

        palette.appendChild(input);
        palette.appendChild(results);

        const overlay = el('div', { class: 'vsc-palette-overlay', id: 'vscPaletteOverlay' });
        overlay.addEventListener('click', closePalette);

        document.body.appendChild(overlay);
        document.body.appendChild(palette);

        // Filter
        input.addEventListener('input', () => {
            const q = input.value.toLowerCase();
            qsa('.vsc-palette-item', results).forEach(item => {
                const name = item.dataset.tab.toLowerCase();
                item.style.display = name.includes(q) ? '' : 'none';
            });
        });

        // Keyboard shortcut
        document.addEventListener('keydown', (e) => {
            // Ctrl+P or Cmd+P
            if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
                e.preventDefault();
                openPalette();
            }
            if (e.key === 'Escape' && palette.classList.contains('open')) {
                closePalette();
            }
        });

        function openPalette() {
            palette.classList.add('open');
            overlay.classList.add('open');
            input.value = '';
            input.focus();
            qsa('.vsc-palette-item', results).forEach(item => item.style.display = '');
        }

        function closePalette() {
            palette.classList.remove('open');
            overlay.classList.remove('open');
        }
    }

    // ═══════════════════════════════════════════════════════════
    //  18. NAV SCROLL EFFECT (keep for compatibility)
    // ═══════════════════════════════════════════════════════════
    function initNavScroll() {
        const nav = qs('#nav');
        if (!nav) return;
        window.addEventListener('scroll', () => {
            nav.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // ═══════════════════════════════════════════════════════════
    //  INIT — BOOT SEQUENCE
    // ═══════════════════════════════════════════════════════════
    function init() {
        // Build the VS Code shell first (wraps existing HTML)
        buildVSCodeShell();

        // Then initialize all interactive features
        initTabs();
        initSidebar();
        initTerminal();
        initScrollTabSync();
        initScrollAnimations();
        initProjectFilter();
        initLightbox();
        initMobileMenu();
        initCommandPalette();
        initHeroTyping();
        initNavScroll();
        // Start the loader animation
        initLoader();
    }

    // Boot when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
