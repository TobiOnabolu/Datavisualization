
//NorthAmerica, SouthAmerica, Whole.
var event_handler = function choose_map(continent){
    var PromiseWrapper = (xhr, d) => new Promise(resolve => xhr(d, (p) => resolve(p)));

    Promise
    .all([
        PromiseWrapper(d3.json, `./resources/${continent}.geojson`),
        PromiseWrapper(d3.csv, `./resources/${continent}.csv`)
    ])
    .then(resolve => {
        create_choro(resolve[0], resolve[1], continent);
    });

}

//initially show whole continent
event_handler.call(1, "Whole");

//display continent buttons
display_continent_buttons();



function show_top5(country_data){
    //delete all prev graphs
    d3.select("g.top10").remove();

    //add all these graphs to 1 big div, that way we can just delete that div if it exists
    var whole_div = d3.select("svg").append("g").attr("class", "top10");

    var bottom5 = ["", "", "", "", ""];
    var top5 = ["", "", "", "", ""];

    
    country_data.sort((a, b) => d3.descending(parseInt(a.properties.data.currentCasesPop), parseInt(b.properties.data.currentCasesPop)));
    console.log(country_data);

    for (let i = 0; i < 5; i++){
        top5[i] = country_data[i].properties.data.country;
    }
    

    console.log(country_data.length);
    let length = country_data.length;
    for(let i = 0, j = length-1; i<5; i++, j--){
        bottom5[i] = country_data[j].properties.data.country;
    }
    


    console.log(top5);
    console.log(bottom5);

    top_div = whole_div.append("g");
    bottom_div = whole_div.append("g");


    display_5(top_div, top5);
    display_5(bottom_div, bottom5);


    //append country name
    whole_div
        .append("text")
        .attr("x", 0)             
        .attr("y", -34)
        .attr("text-anchor", "left")  
        .style("font-size", "22px") 
        .style("text-decoration", "underline")  
        .text(`Countries With Highest Covid Cases Per 1M Pop.`);

    whole_div
        .append("text")
        .attr("x", 525)             
        .attr("y", -34)
        .attr("text-anchor", "left")  
        .style("font-size", "22px") 
        .style("text-decoration", "underline")  
        .text(`Countries With Lowest Covid Cases Per 1M Pop.`);

    whole_div.attr("transform", "translate(20, 1000)");
    bottom_div.attr("transform", "translate(525, 0)");



}


function display_5(top_div, arr){
    top_div.selectAll("text")
        .data(arr)
        .enter()
        .append("text")
        .attr("x", 0)             
        .attr("y", (d,i) => i * 40)
        .attr("text-anchor", "left")  
        .style("font-size", "26px") 
        .text(d => d);

}



//Function to create the choropleth
function create_choro(countries, country_data, continent){
    d3.select("svg").selectAll("*").remove();//removes all elements from svg if they exist

    

    d3.select("svg")
        .append("text")
        .attr("x", 500)             
        .attr("y", 40)
        .attr("text-anchor", "middle")  
        .style("font-size", "32px") 
        .style("text-decoration", "underline")  
        .text(`${continent}`);

    //Make predefined paramter to match the amount of zoom for each continent view
    var value = 205;
    var x = 700;
    var y = 660;

    if (continent == "NorthAmerica") {
        value = 280;
        x =850;
        y = 880;
    }
    else if (continent == "SouthAmerica") {
        value = 500;
        x =1050;
        y = 180;
    }




    var Projection = d3.geoMercator()
        .scale(value)
        .translate([x, y]);
    
    var geoPath = d3.geoPath().projection(Projection)


    //Binding my geojson file with my csv file data
    var binded_data = countries.features;
    binded_data.forEach(geoJsonObject => {
        if(continent == "Whole") {
            var linked_data = country_data.find(d => d.country === geoJsonObject.properties.name)
        }
        else{
            var linked_data = country_data.find(d => d.country === geoJsonObject.properties.admin)
        }
        geoJsonObject.properties.data = linked_data
    })

    //show case countries with highest lowest covid cases per 1 million
    show_top5(binded_data);

    d3.select("svg")
        .selectAll("path")
        .data(binded_data)
        .enter()
        .append("path")
            .attr("class", "countries")
            .attr("d", geoPath)
            .on("mouseover", highlight)
            .on("mouseleave", unhighlight)
            .on("click", show_data)
            .style("fill", (d) => {
                if (parseInt(d.properties.data.currentCases) > parseInt(d.properties.data.previousCases)) return "tomato"; //Number of cases increase
                return "lime";
                
            });

 
    add_legend();
  

}


function show_data(d){
    //delete all prev graphs
    d3.select("g.other_graphs").remove();

    //add all these graphs to 1 big div, that way we can just delete that div if it exists
    var graphs_div = d3.select("svg").append("g").attr("class", "other_graphs");


    console.log(d);
    console.log("Showing Data");
    
    //append country name
    graphs_div
        .append("text")
        .attr("x", 250)             
        .attr("y", -80)
        .attr("text-anchor", "middle")  
        .style("font-size", "32px") 
        .style("text-decoration", "underline")  
        .text(`${d.properties.data.country}`);

    //append the population
    graphs_div
        .append("text")
        .attr("x", 250)             
        .attr("y", -45)
        .attr("text-anchor", "middle")  
        .style("font-size", "18px") 
        .text(`Population: ${parseInt(d.properties.data.population).toLocaleString("en-US")}`);

    
    var bar_div = graphs_div.append("g").attr("class", "bar1");
    var current_cases =  parseInt(d.properties.data.currentCases);
    var previous_cases =  parseInt(d.properties.data.previousCases);
    dataviz(bar_div, current_cases, previous_cases, "This Week", "Previous Week", "Amount of Covid Cases", "Covid Cases Per Week", d.properties.data.currentCasesPop);
    bar_div.attr("transform", "translate(0, 10)")

    var bar_div2 = graphs_div.append("g").attr("class", "bar2");
    var current_cases =  parseInt(d.properties.data.currentDeaths);
    var previous_cases =  parseInt(d.properties.data.previousDeaths);
    dataviz(bar_div2, current_cases, previous_cases, "This Week", "Previous Week", "Amount of Deaths", "Deaths Per Week", d.properties.data.deathPop);
    bar_div2.attr("transform", "translate(0, 160)")



    var pie_svg = graphs_div.append("g").attr("class", "pie1");
    pie_svg.attr("transform", "translate(80, 440)")
    create_pie_chart(pie_svg, parseInt(d.properties.data.changePercentage), "Weekly Covid Cases % Change");

    var pie_svg2 = graphs_div.append("g").attr("class", "pie2");
    pie_svg2.attr("transform", "translate(400, 440)")
    create_pie_chart(pie_svg2, parseInt(d.properties.data.deathChange), "Weekly Death Cases % Change");

    


    graphs_div.attr("transform", "translate(880, 150)");
}

//function to unhighlight countries when moused over
function unhighlight(d){
  d3.selectAll("path.countries")
    .transition()
    .duration(200)
  d3.select(this)
    .transition()
    .duration(200)
    .style("opacity", .5)
    .style("stroke", "black")

}


//function to highlight countries when moused over
function highlight(d){
    d3.selectAll("path.countries")
      .transition()
      .duration(200)
      .style("opacity", .5)
    d3.select(this)
      .transition()
      .duration(200)
      .style("opacity", 1)
      .style("stroke", "black")
    
}

function add_legend(){

    d3.select("svg")
    .insert("g")
    .attr("class", "legend")
    .attr("transform", "translate(-10, 0)")


    var values = [
        {
            class: "tomato",
            text: "Cases have increased from previous week"
        },
        {
            class: "lime",
            text: "Cases have decreased from previous week"

        }

    ];

    for (var i = 0; i < values.length; i++){

        d3.select("g.legend")
            .append("g")
            .attr("class", values[i].class)
            .attr("transform", `translate(20, ${20*i + 20})`);

        d3.select(`g.${values[i].class}`)
            .append("circle")
            .attr("r", 7)
            .style("fill", values[i].class)
            .style("stroke", "black");
        
        d3.select(`g.${values[i].class}`)
            .append("text")
            .attr("transform", `translate(10, 5)`)
            .text(`${values[i].text}`);
    }


}








function dataviz(graphs_div, item1, item2, label1, label2, x_label, title, item3){
    

    //get the max value in marks
    var max_x = item1 > item2 ? item1 : item2;
 
    max_x += (max_x/8);

    //map a proper scale to our data so that it fits in the svg
    var scale_x = d3.scaleLinear().domain([0, max_x]).range([0, 500]);
    
    //create visualiztion
    graphs_div
        .selectAll("rect")  //0 at this moment
        .data([item1, item2])         //binds our amount of element in the array data to the amount of rectangles (if there 10 students then there will be 10 bindings)
        .enter()            //In our bind with data, there is 10 data elemements and 0 rects from our select all, thus enter will fire 10 times 
        .append("rect")
            .attr("width", d => scale_x(parseInt(d)))
            .attr("height", 24)
            .attr("x", 0)
            .attr("y", (d,i) => (i * 32) + 1) //added 1 so 0 is not touching svg
            .style("fill", "teal")
            .style("stroke", "#9A8B7A")
            .style("stroke-width", "1px");


    //create x axis


    var x_axis = d3.axisBottom(scale_x);


    //Question: is it possible to just add the axis label into this g tag?
    graphs_div
        .append("g")
        .attr("transform", "translate(0, 57)") //place the x axis at the bottom of the svg
        .call(x_axis);  //call applies the function x_axis to the selected g tag
 



    //create y axis
    //create a scale that can be passed into d3.axis function
    var yscale = d3.scaleBand()  //need scale band cause were not scaling linearly
            .domain([label1, label2])   //what is actually gonna be displayed
            .range([0, 57]); //how you want it to fit on the screen

    var y_axis = d3.axisLeft(yscale);


    //Question: is it possible to just add the axis label into this g tag?
    graphs_div
        .append("g")
        .attr("transform", "translate(0, 0)") 
        .call(y_axis)  //call applies the function x_axis to the selected g tag
        .selectAll("text") //angle the text so it fits screen
            .style("text-anchor", "end");

    //label
    graphs_div
        .append("text")
        .attr("x", 500/2)             
        .attr("y", 100)
        .attr("text-anchor", "middle")  
        .style("font-size", "12px") 
        .text(x_label);

    //title
    graphs_div
        .append("text")
        .attr("x", 500/2)             
        .attr("y", -15)
        .attr("text-anchor", "middle")  
        .style("font-size", "18px") 
        .style("text-decoration", "underline")  
        .text(title);


    graphs_div
        .append("text")
        .attr("x", scale_x(item1) + 5)             
        .attr("y", 20)
        .attr("text-anchor", "right")  
        .style("font-size", "12px") 
        .text(`${item3} Cases Per 1M Population`);
        
        
}



function create_pie_chart(svg, change, title){


    // set the dimensions and margins of the graph
    var width = 200
        height = 200


    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    var radius = Math.min(width, height) / 2 



    svg
        .attr("width", width)
        .attr("height", height)
    .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


    pos_change = change;
    clr = "tomato";    
    // Create dummy data
    if (change < 0){
        pos_change = change*-1
        clr = "lime"
    } 
    var data = {a: pos_change, b: 100-pos_change}

    // set the color scale
    var color = d3.scaleOrdinal()
    .domain(data)
    .range([clr, "grey"])

    // Compute the position of each group on the pie:
    var pie = d3.pie()
    .value(function(d) {return d.value; })
    var data_ready = pie(d3.entries(data))

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg
    .selectAll('path')
    .data(data_ready)
    .enter()
    .append('path')
    .attr('d', d3.arc()
        .innerRadius(0)
        .outerRadius(radius)
    )
    .attr('fill', function(d){ 

        return(color(d.data.key))
     })
    .attr("stroke", "black")
    .style("stroke-width", "2px")
    .style("opacity", d => {
        if (d.data.key == "b") return 0.2;
        return 0.7;
    })


    //display the actural number in the middle
    svg
        .append("text")
        .attr("x", -40)             
        .attr("y", -40)
        .attr("text-anchor", "middle")  
        .style("font-size", "32px") 
        .text(`${change}%`);


      //title
    svg
      .append("text")
      .attr("x", 0)             
      .attr("y", -120)
      .attr("text-anchor", "middle")  
      .style("font-size", "18px") 
      .style("text-decoration", "underline")  
      .text(title);

}


function display_select_menu(){
    // Create data = list of groups
    var allGroup = ["Countries With Increased Covid Cases", 
                    "Change In Amount Of Covid Cases This Week (%)", 
                    "Covid Cases In The Last 7 Days/1M Population", 
                    "Deaths In The Last 7 Days", 
                    "Deaths In The Last 7 Days/1M Population", 
                    "Death In The Preceeding 7 Days/1M Population", 
                    "Change In Amount Of Deaths This Week (%)", 



                ]

    var slct  = document.createElement("select");
    slct.className = "select";
    document.body.prepend(slct);
    var dropdownButton = d3.select(".select");

    // add the options to the button
    dropdownButton // Add a button
    .selectAll('myOptions') // Next 4 lines add 6 options = 6 colors
        .data(allGroup)
    .enter()
        .append('option')
    .text(function (d) { return d; }) // text showed in the menu
    .attr("value", function (d) { return d; }) // corresponding value returned by the button
}


function display_continent_buttons(){
    var continents = ["SouthAmerica", "NorthAmerica", "Whole"];
    //Add 3 buttons each that create a different choropleth when clicked
    for (var i = 0; i < 3; i++){
        var btn = document.createElement("button");
        btn.innerHTML = continents[i];
        btn.addEventListener('click', event_handler.bind(event, continents[i]));
        document.body.prepend(btn);
    }
}


alert("Directions:\n- Select a button in the top left to choose a different view.\n- Scroll down to see more information on this continent view.\n- Click a country to pull up specific data on it.")
