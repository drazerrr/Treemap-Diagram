const url = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json';

const width = 1200; // width of svg and treemap
const height = 500; // height of svg and treemap

const req = new XMLHttpRequest();
const legendData = [{'category' : 'Action', 'x': 0, 'y': 0}, {'category' : 'Adventure', 'x': 1, 'y': 0}, {'category' : 'Comedy', 'x': 2, 'y': 0}, {'category' : 'Drama', 'x': 0, 'y': 1}, {'category' : 'Animation', 'x': 1, 'y': 1}, {'category' : 'Family', 'x': 2, 'y': 1}, {'category' : 'Biography', 'x': 0, 'y': 2}];

req.open('GET', url, true); // async request

req.send();

req.onload = () => {
    let data = JSON.parse(req.responseText); // fetch data and make javaScript Object Notation

    let hierarchy = d3.hierarchy(data, (node) => {
        return node['children']
    }).sum((node) => {
        return node['value']
    }).sort((node1, node2) => {
        return node2['value'] - node1['value']
    }) // make data in hierarchy form and sum total value for each element size and sort it for align data bigger to lower
    
    const treeMap = d3.treemap()
                      .size([width, height]); // give size of treemap equal to svg
     
      treeMap(hierarchy);

      const tooltip = d3.select('main')
                  .append('div')
                  .attr('id', 'tooltip'); // tooltip
      
      let svg = d3.select('main')
                  .append('svg')
                  .attr('width', width)
                  .attr('height', height); // append svg element in main element
                            

        const map =  svg.selectAll('g')
            .data(hierarchy.leaves())
            .enter()
            .append('g')
            .attr('transform', (d) => {
               return 'translate(' + d.x0 + ', '+ d.y0 +')'
            }); // append g in treemap 


        const rect = map.append('rect')
           .attr('class', 'tile')
           .attr('width', (d) => d.x1 - d.x0)
           .attr('height', (d) => d.y1 - d.y0)
           .attr('fill', (d) => {
            return d.data.category === 'Action' ? '#3ba0ff' : d.data.category === 'Adventure' ? '#91fa28' : d.data.category === 'Comedy' ? '#7928fa' : d.data.category === 'Drama' ? '#ff8336' : d.data.category === 'Animation' ? '#14fa1f' : d.data.category === 'Family' ? '#d414fa' : '#fa145d' 
           })
           .attr('data-name', (d) => d.data.name)
           .attr('data-category', (d) => d.data.category)
           .attr('data-value', (d) => d.data.value)
           .on('mouseover', (e, d) => {

            d3.select('#tooltip')
              .style('opacity', 0.85)
              .style('left', e.pageX + 6 + 'px')
              .style('top', e.pageY + 'px')
              .html(`<p>Name: ${d.data.name}</p><p>Category: ${d.data.category}</p><p>Value: ${d.data.value}</p>`)
              .attr('data-value', d.data.value)
           })
           .on('mouseout', () => {
            return d3.select('#tooltip')
                     .style('opacity', 0)
                     .style('left', 0)
                     .style('top', 0)
           }) // create rect in treemap and give color and width and height set set mouseover

            map.append('text')
               .text((d) => d.data.name)
               .attr('x', 5)
               .attr('y', 20); // append text in treemap and give data of movie name       

            const legend = d3.select('main')
                             .append('div')
                             .attr('id', 'legend'); // create legend div


              const legendSvg =  legend.append('svg')
                                       .attr('width', 500)
                                       .attr('height', 200); // create svg for legend
                         
                       xScale = d3.scaleLinear()
                                  .domain([0, 3])
                                  .range([0, 500]); // X scale for legend
                       
                       yScale = d3.scaleLinear()
                                  .domain([0, 3])
                                  .range([0, 200]);           // y scale for legend


                 legendSvg.selectAll('rect')
                          .data(legendData)
                          .enter()
                          .append('rect')
                          .attr('class', 'legend-item')
                          .attr('width', 16)
                          .attr('height', 16)
                          .attr('x', (d, i) => xScale(d.x))
                          .attr('y', (d, i) => yScale(d.y))
                          .attr('fill', (d) => {
                            return d.category === 'Action' ? '#3ba0ff' : d.category === 'Adventure' ? '#91fa28' : d.category === 'Comedy' ? '#7928fa' : d.category === 'Drama' ? '#ff8336' : d.category === 'Animation' ? '#14fa1f' : d.category === 'Family' ? '#d414fa' : '#fa145d' 
                           }); // create rect for every category and fill the color category wise

                 legendSvg.selectAll('text')
                          .data(legendData)
                          .enter()
                          .append('text')
                          .text((d) => d.category)
                          .attr('x', (d) => xScale(d.x + 0.2))
                          .attr('y', (d) => yScale(d.y + 0.23)); // every rect after text of category          

}
