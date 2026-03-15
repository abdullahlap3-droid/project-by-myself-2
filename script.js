$(document).ready(function () {
    /**
     * =========================================================================
     * MAIN INITIALIZATION SCRIPT FOR THE THEATRE WEBSITE
     * =========================================================================
     * This script runs when the DOM is fully loaded. It determines which page
     * we are on (via data-page attribute or body class) and executes page‑specific
     * functionality: mobile menus, loading JSON data, setting up event handlers,
     * modals, forms, etc.
     */

    // -------------------------------------------------------------------------
    // 1. PAGE DETECTION
    // -------------------------------------------------------------------------
    // We try to get the page identifier from the <body> tag's data-page attribute.
    // If that's not set, we look for a body class that starts with "page-".
    // If we still can't detect the page, we log a message and stop execution.
    let currentPage = $('body').data('page');

    // If no data-page attribute, try to guess from body class
    if (!currentPage) {
        let bodyClassString = $('body').attr('class') || '';
        let allClasses = bodyClassString.split(' ');

        for (let className of allClasses) {
            if (className.startsWith('page-')) {
                currentPage = className.replace('page-', '');
                break;
            }
        }
    }

    // If we still don't know the page → stop (prevents any further code from running)
    if (!currentPage) {
        console.log("Cannot detect which page this is.");
        return;
    }

    console.log("We are on page →", currentPage);

    // -------------------------------------------------------------------------
    // 2. MOBILE MENU FUNCTIONS
    // -------------------------------------------------------------------------
    // Two different mobile menu behaviours exist across the site.
    // setupNormalMobileMenu() toggles a class "is-open" on both button and nav.
    // setupAptProjectMobileMenu() toggles a class "show" only on the nav.
    // The appropriate one is called inside each page block.

    function setupNormalMobileMenu() {
        $('.menu-btn').on('click', function () {
            $(this).toggleClass('is-open');
            $('.nav').toggleClass('is-open');
        });
    }

    function setupAptProjectMobileMenu() {
        $('.menu-btn').on('click', function () {
            $('.nav').toggleClass('show');
        });
    }

    // -------------------------------------------------------------------------
    // 3. HELPER FUNCTION – fillShowsCategory
    // -------------------------------------------------------------------------
    // This function populates a given container (e.g. a row of show cards) with
    // HTML generated from an array of show objects. It also updates a counter
    // element with the number of shows. This is used on the shows pages to
    // avoid repeating the same rendering logic.
    // Parameters:
    //   containerSelector – jQuery selector for the element that will hold the cards
    //   countSelector     – selector for the element that displays the count
    //   showsArray        – array of show objects (each with image, title, language, city, etc.)
    function fillShowsCategory(containerSelector, countSelector, showsArray) {
        let allCards = '';

        for (let show of showsArray) {
            allCards += `
                <div class="col-6 col-md-4 col-lg-3">
                    <article class="show-card h-100">
                        <img src="${show.image}" alt="${show.title}">
                        <div class="show-info">
                            <h4>${show.title}</h4>
                            <div class="meta">${show.language} | ${show.city} | Runtime ${show.runtime}</div>
                            <div class="tags">
                                <span>Next: ${show.nextShow}</span>
                                <span class="rating">${show.rating}/10</span>
                            </div>
                        </div>
                    </article>
                </div>`;
        }

        $(containerSelector).html(allCards);
        $(countSelector).text(showsArray.length + ' shows available');
    }

    // -------------------------------------------------------------------------
    // 4. PAGE‑SPECIFIC CODE
    // -------------------------------------------------------------------------
    // Depending on the detected page, we initialise only the features needed.
    // This keeps the code organised and avoids conflicts between pages.

    // ---------- ARTIST PAGE ----------
    if (currentPage === 'artist') {
        // Use the standard mobile menu (toggle class is-open)
        setupNormalMobileMenu();

        let artistsList = []; // Will hold the loaded artist data

        // Slider arrows (move left/right) – these scroll the #coreSlider element
        $('.next').click(function () {
            $('#coreSlider').animate({ scrollLeft: '+=300' }, 500);
        });

        $('.prev').click(function () {
            $('#coreSlider').animate({ scrollLeft: '-=300' }, 500);
        });

        // Load artists from artist.json
        $.getJSON('artist.json')
            .done(function (data) {
                artistsList = data.core_ensemble || [];
                renderArtists(artistsList);
            })
            .fail(function () {
                console.log("Failed to load artist.json");
                $('#coreSlider').html('<p style="color: red; text-align: center; padding: 2rem;">Sorry, could not load artists.</p>');
            });

        // Renders the artist cards inside the slider
        function renderArtists(artists) {
            let html = '';

            for (let artist of artists) {
                html += `
                    <article class="lineup-card">
                        <img src="${artist.image}" alt="${artist.name}">
                        <h4>${artist.name}</h4>
                        <p>${artist.role}</p>
                        <button class="view" data-id="${artist.id}">View Profile</button>
                    </article>`;
            }

            $('#coreSlider').html(html);
        }

        // Spotlight button (example: artist id 5) – shows a specific artist's profile
        $('#spotlightBtn').click(function () {
            let foundArtist = null;
            for (let artist of artistsList) {
                if (artist.id === 5) {
                    foundArtist = artist;
                    break;
                }
            }
            if (foundArtist) {
                showArtistModal(foundArtist);
            } else {
                alert('Artist data not ready yet. Please wait a moment.');
            }
        });

        // Any "View Profile" button click (including those added dynamically)
        $(document).on('click', '.view', function (e) {
            e.preventDefault();
            let artistId = $(this).data('id');

            let foundArtist = null;
            for (let artist of artistsList) {
                if (artist.id === artistId) {
                    foundArtist = artist;
                    break;
                }
            }

            if (foundArtist) {
                showArtistModal(foundArtist);
            }
        });

        // Fill and show Bootstrap modal with the artist's details
        function showArtistModal(artist) {
            $('#modalImage').attr('src', artist.image);
            $('#modalName').text(artist.name);
            $('#modalRole').text(artist.role);
            $('#modalDescription').text(artist.description || 'No description available.');

            // Awards list – generate <li> items
            let awardsHtml = '';
            if (artist.awards && artist.awards.length > 0) {
                for (let award of artist.awards) {
                    awardsHtml += `<li>* ${award}</li>`;
                }
            }
            $('#modalAwards').html(awardsHtml || '<li>No awards listed</li>');

            // Shows list – generate simple cards
            let showsHtml = '';
            if (artist.shows && artist.shows.length > 0) {
                for (let show of artist.shows) {
                    showsHtml += `<div class="show-card"><strong>* ${show}</strong><small> - recent production</small></div>`;
                }
            }
            $('#modalShows').html(showsHtml || '<p>No recent shows listed</p>');

            const modal = new bootstrap.Modal(document.getElementById('artistModal'));
            modal.show();
        }
    }

    // ---------- AUDITORIUM PAGE ----------
    else if (currentPage === 'auditorium') {
        // Standard mobile menu
        setupNormalMobileMenu();

        // Click on a venue card opens a modal with detailed information
        $(document).on('click', '.venue-card', function () {
            const $card = $(this);
            const title = $card.find('h3').text() || 'Venue';
            const imageSrc = $card.find('img').attr('src') || '';
            const infoText = $card.find('.venue-info p').text() || '';

            // Parse the info text (format: "City | Capacity X | Stage type")
            const parts = infoText.split(' | ');
            const city = parts[0] || '-';
            const capacity = parts[1] ? parts[1].replace('Capacity ', '') : '-';
            const stage = parts[2] || '-';

            // Collect facilities from the chip elements
            let facilities = [];
            $card.find('.chip').each(function () {
                facilities.push($(this).text());
            });
            const facilityText = facilities.length ? facilities.join(', ') : '-';

            // Populate modal fields
            $('#venueModalTitle').text(title);
            $('#venueModalTitleInline').text(title);
            $('#venueModalImage').attr('src', imageSrc);
            $('#venueModalCity').text(city);
            $('#venueModalCapacity').text(capacity);
            $('#venueModalStage').text(stage);
            $('#venueModalFacilities').text(facilityText);

            // Simple description (could be extended with real data)
            $('#venueModalDescription').text(
                `Explore ${title} with a ${stage} stage, seating for ${capacity}, and facilities: ${facilityText}.`
            );

            new bootstrap.Modal(document.getElementById('venueModal')).show();
        });
    }

    // ---------- AWARDS PAGE ----------
    else if (currentPage === 'awards') {
        // Standard mobile menu
        setupNormalMobileMenu();

        // Static list of award categories – could be moved to a JSON file later
        const categories = ['Best Play', 'Best Director', 'Best Actor', 'Audience Choice'];

        const container = $('#award-categories');

        let offset = 0; // Not actually used – could be for staggered animations

        for (let category of categories) {
            let block = $('<section>').addClass('category-block');

            let header = $('<div>').addClass('category-head');
            header.append($('<h3>').text(category));
            header.append($('<span>').text('4 nominees')); // Placeholder count
            block.append(header);

            let grid = $('<div>').addClass('nom-grid');

            // Placeholder – normally would load nominees from JSON
            grid.html('<p style="text-align:center; padding:2rem;">Nominees will be loaded from JSON file soon.</p>');

            block.append(grid);
            container.append(block);

            offset += 2; // Not used
        }
    }

    // ---------- MAGAZINES PAGE ----------
    else if (currentPage === 'magazines') {
        // Standard mobile menu
        setupNormalMobileMenu();

        // Load magazine categories and articles from magazines.json
        $.getJSON('magazines.json')
            .done(function (data) {
                let categories = data.categories || [];
                let html = '';

                for (let cat of categories) {
                    html += `
                        <section class="mag-category">
                            <div class="mag-head">
                                <h3>${cat.name}</h3>
                                <span>${cat.items.length} articles</span>
                            </div>
                            <div class="mag-grid">`;

                    for (let item of cat.items) {
                        html += `
                            <article class="mag-item">
                                <img src="${item.image}" alt="${item.title}">
                                <div class="mag-body">
                                    <h4>${item.title}</h4>
                                    <p>Editorial from ${cat.name.toLowerCase()} archive.</p>
                                    <div class="mag-meta">
                                        <span>${item.issue}</span>
                                        <span>${item.date}</span>
                                    </div>
                                    <a class="download-btn" href="${item.pdf}" download>Download PDF</a>
                                </div>
                            </article>`;
                    }

                    html += '</div></section>';
                }

                $('#mag-list').html(html);
            })
            .fail(function () {
                $('#mag-list').html('<p style="color:red; text-align:center; padding:3rem;">Could not load magazines. Please check magazines.json</p>');
            });
    }

    // ---------- QUERIES / CONTACT PAGE ----------
    else if (currentPage === 'queries') {
        // Standard mobile menu
        setupNormalMobileMenu();

        // FAQ toggle – clicking a question shows/hides its answer
        $(document).on('click', '.faq-q', function () {
            $(this).next().toggle();
        });

        const $archive = $('#query-archive'); // Container for previously submitted queries
        const $form = $('#queryForm');        // The query submission form

        // Load and display saved queries from sessionStorage
        function showSavedQueries() {
            if ($archive.length === 0) return;

            let savedData = sessionStorage.getItem('theatre_queries');
            let queries = savedData ? JSON.parse(savedData) : [];

            let html = '';

            for (let query of queries) {
                html += `
                    <div class="query-card">
                        <b>${query.name}</b>
                        <span class="query-type">${query.type}</span>
                        <div>${query.message}</div>
                        <div class="query-meta">
                            <span>${query.email}</span>
                            <span>${query.date}</span>
                        </div>
                    </div>`;
            }

            $archive.html(html || '<p>No queries yet.</p>');
        }

        // Handle form submission: save the new query to sessionStorage and refresh the archive
        if ($form.length) {
            $form.on('submit', function (e) {
                e.preventDefault();

                let name = $('#qName').val().trim();
                let email = $('#qEmail').val().trim();
                let type = $('#qType').val();
                let message = $('#qMessage').val().trim();

                if (!name || !email || !type || !message) return;

                let savedData = sessionStorage.getItem('theatre_queries');
                let queries = savedData ? JSON.parse(savedData) : [];

                let newQuery = {
                    name,
                    email,
                    type,
                    message,
                    date: new Date().toLocaleString()
                };

                queries.unshift(newQuery); // Add to beginning
                sessionStorage.setItem('theatre_queries', JSON.stringify(queries));

                $form[0].reset();
                showSavedQueries(); // Refresh the archive display
            });
        }

        // Initial display of saved queries
        showSavedQueries();
    }

    // ---------- SHOWS PAGE ----------
    else if (currentPage === 'shows') {
        // Standard mobile menu
        setupNormalMobileMenu();

        let currentShowTitle = ''; // Used to store which show's modal is open (for feedback)

        // Load and display feedback for the currently open show from localStorage
        function showFeedbackForCurrentShow() {
            const $list = $('#feedbackList');
            if ($list.length === 0) return;

            let key = 'show_feedback_' + currentShowTitle;
            let saved = localStorage.getItem(key);
            let feedbackList = saved ? JSON.parse(saved) : [];

            let html = '';

            for (let item of feedbackList) {
                html += `
                    <div class="feedback-card">
                        <b>${item.name}</b>
                        <div>${item.message}</div>
                        <div class="feedback-meta">${item.date}</div>
                    </div>`;
            }

            $list.html(html || '<p>No feedback yet. Be the first!</p>');
        }

        // Handle feedback form submission inside the show modal
        $('#feedbackForm').on('submit', function (e) {
            e.preventDefault();

            let name = $('#fbName').val().trim();
            let message = $('#fbMessage').val().trim();

            if (!name || !message) return;

            let key = 'show_feedback_' + currentShowTitle;
            let saved = localStorage.getItem(key);
            let list = saved ? JSON.parse(saved) : [];

            list.unshift({
                name,
                message,
                date: new Date().toLocaleString()
            });

            localStorage.setItem(key, JSON.stringify(list));
            $('#feedbackForm')[0].reset();
            showFeedbackForCurrentShow(); // Refresh the feedback list in the modal
        });

        // "More" / "Less" buttons for the show description in the modal
        $('#showMoreBtn').on('click', function () {
            $('#showModalDescFull').show();
            $('#showModalDescShort').hide();
            $('#showMoreBtn').hide();
            $('#showLessBtn').show();
        });

        $('#showLessBtn').on('click', function () {
            $('#showModalDescFull').hide();
            $('#showModalDescShort').show();
            $('#showLessBtn').hide();
            $('#showMoreBtn').show();
        });

        // Category sliders – left/right arrows scroll the card slider horizontally
        $('.next').click(function () {
            let $slider = $(this).closest('.category').find('.card-slider');
            $slider.animate({ scrollLeft: '+=200' }, 50);
        });

        $('.prev').click(function () {
            let $slider = $(this).closest('.category').find('.card-slider');
            $slider.animate({ scrollLeft: '-=200' }, 50);
        });

        // Open show modal when a show card is clicked
        $(document).on('click', '.show-card', function () {
            const $card = $(this);
            const title = $card.find('h4').text() || 'Show';
            const image = $card.find('img').attr('src') || '';
            const meta = $card.find('.meta').text() || '';
            const next = $card.find('.tags span:first').text().replace('Next: ', '') || '-';
            const rating = $card.find('.rating').text() || '-';

            // Parse meta string (format: "Language | City | Runtime ...")
            const parts = meta.split(' | ');
            const lang = parts[0] || '-';
            const city = parts[1] || '-';
            const runtime = parts[2] ? parts[2].replace('Runtime ', '') : '-';

            // Create a full description and a shortened one for the modal
            const fullText = `Experience ${title} in ${city} - a compelling ${lang} theatre production with a runtime of ${runtime}. Next show: ${next}.`;
            let shortText = fullText;
            if (fullText.length > 120) {
                shortText = fullText.substring(0, 120) + '...';
            }

            // Populate modal fields
            $('#showModalTitle').text(title);
            $('#showModalTitleInline').text(title);
            $('#showModalImage').attr('src', image);
            $('#showModalLanguage').text(lang);
            $('#showModalCity').text(city);
            $('#showModalRuntime').text(runtime);
            $('#showModalNext').text(next);
            $('#showModalRating').text(rating);
            $('#showModalDescShort').text(shortText);
            $('#showModalDescFull').text(fullText);
            $('#showModalDescFull').hide();
            $('#showModalDescShort').show();
            $('#showMoreBtn').show();
            $('#showLessBtn').hide();

            // Store the current show title for feedback
            currentShowTitle = title;
            showFeedbackForCurrentShow();

            new bootstrap.Modal(document.getElementById('showModal')).show();
        });

        // Load all show categories from data.json and populate the page
        $.getJSON('data.json')
            .done(function (json) {
                fillShowsCategory('#box-urdu',        '#count-urdu',        json.urdu_theater_show   || []);
                fillShowsCategory('#box-english',     '#count-english',     json.english_theater    || []);
                fillShowsCategory('#box-top-pick',    '#count-top-pick',    json.top_pick_for_you   || []);
                fillShowsCategory('#box-musical',     '#count-musical',     json.musical_theater    || []);
                fillShowsCategory('#box-comedy',      '#count-comedy',      json.comedy             || []);
                fillShowsCategory('#box-contemporary','#count-contemporary',json.contemporary_drama || []);
                fillShowsCategory('#box-new',         '#count-new',         json.new                || []);
                fillShowsCategory('#box-upcoming',    '#count-upcoming',    json.upcoming_shows     || []);
            })
            .fail(function () {
                console.log("Cannot load data.json");
            });
    }

    // ---------- APT‑SHOWS PAGE (a different shows layout) ----------
    else if (currentPage === 'apt-shows') {
        // Special mobile menu for this page (only toggles .show on nav)
        setupAptProjectMobileMenu();

        // Load shows from data.json, but only certain categories used on this page
        $.getJSON('data.json')
            .done(function (json) {
                fillShowsCategory('#box-tragedy',     '#count-tragedy',     json.tragedy_classics     || []);
                fillShowsCategory('#box-contemporary','#count-contemporary',json.contemporary_drama  || []);
                fillShowsCategory('#box-musical',     '#count-musical',     json.musical_theatre      || []);
                fillShowsCategory('#box-comedy',      '#count-comedy',      json.comedy_and_satire    || []);
                fillShowsCategory('#box-historical',  '#count-historical',  json.historical_epics     || []);
                // ... additional categories can be added here
            })
            .fail(function () {
                $('#shows-catalog').html('<p style="color:#b30000; font-weight:bold; text-align:center; padding:3rem;">Could not load shows. Check data.json file.</p>');
            });
    }

    // ---------- OTHER PAGES (index, theater-speak, apt-index, etc.) ----------
    else {
        // Fallback: just set up the standard mobile menu for any page not handled above
        setupNormalMobileMenu();
    }

});