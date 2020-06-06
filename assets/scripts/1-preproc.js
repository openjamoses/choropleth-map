"use strict";

/**
 * File to process data from the CSV. 
 */


/**
 * Specifies the domain and the range of colors for the scale to distinguish the political parties. 
 *
 * @param color     Color scale.
 * @param parties   The information to use for the different parties. 
 */
function colorScale(color, parties) {
  // TODO: Specify the domain of the scale in y associating each of the parties passed as parameter
  //       Also, specify the range of colors by specifying the color used for each party. 
  color.domain(parties.map(d => d.name))
  color.range(parties.map(d => d.color))
}

/**
 * Converts each of the number from the CSV file to type "number"
 * @param data      Data from the CSV. 
 */
function convertNumbers(data) {
  // TODO: Convert the properties "id" and "votes" to type "number" for each of the elements in the list
  data.forEach(element => {
    element.id = parseInt(element.id, 10)
    element.votes = parseInt(element.votes, 10)
  });
}

/**
 * Reorganizes the data to combine the results for a given district 
 *
 * @param data      Data from the CSV. 
 * @return {Array}  The reorganized data to usee. The return element must be a table of objects with 338 entries, meaning
 *                  one entry per riding. Each entry must present the results for each candidate in decreasing order (from
 *                  the candidate with the most votes to the one with the least votes). The returned object must look like: 
 *
 *                  [
 *                    {
 *                      id: number              // The number of the district 
 *                      name: string,           // The number of the district 
 *                      results: [              // the table with the results for the candidates
 *                                              // *** This table must be sorted in decreasing order of votes. ***
 *                        {
 *                          candidate: string,  // The name of the candidate
 *                          votes: number,      // The number of votes for the candidate
 *                          percent: string,    // The percentage of votes for the candidate
 *                          party: string       // The political party of the candidate
 *                        },
 *                        ...
 *                      ]
 *                    },
 *                    ...
 *                  ]
 */
function createSources(data) {
  // TODO: Return the object with the format described above. Make sure to sort the table "results" for each entry 
  // in decreasing order of the votes (the winning candidate must be the first element of the table)
  var sortedData = []
  data.forEach(row => {
    var Row = {candidate: row.candidate, votes: row.votes, percent: row.percent, party: row.party}
    var Colum = sortedData.find(obj => obj.id === row.id) 
    if (typeof Colum === 'undefined') {
      Colum = {id: row.id, name: row.name, results: [Row]}
      sortedData.push(Colum)
    } else {
      Colum.results.push(Row)
    }
  })
  sortedData.forEach(circ => circ.results = circ.results.sort((a, b) => d3.descending(a.votes, b.votes)))
  return sortedData
}
