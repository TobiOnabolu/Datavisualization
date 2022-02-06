d3.csv("resources/Kaggle-modified-Suddharshan.csv", function(data){ //this how load our csv into data variable, notice that we dont close function until we are done with data
    const margin = {width: 25, bottom: 50};
    const start = {top: 0, bottom: 500, left: 25, right: 500};


    //clean data, may have to find a way to do it in place
    for (var i = 0; i<data.length; i++) {
        data[i].author = data[i]["Gregory Sward"];
        data[i].rating = parseFloat(data[i]["4.7"]);
        data[i].duration = parseFloat(String(data[i]["6.5 total hours"].split(" ", 1)));
    }



    const max_x = d3.max(data, d => d.duration);
    const min_x = d3.min(data, d => d.duration);
    const max_y = d3.max(data, d => d.rating);
    const min_y = d3.min(data, d => d.rating);



    //create x axis
    var xscale = d3.scaleLinear().range([25, 480]).domain([0, max_x]);
    var x_axis = d3.axisBottom(xscale).ticks(10);
    d3.select("#t2_canvas")
        .append("g")
        .attr("transform", "translate(0, 480)")  //NOTE: the x value should be 0 if u did the scaling correctly
        .call(x_axis);

    //create y axis
    var yscale = d3.scaleLinear().range([0, 480]).domain([max_y+0.1, min_y - 0.2]);
    var y_axis = d3.axisLeft(yscale).ticks(10);
    d3.select("#t2_canvas")
        .append("g")
        .attr("transform", "translate(25, 0)") //The y value should be 0 if you did the scaling correctly
        .call(y_axis);


    //create gridlines
    var x_grid = d3.axisBottom(xscale).tickSize(-480).tickFormat('').ticks(10);
    var y_grid = d3.axisLeft(yscale).tickSize(-480).tickFormat('').ticks(10);
    d3.select("#t2_canvas")
        .append("g")
        .attr("transform", "translate(0, 480)")  //NOTE: the x value should be 0 if u did the scaling correctly
        .call(x_grid);
    d3.select("#t2_canvas")
        .append("g")
        .attr("transform", "translate(25, 0)") //The y value should be 0 if you did the scaling correctly
        .call(y_grid);

  

    //create visulazation
    d3.select("#t2_canvas")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
            .attr("cx", (d) => xscale(d.duration))
            .attr("cy", (d) => yscale(d.rating))
            .attr("r", 5)
            .style("fill", "#69b3a2");


    
});


//TODO Fix x axis to floats
//TODO Add initials to datapoint(more cleaning of data)
//TODO Check whether the way i cleaned data was valid
//TODO refactor into functions and learn scope of vars

