var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-57044-26']);
_gaq.push(['_trackPageview']);

function trackLi(li_id) {
    _gaq.push(['_trackEvent', 'li' + li_id, 'clicked']);
  };

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();