var root = {
  "name": "bubble",
  "children": [{
    "name": "Domain Explicit Communication"
  }, {
    "name": "Domain Implicit Communication"
  }, {
    "name": "Domain Permission Enforcement"
  }, {
    "name": "Domain Permission Granted"
  }, {
    "name": "Domain Permission Usage"
  }, {
    "name": "Analysis Results"
  }]
};

var w = window.innerWidth;
var h = Math.ceil(w * 0.5);
var oR = 0;
var nTop = 0;

var svgContainer = d3.select("#mainBubble")
    .style("height", h + "px");

var svg = d3.select("#mainBubble").append("svg")
    .attr("class", "mainBubbleSVG")
    .attr("width", w)
    .attr("height", h)
    .on("mouseleave", function() {
      return resetBubbles();
	});

// var mainNote = svg.append("text")
//     .attr("id", "bubbleItemNote")
//     .attr("x", 10)
//     .attr("y", h) //w / 2 - 15
//     .attr("font-size", 12)
//     .attr("dominant-baseline", "middle")
//     .attr("alignment-baseline", "middle")
//     .style("fill", "#888888")
//     .text(function(d) { return "DELDroid Visualization"; });

var bubbleObj = svg.selectAll(".topBubble")
    .data(root.children)
    .enter().append("g")
    .attr("id", function(d, i) { return "topBubbleAndText_" + i; });

nTop = root.children.length;
oR = w / (1 + 3 * nTop);

h = Math.ceil(w / nTop * 2.5);
svgContainer.style("height", h + "px");

var colVals = d3.scale.category10();

bubbleObj.append("circle")
    .attr("class", "topBubble")
    .attr("id", function(d, i) { return "topBubble" + i; })
    .attr("r", function(d) { return oR; })
    .attr("cx", function(d, i) { return oR * (3 * (1 + 3 + i % 3) - 1); })
    .attr("cy", function(d, i) {
      if (i < 3) {
          return (h + oR) / 4;
      } else {
          return (h + oR) / 1.5;
      }
    })
    .style("fill", function(d, i) { return colVals(i); }) // #1f77b4
    .style("opacity", 0.3)
    .on("mouseover", function(d, i) { return activateBubble(d, i); });

bubbleObj.append("text")
    .attr("class", "topBubbleText")
    .attr("x", function(d, i) { return oR * (3 * (1 + 3 + i % 3) - 1); })
    .attr("y", function(d, i) {
      if (i < 3) {
          return (h + oR) / 4;
      } else {
          return (h + oR) / 1.5;
      }
    })
    .style("fill", function(d, i) { return colVals(i); }) // #1f77b4
    .attr("font-size", 10)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .attr("alignment-baseline", "middle")
    .text(function(d) { return d.name; })
    .on({
    	"mouseover": function(d, i) {
    		d3.select(this).style("cursor", "pointer");
    		return activateBubble(d, i); 
    	},
    	"click": function(d, i) {
    		if (d.name === "Analysis Results") {
	    		drawChord("","","","")
	    	} else {
	    		var csvNameSplit = d.name.split(" ");
	    		var csvName = csvNameSplit[0].toLowerCase();
	    		for (var i = 1; i < csvNameSplit.length; i++) {
	    			csvName = csvName.concat("-");
	    			csvName = csvName.concat(csvNameSplit[i].toLowerCase());
	    		}
	    		csvName = csvName.concat("-1.csv");
	    		drawChart(csvName);
	    	}
    		
    		return smallBubbles();
	    }
	});

smallBubbles = function() {
	d3.select("svg").remove();

	var w1 = window.innerWidth;
	var h1 = Math.ceil(w1 * 0.078);
	var oR1 = 0;
	var nTop1 = 0;

	var svgContainer = d3.select("#mainBubble")
		.style("height", h1 + "px");

	var svg = d3.select("#mainBubble").append("svg")
	    .attr("class", "mainBubbleSVG")
	    .attr("width", w1)
	    .attr("height", h1);

	var bubbleObj = svg.selectAll(".topBubble")
	    .data(root.children)
	    .enter().append("g")
	    .attr("id", function(d, i) { return "topBubbleAndText_" + i; });

	nTop = root.children.length;
	oR = w1 / (1 + 5 * nTop);

	var colVals = d3.scale.category10();

	bubbleObj.append("circle")
	    .attr("class", "topBubble")
	    .attr("id", function(d, i) { return "topBubble" + i; })
	    .attr("r", function(d) { return oR; })
	    .attr("cx", function(d, i) { return oR * (3 * (1 + i) - 1); })
	    .attr("cy", h1 / 2)
	    .style("fill", function(d, i) { return colVals(i); }) // #1f77b4
	    .style("opacity", 0.3)
	    .on({
	    	"mouseover": function(d, i) {
	    		d3.select(this).style("cursor", "pointer");
		    	d3.select("#topBubbleText" + i).style("opacity", 1);
	    	},
	    	"mouseout": function(d, i) {
	    		d3.select("#topBubbleText" + i).style("opacity", 0);
	    	}
		});

	bubbleObj.append("text")
	    .attr("class", "topBubbleText")
	    .attr("id", function(d, i) { return "topBubbleText" + i; })
	    .attr("x", function(d, i) { return oR * (3 * (1 + i) - 1); })
	    .attr("y", h1 / 2)
	    .style("fill", function(d, i) { return colVals(i); })
	    .style("opacity", 0)
	    .attr("font-size", 10)
	    .attr("font-weight", "bold")
	    .attr("text-anchor", "middle")
	    .attr("dominant-baseline", "middle")
	    .attr("alignment-baseline", "middle")
	    .text(function(d) { return d.name; })
	    .on({
	    	"mouseover": function(d, i) {
	    		d3.select(this).style("cursor", "pointer");
		    	d3.select("#topBubbleText" + i).style("opacity", 1);
	    	},
	    	"mouseout": function(d, i) {
	    		d3.select("#topBubbleText" + i).style("opacity", 0);
	    	},
	    	"click": function(d, i) {
	    		if (d.name === "Analysis Results") {
	    			// drawChord("", "", "", "");
	    			drawChord("","","","")
	    		} else {
		    		var csvNameSplit = d.name.split(" ");
		    		var csvName = csvNameSplit[0].toLowerCase();
		    		for (var i = 1; i < csvNameSplit.length; i++) {
		    			csvName = csvName.concat("-");
		    			csvName = csvName.concat(csvNameSplit[i].toLowerCase());
		    		}
		    		csvName = csvName.concat("-1.csv");
		    		drawChart(csvName);
	    		}
	    	}
		});
}

resetBubbles = function() {
    w = window.innerWidth;
    oR = w / (1 + 3 * nTop);

    h = Math.ceil(w / nTop * 2.5);
    svgContainer.style("height", h + "px");

    // mainNote.attr("y", h - 15);

    svg.attr("width", w);
    svg.attr("height", h);

    // d3.select("#bubbleItemNote").text("DELDroid Visualization");

    var t = svg.transition()
        .duration(650);

    t.selectAll(".topBubble")
        .attr("r", function(d) { return oR; })
        .attr("cx", function(d, i) { return oR * (3 * (1 + 3 + i % 3) - 1); })
        .attr("cy", function(d, i) {
          if (i < 3) {
              return (h + oR) / 4;
          } else {
              return (h + oR) / 1.5;
          }
        });

    t.selectAll(".topBubbleText")
        .attr("font-size", 10)
        .attr("font-weight", "normal")
        .attr("x", function(d, i) { return oR * (3 * (1 + 3 + i % 3) - 1); })
        .attr("y", function(d, i) {
          if (i < 3) {
              return (h + oR) / 4;
          } else {
              return (h + oR) / 1.5;
          }
        });
}

function activateBubble(d, i) {
  // increase this bubble and decrease others
  var t = svg.transition()
      .duration(d3.event.altKey ? 7500 : 350);

  t.selectAll(".topBubble")
    .attr("cx", function(d, ii) {
      if (i == ii) {
          // Nothing to change
          if (ii < 3) {
              return oR * (3 * (1 + ii + 3) - 1) - 0.6 * oR * (ii + 3 - 1);
          } else {
              return oR * (3 * (1 + ii) - 1) - 0.6 * oR * (ii - 1);
          }
      } else {
          // Push away a little bit
          if (i % 3 == 0) {
              if (ii < 3) { 
                  return oR * (nTop * 3 + 1) - oR * 0.6 * (3.5 * (nTop - (ii + 3)) - 1);
              } else {
                  return oR * (nTop * 3 + 1) - oR * 0.6 * (3.5 * (nTop - ii) - 1);
              }
          } else if (i % 3 == 2) {
              if (ii < 3) {
                  return oR * 0.6 * (3.5 * (1 + ii + 3) - 1);
              } else {
                  return oR * 0.6 * (3.5 * (1 + ii) - 1);
              }
          } else if (i == 1) {
              if (ii == 0) {
                  return oR * 0.6 * (3.5 * (1 + ii + 3) - 1);
              } else if (ii == 3) {
                  return oR * 0.6 * (3.5 * (1 + ii) - 1);
              } else if (ii == 2) {
                  return oR * (nTop * 3 + 1) - oR * 0.6 * (3.5 * (nTop - (ii + 3)) - 1);
              } else {  // ii == 5
                  return oR * (nTop * 3 + 1) - oR * 0.6 * (3.5 * (nTop - ii) - 1);
              }
          } else {	// i == 4
          	  if (ii == 0 || ii == 1) {
                  return oR * 0.6 * (3.5 * (1 + ii + 3) - 1);
              } else if (ii == 3) {
                  return oR * 0.6 * (3.5 * (1 + ii) - 1);
              } else if (ii == 2) {
                  return oR * (nTop * 3 + 1) - oR * 0.6 * (3.5 * (nTop - (ii + 3)) - 1);
              } else {  // ii == 5
                  return oR * (nTop * 3 + 1) - oR * 0.6 * (3.5 * (nTop - ii) - 1);
              }
          }
      }
    })
    .attr("r", function(d, ii) {
      if (i == ii)
          return oR * 1.8;
      else
          return oR * 0.8;
    });

  t.selectAll(".topBubbleText")
    .attr("x", function(d, ii) {
      if (i == ii) {
          // Nothing to change
          if (ii < 3) {
              return oR * (3 * (1 + ii + 3) - 1) - 0.6 * oR * (ii + 3 - 1);
          } else {
              return oR * (3 * (1 + ii) - 1) - 0.6 * oR * (ii - 1);
          }
      } else {
          // Push away a little bit
          if (i % 3 == 0) {
              if (ii < 3) { 
                  return oR * (nTop * 3 + 1) - oR * 0.6 * (3.5 * (nTop - (ii + 3)) - 1);
              } else {
                  return oR * (nTop * 3 + 1) - oR * 0.6 * (3.5 * (nTop - ii) - 1);
              }
          } else if (i % 3 == 2) {
              if (ii < 3) {
                  return oR * 0.6 * (3.5 * (1 + ii + 3) - 1);
              } else {
                  return oR * 0.6 * (3.5 * (1 + ii) - 1);
              }
          } else if (i == 1) {
              if (ii == 0) {
                  return oR * 0.6 * (3.5 * (1 + ii + 3) - 1);
              } else if (ii == 3) {
                  return oR * 0.6 * (3.5 * (1 + ii) - 1);
              } else if (ii == 2) {
                  return oR * (nTop * 3 + 1) - oR * 0.6 * (3.5 * (nTop - (ii + 3)) - 1);
              } else {  // ii == 5
                  return oR * (nTop * 3 + 1) - oR * 0.6 * (3.5 * (nTop - ii) - 1);
              }
          } else {	// i == 4
          	  if (ii == 0 || ii == 1) {
                  return oR * 0.6 * (3.5 * (1 + ii + 3) - 1);
              } else if (ii == 3) {
                  return oR * 0.6 * (3.5 * (1 + ii) - 1);
              } else if (ii == 2) {
                  return oR * (nTop * 3 + 1) - oR * 0.6 * (3.5 * (nTop - (ii + 3)) - 1);
              } else {  // ii == 5
                  return oR * (nTop * 3 + 1) - oR * 0.6 * (3.5 * (nTop - ii) - 1);
              }
          }
      }
    })
    .attr("font-size", function(d, ii) {
      if (i == ii)
          return 10 * 1.5;
      else
          return 10 * 0.6;
    })
    .attr("font-weight", function(d, ii) {
      if (i == ii)
          return "bold";
      else
          return "normal";
    });
}



window.onresize = resetBubbles;
