

const margin = {width: 25, bottom: 50};
const border = {top: 0, bottom: 500, left: 0, right: 500};

function dataviz(){
    const data = [
        {Student: 1, marks: 6}, 
        { Student: 2, marks: 100}, 
        { Student: 3, marks: 90}, 
        { Student: 4, marks: 55}, 
        { Student: 5, marks: 83}, 
        { Student: 6, marks: 88}, 
        { Student: 7, marks: 91}, 
        { Student: 8, marks: 92}, 
        { Student: 9, marks: 67}, 
        { Student: 10, marks: 73}];



    //sort data by marks
    data.sort((a, b) => d3.descending(a.marks, b.marks));
    //get the max value in marks
    const max_x = d3.max(data, d => parseInt(d.marks));
    //map a proper scale to our data so that it fits in the svg
    const scale_x = d3.scaleLinear().domain([0, max_x]).range([border.left, border.right - 50]);
    
    //create visualiztion
    d3.select("svg")
        .selectAll("rect")  //0 at this moment
        .data(data)         //binds our amount of element in the array data to the amount of rectangles (if there 10 students then there will be 10 bindings)
        .enter()            //In our bind with data, there is 10 data elemements and 0 rects from our select all, thus enter will fire 10 times 
        .append("rect")
            .attr("width", (d) => scale_x(d.marks))
            .attr("height", 38)
            .attr("x", border.left + margin.width)
            .attr("y", (d,i) => (i * 42) + 1) //added 1 so 0 is not touching svg
            .style("fill", "#FE9922")
            .style("stroke", "#9A8B7A")
            .style("stroke-width", "1px");


    //create x axis

    //create a scale that can be passed into d3.axis function
    var xscale = d3.scaleLinear()
            .domain([0, 100])   //what is actually gonna be displayed
            .range([0, border.right - 50]); //how you want it to fit on the screen

    var x_axis = d3.axisBottom(xscale);


    //Question: is it possible to just add the axis label into this g tag?
    d3.select("svg")
        .append("g")
        .attr("transform", "translate("+ (border.left + margin.width ) +", 416)") //place the x axis at the bottom of the svg
        .call(x_axis);  //call applies the function x_axis to the selected g tag
 



    //create y axis

    var arr = data.map(function(d) { return "Student: " + d.Student; });
  
    //create a scale that can be passed into d3.axis function
    var yscale = d3.scaleBand()  //need scale band cause were not scaling linearly
            .domain(arr)   //what is actually gonna be displayed
            .range([0, 416]); //how you want it to fit on the screen

    var y_axis = d3.axisLeft(yscale);


    //Question: is it possible to just add the axis label into this g tag?
    d3.select("svg")
        .append("g")
        .attr("transform", "translate(25, 0)") 
        .call(y_axis)  //call applies the function x_axis to the selected g tag
        .selectAll("text") //angle the text so it fits screen
            .attr("transform", "translate(-5,-10)rotate(-45)")
            .style("text-anchor", "end");
        
        
}



//Question can we remove by position, or is it just whichever it finds
function remove_least(){
    d3.select("svg")
        .selectAll("rect") //10 rectangles selected
        .data([1,2,3,4,5,6,7])   //have an array of 3 elements to show we want only 7 rectangles remaining in dom
        .exit()
            .remove();
}




dataviz();

//TODO fix scaling of graph
//TODO refactor into functions and learns scoper of vars
