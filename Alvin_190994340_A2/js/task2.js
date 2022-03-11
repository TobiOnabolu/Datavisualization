

d3.json("./resources/task2.json", create_viz);


function create_viz(data){
    var nested_folders = d3.nest()
    .key(d => d.Folder)
    .entries(data.root);

    var depth_scale = d3.scaleOrdinal().range(["#5EAFC6", "#FE9922", "#93c464"]);
    var scale_boxes = d3.scaleLinear().domain([0,200]).range([1,5]);

    console.log(nested_folders);

    var packed_folders = {key: "All Folders", values: nested_folders};
    var root = d3.hierarchy(packed_folders, d => d.values)
                    .sum(d => d.size ? scale_boxes(d.size): undefined); //change sum to fit size of circles
        
    var partition = d3.partition();
    partition.size([1000,400]);
    


    d3.select("svg.task2")
        .append("g")
        .attr("id", "treeG")
        .attr("transform", "translate(0, 20)")
        .selectAll("g")
        .data(partition(root).descendants())
        .enter()
        .append("g")
            .attr("class", "node2")
            .attr("transform", d => `translate(${d.x0}, ${d.y0})`);


    d3.selectAll("g.node2")
        .append("rect")
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        .style("fill", d => {
            if (d.depth != 2) return depth_scale(d.depth);
            var split = d.data.filename.split(".");
            if (split[1] == "mp4") return "red";
            else if (split[1] == "mp3") return "cyan";
            return depth_scale(d.depth);
            
        })
        .style("stroke", "white")
        .style("stroke", "black");
        

    
    d3.selectAll("g.node2")
        .append("text")
        .style("text-anchor", "middle")
        .attr("transform", d => `translate(${(d.x1 - d.x0)/2}, ${(d.y1 - d.y0)/2}) rotate(90) scale(0.75)`)
        .style("fill", "4f442b")
        .text(d => {
            if (d.data.filename){
                var split = d.data.filename.split(".");
                return split[1];
            } 
            return d.data.Folder || d.data.key
        });

    add_legend2();

    d3.selectAll("svg.task2")
        .append("text")
        .attr("transform", "translate(20,435)")
        .text("The most upper layer represents the whole dataset. The second layer is the data split into 4 folders. The final layer is the files under each folder.")

    
}

function add_legend2(){
    d3.select("svg.task2")
        .insert("g")
        .attr("id", "legend2")
        .attr("transform", "translate(15, 460)");



    d3.select("#legend2")
        .append("g")
        .attr("id", "red_group")  
        .attr("transform", "translate(0, 0)");

    d3.select("#legend2")
        .append("g")
        .attr("id", "blue_group")
        .attr("transform", "translate(0, 30)");

    d3.select("#legend2")
        .append("g")
        .attr("id", "other")
        .attr("transform", "translate(60, 0)");
       

    d3.select("#red_group")
        .append("circle")
        .attr("r", 10)
        .style("fill", "red")
        .style("stroke", "black");

    d3.select("#red_group")
        .append("text")
        .attr("transform", "translate(15, 5)")
        .style("fill", "4f442b")
        .text("mp4");

    d3.select("#blue_group")
        .append("circle")
        .attr("r", 10)
        .style("fill", "cyan")
        .style("stroke", "black");

    d3.select("#blue_group")
        .append("text")
        .attr("transform", "translate(15, 5)")
        .style("fill", "4f442b")
        .text("mp3");

    d3.select("#other")
        .append("circle")
        .attr("r", 10)
        .style("fill", "#93c464")
        .style("stroke", "black");

    d3.select("#other")
        .append("text")
        .attr("transform", "translate(15, 5)")
        .style("fill", "4f442b")
        .text("Other Extensions");
}






