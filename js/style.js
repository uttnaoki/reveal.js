// サイズを設定
// ウィンドウサイズによって可変する
var size = {
  width : 600,
  height: 600
};

// 円グラフの表示データ
var data = [
  {legend:"React", value:40, color:"#e74c3c"},
  {legend:"Ember.js", value:10, color:"#f39c12"},
  {legend:"Knockout.js", value:15, color:"#16a085"},
  {legend:"Backbone.js", value:25, color:"#d35400"},
  {legend:"AngularJS", value:30, color:"#2c3e50"}
];

// d3用の変数
var win   = d3.select(window), //←リサイズイベントの設定に使用します
    svg   = d3.select("#chart"),
    pie   = d3.layout.pie().sort(null).value(function(d){ return d.value; }),
    arc   = d3.svg.arc().innerRadius(40);

// アニメーション終了の判定フラグ
var isAnimated = false;


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
  g.append("path")
    .attr("stroke", "white")
    .attr("fill", function(d){ return d.data.color; });

  // データの表示
  var maxValue = d3.max(data,function(d){ return d.value; });

  g.append("text")
    .attr("dy", ".35em")
    .attr("font-size", function(d){ return d.value / maxValue * 20; }) //最大のサイズを20に
    .style("text-anchor", "middle")
    .text(function(d){ return d.data.legend; });
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
  // アニメーションが終了していない場合はサイズを設定しないように
  if( isAnimated ){
    g.selectAll("path").attr("d", arc);
  }

  // テキストの位置を再調整
  g.selectAll("text").attr("transform", function(d){ return "translate(" + arc.centroid(d) + ")"; });
}


// グラフのアニメーション設定
function animate(){
  var g = svg.selectAll(".arc"),
      length = data.length,
      i = 0;

  g.selectAll("path")
    .transition()
    .ease("cubic-out")
    .delay(500)
    .duration(1000)
    .attrTween("d", function(d){
      var interpolate = d3.interpolate(
        {startAngle: 0, endAngle: 0},
        {startAngle: d.startAngle, endAngle: d.endAngle}
      );
      return function(t){
        return arc(interpolate(t));
      };
    })
    .each("end", function(transition, callback){
      i++;
      isAnimated = i === length; //最後の要素の時だけtrue
    });
}


// 初期化
render();
update();
animate();
win.on("resize", update); // ウィンドウのリサイズイベントにハンドラを設定
