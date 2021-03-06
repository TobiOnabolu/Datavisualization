d3.json("./resources/task1.json", create_viz);


function create_viz(data){

    //color/grade scale for mapping hiearchy
    var color_scale = d3.scaleOrdinal().range(["#5EAFC6", "#a2a2a2"]);
    var grade_scale = d3.scaleLinear().domain([0, 55, 100]).range(["#FF0D0D", "#FAB733", "#69B34C"]);




    //Make the hiearchy of the data by assigning grades to an array called values
    for (var i =0; i < data.Marks.length; i++){
        data.Marks[i] = 
        {student: data.Marks[i].student, 
            values: 
            [{AI: data.Marks[i].AI}, 
            {DB: data.Marks[i].DB}, 
            {CG: data.Marks[i].CG}, 
            {ITP: data.Marks[i].ITP}, 
            {LIT: data.Marks[i].LIT}]};
    }

    //Pack all tweets into hiearchy
    var packed_students = {id: "All Marks", values: data.Marks};
    var packChart = d3.pack();
    packChart.size([480, 480]);
    var root  = d3.hierarchy(packed_students, d => d.values)
        .sum(() => 1);

    packChart.padding(10);

    console.log(packed_students)
    
    //Creat group elements to hold circles and text
    d3.select("svg.task1")
        .append("g")
        .attr("transform", "translate(10,15)")
            .selectAll("g.node")
            .data(packChart(root).descendants())
            .enter()
            .append("g")
                .attr("class", d => {
                    //create a lit class for the lit nodes so they can easily be removed
                    if (d.data.LIT) return "node lit"
                    else return "node";
                })
                .attr("transform", d => `translate(${d.x},${d.y})`);



    //Append circles to group elements
    d3.selectAll("g.node")
        .append("circle")
            .attr("r", d => d.r) //you still have access to the data properties even without calling data here
            .attr("fill", d => {
                //give regular scale for non-grade circles
                if (d.depth != 2){
                    return color_scale(d.depth)
                }
                //give grade color scale
                else{
                    return grade_scale(d.data.AI || d.data.CG || d.data.DB || d.data.ITP || d.data.LIT);
                }
            })
            .style("stroke", "black");
    
            
    //Append text to group elements
    d3.selectAll("g.node")
            .append("text")
            .style("text-anchor", "middle")
            .attr("transform", d => {
                if(d.depth == 1) return `translate(-30, 15) scale(0.85)`;
                return "scale(0.75)";
            })
            .text((d) => {
               if(d.data.AI) return "AI";
               else if (d.data.CG) return "CG";
               else if (d.data.DB) return "DB";
               else if (d.data.ITP) return "ITP";
               else if (d.data.LIT) return "LIT";
               else if (d.data.student) return d.data.student;
               else return "";
            });
  
    
    add_legend();
    

}

function add_legend(){
    var grade_scale = d3.scaleLinear().domain([0, 55, 100]).range(["#FF0D0D", "#FAB733", "#69B34C"]);

    d3.select("svg.task1")
    .insert("g")
    .attr("class", "legend")
    .attr("transform", "translate(-10, -10)")


    var values = [
        {
            class: "redt1",
            scale: 15,
            text: "0-25"
        },
        {
            class: "oranget1",
            scale: 35,
            text: "25-50"
        },
        {
            class: "yellowt1",
            scale: 60,
            text: "50-75"
        },
        {
            class: "greent1",
            scale: 85,
            text: "75-90"
        },
        {
            class: "next_greent1",
            scale: 95,
            text: "90-100"
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
            .style("fill", grade_scale(values[i].scale))
            .style("stroke", "black");
        
        d3.select(`g.${values[i].class}`)
            .append("text")
            .attr("transform", `translate(10, 5)`)
            .text(`${values[i].text}`);
    }


}

//Remove lit courses when pressed
function remove_lit(){
    d3.select("svg.task1")
        .selectAll("g.lit")
        .remove();
}

