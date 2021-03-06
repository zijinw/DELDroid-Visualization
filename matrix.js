var previousMatrixType = "";
var columnData = new Array();
var columnDataWithWord = new Array();
var packages = new Array();
var components = new Array();
var index = -1;
var ids = new Array();
var data = new Array();
var columnData = new Array();
var columnDataWithWord = new Array();

var drawChart = function(csvFile, matrixType) {


	if (previousMatrixType !== matrixType) {
		columnData = new Array();
		columnDataWithWord = new Array();
		packages = new Array();
		components = new Array();
		index = -1;
		ids = new Array();
		data = new Array();
		columnData = new Array();
		columnDataWithWord = new Array();
	}
	
	var fileNameArray = csvFile.split(".")[0];
	fileNameArray = fileNameArray.split("-");
	var fileName = "";
	for (var i = 0; i < 3; i++) {
		fileName += capitalizeFirstLetter(fileNameArray[i]) + " ";
	}

	d3.select("#chord").remove();
	d3.select("#detailTable").remove();
	d3.select("#matrix").remove();

	d3.csv(csvFile, function(error, csvdata) {
		if (error) {
			console.log(error);
		}
		var longestRowLabel = 0;
		if (previousMatrixType !== matrixType) {
			for (var i = 0; i < csvdata.length; i++) {
				packages.push(csvdata[i].Package);
				longestRowLabel = Math.max(longestRowLabel, csvdata[i].Component.length);
				components.push(csvdata[i].Component);		//Todo: parse component name
				ids.push(i);
				if (csvFile.includes("permission") && i == 0) {
					var temp = new Array();
					temp = Object.keys(csvdata[i]);
					for (j = 3; j < temp.length - 1; j++) {
						columnDataWithWord.push(temp[j]);
						columnData.push(temp[j].split(" ")[0]);
					}
				}
			}
		}
		if (csvFile.includes("permission")) {
			for (var i = 0; i < csvdata.length; i++) {
				for (var j = 0; j < columnData.length; j++) {
					var tempObj = {Id1: i, Id2: j, Value: csvdata[i][columnDataWithWord[j]]};
					data.push(tempObj);
				}
			}
		} else {
			for (var i = 0; i < csvdata.length; i++) {
				for (var j = 0; j < csvdata.length; j++) {
					var tempObj = {Id1: i, Id2: j, Value: csvdata[i][j]}
					data.push(tempObj);
				}
			}
		}
		var margin = { top: 50, right: 0, bottom: 100, left: 200 };
		if (longestRowLabel * 5.8 > 200) {
			margin.left = longestRowLabel * 5.8;
		}	    
		var width = 1200 - margin.left - margin.right,
	    height = 800 - margin.top - margin.bottom,
	    gridSize = Math.floor(width / 24),
	    buckets = 2,
	    colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"]; 


		var svg = d3.select("#chartArea").append("svg")
			.attr("id", "matrix")
			.attr("width", width + margin.left + margin.right + components.length * gridSize)
			.attr("height", height + margin.top + margin.bottom + components.length * gridSize)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var rowLabels = svg.selectAll(".rowLabel")
	    	.data(components)
	    	.enter().append("text")
	    	.text(function (d) { return d; })
	    	.attr("x", 0)
	    	.attr("y", function (d, i) { return i * gridSize; })
	    	.style("text-anchor", "end")
	    	.attr("transform", "translate(-6," + gridSize / 1.5 + ")")
	    	.attr("class", "mono axis");

		if (csvFile.includes("permission")) {
			var colLabels = svg.selectAll(".colLabel")
		    	.data(columnData)
		    	.enter().append("text")
		    	.text(function(d) { return d; })
		    	.attr("x", function(d, i) { return i * gridSize; })
		    	.attr("y", 0)
		    	.style("text-anchor", "middle")
		    	.attr("transform", "translate(" + gridSize / 2 + ", -6)")
		    	.attr("class", "mono axis");
		} else {
			var colLabels = svg.selectAll(".colLabel")
		    	.data(ids)
		    	.enter().append("text")
		    	.text(function(d) { return d; })
		    	.attr("x", function(d, i) { return i * gridSize; })
		    	.attr("y", 0)
		    	.style("text-anchor", "middle")
		    	.attr("transform", "translate(" + gridSize / 2 + ", -6)")
		    	.attr("class", "mono axis");
		}

	    var colorScale = d3.scale.quantile()
	        .domain([0, buckets - 1, 1])
	        .range(colors);

	    var cards = svg.selectAll(".hour")
	        .data(data, function(d) {return d.Id1+':'+d.Id2;});

	    cards.append("title");

	    cards.enter().append("rect")
	        .attr("x", function(d) { return (d.Id2) * gridSize; })
	        .attr("y", function(d) { return (d.Id1) * gridSize; })
	        .attr("rx", 4)
	        .attr("ry", 4)
	        .attr("class", "hour bordered")
	        .attr("width", gridSize)
	        .attr("height", gridSize)
	        .style("fill", colors[0])
	        .on({
	        	'mouseover': function(d) {
	        		if (d.Value === "1") {
	        			d3.select(this).style("cursor", "pointer");
	        		}
	        	},
	        	'click': function(d) {
		        	if (d.Value === "1") {
						drawChord("fromMatrix", d.Id1, d.Id2, "0", fileName, csvFile.includes("permission"), columnDataWithWord);
		        	}
		        }
		    });

	    cards.transition().duration(1000)
	        .style("fill", function(d) { return colorScale(d.Value); });

	    cards.select("title").text(function(d) { return d.Value; });
	          
	    cards.exit().remove();
	});
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

