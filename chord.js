var datasets = ["domain-explicit-communication-5.csv", "domain-implicit-communication-5.csv", "domain-permission-enforcement-5.csv",
	"domain-permission-granted-5.csv", "domain-permission-usage-5.csv"];


var packages = new Array();
var components = new Array();
var peattack = {};
var isattack = {};
var uaattack = {};
var excludeApp = {}; // In order to simplify the chord chart
var margin = {left:90, top:90, right:90, bottom:90},
 	width =  window.innerWidth * 0.85 - margin.left - margin.right,
  	height =  1000 - margin.top - margin.bottom,
  	innerRadius = Math.min(width, height) * .29,
  	outerRadius = innerRadius * 1.1;

var matrix = new Array();
getMatrix(matrix).pipe(processMatrix(matrix));

var drawChord = function(type, Id1, Id2, flag) {
// function drawChord(matrix, type, Id1, Id2, flag) {
	// var d = $.Deferred();
	console.log(excludeApp)
	d3.select("#matrix").remove();
	d3.select("#chord").remove();
	////////////////////////////////////////////////////////////
    //////////////////////// Set-Up ////////////////////////////
    ////////////////////////////////////////////////////////////
    var names = components,
    //   lineColors = ["#5b7cd8", "#e0663a", "#5db24a"],
    //   opacityDefault = 0.8;
    	colors = d3.scale.category10(),
      	opacityDefault = 0.8;
    ////////////////////////////////////////////////////////////
    /////////// Create scale and layout functions //////////////
    ////////////////////////////////////////////////////////////
    // var colors = d3.scale.ordinal()
    //     .domain(d3.range(names.length))
    //   	.range(colors);

    var chord = d3.layout.chord()
      	.padding(1 / names.length)
      	.sortSubgroups(d3.descending)
      	.sortChords(d3.descending)
      	.matrix(matrix);

    var arc = d3.svg.arc()
      	.innerRadius(innerRadius*1.01)
      	.outerRadius(outerRadius);

    var path = d3.svg.chord()
    	.radius(innerRadius);

	////////////////////////////////////////////////////////////
	////////////////////// Create SVG //////////////////////////
	////////////////////////////////////////////////////////////
	var svg = d3.select("#chordArea").append("svg")
		.attr("id", "chord")
		.attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	    .append("g")
	    .attr("transform", "translate(" + (width / 3 + 2.6 * margin.left) + "," + (height / 3 + 2.4 * margin.top) + ")");

  	////////////////////////////////////////////////////////////
  	////////////////// Draw outer Arcs /////////////////////////
  	////////////////////////////////////////////////////////////
  	var outerArcs = svg.selectAll("g.group")
    	.data(chord.groups())
    	.enter().append("g")
    	.attr("class", "group");

	outerArcs.append("path")
	    .on("mouseover", fade(.1))
	    .on("mouseout", fade(opacityDefault))
	    .on("mouseout", mouseoutChord)
	    .style("fill", function(d) { return colors(d.index); })
	    .style("opacity", 0.8)
	    .attr("id", function(d, i) { return "group" + d.index; })
	    .attr("d", arc);

  	////////////////////////////////////////////////////////////
  	////////////////////// Append names ////////////////////////
  	////////////////////////////////////////////////////////////
  	// outerArcs.append("text")
   //      .attr("x", 6)
   //      .attr("dx", 60)
   //      .attr("dy", 18)
   //      .attr("transform", function(d) {
   //      	return "rotate(" + (getMeanAgle(d) * 180 / Math.PI - 90) + ") translate(" + innerRadius + "," + (-5 - 50 * (d.endAngle - d.startAngle)) + ")";
   //      })
   //      // .append("textPath")
   //      .attr("href", function(d) { return "#group" + d.index;})
   //      .style("fill", "black")
   //      .style("font-size", function(d) { return 9 + 100 * (d.endAngle - d.startAngle); })
   //      .text(function(chords, i){ return names[i]; });

  	////////////////////////////////////////////////////////////
  	////////////////// Draw inner chords ///////////////////////
  	////////////////////////////////////////////////////////////
	svg.append("g")
	    .attr("class", "chord")
	    .selectAll("path")
	    .data(chord.chords)
	    .enter().append("path")
	    .attr("d", path)
	    .style("fill", function(d) {
	    	var result = "";
	    	var sourceIndex = d.source.index;
	    	var targetIndex = d.source.subindex;
	    	var malComp = "";
	    	var vulComp = "";
	    	if (type == "fromMatrix") {
	    		if (flag == "0") {
	    			malComp = packages[Id1] + "." + components[Id1];
	    			vulComp = packages[Id2] + "." + components[Id2];
	    		} else {
	    			return "none";
	    		}
	    	} else {
	    		malComp = packages[sourceIndex] + "." + components[sourceIndex];
	    		vulComp = packages[targetIndex] + "." + components[targetIndex];
	    	}

	    	Object.keys(peattack).forEach(function(key,index) {
    			// key: the name of the object key
    			// index: the ordinal position of the key within the object 
    			if (malComp == key) {
    				Object.keys(peattack[malComp]).forEach(function(key1, index1) {
    					if (vulComp == key1 && sourceIndex !== targetIndex) {
    						// console.log(vulComp)
    						// console.log(sourceIndex)
    						// console.log(targetIndex)
    						result = "#f44242";
    						flag = "1";
    					}
    				})
    			}
			});
			if (result === "")
			{
				Object.keys(isattack).forEach(function(key,index) {
	    			// key: the name of the object key
	    			// index: the ordinal position of the key within the object 
	    			if (malComp == key) {
	    				Object.keys(isattack[malComp]).forEach(function(key1, index1) {
	    					if (vulComp == key1 && sourceIndex !== targetIndex) {
	    						result = "#41b2f4";
	    						flag = "1";
	    					}
	    				})
	    			}
				});
			}
			if (result === "") 
			{
				Object.keys(uaattack).forEach(function(key,index) {
	    			// key: the name of the object key
	    			// index: the ordinal position of the key within the object 
	    			if (malComp == key) {
	    				Object.keys(uaattack[malComp]).forEach(function(key1, index1) {
	    					if (vulComp == key1 && sourceIndex !== targetIndex) {
	    						result = "#a641f4";
	    						flag = "1";
	    					}
	    				})
	    			}
				});
			}
			if (result === "") 
			{
				result = "none";
			}
	    	return result;
	    })
	    .style("opacity", opacityDefault)
	    .on("click", function(d) {
	    	var sourceIndex = d.source.index;
	    	var targetIndex = d.source.subindex;
	    	var malApp = "";
	    	var malComp =  "";
	    	var vulApp = "";
	    	var vulComp =  "";

			if (type == "fromMatrix") {
				malApp = packages[Id1]
				malComp = components[Id1]
				vulApp = packages[Id2]
				vulComp = components[Id2]
			} else {
				malApp = packages[sourceIndex]
	    		malComp =  components[sourceIndex];
	    		vulApp = packages[targetIndex]
	    		vulComp =  components[targetIndex];
			}

	    	var attacktype = "";
	    	var mal = malApp + "." + malComp;
	    	var vul = vulApp + "." + vulComp;

	    	var resource = [];
	    	var pot = [];
	    	Object.keys(peattack).forEach(function(key,index) {
    			// key: the name of the object key
    			// index: the ordinal position of the key within the object 
    			if (mal == key) {
    				Object.keys(peattack[mal]).forEach(function(key1, index1) {
    					if (vul == key1) {
    						resource = peattack[mal][vul];
    						attacktype = "Privilege Escalation Instance";
    					}
    				})
    			}
			});
			Object.keys(isattack).forEach(function(key,index) {
    			// key: the name of the object key
    			// index: the ordinal position of the key within the object 
    			if (mal == key) {
    				Object.keys(isattack[mal]).forEach(function(key1, index1) {
    					if (vul == key1) {
    						pot.push(isattack[mal][vul]);
    						attacktype = "Intent Spoofing Instance";
    					}
    				})
    			}
			});
			if (attacktype === "") 
			{
				Object.keys(uaattack).forEach(function(key,index) {
	    			// key: the name of the object key
	    			// index: the ordinal position of the key within the object 
	    			if (mal == key) {
	    				Object.keys(uaattack[mal]).forEach(function(key1, index1) {
	    					if (vul == key1) {
	    						pot.push(uaattack[mal][vul]);
    							attacktype = "Unauthorized Intent Receipt Instance";
	    					}
	    				})
	    			}
				});
			}
			if (attacktype !== "") 
			{
				// console.log("hello")
				moreDetail(malApp, malComp, vulApp, vulComp, resource, pot, attacktype);
			}
	    });
  
	////////////////////////////////////////////////////////////
  	//////// Draw Super Categories - By Faraz Shuja ////////////
  	////////////////////////////////////////////////////////////
  	//define grouping with colors
  	var colorVal = d3.scale.category20();
    var groups = new Array();
    var slow = 0;
    var fast = 0;
    while (fast < packages.length) {
    	if (packages[fast] == packages[slow]) {
    		fast++;
    	} else {
    		var s = slow;
    		var e = fast - 1;
 			var tempObj = {sIndex: s, eIndex: e, title: packages[s], color: colorVal(s)};
 			groups.push(tempObj);
 			slow = fast;
    	}
    }

  	var cD = chord.groups();
    
  	//draw arcs
  	for(var i=0;i<groups.length;i++) {
	    var __g = groups[i];
	    var arc1 = d3.svg.arc()
	    	.innerRadius(innerRadius*1.11)
	      	.outerRadius(outerRadius*1.1)
	      	.startAngle(cD[__g.sIndex].startAngle) 
	      	.endAngle(cD[__g.eIndex].endAngle);

    	var path = svg.append("path")
    		.attr("d", arc1)
    		.attr('fill', __g.color)
    		.attr('id', 'groupId' + i)
    		// .attr("class", "arcId")
    		.on("mouseover", function() {
	      		svg.selectAll(".arcId")
	      			.style("opacity", 1);
	      	})
	      	.on("mouseout", function() {
	      		svg.selectAll(".arcId")
	      			.style("opacity", 0);
	      	});
    
    	// Add a text label.
    	var text = svg.append("text")
      		.attr("x", 6)
      		.attr("dx", 60)
      		.attr("dy", 10)
      		.attr("class", "arcId")
      		.attr('fill', '#000000')
	      	.attr("xlink:href","#groupId" + i)
	      	.text(__g.title)
	      	.attr("transform", function() {
	      		var d = cD[__g.sIndex].startAngle + (cD[__g.eIndex].endAngle - cD[__g.sIndex].startAngle) / 2;
        		return "rotate(" + (d * 180 / Math.PI - 90) + ") translate(" + innerRadius + "," + (-5 - 50 * (cD[__g.sIndex].endAngle - cD[__g.eIndex].startAngle)) + ")";
        	})
        	.style("opacity", 0);
	}

	// .on("mouseover", function() {
	//       		svg.selectAll("#arcId" + i)
	//       			.style("opacity", 0.2);
	//       	})

  	////////////////////////////////////////////////////////////
  	////////////////// Extra Functions /////////////////////////
  	////////////////////////////////////////////////////////////
	function popup() {
	    return function(d,i) {
	      	console.log("love");
	    };
	}

  	//Returns an event handler for fading a given chord group.
	function fade(opacity) {
	    return function(d,i) {
	      	svg.selectAll(".chord path")
	      		.filter(function(d) { return d.source.index != i && d.target.index != i; })
	      		.transition()
	          	.style("opacity", opacity);
	    };
	}

    //Highlight hovered over chord
  	function mouseoverChord(d,i) {
	    //Decrease opacity to all
	    svg.selectAll("path.chord")
	      	.transition()
	      	.style("opacity", 0.1);
	    //Show hovered over chord with full opacity
	    d3.select(this)
	      	.transition()
	        .style("opacity", 1);

	    //Define and show the tooltip over the mouse location
	    $(this).popover({
	    	//placement: 'auto top',
	      	title: 'test',
	      	placement: 'right',
	      	container: 'body',
	      	animation: false,
	      	offset: "20px -100px",
	      	followMouse: true,
	      	trigger: 'click',
	      	html : true,
	      	content: function() {
	        	return "<p style='font-size: 11px; text-align: center;'><span style='font-weight:900'>"  +
	             	"</span> text <span style='font-weight:900'>"  +
	             	"</span> folgt hier <span style='font-weight:900'>" + "</span> movies </p >"; 
	        }
	    });
	    $(this).popover('show');
	}

  	//Bring all chords back to default opacity
  	function mouseoutChord(d) {
	    //Hide the tooltip
	    $('.popover').each(function() {
	      	$(this).remove();
	    });
	    //Set opacity back to default for all
	    svg.selectAll(".chord path")
	      	.transition()
	      	.style("opacity", opacityDefault);
    }

  	function getMeanAgle(d) {
    	return d.startAngle + (d.endAngle - d.startAngle) / 2;
  	}

}

function getMatrix(matrix) {
	var d = $.Deferred();
	// var matrix = new Array();
	parseXML();
	// file 0
	d3.csv(datasets[0], function(error, csvdata) {
		if (error) {
			console.log(error);
		}
		for (var i = 0; i < csvdata.length; i++) {
			// insert package
			packages.push(csvdata[i].Package);
			// insert component
			components.push(csvdata[i].Component);
			// insert matrix
			var temp = new Array();
			for (var j = 0; j < csvdata.length; j++) {
				temp.push(Number(csvdata[i][j]));
			}
			matrix.push(temp);
		}
	});

	// file 1
	d3.csv(datasets[1], function(error, csvdata) {
		if (error) {
			console.log(error);
		}
		for (var i = 0; i < csvdata.length; i++) {
			for (var j = 0; j < csvdata.length; j++) {
				if (matrix[i][j] == 0 && csvdata[i][j] == 1) {
					matrix[i][j] = 1;
				}
				// if (i == j) {
				// 	matrix[i][j] = 1;
				// }
				if (matrix[j][i] == 1) {
					matrix[i][j] = 1;
				}
				if (matrix[i][j] == 1) {
					matrix[j][i] = 1;
				}
				if (i != j && packages[i] == packages[j]) {
					matrix[i][j] = 0;
				}
			}
		}
	});
	// matrix = processMatrix(matrix)
	// return matrix;
	setTimeout(function() {
    	console.log('1');
    	d.resolve();
  	}, 1000);
  	return d.promise();
}

function processMatrix(matrix) {
	var d = $.Deferred();
	var flags = new Array();
	for (var i = 0; i < matrix.length; i++) {
		var flagThisRow = false;
		for (var j = 0; j < matrix.length; j++) {
			if (flagThisRow) {
				break;
			}
			if (i != j && matrix[i][j] == 1) {
				// Judge if it is malicious
				var mal = packages[i] + "." + components[i];
				var vul = packages[j] + "." + components[j];

				Object.keys(peattack).forEach(function(key,index) {
	    			if (mal == key) {
	    				Object.keys(peattack[mal]).forEach(function(key1, index1) {
	    					if (vul == key1) {
	    						flagThisRow = true;
	    					}
	    				})
	    			}
				});
				if (!flagThisRow) {
					Object.keys(isattack).forEach(function(key,index) {
	    			// key: the name of the object key
	    			// index: the ordinal position of the key within the object
		    			if (mal == key) {
		    				Object.keys(isattack[mal]).forEach(function(key1, index1) {
		    					if (vul == key1) {
		    						flagThisRow = true;
		    					}
		    				})
		    			}
					});					
				}
				if (!flagThisRow) {
					Object.keys(uaattack).forEach(function(key,index) {
						// key: the name of the object key
						// index: the ordinal position of the key within the object 
						if (mal == key) {
							Object.keys(uaattack[mal]).forEach(function(key1, index1) {
								if (vul == key1) {
									flagThisRow = true;
								}
							})
						}
					});			
				}
				var mal = packages[j] + "." + components[j];
				var vul = packages[i] + "." + components[i];
				if (!flagThisRow) {
					Object.keys(peattack).forEach(function(key,index) {
		    			if (mal == key) {
		    				Object.keys(peattack[mal]).forEach(function(key1, index1) {
		    					if (vul == key1) {
		    						flagThisRow = true;
		    					}
		    				})
		    			}
					});
				}
				if (!flagThisRow) {
					Object.keys(isattack).forEach(function(key,index) {
	    			// key: the name of the object key
	    			// index: the ordinal position of the key within the object
		    			if (mal == key) {
		    				Object.keys(isattack[mal]).forEach(function(key1, index1) {
		    					if (vul == key1) {
		    						flagThisRow = true;
		    					}
		    				})
		    			}
					});					
				}
				if (!flagThisRow) {
					Object.keys(uaattack).forEach(function(key,index) {
						// key: the name of the object key
						// index: the ordinal position of the key within the object 
						if (mal == key) {
							Object.keys(uaattack[mal]).forEach(function(key1, index1) {
								if (vul == key1) {
									flagThisRow = true;
								}
							})
						}
					});			
				}
			}
		}
		flags.push(flagThisRow);
	}

	var start = 0;
	var end = 0;

	while (end < packages.length) {
		var exclude = true;
		while (end < packages.length && packages[end] == packages[start]) {
			if (flags[end]) { // If this component is vul
				exclude = false;
			}
			end++;
		}
		if (exclude) {
			excludeApp[start] = end - 1;
		}
		start = end;
	}

	Object.keys(excludeApp).forEach(function(key,index) {
		for (var i = key; i <= excludeApp[key]; i++) {
			for (var j = 0; j < matrix.length; j++) {
				matrix[i][j] = 0;
			}
		}
	});
	setTimeout(function() {
    	console.log('2');
    	d.resolve();
  	}, 1000);
  	return d.promise();
	// return matrix;
}

function parseXML() {
	try //Internet Explorer
	{	
  		xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
  	} 
  	catch(e) {
	  	try //Firefox, Mozilla, Opera, etc.
	    {
	    	xmlDoc=document.implementation.createDocument("","",null);
	    }
  		catch(e) { alert(e.message); }
  	}
	try 
  	{
		xmlDoc.async=false;
		xmlDoc.load("analysisResults-5.xml");
		console.log("xmlDoc is loaded");

		//privilegeEscalationInstances
		var privilegeEscalationInstances = xmlDoc.getElementsByTagName("privilegeEscalationInstances");
		var privilegeEscalationInstance = privilegeEscalationInstances[0].children;
		if (privilegeEscalationInstance.length > 0) {
			for (var i = 0; i < privilegeEscalationInstance.length; i++) {
				var malComp = privilegeEscalationInstance[i].getElementsByTagName("malApp")[0].innerHTML + "." + privilegeEscalationInstance[i].getElementsByTagName("malComp")[0].innerHTML;
				var vulComp = privilegeEscalationInstance[i].getElementsByTagName("vulApp")[0].innerHTML + "." + privilegeEscalationInstance[i].getElementsByTagName("vulComp")[0].innerHTML;
				var resource = privilegeEscalationInstance[i].getElementsByTagName("resource")[0].innerHTML;
				if (peattack.hasOwnProperty(malComp)) {
					if (peattack[malComp].hasOwnProperty(vulComp)) {
						peattack[malComp][vulComp].push(resource);
					} else {
						peattack[malComp][vulComp] = [resource];
					}
				} else {
					peattack[malComp] = {};
					peattack[malComp][vulComp] = [resource];
				}
			}
		}
		// console.log(peattack)

		//intentSpoofingInstances
		var intentSpoofingInstances = xmlDoc.getElementsByTagName("intentSpoofingInstances");
		var intentSpoofingInstance = intentSpoofingInstances[0].children;
		if (intentSpoofingInstance.length > 0) {
			for (var i = 0; i < intentSpoofingInstance.length; i++) {
				var malComp = intentSpoofingInstance[i].getElementsByTagName("malApp")[0].innerHTML + "." + intentSpoofingInstance[i].getElementsByTagName("malComp")[0].innerHTML;
				var vulComp = intentSpoofingInstance[i].getElementsByTagName("vulApp")[0].innerHTML + "." + intentSpoofingInstance[i].getElementsByTagName("vulComp")[0].innerHTML;
				var potApp = intentSpoofingInstance[i].getElementsByTagName("potApp")[0].innerHTML;
				var potComp = intentSpoofingInstance[i].getElementsByTagName("potComp")[0].innerHTML;
				// var potComp = intentSpoofingInstance[i].getElementsByTagName("potApp")[0].innerHTML + "." + intentSpoofingInstance[i].getElementsByTagName("potComp")[0].innerHTML;
				if (isattack.hasOwnProperty(malComp)) {
					if (isattack[malComp].hasOwnProperty(vulComp)) {
						isattack[malComp][vulComp].push([potApp, potComp]);
					} else {
						isattack[malComp][vulComp] = new Array();
						isattack[malComp][vulComp].push([potApp, potComp]);
					}
				} else {
					isattack[malComp] = {};
					isattack[malComp][vulComp] = new Array();
					isattack[malComp][vulComp].push([potApp, potComp]);
				}
			}
		}
		// console.log(isattack)

		//unauthorizedIntentReceiptInstances
		var unauthorizedIntentReceiptInstances = xmlDoc.getElementsByTagName("unauthorizedIntentReceiptInstances");
		var unauthorizedIntentReceiptInstance = unauthorizedIntentReceiptInstances[0].children;
		if (unauthorizedIntentReceiptInstance.length > 0) {
			for (var i = 0; i < unauthorizedIntentReceiptInstance.length; i++) {
				var malComp = unauthorizedIntentReceiptInstance[i].getElementsByTagName("malApp")[0].innerHTML + "." + unauthorizedIntentReceiptInstance[i].getElementsByTagName("malComp")[0].innerHTML;
				var vulComp = unauthorizedIntentReceiptInstance[i].getElementsByTagName("vulApp")[0].innerHTML + "." + unauthorizedIntentReceiptInstance[i].getElementsByTagName("vulComp")[0].innerHTML;
				var potApp = unauthorizedIntentReceiptInstance[i].getElementsByTagName("potApp")[0].innerHTML;
				var potComp = unauthorizedIntentReceiptInstance[i].getElementsByTagName("potComp")[0].innerHTML;
				// var potComp = unauthorizedIntentReceiptInstance[i].getElementsByTagName("potComp")[0].innerHTML + "." + unauthorizedIntentReceiptInstance[i].getElementsByTagName("potComp")[0].innerHTML;
				if (uaattack.hasOwnProperty(malComp)) {
					if (uaattack[malComp].hasOwnProperty(vulComp)) {
						uaattack[malComp][vulComp].push([potApp, potComp]);
					} else {
						uaattack[malComp][vulComp] = new Array();
						uaattack[malComp][vulComp].push([potApp, potComp]);
					}
				} else {
					uaattack[malComp] = {};
					uaattack[malComp][vulComp] = new Array();
					uaattack[malComp][vulComp].push([potApp, potComp]);
				}
			}
		}
		// console.log(uaattack)
  	}
	catch(e) { alert(e.message); }
}

function moreDetail(malApp, malComp, vulApp, vulComp, resource, pot, attacktype) {
	var data = [
		{ title: "Malicious Application: ", info: malApp },
    	{ title: "Malicious Component: ", info: malComp },
    	{ title: "Vulnerable Application: ", info: vulApp },
    	{ title: "Vulnerable Componnet: ", info: vulComp }
	];

	if (attacktype == "Privilege Escalation Instance") {
		for (var i = 0; i < resource.length; i++) {
			var tempResource = { title: "Resource: ", info: resource[i] };
			data.push(tempResource);
		}
	} else {
		var tempPotApp = { title: "Pot Application: ", info: pot[0][0][0] };
		var tempPotComp = { title: "Pot Componnet: " , info: pot[0][0][1] };
		data.push(tempPotApp);
		data.push(tempPotComp);
	}

	var columns = ["title", "info"];

	////////////////////////////////////////////////////////////
	/////////////////// Detail Information /////////////////////
	////////////////////////////////////////////////////////////
	d3.select("#detailTable").remove();
	var table = d3.select("#chordArea")
				.append("table")
				.attr("id", "detailTable"),
        tbody = table.append("tbody");

    var caption = table.append("caption")
    			.text(attacktype);

    // create a row for each object in the data
    var rows = tbody.selectAll("tr")
        .data(data)
        .enter()
        .append("tr");

    // create a cell in each row for each column
    var cells = rows.selectAll("td")
        .data(function(row) {
            return columns.map(function(column) {
                return { column: column, value: row[column] };
            });
        })
        .enter()
        .append("td")
        .html(function(d) { return d.value; });
}
