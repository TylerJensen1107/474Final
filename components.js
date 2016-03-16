$(document).ready(function() {
  var margin = {top: 15, right: 20, bottom: 20, left: 20};
  var width = 1500;
  var height = 750;

  // main svg used for visualization
  var svg = null;

  // d3 selection that will be used
  // for displaying visualizations
  var g = null;

  d3.select('g')
      .append('text')
      .attr('class', 'bacteria-title')
      .attr('x', width / 10)
      .attr('y', height / 2)
      .text('Content') 
      .attr('opacity', 1)

  // Setup data
  var dataset = [[1,0], [2,0], [3,0], [4,0], [5,0], [6,0], [7,0], [8,0], [9,0], [10,0]];

  // Setup settings for graphic
  var canvas_width = 800;
  var canvas_height = 400;
  var padding = 30;  // for chart edges

  // Create scale functions
  var xScale = d3.scale.linear()  // xScale is width of graphic
                  .domain([0, d3.max(dataset, function(d) {
                      return d[0];  // input domain
                  })])
                  .range([padding, canvas_width - padding * 2]); // output range

  var yScale = d3.scale.linear()  // yScale is height of graphic
                  .domain([0, d3.max(dataset, function(d) {
                      return d[1];  // input domain
                  })])
                  .range([canvas_height - padding, padding]);  // remember y starts on top going down so we flip

  // Define X axis
  var xAxis = d3.svg.axis()
                  .scale(xScale)
                  .orient("bottom")
                  .ticks(10);

  // Define Y axis
  var yAxis = d3.svg.axis()
                  .scale(yScale)
                  .orient("left")
                  .ticks(5);

  // Create SVG element
  var svg = d3.select("h3")  // This is where we put our vis
      .append("svg")
      .attr("width", canvas_width)
      .attr("height", canvas_height)

  // Create Circles
  svg.selectAll("circle")
      .data(dataset)
      .enter()
      .append("circle")  // Add circle svg
      .attr("cx", function(d) {
          return xScale(d[0]);  // Circle's X
      })
      .attr("cy", function(d) {  // Circle's Y
          return yScale(d[1]);
      })
      .attr("r", 2);  // radius

  // Add to X axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (canvas_height - padding) +")")
      .call(xAxis);

  // Add to Y axis
  svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + padding +",0)")
      .call(yAxis);

  xScale.domain([0, d3.max(dataset, function(d) {
      return d[0]; })]);
  yScale.domain([0, d3.max(dataset, function(d) {
      return d[1]; })]);

  // Update circles
  svg.selectAll("circle")
      .data(dataset)  // Update with new data
      .transition()  // Transition from old to new
      .duration(500)  // Length of animation
      .each("start", function() {  // Start animation
          d3.select(this)  // 'this' means the current element
              .attr("fill", "red")  // Change color
              .attr("r", 5);  // Change size
      })
      .delay(function(d, i) {
          return i / dataset.length * 500;  // Dynamic delay (i.e. each item delays a little longer)
      })
      //.ease("linear")  // Transition easing - default 'variable' (i.e. has acceleration), also: 'circle', 'elastic', 'bounce', 'linear'
      .attr("cx", function(d) {
          return xScale(d[0]);  // Circle's X
      })
      .attr("cy", function(d) {
          return yScale(d[1]);  // Circle's Y
      })
      .each("end", function() {  // End animation
          d3.select(this)  // 'this' means the current element
              .transition()
              .duration(500)
              .attr("fill", "black")  // Change color
              .attr("r", 2);  // Change radius
      });

  // Update X Axis
  svg.select(".x.axis")
      .transition()
      .duration(1000)
      .call(xAxis);

  // Update Y Axis
  svg.select(".y.axis")
      .transition()
      .duration(100)
      .call(yAxis);

  /**
   * scrollVis - encapsulates
   * all the code for the visualization
   * using reusable charts pattern:
   * http://bost.ocks.org/mike/chart/
   */
  var scrollVis = function() {
    // Keep track of which visualization
    // we are on and which was the last
    // index activated. When user scrolls
    // quickly, we want to call all the
    // activate functions that they pass.
    var lastIndex = -1;
    var activeIndex = 0;

    // Sizing for the grid visualization
    var squareSize = 6;
    var squarePad = 2;
    var numPerRow = width / (squareSize + squarePad);


      // set margins and width/height of parent chart
      // Makes a log scale of our data (as we know is slightly skewed)
      // Maps our data values -> bar height
      var y = d3.scale.log()
                  .range([height, margin.top + margin.bottom]);

      // Allows us to map each ordinal value to a particular column
      // Maps our ordinal bacteria names -> column
      var x = d3.scale.ordinal()
                  .rangeBands([margin.left, width], 0.225);

      // Initializes our x-axis and adds it to the bottom of the chart
      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");

      // Initializes our y-axis and adds it to the left of the chart
      // Adds tick marks for our values in increments of 10x
      var yAxis = d3.svg.axis()
          .scale(y)
          .ticks(10, " ")
          .orient('left');

    // When scrolling to a new section
    // the activation function for that
    // section is called.
    var activateFunctions = [];
    // If a section has an update function
    // then it is called while scrolling
    // through the section with the current
    // progress through the section.
    var updateFunctions = [];
  };

  /**
   * chart
   *
   * @param selection - the current d3 selection(s)
   *  to draw the visualization in. For this
   *  example, we will be drawing it in #vis
   */
  var chart = function(selection) {
    selection.each(function(rawData) {

      // create svg and give it a width and height
      svg = d3.select(this).selectAll("svg").data(rawData);
      svg.enter().append("svg").append("g");

      svg.attr("width", width + margin.left + margin.right);
      svg.attr("height", height + margin.top + margin.bottom);

      // this group element will be used to contain all
      // other elements.
      g = svg.select("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var barWidth = (width - 50) / rawData.length;

      setupVis(dataset);

    });

  /**
   * activate -
   *
   * @param index - index of the activated section
   */
  chart.activate = function(index) {
    activeIndex = index;
    var sign = (activeIndex - lastIndex) < 0 ? -1 : 1;
    var scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
    // scrolledSections.forEach(function(i) {
    //   activateFunctions[i];
    // });
    lastIndex = activeIndex;
  };

  return chart;
};

  /**
   * setupVis - creates initial elements for all
   * sections of the visualization.
   *
   * @param wordData - data object for each word.
   * @param fillerCounts - nested data that includes
   *  element for each filler word type.
   * @param histData - binned histogram data
   */
  function setupVis(dataset) {
    console.log("Clicked");
    // dataset = [[1,130.81], [2,146.83], [3,164.81], [4,174.61], [5,196.00], [6,220.00], [7,246.94], [8,261.63]];

    // Update scale domains
    xScale.domain([0, d3.max(dataset, function(d) {
        return d[0]; })]);
    yScale.domain([0, d3.max(dataset, function(d) {
        return d[1]; })]);

    // Update circles
    svg.selectAll("circle")
        .data(dataset)  // Update with new data
        .transition()  // Transition from old to new
        .duration(1000)  // Length of animation
        .each("start", function() {  // Start animation
            d3.select(this)  // 'this' means the current element
                .attr("fill", "red")  // Change color
                .attr("r", 5);  // Change size
        })
        .delay(function(d, i) {
            return i / dataset.length * 500;  // Dynamic delay (i.e. each item delays a little longer)
        })
        //.ease("linear")  // Transition easing - default 'variable' (i.e. has acceleration), also: 'circle', 'elastic', 'bounce', 'linear'
        .attr("cx", function(d) {
            return xScale(d[0]);  // Circle's X
        })
        .attr("cy", function(d) {
            return yScale(d[1]);  // Circle's Y
        })
        .each("end", function() {  // End animation
            d3.select(this)  // 'this' means the current element
                .transition()
                .duration(500)
                .attr("fill", "black")  // Change color
                .attr("r", 2);  // Change radius
        });

        // Update X Axis
        svg.select(".x.axis")
            .transition()
            .duration(1000)
            .call(xAxis);

        // Update Y Axis
        svg.select(".y.axis")
            .transition()
            .duration(100)
            .call(yAxis);
  }

  /**
   * display - called once data
   * has been loaded.
   * sets up the scroller and
   * displays the visualization.
   *
   * @param data - loaded tsv data
   */
  function display(data) {
    // create a new plot and
    // display it
    console.log(data);
    var plot = scrollVis();
    // d3.select("#vis")
    //   .datum(data)
    //   .call(plot);

    // setup scroll functionality
    var scroll = scroller()
      .container(d3.select('#graphic'));

    // pass in .step selection as the steps
    scroll(d3.selectAll('.step'));

    // setup event handling
    scroll.on('active', function(index) {
      // highlight current step text
      d3.selectAll('.step')
        .style('opacity',  function(d,i) { return i == index ? 1 : 0.1; });
        console.log("Hey2");
      // activate current section
      plot.activate(index);
    });

    // scroll.on('progress', function(index, progress){
    //   plot.update(index, progress);
    // });
  }

  // load data and display
  d3.csv("a1-burtin.csv", display);

  function type(d) {
    d.Penicilin = +d.Penicilin; // coerces the string to number
    return d;
  }

/////////////////////////
  var context = new AudioContext();
  pressed_keys = {};
  oscillators = {};
  gains = {};

  for(var i = 0; i < 10; i++) {
      var vco = context.createOscillator();
      vco.type = vco.SINE;
      vco.frequency.value = 0;
      vco.start(0);
      oscillators[i] = vco;
  }

  for(var i = 0; i < 10; i++) {
      var vca = context.createGain();
      vca.gain.value = 0;
      

      /* Connections */
      oscillators[i].connect(vca);
      vca.connect(context.destination);
      vca.gain.value = 0;

      gains[i] = vca;
  }

  var chords = ["I", "ii", "iii", "IV", "V", "vi"];

  var frequencyOf = {0 : 130.81,
                  1: 146.83,
                  2: 164.81,
                  3: 174.61,
                  4: 196.00,
                  5: 220.00,
                  6: 246.94,
                  7: 261.63,
                  8: 293.66,
                  9: 329.63
              };

  var isEmpty = function(obj) {
    return Object.keys(obj).length === 0;
  }

  function playNote(note, frequency) {
      console.log(note);
    oscillators[note].frequency.value = frequency;
    gains[note].gain.value = 1;
    pressed_keys[note] = true;
  }

  function stopNote(note, _) {
    delete pressed_keys[note];
    gains[note].gain.value = 0;
  }

  function keyListener(event){ 
      event = event || window.event; 
      var key = event.key || event.which || event.keyCode;
      console.log(key);
  }

  chart.activate = function(index) {
    activeIndex = index;
    var sign = (activeIndex - lastIndex) < 0 ? -1 : 1;
    var scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
    scrolledSections.forEach(function(i) {
      //activateFunctions[i]();
    });
    lastIndex = activeIndex;
  };

  document.onkeydown = function(e){
      e = e || window.event;
      var key = e.which || e.keyCode;
      var numKey = key - 49;

      if (key >= 49 && key <= 57) {
          actOnKey(numKey);
          var keyFreq = frequencyOf[numKey];

          // Check if the key is already selected
          if (dataset[numKey][1] > 0) {
            dataset[numKey] = [numKey + 1, 0];
            setupVis(dataset);
          } else if (dataset[numKey][1] == 0) {
            dataset[numKey] = [numKey + 1, keyFreq];
            setupVis(dataset);
          }
      } else if (key == 48) {
          actOnKey(9);
          numKey = 9;
          // Check if the key is already selected
          if (dataset[numKey][1] > 0) {
            dataset[numKey] = [numKey + 1, 0];
            setupVis(dataset);
          } else if (dataset[numKey][1] == 0) {
            dataset[numKey] = [numKey + 1, keyFreq];
            setupVis(dataset);
          }
      }
  }

  function actOnKey(key) { 
      console.log('key:'+key);

      if(!pressed_keys[key])
          playNote(key, frequencyOf[key]);
      else
          stopNote(key);

      console.log(pressed_keys);
      checkChord();

      //activate key on ui
      $('#note'+key).toggleClass('active');
  }


  function checkChord() {

    for(var i = 0; i < 8; i++) {
        if(pressed_keys[i]) {
            var triad = false;
            for(var j = 1; j < 3; j++) {
                if((pressed_keys[i % 7] || pressed_keys[i]) && (pressed_keys[(i + j*2) % 7] || pressed_keys[i + j*2]) && j == 2 && triad) {
                    console.log(i + ' ' + j + ' ' + pressed_keys);
                    console.log(chords[i] + "CHORD");
                    $('#chord').html(chords[i]);
                    return;
                }
                if((pressed_keys[i % 7] || pressed_keys[i]) && (pressed_keys[(i + j*2) % 7] || pressed_keys[i + j*2]))  triad = true;
            }
        }
    }
    $('#chord').html("chord");
}
});