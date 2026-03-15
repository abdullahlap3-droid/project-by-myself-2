// ===== artist.html =====
(function () {
  if (!document.body || document.body.dataset.page !== "artist") return;
  let artistList = [];
  
      $(function() {
        // mobile menu toggle
        $('.menu-btn').on('click', function() {
          $(this).toggleClass('is-open');
          $('.nav').toggleClass('is-open');
        });
  
        // SLIDER BUTTONS (now left & right)
        $('.next').click(function(){
          $('#coreSlider').animate({ scrollLeft: '+=300' }, 500);
        });
        $('.prev').click(function(){
          $('#coreSlider').animate({ scrollLeft: '-=300' }, 500);
        });
  
        // FETCH artist.json or use enriched fallback
        fetch('artist.json')
          .then(response => {
            if (!response.ok) throw new Error('Network error');
            return response.json();
          })
          .then(data => {
            artistList = data.core_ensemble;
            renderSlider(artistList);
          })
          .catch(err => {
            console.warn('Using fallback artist data');
            // comprehensive fallback with all required fields
            artistList = [
              { id: 1, name: "Rania Ahmed", role: "Lead Actor", image: "assets/english/image (1).jpeg", description: "Award-winning actor with 12 years of stage experience. Known for Chekhov and Ibsen.", awards: ["Best Actress 2021", "Critics' Choice 2022", "KaraFilm Award"], shows: ["Hamlet (2023)", "A Doll's House (2022)", "Three Sisters (2024)"] },
              { id: 2, name: "Hamza Qureshi", role: "Director", image: "assets/english/image.jpeg", description: "Innovative director known for visual storytelling and ensemble rhythm.", awards: ["Best Director 2022", "Theatre Plus Award"], shows: ["Macbeth (2023)", "The Glass Menagerie (2022)", "Waiting for Godot (2024)"] },
              { id: 3, name: "Misha Tariq", role: "Composer", image: "assets/english/image (3).jpeg", description: "Vocal director and composer for immersive music theatre.", awards: ["Music Director of the Year 2023"], shows: ["Sufi Opera (2023)", "The Jungle Book (2022)", "Songs of Bulleh Shah (2024)"] },
              { id: 4, name: "Saad Noman", role: "Writer", image: "assets/english/1.jpeg", description: "Playwright and adaptation specialist, focuses on bilingual drama.", awards: ["Writer's Guild Award 2022"], shows: ["Manto (2023)", "Dastak (2022)", "Chiragh (2024)"] },
              { id: 5, name: "Areeba Khan", role: "Actor", image: "assets/english/image (2).jpeg", description: "Character performer with strong emotional range. Spotlight artist this month.", awards: ["Best Supporting Actress 2023", "Emerging Talent 2022"], shows: ["Hajra (2023)", "Laila o Majnu (2022)", "Bintro (2024)"] },
              { id: 6, name: "Faris Malik", role: "Set Designer", image: "assets/english/Drama-Hotel-Jaan-e-Jaan-at-Arts-Council-16.jpg", description: "Set designer for large-scale stage builds and immersive environments.", awards: ["Design Distinction 2023"], shows: ["Hotel Jaan-e-Jaan (2023)", "The Architect (2022)", "Sand Castle (2024)"] }
            ];
            renderSlider(artistList);
          });
  
        function renderSlider(list) {
          let container = $('#coreSlider');
          let html = '';
          for (let item of list) {
            html += `
              <article class="lineup-card">
                <img src="${item.image}" alt="${item.name}">
                <h4>${item.name}</h4>
                <p>${item.role}</p>
                <button class="view" data-id="${item.id}">View Profile</button>
              </article>
            `;
          }
          container.html(html);
        }
  
        // spotlight button (Areeba Khan, id=5)
        $('#spotlightBtn').click(function() {
          let artist = artistList.find(a => a.id == 5);
          if (artist) openModal(artist);
          else alert('Artist data not loaded yet, please try again.');
        });
  
        // modal open for any .view button (delegation)
        $(document).on('click', '.view', function(e) {
          e.preventDefault();
          let id = $(this).data('id');
          let artist = artistList.find(a => a.id == id);
          if (artist) openModal(artist);
        });
  
        function openModal(artist) {
          $('#modalImage').attr('src', artist.image);
          $('#modalName').text(artist.name);
          $('#modalRole').text(artist.role);
          $('#modalDescription').text(artist.description);
  
          // awards as chips
          let awardsHtml = '';
          if (artist.awards && Array.isArray(artist.awards)) {
            artist.awards.forEach(award => {
              awardsHtml += '<li>* ' + award + '</li>';
            });
          }
          $('#modalAwards').html(awardsHtml);
  
          // shows as cards (compact grid)
          let showsHtml = '';
          if (artist.shows && Array.isArray(artist.shows)) {
            artist.shows.forEach(show => {
              showsHtml += '<div class="show-card"><strong>* ' + show + '</strong><small> - recent production</small></div>';
            });
          }
          $('#modalShows').html(showsHtml);
  
          let modal = new bootstrap.Modal(document.getElementById('artistModal'));
          modal.show();
        }
      });
})();

// ===== auditorium.html =====
(function () {
  if (!document.body || document.body.dataset.page !== "auditorium") return;
  document.addEventListener("DOMContentLoaded", function() {
        var menuBtn = document.querySelector(".menu-btn");
        var nav = document.querySelector(".nav");
        if (menuBtn && nav) {
          menuBtn.addEventListener("click", function() {
            menuBtn.classList.toggle("is-open");
            nav.classList.toggle("is-open");
          });
        }
  
        document.addEventListener("click", function(event) {
          var card = event.target.closest(".venue-card");
          if (!card) return;
  
          var titleEl = card.querySelector("h3");
          var imgEl = card.querySelector("img");
          var infoEl = card.querySelector(".venue-info p");
          var chips = card.querySelectorAll(".chip");
  
          var title = titleEl ? titleEl.innerText : "Venue Title";
          var imageSrc = imgEl ? imgEl.src : "";
          var infoText = infoEl ? infoEl.innerText : "";
  
          var parts = infoText.split(" | ");
          var city = parts[0] || "-";
          var capacity = parts[1] ? parts[1].replace("Capacity ", "") : "-";
          var stage = parts[2] || "-";
  
          var facilities = [];
          for (var i = 0; i < chips.length; i++) {
            facilities.push(chips[i].innerText);
          }
          var facilityText = facilities.length ? facilities.join(", ") : "-";
  
          document.getElementById("venueModalTitle").innerText = title;
          document.getElementById("venueModalTitleInline").innerText = title;
          document.getElementById("venueModalImage").src = imageSrc;
          document.getElementById("venueModalCity").innerText = city;
          document.getElementById("venueModalCapacity").innerText = capacity;
          document.getElementById("venueModalStage").innerText = stage;
          document.getElementById("venueModalFacilities").innerText = facilityText;
          document.getElementById("venueModalDescription").innerText =
            "Explore " + title + " with a " + stage + ", seating for " + capacity + ", and facilities such as " + facilityText + ".";
  
          new bootstrap.Modal(document.getElementById("venueModal")).show();
        });
      });
})();

// ===== awards.html =====
(function () {
  if (!document.body || document.body.dataset.page !== "awards") return;
  // Wait for the page to load completely
      document.addEventListener("DOMContentLoaded", function() {
  
        // ----- mobile menu toggle (simple) -----
        var menuBtn = document.querySelector(".menu-btn");
        var nav = document.querySelector(".nav");
        if (menuBtn && nav) {
          menuBtn.addEventListener("click", function() {
            menuBtn.classList.toggle("is-open");
            nav.classList.toggle("is-open");
          });
        }
  
        // ----- dynamic nomination categories (beginner friendly) -----
  
        // 1. List of award categories we want to show
        var awardCategories = [
          "Best Play",
          "Best Director",
          "Best Actor",
          "Audience Choice"
        ];
  
        // 2. Some example nominee names (just for demo)
        var nominees = [
          "The Last Lantern", "Crimson Balcony", "Silent Gallery", "Velvet Echo",
          "Moonlight Interlude", "City of Masks", "Broken Lantern", "Whispered Exit",
          "Golden Orchestra", "Shadow Balcony", "Understudy Dreams", "Seventh Bell"
        ];
  
        // 3. A collection of images we can use for the cards
        var imagePool = [
          "assets/english/image (1).jpeg",
          "assets/english/image (2).jpeg",
          "assets/english/image (3).jpeg",
          "assets/english/image.jpeg",
          "assets/english/1.jpeg",
          "assets/english/Comedy.png",
          "assets/english/Drama-Hotel-Jaan-e-Jaan-at-Arts-Council-16.jpg"
        ];
  
        // 4. Get the container where we will put all category blocks
        var container = document.querySelector("#award-categories");
  
        // 5. This variable will help us pick different images/nominees each time
        var offset = 0;
  
        // 6. Loop through each category and build a block
        for (var i = 0; i < awardCategories.length; i++) {
          var cat = awardCategories[i];
  
          // create the main block div
          var block = document.createElement("section");
          block.className = "category-block";
  
          // create the header (category name + "4 nominees")
          var head = document.createElement("div");
          head.className = "category-head";
          var h3 = document.createElement("h3");
          h3.textContent = cat;
          var span = document.createElement("span");
          span.textContent = "4 nominees";
          head.appendChild(h3);
          head.appendChild(span);
  
          // create the grid that will hold 4 nomination cards
          var grid = document.createElement("div");
          grid.className = "nom-grid";
  
          // add 4 cards for this category
          for (var j = 0; j < 4; j++) {
            // pick a nominee name using offset + j (wrap around using %)
            var nameIndex = (offset + j) % nominees.length;
            var nomName = nominees[nameIndex];
  
            // pick an image using same logic
            var imgIndex = (offset + j) % imagePool.length;
            var imgSrc = imagePool[imgIndex];
  
            // create some random-looking meta data
            var season = 2026 - ((offset + j) % 3);    // 2026, 2025, or 2024
            var juryOptions = ["Gold Jury", "Critics Circle", "Open Panel"];
            var jury = juryOptions[(offset + j) % 3];
  
            // build the card
            var card = document.createElement("article");
            card.className = "nom-card";
  
            // image
            var img = document.createElement("img");
            img.src = imgSrc;
            img.alt = nomName;
  
            // body div
            var bodyDiv = document.createElement("div");
            bodyDiv.className = "nom-body";
  
            var h4 = document.createElement("h4");
            h4.textContent = nomName;
  
            var p = document.createElement("p");
            p.textContent = "Nominee entry for " + cat.toLowerCase() + " category.";
  
            var metaDiv = document.createElement("div");
            metaDiv.className = "nom-meta";
  
            var seasonSpan = document.createElement("span");
            seasonSpan.textContent = "Season " + season;
  
            var jurySpan = document.createElement("span");
            jurySpan.textContent = jury;
  
            metaDiv.appendChild(seasonSpan);
            metaDiv.appendChild(jurySpan);
  
            bodyDiv.appendChild(h4);
            bodyDiv.appendChild(p);
            bodyDiv.appendChild(metaDiv);
  
            card.appendChild(img);
            card.appendChild(bodyDiv);
  
            grid.appendChild(card);
          }
  
          // increase offset so next category gets different images/names
          offset = offset + 2;
  
          // put header and grid inside block
          block.appendChild(head);
          block.appendChild(grid);
  
          // add block to the container
          if (container) {
            container.appendChild(block);
          }
        }
      });
})();

// ===== index.html =====
(function () {
  if (!document.body || document.body.dataset.page !== "index") return;
  document.addEventListener("DOMContentLoaded", function() {
        var menuBtn = document.querySelector(".menu-btn");
        var nav = document.querySelector(".nav");
        if (menuBtn && nav) {
          menuBtn.addEventListener("click", function() {
            menuBtn.classList.toggle("is-open");
            nav.classList.toggle("is-open");
          });
        }
      });
})();

// ===== magazines.html =====
(function () {
  if (!document.body || document.body.dataset.page !== "magazines") return;
  // wait for page to load
      document.addEventListener("DOMContentLoaded", function() {
        // mobile menu toggle
        var menuBtn = document.querySelector(".menu-btn");
        var nav = document.querySelector(".nav");
        if (menuBtn && nav) {
          menuBtn.addEventListener("click", function() {
            menuBtn.classList.toggle("is-open");
            nav.classList.toggle("is-open");
          });
        }
  
                    // dynamic magazine categories (simple template method like shows page)
        fetch('magazines.json')
          .then(function(response) { return response.json(); })
          .then(function(data) {
            var categories = data.categories || [];
            var container = document.querySelector("#mag-list");
            var html = "";
  
            for (var i = 0; i < categories.length; i++) {
              var cat = categories[i];
              html += '<section class="mag-category">';
              html += '<div class="mag-head"><h3>' + cat.name + '</h3><span>' + cat.items.length + ' articles</span></div>';
              html += '<div class="mag-grid">';
  
              for (var j = 0; j < cat.items.length; j++) {
                var item = cat.items[j];
                html += '<article class="mag-item">';
                html += '<img src="' + item.image + '" alt="' + item.title + '">';
                html += '<div class="mag-body">';
                html += '<h4>' + item.title + '</h4>';
                html += '<p>Editorial entry from ' + cat.name.toLowerCase() + ' archive collection.</p>';
                html += '<div class="mag-meta"><span>' + item.issue + '</span><span>' + item.date + '</span></div>';
                html += '<a class="download-btn" href="' + item.pdf + '" download>Download PDF</a>';
                html += '</div></article>';
              }
  
              html += '</div></section>';
            }
  
            if (container) {
              container.innerHTML = html;
            }
          });
        });
})();

// ===== queries.html =====
(function () {
  if (!document.body || document.body.dataset.page !== "queries") return;
  // simple mobile menu toggle
      document.addEventListener("DOMContentLoaded", function() {
        var menuBtn = document.querySelector(".menu-btn");
        var nav = document.querySelector(".nav");
        if (menuBtn && nav) {
          menuBtn.addEventListener("click", function() {
            menuBtn.classList.toggle("is-open");
            nav.classList.toggle("is-open");
          });
        }
  
        // FAQ toggle
        var faqItems = document.querySelectorAll(".faq-q");
        for (var i = 0; i < faqItems.length; i++) {
          faqItems[i].addEventListener("click", function() {
            var answer = this.nextElementSibling;
            if (!answer) return;
            answer.style.display = (answer.style.display === "block") ? "none" : "block";
          });
        }
  
        // localStorage for queries
        var form = document.getElementById("queryForm");
        var archive = document.getElementById("query-archive");
  
        function renderQueries() {
          if (!archive) return;
          var data = sessionStorage.getItem("theatre_queries");
          var list = data ? JSON.parse(data) : [];
          if (!list.length) {
            list = [
              { name: "Ali Khan", email: "ali.khan@email.com", type: "Ticket / Booking", message: "I booked two tickets but only one confirmation email arrived. Can you resend the second ticket?", date: "Mar 15, 2026 10:12 AM" },
              { name: "Sara Ahmed", email: "sara.ahmed@email.com", type: "Venue / Auditorium", message: "Is parking available at the Arts Council venue and is it free after 6 PM?", date: "Mar 14, 2026 6:40 PM" },
              { name: "Hira Malik", email: "hira.malik@email.com", type: "Artist / Gallery", message: "Could you share the cast list for Hotel Jaan-e-Jaan and any upcoming meet-and-greet dates?", date: "Mar 13, 2026 4:05 PM" }
            ];
          }
          var html = "";
          for (var i = 0; i < list.length; i++) {
            var q = list[i];
            html += '<div class="query-card">';
            html += '<b>' + q.name + '</b><span class="query-type">' + q.type + '</span>';
            html += '<div>' + q.message + '</div>';
            html += '<div class="query-meta"><span>' + q.email + '</span><span>' + q.date + '</span></div>';
            html += '</div>';
          }
          archive.innerHTML = html;
        }
  
        if (form) {
          form.addEventListener("submit", function(e) {
            e.preventDefault();
            var name = document.getElementById("qName").value.trim();
            var email = document.getElementById("qEmail").value.trim();
            var type = document.getElementById("qType").value;
            var message = document.getElementById("qMessage").value.trim();
  
            if (!name || !email || !type || !message) return;
  
            var data = sessionStorage.getItem("theatre_queries");
            var list = data ? JSON.parse(data) : [];
            list.unshift({
              name: name,
              email: email,
              type: type,
              message: message,
              date: new Date().toLocaleString()
            });
            sessionStorage.setItem("theatre_queries", JSON.stringify(list));
            form.reset();
            renderQueries();
          });
        }
  
        renderQueries();
      });
})();

// ===== shows.html =====
(function () {
  if (!document.body || document.body.dataset.page !== "shows") return;
  document.addEventListener("DOMContentLoaded", function() {
        var menuBtn = document.querySelector(".menu-btn");
        var nav = document.querySelector(".nav");
        if (menuBtn && nav) {
          menuBtn.addEventListener("click", function() {
            menuBtn.classList.toggle("is-open");
            nav.classList.toggle("is-open");
          });
        }
  
        var currentShowTitle = "";
        var fakeFeedback = [
          { name: "Ayesha", message: "Loved the pacing and performances. A must-watch!", date: "Just now" },
          { name: "Bilal", message: "Great energy and strong acting. Really enjoyable.", date: "1 day ago" },
          { name: "Sara", message: "Beautiful staging and a powerful story.", date: "2 days ago" }
        ];
  
        function renderFeedback() {
          var listEl = document.getElementById("feedbackList");
          if (!listEl) return;
          var key = "show_feedback_" + currentShowTitle;
          var data = localStorage.getItem(key);
          var saved = data ? JSON.parse(data) : [];
          var html = "";
  
          for (var i = 0; i < fakeFeedback.length; i++) {
            var f = fakeFeedback[i];
            html += '<div class="feedback-card"><b>' + f.name + '</b><div>' + f.message + '</div><div class="feedback-meta">' + f.date + '</div></div>';
          }
  
          for (var j = 0; j < saved.length; j++) {
            var s = saved[j];
            html += '<div class="feedback-card"><b>' + s.name + '</b><div>' + s.message + '</div><div class="feedback-meta">' + s.date + '</div></div>';
          }
  
          listEl.innerHTML = html;
        }
  
        var feedbackForm = document.getElementById("feedbackForm");
        if (feedbackForm) {
          feedbackForm.addEventListener("submit", function(e) {
            e.preventDefault();
            var name = document.getElementById("fbName").value.trim();
            var message = document.getElementById("fbMessage").value.trim();
            if (!name || !message) return;
  
            var key = "show_feedback_" + currentShowTitle;
            var data = localStorage.getItem(key);
            var saved = data ? JSON.parse(data) : [];
            saved.unshift({ name: name, message: message, date: new Date().toLocaleString() });
            localStorage.setItem(key, JSON.stringify(saved));
            feedbackForm.reset();
            renderFeedback();
          });
        }
  
        $("#showMoreBtn").on("click", function() {
          $("#showModalDescFull").show();
          $("#showModalDescShort").hide();
          $("#showMoreBtn").hide();
          $("#showLessBtn").show();
        });
  
        $("#showLessBtn").on("click", function() {
          $("#showModalDescFull").hide();
          $("#showModalDescShort").show();
          $("#showLessBtn").hide();
          $("#showMoreBtn").show();
        });
  
        $(".next").click(function() {
          $(this).closest(".category").find(".card-slider").animate({
            scrollLeft: "+=200"
          }, 50);
        });
  
        $(".prev").click(function() {
          $(this).closest(".category").find(".card-slider").animate({
            scrollLeft: "-=200"
          }, 50);
        });
  
        document.addEventListener("click", function(event) {
          var card = event.target.closest(".show-card");
          if (!card) return;
  
          var titleEl = card.querySelector("h4");
          var imgEl = card.querySelector("img");
          var metaEl = card.querySelector(".meta");
          var nextEl = card.querySelector(".tags span");
          var ratingEl = card.querySelector(".rating");
  
          var title = titleEl ? titleEl.innerText : "Show Title";
          var imageSrc = imgEl ? imgEl.src : "";
          var metaText = metaEl ? metaEl.innerText : "";
  
          var parts = metaText.split(" | ");
          var language = parts[0] || "-";
          var city = parts[1] || "-";
          var runtime = parts[2] ? parts[2].replace("Runtime ", "") : "-";
          var nextShow = nextEl ? nextEl.innerText.replace("Next: ", "") : "-";
          var rating = ratingEl ? ratingEl.innerText : "-";
          var fullDesc = "Experience " + title + " in " + city + " - a compelling " + language + " theatre production with a runtime of " + runtime + ". Next show: " + nextShow + ".";
          var shortDesc = fullDesc.length > 120 ? fullDesc.slice(0, 120) + "..." : fullDesc;
  
          document.getElementById("showModalTitle").innerText = title;
          document.getElementById("showModalTitleInline").innerText = title;
          document.getElementById("showModalImage").src = imageSrc;
          document.getElementById("showModalLanguage").innerText = language;
          document.getElementById("showModalCity").innerText = city;
          document.getElementById("showModalRuntime").innerText = runtime;
          document.getElementById("showModalNext").innerText = nextShow;
          document.getElementById("showModalRating").innerText = rating;
          document.getElementById("showModalDescShort").innerText = shortDesc;
          document.getElementById("showModalDescFull").innerText = fullDesc;
          $("#showModalDescFull").hide();
          $("#showModalDescShort").show();
          $("#showMoreBtn").show();
          $("#showLessBtn").hide();
          currentShowTitle = title;
          renderFeedback();
  
          new bootstrap.Modal(document.getElementById("showModal")).show();
        });
  
        fetch('data.json')
          .then(function(response) { return response.json(); })
          .then(function(json) {
            // Urdu Theater Show
            var section = document.querySelector('#box-urdu');
            var html = '';
            for (var i = 0; i < json.urdu_theater_show.length; i++) {
              var item = json.urdu_theater_show[i];
              html += '<div class="col-6 col-md-4 col-lg-3">' +
                '<article class="show-card h-100">' +
                '<img src="' + item.image + '" alt="' + item.title + '">' +
                '<div class="show-info">' +
                '<h4>' + item.title + '</h4>' +
                '<div class="meta">' + item.language + ' | ' + item.city + ' | Runtime ' + item.runtime + '</div>' +
                '<div class="tags">' +
                '<span>Next: ' + item.nextShow + '</span>' +
                '<span class="rating">' + item.rating + '/10</span>' +
                '</div></div></article></div>';
            }
            section.innerHTML = html;
            document.querySelector('#count-urdu').innerText = json.urdu_theater_show.length + ' shows available';
  
            // English Theater
            section = document.querySelector('#box-english');
            html = '';
            for (var i = 0; i < json.english_theater.length; i++) {
              var item = json.english_theater[i];
              html += '<div class="col-6 col-md-4 col-lg-3">' +
                '<article class="show-card h-100">' +
                '<img src="' + item.image + '" alt="' + item.title + '">' +
                '<div class="show-info">' +
                '<h4>' + item.title + '</h4>' +
                '<div class="meta">' + item.language + ' | ' + item.city + ' | Runtime ' + item.runtime + '</div>' +
                '<div class="tags">' +
                '<span>Next: ' + item.nextShow + '</span>' +
                '<span class="rating">' + item.rating + '/10</span>' +
                '</div></div></article></div>';
            }
            section.innerHTML = html;
            document.querySelector('#count-english').innerText = json.english_theater.length + ' shows available';
  
            // Top Pick For You
            section = document.querySelector('#box-top-pick');
            html = '';
            for (var i = 0; i < json.top_pick_for_you.length; i++) {
              var item = json.top_pick_for_you[i];
              html += '<div class="col-6 col-md-4 col-lg-3">' +
                '<article class="show-card h-100">' +
                '<img src="' + item.image + '" alt="' + item.title + '">' +
                '<div class="show-info">' +
                '<h4>' + item.title + '</h4>' +
                '<div class="meta">' + item.language + ' | ' + item.city + ' | Runtime ' + item.runtime + '</div>' +
                '<div class="tags">' +
                '<span>Next: ' + item.nextShow + '</span>' +
                '<span class="rating">' + item.rating + '/10</span>' +
                '</div></div></article></div>';
            }
            section.innerHTML = html;
            document.querySelector('#count-top-pick').innerText = json.top_pick_for_you.length + ' shows available';
  
            // Musical Theater
            section = document.querySelector('#box-musical');
            html = '';
            for (var i = 0; i < json.musical_theater.length; i++) {
              var item = json.musical_theater[i];
              html += '<div class="col-6 col-md-4 col-lg-3">' +
                '<article class="show-card h-100">' +
                '<img src="' + item.image + '" alt="' + item.title + '">' +
                '<div class="show-info">' +
                '<h4>' + item.title + '</h4>' +
                '<div class="meta">' + item.language + ' | ' + item.city + ' | Runtime ' + item.runtime + '</div>' +
                '<div class="tags">' +
                '<span>Next: ' + item.nextShow + '</span>' +
                '<span class="rating">' + item.rating + '/10</span>' +
                '</div></div></article></div>';
            }
            section.innerHTML = html;
            document.querySelector('#count-musical').innerText = json.musical_theater.length + ' shows available';
  
            // Hindi Theater
            section = document.querySelector('#box-hindi');
            html = '';
            for (var i = 0; i < json.hindi_theater.length; i++) {
              var item = json.hindi_theater[i];
              html += '<div class="col-6 col-md-4 col-lg-3">' +
                '<article class="show-card h-100">' +
                '<img src="' + item.image + '" alt="' + item.title + '">' +
                '<div class="show-info">' +
                '<h4>' + item.title + '</h4>' +
                '<div class="meta">' + item.language + ' | ' + item.city + ' | Runtime ' + item.runtime + '</div>' +
                '<div class="tags">' +
                '<span>Next: ' + item.nextShow + '</span>' +
                '<span class="rating">' + item.rating + '/10</span>' +
                '</div></div></article></div>';
            }
            section.innerHTML = html;
            document.querySelector('#count-hindi').innerText = json.hindi_theater.length + ' shows available';
  
            // Comedy
            section = document.querySelector('#box-comedy');
            html = '';
            for (var i = 0; i < json.comedy.length; i++) {
              var item = json.comedy[i];
              html += '<div class="col-6 col-md-4 col-lg-3">' +
                '<article class="show-card h-100">' +
                '<img src="' + item.image + '" alt="' + item.title + '">' +
                '<div class="show-info">' +
                '<h4>' + item.title + '</h4>' +
                '<div class="meta">' + item.language + ' | ' + item.city + ' | Runtime ' + item.runtime + '</div>' +
                '<div class="tags">' +
                '<span>Next: ' + item.nextShow + '</span>' +
                '<span class="rating">' + item.rating + '/10</span>' +
                '</div></div></article></div>';
            }
            section.innerHTML = html;
            document.querySelector('#count-comedy').innerText = json.comedy.length + ' shows available';
  
            // Contemporary Drama
            section = document.querySelector('#box-contemporary');
            html = '';
            for (var i = 0; i < json.contemporary_drama.length; i++) {
              var item = json.contemporary_drama[i];
              html += '<div class="col-6 col-md-4 col-lg-3">' +
                '<article class="show-card h-100">' +
                '<img src="' + item.image + '" alt="' + item.title + '">' +
                '<div class="show-info">' +
                '<h4>' + item.title + '</h4>' +
                '<div class="meta">' + item.language + ' | ' + item.city + ' | Runtime ' + item.runtime + '</div>' +
                '<div class="tags">' +
                '<span>Next: ' + item.nextShow + '</span>' +
                '<span class="rating">' + item.rating + '/10</span>' +
                '</div></div></article></div>';
            }
            section.innerHTML = html;
            document.querySelector('#count-contemporary').innerText = json.contemporary_drama.length + ' shows available';
  
            // New
            section = document.querySelector('#box-new');
            html = '';
            for (var i = 0; i < json["new"].length; i++) {
              var item = json["new"][i];
              html += '<div class="col-6 col-md-4 col-lg-3">' +
                '<article class="show-card h-100">' +
                '<img src="' + item.image + '" alt="' + item.title + '">' +
                '<div class="show-info">' +
                '<h4>' + item.title + '</h4>' +
                '<div class="meta">' + item.language + ' | ' + item.city + ' | Runtime ' + item.runtime + '</div>' +
                '<div class="tags">' +
                '<span>Next: ' + item.nextShow + '</span>' +
                '<span class="rating">' + item.rating + '/10</span>' +
                '</div></div></article></div>';
            }
            section.innerHTML = html;
            document.querySelector('#count-new').innerText = json["new"].length + ' shows available';
  
            // Historic
            section = document.querySelector('#box-historic');
            html = '';
            for (var i = 0; i < json.historic.length; i++) {
              var item = json.historic[i];
              html += '<div class="col-6 col-md-4 col-lg-3">' +
                '<article class="show-card h-100">' +
                '<img src="' + item.image + '" alt="' + item.title + '">' +
                '<div class="show-info">' +
                '<h4>' + item.title + '</h4>' +
                '<div class="meta">' + item.language + ' | ' + item.city + ' | Runtime ' + item.runtime + '</div>' +
                '<div class="tags">' +
                '<span>Next: ' + item.nextShow + '</span>' +
                '<span class="rating">' + item.rating + '/10</span>' +
                '</div></div></article></div>';
            }
            section.innerHTML = html;
            document.querySelector('#count-historic').innerText = json.historic.length + ' shows available';
  
            // Upcoming Shows
            section = document.querySelector('#box-upcoming');
            html = '';
            for (var i = 0; i < json.upcoming_shows.length; i++) {
              var item = json.upcoming_shows[i];
              html += '<div class="col-6 col-md-4 col-lg-3">' +
                '<article class="show-card h-100">' +
                '<img src="' + item.image + '" alt="' + item.title + '">' +
                '<div class="show-info">' +
                '<h4>' + item.title + '</h4>' +
                '<div class="meta">' + item.language + ' | ' + item.city + ' | Runtime ' + item.runtime + '</div>' +
                '<div class="tags">' +
                '<span>Next: ' + item.nextShow + '</span>' +
                '<span class="rating">' + item.rating + '/10</span>' +
                '</div></div></article></div>';
            }
            section.innerHTML = html;
            document.querySelector('#count-upcoming').innerText = json.upcoming_shows.length + ' shows available';
          });
      });
})();

// ===== theater-speak.html =====
(function () {
  if (!document.body || document.body.dataset.page !== "theater-speak") return;
  document.addEventListener("DOMContentLoaded", function() {
        var menuBtn = document.querySelector(".menu-btn");
        var nav = document.querySelector(".nav");
        if (menuBtn && nav) {
          menuBtn.addEventListener("click", function() {
            menuBtn.classList.toggle("is-open");
            nav.classList.toggle("is-open");
          });
        }
      });
})();


