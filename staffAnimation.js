
function drawStaff(currSectionIndex) {
    switch(currSectionIndex) {
        case 0:
            console.log("case" + currSectionIndex);
            d3.select('#staffDiv')
                    .append('circle')
                    .attr('id', 'staff')
                    .attr('cx', 10)
                    .attr('cy', 10)
                    .attr('r', 50)
                    .attr('fill', 'red')
                    .attr('opacity', 1);
            break;
        case 1:
            console.log("case" + currSectionIndex);
            break;
        case 2:
            console.log("case" + currSectionIndex);
            break;
        case 3:
            console.log("case" + currSectionIndex);
            break;
        case 4:
            console.log("case" + currSectionIndex);
            break;
        case 5:
            console.log("case" + currSectionIndex);
            break;
        case 6:
            console.log("case" + currSectionIndex);
            break;
        default:
            console.log('damn');
            break;
    }
}