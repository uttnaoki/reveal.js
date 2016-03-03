// サイズを設定
// ウィンドウサイズによって可変する
var size = {
  width : 600,
  height: 600
};

// 円グラフの表示データ
var data = [
  60,
  30,
  10
];

// d3用の変数
var win   = d3.select(window), //←リサイズイベントの設定に使用します
    svg   = d3.select("#chart"),
    pie   = d3.layout.pie().value(function(d){ return d; }),
    arc   = d3.svg.arc().innerRadius(0);


// グラフの描画
// 描画処理に徹して、サイズに関する情報はupdate()内で調整する。
function render(){

  // グループの作成
  var g = svg.selectAll(".arc")
    .data(pie(data))
    .enter()
    .append("g")
      .attr("class", "arc");

  // 円弧の作成
  g.append("path").attr("stroke", "white");

  // データの表示
  g.append("text")
    .attr("dy", ".35em")
    .style("text-anchor", "middle")
    .text(function(d){ return d.data; });
}


// グラフのサイズを更新
function update(){

  // 自身のサイズを取得する
  size.width = parseInt(svg.style("width"));
  size.height = parseInt(svg.style("height")); //←取得はしていますが、使用していません...

  // 円グラフの外径を更新
  arc.outerRadius(size.width / 2);

  // 取得したサイズを元に拡大・縮小させる
  svg
    .attr("width", size.width)
    .attr("height", size.width);

  // それぞれのグループの位置を調整
  var g = svg.selectAll(".arc")
    .attr("transform", "translate(" + (size.width / 2) + "," + (size.width / 2) + ")");

  // パスのサイズを調整
  g.selectAll("path").attr("d", arc);

  // テキストの位置を再調整
  g.selectAll("text").attr("transform", function(d){ return "translate(" + arc.centroid(d) + ")"; });
}


// 初期化
render();
update();
win.on("resize", update); // ウィンドウのリサイズイベントにハンドラを設定
