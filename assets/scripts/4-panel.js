"use strict";

/**
 * File to deal with the display of the information panel for a district
 */
/**
 *
 * @param percentString  Percentage in String (last character should be '%').
 * @return               Percentage in Float.
 */
function percentFloat(percentString) {
  return parseFloat(percentString.replace("%", "").replace(",", "."))
 }

/**
 * Update the X and Y domains used by the horizontal bar chart when the data is modified.
 *
 * @param districtSource    The data associated to a district
 * @param x                 The X scale
 * @param y                 The Y scale
 */
function updateDomains(districtSource, x, y) {
  var sortedRes = districtSource.results
  x.domain([percentFloat(sortedRes[sortedRes.length - 1].percent ), percentFloat(sortedRes[0].percent)])
  y.domain(sortedRes.map(res => res.party))
}


/**
 * Update the textual information in the information panel based on the new data
 *
 * @param panel             The D3 element corresponding to the information panel.
 * @param districtSource    The data associated to a district.
 * @param formatNumber      Function to correctly format numbers.
 */
function updatePanelInfo(panel, districtSource, formatNumber) {
  /* TODO: Update the following textual information:
       - The name and number of the district;
       - The name of the winning candidate and his or her party;
       - The total number of votes for all candidates (use the function "formatNumber" to format the number).
   */
  var bestRes = topVoteResult(districtSource.results) // voir 2-map.js pour getBestResult
  panel.select("#district-name").text(districtSource.name + " [" + districtSource.id + "]")             
  panel.select("#elected-candidate").text(bestRes.candidate + " (" + bestRes.party + ")")               
  panel.select("#votes-count").text(formatNumber(d3.sum(districtSource.results.map(res => res.votes))))  
}

/**
 * Met à jour le diagramme à bandes horizontales à partir des nouvelles données de la circonscription sélectionnée.
 * Updates the horizontal bar chart based on the new data from the selected district.
 *
 * @param gBars             The group where the bars should be created.
 * @param gAxis             The group where the Y axis of the graph should be created.
 * @param districtSource    The data associated to a riding.
 * @param x                 The X scale.
 * @param y                 The Y scale.
 * @param yAxis             The Y axis.
 * @param color             The color scale associated to each political party.
 * @param parties           The information to use on the different parties.
 *
 * @see https://bl.ocks.org/hrecht/f84012ee860cb4da66331f18d588eee3
 */
function updatePanelBarChart(gBars, gAxis, districtSource, x, y, yAxis, color, parties) {
     /* TODO: Create or update the graphic according to the following specifications:
       - The number of votes of the candidates must be shown in decreasing order
       - The percentage of votes received by each candidate must be shown to the right of the bar
       - The color of the bar must correspond to the candidate's party. If the party of the candidate is not
         in the domain of the color scale, the bar should be colored in grey
      - The name of the parties must be shown in shortened format. It is possible to obtain the shortened format of a party
        with the list "parties" passed as a parameter. Note that if the party is not in the list "parties", you must
        write "Autre" as the shortened format.
   */
  gBars.selectAll("*").remove()
  gAxis.selectAll("*").remove()

   var otherLabel = "Autre"
   var shortName = function(name) {
     var party = parties.find(p => p.name === name)
     if(typeof party === 'undefined') {
       return otherLabel
     }
     else {
       return party.abbreviation
     }
   }

   gBars.selectAll("rect")
    .data(districtSource.results)
    .enter()
    .append("rect")
    .attr("y", d => y(d.party))
    .style("fill", d => shortName(d.party) === otherLabel ? "grey" : color(d.party))
    .attr("height", y.bandwidth())
    .attr("width", d => x(percentFloat(d.percent)))

   gBars.selectAll(".text")
    .data(districtSource.results)
    .enter()
    .append("text")
    .attr("x", d => x(percentFloat(d.percent)) + 5)
	  .attr("y", d => y(d.party) + y.bandwidth() * 0.64)
	  .text(d => d.percent)

    gAxis.call(yAxis.tickFormat(shortName))

}

/**
 * Reinitialize the map display when the information panel is closed.
 *
 * @param g     The group in which the traces for the circumsciptions is created.
 */
function reset(g) {
  // TODO: Reinitialize the map's display by removing the "selected" class from all elements
  g.selectAll(".selected").classed("selected", false)
}
