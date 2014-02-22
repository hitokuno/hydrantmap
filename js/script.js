// JavaScript Document

var j = jQuery.noConflict();

function clickFunc(){
	j('#searchBtn a').on('click',function(){
		j('#searchBox').slideToggle();
	});
	
	j('#search').on('click',function(){
		var season = j('#season').val();
		var cat = j('#cat').val();
		var location = j('#location').val();
		alert(season + " " + " " + cat + " " + location);
	});
	
	j('#card_btn').on('click',function(){
		var lat = j('#lat').val();//ido
		var lng = j('#lng').val();//keido
		var no = j('#no').val();

			//AJAX通信
			j.ajax({
				url : "check.php",
				type : "post",
				data : {
					ido: lat,
					keido: lng,
					no: no
				},
				datatype:'text',
				success: function(data) {
					if(data == 1){
						alert("おめでとう！カードGETだ！");
						localStorage.setItem('card'+no,1);
					}
					else {
						alert("だめだ！もっと近づくんだ！");
						localStorage.setItem('card'+no,0);
					}
				},
			});//ajax end
		
	});
	
}

 j(window).bind('load',function(){ //←windowオブジェクトにloadイベントをバインド
    setTimeout(function(){
	window.scrollTo(0,1);　//←windowオブジェクトを1ピクセルスクロール
　},1);
  });

j(document).ready(function(){
		clickFunc();
		
		j('tbody tr[data-href]').addClass('clickable').click( function() {
			window.location = j(this).attr('data-href');
		}).find('a').hover( function() {
			j(this).parents('tr').unbind('click');
		}, function() {
			j(this).parents('tr').click( function() {
				window.location = j(this).attr('data-href');
			});
		});
});


function moveSearch(){
	location.href = "search.php";
}