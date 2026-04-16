document.addEventListener('DOMContentLoaded', () => {
    // WebP support detection
    const supportsWebP = (() => {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    })();

    // Swap png path -> webp path (handles folder structure)
    function webpSrc(pngPath) {
        if (!supportsWebP) return pngPath;
        return pngPath.replace(/\.png$/i, '.webp').replace('/png/', '/webp/');
    }

    // Upgrade project card background images to WebP
    if (supportsWebP) {
        document.querySelectorAll('.project-card[style*="background-image"]').forEach(card => {
            card.style.backgroundImage = card.style.backgroundImage
                .replace(/\.png/gi, '.webp')
                .replace(/\/png\//gi, '/webp/');
        });
    }

    // Navigation Logic
    const navButtons = document.querySelectorAll('.nav-btn');

    // Track scroll positions per section
    const sectionScrollPositions = {};
    const contentArea = document.querySelector('.content-area');

    // Section switching — instant out, fade in
    function switchSection(targetId) {
        const target = document.getElementById(targetId);
        if (!target) return;

        const currentActive = document.querySelector('.content-section.active');
        if (!currentActive || currentActive === target) {
            if (!currentActive) {
                target.classList.add('active');
                if (contentArea) contentArea.scrollTop = sectionScrollPositions[targetId] || 0;
            }
            return;
        }

        // Save scroll position of current section
        if (contentArea) {
            sectionScrollPositions[currentActive.id] = contentArea.scrollTop;
        }

        // Update URL hash without scrolling
        history.replaceState(null, '', '#' + targetId);

        // Instant removal of old section
        currentActive.classList.remove('active', 'fade-out');

        // Show new section with fade-in
        target.classList.add('active');
        if (contentArea) {
            contentArea.scrollTop = sectionScrollPositions[targetId] || 0;
        }
    }

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            switchSection(button.getAttribute('data-target'));
        });
    });

    // Prevent browser scroll-to-hash from breaking the fixed layout
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // Handle initial hash on page load
    const initialHash = window.location.hash.replace('#', '');
    if (initialHash && document.getElementById(initialHash)) {
        // Instant swap — no crossfade on initial load
        const currentActive = document.querySelector('.content-section.active');
        const hashTarget = document.getElementById(initialHash);
        if (currentActive && hashTarget && currentActive !== hashTarget) {
            currentActive.classList.remove('active');
            hashTarget.classList.add('active');
        }

        navButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-target') === initialHash) btn.classList.add('active');
        });
        const mobileNavBtns = document.querySelectorAll('.mobile-nav-btn');
        mobileNavBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-target') === initialHash) btn.classList.add('active');
        });
        // Reset scroll after browser tries to jump to the hash target
        requestAnimationFrame(() => {
            window.scrollTo(0, 0);
            if (contentArea) contentArea.scrollTop = 0;
        });
    }

    // Mobile Burger Menu Logic
    const burgerBtn = document.getElementById('burgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileNavButtons = document.querySelectorAll('.mobile-nav-btn');

    function openMobileMenu() {
        mobileMenu.classList.add('open');
        mobileMenuOverlay.classList.add('visible');
        burgerBtn.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove('open');
        mobileMenuOverlay.classList.remove('visible');
        burgerBtn.classList.remove('open');
        document.body.style.overflow = '';
    }

    burgerBtn.addEventListener('click', () => {
        if (mobileMenu.classList.contains('open')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    mobileMenuClose.addEventListener('click', closeMobileMenu);

    mobileNavButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state on mobile buttons
            mobileNavButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Sync with desktop nav buttons
            const targetId = btn.getAttribute('data-target');
            navButtons.forEach(b => {
                b.classList.remove('active');
                if (b.getAttribute('data-target') === targetId) b.classList.add('active');
            });

            // Switch section with crossfade
            switchSection(targetId);

            closeMobileMenu();
        });
    });

    // Keep mobile buttons in sync when desktop nav is used
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            mobileNavButtons.forEach(b => {
                b.classList.remove('active');
                if (b.getAttribute('data-target') === targetId) b.classList.add('active');
            });
        });
    });

    // Project Data
    const projectData = {
        fishing: {
            title: "Just a Chill Fishing Game",
            descriptionHtml: `
                <p><strong>My Role:</strong> Art, core gameplay programming for fish collection tasks, game state and progression management, and the full skill tree system handling all upgrades.</p>
                <p>Just a Chill Fishing Game was developed during Global Game Jam 2025 by a cross-discipline team of five students. I contributed to the initial planning, systems design, and gameplay programming, while also helping integrate art and sound under a tight 48-hour deadline.</p>
                <p>The project responded to the jam theme, Bubbles, by turning them into a high-stakes lose condition. Players had to steer around bubbles while reeling in fish, creating tension inside an otherwise calm and relaxing gameplay loop. That balance between comfort and pressure became the core of the experience.</p>
                <p>This project was an important lesson in feature prioritization and scope control. By focusing on the strongest mechanics first, the team kept the final build polished and playable. Although bad weather prevented an in-person showcase, post-jam peer playtesting showed strong engagement, with players regularly staying in the loop for around 15 minutes at a time.</p>
                <h3 class="project-section-title">Skills Gained</h3>
                <ul class="project-skill-list">
                    <li><strong>Mechanical Balance:</strong> Blending a relaxing theme with a tense, rewarding fail state.</li>
                    <li><strong>Rapid Prototyping:</strong> Building and iterating on a functional gameplay loop within 48 hours.</li>
                    <li><strong>Scope Management:</strong> Prioritizing the right features to deliver a polished submission.</li>
                    <li><strong>Cross-Discipline Collaboration:</strong> Working across programming, design, art, and audio integration.</li>
                    <li><strong>Playtest Analysis:</strong> Using peer feedback to evaluate the strength of the gameplay loop.</li>
                    <li><strong>Creative Problem Solving:</strong> Translating an abstract jam theme into a tangible core mechanic.</li>
                </ul>
            `,
            bgImage: "images/projectImages/png/fishing.png",
            media: [
                "images/projectImages/png/fishing.png",
                "images/projectImages/png/fishing1.png",
                "images/projectImages/png/fishing2.png",
                "images/projectImages/png/fishing3.png",
                "images/projectImages/png/fishing4.png"
            ],
            itchUrl: "https://allanowo.itch.io/just-a-chill-fishing-game"
        },
        kyomen: {
            title: "Kyomen",
            descriptionHtml: `
                <p><strong>My Role:</strong> Core design, systems programming (wave manager, floor system, mask controller), dynamic scoring system implementation, and all HUD/UI elements. In the ongoing Tranzfuzer build, I am developing the talent tree, item system, and an improved floor system.</p>
                <p>Kyomen was developed during Global Game Jam 2026 over an intense 48-hour period. I worked within a team of six made up of four designers and two programmers. Without a dedicated artist on the team, we had to be highly resourceful, and I took on a multi-disciplinary role across core design, gameplay programming, and the creation and implementation of the UI and HUD graphics.</p>
                <p>The project placed 2nd out of 25 entries at our local jam site. We were especially proud of the visual polish and mechanical depth we achieved without a traditional art pipeline, relying instead on strong design fundamentals and creative technical solutions to establish a distinctive aesthetic. The response was strong enough that we decided to continue development, and Kyomen is now being refined for entry into the upcoming Tranzfuzer competition.</p>
                <p>This experience reinforced my ability to bridge technical programming and visual communication, making sure the player-facing interface was as intuitive and polished as the underlying systems, which is a central part of my Systems Design work.</p>
                <h3 class="project-section-title">Skills Gained</h3>
                <ul class="project-skill-list">
                    <li><strong>Rapid UI/UX Implementation:</strong> Designing and integrating functional, thematic HUD elements under strict time constraints.</li>
                    <li><strong>Artistic Resourcefulness:</strong> Using technical workarounds to maintain strong visual quality without a dedicated art lead.</li>
                    <li><strong>Competitive Scope Management:</strong> Balancing feature-rich gameplay with the level of polish needed for a podium finish.</li>
                    <li><strong>Advanced Collaboration:</strong> Coordinating within a design-heavy team to maintain mechanical consistency and a unified vision.</li>
                    <li><strong>Product Evolution:</strong> Transitioning a rapid prototype into a more professional project for national competition.</li>
                    <li><strong>Hybrid Role Adaptability:</strong> Moving fluidly between C# systems programming and graphic implementation.</li>
                </ul>
            `,
            bgImage: "images/projectImages/png/kyomen.png",
            media: [
                "images/projectImages/png/kyomen.png",
                "images/projectImages/png/kyomen1.png",
                "images/projectImages/png/kyomen2.png",
                "images/projectImages/png/kyomen3.png",
                "images/projectImages/png/kyomen4.png"
            ],
            itchUrl: "https://ath3rox.itch.io/kyomen"
        },
        polyarena: {
            title: "Poly Arena",
            descriptionHtml: `
                <p><strong>My Role:</strong> Solo project — all design, programming, art, and implementation.</p>
                <p>Poly Arena is a wave-based survival game developed in Unity as a university project. Enemies grow stronger with each wave, testing your endurance and reflexes as you fight to survive increasingly difficult encounters.</p>
                <p>The main focus of the project was exploring AI behaviours and implementing basic Unity systems such as field of view sliders and mouse sensitivity settings. This provided a solid foundation in working with Unity's core toolset and understanding how player-facing options translate into functional in-engine systems.</p>
                <h3 class="project-section-title">Skills Gained</h3>
                <ul class="project-skill-list">
                    <li><strong>AI Behaviour Design:</strong> Implementing enemy wave logic with escalating difficulty and varied attack patterns.</li>
                    <li><strong>Unity Systems Integration:</strong> Building player-facing settings such as FOV sliders and mouse sensitivity controls.</li>
                    <li><strong>Wave-Based Game Loop:</strong> Designing a scalable survival loop that ramps challenge over time.</li>
                    <li><strong>Player Feedback Systems:</strong> Ensuring gameplay options feel responsive and intuitive through testing and iteration.</li>
                </ul>
            `,
            bgImage: "images/projectImages/png/arena.png",
            media: [
                "images/projectImages/png/arena.png",
                "images/projectImages/png/arena1.png",
                "images/projectImages/png/arena2.png",
                "images/projectImages/png/arena3.png",
                "images/projectImages/png/arena4.png"
            ],
            itchUrl: "https://ath3rox.itch.io/poly-arena"
        },
        runordie: {
            title: "Run or Die",
            descriptionHtml: `
                <p><strong>My Role:</strong> Solo project — all design, programming, research, and implementation.</p>
                <p>Run or Die is a research-driven project exploring the inverse relationship between player health and mobility. The core mechanic ties movement speed directly to health, so as the player's health decreases, their movement speed increases. To reinforce that system mechanically, I implemented a pursuing wall of death that forces players to strategically manage damage intake in order to navigate high-speed, high-risk routes.</p>
                <p>The project served as a study in emergent player behavior and implicit tutorialization. Through observational playtesting, I documented a clear shift in player psychology away from the traditional idea that high health equals safety and toward an optimal low-health mastery state. By designing the level to reward low-HP runs with faster completion times, I created a positive feedback loop that prioritizes risk-taking and mechanical mastery over defensive play.</p>
                <h3 class="project-section-title">Skills Gained</h3>
                <ul class="project-skill-list">
                    <li><strong>Mechanic-Driven Level Design:</strong> Creating branching paths that cater to different speed tiers based on current player state.</li>
                    <li><strong>Behavioral Analysis:</strong> Observing and documenting the shift in player mental models when confronted with subverted gameplay tropes.</li>
                    <li><strong>Implicit Tutorial Design:</strong> Teaching complex, non-traditional mechanics through environmental consequences rather than explicit instructions.</li>
                    <li><strong>Systemic Feedback Loops:</strong> Balancing movement scaling so the risk-versus-reward dynamic stayed engaging without becoming frustrating.</li>
                    <li><strong>Rapid Iteration:</strong> Refining the death wall speed and health-decay rates to find the right level of player tension.</li>
                </ul>
            `,
            bgImage: "images/projectImages/png/run.png",
            media: [
                "images/projectImages/png/run.png",
                "images/projectImages/png/run1.png",
                "images/projectImages/png/run2.png",
                "images/projectImages/png/run3.png",
                "images/projectImages/png/run4.png"
            ],
            itchUrl: "https://ath3rox.itch.io/run-or-die"
        },
        stronghand: {
            title: "Strong Hand",
            descriptionHtml: `
                <p><strong>My Role:</strong> Created the rule book with the live card system, built the dialogue system, produced a large portion of the UI and vector art, and developed the main menu, settings menu, and opening cinematic.</p>
                <p>Strong Hand was a two-term collaborative project developed during my third year in response to a brief from an external industry client. I served as the primary client liaison, managing monthly progress meetings and stakeholder communication to keep development aligned with their vision. That role required a high level of professional responsibility, acting as the bridge between client feedback and the team's execution.</p>
                <p>During pre-production, I worked within the design team to architect the world-building, core rules, and systems requirements that shaped the project. This groundwork fed directly into the vertical slice produced afterward. In the second term, as the project moved into full production, I shifted into a hybrid Design and Programming role, taking on technical tasks to support development and help push the final product to a higher level of polish.</p>
                <p>Working in a multidisciplinary team of 11 taught me how to maintain a strong team dynamic and adapt to the shifting needs of a long-form production cycle, especially while balancing external feedback with internal production goals.</p>
                <h3 class="project-section-title">Skills Gained</h3>
                <ul class="project-skill-list">
                    <li><strong>Stakeholder Management:</strong> Acting as the lead point of contact for an external client and managing professional expectations.</li>
                    <li><strong>Systems Architecture:</strong> Designing comprehensive game rules and technical requirements during pre-production.</li>
                    <li><strong>Production Versatility:</strong> Pivoting from high-level design to technical programming tasks to meet production milestones.</li>
                    <li><strong>Large-Scale Collaboration:</strong> Coordinating within a team of 11 students across design, art, and programming disciplines.</li>
                    <li><strong>Agile Adaptability:</strong> Responding to industry feedback and iterating on systems to meet client specifications.</li>
                    <li><strong>Professional Communication:</strong> Translating complex technical updates into clear, concise progress reports for stakeholders.</li>
                </ul>
            `,
            bgImage: "images/projectImages/png/strong.png",
            media: [
                "images/projectImages/png/strong.png",
                "images/projectImages/png/strong1.png",
                "images/projectImages/png/strong2.png",
                "images/projectImages/png/strong3.png",
                "images/projectImages/png/strong4.png"
            ],
            itchUrl: "https://gcugames.itch.io/strong-hand"
        },
        wolvenwood: {
            title: "Wolvenwood",
            descriptionHtml: `
                <p><strong>My Role:</strong> Object/item system (roguelike pickups), player movement and attacking, map design, enemy navigation, and all status effect systems.</p>
                <p>In Wolvenwood, you descend into a dark, mysterious forest filled with secrets, dangers, and powerful foes. Along the way, you encounter strange and fascinating characters, each offering unique upgrades to strengthen your abilities. Master your weapons, grow stronger with every discovery, and prepare to face the mighty end foe that lurks at the heart of the woods. Every run is a new chance to carve your legend within the cursed trees of Wolvenwood.</p>
                <p>Wolvenwood was completed in one term during second year as a group project. It was my first experience working in a larger team and iterating through the full game development cycle to deliver a final product within a set timeframe.</p>
                <h3 class="project-section-title">Skills Gained</h3>
                <ul class="project-skill-list">
                    <li><strong>Team-Based Development:</strong> First experience collaborating in a larger group across design, art, and programming.</li>
                    <li><strong>Scoped Delivery:</strong> Planning and executing a complete game within a single university term.</li>
                    <li><strong>Iterative Design:</strong> Refining gameplay mechanics through successive development cycles and playtesting.</li>
                    <li><strong>Combat & Progression Systems:</strong> Designing upgrade paths and weapon mastery that reward continued play.</li>
                </ul>
            `,
            bgImage: "images/projectImages/png/wolven.png",
            media: [
                "images/projectImages/png/wolven.png",
                "images/projectImages/png/wolven1.png",
                "images/projectImages/png/wolven2.png",
                "images/projectImages/png/wolven3.png",
                "images/projectImages/png/wolven4.png"
            ],
            itchUrl: "https://ath3rox.itch.io/wolvenwood"
        }
    };

    // Overlay Logic
    const overlay = document.getElementById('projectOverlay');
    const overlayBg = document.getElementById('overlayBg');
    const overlayTitle = document.getElementById('overlayTitle');
    const overlayDesc = document.getElementById('overlayDesc');
    const overlayCarousel = document.getElementById('overlayCarousel');
    const overlayItchLink = document.getElementById('overlayItchLink');
    const projectInfoScroll = document.querySelector('.project-info-scroll');
    const closeBtn = document.getElementById('closeBtn');
    const projectCards = document.querySelectorAll('.project-card');

    function enableSmoothWheelScroll(element) {
        if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return {
                reset() {
                    if (element) {
                        element.scrollTop = 0;
                    }
                }
            };
        }

        let targetScrollTop = 0;
        let animationFrame = null;
        let isAnimatingScroll = false;

        const clampScrollTarget = (value) => {
            const maxScroll = Math.max(0, element.scrollHeight - element.clientHeight);
            return Math.max(0, Math.min(value, maxScroll));
        };

        const stopAnimation = () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
                animationFrame = null;
            }

            isAnimatingScroll = false;
            targetScrollTop = element.scrollTop;
        };

        const animateScroll = () => {
            const distance = targetScrollTop - element.scrollTop;

            if (Math.abs(distance) < 0.5) {
                element.scrollTop = targetScrollTop;
                animationFrame = null;
                isAnimatingScroll = false;
                return;
            }

            isAnimatingScroll = true;
            element.scrollTop += distance * 0.18;
            animationFrame = requestAnimationFrame(animateScroll);
        };

        element.addEventListener('pointerdown', stopAnimation);
        element.addEventListener('touchstart', stopAnimation, { passive: true });

        element.addEventListener('wheel', (event) => {
            if (event.ctrlKey) {
                return;
            }

            event.preventDefault();

            if (!animationFrame) {
                targetScrollTop = element.scrollTop;
            }

            const delta = Math.sign(event.deltaY) * Math.min(Math.abs(event.deltaY) * 0.55, 90);
            targetScrollTop = clampScrollTarget(targetScrollTop + delta);

            if (!animationFrame) {
                animationFrame = requestAnimationFrame(animateScroll);
            }
        }, { passive: false });

        element.addEventListener('scroll', () => {
            if (isAnimatingScroll) {
                isAnimatingScroll = false;
                return;
            }

            stopAnimation();
        });

        return {
            reset() {
                stopAnimation();
                element.scrollTop = 0;
                targetScrollTop = 0;
            }
        };
    }

    const projectInfoScrollController = enableSmoothWheelScroll(projectInfoScroll);

    // Create Carousel Element Helpers
    function createCarousel(media) {
        let currentSlide = 0;
        
        overlayCarousel.innerHTML = ''; // Clear previous carousel

        if (media.length === 0) return;

        // Slides
        media.forEach((src, index) => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = `Project screenshot ${index + 1}`;
            img.classList.add('carousel-slide');
            if (index === 0) {
                img.classList.add('active');
            } else {
                img.loading = 'lazy';
            }
            overlayCarousel.appendChild(img);
        });

        // Navigation Buttons
        if (media.length > 1) {
            const prevBtn = document.createElement('button');
            prevBtn.className = 'carousel-nav-btn carousel-prev';
            prevBtn.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
            
            const nextBtn = document.createElement('button');
            nextBtn.className = 'carousel-nav-btn carousel-next';
            nextBtn.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';

            overlayCarousel.appendChild(prevBtn);
            overlayCarousel.appendChild(nextBtn);

            // Indicators (Dots)
            const indicatorsContainer = document.createElement('div');
            indicatorsContainer.className = 'carousel-indicators';
            
            media.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = 'carousel-dot';
                if (index === 0) dot.classList.add('active');
                
                dot.addEventListener('click', (e) => {
                    e.stopPropagation();
                    showSlide(index);
                });
                
                indicatorsContainer.appendChild(dot);
            });
            overlayCarousel.appendChild(indicatorsContainer);

            const slides = overlayCarousel.querySelectorAll('.carousel-slide');
            const dots = overlayCarousel.querySelectorAll('.carousel-dot');

            function showSlide(index) {
                slides.forEach(slide => slide.classList.remove('active'));
                dots.forEach(dot => dot.classList.remove('active'));
                
                // loop
                if (index >= slides.length) currentSlide = 0;
                else if (index < 0) currentSlide = slides.length - 1;
                else currentSlide = index;

                slides[currentSlide].classList.add('active');
                dots[currentSlide].classList.add('active');
            }

            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showSlide(currentSlide + 1);
            });

            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showSlide(currentSlide - 1);
            });

            // Touch swipe support
            let touchStartX = 0;
            let touchEndX = 0;

            overlayCarousel.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            overlayCarousel.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                const diff = touchStartX - touchEndX;
                if (Math.abs(diff) > 50) {
                    if (diff > 0) showSlide(currentSlide + 1);
                    else showSlide(currentSlide - 1);
                }
            }, { passive: true });

            // Keyboard arrow key support
            overlayCarousel.setAttribute('tabindex', '0');
            overlayCarousel.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    showSlide(currentSlide + 1);
                } else if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    showSlide(currentSlide - 1);
                }
            });
        }
    }

    let closeTimeout;
    let lastFocusedCard = null;

    function openProject(projectId) {
        // Clear any pending close timeouts to prevent text wiping
        if (closeTimeout) {
            clearTimeout(closeTimeout);
            closeTimeout = null;
        }
        
        // Save the element that triggered the overlay for focus return
        lastFocusedCard = document.activeElement;

        const data = projectData[projectId];
        if (data) {
            // Populate Overlay immediately
            overlayTitle.textContent = data.title;
            overlayDesc.innerHTML = data.descriptionHtml || `<p>${data.description}</p>`;
            if (projectInfoScrollController) {
                projectInfoScrollController.reset();
            }
            overlayBg.style.backgroundImage = `url('${webpSrc(data.bgImage)}')`;
            overlayItchLink.href = data.itchUrl || '#'; // Set itch link
            
            // Initialize Carousel
            createCarousel(data.media.map(webpSrc));

            // Show Overlay
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Move focus into the overlay
            setTimeout(() => closeBtn.focus(), 100);
        }
    }

    function closeProject() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        
        // Return focus to the card that opened the overlay
        if (lastFocusedCard) {
            lastFocusedCard.focus();
            lastFocusedCard = null;
        }

        // Use timeout to clear content only if not interrupted
        closeTimeout = setTimeout(() => {
            overlayTitle.textContent = '';
            overlayDesc.innerHTML = '';
            overlayCarousel.innerHTML = ''; // Clear carousel too
        }, 400); 
    }

    projectCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Check if the click originated from the itch-link or its children
            if (e.target.closest('.itch-link')) {
                return;
            }

            const projectId = card.getAttribute('data-id');
            openProject(projectId);
        });

        // Keyboard accessibility — Enter or Space opens the project
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const projectId = card.getAttribute('data-id');
                openProject(projectId);
            }
        });
    });

    // Game Jam card click handlers — open the corresponding project overlay
    document.querySelectorAll('.jam-card-link').forEach(card => {
        card.addEventListener('click', () => {
            const projectId = card.getAttribute('data-project');
            openProject(projectId);
        });
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openProject(card.getAttribute('data-project'));
            }
        });
    });

    closeBtn.addEventListener('click', closeProject);

    // Close on background click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay || e.target === overlayBg) {
            closeProject();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeProject();
        }
    });

    // Job Carousel Logic
    const jobTrack = document.getElementById('jobTrack');
    const jobPrev = document.getElementById('jobPrev');
    const jobNext = document.getElementById('jobNext');
    
    if(jobTrack) {
        // Helper to get scroll amount based on current card width
        const getScrollAmount = () => {
            const card = jobTrack.querySelector('.job-card');
            if (!card) return 300;
            const style = window.getComputedStyle(jobTrack);
            const gap = parseInt(style.gap || 0);
            return card.offsetWidth + gap;
        };

        jobPrev.addEventListener('click', () => {
            jobTrack.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
        });

        jobNext.addEventListener('click', () => {
            jobTrack.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
        });
    }

    // Contact form handler — submit to Web3Forms via fetch
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('.glass-btn');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            formStatus.textContent = '';
            formStatus.className = 'form-status';

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: new FormData(contactForm)
                });
                const result = await response.json();

                if (result.success) {
                    formStatus.textContent = 'Thanks for your message! I\'ll get back to you soon.';
                    formStatus.className = 'form-status success';
                    contactForm.reset();
                } else {
                    formStatus.textContent = 'Something went wrong. Please try again.';
                    formStatus.className = 'form-status error';
                }
            } catch {
                formStatus.textContent = 'Network error. Please try again later.';
                formStatus.className = 'form-status error';
            }

            submitBtn.disabled = false;
            submitBtn.textContent = 'Send';
            setTimeout(() => {
                formStatus.textContent = '';
                formStatus.className = 'form-status';
            }, 5000);
        });
    }
});

