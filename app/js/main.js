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

// E-mail Ajax Send
$('form').submit(function (e) {
	e.preventDefault();

	let form = $(this);
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
		} else {
			alert('Ajax result: ' + data.status);
		}
	});
	return false;
});

// tabs toggle
$('.tabs__link').click(function(e) {
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
	setTimeout(function() {
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

// QTY change
// increment
$('.qty__plus').click(function (e) { 
	e.preventDefault();
	const input = $(this).siblings('input');
	
	input.val(parseInt(input.val()) + 1)

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
		closeMarkup: '<button type="button" class="mfp-close">&times;</button>',
		mainClass: 'mfp-fade-zoom',
		// callbacks: {
		// 	open: function() {
		// 		$('.source').val(source);
		// 	}
		// }
	});
};
