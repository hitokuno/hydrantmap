// 市町村の定義を読み込み、タイトルと変更、設定を保存
function setTitle(pref, city, ignorePrefix, mode) {
  var url="data/"+pref+"/CityFile.csv";
  var paramsArray = [];
  jQuery.ajax({
    async: true,
    url: url,
    cache: false,
    dataType: 'text'
  })
  .done(function(data) {
    var lines=data.split(/[\r\n?]/);
    for ( i = 0; i < lines.length; i++ ) {
      if ( lines[i]==="" ) { continue; }
      if ( lines[i].substr(0,1)===ignorePrefix ) { continue; }
      var param = lines[i].split("\t");
      if ( param[1] == city ) {
        var title=param[0]+"消火栓マップ";
        document.title = title;
        window.document.title = title;

        // 市町村毎の設定を保存
        //dataUrl delimiter ignorePrefix  id  title type  lat lng note  update
        $(".title").html(title);
        $("#cityName").val(param[0]);
        $("#dataUrl").val(param[2]);
        $("#delimiter").val(param[3]);
        $("#ignorePrefix").val(param[4]);
        $("#id").val(param[5]);
        $("#title").val(param[6]);
        $("#type").val(param[7]);
        $("#lat").val(param[8]);
        $("#lng").val(param[9]);
        $("#note").val(param[10]);
        $("#update").val(param[11]);
        readCSV(mode);
      }
    }
  })
  .fail(function(XMLHttpRequest, textStatus, errorThrown) {
    alert(errorThrown.message);
    console.log(errorThrown.message);
  })
  .always(function() {
  });
}

// URLからパラメータを取得
function getParams() {
  var url = location.href;
  var parameters = url.split("?");
  var params = parameters[1].split("&");
  var paramsArray = [];
  for ( i = 0; i < params.length; i++ ) {
    var param  = params[i].split("=");
    paramsArray.push(param[0]);
    paramsArray[param[0]]=param[1];
  }
  return paramsArray;
}

// DOMに設定された定義を使い、URLからデータを読み込み、Google Mapを表示
function readCSV(mode) {
  var url=$("#dataUrl").val();
  var delimiter=$("#delimiter").val();
  var ignorePrefix=$("#ignorePrefix").val();
  var columns={};
  columns["id"]     = $("#id").val();
  columns["title"]  = $("#title").val();
  columns["type"]   = $("#type").val();
  columns["lat"]    = $("#lat").val();
  columns["lng"]    = $("#lng").val();
  columns["note"]   = $("#note").val();
  columns["update"] = $("#update").val();
  jQuery.ajax({
    url: url,
    cache: false,
    dataType: 'text'
  })
  .done(function(data) {
    var params=getParams();
    var lat=params["lat"];
    var lng=params["lng"];
    var lines=data.split(/[\r\n?]/);
    if ( delimiter == "\\t" ) {
      delimiter="\t";
    }
    var paramsArray=[];
    for ( i = 1; i < lines.length; i++ ) {
      if ( lines[i]==="" ) { continue; }
      if ( lines[i].substr(0,1)===ignorePrefix ) { continue; }
      var param = lines[i].split(delimiter);
      paramsArray.push(param);
    }
    switch (mode) {
      case "closest":
        closest(lat, lng, columns, paramsArray);
        break;
      case "all":
        all(lat, lng, columns, paramsArray);
        break;
      case "search":
        search(columns, paramsArray);
        break;
      default:
        break;
    }
  })
  .fail(function(XMLHttpRequest, textStatus, errorThrown) {
    alert(errorThrown.message);
    console.log(errorThrown.message);
  })
  .always(function(paramArray) {
  });
}

// 全件表示
function all(lat, lng, columns, paramsArray) {
  var latlng = new google.maps.LatLng(lat,lng);
  // Google Mapで利用する初期設定用の変数  
  var mapOptions = {
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    center: latlng
  };
  var option = {
    zoom: 16,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    center: latlng
  };
  // GoogleMapの生成
  var gmap = new google.maps.Map(document.getElementById('map_canvas'),option);
  for ( i = 0; i < paramsArray.length; i++ ) {
    var imgName;
    var param=paramsArray[i];
    switch (param[columns["type"]]) {
      case "syoukasen":
      imgName="icon_hydrant";
      break;
      case "suisou":
      imgName="icon_hydrant2";
      break;
      default:
      imgName="icon_hydrant";
      break;
    }
    // マーカーを生成  
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(param[columns["lat"]], param[columns["lng"]]),
      title: param[columns["title"]],
      icon: "images/"+imgName+".png"
    });
    // マーカーを地図に表示  
    marker.setMap(gmap);
  }
}

// 住所やスポット名を中心として表示
function search(columns, paramsArray) {
  var address = $("#cityName").val()+"役所";
  var params=getParams();
  if( params["q"] !== ""){
    address = htmlspecialchars(params["q"]);
    // decode to Japanese charactors
    address = decodeURI(address);
  }
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({
    'address': address
  },function(result,status){
    if(status == google.maps.GeocoderStatus.OK){
      var latlng = result[0].geometry.location;
      var option = {
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: latlng
      };
      // GoogleMapの生成
      var gmap = new google.maps.Map(document.getElementById('map_canvas'),option);
      for ( i = 0; i < paramsArray.length; i++ ) {
        var imgName;
        var param=paramsArray[i];
        switch (param[columns["type"]]) {
          case "syoukasen":
            imgName="icon_hydrant";
            break;
          case "suisou":
            imgName="icon_hydrant2";
            break;
          default:
            imgName="icon_hydrant";
            break;
        }
        // マーカーを生成  
        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(param[columns["lat"]], param[columns["lng"]]),
          title: param[columns["title"]],
          icon: "images/"+imgName+".png"
        });
        // マーカーを地図に表示  
        marker.setMap(gmap);
      }
    }
  });
}

// 最寄りの消火栓までの経路を表示
function closest(lat, lng, columns, paramsArray) {
    var min_distance=40000;
    var min_data=[];
    for ( i = 0; i < paramsArray.length; i++ ) {
      var param=paramsArray[i];
      var distance=getDistanceFromLatLonInKm(lat,lng,param[columns["lat"]],param[columns["lng"]]);
      //FID_,MLinkX,MLinkY,title,type,bikou,date
      if ( min_distance > distance ) {
        min_distance=distance;
        min_data=paramsArray[i];
      }
    }
    calcRoute(lat,lng, min_data[columns["lat"]],min_data[columns["lng"]]);
    $("#id").text("管理番号："+min_data[columns["title"]]);
    $("#last_update").text("登録日："+min_data[columns["update"]]);
}

function calcRoute(lat,lng, min_lat,min_lng) {
  var current_latlng = new google.maps.LatLng(lat,lng);
  var dist_latlng = new google.maps.LatLng(min_lat,min_lng);
  rendererOptions = {
    draggable: true,
    preserveViewport:false
  };

  var directionsDisplay =
    new google.maps.DirectionsRenderer(rendererOptions);
  var map;
  var zoom = 7;
  var mapTypeId = google.maps.MapTypeId.ROADMAP;

  var opts = {
    zoom: zoom,
    mapTypeId: mapTypeId
  };
  map = new google.maps.Map
  (document.getElementById("map_canvas"),opts);
  directionsDisplay.setMap(map);

  google.maps.event.addListener(directionsDisplay,
    'directions_changed', function(){
    });
  var directionsService =
    new google.maps.DirectionsService();
  var request = {
    origin: current_latlng,
    destination: dist_latlng,
    travelMode: google.maps.DirectionsTravelMode.DRIVING,
    unitSystem: google.maps.DirectionsUnitSystem.METRIC,
    optimizeWaypoints: true,
    avoidHighways: false,
    avoidTolls: false
  };
  directionsService.route(request,
   function(response,status){
    if (status == google.maps.DirectionsStatus.OK){
      directionsDisplay.setDirections(response);
    }
  });
}

// calculates distances between the two points – using the ‘Haversine’ formula.
// http://stackoverflow.com/questions/27928/how-do-i-calculate-distance-between-two-latitude-longitude-points
function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}

