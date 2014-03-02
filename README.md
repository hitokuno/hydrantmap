[全国消火栓マップ](http://http://openpublic.sakura.ne.jp/hydrantmap/js/index.html)
=====================

全国の消火栓情報を地図に表示します。  
データファイルを修正するだけで市町村を追加出来ます。

インストール方法
--------
特別にインストールは不要です。  
 全てのファイルをWebブラウザからアクセス出来る場所に置いて下さい。  
アクセスはindex.htmlにアクセスする事で実行出来ます。

市町村追加方法
--------
1.  県を選択肢に表示させる為、data/PREF.txtを修正する。  
 * 先頭文字列の#を除くと選択出来ます。  
 * 文字コードUTF、タブ区切りで保存して下さい。  

 記入例 :  
  `#山形県	Yamagata`  <= 表示されません  
 `福島県	Fukushima` <= 表示されます  


2. data/**県**/CityFile.txtにある市町村ファイルの情報を修正する  
 * 先頭文字列の#を除くと選択出来ます。  
 * 文字コードUTF、タブ区切りで保存して下さい。  
 * dlimiter: データファイルの区切り文字。 タブ区切りは\tとして下さい。
 * ignorePrefix: 無視する行の先頭文字。 通常は#として下さい。
 * id: データファイル内のID列の列番号。  
 先頭列は０から始めます。
 * title: データファイル内の表示列の列番号。  
 先頭列は０から始めます。
 * type: データファイル内のtype列の列番号。  
 先頭列は０から始めます。  
 有効な選択肢はsyoukasenとsuisouだけです。一致しない場合は消火栓となります。
 * lat: データファイル内の緯度列の列番号。  
 先頭列は０から始めます。 
 * lng: データファイル内の経度列の列番号。  
 先頭列は０から始めます。 
 * note: データファイル内のメモ列の列番号。  
 先頭列は０から始めます。 
 * update: データファイル内の更新日列の列番号。  
 先頭列は０から始めます。 

 `CITY_JP	City	dataUrl	delimiter	ignorePrefix	id	title	type	lat	lng	note	update`  
 `#いわき市	Iwaki`   <= 表示されません  
 `会津若松市	Aizuwakamatsu	data/Fukushima/Aizuwakamatsu.csv	,	#	0	3	4	2	1	5	6`

3. 上記ファイルで指定したURLに市町村のデータファイルを保存する。

License
--------
[Creative Commons Attribution 4.0 International License](http://creativecommons.org/licenses/by/4.0/)

Auther
--------
[Code for Aizu](http://aizu.io/)
