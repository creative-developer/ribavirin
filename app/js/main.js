////////// Responsive
// Breackpoints
let breakpoints = {
	xl: 1200,
	lg: 992,
	md: 768,
	sm: 576,
	xsm: 375,
};

// Media quares
let MQ = {
	wWidth: 0,
	isXL: false,
	isLG: false,
	isMD: false,
	isSM: false,
	isXSM: false,
	updateState: function () {
		this.wWidth = $(window).width();

		for (let key in breakpoints) {
			this['is' + key.toUpperCase()] = this.wWidth <= breakpoints[key];
		}
	},
};

MQ.updateState();

$(window).on('resize', function () {
	MQ.updateState();
});

////////// Common functions

// Popup opener
$('.js-popup').click(function (event) {
	event.preventDefault();
	let popupID = $(this).attr('href');

	mfpPopup(popupID);
});

// Mobile menu toggle
$('.js-menu').click(function () {
	$(this).toggleClass('is-active');
	$('.menu').toggleClass('opened');
});

// Phone input mask
$('input[type="tel"]').inputmask({
	mask: '+7 (999) 999-99-99',
	showMaskOnHover: false,
});

//fix header
function fixHeader() {
	var scrollTop = $(window).scrollTop();
	var header = $('.header');
	var headerHeight = header.height();

	if (scrollTop > headerHeight) {
		header.addClass('header--scrolled');
	} else {
		header.removeClass('header--scrolled');
	}
}
// on start page
fixHeader();
// on scroll
$(window).scroll(function () {
	fixHeader();
});

// Smooth scroll
$('.js-scroll, .menu__link').click(function(event) {
	event.preventDefault();
	var el = $(this).attr('href').replace('#','.');
	var headerTopOffset = $('.header').outerHeight();

	$('body, html').animate(
		{
			scrollTop: $(el).offset().top - headerTopOffset
		},
		700
	);

	if (MQ.isLG) {
		$('.js-menu').removeClass('is-active');
		$('.menu').removeClass('opened');
	}

	return false;
});

// Faq collapse
function faqCollapse() {

	$('.faq__item').click(function () {
		let faqCurrentBtn = $(this);
		let faqItem = $('.faq__item');
		let faqCurrentItem = faqCurrentBtn.closest('.faq__item')
		let faqDesc = faqCurrentItem.find('.faq__item-desc');

		faqItem.not(faqCurrentItem).removeClass('show');
		faqCurrentItem.toggleClass('show');
		$('.faq').find('.faq__item-desc').not(faqDesc).hide(300);
		faqDesc.slideToggle(300);

	});
};
faqCollapse();

let articleList = $('.where-buy-mobile');
let owlSettings = {
	loop: true,
	items: 1,
	margin: 0,
	nav: false,
	dots: true,
	dotsEach: 1
}

function articleSlider(){
	if ($('body').width() <= 576 ) {
		initOwl();
	} else {
		reInitOwl();
	}
}

articleSlider();

$(window).on('resize', function () {
	articleSlider();
});

function initOwl() {
	articleList.owlCarousel(owlSettings).addClass('owl-carousel').trigger('refresh.owl.carousel');
}

function reInitOwl() {
	articleList.trigger('destroy.owl.carousel').removeClass('owl-carousel');
}

function redirectYandexMoney(formData){
	const xhr = new XMLHttpRequest();
	const elPhone = $('#ya-form input[name="label"]');
	const elComment = $('#ya-form input[name="comment"]');
	
	xhr.open('GET', 'https://www.cbr-xml-daily.ru/daily_json.js')
	xhr.addEventListener('load', ()=>{
		const response = JSON.parse(xhr.responseText);
		let usdRate = response.Valute['USD'].Value;
		let inputVal = $('input[name="sum"]').val();
		let qnty = $('input[name="qty"]').val();
		let newValue = ((qnty * inputVal) * usdRate);

		elPhone.val(formData.data.name.value);
		elComment.val(`${formData.data.name.value} (${formData.data.phone.value})`);
		$('input[name="sum"]').val(newValue);
		$('#ya-form').submit();
	});
	xhr.send();
}

// E-mail Ajax Send
$('form:not(#ya-form)').submit(function (e) {
	e.preventDefault();
	let form = $(this);
	if ($(form.hasClass('order-form'))) {
		$('.order-form__btn').prop('disabled', true);
		$('.loader').fadeIn(300);
	}
	let formData = {};
	formData.data = {};

	// Serialize
	form.find('input, textarea').each(function () {
		let name = $(this).attr('name');
		let title = $(this).attr('data-name');
		let value = $(this).val();

		formData.data[name] = {
			title: title,
			value: value,
		};

		if (name === 'subject') {
			formData.subject = {
				value: value,
			};
			delete formData.data.subject;
		}
	});

	$.ajax({
		type: 'POST',
		url: 'mail/mail.php',
		dataType: 'json',
		data: formData,
	}).done(function (data) {
		if (data.status === 'success') {
			if (form.hasClass('order-form')) {
				redirectYandexMoney(formData);
			} else {
				if (form.closest('.mfp-wrap').hasClass('mfp-ready')) {
					form.find('.form-result').addClass('form-result--success');
				} else {
					mfpPopup('#success');
				}
	
				setTimeout(function () {
					if (form.closest('.mfp-wrap').hasClass('mfp-ready')) {
						form.find('.form-result').removeClass('form-result--success');
					}
					$.magnificPopup.close();
					form.trigger('reset');
				}, 3000);
			}
		} else {
			alert('Ajax result: ' + data.status);
			$('.loader').fadeOut(500);
		}
	});
	
	return false;
});


// tabs toggle
$('.tabs__link').click(function (e) {
	e.preventDefault();

	let tabs = $(this).closest('.tabs');
	let btns = tabs.find('.tabs__link');
	let contents = tabs.find('.tab__content');
	let tabID = $(this).attr('href');
	let capsule = $('.use__capsule-img img');

	// Toggle btn
	btns.removeClass('tabs__link--active');
	$(this).addClass('tabs__link--active');

	// Toggle content
	contents.removeClass('tab__content--active tab__content--fade_in');
	tabs.find(tabID).addClass('tab__content--active');
	setTimeout(function () {
		tabs.find(tabID).addClass('tab__content--fade_in');
	}, 10);

	// Toggle capsule
	capsule.removeClass('active');

	if (tabID === '#tab1') {
		capsule.eq(0).addClass('active');
	} else {
		capsule.eq(1).addClass('active');
	}
});


// init
var instance = $.fn.deviceDetector;
if (instance.isMacos()) {
	$('html').addClass('mac-os');
}

// QTY change
// increment
$('.qty__plus').click(function (e) { 
	e.preventDefault();
	const input = $(this).siblings('input');
	
	
	if (parseInt(input.val()) >= 1) {
		input.val(parseInt(input.val()) + 1)
	} else {
		input.val(1)
	}

	priceCalc();
});
// decrement
$('.qty__minus').click(function (e) { 
	e.preventDefault();
	const input = $(this).siblings('input');

	if (parseInt(input.val()) >= 2) {
		input.val(parseInt(input.val()) - 1)
	} else {
		input.val(1)
	}

	priceCalc();
});

function priceCalc() {
	const priceEl = $('.price__amount');
	const price = priceEl.attr('data-price');
	const calcPrice = price * Math.ceil($('.qty input').val());

	priceEl.children('.val').html(calcPrice.toFixed(2));
}

if (MQ.isMD) {
	$('.use__capsule-img img').eq(0).attr('src', 'img/use/capsule_sm.png');
	$('.use__capsule-img img').eq(1).attr('src', 'img/use/capsule2_sm.png');
}

////////// Ready Functions
$(document).ready(function () {
	//
});

////////// Load functions
$(window).on('load', function () {
	//
});

/////////// mfp popup - https://dimsemenov.com/plugins/magnific-popup/
let mfpPopup = function (popupID, source) {
	$.magnificPopup.open({
		items: {
			src: popupID,
		},
		type: 'inline',
		fixedContentPos: false,
		fixedBgPos: true,
		overflowY: 'auto',
		closeBtnInside: true,
		preloader: false,
		midClick: true,
		removalDelay: 300,
		closeMarkup: '<button type="button" class="mfp-close"><svg class="icon icon--close"><use xlink:href="img/svg-sprite.svg#close"></use></svg></button>',
		mainClass: 'mfp-fade-zoom',
		// callbacks: {
		// 	open: function() {
		// 		$('.source').val(source);
		// 	}
		// }
	});
};
