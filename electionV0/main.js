  let data;
  var margin = { top: 10, right: 15, bottom: 20, left: 20 },
    width = 300 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

  // Function to process the CSV data
  d3.csv("summary.csv").then(function(rawData){

    rawData = processChoiceName(rawData);
    // custom sort function to make winner always appear on the left
const categoryOrder = {
    'State Senate': 4,
    'State House of Representatives': 5,
    'US Senate': 2,
    'US House of Representative': 3,
    'Judge, Superior Court':1,
    '': 4  // Ensures any other category comes last
};

rawData.sort(function (a, b) {
    // Get the categories for comparison
    const categoryA = a.category1;
    const categoryB = b.category1;
    
    // Compare the categories based on predefined order
    const categoryComparison = (categoryOrder[categoryA] || categoryOrder['']) - (categoryOrder[categoryB] || categoryOrder['']);
    
    // If categories are the same, sort by percent
    if (categoryComparison === 0) {
        return b.percent - a.percent;
    }
    
    // Otherwise, sort by category
    return categoryComparison;
});



    console.log(rawData);
    var byRace = d3.group(rawData, (d) => d.contest);

    let chartContainer = d3.select("#chartContainer");
    console.log(byRace);

    var raceNamesArray = d3.map(byRace, (d) => d[0]);

    var prevCat;
    byRace.forEach(function (d, i) {
      
      // var prevCat = prevVal

      if (i === 0 || d[0].category1 !== prevCat) {  chartContainer.append("h2")
            .text(d[0].category1)
          .style("display", "flex !important")
            .attr("class", "category-heading");
      }

        const svg = chartContainer
        .append("svg")
        .attr("class", "chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("margin", "20px")
        .append("g")
        .attr("transform", `translate(${margin.left},${-2*margin.bottom})`);

      // svg
      //   .append("g")
      //   .attr("transform", `translate(0,${height})`)
      //   .call(d3.axisBottom(x))
      //   .selectAll("text")
      //   .attr("transform", "translate(-10,0)rotate(-45)")
      //   .style("text-anchor", "end");

      // svg.append("g").call(d3.axisLeft(y));
      const textValue = i;
      console.log(d);
      const raceLabelText = svg.append("text");
      raceLabelText
        .text(d[0].category2)
        .attr("class", "race-label")
        .attr("font-weight","500")
        .attr("transform", function () {
          return "translate(0, " + height + ")";
        });
 

      svg
        .selectAll("mybar")
        .data(d)
        .join("rect")
        .attr("class", "bar")
        .attr("class", function (d, i) {
          if (!i) {
            return "first";
          }
          return "second";
        })
        .attr("z-index", "10")
        .attr("x", function (d, i) {
          if (i == 0) {
            return 0;
          }
          return (width * (100 - d.percent)) / 100;
        })
        .attr("y", function (d, i) {
          return height - margin.bottom * 2;
        })
        .attr("width", function (d, i) {
          return (width * d.percent) / 100;
        })
        .attr("height", 20)
        .attr("fill", function (d, i) {
          // logic to determine color, based on contest name
          if (textValue.includes("Rep")) {
            if (!i) {
              return "#c93135";
            } else {
              return "#edb9ba";
            }
          } else if (textValue.includes("Dem")) {
            if (!i) {
              return "#1475b7";
            } else {
              return "#93bdd9";
            }
          } else if (i) {
            return "#f7e0aa";
          }
          return "#dda34e";
        });

      const percentLabelText = svg
        .selectAll("names")
        .data(d)
        .join("text")
        .text(function (d) {
          return Math.round(d.percent * 10) / 10 + "%";
        })
        // .call(wrapLine, width, 0, 0, 0, 0, 0)
        .attr("class", "name-label")
        .attr("z-index", 1)
        .attr("font-family","Roboto Condensed")
        .attr("font-size", "4rem")
        .attr("font-style","italic")
         .attr("font-weight", 700)
        .attr("transform", function (d, i) {
          if (i) {
            return (
              "translate(" + (width / 2 - 30) + " , " + (height - 38) + ")"
            );
          }
          return "translate(" + (width / 2 - 40) + ", " + (height - 38) + ")";
        })
        .attr("class", function (d, i) {
          if (!i) {
            return "first";
          }
          return "second";
        })
        .attr("opacity", function (d, i) {
          if (!i) {
            return 0.1;
          }
          return 0;
        });
      // .attr("text-anchor", function (d, i) {
      //   if (i) {
      //     return "end";
      //   }
      // });

      const firstNamesLabelText = svg
        .selectAll("names")
        .data(d)
        .join("text")
        .text(function (d) {
          return d.firstName;
        })
        // .call(wrapLine, width, 0, 0, 0, 0, 0)
        .attr("class", "name-label")
        .attr("class", function (d, i) {
          if (!i) {
            return "first";
          }
          return "second";
        })
        // .attr("font-size", "1rem")
        .attr("transform", function (d, i) {
          if (i) {
            return "translate(" + width + " , " + (height - 65) + ")";
          }
          return "translate(0, " + (height - 65) + ")";
        })
        .attr("text-anchor", function (d, i) {
          if (i) {
            return "end";
          }
        });

      const lastNamesLabelText = svg
        .selectAll("names")
        .data(d)
        .join("text")
        .text(function (d) {
          return d.lastName;
        })
        // .call(wrapLine, width, 0, 0, 0, 0, 0)
        .attr("class", "name-label")
        .attr("class", function (d, i) {
          if (!i) {
            return "first";
          }
          return "second";
        })
        .attr("font-size", function (d, i) {
          if (d.lastName.length > 12) {
            return "1.1rem";
          }
          if (d.lastName.length > 9 || d.lastName === "Mangham") {
            return "1.3rem";
          }

          return "1.5rem";
        })
        .attr("transform", function (d, i) {
          if (i) {
            return "translate(" + width + " , " + (height - 40) + ")";
          }
          return "translate(0, " + (height - 40) + ")";
        })
        .attr("text-anchor", function (d, i) {
          if (i) {
            return "end";
          }
        });
      prevCat = d[0].category1;

    });

  });

  function splitCategory(columnValue) {
            const parts = columnValue.split(' - ');
            return {
                category1: parts[0] || '',
                category2: parts[1] || '',
                category3: parts[2] || ''
            };
        }

  function processChoiceName(data) {
    return data.map((d) => {
      console.log(d.choiceName);
      const names = d["choiceName"].split(" ");
      let firstName, lastName;

      if (names.length === 2) {
        firstName = names[0];
        lastName = names[1];
      } else if (names.length > 2) {
        if (names[0].endsWith(".")) {
          firstName = names.slice(0, -1).join(" ");
          lastName = names[names.length - 1];
        } else {
          firstName = names[0];
          lastName = names.slice(1).join(" ");
        }
      } else {
        firstName = names[0];
        lastName = "";
      }
      const categories = splitCategory(d['contest']); // Replace 'column_name' with the actual column name


      return {
        ...d,
        firstName: firstName,
        lastName: lastName,
        firstNameLength: firstName.length,
        lastNameLength: lastName.length,
        category1: categories.category1,
        category2: categories.category2 + " " + categories.category3,
        category3: categories.category3
      };
    });
  }


  function wrapLine(
    text,
    width,
    dyAdjust,
    lineHeightEms,
    lineHeightSquishFactor,
    splitOnHyphen,
    centreVertically
  ) {
    // Use default values for the last three parameters if values are not provided.
    if (!lineHeightEms) lineHeightEms = 1.05;
    if (!lineHeightSquishFactor) lineHeightSquishFactor = 1;
    if (splitOnHyphen == null) splitOnHyphen = true;
    if (centreVertically == null) centreVertically = true;

    text.each(function () {
      var text = d3.select(this),
        x = text.attr("x"),
        y = text.attr("y");

      var words = [];
      text
        .text()
        .split(/\s+/)
        .forEach(function (w) {
          if (splitOnHyphen) {
            var subWords = w.split("-");
            for (var i = 0; i < subWords.length - 1; i++)
              words.push(subWords[i] + "-");
            words.push(subWords[subWords.length - 1] + " ");
          } else {
            words.push(w + " ");
          }
        });

      text.text(null); // Empty the text element

      // `tspan` is the tspan element that is currently being added to
      var tspan = text.append("tspan");

      var line = ""; // The current value of the line
      var prevLine = ""; // The value of the line before the last word (or sub-word) was added
      var nWordsInLine = 0; // Number of words in the line
      for (var i = 0; i < words.length; i++) {
        var word = words[i];
        prevLine = line;
        line = line + word;
        ++nWordsInLine;
        tspan.text(line.trim());
        if (tspan.node().getComputedTextLength() > width && nWordsInLine > 1) {
          // The tspan is too long, and it contains more than one word.
          // Remove the last word and add it to a new tspan.
          tspan.text(prevLine.trim());
          prevLine = "";
          line = word;
          nWordsInLine = 1;
          tspan = text.append("tspan").text(word.trim());
        }
      }

      var tspans = text.selectAll("tspan");

      var h = lineHeightEms;
      // Reduce the line height a bit if there are more than 2 lines.
      if (tspans.size() > 2)
        for (var i = 0; i < tspans.size(); i++) h *= lineHeightSquishFactor;

      tspans.each(function (d, i) {
        // Calculate the y offset (dy) for each tspan so that the vertical centre
        // of the tspans roughly aligns with the text element's y position.
        var dy = i * h + dyAdjust;
        if (centreVertically) dy -= ((tspans.size() - 1) * h) / 2;
        d3.select(this)
          .attr("y", y)
          .attr("x", x)
          .attr("dy", dy + "em");
      });
    });
  }
  // Load data when the component is mounted

