

/*****************************************
	GPS追跡
*****************************************/
	function $(id){
		return document.getElementById(id);
	}

	//変数、配列セット
	var trackerId = 0;
	var geocoder;
	var theUser = {};
	var map = {};
	
	//
	// 現在地取得(現在、GPS取得出来ない時のエラー表示などは未実装)
	//
	function init() {
		geocoder = new google.maps.Geocoder();
		if (navigator.geolocation){
			var gps = navigator.geolocation;
			gps.getCurrentPosition(function(pos){
				var latLng = new google.maps.LatLng(pos.coords.latitude,pos.coords.longitude);
				var opts = {zoom:12, center:latLng, mapTypeId: google.maps.MapTypeId.ROADMAP};
				map = new google.maps.Map($("map_canvas"), opts);
				theUser = new google.maps.Marker({
					position: latLng,
					map: map,
					title: "現在地"
				});
				showLocation(pos);
			});
			trackerId = gps.watchPosition(function(pos){
				var latLng = new google.maps.LatLng(pos.coords.latitude,pos.coords.longitude);
				map.setCenter(latLng);
				theUser.setPosition(latLng);
				showLocation(pos);
			});
		}
  }
	
	//
	// 住所表示
	//
	function showLocation(pos){
		var latLng = new google.maps.LatLng(pos.coords.latitude,pos.coords.longitude);
	    if (geocoder) {
	        geocoder.geocode({'latLng': latLng}, function(results, status) {
	          if (status == google.maps.GeocoderStatus.OK) {
	            if (results[1]) {
		            $("location").innerHTML = results[1].formatted_address;
	            } 
	          } 
	        });
	      }		
	}

/*****************************************
	twitter検索
*****************************************/

	//
	// GPS情報取得、検索呼び出し
	//
	function startSearch(){
		alert("検索を開始します");
		$("results").innerHTML = "<img src='loading.gif' style='text-align:center;' />";
		var gps = navigator.geolocation;
		if (gps){
			gps.getCurrentPosition(searchTwitter,
				function(error){
				  alert("エラー: " + error.code + " message: " + error.message);
			 });
		} else {
			searchTwitter();
		}
	}
	
	//
	// twitter検索
	//
	function searchTwitter(position){
		var query = "http://search.twitter.com/search.json?callback=showResults&q=";
		query += $("keywords").value;
		var km = $("km").value;
		if (position){
			var lat = position.coords.latitude;
			var long = position.coords.longitude;
			query += "&geocode=" + escape(lat + "," + long + "," + km);
		}
		var script = document.createElement("script");
		script.src = query;
		document.getElementsByTagName("head")[0].appendChild(script);
	}
	
	//
	// tweetへのリンク生成、テーブル表示呼び出し
	//
	function showResults(response){
		alert("検索を完了しました");
		var tweets = response.results;
		tweets.forEach(function(tweet){
			tweet.linkUrl = "http://twitter.com/" + tweet.from_user + "/status/" + tweet.id;
		});
		makeResultsTable(tweets);
	}
	
	//
	// tweetへのリンク生成、テーブル表示呼び出し
	//
	function makeResultsTable(tweets){
		var cnt = 1;
		var rows = tweets.map(function(tweet){
			cnt++;
			return createResult(tweet.from_user, tweet.profile_image_url, tweet.text, tweet.linkUrl, cnt % 2 == 0);
		});
		$("results").innerHTML = "<table id='resultsTable'></table>";
		rows.forEach(function(row){
			$("resultsTable").appendChild(row);
		});
	}
	function createResult(srcName, srcImgUrl, title, linkUrl, odd){
	    var resultsRow = document.createElement("tr");
	    if (odd){
	        resultsRow.setAttribute("class", "odd");
	    }
			
			//アイコン、ユーザー名用セルセット
	    var srcCell = document.createElement("th");
	    srcCell.setAttribute("class","src");
	    resultsRow.appendChild(srcCell);
			
			//twitterアイコンセット
	    var icon = document.createElement("img");
	    icon.src = srcImgUrl;
	    icon.setAttribute("alt", srcName);
	    icon.setAttribute("height", 48);
	    icon.setAttribute("width", 48);
	    srcCell.appendChild(icon);
			//twitterユーザー名セット
	    srcCell.appendChild(document.createTextNode(srcName));
			
			//tweet表示用セルセット
	    var messageCell = document.createElement("td");
	    messageCell.setAttribute("class","msg");
			//tweetへのリンクセット
	    var link = document.createElement("a");
	    link.setAttribute("href", linkUrl);
	    link.setAttribute("target", "_blank");
	    link.appendChild(document.createTextNode(title));
	    messageCell.appendChild(link);
	    resultsRow.appendChild(messageCell);
	    return resultsRow;
	}	