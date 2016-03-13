/**
 * scrollVis - encapsulates
 * all the code for the visualization
 * using reusable charts pattern:
 * http://bost.ocks.org/mike/chart/
 */
var scrollVis = function() {
  // constants to define the size
  // and margins of the vis area.

  var margin = {top: 15, right: 20, bottom: 50, left: 20}
    var width = 700;
    var height = 520;

  // main svg used for visualization
  var svg = null;

  // d3 selection that will be used
  // for displaying visualizations
  var g = null;

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

    // Quantifies colors for different types of gram staining
    var staining = d3.scale.category10();

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

      // this maps each of our bacteria names to each of our columns
      x.domain(rawData.map(function(d) { return nameShorten(d.Bacteria); }));

      // maps our minimum y value for penicilin and max values to our bar heights
      y.domain([
        d3.min(rawData, function(d) { return d.Penicilin }) / 10, // Since we're using a log scale 
        d3.max(rawData, function(d) { return d.Penicilin })
      ]);

      // colors each bar depending on the ordinal value of staining (positive/negative)
      staining.domain(rawData.map(function(d){return d['Gram Staining']}));

      setupVis(rawData);

      setupSections();

    });
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
  setupVis = function(bacteria) {

    d3.select('g')
        .append('text')
        .attr('class', 'bacteria-title')
        .attr('x', width / 10)
        .attr('y', height / 2)
        .text('Content') 
        .attr('opacity', 1)

        // Setup data
        var dataset = [[1,0], [2,0], [3,0], [4,0], [5,0], [6,0], [7,0], [8,0]];

        // Setup settings for graphic
        var canvas_width = 500;
        var canvas_height = 300;
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
                        .ticks(5);

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
        
        // On click, update with new data
        // "#c, #d, #e, #f, #g, #a, #b, #c2"
        $(document).ready(function() {
          $('.my_button').click(function() {
            alert($(this).val());
          });
        });

        d3.select("#update")
            .on("click", function() {
                console.log("Clicked");
                dataset = [[1,130.81], [2,146.83], [3,164.81], [4,174.61], [5,196.00], [6,220.00], [7,246.94], [8,261.63]];

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
            });
        d3.select("#reset")
            .on("click", function() {
                console.log("Clicked");
                dataset = [[1,0], [2,0], [3,0], [4,0], [5,0], [6,0], [7,0], [8,0]];

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
            });
    };

  /**
   * setupSections - each section is activated
   * by a separate function. Here we associate
   * these functions to the sections based on
   * the section's index.
   *
   */
  setupSections = function() {
    // activateFunctions are called each
    // time the active section changes
    activateFunctions[0] = showTitle;
    activateFunctions[1] = showPenicilin;
    //activateFunctions[2] = showStreptomycin;

    // updateFunctions are called while
    // in a particular section to update
    // the scroll progress in that section.
    // Most sections do not need to be updated
    // for all scrolling and so are set to
    // no-op functions.
    for(var i = 0; i < 2; i++) {
      updateFunctions[i] = function() {};
    }
  };

  /**
   * ACTIVATE FUNCTIONS
   *
   * These will be called their
   * section is scrolled to.
   *
   * General pattern is to ensure
   * all content for the current section
   * is transitioned in, while hiding
   * the content for the previous section
   * as well as the next section (as the
   * user may be scrolling up or down).
   *
   */
  
  function showTitle() {
    g.selectAll(".bacteria-title")
      .transition()
      .duration(600)
      .attr("opacity", 1);

    g.selectAll(".axis")
      .transition()
      .duration(600)
      .attr("opacity", 0);

    g.selectAll(".bar")
      .transition()
      .duration(600)
      .attr("opacity", 0);
  }

  function showPenicilin() {
    console.log(g);
    g.selectAll(".bacteria-title")
      .transition()
      .duration(0)
      .attr("opacity", 0);

    g.selectAll(".axis")
      .transition()
      .duration(600)
      .attr("opacity", 1.0);

    g.selectAll(".bar")
      .transition()
      .duration(600)
      .attr("opacity", 1.0);
  }

  function showFillerTitle() {

  }

  /**
   * UPDATE FUNCTIONS
   *
   * These will be called within a section
   * as the user scrolls through it.
   *
   * We use an immediate transition to
   * update visual elements based on
   * how far the user has scrolled
   *
   */

  /**
   * activate -
   *
   * @param index - index of the activated section
   */
  chart.activate = function(index) {
    activeIndex = index;
    var sign = (activeIndex - lastIndex) < 0 ? -1 : 1;
    var scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
    scrolledSections.forEach(function(i) {
      activateFunctions[i]();
    });
    lastIndex = activeIndex;
  };

  /**
   * update
   *
   * @param index
   * @param progress
   */
  chart.update = function(index, progress) {
    updateFunctions[index](progress);
  };

  // return chart function
  return chart;
};

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
  d3.select("#vis")
    .datum(data)
    .call(plot);

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

    // activate current section
    plot.activate(index);
  });

  scroll.on('progress', function(index, progress){
    plot.update(index, progress);
  });
}

// load data and display
d3.csv("a1-burtin.csv", display);

function type(d) {
  d.Penicilin = +d.Penicilin; // coerces the string to number
  return d;
}

// function to shorten bacteria names
function nameShorten(bacteria) {
    var str = bacteria.split(" "); 
    return str[0].substring(0,1).toUpperCase() + ". " + str[1];
}