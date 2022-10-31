let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
let req = new XMLHttpRequest()

let width = window.innerWidth/1.5
let height = window.innerHeight/1.5
let padding = window.innerWidth/19


let svg = d3.select('svg')

let dataset

let xScale
let yScale

let drawCanvas = () => {
    svg.attr('width', width)
    svg.attr('height', height)
    document.getElementById("title").setAttribute("x", padding)
    document.getElementById("title").setAttribute("y", padding/2)

}

let generateScales = () => {

    xScale = d3.scaleLinear()
               .domain([d3.min(dataset,(d)=>{
                return d["Year"]-1
                }),
                d3.max(dataset,(d)=>{
                    return d["Year"]+1
                })])
               .range([padding, width-padding])
    yScale = d3.scaleLinear()
               .domain([d3.min(dataset,(d)=>{
                return d["Seconds"]*1000-10000
                }),d3.max(dataset,(d)=>{
                return d["Seconds"]*1000+10000
                })])
               .range([padding, height-padding])

}

let generateAxes = () => {

    let xAxis = d3.axisBottom(xScale)
                  .tickFormat(d3.format('d'))
    let yAxis = d3.axisLeft(yScale)
                  .tickFormat(d3.timeFormat('%M:%S'))
    
    svg.append('g')
       .call(xAxis)
       .attr('id', 'x-axis')
       .attr('transform','translate(0, '+ (height-padding) +')')
       
    svg.append('g')
       .call(yAxis)
       .attr('id', 'y-axis')
       .attr('transform','translate('+ (padding) +','+ 0 + ')')

    svg.append("text")
        .attr('transform','translate('+padding/4 +','+ ((height/2)+25) +') rotate(270)')
        .text("Time in Minutes")

    svg.append("text")
        .text("Year")
        .attr('transform','translate( '+ width/2 +"," +(height-padding/2) +')')
} 

let drawPoints = () => {

    let tooltip = d3.select('body')
                    .append('div')
                    .attr('id','tooltip')
                    .style('position','absolute')
                    .style('visibility','hidden')

    svg.selectAll('circle')
       .data(dataset)
       .enter()
       .append('circle')
       .attr('class','dot')
       .attr('r','7')
       .attr('data-xvalue', (d) => {return d['Year']})
       .attr('data-yvalue', (d) => {return new Date(d['Seconds']*1000)})
       .attr('cx', (d)=>{return xScale(d['Year'])})
       .attr('cy', (d)=>{return yScale(new Date(d['Seconds']*1000))})
       .attr('fill','url(#gradient)')
       .attr('filter', (d)=>{
            if(d['Doping'] != ''){
                return 'brightness(0.5) sepia(1) hue-rotate(-70deg) saturate(5)'
            } else {
                return 'brightness(1) sepia(1) hue-rotate(140deg) saturate(5)'
            }
       })
       .on('mouseover', (event,d)=>{
            tooltip.transition()
                   .style('visibility','visible')
                   .style('left',(event.clientX+15)+'px')
                   .style('top',(event.clientY-15)+'px')
            console.log(new Date(d['Seconds']*1000).toISOString().substring(0))
            tooltip.text("Name: "+d['Name']+ " (" +
                    d['Nationality']+") Year: "+ d['Year']+ " Time: " + new Date(d['Seconds']*1000).toISOString().substring(14,19) +"\n" +d['Doping'])
            document.querySelector('#tooltip').setAttribute('data-year',d['Year'])
       })
       .on('mouseout', ()=>{
            tooltip.transition()
                .style('visibility','hidden')
       })

}

let drawLegend = () => {

    svg.append('text')
        .text('Legend:')
        .attr('id','legend')
        .attr('x',width/1.5)
        .attr('y',height/7)
    
    svg.append('text')
        .text("with doping allegations")
        .attr('x',width/1.38 + 15)
        .attr('y',height/5.25 + 3)

    svg.append('text')
        .text('no doping allegations')
        .attr('x',width/1.38 +15)
        .attr('y',height/4 +3)
                   
    svg.append('circle')
        .attr('r', 8)
        .attr('fill','url(#gradient)')
        .attr('filter','brightness(0.5) sepia(1) hue-rotate(-70deg) saturate(5)')
        .attr('cx',width/1.38)
        .attr('cy',height/5.25)
    svg.append('circle')
        .attr('r',8)
        .attr('fill','url(#gradient)')
        .attr('filter','brightness(1) sepia(1) hue-rotate(140deg) saturate(5)')
        .attr('cx',width/1.38)
        .attr('cy',height/4)
        
}

req.open('GET', url, true)
req.onload = () => {
    dataset = JSON.parse(req.responseText)
    console.log(dataset)
    drawCanvas()
    generateScales()
    generateAxes()
    drawPoints()
    drawLegend()
}
req.send()

window.onresize = function(){ location.reload() }

