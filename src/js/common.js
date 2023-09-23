
function carousel() {
    var slider = tns({
        container: '.carousel__wrapper',
        items: 1,
        slideBy: 'page',
        speed: 800,
        // autoplay: true,
        controlsText: [
            '<img class="prev wow animate__slideInLeft" src="img/carousel/arrow_left.png" alt="Previous">',
            '<img class="next wow animate__slideInRight" src="img/carousel/arrow_right.png" alt="Next"></img>'
        ],
        onInit: function (info, eventName) {
            // Add the desired Animate.css classes to the initial active slide
            var activeSlide = info.slideItems[info.index];
            activeSlide.classList.add('animate__animated', 'animate__slideInRight');
        },
        onTransitionEnd: function (info, eventName) {
            // Remove the animation classes from all slides
            var allSlides = info.slideItems;
            allSlides.forEach(function (slide) {
                slide.classList.remove('animate__animated', 'animate__slideInRight');
            });
        
            // Get the active slide element
            var activeSlide = info.slideItems[info.index];
        
            // Add the desired Animate.css classes to the active slide
            activeSlide.classList.add('animate__animated', 'animate__fadeIn');
        }
        
    });
}

function catalog() {
    function flipItem(item) {
        const animationNameHide = 'animate__' + 'fadeOut',
            animationNameShow = 'animate__' + 'fadeIn',
            animationDuration = 350;
        const startHide = (elements) => {
                elements.forEach((element) => {
                    element.classList.add('animate__animated', animationNameHide);
                })
            },
            endHide = (elements) => {
                elements.forEach((element) => {
                    element.style.display = 'none'
                    element.classList.remove('animate__animated', animationNameHide);
                })
            },
            show = (elements) => {
                elements.forEach((element) => {
                    element.style.display = 'block';
                    element.classList.add('animate__animated', animationNameShow);
                })
            };

        var links = document.querySelectorAll('.catalog__item-more');
        links.forEach(link => {
            var item = link.closest('.catalog__item'),
                details = item.querySelector('.catalog__item-details'),
                img = item.querySelector('.catalog__item-img'),
                name = item.querySelector('.catalog__item-name'),
                descr = item.querySelector('.catalog__item-descr'),
                flipped = false,
                animationActive = false;
            link.addEventListener('click', function() {
                if (animationActive) return;
                animationActive = true;
                if (flipped) {
                    var toHide = [details],
                        toShow = [img, name, descr];
                    flipped = false;
                } else {
                    var toHide = [img, name, descr],
                        toShow = [details];
                        flipped = true;
                    }
                startHide(toHide);
                setTimeout(() => {
                    endHide(toHide);
                    show(toShow);
                    animationActive = false;
                }, animationDuration)
            })
        });
    }

    function buttonsFilter() {
        var catalog_items_all = document.querySelectorAll('.catalog__item'),
            catalog_items_run = document.querySelectorAll('[data-purpose="run"]'),
            catalog_items_triathlon = document.querySelectorAll('[data-purpose="triathlon"]'),
            catalog_items_visible = catalog_items_all,
            btn_fitness = document.querySelector('[data-btn-purpose="fitness"]'),
            btn_run = document.querySelector('[data-btn-purpose="run"]'),
            btn_triathlon = document.querySelector('[data-btn-purpose="triathlon"]'),
            catalog_items_animation_active = false;
    
        const animationDuration = 250, // --animate-duration from css (default 1000) in ms
            delayBetweenItems = 0,  // time between each item animation start (could be 0)
            animationNameHide = 'animate__' + 'fadeOut',
            animationNameShow = 'animate__' + 'fadeInUp';
    
        const isCurrentButton = (btn) => {
                return Array.from(btn.classList).includes('btn_catalog-nav--active');
            },
            catalog_btn_get_current = () => {
                return document.querySelector('.btn_catalog-nav--active');
            },
            catalog_btn_switch_active = (btn) => {
                catalog_btn_get_current().classList.remove('btn_catalog-nav--active');
                btn.classList.add('btn_catalog-nav--active');
            },
            catalog_items_start_hide_animation = (items_to_hide) => {
                items_to_hide.forEach((item, index) => {
                    item.style.animationDelay = `${(index) * delayBetweenItems}ms`; // Delay each item's animation
                    item.classList.add('animate__animated', animationNameHide);
                });
            },
            catalog_items_end_hide_animation = (items_to_hide) => {
                items_to_hide.forEach((item) => {
                    item.style.display = 'none';
                    item.style.animationDelay = ''; // Reset animation delay
                    item.classList.remove('animate__animated', animationNameHide);
                    item.classList.remove('catalog__item--flipped');
                });
            },
            catalog_items_show = (items_to_show) => {
                items_to_show.forEach((item, index) => {
                    item.style.display = 'flex';
                    item.classList.add('animate__animated', animationNameShow);
                    item.style.animationDelay = `${index * delayBetweenItems}ms`; // Delay each item's animation
                });
            };
            
        [
            [catalog_items_all, btn_fitness],
            [catalog_items_run, btn_run],
            [catalog_items_triathlon, btn_triathlon]
        ].forEach(([items_to_show, btn]) => {
            btn.addEventListener("click", function() {
                if (catalog_items_animation_active || isCurrentButton(btn)) return; 
                catalog_btn_switch_active(btn);
                catalog_items_animation_active = true;
                catalog_items_start_hide_animation(catalog_items_visible);
                const totalDuration = animationDuration + (catalog_items_visible.length-1) * delayBetweenItems;
                setTimeout(() => {
                    catalog_items_end_hide_animation(catalog_items_visible); 
                    catalog_items_show(items_to_show);
                    catalog_items_visible = items_to_show;
                    catalog_items_animation_active = false;
                }, totalDuration); // Wait for fadeOut animations to complete before showing items
            });
        });
    }

    flipItem();
    buttonsFilter();
}

document.addEventListener('DOMContentLoaded', function() {
    new WOW().init();
    carousel();
    catalog();
});
