$(document).ready(function () {
	
	var $hnav1 = $('#hnav1'),
	$hnav2 = $('#hnav2'),
	$hnav3 = $('#hnav3');

	var hnavDiv1=document.getElementById("lr211"),
	hnavDiv2=document.getElementById("lr212"),
	hnavDiv3=document.getElementById("lr213");

	/******* Nav click start *************************************************************/
	$hnav1.click(function() {
		resetNav();
		hnavDiv1.style.backgroundColor = "#eee";
		hnav1.src = "../image/home_nav/hn11.png";
	});
	$hnav2.click(function() {
		resetNav();
		hnavDiv2.style.backgroundColor = "#eee";
		hnav2.src = "../image/home_nav/hn21.png";
	});
	$hnav3.click(function() {
		resetNav();
		hnavDiv3.style.backgroundColor = "#eee";
		hnav3.src = "../image/home_nav/hn31.png";
	});
	/*$hnav4.click(function() {
		resetNav();
		hnavDiv4.style.backgroundColor = "#eee";
		hnav4.src = "../image/home_nav/hn41.png";
	});
	$hnav5.click(function() {
		resetNav();
		hnavDiv5.style.backgroundColor = "#eee";
		hnav5.src = "../image/home_nav/hn51.png";
	});
	$hnav6.click(function() {
		resetNav();
		hnavDiv6.style.backgroundColor = "#eee";
		hnav6.src = "../image/home_nav/hn61.png";
	});
	$hnav7.click(function() {
		resetNav();
		hnavDiv7.style.backgroundColor = "#eee";
		hnav7.src = "../image/home_nav/hn71.png";
	});*/
	function resetNav() {
		hnavDiv1.style.backgroundColor = "#262c43";
		hnavDiv2.style.backgroundColor = "#262c43";
		hnavDiv3.style.backgroundColor = "#262c43";
		//reset images
		hnav1.src = "../image/home_nav/hn10.png";
		hnav2.src = "../image/home_nav/hn20.png";
		hnav3.src = "../image/home_nav/hn30.png";
	}
    /******* Nav click end ***************************************************************/
    $show = $('#show')
    $uiShow = $('#uiShow')
    $topRight = $('#topRight')
    $show.click(function () {
        var x = $topRight.height();
        var y = $topRight.width()-$uiShow.width();
        $uiShow.css(
            {"margin-left":y,
                "margin-top":x,
                "color": '#262C43'});
    })
})