function setTitle(pref, city) {
  var url="data/"+pref+"/CityFile.csv";
  var paramsArray = [];
  jQuery.ajax({
    async: false,
    url: url,
    cache: false,
    dataType: 'text'
  })
  .done(function(data) {
    var lines=data.split(/[\r\n?]/);
    for ( i = 0; i < lines.length; i++ ) {
      if ( lines[i]==="" ) { continue; }
      var param = lines[i].split("\t");
      if ( param[1] == city ) {
        var title=param[0]+"消火栓マップ";
        document.title = title;
        window.document.title = title;
        $(".title").html(title);
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

