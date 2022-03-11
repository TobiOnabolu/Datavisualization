d3.json("./resources/task2.json", create_viz);


function project(x,y){
    var angle = x / 90 * Math.PI;
    var radius  = y
    //return the new x y coordinates
    return [radius * Math.cos(angle), radius * Math.sin(angle)];
}

function create_viz(data){
    var nested_folders = d3.nest()
    .key(d => d.Folder)
    .entries(data.root);

    var depth_scale = d3.scaleOrdinal().range(["#5EAFC6", "#FE9922", "#93c464", "#75739F"]);


    console.log(nested_folders);

    var packed_folders = {key: "All Folder", values: nested_folders};
    var root = d3.hierarchy(packed_folders, d => d.values); //change sum to fit size of circles
        
    var treeChart = d3.tree();
    treeChart.size([200,200]);
    


    d3.select("svg.task2")
        .append("g")
        .attr("id", "treeG")
        .attr("transform", "translate(250, 250)")
        .selectAll("g")
        .data(treeChart(root).descendants())
        .enter()
        .append("g")
            .attr("class", "node2")
            .attr("transform", d => `translate(${project(d.x, d.y)})`);


    d3.selectAll("g.node2")
        .append("circle")
        .attr("r", 10) //can use this to change size after too
        .style("fill", d => depth_scale(d.depth))
        .style("stroke", "white")
        .style("stroke-width", "2px");


    
    d3.selectAll("g.node2")
        .append("text")
        .style("text-anchor", "middle")
        .style("fill", "4f442b")
        .text(d => d.data.filename || d.data.Folder || d.data.key);// make code to extract everything after period if filename

    
    d3.select("#treeG")
        .selectAll("line")
        .data(treeChart(root).descendants().filter(d => d.parent)) //only draw lines from nodes with parents
        .enter()
        .insert("line", "g")
        .attr("x1", d => project(d.parent.x, d.parent.y)[0])
        .attr("y1", d => project(d.parent.x, d.parent.y)[1])
        .attr("x2", d => project(d.x, d.y)[0])
        .attr("y2", d => project(d.x, d.y)[1])
        .style("stroke", "black");
    
        
    
}






