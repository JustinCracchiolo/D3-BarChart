let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
let req = new XMLHttpRequest()

let data 
let values = []

let heightScale 
let xScale 
let xAxisScale 
let yAxisScale 

const width = 800
const height = 500
const padding = 40

const svg = d3.select('svg')

let drawCanvas = () => {
    svg.attr('width', width)
    svg.attr('height', height)
}

let generateScales = () => {
    heightScale = d3.scaleLinear()
                    .domain([0, d3.max(values, (item) => {
                        return item[1]
                    })])
                    //the gdp is the second value in the array at index 1
                    .range([0, height - (2 * padding)])
    
    xScale = d3.scaleLinear()
                .domain([0, values.length-1])
                .range([padding, width - padding])
    
    let datesArray = values.map((item) => {
        return new Date(item[0])
    })
    //make a new array of the dates in the values array and convert it to the correct form of dates

    xAxisScale = d3.scaleTime()
                .domain([d3.min(datesArray), d3.max(datesArray)])
                .range([padding, width - padding])
    
    yAxisScale = d3.scaleLinear()
                .domain([0, d3.max(values, (items) => {
                    return items[1]
                })])
                .range([height - padding, padding])
                //the y axis starts at the top. So you need to push it down
}

let drawBars = () => {

    let tooltip = d3.select('body')
                    .append('div')
                    .attr('id', 'tooltip')
                    .style('visibility', 'hidden')
                    .style('height', 'auto')
                    .style('width', 'auto')

    svg.selectAll('rect')
        .data(values)
        .enter() 
        .append('rect')
        .attr('class', 'bar')
        .attr('width', (width - (2*padding))/values.length)
        .attr('data-date', (item) => {
            return item[0]
        })
        .attr('data-gdp', (item) => {
            return item[1]
        })
        .attr('height', (item) => {
            return heightScale(item[1])
        })
        .attr('x', (item, index) => {
            return xScale(index)
        })
        .attr('y', (item) => {
            return (height-padding) - heightScale(item[1])
        })
        .on('mouseover', (item) => {
            tooltip.transition()
                .style('visibility', 'visible')
            tooltip.text(item[0])

            document.querySelector('#tooltip').setAttribute('data-date', item[0])
        })
        .on('mouseout', (item) => {
            tooltip.transition()
                .style('visibility', 'hidden')
        })

}

let generateAxes = () => {
    let xAxis = d3.axisBottom(xAxisScale)
    svg.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', 'translate(0, '+ (height-padding) +')')

    let yAxis = d3.axisLeft(yAxisScale)
    svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', 'translate(' + padding + ', 0)')
}

req.open('GET', url, true)
//takes 3 arguments: type, url, asynch or not (boolean)
req.onload = () => {
    data = JSON.parse(req.responseText)
    values = data.data
    console.log(values) 
    drawCanvas()
    generateScales()
    drawBars()
    generateAxes()
}
req.send()

