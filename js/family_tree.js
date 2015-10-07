function buildTree(json) {
    var param = getParameterByName('id');
    json = findRoot(param, json);

  var tree = d3.layout.tree()
    .separation(function() {
      return 0.5;
    })
    .children(function(d) {
      return d.parents;
    })
    .nodeSize([150, 300]);

  // Setup zoom and pan
  var zoom = d3.behavior.zoom()
    .translate([15, window.innerHeight / 2])
    .scale(0.75)
    .scaleExtent([0.1, 1.1])
    .on('zoom', function() {
      svg.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
    });

  var svg = d3.select("#svgtree")
    .call(zoom)
    .append("g");

  var nodes = tree.nodes(json);
  // console.log(nodes);
  var link = svg.selectAll(".link")
    .data(tree.links(nodes))
    .enter().append("path")
    .attr("class", "link")
    .attr("d", elbow);
  var node = svg.selectAll(".node")
    .data(nodes)
    .enter().append("g")
    .attr("class", "node")
    .attr("transform", function(d) {
      return "translate(" + d.y + "," + d.x + ")";
    });

  node
    .append("text")
    .attr("class", "name")
    .attr("x", 8)
    .attr("y", -6)
    .text(fullName)
    .on("click", show);


  node.append("text")
      .attr("x", 8)
      .attr("y", 8)
      .attr("dy", "1.86em")
      .attr("class", "about lifespan")
      .text(printDeath);
  node.append("text")
      .attr("x", 8)
      .attr("y", 8)
      .attr("dy", ".71em")
      .attr("class", "about location")
      .text(printBirth);

  zoom.event(svg.transition().duration(600));
}

function fullName(d) {
  var full_name = d.name.first + " ";
  if (d.name.middle) full_name += d.name.middle + " ";
  if (d.name.maiden) full_name += "(" + d.name.maiden + ")";
  else full_name += d.name.last;
  if (d.name.suffix) full_name += ", " + d.name.suffix;
  return full_name;
}

//Print birth year and location, if present.                                                                          
    var printBirth = function(d) {
	var ans = "";
	if (d.birth && d.birth.year) {
	    ans += "b. " + d.birth.year;
	}
	if (d.birth && d.birth.location_state) {
	    ans += " in " + d.birth.location_state;
	}
	return ans;
    };

var printMarriage = function(d) {
    // console.log(d);
    var ans = "";
    if (d.parent && d.parent.parents_marriage && d.parent.parents_marriage.year) {
	ans += "m. " + d.parent.parents_marriage.year; 

	if (d.parent.parents_marriage.location_state) {
	    ans += " in " + d.parent.parents_marriage.location_state;
	}
    }
    return ans;
}

// Print year of death and location, if present.
var printDeath = function(d) {
    var ans = "";
    if (d.death && d.death.year) {
        ans += "d. " + d.death.year;
    }
    if (d.death && d.death.location_state) {
        ans += " in " + d.death.location_state;
    }
    return ans;
};

function elbow(d, i) {
  return "M" + d.source.y + "," + d.source.x + "H" + d.target.y + "V" + d.target.x + (d.target.children ? "" : "h" + 120);
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function dec2bin(str){
    var dec = parseInt(str, 10);
    return (dec >>> 0).toString(2);
}

function parentExists(json, i) {
    if (typeof json === 'undefined') return false;
    if (typeof json.parents === 'undefined') return false;
    return (typeof json.parents[i] !== 'undefined');
}

function findRoot(param, root) {
    if (param === "" || param === "0") return root;
    var s = dec2bin(param);
    if (isNaN(s) || s.length < 2) return root;

    var json = root;
    for (var i = 1; i < s.length; i++) {
	if (s.charAt(i) == '0' && parentExists(json, 0) && json.parents[0].male) {
	    json = json.parents[0];
	    continue;
	}
	if (s.charAt(i) == '0' && parentExists(json, 1) && json.parents[1].male) {
	    json = json.parents[1];
	    continue;
	}
	if (s.charAt(i) == '1' && parentExists(json, 0) && !json.parents[0].male) {
	    json = json.parents[0];
	    continue;
	}
	if (s.charAt(i) == '1' && parentExists(json, 1) && !json.parents[1].male) {
	    json = json.parents[1];
	    continue;
	}
	// cannont continue so I should bail;
	return root;
    }
    return json;
}
