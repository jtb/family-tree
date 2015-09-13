$ = function(id) {
  return document.getElementById(id);
}

// Show overlay and popup
var show = function(d) {
  if (d3.event.defaultPrevented) return; // click suppresed
  $("overlay").style.display = 'block';
  $("popup").style.display = 'block';
  $("titlename").innerHTML = fullName(d);
  $("birth").innerHTML = printBirthFull(d);
  $("marriage").innerHTML = printMarriageFull(d);
  $("death").innerHTML = printDeathFull(d);

  addPortrait(d);
  addPhotos(d);
  addBios(d);
}

// Hide overlay and popup
var hide = function() {
  $("overlay").style.display = 'none';
  $("popup").style.display = 'none';
  d3.select("#photodiv").selectAll("div").remove();
  d3.select("#biodiv").selectAll("div").remove();
}

var monthNames = ["Offset1", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function addPortrait(d) {
  d3.select("#portrait")
    .style("background-image", function() {
      var url = "data/portraits/";
      if (d.id in portrait) {
        url += portrait[d.id];
      } else {
        if (d.male) {
          url = "img/PortraitMan.jpg";
        } else {
          url = "img/PortraitWoman.jpg";
        }
      }
      return "url('" + url + "')";
    });

}

function addBios(d) {
  if (d.id in bio) {
    var biodata = bio[d.id];
    d3.select("#biodiv")
      .append('div')
      .attr('class', 'title')
      .text("Biography");

    var p = d3.select("#biodiv").append('div')
      .attr('class', 'content')
      .selectAll('p')
      .data(biodata)
      .text(String);

    p.enter()
      .append('p')
      .text(String);

    p.exit()
      .remove();
  }

}

function addPhotos(d) {
  var photodata = {};
  if (d.id in photo) {
    photodata = photo[d.id];

    d3.select("#photodiv")
      .append('div')
      .attr('class', 'title')
      .text("Photos");

    var a = d3.select("#photodiv")
      .append('div')
      .attr('class', 'content')
      .attr("id", "scroll")
      .selectAll('a')
      .data(photodata);

    a.enter()
      .append('a')
      .attr("href", function(d) {
        return "data/photos/" + d;
      })
      .attr("target", "_blank");

    var img = a.append('img')
      .attr("src", function(d) {
        return "data/photos/" + d;
      });

    a.exit().remove();
  }
}

var printIfPresent = function(prefix, field, suffix) {
  if (typeof field === 'undefined') {
    return "";
  }
  return prefix + field + suffix;
};

//Print birth year and location, if present.
function printBirthFull(d) {
  if (d.birth) {
    return printEvent(d.birth, "Born");
  }
  return "";
}

function printDeathFull(d) {
  if (d.death) {
    return printEvent(d.death, "Died");
  }
  return "";
}

function printMarriageFull(d) {
  if (d.parent && d.parent.parents_marriage) {
    return printEvent(d.parent.parents_marriage, "Married on");
  }
  return "";

}

function printEvent(d, event) {
  var ans = "";
  if (d.year) {
    ans += event;
    ans += printIfPresent(" ", monthNames[d.month], "");
    ans += printIfPresent(" ", d.day, ",");
    ans += " " + d.year;

    if (d.location_state) {
      ans += ", in";
      ans += printIfPresent(" ", d.location_city, ",");
      ans += " " + d.location_state + ".";
    }
  }
  return ans;
}
